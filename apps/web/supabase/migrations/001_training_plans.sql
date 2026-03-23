-- ============================================================
-- ManlyDude: AI Training Plans Migration
-- ============================================================

-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- ============================================================
-- User profiles table
-- ============================================================
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  full_name text,
  avatar_url text,
  subscription_tier text not null default 'free'
    check (subscription_tier in ('free', 'plus', 'premium')),
  fitness_goal text
    check (fitness_goal in ('muscle_gain', 'fat_loss', 'strength', 'endurance', 'general_fitness', 'sport_performance')),
  experience_level text
    check (experience_level in ('beginner', 'intermediate', 'advanced', 'elite')),
  age integer check (age > 0 and age < 120),
  weight_kg numeric(5,2) check (weight_kg > 0),
  height_cm numeric(5,2) check (height_cm > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- RLS for profiles
alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- ============================================================
-- Training plans table
-- ============================================================
create table if not exists public.training_plans (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  description text not null default '',
  goal text not null
    check (goal in ('muscle_gain', 'fat_loss', 'strength', 'endurance', 'general_fitness', 'sport_performance')),
  experience_level text not null
    check (experience_level in ('beginner', 'intermediate', 'advanced', 'elite')),
  frequency integer not null check (frequency in (3, 4, 5, 6)),
  equipment text not null
    check (equipment in ('full_gym', 'home_gym', 'dumbbells_only', 'bodyweight', 'resistance_bands')),
  duration_weeks integer not null check (duration_weeks in (4, 8, 12)),
  status text not null default 'active'
    check (status in ('active', 'paused', 'completed', 'archived')),
  generation_status text not null default 'pending'
    check (generation_status in ('pending', 'generating', 'completed', 'failed')),
  generation_error text,
  weeks jsonb not null default '[]'::jsonb,
  coach_intro text,
  tier_at_creation text not null default 'plus'
    check (tier_at_creation in ('free', 'plus', 'premium')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  started_at timestamptz,
  completed_at timestamptz
);

-- Indexes
create index if not exists training_plans_user_id_idx on public.training_plans(user_id);
create index if not exists training_plans_status_idx on public.training_plans(status);
create index if not exists training_plans_created_at_idx on public.training_plans(created_at desc);

-- RLS for training_plans
alter table public.training_plans enable row level security;

create policy "Users can view own training plans"
  on public.training_plans for select
  using (auth.uid() = user_id);

create policy "Users can insert own training plans"
  on public.training_plans for insert
  with check (auth.uid() = user_id);

create policy "Users can update own training plans"
  on public.training_plans for update
  using (auth.uid() = user_id);

create policy "Users can delete own training plans"
  on public.training_plans for delete
  using (auth.uid() = user_id);

-- ============================================================
-- Updated_at trigger
-- ============================================================
create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger handle_training_plans_updated_at
  before update on public.training_plans
  for each row execute procedure public.handle_updated_at();

create trigger handle_profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.handle_updated_at();

-- ============================================================
-- Auto-create profile on user signup
-- ============================================================
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
