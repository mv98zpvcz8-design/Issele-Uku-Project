import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getAdminSession, canEdit, canReview } from "@/lib/admin/session";
import { SubmissionStatusBadge } from "@/components/admin/SubmissionStatusBadge";
import { SelectField, TextAreaField } from "@/components/admin/fields";
import { SUBMISSION_STATUS_OPTIONS } from "@/lib/admin/options";
import { ConfirmSubmitButton } from "@/components/admin/ConfirmSubmitButton";
import { updateSubmissionReview, deleteSubmission } from "../actions";

export default async function AdminSubmissionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getAdminSession();
  const supabase = await createClient();
  const { data: submission } = await supabase.from("submissions").select("*").eq("id", id).maybeSingle();
  if (!submission) notFound();

  const mayReview = canReview(session!.role);
  const mayDelete = canEdit(session!.role);

  return (
    <div className="max-w-2xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-semibold text-ink">
          {submission.submission_type === "correction" ? "Correction" : "Material offer"}
        </h1>
        <SubmissionStatusBadge status={submission.review_status} />
      </div>

      <dl className="mt-6 space-y-4 rounded-lg border border-line bg-paper p-6 text-sm">
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-ink-soft">From</dt>
          <dd className="mt-1 text-ink">
            {submission.submitter_name || "No name given"}
            {submission.submitter_email && (
              <>
                {" — "}
                <a href={`mailto:${submission.submitter_email}`} className="text-accent hover:underline">
                  {submission.submitter_email}
                </a>
              </>
            )}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-ink-soft">Message</dt>
          <dd className="mt-1 whitespace-pre-wrap text-ink">{submission.message}</dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-ink-soft">Received</dt>
          <dd className="mt-1 text-ink-soft">{new Date(submission.created_at).toLocaleString()}</dd>
        </div>
      </dl>

      <div className="mt-6">
        {mayReview ? (
          <form action={updateSubmissionReview.bind(null, id)} className="space-y-4 rounded-lg border border-line bg-paper p-6">
            <SelectField
              name="review_status"
              label="Status"
              defaultValue={submission.review_status as (typeof SUBMISSION_STATUS_OPTIONS)[number]["value"]}
              options={SUBMISSION_STATUS_OPTIONS}
            />
            <TextAreaField
              name="reviewer_notes"
              label="Reviewer notes (internal — never shown publicly)"
              defaultValue={submission.reviewer_notes}
            />
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                className="rounded-md bg-ink px-4 py-2 text-sm font-semibold text-paper transition-colors hover:bg-accent"
              >
                Save
              </button>
              <Link
                href="/admin/submissions"
                className="rounded-md border border-line px-4 py-2 text-sm font-medium text-ink-soft hover:text-ink"
              >
                Back to queue
              </Link>
            </div>
          </form>
        ) : (
          <p className="rounded-lg border border-dashed border-line bg-paper-muted p-4 text-sm text-ink-soft">
            Only Reviewers, Editors and Admins can update a submission&apos;s status.{" "}
            <Link href="/admin/submissions" className="font-medium text-accent hover:underline">
              Back to queue
            </Link>
          </p>
        )}
      </div>

      {mayDelete && (
        <form action={deleteSubmission.bind(null, id)} className="mt-6">
          <ConfirmSubmitButton
            confirmMessage="Delete this submission permanently? This cannot be undone."
            className="text-sm font-medium text-evidence-disputed hover:underline"
          >
            Delete this submission
          </ConfirmSubmitButton>
        </form>
      )}
    </div>
  );
}
