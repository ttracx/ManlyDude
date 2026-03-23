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

        <Card className="mb-4">
          <Text className="text-lg font-semibold text-gray-900 dark:text-white">
            {profile?.full_name || 'ManlyDude User'}
          </Text>
          <Text className="text-gray-500 dark:text-gray-400">
            {session?.user?.email || 'Not signed in'}
          </Text>
        </Card>

        <Card className="mb-4">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-lg font-semibold text-gray-900 dark:text-white">
                {tierInfo.name} Plan
              </Text>
              <Text className="text-gray-500 dark:text-gray-400">
                {tierInfo.price_monthly === 0
                  ? 'Free forever'
                  : `$${tierInfo.price_monthly}/month`}
              </Text>
            </View>
            {tier === 'free' && <Button title="Upgrade" variant="primary" />}
          </View>
        </Card>

        {session && (
          <Button title="Sign Out" variant="outline" onPress={handleSignOut} />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
