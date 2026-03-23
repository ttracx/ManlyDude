import React from 'react';
import { Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '@/components/ui/Card';

/** Progress tab — charts and stats */
export default function ProgressScreen() {
  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900" edges={['bottom']}>
      <ScrollView className="flex-1 px-4 pt-4" contentContainerStyle={{ paddingBottom: 20 }}>
        <Text className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">Progress</Text>

        <Card className="mb-4">
          <Text className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
            Strength Score
          </Text>
          <Text className="text-gray-500 dark:text-gray-400">
            Complete workouts to track your strength progress over time.
          </Text>
        </Card>

        <Card className="mb-4">
          <Text className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
            Volume Trends
          </Text>
          <Text className="text-gray-500 dark:text-gray-400">
            Charts will appear here once you have enough workout data.
          </Text>
        </Card>

        <Card>
          <Text className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
            Personal Records
          </Text>
          <Text className="text-gray-500 dark:text-gray-400">
            Your PRs for each exercise will be tracked automatically.
          </Text>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}
