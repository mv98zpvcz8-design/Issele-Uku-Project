import type { ContentStatus } from "@/lib/supabase/types";

// A logical progression through the workflow, reusing existing evidence-*
// tokens rather than inventing new colors: neutral while still
// draft/research, amber once it needs a look (REVIEW), blue once someone's
// signed off (APPROVED), green once it's live (PUBLISHED), and red
// reserved for RESTRICTED specifically — the one genuinely cautionary
// state, matching how the same red already means DISPUTED evidence.
const STATUS_STYLES: Record<ContentStatus, string> = {
  DRAFT: "bg-paper-muted text-ink-soft border-line",
  RESEARCH: "bg-evidence-unverified/10 text-evidence-unverified border-evidence-unverified/30",
  REVIEW: "bg-evidence-oral/10 text-evidence-oral border-evidence-oral/30",
  APPROVED: "bg-evidence-interpretation/10 text-evidence-interpretation border-evidence-interpretation/30",
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
