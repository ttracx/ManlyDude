import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/stores/auth';
import { useWorkoutStore } from '@/stores/workout';

/** Home / Dashboard screen */
export default function HomeScreen() {
  const profile = useAuthStore((s) => s.profile);
  const activeWorkout = useWorkoutStore((s) => s.activeWorkout);
  const startWorkout = useWorkoutStore((s) => s.startWorkout);

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900" edges={['bottom']}>
      <ScrollView className="flex-1 px-4 pt-4" contentContainerStyle={{ paddingBottom: 20 }}>
        <Text className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
          Welcome{profile?.full_name ? `, ${profile.full_name}` : ''}
        </Text>

        {activeWorkout ? (
          <Card className="mb-4 border-2 border-primary-500">
            <Text className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
              Workout in Progress
            </Text>
            <Text className="mb-3 text-gray-600 dark:text-gray-400">
              {activeWorkout.session.name} — {activeWorkout.sets.length} sets logged
            </Text>
            <Button title="Continue Workout" />
          </Card>
        ) : (
          <Card className="mb-4">
            <Text className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">
              Quick Start
            </Text>
            <Button title="Start Empty Workout" onPress={() => startWorkout('Quick Workout')} />
          </Card>
        )}

        <Card className="mb-4">
          <Text className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
            This Week
          </Text>
          <Text className="text-gray-600 dark:text-gray-400">
            Start logging workouts to see your weekly summary.
          </Text>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}
