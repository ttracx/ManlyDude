/**
 * Training Plans list screen.
 * Shows all user training plans with status filters.
 * Plus/Premium tier feature.
 */
import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  RefreshControl,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { useTrainingPlans, useDeleteTrainingPlan } from '@/hooks/use-training-plans';
import { useTrainingPlansStore } from '@/store/training-plans-store';
import type { TrainingPlanSummary } from '@manlydude/shared';
import { getFitnessGoalLabel, getFrequencyLabel } from '@manlydude/shared';

/** Status filter chip options */
const STATUS_FILTERS = [
  { label: 'All', value: undefined },
  { label: 'Active', value: 'active' as const },
  { label: 'Paused', value: 'paused' as const },
  { label: 'Completed', value: 'completed' as const },
];

/** Color mapping for plan status badges */
const STATUS_COLORS: Record<string, string> = {
  active: '#22c55e',
  paused: '#f59e0b',
  completed: '#3b82f6',
  archived: '#6b7280',
};

/**
 * Training plan card component displayed in the list.
 */
function TrainingPlanCard({
  plan,
  onPress,
  onDelete,
}: {
  plan: TrainingPlanSummary;
  onPress: () => void;
  onDelete: () => void;
}) {
  const statusColor = STATUS_COLORS[plan.status] ?? '#6b7280';
  const isGenerating = plan.generation_status === 'generating';

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityLabel={`${plan.name} training plan, ${plan.status}`}
      accessibilityRole="button"
    >
      <View style={styles.cardHeader}>
        <View style={styles.cardTitleRow}>
          <Text style={styles.cardTitle} numberOfLines={1}>
            {isGenerating ? 'Generating your plan...' : plan.name}
          </Text>
          <View style={[styles.statusBadge, { backgroundColor: statusColor + '20', borderColor: statusColor }]}>
            <Text style={[styles.statusText, { color: statusColor }]}>
              {plan.status.charAt(0).toUpperCase() + plan.status.slice(1)}
            </Text>
          </View>
        </View>

        {isGenerating && (
          <View style={styles.generatingRow}>
            <ActivityIndicator size="small" color="#3b82f6" />
            <Text style={styles.generatingText}>AI is building your plan...</Text>
          </View>
        )}

        {!isGenerating && (
          <Text style={styles.cardDescription} numberOfLines={2}>
            {plan.description}
          </Text>
        )}
      </View>

      <View style={styles.cardMeta}>
        <View style={styles.metaItem}>
          <Text style={styles.metaLabel}>Goal</Text>
          <Text style={styles.metaValue}>{getFitnessGoalLabel(plan.goal)}</Text>
        </View>
        <View style={styles.metaItem}>
          <Text style={styles.metaLabel}>Frequency</Text>
          <Text style={styles.metaValue}>{getFrequencyLabel(plan.frequency)}</Text>
        </View>
        <View style={styles.metaItem}>
          <Text style={styles.metaLabel}>Duration</Text>
          <Text style={styles.metaValue}>{plan.duration_weeks} weeks</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={onDelete}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        accessibilityLabel={`Delete ${plan.name}`}
        accessibilityRole="button"
      >
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

/**
 * Empty state component shown when no plans exist.
 */
function EmptyState({ onGenerate }: { onGenerate: () => void }) {
  return (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateIcon}>🏋️</Text>
      <Text style={styles.emptyStateTitle}>No Training Plans Yet</Text>
      <Text style={styles.emptyStateSubtitle}>
        Generate your first AI-powered training plan tailored to your goals and schedule.
      </Text>
      <TouchableOpacity
        style={styles.generateButton}
        onPress={onGenerate}
        accessibilityLabel="Generate your first training plan"
        accessibilityRole="button"
      >
        <Text style={styles.generateButtonText}>Generate My Plan</Text>
      </TouchableOpacity>
    </View>
  );
}

/**
 * Training Plans list screen.
 * Displays all training plans with filtering by status.
 */
