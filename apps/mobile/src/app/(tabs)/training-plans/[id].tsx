/**
 * Training Plan detail screen.
 * Shows the full plan with week/day navigation and exercise details.
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
import { router, useLocalSearchParams } from 'expo-router';
import { useTrainingPlan, useUpdateTrainingPlan, useDeleteTrainingPlan } from '@/hooks/use-training-plans';
import type { TrainingDay, PlanExercise } from '@manlydude/shared';
import { getFitnessGoalLabel, getExperienceLevelLabel, getEquipmentLabel, getFrequencyLabel } from '@manlydude/shared';

/**
 * Renders a single exercise within the training day.
 */
function ExerciseCard({ exercise, index }: { exercise: PlanExercise; index: number }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <TouchableOpacity
      style={styles.exerciseCard}
      onPress={() => setExpanded(!expanded)}
      activeOpacity={0.8}
      accessibilityLabel={`${exercise.exercise_name}, tap to ${expanded ? 'collapse' : 'expand'}`}
      accessibilityRole="button"
      accessibilityState={{ expanded }}
    >
      <View style={styles.exerciseHeader}>
        <View style={styles.exerciseOrderBadge}>
          <Text style={styles.exerciseOrderText}>{index + 1}</Text>
        </View>
        <View style={styles.exerciseTitleContainer}>
          <Text style={styles.exerciseName}>{exercise.exercise_name}</Text>
          <Text style={styles.exerciseSetsLabel}>
            {exercise.sets.filter((s) => !s.is_warmup).length} sets
            {exercise.tempo ? ` · ${exercise.tempo} tempo` : ''}
          </Text>
        </View>
        <Text style={styles.expandIcon}>{expanded ? '▲' : '▼'}</Text>
      </View>

      {expanded && (
        <View style={styles.exerciseDetails}>
          {/* Sets table */}
          <View style={styles.setsTable}>
            <View style={styles.setsTableHeader}>
              <Text style={[styles.setsTableHeaderText, { flex: 0.5 }]}>Set</Text>
              <Text style={[styles.setsTableHeaderText, { flex: 1 }]}>Reps</Text>
              <Text style={[styles.setsTableHeaderText, { flex: 1 }]}>Weight</Text>
              <Text style={[styles.setsTableHeaderText, { flex: 1 }]}>Rest</Text>
              <Text style={[styles.setsTableHeaderText, { flex: 0.8 }]}>RPE</Text>
            </View>
            {exercise.sets.map((set) => (
              <View
                key={set.set_number}
                style={[styles.setsTableRow, set.is_warmup && styles.setsTableRowWarmup]}
              >
                <Text style={[styles.setsTableCell, { flex: 0.5 }]}>
                  {set.is_warmup ? 'W' : set.set_number}
                </Text>
                <Text style={[styles.setsTableCell, { flex: 1 }]}>
                  {set.reps ?? (set.duration_seconds ? `${set.duration_seconds}s` : '—')}
                </Text>
                <Text style={[styles.setsTableCell, { flex: 1 }]}>
                  {set.weight_kg ? `${set.weight_kg}kg` : 'BW'}
                </Text>
                <Text style={[styles.setsTableCell, { flex: 1 }]}>
                  {set.rest_seconds}s
                </Text>
                <Text style={[styles.setsTableCell, { flex: 0.8 }]}>
                  {set.rpe_target ?? '—'}
                </Text>
              </View>
            ))}
          </View>

          {/* Coaching notes */}
          {exercise.coaching_notes && (
            <View style={styles.coachingNotes}>
              <Text style={styles.coachingNotesLabel}>💡 Coach's Tips</Text>
              <Text style={styles.coachingNotesText}>{exercise.coaching_notes}</Text>
            </View>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
}

/**
 * Renders a training day detail view.
 */
function DayView({ day }: { day: TrainingDay }) {
  if (day.is_rest_day) {
    return (
      <View style={styles.restDayContainer}>
        <Text style={styles.restDayIcon}>😴</Text>
        <Text style={styles.restDayTitle}>Rest Day</Text>
        <Text style={styles.restDaySubtitle}>
          Recovery is essential for muscle growth and performance. Focus on sleep, hydration, and nutrition today.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.dayContainer}>
      {/* Day header */}
      <View style={styles.dayHeader}>
        <Text style={styles.dayName}>{day.name}</Text>
        <Text style={styles.dayDuration}>~{day.estimated_duration_minutes} min</Text>
      </View>

      {/* Focus muscles */}
      <View style={styles.focusChips}>
        {day.focus.map((muscle) => (
          <View key={muscle} style={styles.focusChip}>
            <Text style={styles.focusChipText}>
              {muscle.charAt(0).toUpperCase() + muscle.slice(1)}
            </Text>
          </View>
        ))}
      </View>

      {/* Warmup */}
      {day.warmup_notes && (
        <View style={styles.notesSection}>
          <Text style={styles.notesSectionTitle}>🔥 Warmup</Text>
          <Text style={styles.notesSectionText}>{day.warmup_notes}</Text>
        </View>
      )}

      {/* Exercises */}
      <Text style={styles.exercisesSectionTitle}>Exercises</Text>
      {day.exercises.map((exercise, idx) => (
        <ExerciseCard key={exercise.id} exercise={exercise} index={idx} />
      ))}

      {/* Cooldown */}
      {day.cooldown_notes && (
        <View style={styles.notesSection}>
          <Text style={styles.notesSectionTitle}>🧊 Cooldown</Text>
          <Text style={styles.notesSectionText}>{day.cooldown_notes}</Text>
        </View>
      )}
    </View>
  );
}

/**
 * Training Plan detail screen showing full plan with week/day navigation.
 */
export default function TrainingPlanDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: plan, isLoading, isError } = useTrainingPlan(id);
  const { mutate: updatePlan, isPending: isUpdating } = useUpdateTrainingPlan();
  const { mutate: deletePlan } = useDeleteTrainingPlan();

  const [selectedWeekIndex, setSelectedWeekIndex] = useState(0);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);

  const handleStartPlan = () => {
    if (!plan) return;
    updatePlan({
      id: plan.id,
      updates: { status: 'active', started_at: new Date().toISOString() },
    });
  };

  const handleDeletePlan = () => {
    if (!plan) return;
    Alert.alert(
      'Delete Plan',
      `Are you sure you want to delete "${plan.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deletePlan(plan.id, {
              onSuccess: () => router.back(),
            });
          },
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer} accessibilityLabel="Loading training plan">
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={styles.loadingText}>Loading plan...</Text>
      </View>
    );
  }

  if (isError || !plan) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Failed to load training plan.</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          accessibilityLabel="Go back"
          accessibilityRole="button"
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (plan.generation_status === 'generating') {
    return (
      <View style={styles.generatingContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={styles.generatingTitle}>Generating Your Plan</Text>
        <Text style={styles.generatingSubtitle}>
          Your AI coach is crafting a personalized training plan. This usually takes 30-60 seconds.
        </Text>
      </View>
    );
  }

  if (plan.generation_status === 'failed') {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>Generation Failed</Text>
        <Text style={styles.errorText}>{plan.generation_error ?? 'An error occurred during plan generation.'}</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          accessibilityLabel="Go back"
          accessibilityRole="button"
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const currentWeek = plan.weeks[selectedWeekIndex];
  const currentDay = currentWeek?.days[selectedDayIndex];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Back button */}
      <TouchableOpacity
        style={styles.backNav}
        onPress={() => router.back()}
        accessibilityLabel="Go back to training plans"
        accessibilityRole="button"
      >
        <Text style={styles.backNavText}>← Plans</Text>
      </TouchableOpacity>

      {/* Plan hero */}
      <View style={styles.planHero}>
        <Text style={styles.planName}>{plan.name}</Text>
        <Text style={styles.planDescription}>{plan.description}</Text>

        {/* Plan meta */}
        <View style={styles.planMeta}>
          <View style={styles.planMetaItem}>
            <Text style={styles.planMetaLabel}>Goal</Text>
            <Text style={styles.planMetaValue}>{getFitnessGoalLabel(plan.goal)}</Text>
          </View>
          <View style={styles.planMetaItem}>
            <Text style={styles.planMetaLabel}>Level</Text>
            <Text style={styles.planMetaValue}>{getExperienceLevelLabel(plan.experience_level)}</Text>
          </View>
          <View style={styles.planMetaItem}>
            <Text style={styles.planMetaLabel}>Frequency</Text>
            <Text style={styles.planMetaValue}>{getFrequencyLabel(plan.frequency)}</Text>
          </View>
          <View style={styles.planMetaItem}>
            <Text style={styles.planMetaLabel}>Duration</Text>
            <Text style={styles.planMetaValue}>{plan.duration_weeks} weeks</Text>
          </View>
        </View>

        {/* Coach intro */}
        {plan.coach_intro && (
          <View style={styles.coachIntro}>
            <Text style={styles.coachIntroLabel}>🤖 AI Coach</Text>
            <Text style={styles.coachIntroText}>{plan.coach_intro}</Text>
          </View>
        )}

        {/* Action buttons */}
        {plan.status !== 'active' && !plan.started_at && (
          <TouchableOpacity
            style={styles.startButton}
            onPress={handleStartPlan}
            disabled={isUpdating}
            accessibilityLabel="Start this training plan"
            accessibilityRole="button"
          >
            {isUpdating ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <Text style={styles.startButtonText}>Start This Plan</Text>
            )}
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.deletePlanButton}
          onPress={handleDeletePlan}
          accessibilityLabel="Delete this training plan"
          accessibilityRole="button"
        >
          <Text style={styles.deletePlanButtonText}>Delete Plan</Text>
        </TouchableOpacity>
      </View>

      {/* Week selector */}
      <View style={styles.weekSelector}>
        <Text style={styles.sectionLabel}>WEEK</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.weekSelectorContent}>
          {plan.weeks.map((week, idx) => (
            <TouchableOpacity
              key={week.week_number}
              style={[styles.weekTab, selectedWeekIndex === idx && styles.weekTabActive]}
              onPress={() => { setSelectedWeekIndex(idx); setSelectedDayIndex(0); }}
              accessibilityLabel={`Week ${week.week_number}: ${week.focus}`}
              accessibilityRole="tab"
              accessibilityState={{ selected: selectedWeekIndex === idx }}
            >
              <Text style={[styles.weekTabNumber, selectedWeekIndex === idx && styles.weekTabNumberActive]}>
                {week.week_number}
              </Text>
              <Text style={[styles.weekTabFocus, selectedWeekIndex === idx && styles.weekTabFocusActive]} numberOfLines={1}>
                {week.focus}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Week coaching notes */}
      {currentWeek?.coaching_notes && (
        <View style={styles.weekNotes}>
          <Text style={styles.weekNotesText}>{currentWeek.coaching_notes}</Text>
        </View>
      )}

      {/* Day selector */}
      {currentWeek && (
        <View style={styles.daySelector}>
          <Text style={styles.sectionLabel}>DAY</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.daySelectorContent}>
            {currentWeek.days.map((day, idx) => (
              <TouchableOpacity
                key={day.day_number}
                style={[
                  styles.dayTab,
                  selectedDayIndex === idx && styles.dayTabActive,
                  day.is_rest_day && styles.dayTabRest,
                ]}
                onPress={() => setSelectedDayIndex(idx)}
                accessibilityLabel={`Day ${day.day_number}: ${day.is_rest_day ? 'Rest' : day.name}`}
                accessibilityRole="tab"
                accessibilityState={{ selected: selectedDayIndex === idx }}
              >
                <Text style={[styles.dayTabNumber, selectedDayIndex === idx && styles.dayTabNumberActive]}>
                  {day.day_number}
                </Text>
                <Text style={[styles.dayTabLabel, selectedDayIndex === idx && styles.dayTabLabelActive]}>
                  {day.is_rest_day ? 'Rest' : 'Train'}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Day content */}
      {currentDay && <DayView day={currentDay} />}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f0f' },
  backNav: { paddingHorizontal: 16, paddingTop: 60, paddingBottom: 8 },
  backNavText: { color: '#3b82f6', fontSize: 16 },
  planHero: { padding: 16 },
  planName: { fontSize: 24, fontWeight: '700', color: '#ffffff', marginBottom: 8 },
  planDescription: { fontSize: 14, color: '#9ca3af', lineHeight: 20, marginBottom: 16 },
  planMeta: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 16 },
  planMetaItem: { minWidth: '40%' },
  planMetaLabel: { color: '#6b7280', fontSize: 11, fontWeight: '500', textTransform: 'uppercase', letterSpacing: 0.5 },
  planMetaValue: { color: '#e5e7eb', fontSize: 14, fontWeight: '500', marginTop: 2 },
  coachIntro: { backgroundColor: '#1a2940', borderRadius: 10, padding: 14, marginBottom: 16, borderLeftWidth: 3, borderLeftColor: '#3b82f6' },
  coachIntroLabel: { color: '#3b82f6', fontSize: 12, fontWeight: '600', marginBottom: 4 },
  coachIntroText: { color: '#bfdbfe', fontSize: 14, lineHeight: 20 },
  startButton: { backgroundColor: '#3b82f6', borderRadius: 10, padding: 14, alignItems: 'center', marginBottom: 8 },
  startButtonText: { color: '#ffffff', fontWeight: '700', fontSize: 16 },
  deletePlanButton: { padding: 10, alignItems: 'center' },
  deletePlanButtonText: { color: '#ef4444', fontSize: 14 },
  weekSelector: { paddingHorizontal: 16, paddingTop: 16 },
  weekSelectorContent: { gap: 8, paddingBottom: 8 },
  sectionLabel: { color: '#6b7280', fontSize: 11, fontWeight: '600', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 },
  weekTab: { alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8, backgroundColor: '#1a1a1a', borderRadius: 10, minWidth: 70, borderWidth: 1, borderColor: '#2a2a2a' },
  weekTabActive: { backgroundColor: '#1d4ed8', borderColor: '#3b82f6' },
  weekTabNumber: { fontSize: 18, fontWeight: '700', color: '#ffffff' },
  weekTabNumberActive: { color: '#ffffff' },
  weekTabFocus: { fontSize: 10, color: '#6b7280', marginTop: 2 },
  weekTabFocusActive: { color: '#bfdbfe' },
  weekNotes: { marginHorizontal: 16, backgroundColor: '#1a1a1a', borderRadius: 8, padding: 12, marginTop: 8 },
  weekNotesText: { color: '#9ca3af', fontSize: 13, lineHeight: 18 },
  daySelector: { paddingHorizontal: 16, paddingTop: 16 },
  daySelectorContent: { gap: 6, paddingBottom: 8 },
  dayTab: { alignItems: 'center', paddingHorizontal: 10, paddingVertical: 8, backgroundColor: '#1a1a1a', borderRadius: 8, minWidth: 50, borderWidth: 1, borderColor: '#2a2a2a' },
  dayTabActive: { backgroundColor: '#1d4ed8', borderColor: '#3b82f6' },
  dayTabRest: { opacity: 0.6 },
  dayTabNumber: { fontSize: 16, fontWeight: '700', color: '#ffffff' },
  dayTabNumberActive: { color: '#ffffff' },
  dayTabLabel: { fontSize: 10, color: '#6b7280', marginTop: 2 },
  dayTabLabelActive: { color: '#bfdbfe' },
  dayContainer: { padding: 16 },
  dayHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  dayName: { fontSize: 18, fontWeight: '600', color: '#ffffff', flex: 1 },
  dayDuration: { color: '#3b82f6', fontSize: 13, fontWeight: '500' },
  focusChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 16 },
  focusChip: { backgroundColor: '#1e3a5f', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  focusChipText: { color: '#93c5fd', fontSize: 12, fontWeight: '500' },
  notesSection: { backgroundColor: '#1a1a1a', borderRadius: 8, padding: 12, marginBottom: 16 },
  notesSectionTitle: { color: '#f59e0b', fontSize: 13, fontWeight: '600', marginBottom: 4 },
  notesSectionText: { color: '#9ca3af', fontSize: 13, lineHeight: 18 },
  exercisesSectionTitle: { fontSize: 16, fontWeight: '600', color: '#ffffff', marginBottom: 12 },
  exerciseCard: { backgroundColor: '#1a1a1a', borderRadius: 10, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: '#2a2a2a' },
  exerciseHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  exerciseOrderBadge: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#1d4ed8', justifyContent: 'center', alignItems: 'center' },
  exerciseOrderText: { color: '#ffffff', fontSize: 13, fontWeight: '700' },
  exerciseTitleContainer: { flex: 1 },
  exerciseName: { color: '#ffffff', fontSize: 15, fontWeight: '600' },
  exerciseSetsLabel: { color: '#6b7280', fontSize: 12, marginTop: 2 },
  expandIcon: { color: '#6b7280', fontSize: 12 },
  exerciseDetails: { marginTop: 14 },
  setsTable: { backgroundColor: '#111111', borderRadius: 8, overflow: 'hidden', marginBottom: 12 },
  setsTableHeader: { flexDirection: 'row', padding: 8, backgroundColor: '#0a0a0a' },
  setsTableHeaderText: { color: '#6b7280', fontSize: 11, fontWeight: '600', textTransform: 'uppercase' },
  setsTableRow: { flexDirection: 'row', padding: 8, borderTopWidth: 1, borderTopColor: '#1f1f1f' },
  setsTableRowWarmup: { opacity: 0.7 },
  setsTableCell: { color: '#e5e7eb', fontSize: 13 },
  coachingNotes: { backgroundColor: '#1a2940', borderRadius: 8, padding: 10 },
  coachingNotesLabel: { color: '#3b82f6', fontSize: 12, fontWeight: '600', marginBottom: 4 },
  coachingNotesText: { color: '#bfdbfe', fontSize: 13, lineHeight: 18 },
  restDayContainer: { padding: 40, alignItems: 'center' },
  restDayIcon: { fontSize: 64, marginBottom: 16 },
  restDayTitle: { fontSize: 22, fontWeight: '700', color: '#ffffff', marginBottom: 8 },
  restDaySubtitle: { color: '#9ca3af', fontSize: 14, textAlign: 'center', lineHeight: 20 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0f0f0f', gap: 12 },
  loadingText: { color: '#9ca3af', fontSize: 14 },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0f0f0f', padding: 24 },
  errorTitle: { fontSize: 20, fontWeight: '700', color: '#ffffff', marginBottom: 8 },
  errorText: { color: '#ef4444', fontSize: 15, textAlign: 'center', marginBottom: 16 },
  backButton: { backgroundColor: '#3b82f6', paddingHorizontal: 24, paddingVertical: 10, borderRadius: 8 },
  backButtonText: { color: '#ffffff', fontWeight: '600' },
  generatingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0f0f0f', padding: 32, gap: 16 },
  generatingTitle: { fontSize: 22, fontWeight: '700', color: '#ffffff', textAlign: 'center' },
  generatingSubtitle: { color: '#9ca3af', fontSize: 15, textAlign: 'center', lineHeight: 22 },
});
