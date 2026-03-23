import React from 'react';
import { Text, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/stores/auth';
import { supabase } from '@/lib/supabase';
import { SUBSCRIPTION_TIERS } from '@manlydude/shared';

/** Profile tab — user info, settings, subscription */
export default function ProfileScreen() {
  const { profile, session } = useAuthStore();
  const tier = profile?.subscription_tier || 'free';
  const tierInfo = SUBSCRIPTION_TIERS[tier];

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900" edges={['bottom']}>
      <ScrollView className="flex-1 px-4 pt-4" contentContainerStyle={{ paddingBottom: 20 }}>
        <Text className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">Profile</Text>

        {/* User Info */}
        <Card className="mb-4">
          <View className="items-center">
            <View className="mb-3 h-20 w-20 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900">
              <Text className="text-3xl">💪</Text>
            </View>
            <Text className="text-xl font-bold text-gray-900 dark:text-white">
              {profile?.full_name || 'ManlyDude User'}
            </Text>
            <Text className="text-gray-500 dark:text-gray-400">
              {session?.user?.email || 'Not signed in'}
            </Text>
          </View>
        </Card>

        {/* Subscription */}
        <Card className="mb-4">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Current Plan
              </Text>
              <Text className="text-xl font-bold text-gray-900 dark:text-white">
                {tierInfo.name}
              </Text>
              <Text className="text-sm text-gray-500 dark:text-gray-400">
                {tierInfo.price_monthly === 0
                  ? 'Free forever — like air, but for gains'
                  : `$${tierInfo.price_monthly}/month — money well spent on greatness`}
              </Text>
            </View>
            {tier === 'free' && (
              <Button title="Upgrade" variant="primary" />
            )}
          </View>
          {tier === 'free' && (
            <View className="mt-3 rounded-xl bg-blue-50 p-3 dark:bg-blue-900/20">
              <Text className="text-sm text-blue-700 dark:text-blue-300">
                Upgrade to Plus for AI training plans, strength scoring, and nutrition
                tracking. Your gains will level up exponentially. 📈
              </Text>
            </View>
          )}
        </Card>

        {/* Stats Summary */}
        <Card className="mb-4">
          <Text className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">
            Your Stats
          </Text>
          {[
            { label: 'Total Workouts', value: '0', icon: '🏋️' },
            { label: 'Total Volume', value: '0 kg', icon: '⚡' },
            { label: 'Current Streak', value: '0 days', icon: '🔥' },
            { label: 'Member Since', value: 'Just now', icon: '📅' },
          ].map((stat) => (
            <View
              key={stat.label}
              className="flex-row items-center justify-between border-b border-gray-100 py-3 last:border-0 dark:border-gray-700"
            >
              <Text className="text-gray-600 dark:text-gray-400">
                {stat.icon} {stat.label}
              </Text>
              <Text className="font-semibold text-gray-900 dark:text-white">{stat.value}</Text>
            </View>
          ))}
        </Card>

        {/* Settings Links */}
        <Card className="mb-4">
          <Text className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">
            Settings
          </Text>
          {[
            'Edit Profile',
            'Units & Preferences',
            'Notifications',
            'Connected Apps',
            'Privacy & Data',
          ].map((item) => (
            <View
              key={item}
              className="flex-row items-center justify-between border-b border-gray-100 py-3 last:border-0 dark:border-gray-700"
            >
              <Text className="text-gray-700 dark:text-gray-300">{item}</Text>
              <Text className="text-gray-400">→</Text>
            </View>
          ))}
        </Card>

        {session && (
          <View className="mb-4">
            <Button title="Sign Out" variant="outline" onPress={handleSignOut} />
          </View>
        )}

        <Text className="text-center text-xs text-gray-400">
          ManlyDude v1.0.0 — Made by men of men, for the most manliest of dudes
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
