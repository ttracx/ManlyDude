/**
 * Single Training Plan API endpoints.
 * GET /api/training-plans/[id] - Get a specific plan
 * PATCH /api/training-plans/[id] - Update plan status
 * DELETE /api/training-plans/[id] - Delete a plan
 */
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';

const UpdatePlanSchema = z.object({
  status: z.enum(['active', 'paused', 'completed', 'archived']).optional(),
  started_at: z.string().datetime().optional(),
  completed_at: z.string().datetime().optional(),
});

/**
 * GET /api/training-plans/[id]
 * Returns a specific training plan by ID.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized', success: false, data: null }, { status: 401 });
    }

    const { data, error } = await supabase
      .from('training_plans')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: 'Training plan not found', success: false, data: null }, { status: 404 });
    }

    return NextResponse.json({ data, success: true, error: null });
  } catch (err) {
    console.error('Unexpected error in GET /api/training-plans/[id]:', err);
    return NextResponse.json({ error: 'Internal server error', success: false, data: null }, { status: 500 });
  }
}

/**
 * PATCH /api/training-plans/[id]
 * Updates the status or timestamps of a training plan.
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized', success: false, data: null }, { status: 401 });
    }

    const body = await request.json();
    const validationResult = UpdatePlanSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json({
        error: validationResult.error.message,
        success: false,
        data: null,
      }, { status: 400 });
    }

    const updates = validationResult.data;

    const { data, error } = await supabase
      .from('training_plans')
      .update(updates)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error || !data) {
      return NextResponse.json({ error: 'Training plan not found or update failed', success: false, data: null }, { status: 404 });
    }

    return NextResponse.json({ data, success: true, error: null });
  } catch (err) {
    console.error('Unexpected error in PATCH /api/training-plans/[id]:', err);
    return NextResponse.json({ error: 'Internal server error', success: false, data: null }, { status: 500 });
  }
}

/**
 * DELETE /api/training-plans/[id]
 * Deletes a training plan.
 */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized', success: false, data: null }, { status: 401 });
    }

    const { error } = await supabase
      .from('training_plans')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      return NextResponse.json({ error: 'Failed to delete training plan', success: false, data: null }, { status: 500 });
    }

    return NextResponse.json({ data: null, success: true, error: null });
  } catch (err) {
    console.error('Unexpected error in DELETE /api/training-plans/[id]:', err);
    return NextResponse.json({ error: 'Internal server error', success: false, data: null }, { status: 500 });
  }
}
