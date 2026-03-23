import React, { useState } from 'react';
import { View, Text, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link } from 'expo-router';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { supabase } from '@/lib/supabase';

/** Login screen */
export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) return;
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) Alert.alert('Error', error.message);
  };

  return (
    <SafeAreaView className="flex-1 bg-white px-6 dark:bg-gray-900">
      <View className="flex-1 justify-center">
        <Text className="mb-2 text-center text-3xl font-bold text-gray-900 dark:text-white">
          ManlyDude
        </Text>
        <Text className="mb-8 text-center text-gray-500 dark:text-gray-400">
          Sign in to your account
        </Text>

        <Input
          label="Email"
          placeholder="you@example.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
        />
        <Input
          label="Password"
          placeholder="Your password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoComplete="password"
        />

        <Button title="Sign In" onPress={handleLogin} loading={loading} />

        <View className="mt-4 flex-row justify-center">
          <Text className="text-gray-500 dark:text-gray-400">Don't have an account? </Text>
          <Link href="/(auth)/register" asChild>
            <Text className="font-semibold text-primary-600">Sign Up</Text>
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
}
