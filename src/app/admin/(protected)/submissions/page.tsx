import { createClient } from "@/lib/supabase/server";
import { AdminList } from "@/components/admin/AdminList";
import { SubmissionStatusBadge } from "@/components/admin/SubmissionStatusBadge";

const OPEN_STATUSES = new Set(["pending", "in_review"]);

export default async function AdminSubmissionsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("submissions")
    .select("*")
    .order("created_at", { ascending: false });

  // Open submissions (pending/in review) surface above already-handled ones,
  // newest first within each group — the queue a reviewer actually works
  // from top to bottom.
  const rows = [...(data ?? [])].sort((a, b) => {
    const aOpen = OPEN_STATUSES.has(a.review_status);
    const bOpen = OPEN_STATUSES.has(b.review_status);
    if (aOpen !== bOpen) return aOpen ? -1 : 1;
    return b.created_at.localeCompare(a.created_at);
  });

  return (
    <AdminList
      title="Submissions"
      rows={rows}
      canEdit={false}
      newHref="/admin/submissions"
      newLabel=""
      editHref={(row) => `/admin/submissions/${row.id}`}
      emptyMessage="No submissions yet."
      columns={[
        {
          header: "Type",
          render: (r) => (
            <span className="font-medium text-ink">
              {r.submission_type === "correction" ? "Correction" : "Material"}
            </span>
          ),
        },
        {
          header: "From",
          render: (r) => (
            <span className="text-ink-soft">{r.submitter_name || r.submitter_email || "Anonymous"}</span>
          ),
        },
        {
          header: "Message",
          render: (r) => (
            <span className="line-clamp-2 max-w-xs text-ink-soft">{r.message}</span>
          ),
        },
        { header: "Status", render: (r) => <SubmissionStatusBadge status={r.review_status} /> },
        {
          header: "Received",
          render: (r) => (
            <span className="whitespace-nowrap text-ink-soft">
              {new Date(r.created_at).toLocaleDateString()}
            </span>
          ),
        },
      ]}
    />
  );
}
