"use client";

import { useActionState, useState } from "react";
import { submitContribution, type SubmitActionState } from "./actions";
import { SUPABASE_CONFIGURED } from "@/lib/supabase/config";

const initialState: SubmitActionState = { status: "idle" };

const inputClass = "mt-1 w-full rounded-md border border-line bg-paper px-3 py-2 text-sm text-ink";

export function SubmitForm() {
  const [state, formAction, pending] = useActionState(submitContribution, initialState);
  const [renderedAt] = useState(() => Date.now().toString());

  if (!SUPABASE_CONFIGURED) {
    return (
      <p className="mt-8 rounded-md border border-dashed border-line bg-paper-muted p-4 text-sm text-ink-soft">
        The archive database isn&apos;t connected yet, so submissions aren&apos;t available. This is
        expected during development — see DEPLOYMENT.md.
      </p>
    );
  }

  if (state.status === "sent") {
    return (
      <p className="mt-8 rounded-md border border-line bg-paper-muted p-4 text-ink">{state.message}</p>
    );
  }

  return (
    <form action={formAction} className="mt-8 space-y-5 rounded-lg border border-line bg-paper p-6">
      <input type="hidden" name="form_rendered_at" value={renderedAt} />

      {/* Honeypot: left blank by real visitors. Hidden from sighted and screen-reader users alike. */}
      <div className="sr-only" aria-hidden="true">
        <label htmlFor="website">Leave this field blank</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <fieldset>
        <legend className="text-xs font-medium text-ink-soft">What kind of submission is this?</legend>
        <div className="mt-2 space-y-2">
          <label className="flex items-center gap-2 text-sm text-ink">
            <input type="radio" name="submission_type" value="correction" defaultChecked className="h-4 w-4" />
            A correction to something already on the site
          </label>
          <label className="flex items-center gap-2 text-sm text-ink">
            <input type="radio" name="submission_type" value="material" className="h-4 w-4" />
            Material to contribute (photos, documents, oral history, etc.)
          </label>
        </div>
      </fieldset>

      <div>
        <label htmlFor="message" className="block text-xs font-medium text-ink-soft">
          Details
        </label>
        <p className="mt-1 text-xs text-ink-soft">
          For a correction: what&apos;s wrong, and what it should say instead (with a source if you
          have one). For material: describe what you have — we&apos;ll follow up by email to arrange
          secure transfer; please don&apos;t paste sensitive personal details here.
        </p>
        <textarea id="message" name="message" rows={6} required minLength={20} className={inputClass} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="submitter_name" className="block text-xs font-medium text-ink-soft">
            Your name (optional)
          </label>
          <input id="submitter_name" name="submitter_name" type="text" className={inputClass} />
        </div>
        <div>
          <label htmlFor="submitter_email" className="block text-xs font-medium text-ink-soft">
            Your email (optional, so we can follow up)
          </label>
          <input id="submitter_email" name="submitter_email" type="email" className={inputClass} />
        </div>
      </div>

      <div className="space-y-2">
        <label className="flex items-start gap-2 text-sm text-ink">
          <input
            type="checkbox"
            name="confirmed_ownership_or_permission"
            required
            className="mt-0.5 h-4 w-4 rounded border-line"
          />
          I confirm this information is mine to share, is in the public domain, or that I have
          permission to share it.
        </label>
        <label className="flex items-start gap-2 text-sm text-ink">
          <input
            type="checkbox"
            name="confirmed_understands_review"
            required
            className="mt-0.5 h-4 w-4 rounded border-line"
          />
          I understand this will be reviewed by the project team before anything is published, and
          it may be edited or declined.
        </label>
      </div>

      {state.status === "error" && (
        <p role="alert" className="text-sm text-accent">
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-md bg-ink px-4 py-2 text-sm font-semibold text-paper transition-colors hover:bg-accent disabled:opacity-60 sm:w-auto"
      >
        {pending ? "Sending…" : "Send submission"}
      </button>
    </form>
  );
}
