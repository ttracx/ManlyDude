import { NextResponse } from 'next/server';
import { claude } from '@/lib/claude';
import { requireAuth, requireTier, type AuthContext } from '@/lib/auth-guard';

interface GenerateNutritionRequest {
  goal: 'build_muscle' | 'lose_fat' | 'gain_strength' | 'improve_endurance' | 'general_fitness';
  meals_per_day: number;
  dietary_restrictions?: string[];
  notes?: string;
}

const SYSTEM_PROMPT = `You are ManlyDude AI, a straight-talking nutrition coach for serious lifters. You create practical, high-protein meal plans that real people can actually follow.

Your job is to generate a structured daily nutrition plan based on the user's goal, stats, and preferences.

RULES:
- Calculate TDEE-based targets: bulk = TDEE + 300-500, cut = TDEE - 400-600, maintain = TDEE
- Protein: 1.6-2.2g per kg of bodyweight (higher for cuts, moderate for bulks)
- Fats: minimum 0.7g per kg bodyweight
- Fill remaining calories with carbs
- If no weight provided, use reasonable defaults (80kg male, 65kg female)
- Keep meals practical — no exotic ingredients
- Each meal should have a protein source

You MUST respond with valid JSON matching this exact schema:
{
  "name": "string - name of the nutrition plan",
  "goal": "string - the fitness goal",
  "daily_targets": {
    "calories": "number",
    "protein_g": "number",
    "carbs_g": "number",
    "fat_g": "number"
  },
  "meals": [
    {
      "name": "string - e.g. Breakfast, Lunch, etc.",
      "time_of_day": "string | null - e.g. 7:00 AM",
      "foods": [
        {
          "name": "string - food item",
          "serving_size": "string - e.g. 200g, 1 cup",
          "macros": {
            "calories": "number",
            "protein_g": "number",
            "carbs_g": "number",
            "fat_g": "number"
          }
        }
      ],
      "macros": {
        "calories": "number - meal total",
        "protein_g": "number",
        "carbs_g": "number",
        "fat_g": "number"
      }
    }
  ],
  "coach_notes": "string - key tips about this plan in ManlyDude voice"
}

Do NOT include any text outside the JSON object.`;

export async function POST(request: Request) {
  const authResult = await requireAuth();
  if (authResult instanceof NextResponse) return authResult;
  const { profile } = authResult as AuthContext;

  const tierCheck = requireTier(profile, 'plus');
  if (tierCheck) return tierCheck;

  let body: GenerateNutritionRequest;
  try {
    body = (await request.json()) as GenerateNutritionRequest;
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const { goal, meals_per_day, dietary_restrictions, notes } = body;

  if (!goal || !meals_per_day) {
    return NextResponse.json(
      { error: 'Missing required fields: goal, meals_per_day' },
      { status: 400 },
    );
  }

  const userPrompt = `Generate a daily nutrition plan with these parameters:
- Goal: ${goal.replace('_', ' ')}
- Meals per day: ${meals_per_day}
- Weight: ${profile.weight_kg ? `${profile.weight_kg}kg` : 'not provided'}
- Gender: ${profile.gender || 'not provided'}
- Experience level: ${profile.experience_level || 'intermediate'}
${dietary_restrictions?.length ? `- Dietary restrictions: ${dietary_restrictions.join(', ')}` : ''}
${notes ? `- Additional notes: ${notes}` : ''}`;

  try {
    const response = await claude.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 3000,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userPrompt }],
    });

    const text =
      response.content[0].type === 'text' ? response.content[0].text : '';
    const plan = JSON.parse(text);

    return NextResponse.json({
      plan,
      usage: {
        input_tokens: response.usage.input_tokens,
        output_tokens: response.usage.output_tokens,
      },
    });
  } catch (err) {
    console.error('AI nutrition generation failed:', err);
    return NextResponse.json(
      { error: 'Failed to generate nutrition plan. Please try again.' },
      { status: 500 },
    );
  }
}
