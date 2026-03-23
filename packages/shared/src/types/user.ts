/** Subscription tier levels */
export type SubscriptionTier = 'free' | 'plus' | 'premium';

/** User profile stored in the profiles table */
export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  subscription_tier: SubscriptionTier;
  stripe_customer_id: string | null;
  height_cm: number | null;
  weight_kg: number | null;
  date_of_birth: string | null;
  gender: 'male' | 'female' | 'other' | null;
  fitness_goal: FitnessGoal | null;
  experience_level: ExperienceLevel | null;
  created_at: string;
  updated_at: string;
}

/** Available fitness goals */
export type FitnessGoal =
  | 'build_muscle'
  | 'lose_fat'
  | 'gain_strength'
  | 'improve_endurance'
  | 'general_fitness';

/** User experience level */
export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';
