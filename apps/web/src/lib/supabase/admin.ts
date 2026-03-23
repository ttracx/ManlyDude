/**
 * Supabase admin client using service role key.
 * For use in server-side operations only.
 */
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

/** Creates a Supabase admin client with service role permissions. */
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
