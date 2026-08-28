import type { EvidenceType } from "@/lib/supabase/types";

/**
 * Per HISTORICAL_METHOD.md: these five labels and their meanings are
 * fixed. Never rename/reword them ad hoc elsewhere in the UI — this is
 * the one place that maps the enum to what a visitor reads.
 */
const EVIDENCE_LABELS: Record<EvidenceType, string> = {
  DOCUMENTED: "Documented",
  ORAL_TRADITION: "Oral tradition",
  INTERPRETATION: "Interpretation",
  DISPUTED: "Disputed",
  UNVERIFIED: "Unverified",
};

const EVIDENCE_COLOR_CLASS: Record<EvidenceType, string> = {
  DOCUMENTED: "bg-evidence-documented",
  ORAL_TRADITION: "bg-evidence-oral",
  INTERPRETATION: "bg-evidence-interpretation",
  DISPUTED: "bg-evidence-disputed",
  UNVERIFIED: "bg-evidence-unverified",
};

export function EvidenceBadge({ evidenceType }: { evidenceType: EvidenceType }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-paper px-2.5 py-1 text-xs font-medium text-ink">
      <span
        aria-hidden="true"
        className={`h-1.5 w-1.5 rounded-full ${EVIDENCE_COLOR_CLASS[evidenceType]}`}
      />
      {EVIDENCE_LABELS[evidenceType]}
    </span>
  );
}
