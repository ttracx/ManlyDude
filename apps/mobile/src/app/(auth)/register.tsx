import React, { useState } from 'react';
import { View, Text, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link } from 'expo-router';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { supabase } from '@/lib/supabase';

/** Registration screen */
export default function RegisterScreen() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!email || !password) return;
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    });
    setLoading(false);
    if (error) {
      Alert.alert('Error', error.message);
    } else {
      Alert.alert('Success', 'Check your email to confirm your account.');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white px-6 dark:bg-gray-900">
      <View className="flex-1 justify-center">
        <Text className="mb-2 text-center text-3xl font-bold text-gray-900 dark:text-white">
          Get Started
        </Text>
        <Text className="mb-8 text-center text-gray-500 dark:text-gray-400">
          Create your ManlyDude account
        </Text>

        <Input
          label="Full Name"
          placeholder="John Doe"
          value={fullName}
          onChangeText={setFullName}
          autoComplete="name"
        />
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
          placeholder="At least 8 characters"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoComplete="new-password"
        />

        <Button title="Create Account" onPress={handleRegister} loading={loading} />

        <View className="mt-4 flex-row justify-center">
          <Text className="text-gray-500 dark:text-gray-400">Already have an account? </Text>
          <Link href="/(auth)/login" asChild>
            <Text className="font-semibold text-primary-600">Sign In</Text>
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
}
