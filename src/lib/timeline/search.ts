// Relative imports, not the "@/" alias: this module (and its .test.ts)
// runs under plain `node --test` outside Next's bundler, which has no
// knowledge of the tsconfig path alias.
import type { EvidenceType } from "../supabase/types.ts";
import { buildOrSearchFilter } from "../postgrest.ts";

export const EVIDENCE_TYPES: EvidenceType[] = [
  "DOCUMENTED",
  "ORAL_TRADITION",
  "INTERPRETATION",
  "DISPUTED",
  "UNVERIFIED",
];

export interface TimelineFilters {
  q: string | null;
  evidenceType: EvidenceType | null;
}

type RawSearchParams = Record<string, string | string[] | undefined>;

function firstValue(value: string | string[] | undefined): string | null {
  const v = Array.isArray(value) ? value[0] : value;
  const trimmed = v?.trim();
  return trimmed ? trimmed : null;
}

export function parseTimelineSearchParams(sp: RawSearchParams): TimelineFilters {
  const evidenceCandidate = firstValue(sp.evidence);
  const evidenceType = EVIDENCE_TYPES.includes(evidenceCandidate as EvidenceType)
    ? (evidenceCandidate as EvidenceType)
    : null;

  return { q: firstValue(sp.q), evidenceType };
}

const SEARCH_COLUMNS = ["title", "description"] as const;

/** Builds the `.or(...)` filter string for a free-text timeline search. */
export function buildTimelineSearchFilter(q: string): string {
  return buildOrSearchFilter(SEARCH_COLUMNS, q);
}
