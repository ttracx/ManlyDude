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
      Alert.alert('Hold Up, Dude', error.message);
    } else {
      Alert.alert(
        'Welcome to the Brotherhood',
        'Check your email to confirm your account. The gains await.',
      );
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white px-6 dark:bg-gray-900">
      <View className="flex-1 justify-center">
        <Text className="mb-1 text-center text-4xl font-black text-gray-900 dark:text-white">
          MANLYDUDE
        </Text>
        <Text className="mb-2 text-center text-sm font-bold uppercase tracking-widest text-orange-500">
          Begin Your Legend
        </Text>
        <Text className="mb-8 text-center text-gray-500 dark:text-gray-400">
          Every champion started with a sign-up form
        </Text>

        <Input
          label="Your Name"
          placeholder="Chad Thunderlift"
          value={fullName}
          onChangeText={setFullName}
          autoComplete="name"
        />
        <Input
          label="Email"
          placeholder="legend@manlydude.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
        />
        <Input
          label="Password"
          placeholder="At least 8 characters of pure strength"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoComplete="new-password"
        />

        <Button title="Join the Brotherhood" onPress={handleRegister} loading={loading} />

        <View className="mt-6 flex-row justify-center">
          <Text className="text-gray-500 dark:text-gray-400">Already a dude? </Text>
          <Link href="/(auth)/login" asChild>
            <Text className="font-semibold text-primary-600">Sign In</Text>
          </Link>
        </View>

        <Text className="mt-8 text-center text-xs text-gray-400">
          By joining, you agree that gains are non-negotiable{'\n'}
          and leg day is not optional.
        </Text>
      </View>
    </SafeAreaView>
  );
}
