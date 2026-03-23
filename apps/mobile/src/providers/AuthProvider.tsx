import React from 'react';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';

/** Provider that initializes Supabase auth listener */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  useSupabaseAuth();
  return <>{children}</>;
}
