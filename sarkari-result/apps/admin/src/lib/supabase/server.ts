/**
 * Supabase server-side client for the admin Next.js app.
 * Uses cookie-based SSR as recommended by Supabase for Next.js.
 * The secret key is SERVER-ONLY — never accessible to the browser.
 */
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: Array<{ name: string; value: string; options?: any }>) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        },
      },
    }
  );
}

/**
 * Admin privileged client — uses the secret service role key.
 * Used only in Server Actions and Route Handlers.
 * NEVER import this in client components or middleware.
 */
import { createClient } from '@supabase/supabase-js';

export function createSupabaseAdminClient() {
  return createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!, // SERVER-ONLY
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
