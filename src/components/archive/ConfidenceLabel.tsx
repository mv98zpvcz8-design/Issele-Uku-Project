import type { ConfidenceLevel } from "@/lib/supabase/types";

const CONFIDENCE_LABELS: Record<ConfidenceLevel, string> = {
  HIGH: "High confidence",
  MEDIUM: "Medium confidence",
  LOW: "Low confidence",
  UNKNOWN: "Confidence unknown",
};

/**
 * Deliberately text-only, no color-coding — per HISTORICAL_METHOD.md,
 * confidence describes the evidence, not how culturally important a
 * claim is, and a second color system next to the evidence badge's
 * would just add visual noise without adding information.
 */
export function ConfidenceLabel({ confidenceLevel }: { confidenceLevel: ConfidenceLevel }) {
  return <span className="text-xs text-ink-soft">{CONFIDENCE_LABELS[confidenceLevel]}</span>;
}
