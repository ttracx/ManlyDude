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
    if (error) Alert.alert('Hold Up, Dude', error.message);
  };

  return (
    <SafeAreaView className="flex-1 bg-white px-6 dark:bg-gray-900">
      <View className="flex-1 justify-center">
        <Text className="mb-1 text-center text-4xl font-black text-gray-900 dark:text-white">
          MANLYDUDE
        </Text>
        <Text className="mb-2 text-center text-sm font-bold uppercase tracking-widest text-primary-600">
          Welcome Back, King
        </Text>
        <Text className="mb-8 text-center text-gray-500 dark:text-gray-400">
          The weights have been waiting for you
        </Text>

        <Input
          label="Email"
          placeholder="chad@manlydude.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
        />
        <Input
          label="Password"
          placeholder="Something strong (like you)"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoComplete="password"
        />

        <Button title="Enter the Gym" onPress={handleLogin} loading={loading} />

        <View className="mt-6 flex-row justify-center">
          <Text className="text-gray-500 dark:text-gray-400">New to the brotherhood? </Text>
          <Link href="/(auth)/register" asChild>
            <Text className="font-semibold text-primary-600">Join Now</Text>
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
}
