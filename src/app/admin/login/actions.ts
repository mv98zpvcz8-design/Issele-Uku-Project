"use server";

import { createClient } from "@/lib/supabase/server";
import { SUPABASE_CONFIGURED } from "@/lib/supabase/config";
import { siteConfig } from "@/lib/site-config";

export interface LoginActionState {
  status: "idle" | "sent" | "error";
  message?: string;
}

/**
 * Sends a passwordless magic-link email rather than using a password —
 * chosen so a non-technical administrator never has to manage, forget,
 * or reset a password (ADMIN_GUIDE.md). Anyone can request a link for
 * any email address (that's how magic links work), but a link is only
 * useful to whoever controls that inbox, and only pre-existing staff
 * accounts (created by an ADMIN — see profiles table) get an admin
 * profile on sign-in; everyone else just lands on an unprivileged
 * session with no access to anything under /admin.
 */
export async function requestMagicLink(
  _prevState: LoginActionState,
  formData: FormData,
): Promise<LoginActionState> {
  if (!SUPABASE_CONFIGURED) {
    return {
      status: "error",
      message: "The archive database isn't connected yet — sign-in isn't available. See DEPLOYMENT.md.",
    };
  }

  const email = formData.get("email");
  if (typeof email !== "string" || !email.includes("@")) {
    return { status: "error", message: "Enter a valid email address." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: `${siteConfig.url}/auth/callback?next=/admin` },
  });

  if (error) {
    return { status: "error", message: "Something went wrong sending the link. Please try again." };
  }

  return { status: "sent", message: `Check ${email} for a sign-in link.` };
}
