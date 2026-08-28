import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import type { Database } from "./types";

/**
 * Server-side Supabase client for use in Server Components, Server
 * Actions, and Route Handlers. Reads the caller's auth session from
 * cookies, so RLS policies see the real signed-in user (or no user, for
 * an anonymous request) — this is NOT the service-role client.
 *
 * Server Components can only read cookies, not write them; a `set`/
 * `remove` call from one is caught and ignored here rather than thrown,
 * matching the standard @supabase/ssr Next.js App Router pattern (the
 * session is refreshed by middleware/a Server Action instead).
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // Called from a Server Component, which can't set cookies.
            // Ignorable as long as session refresh also happens in
            // middleware or a Server Action (added in Phase 6).
          }
        },
      },
    },
  );
}
