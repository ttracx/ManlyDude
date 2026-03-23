import React from 'react';
import { View, Text } from 'react-native';
import { Link, Stack } from 'expo-router';

/** Catch-all screen for unmatched routes */
export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Not Found' }} />
      <View className="flex-1 items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Text className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
          Screen not found
        </Text>
        <Link href="/" className="text-primary-600">
          Go to home
        </Link>
      </View>
    </>
  );
}