export default function TrainingPlansScreen() {
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const { data, isLoading, isError, refetch } = useTrainingPlans(statusFilter);
  const { mutate: deletePlan } = useDeleteTrainingPlan();
  const { setIsGenerateModalOpen } = useTrainingPlansStore();

  const plans = data?.data ?? [];

  const handlePlanPress = useCallback((plan: TrainingPlanSummary) => {
    router.push(`/training-plans/${plan.id}`);
  }, []);

  const handleDeletePlan = useCallback((plan: TrainingPlanSummary) => {
    Alert.alert(
      'Delete Plan',
      `Are you sure you want to delete "${plan.name}"? This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deletePlan(plan.id),
        },
      ]
    );
  }, [deletePlan]);

  const handleGeneratePress = useCallback(() => {
    router.push('/training-plans/generate');
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer} accessibilityLabel="Loading training plans">
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={styles.loadingText}>Loading plans...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Failed to load training plans.</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => refetch()}
          accessibilityLabel="Retry loading training plans"
          accessibilityRole="button"
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Training Plans</Text>
        <TouchableOpacity
          style={styles.newPlanButton}
          onPress={handleGeneratePress}
          accessibilityLabel="Generate new training plan"
          accessibilityRole="button"
        >
          <Text style={styles.newPlanButtonText}>+ New Plan</Text>
        </TouchableOpacity>
      </View>

      {/* Status filter chips */}
      <View style={styles.filterRow}>
        {STATUS_FILTERS.map((filter) => (
          <TouchableOpacity
            key={filter.label}
            style={[
              styles.filterChip,
              statusFilter === filter.value && styles.filterChipActive,
            ]}
            onPress={() => setStatusFilter(filter.value)}
            accessibilityLabel={`Filter by ${filter.label}`}
            accessibilityRole="button"
            accessibilityState={{ selected: statusFilter === filter.value }}
          >
            <Text
              style={[
                styles.filterChipText,
                statusFilter === filter.value && styles.filterChipTextActive,
              ]}
            >
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Plans list */}
      <FlatList
        data={plans}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TrainingPlanCard
            plan={item}
            onPress={() => handlePlanPress(item)}
            onDelete={() => handleDeletePlan(item)}
          />
        )}
        ListEmptyComponent={<EmptyState onGenerate={handleGeneratePress} />}
        contentContainerStyle={plans.length === 0 ? styles.emptyListContent : styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={refetch}
            tintColor="#3b82f6"
            accessibilityLabel="Pull to refresh training plans"
          />
        }
        showsVerticalScrollIndicator={false}
        accessibilityLabel="Training plans list"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f0f',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#ffffff',
  },
  newPlanButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  newPlanButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#1f1f1f',
    borderWidth: 1,
    borderColor: '#374151',
  },
  filterChipActive: {
    backgroundColor: '#1d4ed8',
    borderColor: '#3b82f6',
  },
  filterChipText: {
    color: '#9ca3af',
    fontSize: 13,
    fontWeight: '500',
  },
  filterChipTextActive: {
    color: '#ffffff',
  },
  listContent: {
    padding: 16,
    gap: 12,
  },
  emptyListContent: {
    flex: 1,
    padding: 16,
  },
  card: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  cardHeader: {
    marginBottom: 12,
  },
  cardTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    flex: 1,
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    borderWidth: 1,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  generatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  generatingText: {
    color: '#9ca3af',
    fontSize: 13,
    fontStyle: 'italic',
  },
  cardDescription: {
    color: '#9ca3af',
    fontSize: 13,
    lineHeight: 18,
    marginTop: 4,
  },
  cardMeta: {
    flexDirection: 'row',
    gap: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#2a2a2a',
  },
  metaItem: {
    flex: 1,
  },
  metaLabel: {
    color: '#6b7280',
    fontSize: 11,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  metaValue: {
    color: '#e5e7eb',
    fontSize: 13,
    fontWeight: '500',
    marginTop: 2,
  },
  deleteButton: {
    alignSelf: 'flex-end',
    marginTop: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  deleteButtonText: {
    color: '#ef4444',
    fontSize: 13,
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0f0f0f',
    gap: 12,
  },
  loadingText: {
    color: '#9ca3af',
    fontSize: 14,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0f0f0f',
    padding: 24,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  emptyStateIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateSubtitle: {
    fontSize: 15,
    color: '#9ca3af',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  generateButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 10,
  },
  generateButtonText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 16,
  },
});
