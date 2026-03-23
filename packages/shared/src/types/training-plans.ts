/**
 * Training plan types for ManlyDude fitness app.
 * Used across mobile and web applications.
 */

/** Subscription tier that gates feature access */
export type SubscriptionTier = 'free' | 'plus' | 'premium';

/** Fitness goal type for AI plan generation */
export type FitnessGoal =
  | 'muscle_gain'
  | 'fat_loss'
  | 'strength'
  | 'endurance'
  | 'general_fitness'
  | 'sport_performance';

/** Experience level for plan difficulty calibration */
export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced' | 'elite';

/** Training frequency options (days per week) */
export type TrainingFrequency = 3 | 4 | 5 | 6;

/** Equipment availability for plan generation */
export type EquipmentType =
  | 'full_gym'
  | 'home_gym'
  | 'dumbbells_only'
  | 'bodyweight'
  | 'resistance_bands';

/** Status of a training plan */
export type TrainingPlanStatus = 'active' | 'paused' | 'completed' | 'archived';

/** AI generation status */
export type GenerationStatus = 'pending' | 'generating' | 'completed' | 'failed';

/** A single set within a workout exercise */
export interface WorkoutSet {
  /** Set number (1-indexed) */
  set_number: number;
  /** Target reps */
  reps: number | null;
  /** Target weight in kg */
  weight_kg: number | null;
  /** Target duration in seconds (for timed sets) */
  duration_seconds: number | null;
  /** Rest period after this set in seconds */
  rest_seconds: number;
  /** RPE target (1-10 scale) */
  rpe_target: number | null;
  /** Whether this is a warmup set */
  is_warmup: boolean;
}

/** An exercise within a training plan day */
export interface PlanExercise {
  /** Unique ID */
  id: string;
  /** Reference to exercise library ID */
  exercise_id: string;
  /** Exercise name (denormalized for display) */
  exercise_name: string;
  /** Order within the workout */
  order_index: number;
  /** Sets configuration */
  sets: WorkoutSet[];
  /** Notes from AI coach */
  coaching_notes: string | null;
  /** Superset group ID (null if not in superset) */
  superset_group: string | null;
  /** Tempo notation (e.g. "3-1-2-0") */
  tempo: string | null;
}

/** A single training day within a week */
export interface TrainingDay {
  /** Day name (e.g. "Monday", "Day 1") */
  name: string;
  /** Day number within the week (1-7) */
  day_number: number;
  /** Whether this is a rest day */
  is_rest_day: boolean;
  /** Muscle groups targeted */
  focus: string[];
  /** Estimated workout duration in minutes */
  estimated_duration_minutes: number;
  /** Exercises for this day */
  exercises: PlanExercise[];
  /** Warmup instructions */
  warmup_notes: string | null;
  /** Cooldown instructions */
  cooldown_notes: string | null;
}

/** A weekly training block */
export interface TrainingWeek {
  /** Week number (1-indexed) */
  week_number: number;
  /** Focus/theme for the week */
  focus: string;
  /** Days in this week */
  days: TrainingDay[];
  /** Weekly coaching notes */
  coaching_notes: string | null;
}

/** Full AI-generated training plan */
export interface TrainingPlan {
  /** Supabase UUID */
  id: string;
  /** Owner user ID */
  user_id: string;
  /** Plan display name */
  name: string;
  /** AI-generated description */
  description: string;
  /** Fitness goal */
  goal: FitnessGoal;
  /** Experience level */
  experience_level: ExperienceLevel;
  /** Days per week */
  frequency: TrainingFrequency;
  /** Equipment available */
  equipment: EquipmentType;
  /** Plan duration in weeks */
  duration_weeks: number;
  /** Current status */
  status: TrainingPlanStatus;
  /** AI generation status */
  generation_status: GenerationStatus;
  /** Error message if generation failed */
  generation_error: string | null;
  /** The weekly schedule */
  weeks: TrainingWeek[];
  /** AI coach introduction message */
  coach_intro: string | null;
  /** Subscription tier when plan was created */
  tier_at_creation: SubscriptionTier;
  /** Timestamp */
  created_at: string;
  /** Timestamp */
  updated_at: string;
  /** When plan was started */
  started_at: string | null;
  /** When plan was completed */
  completed_at: string | null;
}

/** Request body to generate a new training plan */
export interface GenerateTrainingPlanRequest {
  /** Fitness goal */
  goal: FitnessGoal;
  /** Experience level */
  experience_level: ExperienceLevel;
  /** Days per week */
  frequency: TrainingFrequency;
  /** Equipment available */
  equipment: EquipmentType;
  /** Plan duration in weeks (4, 8, or 12) */
  duration_weeks: 4 | 8 | 12;
  /** Additional preferences or constraints */
  preferences?: string;
  /** Injuries to avoid */
  injuries?: string[];
}

/** API response wrapper */
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  success: boolean;
}

/** Paginated API response */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  per_page: number;
  has_more: boolean;
}

/** Training plan list item (lighter than full plan) */
export interface TrainingPlanSummary {
  id: string;
  name: string;
  description: string;
  goal: FitnessGoal;
  experience_level: ExperienceLevel;
  frequency: TrainingFrequency;
  duration_weeks: number;
  status: TrainingPlanStatus;
  generation_status: GenerationStatus;
  created_at: string;
  started_at: string | null;
  completed_at: string | null;
}

/** User profile for plan generation context */
export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  subscription_tier: SubscriptionTier;
  fitness_goal: FitnessGoal | null;
  experience_level: ExperienceLevel | null;
  age: number | null;
  weight_kg: number | null;
  height_cm: number | null;
  created_at: string;
  updated_at: string;
}
