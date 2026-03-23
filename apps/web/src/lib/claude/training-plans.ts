/**
 * Claude AI integration for training plan generation.
 * Uses Anthropic SDK to generate structured workout plans.
 */
import Anthropic from '@anthropic-ai/sdk';
import type {
  GenerateTrainingPlanRequest,
  TrainingWeek,
  FitnessGoal,
  ExperienceLevel,
  EquipmentType,
} from '@manlydude/shared';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

/** Model to use for training plan generation */
const MODEL = 'claude-3-5-sonnet-20241022';

/**
 * Build the system prompt for training plan generation.
 */
function buildSystemPrompt(): string {
  return `You are ManlyDude AI Coach, an expert strength training and fitness coach.
Your job is to create personalized, scientifically-backed training plans.

When generating training plans:
- Always return valid JSON matching the specified schema exactly
- Include progressive overload principles
- Balance muscle groups appropriately
- Include warmup and cooldown notes
- Provide specific coaching cues for each exercise
- Consider the user's equipment and experience level
- Use real exercises with proper sets, reps, and rest periods
- For beginners: 3-4 sets, moderate weight, longer rest
- For advanced: 4-6 sets, higher intensity, varied rep ranges

Exercise naming: Use standard gym terminology (e.g., "Barbell Back Squat", "Dumbbell Bench Press").`;
}

/**
 * Build the user prompt for a specific training plan request.
 */
function buildUserPrompt(request: GenerateTrainingPlanRequest): string {
  const goalDescriptions: Record<FitnessGoal, string> = {
    muscle_gain: 'building muscle mass and size (hypertrophy)',
    fat_loss: 'losing body fat while preserving muscle',
    strength: 'increasing maximal strength (1RM)',
    endurance: 'improving muscular and cardiovascular endurance',
    general_fitness: 'overall health, fitness, and body composition',
    sport_performance: 'athletic performance and functional strength',
  };

  const equipmentDescriptions: Record<EquipmentType, string> = {
    full_gym: 'full commercial gym (barbells, dumbbells, cables, machines)',
    home_gym: 'home gym with barbell, dumbbells, and pull-up bar',
    dumbbells_only: 'dumbbells only',
    bodyweight: 'bodyweight exercises only',
    resistance_bands: 'resistance bands and bodyweight',
  };

  const levelGuidance: Record<ExperienceLevel, string> = {
    beginner: 'under 1 year of consistent training',
    intermediate: '1-3 years of consistent training',
    advanced: '3-5 years of consistent training',
    elite: '5+ years of serious training',
  };

  return `Generate a ${request.duration_weeks}-week training plan for the following athlete:

Goal: ${goalDescriptions[request.goal]}
Experience: ${levelGuidance[request.experience_level]}
Training Frequency: ${request.frequency} days per week
Equipment: ${equipmentDescriptions[request.equipment]}
${request.preferences ? `Special Preferences: ${request.preferences}` : ''}
${request.injuries && request.injuries.length > 0 ? `Injuries/Limitations: ${request.injuries.join(', ')}` : ''}

Return a JSON object with this EXACT structure:
{
  "name": "string (catchy plan name, e.g. 'Power Surge 8-Week Strength Program')",
  "description": "string (2-3 sentences describing the plan)",
  "coach_intro": "string (personalized message from the AI coach, 2-3 sentences)",
  "weeks": [
    {
      "week_number": 1,
      "focus": "string (e.g. 'Foundation & Form')",
      "coaching_notes": "string (key points for this week)",
      "days": [
        {
          "name": "string (e.g. 'Day 1 - Upper Body Push')",
          "day_number": 1,
          "is_rest_day": false,
          "focus": ["chest", "shoulders", "triceps"],
          "estimated_duration_minutes": 60,
          "warmup_notes": "string",
          "cooldown_notes": "string",
          "exercises": [
            {
              "id": "string (uuid-like, e.g. 'ex_001')",
              "exercise_id": "string (exercise library id, e.g. 'barbell-bench-press')",
              "exercise_name": "string (full name, e.g. 'Barbell Bench Press')",
              "order_index": 1,
              "coaching_notes": "string (form cues and tips)",
              "superset_group": null,
              "tempo": "string or null (e.g. '3-1-2-0')",
              "sets": [
                {
                  "set_number": 1,
                  "reps": 10,
                  "weight_kg": null,
                  "duration_seconds": null,
                  "rest_seconds": 90,
                  "rpe_target": 7,
                  "is_warmup": false
                }
              ]
            }
          ]
        },
        {
          "name": "Rest Day",
          "day_number": 2,
          "is_rest_day": true,
          "focus": [],
          "estimated_duration_minutes": 0,
          "warmup_notes": null,
          "cooldown_notes": null,
          "exercises": []
        }
      ]
    }
  ]
}

Important:
- Generate ALL ${request.duration_weeks} weeks with progressive overload
- Each week should have exactly 7 days (including rest days)
- Non-rest days should have ${request.frequency} training days spread throughout the week
- Weight values should be null (user will input their own weights)
- Include 3-5 exercises per training day
- Each exercise should have 3-5 working sets`;
}

/**
 * Generate an AI training plan using Claude.
 * Returns the parsed plan data or throws on error.
 */
export async function generateTrainingPlanWithClaude(
  request: GenerateTrainingPlanRequest
): Promise<{
  name: string;
  description: string;
  coach_intro: string;
  weeks: TrainingWeek[];
}> {
  const message = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 32000,
    system: buildSystemPrompt(),
    messages: [
      {
        role: 'user',
        content: buildUserPrompt(request),
      },
    ],
  });

  const content = message.content[0];
  if (content.type !== 'text') {
    throw new Error('Unexpected response type from Claude');
  }

  // Extract JSON from the response (Claude may wrap it in markdown code blocks)
  const jsonMatch = content.text.match(/```json\s*([\s\S]*?)\s*```/) ||
    content.text.match(/```\s*([\s\S]*?)\s*```/) ||
    [null, content.text];

  const jsonStr = jsonMatch[1] || content.text;

  try {
    const parsed = JSON.parse(jsonStr);
    return {
      name: parsed.name,
      description: parsed.description,
      coach_intro: parsed.coach_intro,
      weeks: parsed.weeks,
    };
  } catch (e) {
    throw new Error(`Failed to parse Claude response as JSON: ${e}`);
  }
}
