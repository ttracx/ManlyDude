/**
 * Generate Training Plan screen.
 * Allows Plus/Premium users to generate an AI training plan.
 */
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { useGenerateTrainingPlan } from '@/hooks/use-training-plans';
import type {
  FitnessGoal,
  ExperienceLevel,
  TrainingFrequency,
  EquipmentType,
  GenerateTrainingPlanRequest,
} from '@manlydude/shared';

/** Option group component for selecting from a list of choices */
function OptionGroup<T extends string | number>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { value: T; label: string; description?: string }[];
  value: T | undefined;
  onChange: (v: T) => void;
}) {
  return (
    <View style={styles.optionGroup}>
      <Text style={styles.optionGroupLabel}>{label}</Text>
      <View style={styles.optionList}>
        {options.map((option) => {
          const selected = value === option.value;
          return (
            <TouchableOpacity
              key={String(option.value)}
              style={[styles.optionItem, selected && styles.optionItemSelected]}
              onPress={() => onChange(option.value)}
              accessibilityLabel={option.label}
              accessibilityRole="radio"
              accessibilityState={{ checked: selected }}
            >
              <View style={styles.optionItemContent}>
                <Text style={[styles.optionItemLabel, selected && styles.optionItemLabelSelected]}>
                  {option.label}
                </Text>
                {option.description && (
                  <Text style={[styles.optionItemDescription, selected && styles.optionItemDescriptionSelected]}>
                    {option.description}
                  </Text>
                )}
              </View>
              {selected && <Text style={styles.checkmark}>✓</Text>}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

/** Goal options */
const GOAL_OPTIONS: { value: FitnessGoal; label: string; description: string }[] = [
  { value: 'muscle_gain', label: '💪 Muscle Gain', description: 'Build size and mass' },
  { value: 'strength', label: '🏋️ Strength', description: 'Increase your 1RM' },
  { value: 'fat_loss', label: '🔥 Fat Loss', description: 'Lean out while preserving muscle' },
  { value: 'endurance', label: '🏃 Endurance', description: 'Build muscular stamina' },
  { value: 'general_fitness', label: '⚡ General Fitness', description: 'Overall health & fitness' },
  { value: 'sport_performance', label: '🏆 Sport Performance', description: 'Athletic power & function' },
];

/** Experience level options */
const LEVEL_OPTIONS: { value: ExperienceLevel; label: string; description: string }[] = [
  { value: 'beginner', label: 'Beginner', description: 'Under 1 year training' },
  { value: 'intermediate', label: 'Intermediate', description: '1–3 years training' },
  { value: 'advanced', label: 'Advanced', description: '3–5 years training' },
  { value: 'elite', label: 'Elite', description: '5+ years serious training' },
];

/** Frequency options */
const FREQUENCY_OPTIONS: { value: TrainingFrequency; label: string; description: string }[] = [
  { value: 3, label: '3 Days', description: 'Full body focus' },
  { value: 4, label: '4 Days', description: 'Upper/lower split' },
  { value: 5, label: '5 Days', description: 'Push/pull/legs' },
  { value: 6, label: '6 Days', description: 'High frequency' },
];

/** Equipment options */
const EQUIPMENT_OPTIONS: { value: EquipmentType; label: string; description: string }[] = [
  { value: 'full_gym', label: '🏋️ Full Gym', description: 'Barbells, dumbbells, cables, machines' },
  { value: 'home_gym', label: '🏠 Home Gym', description: 'Barbell, dumbbells, pull-up bar' },
  { value: 'dumbbells_only', label: '💪 Dumbbells Only', description: 'Dumbbell-based training' },
  { value: 'bodyweight', label: '🤸 Bodyweight', description: 'No equipment needed' },
  { value: 'resistance_bands', label: '🎯 Resistance Bands', description: 'Bands and bodyweight' },
];

/** Duration options */
const DURATION_OPTIONS: { value: 4 | 8 | 12; label: string; description: string }[] = [
  { value: 4, label: '4 Weeks', description: 'Short program' },
  { value: 8, label: '8 Weeks', description: 'Standard program' },
  { value: 12, label: '12 Weeks', description: 'Full program' },
];

/** Progress indicator for multi-step form */
function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <View style={styles.stepIndicator}>
      {Array.from({ length: total }).map((_, i) => (
        <View
          key={i}
          style={[
            styles.stepDot,
            i < current && styles.stepDotCompleted,
            i === current && styles.stepDotActive,
          ]}
        />
      ))}
    </View>
  );
}

/**
 * Multi-step form for generating an AI training plan.
 */
export default function GenerateTrainingPlanScreen() {
  const [step, setStep] = useState(0);
  const [goal, setGoal] = useState<FitnessGoal | undefined>();
  const [level, setLevel] = useState<ExperienceLevel | undefined>();
  const [frequency, setFrequency] = useState<TrainingFrequency | undefined>();
  const [equipment, setEquipment] = useState<EquipmentType | undefined>();
  const [duration, setDuration] = useState<4 | 8 | 12 | undefined>();

  const { mutate: generatePlan, isPending } = useGenerateTrainingPlan();

  const TOTAL_STEPS = 5;

  const canProceed = [
    !!goal,
    !!level,
    !!frequency,
    !!equipment,
    !!duration,
  ][step];

  const handleNext = () => {
    if (step < TOTAL_STEPS - 1) {
      setStep(step + 1);
    } else {
      handleGenerate();
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    } else {
      router.back();
    }
  };

  const handleGenerate = () => {
    if (!goal || !level || !frequency || !equipment || !duration) return;

    const request: GenerateTrainingPlanRequest = {
      goal,
      experience_level: level,
      frequency,
      equipment,
      duration_weeks: duration,
    };

    generatePlan(request, {
      onSuccess: (plan) => {
        router.replace(`/training-plans/${plan.id}`);
      },
      onError: (error) => {
        Alert.alert(
          'Generation Failed',
          error instanceof Error ? error.message : 'Failed to generate training plan. Please try again.',
          [{ text: 'OK' }]
        );
      },
    });
  };

  const stepTitles = ['Your Goal', 'Experience Level', 'Training Frequency', 'Equipment', 'Plan Duration'];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={handleBack}
          style={styles.backButton}
          accessibilityLabel="Go back"
          accessibilityRole="button"
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Generate Plan</Text>
          <Text style={styles.headerSubtitle}>Step {step + 1} of {TOTAL_STEPS}</Text>
        </View>
        <View style={styles.headerRight} />
      </View>

      <StepIndicator current={step} total={TOTAL_STEPS} />

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        <Text style={styles.stepTitle}>{stepTitles[step]}</Text>

        {step === 0 && (
          <OptionGroup
            label="What is your primary fitness goal?"
            options={GOAL_OPTIONS}
            value={goal}
            onChange={setGoal}
          />
        )}

        {step === 1 && (
          <OptionGroup
            label="What is your training experience level?"
            options={LEVEL_OPTIONS}
            value={level}
            onChange={setLevel}
          />
        )}

        {step === 2 && (
          <OptionGroup
            label="How many days per week can you train?"
            options={FREQUENCY_OPTIONS}
            value={frequency}
            onChange={setFrequency}
          />
        )}

        {step === 3 && (
          <OptionGroup
            label="What equipment do you have access to?"
            options={EQUIPMENT_OPTIONS}
            value={equipment}
            onChange={setEquipment}
          />
        )}

        {step === 4 && (
          <OptionGroup
            label="How long should your program be?"
            options={DURATION_OPTIONS}
            value={duration}
            onChange={(v) => setDuration(v as 4 | 8 | 12)}
          />
        )}
      </ScrollView>

      {/* Bottom action */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.nextButton, !canProceed && styles.nextButtonDisabled]}
          onPress={handleNext}
          disabled={!canProceed || isPending}
          accessibilityLabel={step === TOTAL_STEPS - 1 ? 'Generate my training plan' : 'Continue to next step'}
          accessibilityRole="button"
          accessibilityState={{ disabled: !canProceed || isPending }}
        >
          {isPending ? (
            <View style={styles.generatingButton}>
              <ActivityIndicator size="small" color="#ffffff" />
              <Text style={styles.nextButtonText}>Generating with AI...</Text>
            </View>
          ) : (
            <Text style={styles.nextButtonText}>
              {step === TOTAL_STEPS - 1 ? '🤖 Generate My Plan' : 'Continue →'}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f0f' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 60, paddingBottom: 12 },
  backButton: { width: 40, height: 40, justifyContent: 'center' },
  backButtonText: { color: '#3b82f6', fontSize: 20 },
  headerCenter: { alignItems: 'center' },
  headerTitle: { color: '#ffffff', fontSize: 17, fontWeight: '700' },
  headerSubtitle: { color: '#6b7280', fontSize: 12, marginTop: 2 },
  headerRight: { width: 40 },
  stepIndicator: { flexDirection: 'row', justifyContent: 'center', gap: 8, paddingVertical: 12 },
  stepDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#2a2a2a' },
  stepDotCompleted: { backgroundColor: '#1d4ed8' },
  stepDotActive: { backgroundColor: '#3b82f6', width: 24 },
  content: { flex: 1 },
  contentContainer: { padding: 16, paddingBottom: 32 },
  stepTitle: { fontSize: 22, fontWeight: '700', color: '#ffffff', marginBottom: 20 },
  optionGroup: { gap: 8 },
  optionGroupLabel: { color: '#9ca3af', fontSize: 14, marginBottom: 4 },
  optionList: { gap: 8 },
  optionItem: { backgroundColor: '#1a1a1a', borderRadius: 10, padding: 14, borderWidth: 1, borderColor: '#2a2a2a', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  optionItemSelected: { borderColor: '#3b82f6', backgroundColor: '#1a2940' },
  optionItemContent: { flex: 1 },
  optionItemLabel: { color: '#e5e7eb', fontSize: 15, fontWeight: '500' },
  optionItemLabelSelected: { color: '#ffffff' },
  optionItemDescription: { color: '#6b7280', fontSize: 12, marginTop: 2 },
  optionItemDescriptionSelected: { color: '#93c5fd' },
  checkmark: { color: '#3b82f6', fontSize: 16, fontWeight: '700' },
  footer: { padding: 16, paddingBottom: 32 },
  nextButton: { backgroundColor: '#3b82f6', borderRadius: 12, padding: 16, alignItems: 'center' },
  nextButtonDisabled: { backgroundColor: '#1f2937', opacity: 0.6 },
  nextButtonText: { color: '#ffffff', fontWeight: '700', fontSize: 16 },
  generatingButton: { flexDirection: 'row', gap: 10, alignItems: 'center' },
});
