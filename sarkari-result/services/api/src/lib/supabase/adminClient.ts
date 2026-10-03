/**
 * Supabase admin client — SERVER-ONLY.
 * Uses the secret service role key which bypasses RLS.
 * This file must NEVER be imported by client-side or Next.js browser code.
 */
import { createClient } from '@supabase/supabase-js';
import { config } from '../../config';

export const supabaseAdmin = createClient(
  config.SUPABASE_URL,
  config.SUPABASE_SECRET_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);
