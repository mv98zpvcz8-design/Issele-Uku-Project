import type { ContentStatus } from "@/lib/supabase/types";

const STATUS_STYLES: Record<ContentStatus, string> = {
  DRAFT: "bg-paper-muted text-ink-soft border-line",
  RESEARCH: "bg-paper-muted text-ink-soft border-line",
  REVIEW: "bg-accent-soft text-accent border-accent/30",
  APPROVED: "bg-accent-soft text-accent border-accent/30",
  PUBLISHED: "bg-evidence-documented/10 text-evidence-documented border-evidence-documented/30",
  RESTRICTED: "bg-evidence-disputed/10 text-evidence-disputed border-evidence-disputed/30",
};

export function StatusBadge({ status }: { status: ContentStatus }) {
  return (
    <span
      className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[status]}`}
    >
      {status}
    </span>
  );
}
