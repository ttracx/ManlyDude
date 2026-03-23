import React from 'react';
import { Stack } from 'expo-router';

/** Auth flow layout — no tab bar */
export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }} />
  );
}
