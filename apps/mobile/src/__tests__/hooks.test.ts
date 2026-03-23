/**
 * Tests for training plan query keys.
 */
import { trainingPlanKeys } from '../hooks/use-training-plans';

// Prevent Supabase client from initializing during tests
jest.mock('../lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: jest.fn().mockResolvedValue({ data: { session: null }, error: null }),
    },
  },
}));

describe('trainingPlanKeys', () => {
  it('generates stable all key', () => {
    expect(trainingPlanKeys.all).toEqual(['training-plans']);
  });

  it('generates stable lists key', () => {
    expect(trainingPlanKeys.lists()).toEqual(['training-plans', 'list']);
  });

  it('generates stable list key with filters', () => {
    const key = trainingPlanKeys.list({ status: 'active', page: 1 });
    expect(key).toEqual(['training-plans', 'list', { status: 'active', page: 1 }]);
  });

  it('generates stable detail key', () => {
    const key = trainingPlanKeys.detail('plan-123');
    expect(key).toEqual(['training-plans', 'detail', 'plan-123']);
  });

  it('generates empty detail key for empty id', () => {
    const key = trainingPlanKeys.detail('');
    expect(key).toEqual(['training-plans', 'detail', '']);
  });
});
