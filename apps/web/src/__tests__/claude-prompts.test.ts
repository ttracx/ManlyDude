/**
 * Tests for Claude training plan generation utilities.
 */
import {
  getFitnessGoalLabel,
  getEquipmentLabel,
  getExperienceLevelLabel,
  getFrequencyLabel,
} from '@manlydude/shared';

describe('Training plan labels', () => {
  it('maps all fitness goals to labels', () => {
    const goals = ['muscle_gain', 'fat_loss', 'strength', 'endurance', 'general_fitness', 'sport_performance'] as const;
    goals.forEach((goal) => {
      const label = getFitnessGoalLabel(goal);
      expect(typeof label).toBe('string');
      expect(label.length).toBeGreaterThan(0);
    });
  });

  it('maps all experience levels to labels', () => {
    const levels = ['beginner', 'intermediate', 'advanced', 'elite'] as const;
    levels.forEach((level) => {
      const label = getExperienceLevelLabel(level);
      expect(typeof label).toBe('string');
      expect(label.length).toBeGreaterThan(0);
    });
  });

  it('maps all equipment types to labels', () => {
    const equipment = ['full_gym', 'home_gym', 'dumbbells_only', 'bodyweight', 'resistance_bands'] as const;
    equipment.forEach((eq) => {
      const label = getEquipmentLabel(eq);
      expect(typeof label).toBe('string');
      expect(label.length).toBeGreaterThan(0);
    });
  });

  it('maps all frequencies to labels', () => {
    const frequencies = [3, 4, 5, 6] as const;
    frequencies.forEach((freq) => {
      const label = getFrequencyLabel(freq);
      expect(label).toContain(String(freq));
      expect(label).toContain('days/week');
    });
  });
});
