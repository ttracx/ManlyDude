import type { SubscriptionTier, MuscleGroup } from './types';

/** Subscription tier pricing and limits */
export const SUBSCRIPTION_TIERS: Record<
  SubscriptionTier,
  {
    name: string;
    price_monthly: number;
    features: string[];
  }
> = {
  free: {
    name: 'Free',
    price_monthly: 0,
    features: [
      'Unlimited workout logging',
      'Exercise library (600+)',
      'Rest timer',
      'Social groups',
    ],
  },
  plus: {
    name: 'Plus',
    price_monthly: 19,
    features: [
      'AI-generated training plans',
      'Strength score',
      'Nutrition targets',
      'Custom exercises',
      'Supersets',
      'Progress photos',
      'Educational lessons',
    ],
  },
  premium: {
    name: 'Premium',
    price_monthly: 99,
    features: [
      'AI coach chat (Claude-powered)',
      'Automated video form review',
      'Custom training & nutrition plans',
      'Weekly AI progress reviews',
    ],
  },
};

/** All muscle groups */
export const MUSCLE_GROUPS: MuscleGroup[] = [
  'chest',
  'back',
  'shoulders',
  'biceps',
  'triceps',
  'forearms',
  'quadriceps',
  'hamstrings',
  'glutes',
  'calves',
  'abs',
  'obliques',
  'traps',
  'lats',
  'lower_back',
];

/** Default rest time between sets in seconds */
export const DEFAULT_REST_SECONDS = 90;

/** Maximum number of custom exercises for Plus tier */
export const MAX_CUSTOM_EXERCISES_PLUS = 50;

/** RPE scale range */
export const RPE_MIN = 1;
export const RPE_MAX = 10;
