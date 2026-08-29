"use server";

import { createClient } from "@/lib/supabase/server";
import { SUPABASE_CONFIGURED } from "@/lib/supabase/config";

export interface SubmitActionState {
  status: "idle" | "sent" | "error";
  message?: string;
}

const MIN_SECONDS_BEFORE_SUBMIT = 4;

const GENERIC_THANKS =
  "Thank you — your submission has been received and will be reviewed by the project team.";

/**
 * No CAPTCHA or paid anti-spam service (cost/scope control) — instead a
 * honeypot field plus a minimum-fill-time check, both zero-dependency and
 * silent (a caught bot gets the same "success" message a real submitter
 * would, so it doesn't learn it was caught). See DECISIONS.md D-031.
 */
function looksLikeSpam(formData: FormData): boolean {
  const honeypot = String(formData.get("website") ?? "").trim();
  if (honeypot !== "") return true;

  const renderedAt = Number(formData.get("form_rendered_at"));
  if (!Number.isFinite(renderedAt)) return true;
  return Date.now() - renderedAt < MIN_SECONDS_BEFORE_SUBMIT * 1000;
}

export async function submitContribution(
  _prevState: SubmitActionState,
  formData: FormData,
): Promise<SubmitActionState> {
  if (!SUPABASE_CONFIGURED) {
    return {
      status: "error",
      message: "The archive database isn't connected yet — submissions aren't available. See DEPLOYMENT.md.",
    };
  }

  if (looksLikeSpam(formData)) {
    return { status: "sent", message: GENERIC_THANKS };
  }

  const submissionType = formData.get("submission_type");
  if (submissionType !== "correction" && submissionType !== "material") {
    return { status: "error", message: "Please choose what kind of submission this is." };
  }

  const message = String(formData.get("message") ?? "").trim();
  if (message.length < 20) {
    return { status: "error", message: "Please provide a bit more detail (at least 20 characters)." };
  }

  const submitterEmail = String(formData.get("submitter_email") ?? "").trim();
  if (submitterEmail && !submitterEmail.includes("@")) {
    return { status: "error", message: "Enter a valid email address, or leave it blank." };
  }

  if (
    formData.get("confirmed_ownership_or_permission") !== "on" ||
    formData.get("confirmed_understands_review") !== "on"
  ) {
    return { status: "error", message: "Please confirm both checkboxes before submitting." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("submissions").insert({
    submission_type: submissionType,
    related_archive_item_id: null,
    submitter_name: String(formData.get("submitter_name") ?? "").trim() || null,
    submitter_email: submitterEmail || null,
    message,
    attached_storage_path: null,
    confirmed_ownership_or_permission: true,
    confirmed_understands_review: true,
  });

  if (error) {
    return { status: "error", message: "Something went wrong sending this. Please try again." };
  }

  return { status: "sent", message: GENERIC_THANKS };
}
