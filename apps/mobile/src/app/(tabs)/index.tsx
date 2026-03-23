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

  const greetings = [
    'Time to become legendary',
    'Your muscles missed you',
    'The iron awaits, King',
    'Gains o\'clock',
    'Let\'s make the weights cry',
  ];
  const greeting = greetings[new Date().getDay() % greetings.length];

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900" edges={['bottom']}>
      <ScrollView className="flex-1 px-4 pt-4" contentContainerStyle={{ paddingBottom: 20 }}>
        <Text className="mb-1 text-2xl font-bold text-gray-900 dark:text-white">
          {profile?.full_name ? `What's up, ${profile.full_name}` : 'Welcome, Dude'}
        </Text>
        <Text className="mb-6 text-base text-gray-500 dark:text-gray-400">
          {greeting} 🔥
        </Text>

        {activeWorkout ? (
          <Card className="mb-4 border-2 border-primary-500">
            <Text className="mb-1 text-xs font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400">
              Workout in Progress
            </Text>
            <Text className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
              {activeWorkout.session.name}
            </Text>
            <Text className="mb-3 text-gray-600 dark:text-gray-400">
              {activeWorkout.sets.length} sets logged — keep crushing it
            </Text>
            <Button title="Continue Dominating" />
          </Card>
        ) : (
          <Card className="mb-4">
            <Text className="mb-1 text-xs font-bold uppercase tracking-wider text-orange-600">
              Ready to Lift?
            </Text>
            <Text className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">
              Every rep counts. Every set matters. Let&apos;s go.
            </Text>
            <Button title="Start Workout" onPress={() => startWorkout('Quick Workout')} />
          </Card>
        )}

        <Card className="mb-4">
          <Text className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
            📊 This Week&apos;s Gains Report
          </Text>
          <Text className="text-gray-600 dark:text-gray-400">
            Start logging workouts to unlock your weekly dominance summary.
            Your future self will thank you.
          </Text>
        </Card>

        <Card className="mb-4">
          <Text className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
            💡 Manly Tip of the Day
          </Text>
          <Text className="text-gray-600 dark:text-gray-400">
            Progressive overload isn&apos;t just about adding weight — it&apos;s about
            convincing gravity that you&apos;re in charge now.
          </Text>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}
