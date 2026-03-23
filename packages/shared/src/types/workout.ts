/** Primary muscle groups */
export type MuscleGroup =
  | 'chest'
  | 'back'
  | 'shoulders'
  | 'biceps'
  | 'triceps'
  | 'forearms'
  | 'quadriceps'
  | 'hamstrings'
  | 'glutes'
  | 'calves'
  | 'abs'
  | 'obliques'
  | 'traps'
  | 'lats'
  | 'lower_back';

/** Equipment types */
export type Equipment =
  | 'barbell'
  | 'dumbbell'
  | 'cable'
  | 'machine'
  | 'bodyweight'
  | 'kettlebell'
  | 'band'
  | 'other';

/** Exercise from the exercise library */
export interface Exercise {
  id: string;
  name: string;
  description: string | null;
  primary_muscle: MuscleGroup;
  secondary_muscles: MuscleGroup[];
  equipment: Equipment;
  exercise_type: 'compound' | 'isolation';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  instructions: string | null;
  video_url: string | null;
  thumbnail_url: string | null;
  is_custom: boolean;
  created_by: string | null;
  created_at: string;
}

/** Saved workout template */
export interface WorkoutTemplate {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  exercises: TemplateExercise[];
  is_ai_generated: boolean;
  created_at: string;
  updated_at: string;
}

/** Exercise within a template */
export interface TemplateExercise {
  exercise_id: string;
  order: number;
  target_sets: number;
  target_reps_min: number;
  target_reps_max: number;
  rest_seconds: number;
  superset_group: number | null;
  notes: string | null;
}

/** A logged workout session */
export interface WorkoutSession {
  id: string;
  user_id: string;
  template_id: string | null;
  name: string;
  started_at: string;
  completed_at: string | null;
  duration_seconds: number | null;
  notes: string | null;
  created_at: string;
}

/** Individual set within a workout session */
export interface WorkoutSet {
  id: string;
  session_id: string;
  exercise_id: string;
  set_number: number;
  set_type: 'working' | 'warmup' | 'drop' | 'failure';
  weight_kg: number | null;
  reps: number | null;
  duration_seconds: number | null;
  rpe: number | null;
  completed: boolean;
  created_at: string;
}
