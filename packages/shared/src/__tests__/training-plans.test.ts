import {
  getFitnessGoalLabel,
  getExperienceLevelLabel,
  getEquipmentLabel,
  getFrequencyLabel,
  calculateWeeklyVolume,
  validateGenerateRequest,
} from '../utils/training-plans';

describe('getFitnessGoalLabel', () => {
  it('returns correct label for muscle_gain', () => {
    expect(getFitnessGoalLabel('muscle_gain')).toBe('Muscle Gain');
  });
  it('returns correct label for fat_loss', () => {
    expect(getFitnessGoalLabel('fat_loss')).toBe('Fat Loss');
  });
  it('returns correct label for strength', () => {
    expect(getFitnessGoalLabel('strength')).toBe('Strength');
  });
});

describe('getExperienceLevelLabel', () => {
  it('returns correct label for beginner', () => {
    expect(getExperienceLevelLabel('beginner')).toBe('Beginner');
  });
  it('returns correct label for elite', () => {
    expect(getExperienceLevelLabel('elite')).toBe('Elite');
  });
});

describe('getEquipmentLabel', () => {
  it('returns correct label for full_gym', () => {
    expect(getEquipmentLabel('full_gym')).toBe('Full Gym');
  });
  it('returns correct label for bodyweight', () => {
    expect(getEquipmentLabel('bodyweight')).toBe('Bodyweight');
  });
});

describe('getFrequencyLabel', () => {
  it('returns correct label for 4 days', () => {
    expect(getFrequencyLabel(4)).toBe('4 days/week');
  });
});

describe('calculateWeeklyVolume', () => {
  it('calculates total volume correctly', () => {
    const exercises = [
      {
        sets: [
          { reps: 10, weight_kg: 50, is_warmup: false },
          { reps: 8, weight_kg: 60, is_warmup: false },
          { reps: 5, weight_kg: 20, is_warmup: true },
        ],
      },
    ];
    // 10 * 50 + 8 * 60 = 500 + 480 = 980 (warmup excluded)
    expect(calculateWeeklyVolume(exercises)).toBe(980);
  });

  it('handles null values', () => {
    const exercises = [
      {
        sets: [
          { reps: null, weight_kg: 50, is_warmup: false },
          { reps: 10, weight_kg: null, is_warmup: false },
        ],
      },
    ];
    expect(calculateWeeklyVolume(exercises)).toBe(0);
  });
});

describe('validateGenerateRequest', () => {
  const validRequest = {
    goal: 'muscle_gain',
    experience_level: 'intermediate',
    frequency: 4,
    equipment: 'full_gym',
    duration_weeks: 8,
  };

  it('returns null for valid request', () => {
    expect(validateGenerateRequest(validRequest)).toBeNull();
  });

  it('returns error for invalid goal', () => {
    const req = { ...validRequest, goal: 'invalid_goal' };
    expect(validateGenerateRequest(req)).toContain('Invalid goal');
  });

  it('returns error for invalid frequency', () => {
    const req = { ...validRequest, frequency: 2 };
    expect(validateGenerateRequest(req)).toContain('Invalid frequency');
  });

  it('returns error for invalid duration', () => {
    const req = { ...validRequest, duration_weeks: 6 };
    expect(validateGenerateRequest(req)).toContain('Invalid duration');
  });

  it('returns error for invalid experience level', () => {
    const req = { ...validRequest, experience_level: 'newbie' };
    expect(validateGenerateRequest(req)).toContain('Invalid experience level');
  });
});
