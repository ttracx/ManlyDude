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

        {/* Quick Start Cards */}
        <Text className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-500">
          Quick Start
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-6">
          {[
            { name: 'Push Day', desc: 'Chest, shoulders, tris', emoji: '🫸' },
            { name: 'Pull Day', desc: 'Back, biceps, rear delts', emoji: '🫷' },
            { name: 'Leg Day', desc: 'Quads, hams, glutes', emoji: '🦵' },
            { name: 'Full Body', desc: 'The whole enchilada', emoji: '🔥' },
          ].map((template) => (
            <Card key={template.name} className="mr-3 w-40">
              <Text className="text-2xl">{template.emoji}</Text>
              <Text className="mt-2 font-bold text-gray-900 dark:text-white">
                {template.name}
              </Text>
              <Text className="text-xs text-gray-500 dark:text-gray-400">{template.desc}</Text>
            </Card>
          ))}
        </ScrollView>

        <Text className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-500">
          Your Templates
        </Text>
        <Card className="mb-4">
          <Text className="text-center text-gray-500 dark:text-gray-400">
            No custom templates yet. Create your own or let the AI forge one from the
            fires of sports science. 🔨
          </Text>
          <View className="mt-3">
            <Button title="Create Template" variant="outline" />
          </View>
        </Card>

        <Text className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-500">
          Recent History
        </Text>
        <Card>
          <Text className="text-center text-gray-500 dark:text-gray-400">
            Your workout history will appear here once you complete your first session.
            The path to greatness starts with a single rep. 💪
          </Text>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}
