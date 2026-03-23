/**
 * Unit tests for training plans API route validation logic.
 */
import { validateGenerateRequest } from '@manlydude/shared';

describe('Training Plans API - Request Validation', () => {
  const validRequest = {
    goal: 'muscle_gain' as const,
    experience_level: 'intermediate' as const,
    frequency: 4 as const,
    equipment: 'full_gym' as const,
    duration_weeks: 8,
  };

  describe('validateGenerateRequest integration', () => {
    it('accepts a valid request', () => {
      expect(validateGenerateRequest(validRequest)).toBeNull();
    });

    it('rejects invalid goal', () => {
      const error = validateGenerateRequest({ ...validRequest, goal: 'bad_goal' });
      expect(error).not.toBeNull();
      expect(error).toContain('Invalid goal');
    });

    it('rejects invalid frequency of 2', () => {
      const error = validateGenerateRequest({ ...validRequest, frequency: 2 });
      expect(error).not.toBeNull();
      expect(error).toContain('Invalid frequency');
    });

    it('rejects invalid duration of 16', () => {
      const error = validateGenerateRequest({ ...validRequest, duration_weeks: 16 });
      expect(error).not.toBeNull();
      expect(error).toContain('Invalid duration');
    });

    it('rejects invalid equipment', () => {
      const error = validateGenerateRequest({ ...validRequest, equipment: 'kettlebells' });
      expect(error).not.toBeNull();
      expect(error).toContain('Invalid equipment');
    });

    it('accepts all valid goals', () => {
      const goals = ['muscle_gain', 'fat_loss', 'strength', 'endurance', 'general_fitness', 'sport_performance'];
      for (const goal of goals) {
        expect(validateGenerateRequest({ ...validRequest, goal })).toBeNull();
      }
    });

    it('accepts all valid frequencies', () => {
      for (const frequency of [3, 4, 5, 6]) {
        expect(validateGenerateRequest({ ...validRequest, frequency })).toBeNull();
      }
    });
  });
});
