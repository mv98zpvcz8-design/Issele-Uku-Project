"use client";

import { useActionState } from "react";
import { requestMagicLink, signInWithPassword, type LoginActionState } from "./actions";
import { SUPABASE_CONFIGURED } from "@/lib/supabase/config";

const initialState: LoginActionState = { status: "idle" };
const inputClass = "mt-1 w-full rounded-md border border-line bg-paper px-3 py-2 text-sm text-ink";

export default function AdminLoginPage() {
  const [passwordState, passwordAction, passwordPending] = useActionState(signInWithPassword, initialState);
  const [linkState, linkAction, linkPending] = useActionState(requestMagicLink, initialState);

  return (
    <div className="flex min-h-screen items-center justify-center bg-paper-muted px-4">
      <div className="w-full max-w-sm rounded-lg border border-line bg-paper p-8">
        <p className="text-sm font-medium uppercase tracking-widest text-accent">Staff sign-in</p>
        <h1 className="mt-2 font-display text-2xl font-semibold text-ink">Oligbo Digital Archive</h1>

        {!SUPABASE_CONFIGURED ? (
          <p className="mt-6 rounded-md border border-dashed border-line bg-paper-muted p-4 text-sm text-ink-soft">
            The archive database isn&apos;t connected yet, so sign-in isn&apos;t available. This is
            expected during development — see DEPLOYMENT.md.
          </p>
        ) : (
          <>
            <form action={passwordAction} className="mt-6 space-y-4">
              <div>
                <label htmlFor="password-email" className="block text-xs font-medium text-ink-soft">
                  Email address
                </label>
                <input
                  id="password-email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-xs font-medium text-ink-soft">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  className={inputClass}
                />
              </div>

              {passwordState.status === "error" && (
                <p role="alert" className="text-sm text-accent">
                  {passwordState.message}
                </p>
              )}

              <button
                type="submit"
                disabled={passwordPending}
                className="w-full rounded-md bg-ink px-4 py-2 text-sm font-semibold text-paper transition-colors hover:bg-accent disabled:opacity-60"
              >
                {passwordPending ? "Signing in…" : "Sign in"}
              </button>
            </form>

            <div className="my-6 flex items-center gap-3 text-xs text-ink-soft">
              <span className="h-px flex-1 bg-line" />
              or
              <span className="h-px flex-1 bg-line" />
            </div>

            {linkState.status === "sent" ? (
              <p className="rounded-md border border-line bg-paper-muted p-4 text-sm text-ink">
                {linkState.message}
              </p>
            ) : (
              <form action={linkAction} className="space-y-3">
                <div>
                  <label htmlFor="link-email" className="block text-xs font-medium text-ink-soft">
                    Email address (no password needed)
                  </label>
                  <input id="link-email" name="email" type="email" required autoComplete="email" className={inputClass} />
                </div>

                {linkState.status === "error" && (
                  <p role="alert" className="text-sm text-accent">
                    {linkState.message}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={linkPending}
                  className="w-full rounded-md border border-line px-4 py-2 text-sm font-medium text-ink hover:border-accent hover:text-accent disabled:opacity-60"
                >
                  {linkPending ? "Sending…" : "Email me a sign-in link"}
                </button>
              </form>
            )}
          </>
        )}

        <p className="mt-6 text-xs text-ink-soft">
          Only accounts already set up by an administrator can access the admin area. If you
          believe you should have access, contact your project administrator.
        </p>
      </div>
    </div>
  );
}
