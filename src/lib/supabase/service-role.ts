import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./types";

/**
 * Service-role client: bypasses Row Level Security entirely. The
 * `server-only` import makes any accidental import from client code a
 * build-time error, not just a runtime mistake.
 *
 * Use ONLY for admin operations that must legitimately bypass RLS after
 * the caller's role has already been checked in application code (e.g.
 * publishing a record) — never as a shortcut to avoid writing a proper
 * RLS policy. Most admin reads/writes should go through the regular
 * server client (server.ts) instead, so RLS still applies.
 */
export function createServiceRoleClient() {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
}
