/**
 * Workout logging types for ManlyDude.
 */

/** Status of a logged workout session */
export type WorkoutSessionStatus = 'in_progress' | 'completed' | 'abandoned';

/** A completed set log entry */
export interface CompletedSet {
  set_number: number;
  reps_completed: number | null;
  weight_kg: number | null;
  duration_seconds: number | null;
  rpe_actual: number | null;
  notes: string | null;
  completed_at: string;
}

/** A logged exercise within a workout session */
export interface WorkoutExerciseLog {
  id: string;
  session_id: string;
  exercise_id: string;
  exercise_name: string;
  order_index: number;
  sets: CompletedSet[];
  notes: string | null;
}

/** A complete workout session log */
export interface WorkoutSession {
  id: string;
  user_id: string;
  training_plan_id: string | null;
  plan_week_number: number | null;
  plan_day_number: number | null;
  name: string;
  status: WorkoutSessionStatus;
  started_at: string;
  completed_at: string | null;
  duration_seconds: number | null;
  notes: string | null;
  exercises: WorkoutExerciseLog[];
  total_volume_kg: number | null;
}
