/**
 * Utility functions for training plans.
 */

import type { FitnessGoal, ExperienceLevel, TrainingFrequency, EquipmentType } from '../types/training-plans';

/**
 * Get a human-readable label for a fitness goal.
 */
export function getFitnessGoalLabel(goal: FitnessGoal): string {
  const labels: Record<FitnessGoal, string> = {
    muscle_gain: 'Muscle Gain',
    fat_loss: 'Fat Loss',
    strength: 'Strength',
    endurance: 'Endurance',
    general_fitness: 'General Fitness',
    sport_performance: 'Sport Performance',
  };
  return labels[goal];
}

/**
 * Get a human-readable label for an experience level.
 */
export function getExperienceLevelLabel(level: ExperienceLevel): string {
  const labels: Record<ExperienceLevel, string> = {
    beginner: 'Beginner',
    intermediate: 'Intermediate',
    advanced: 'Advanced',
    elite: 'Elite',
  };
  return labels[level];
}

/**
 * Get a human-readable label for equipment type.
 */
export function getEquipmentLabel(equipment: EquipmentType): string {
  const labels: Record<EquipmentType, string> = {
    full_gym: 'Full Gym',
    home_gym: 'Home Gym',
    dumbbells_only: 'Dumbbells Only',
    bodyweight: 'Bodyweight',
    resistance_bands: 'Resistance Bands',
  };
  return labels[equipment];
}

/**
 * Get a human-readable label for training frequency.
 */
export function getFrequencyLabel(frequency: TrainingFrequency): string {
  return `${frequency} days/week`;
}

/**
 * Calculate the total volume for a training week (sum of sets × reps × weight).
 * Returns volume in kg.
 */
export function calculateWeeklyVolume(exercises: Array<{
  sets: Array<{ reps: number | null; weight_kg: number | null; is_warmup: boolean }>;
}>): number {
  return exercises.reduce((total, exercise) => {
    return total + exercise.sets
      .filter((s) => !s.is_warmup)
      .reduce((setTotal, set) => {
        const reps = set.reps ?? 0;
        const weight = set.weight_kg ?? 0;
        return setTotal + reps * weight;
      }, 0);
  }, 0);
}

/**
 * Validate that a generate plan request has valid parameters.
 */
export function validateGenerateRequest(req: {
  goal: string;
  experience_level: string;
  frequency: number;
  equipment: string;
  duration_weeks: number;
}): string | null {
  const validGoals: FitnessGoal[] = ['muscle_gain', 'fat_loss', 'strength', 'endurance', 'general_fitness', 'sport_performance'];
  const validLevels: ExperienceLevel[] = ['beginner', 'intermediate', 'advanced', 'elite'];
  const validFrequencies: TrainingFrequency[] = [3, 4, 5, 6];
  const validEquipment: EquipmentType[] = ['full_gym', 'home_gym', 'dumbbells_only', 'bodyweight', 'resistance_bands'];
  const validDurations = [4, 8, 12];

  if (!validGoals.includes(req.goal as FitnessGoal)) {
    return `Invalid goal: ${req.goal}`;
  }
  if (!validLevels.includes(req.experience_level as ExperienceLevel)) {
    return `Invalid experience level: ${req.experience_level}`;
  }
  if (!validFrequencies.includes(req.frequency as TrainingFrequency)) {
    return `Invalid frequency: ${req.frequency}. Must be 3, 4, 5, or 6.`;
  }
  if (!validEquipment.includes(req.equipment as EquipmentType)) {
    return `Invalid equipment: ${req.equipment}`;
  }
  if (!validDurations.includes(req.duration_weeks)) {
    return `Invalid duration: ${req.duration_weeks}. Must be 4, 8, or 12.`;
  }
  return null;
}
