import { NextResponse } from 'next/server';
import { claude } from '@/lib/claude';
import { requireAuth, requireTier, type AuthContext } from '@/lib/auth-guard';
import type { MuscleGroup, Equipment, TemplateExercise } from '@manlydude/shared';

interface GenerateWorkoutRequest {
  goal: 'build_muscle' | 'lose_fat' | 'gain_strength' | 'improve_endurance' | 'general_fitness';
  target_muscles: MuscleGroup[];
  available_equipment: Equipment[];
  experience_level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  duration_minutes: number;
  notes?: string;
}

const SYSTEM_PROMPT = `You are ManlyDude AI, a no-nonsense strength coach who designs brutally effective workout programs. You speak with confidence and authority — you're the coach every lifter wishes they had.

Your job is to generate a structured workout plan based on the user's goals, available equipment, target muscles, and experience level.

RULES:
- Only use exercises that match the available equipment
- Compound movements first, isolation movements after
- For hypertrophy: 3-4 sets of 8-12 reps, RPE 7-9
- For strength: 4-5 sets of 3-6 reps, RPE 8-10
- For endurance: 2-3 sets of 15-20 reps, RPE 6-8
- For fat loss: supersets and circuits, shorter rest
- Rest periods: 60-90s for hypertrophy, 120-180s for strength, 30-60s for endurance/fat loss
- Include warmup sets for the first compound movement
- Keep total exercises between 5-8 depending on duration

You MUST respond with valid JSON matching this exact schema:
{
  "name": "string - a short, punchy workout name",
  "description": "string - 1-2 sentence description with the ManlyDude voice",
  "exercises": [
    {
      "exercise_name": "string - standard exercise name",
      "primary_muscle": "string - one of the MuscleGroup values",
      "equipment": "string - one of the Equipment values",
      "exercise_type": "compound | isolation",
      "order": "number - 1-indexed",
      "target_sets": "number",
      "target_reps_min": "number",
      "target_reps_max": "number",
      "rest_seconds": "number",
      "superset_group": "number | null - same number means superset together",
      "notes": "string | null - coaching cue or tip"
    }
  ],
  "coach_notes": "string - motivational message or key tips for this workout"
}

Do NOT include any text outside the JSON object.`;

export async function POST(request: Request) {
  const authResult = await requireAuth();
  if (authResult instanceof NextResponse) return authResult;
  const { profile } = authResult as AuthContext;

  const tierCheck = requireTier(profile, 'plus');
  if (tierCheck) return tierCheck;

  let body: GenerateWorkoutRequest;
  try {
    body = (await request.json()) as GenerateWorkoutRequest;
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const { goal, target_muscles, available_equipment, experience_level, duration_minutes, notes } =
    body;

  if (!goal || !target_muscles?.length || !available_equipment?.length || !experience_level) {
    return NextResponse.json(
      { error: 'Missing required fields: goal, target_muscles, available_equipment, experience_level' },
      { status: 400 },
    );
  }

  const userPrompt = `Generate a workout plan with these parameters:
- Goal: ${goal.replace('_', ' ')}
- Target muscles: ${target_muscles.join(', ')}
- Available equipment: ${available_equipment.join(', ')}
- Experience level: ${experience_level}
- Target duration: ${duration_minutes || 60} minutes
- User stats: ${profile.weight_kg ? `${profile.weight_kg}kg` : 'unknown weight'}, ${profile.gender || 'unspecified gender'}
${notes ? `- Additional notes: ${notes}` : ''}`;

  try {
    const response = await claude.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2048,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userPrompt }],
    });

    const text =
      response.content[0].type === 'text' ? response.content[0].text : '';
    const workout = JSON.parse(text);

    return NextResponse.json({
      workout,
      usage: {
        input_tokens: response.usage.input_tokens,
        output_tokens: response.usage.output_tokens,
      },
    });
  } catch (err) {
    console.error('AI workout generation failed:', err);
    return NextResponse.json(
      { error: 'Failed to generate workout. Please try again.' },
      { status: 500 },
    );
  }
}
