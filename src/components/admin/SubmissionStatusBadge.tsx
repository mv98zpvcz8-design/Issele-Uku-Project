const STATUS_STYLES: Record<string, string> = {
  pending: "bg-accent-soft text-accent border-accent/30",
  in_review: "bg-accent-soft text-accent border-accent/30",
  resolved: "bg-evidence-documented/10 text-evidence-documented border-evidence-documented/30",
  declined: "bg-paper-muted text-ink-soft border-line",
};

const STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  in_review: "In review",
  resolved: "Resolved",
  declined: "Declined",
};

export function SubmissionStatusBadge({ status }: { status: string }) {
  const style = STATUS_STYLES[status] ?? STATUS_STYLES.pending;
  const label = STATUS_LABELS[status] ?? status;
  return (
    <span className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium ${style}`}>
      {label}
    </span>
  );
}
