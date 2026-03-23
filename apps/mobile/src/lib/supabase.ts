/**
 * Supabase client configured for React Native with secure token storage.
 */
import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

/** Custom storage adapter using Expo SecureStore for token persistence. */
const ExpoSecureStoreAdapter = {
  getItem: (key: string) => {
    return Platform.OS === 'web'
      ? localStorage.getItem(key)
      : SecureStore.getItemAsync(key);
  },
  setItem: (key: string, value: string) => {
    return Platform.OS === 'web'
      ? Promise.resolve(localStorage.setItem(key, value))
      : SecureStore.setItemAsync(key, value);
  },
  removeItem: (key: string) => {
    return Platform.OS === 'web'
      ? Promise.resolve(localStorage.removeItem(key))
      : SecureStore.deleteItemAsync(key);
  },
};

/** The Supabase URL from environment variables. */
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL ?? '';
/** The Supabase anon key from environment variables. */
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '';

/** Supabase client instance for use throughout the mobile app. */
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: ExpoSecureStoreAdapter as Parameters<typeof createClient>[2]['auth'] extends { storage?: infer S } ? S : never,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
