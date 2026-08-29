import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SUPABASE_CONFIGURED } from "@/lib/supabase/config";
import type { UserRole } from "@/lib/supabase/types";

export interface AdminSession {
  userId: string;
  email: string | null;
  role: UserRole;
  fullName: string | null;
}

/**
 * Uses `auth.getUser()`, not `getSession()` — it revalidates the session
 * against the Supabase Auth server rather than trusting a local cookie,
 * which is what Supabase's own docs recommend before making any
 * server-side access decision.
 *
 * Returns null both when there's no session AND when there's a session
 * but no matching `profiles` row — the latter shouldn't happen (every
 * new auth.users row gets one via a trigger, see
 * 20260828120200_profiles_and_auth.sql) but is treated the same as "not
 * staff" defensively rather than crashing.
 */
export async function getAdminSession(): Promise<AdminSession | null> {
  // createClient() throws on empty URL/key rather than failing softly —
  // check first so "Supabase isn't connected yet" reads as null (no
  // session) rather than an unhandled crash.
  if (!SUPABASE_CONFIGURED) return null;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, full_name")
    .eq("id", user.id)
    .maybeSingle();
  if (!profile) return null;

  return { userId: user.id, email: user.email ?? null, role: profile.role, fullName: profile.full_name };
}

/** ADMIN/EDITOR can write; RESEARCHER/REVIEWER are read-only for now — see DECISIONS.md D-016. */
export function canEdit(role: UserRole): boolean {
  return role === "ADMIN" || role === "EDITOR";
}

/**
 * Guards a create/edit form PAGE (not just the server action it submits
 * to). Without this, a RESEARCHER/REVIEWER could open a full form, fill
 * it out, and hit submit only to be silently redirected by the action's
 * own requireEditor() check — RLS and the action guard already prevent
 * any actual write, but that's a confusing dead end for a non-technical
 * user with no explanation. Redirecting before they even see the form is
 * the honest version of the same guarantee.
 */
export async function requireEditorPage(redirectTo: string) {
  const session = await getAdminSession();
  if (!session || !canEdit(session.role)) {
    redirect(redirectTo);
  }
}
