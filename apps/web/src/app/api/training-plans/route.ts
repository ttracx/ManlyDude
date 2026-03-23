/**
 * Training Plans API - List and Create endpoints.
 * GET /api/training-plans - List user's training plans
 * POST /api/training-plans - Generate a new AI training plan
 */
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { generateTrainingPlanWithClaude } from '@/lib/claude/training-plans';
import { validateGenerateRequest } from '@manlydude/shared';

/** Zod schema for generate plan request validation */
const GeneratePlanSchema = z.object({
  goal: z.enum(['muscle_gain', 'fat_loss', 'strength', 'endurance', 'general_fitness', 'sport_performance']),
  experience_level: z.enum(['beginner', 'intermediate', 'advanced', 'elite']),
  frequency: z.union([z.literal(3), z.literal(4), z.literal(5), z.literal(6)]),
  equipment: z.enum(['full_gym', 'home_gym', 'dumbbells_only', 'bodyweight', 'resistance_bands']),
  duration_weeks: z.union([z.literal(4), z.literal(8), z.literal(12)]),
  preferences: z.string().max(500).optional(),
  injuries: z.array(z.string()).max(10).optional(),
});

/**
 * GET /api/training-plans
 * Returns paginated list of the authenticated user's training plans.
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized', success: false, data: null }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') ?? '1', 10);
    const perPage = Math.min(parseInt(searchParams.get('per_page') ?? '20', 10), 50);
    const status = searchParams.get('status');
    const offset = (page - 1) * perPage;

    let query = supabase
      .from('training_plans')
      .select('id, name, description, goal, experience_level, frequency, duration_weeks, status, generation_status, created_at, started_at, completed_at', { count: 'exact' })
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .range(offset, offset + perPage - 1);

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error, count } = await query;

    if (error) {
      console.error('Error fetching training plans:', error);
      return NextResponse.json({ error: 'Failed to fetch training plans', success: false, data: null }, { status: 500 });
    }

    return NextResponse.json({
      data,
      total: count ?? 0,
      page,
      per_page: perPage,
      has_more: (count ?? 0) > offset + perPage,
      success: true,
      error: null,
    });
  } catch (err) {
    console.error('Unexpected error in GET /api/training-plans:', err);
    return NextResponse.json({ error: 'Internal server error', success: false, data: null }, { status: 500 });
  }
}

/**
 * POST /api/training-plans
 * Generates a new AI training plan using Claude.
 * Requires Plus or Premium subscription tier.
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized', success: false, data: null }, { status: 401 });
    }

    // Check subscription tier
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('subscription_tier')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json({ error: 'Profile not found', success: false, data: null }, { status: 404 });
    }

    if (profile.subscription_tier === 'free') {
      return NextResponse.json({
        error: 'AI training plan generation requires Plus or Premium subscription',
        success: false,
        data: null,
      }, { status: 403 });
    }

    // Parse and validate request body
    const body = await request.json();
    const validationResult = GeneratePlanSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json({
        error: validationResult.error.message,
        success: false,
        data: null,
      }, { status: 400 });
    }

    const planRequest = validationResult.data;

    // Additional validation using shared utility
    const validationError = validateGenerateRequest(planRequest);
    if (validationError) {
      return NextResponse.json({ error: validationError, success: false, data: null }, { status: 400 });
    }

    // Create a pending plan record first
    const { data: pendingPlan, error: insertError } = await supabase
      .from('training_plans')
      .insert({
        user_id: user.id,
        name: 'Generating your plan...',
        description: '',
        goal: planRequest.goal,
        experience_level: planRequest.experience_level,
        frequency: planRequest.frequency,
        equipment: planRequest.equipment,
        duration_weeks: planRequest.duration_weeks,
        status: 'active',
        generation_status: 'generating',
        weeks: [],
        tier_at_creation: profile.subscription_tier,
      })
      .select()
      .single();

    if (insertError || !pendingPlan) {
      console.error('Error creating pending plan:', insertError);
      return NextResponse.json({ error: 'Failed to create training plan', success: false, data: null }, { status: 500 });
    }

    try {
      // Generate plan with Claude AI
      const generated = await generateTrainingPlanWithClaude(planRequest);

      // Update plan with generated content
      const { data: completedPlan, error: updateError } = await supabase
        .from('training_plans')
        .update({
          name: generated.name,
          description: generated.description,
          coach_intro: generated.coach_intro,
          weeks: generated.weeks,
          generation_status: 'completed',
        })
        .eq('id', pendingPlan.id)
        .select()
        .single();

      if (updateError || !completedPlan) {
        throw new Error('Failed to save generated plan');
      }

      return NextResponse.json({ data: completedPlan, success: true, error: null }, { status: 201 });
    } catch (genError) {
      // Update plan with error status
      await supabase
        .from('training_plans')
        .update({
          generation_status: 'failed',
          generation_error: genError instanceof Error ? genError.message : 'Generation failed',
        })
        .eq('id', pendingPlan.id);

      console.error('Error generating training plan:', genError);
      return NextResponse.json({
        error: 'Failed to generate training plan. Please try again.',
        success: false,
        data: null,
      }, { status: 500 });
    }
  } catch (err) {
    console.error('Unexpected error in POST /api/training-plans:', err);
    return NextResponse.json({ error: 'Internal server error', success: false, data: null }, { status: 500 });
  }
}
