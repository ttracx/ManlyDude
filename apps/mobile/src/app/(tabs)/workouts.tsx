import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useWorkoutStore } from '@/stores/workout';

/** Workouts tab — workout templates and history */
export default function WorkoutsScreen() {
  const startWorkout = useWorkoutStore((s) => s.startWorkout);

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900" edges={['bottom']}>
      <ScrollView className="flex-1 px-4 pt-4" contentContainerStyle={{ paddingBottom: 20 }}>
        <View className="mb-6 flex-row items-center justify-between">
          <Text className="text-2xl font-bold text-gray-900 dark:text-white">Workouts</Text>
          <Button
            title="+ New"
            variant="primary"
            onPress={() => startWorkout('New Workout')}
          />
        </View>

        <Text className="mb-3 text-lg font-semibold text-gray-700 dark:text-gray-300">
          Templates
        </Text>
        <Card className="mb-4">
          <Text className="text-gray-500 dark:text-gray-400">
            No workout templates yet. Create your first template or let AI generate one.
          </Text>
        </Card>

        <Text className="mb-3 text-lg font-semibold text-gray-700 dark:text-gray-300">
          History
        </Text>
        <Card>
          <Text className="text-gray-500 dark:text-gray-400">
            No workout history yet. Complete your first workout to see it here.
          </Text>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}
