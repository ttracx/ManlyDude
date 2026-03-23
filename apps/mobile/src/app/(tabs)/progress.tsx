import React from 'react';
import { Text, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '@/components/ui/Card';

/** Progress tab — charts, strength score, and stats */
export default function ProgressScreen() {
  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900" edges={['bottom']}>
      <ScrollView className="flex-1 px-4 pt-4" contentContainerStyle={{ paddingBottom: 20 }}>
        <Text className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">Progress</Text>

        {/* Strength Score Card */}
        <Card className="mb-4 items-center">
          <Text className="text-xs font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400">
            Strength Score
          </Text>
          <Text className="my-2 text-6xl font-black text-gray-900 dark:text-white">--</Text>
          <Text className="text-center text-sm text-gray-500 dark:text-gray-400">
            Complete workouts to unlock your Strength Score.{'\n'}
            One number to rule them all. 👑
          </Text>
        </Card>

        {/* Volume Card */}
        <Card className="mb-4">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-sm text-gray-500 dark:text-gray-400">Weekly Volume</Text>
              <Text className="text-3xl font-bold text-gray-900 dark:text-white">0 kg</Text>
            </View>
            <View>
              <Text className="text-sm text-gray-500 dark:text-gray-400">Workouts</Text>
              <Text className="text-3xl font-bold text-gray-900 dark:text-white">0</Text>
            </View>
            <View>
              <Text className="text-sm text-gray-500 dark:text-gray-400">Streak</Text>
              <Text className="text-3xl font-bold text-gray-900 dark:text-white">0 🔥</Text>
            </View>
          </View>
        </Card>

        {/* Volume Trends */}
        <Card className="mb-4">
          <Text className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
            📈 Volume Trends
          </Text>
          <View className="h-40 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-700">
            <Text className="text-gray-400">
              Charts will appear once you have enough data.{'\n'}
              Rome wasn&apos;t built in a day, but your physique can be.
            </Text>
          </View>
        </Card>

        {/* Personal Records */}
        <Card className="mb-4">
          <Text className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
            🏆 Personal Records
          </Text>
          <Text className="text-gray-500 dark:text-gray-400">
            Your PRs will be tracked automatically. Every time you hit a new max,
            we&apos;ll celebrate like it&apos;s the Super Bowl. Because it basically is.
          </Text>
        </Card>

        {/* Muscle Balance */}
        <Card>
          <Text className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
            🎯 Muscle Balance
          </Text>
          <Text className="text-gray-500 dark:text-gray-400">
            We&apos;ll analyze which muscles you&apos;re training and which ones are feeling
            neglected. Nobody wants lopsided gains, dude.
          </Text>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}
