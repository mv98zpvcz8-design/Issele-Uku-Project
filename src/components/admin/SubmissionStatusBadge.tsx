// Mirrors StatusBadge's progression: amber while waiting for a first
// look, blue once someone's actively on it, green once resolved, and a
// plain neutral for declined (a closed state, not a cautionary one, so
// no red here — reserved for genuinely restricted content elsewhere).
const STATUS_STYLES: Record<string, string> = {
  pending: "bg-evidence-oral/10 text-evidence-oral border-evidence-oral/30",
  in_review: "bg-evidence-interpretation/10 text-evidence-interpretation border-evidence-interpretation/30",
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
