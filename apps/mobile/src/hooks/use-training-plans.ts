/**
 * TanStack Query hooks for training plans data fetching and mutations.
 * All hooks handle loading, error, and success states.
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type {
  TrainingPlan,
  TrainingPlanSummary,
  GenerateTrainingPlanRequest,
  PaginatedResponse,
} from '@manlydude/shared';

/** Base API URL for training plans */
const API_BASE = `${process.env.EXPO_PUBLIC_API_URL ?? ''}/api/training-plans`;

/** Query keys for cache management */
export const trainingPlanKeys = {
  all: ['training-plans'] as const,
  lists: () => [...trainingPlanKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...trainingPlanKeys.lists(), filters] as const,
  details: () => [...trainingPlanKeys.all, 'detail'] as const,
  detail: (id: string) => [...trainingPlanKeys.details(), id] as const,
};

/**
 * Fetch the authenticated user's access token for API calls.
 */
async function getAuthToken(): Promise<string> {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error || !session) {
    throw new Error('Not authenticated');
  }
  return session.access_token;
}

/**
 * Fetch training plans from the API with optional status filter.
 */
async function fetchTrainingPlans(
  page = 1,
  status?: string
): Promise<PaginatedResponse<TrainingPlanSummary>> {
  const token = await getAuthToken();
  const params = new URLSearchParams({ page: String(page), per_page: '20' });
  if (status) params.append('status', status);

  const response = await fetch(`${API_BASE}?${params}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error ?? 'Failed to fetch training plans');
  }

  return response.json();
}

/**
 * Fetch a single training plan by ID.
 */
async function fetchTrainingPlan(id: string): Promise<TrainingPlan> {
  const token = await getAuthToken();

  const response = await fetch(`${API_BASE}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error ?? 'Failed to fetch training plan');
  }

  const result = await response.json();
  return result.data;
}

/**
 * Generate a new AI training plan.
 */
async function generateTrainingPlan(request: GenerateTrainingPlanRequest): Promise<TrainingPlan> {
  const token = await getAuthToken();

  const response = await fetch(API_BASE, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error ?? 'Failed to generate training plan');
  }

  const result = await response.json();
  return result.data;
}

/**
 * Update a training plan's status or timestamps.
 */
async function updateTrainingPlan(
  id: string,
  updates: { status?: string; started_at?: string; completed_at?: string }
): Promise<TrainingPlan> {
  const token = await getAuthToken();

  const response = await fetch(`${API_BASE}/${id}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error ?? 'Failed to update training plan');
  }

  const result = await response.json();
  return result.data;
}

/**
 * Delete a training plan by ID.
 */
async function deleteTrainingPlan(id: string): Promise<void> {
  const token = await getAuthToken();

  const response = await fetch(`${API_BASE}/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error ?? 'Failed to delete training plan');
  }
}

/**
 * Hook to fetch paginated list of training plans.
 * @param status - Optional status filter
 * @param page - Page number (1-indexed)
 */
export function useTrainingPlans(status?: string, page = 1) {
  return useQuery({
    queryKey: trainingPlanKeys.list({ status, page }),
    queryFn: () => fetchTrainingPlans(page, status),
    staleTime: 30_000, // 30 seconds
  });
}

/**
 * Hook to fetch a single training plan by ID.
 * @param id - Training plan UUID
 */
export function useTrainingPlan(id: string | null) {
  return useQuery({
    queryKey: trainingPlanKeys.detail(id ?? ''),
    queryFn: () => fetchTrainingPlan(id!),
    enabled: !!id,
    staleTime: 60_000, // 1 minute
  });
}

/**
 * Hook to generate a new AI training plan mutation.
 * Automatically invalidates the plans list cache on success.
 */
export function useGenerateTrainingPlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: generateTrainingPlan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: trainingPlanKeys.lists() });
    },
  });
}

/**
 * Hook to update a training plan (status, started/completed timestamps).
 * Uses optimistic updates to immediately reflect changes in the UI.
 */
export function useUpdateTrainingPlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Parameters<typeof updateTrainingPlan>[1] }) =>
      updateTrainingPlan(id, updates),
    onSuccess: (updatedPlan) => {
      queryClient.setQueryData(trainingPlanKeys.detail(updatedPlan.id), updatedPlan);
      queryClient.invalidateQueries({ queryKey: trainingPlanKeys.lists() });
    },
  });
}

/**
 * Hook to delete a training plan.
 * Removes from cache and invalidates lists on success.
 */
export function useDeleteTrainingPlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTrainingPlan,
    onSuccess: (_, deletedId) => {
      queryClient.removeQueries({ queryKey: trainingPlanKeys.detail(deletedId) });
      queryClient.invalidateQueries({ queryKey: trainingPlanKeys.lists() });
    },
  });
}
