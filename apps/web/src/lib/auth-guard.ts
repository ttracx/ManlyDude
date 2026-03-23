import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import type { SubscriptionTier, UserProfile } from '@manlydude/shared';

/** Authenticated user context returned by the auth guard */
export interface AuthContext {
  userId: string;
  profile: UserProfile;
}

/** Verify the caller is authenticated and return their profile */
export async function requireAuth(): Promise<AuthContext | NextResponse> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (!profile) {
    return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
  }

  return { userId: user.id, profile: profile as UserProfile };
}

/** Check if the user has at least the required subscription tier */
export function requireTier(
  profile: UserProfile,
  requiredTier: SubscriptionTier,
): NextResponse | null {
  const tierRank: Record<SubscriptionTier, number> = {
    free: 0,
    plus: 1,
    premium: 2,
  };

  if (tierRank[profile.subscription_tier] < tierRank[requiredTier]) {
    return NextResponse.json(
      {
        error: 'Upgrade required',
        required_tier: requiredTier,
        current_tier: profile.subscription_tier,
      },
      { status: 403 },
    );
  }

  return null;
}
