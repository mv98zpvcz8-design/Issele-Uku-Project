// Relative imports, not the "@/" alias: this module (and its .test.ts)
// runs under plain `node --test` outside Next's bundler, which has no
// knowledge of the tsconfig path alias.
import type { EvidenceType } from "../supabase/types.ts";
import { buildOrSearchFilter } from "../postgrest.ts";

/**
 * Matches the ARCHIVE section of the project brief. Deliberately a plain
 * array, not a database enum — see DECISIONS.md D-017: record_type stays
 * free text in the schema so an admin can enter something outside this
 * list, but the public filter UI only offers these known categories.
 */
export const RECORD_TYPES = [
  "photograph",
  "document",
  "book",
  "newspaper_article",
  "map",
  "audio",
  "oral_history_interview",
  "video",
  "letter",
  "government_document",
  "academic_research",
  "festival_material",
  "historical_object",
  "external_reference",
] as const;

export type RecordType = (typeof RECORD_TYPES)[number];

export const EVIDENCE_TYPES: EvidenceType[] = [
  "DOCUMENTED",
  "ORAL_TRADITION",
  "INTERPRETATION",
  "DISPUTED",
  "UNVERIFIED",
];

export const ARCHIVE_PAGE_SIZE = 12;

export type ArchiveSort = "recent" | "title";

export interface ArchiveFilters {
  q: string | null;
  recordType: string | null;
  evidenceType: EvidenceType | null;
  historicalPeriod: string | null;
  language: string | null;
  location: string | null;
  sort: ArchiveSort;
  page: number;
}

type RawSearchParams = Record<string, string | string[] | undefined>;

function firstValue(value: string | string[] | undefined): string | null {
  const v = Array.isArray(value) ? value[0] : value;
  const trimmed = v?.trim();
  return trimmed ? trimmed : null;
}

/**
 * Pure function: turns Next.js's `searchParams` into a typed, validated
 * filter object. Kept separate from the Supabase query itself so it can
 * be unit-tested without a database.
 */
export function parseArchiveSearchParams(sp: RawSearchParams): ArchiveFilters {
  const evidenceCandidate = firstValue(sp.evidence);
  const evidenceType = EVIDENCE_TYPES.includes(evidenceCandidate as EvidenceType)
    ? (evidenceCandidate as EvidenceType)
    : null;

  const sortCandidate = firstValue(sp.sort);
  const sort: ArchiveSort = sortCandidate === "title" ? "title" : "recent";

  const pageCandidate = Number(firstValue(sp.page));
  const page = Number.isInteger(pageCandidate) && pageCandidate > 1 ? pageCandidate : 1;

  return {
    q: firstValue(sp.q),
    recordType: firstValue(sp.type),
    evidenceType,
    historicalPeriod: firstValue(sp.period),
    language: firstValue(sp.language),
    location: firstValue(sp.location),
    sort,
    page,
  };
}

const SEARCH_COLUMNS = ["title", "subtitle", "description", "abstract", "source_name"] as const;

/** Builds the `.or(...)` filter string for a free-text archive search. */
export function buildArchiveSearchFilter(q: string): string {
  return buildOrSearchFilter(SEARCH_COLUMNS, q);
}

export function archiveOffset(filters: Pick<ArchiveFilters, "page">): number {
  return (filters.page - 1) * ARCHIVE_PAGE_SIZE;
}
