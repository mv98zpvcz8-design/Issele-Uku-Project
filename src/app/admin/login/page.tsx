"use client";

import { useActionState } from "react";
import { requestMagicLink, type LoginActionState } from "./actions";
import { SUPABASE_CONFIGURED } from "@/lib/supabase/config";

const initialState: LoginActionState = { status: "idle" };

export default function AdminLoginPage() {
  const [state, formAction, pending] = useActionState(requestMagicLink, initialState);

  return (
    <div className="flex min-h-screen items-center justify-center bg-paper-muted px-4">
      <div className="w-full max-w-sm rounded-lg border border-line bg-paper p-8">
        <p className="text-sm font-medium uppercase tracking-widest text-accent">Staff sign-in</p>
        <h1 className="mt-2 font-display text-2xl font-semibold text-ink">Oligbo Digital Archive</h1>
        <p className="mt-2 text-sm text-ink-soft">
          Enter your staff email and we&apos;ll send you a one-time sign-in link — no password
          needed.
        </p>

        {!SUPABASE_CONFIGURED ? (
          <p className="mt-6 rounded-md border border-dashed border-line bg-paper-muted p-4 text-sm text-ink-soft">
            The archive database isn&apos;t connected yet, so sign-in isn&apos;t available. This is
            expected during development — see DEPLOYMENT.md.
          </p>
        ) : state.status === "sent" ? (
          <p className="mt-6 rounded-md border border-line bg-paper-muted p-4 text-sm text-ink">
            {state.message}
          </p>
        ) : (
          <form action={formAction} className="mt-6 space-y-4">
            <div>
              <label htmlFor="email" className="block text-xs font-medium text-ink-soft">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className="mt-1 w-full rounded-md border border-line bg-paper px-3 py-2 text-sm text-ink"
              />
            </div>

            {state.status === "error" && (
              <p role="alert" className="text-sm text-accent">
                {state.message}
              </p>
            )}

            <button
              type="submit"
              disabled={pending}
              className="w-full rounded-md bg-ink px-4 py-2 text-sm font-semibold text-paper transition-colors hover:bg-accent disabled:opacity-60"
            >
              {pending ? "Sending…" : "Send sign-in link"}
            </button>
          </form>
        )}

        <p className="mt-6 text-xs text-ink-soft">
          Only accounts already set up by an administrator can access the admin area. If you
          believe you should have access, contact your project administrator.
        </p>
      </div>
    </div>
  );
}
