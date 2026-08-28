import Link from "next/link";
import { RECORD_TYPES, EVIDENCE_TYPES, type ArchiveFilters as Filters } from "@/lib/archive/search";
import { humanizeRecordType } from "@/lib/archive/labels";

const EVIDENCE_OPTION_LABELS: Record<(typeof EVIDENCE_TYPES)[number], string> = {
  DOCUMENTED: "Documented",
  ORAL_TRADITION: "Oral tradition",
  INTERPRETATION: "Interpretation",
  DISPUTED: "Disputed",
  UNVERIFIED: "Unverified",
};

/**
 * A plain GET <form> rather than a client-side filter component: no
 * JavaScript is required for filtering to work, the resulting URL is
 * shareable/bookmarkable, and the server component re-fetches based on
 * the resulting searchParams — matching the "minimal JavaScript where
 * possible" performance principle.
 */
export function ArchiveFilters({ filters }: { filters: Filters }) {
  return (
    <form method="get" className="grid gap-4 rounded-lg border border-line bg-paper-muted p-4 sm:grid-cols-2 lg:grid-cols-4">
      <div className="sm:col-span-2 lg:col-span-4">
        <label htmlFor="archive-q" className="block text-xs font-medium text-ink-soft">
          Search
        </label>
        <input
          id="archive-q"
          type="search"
          name="q"
          defaultValue={filters.q ?? ""}
          placeholder="Search titles, descriptions, sources…"
          className="mt-1 w-full rounded-md border border-line bg-paper px-3 py-2 text-sm text-ink"
        />
      </div>

      <div>
        <label htmlFor="archive-type" className="block text-xs font-medium text-ink-soft">
          Record type
        </label>
        <select
          id="archive-type"
          name="type"
          defaultValue={filters.recordType ?? ""}
          className="mt-1 w-full rounded-md border border-line bg-paper px-3 py-2 text-sm text-ink"
        >
          <option value="">All types</option>
          {RECORD_TYPES.map((type) => (
            <option key={type} value={type}>
              {humanizeRecordType(type)}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="archive-evidence" className="block text-xs font-medium text-ink-soft">
          Evidence type
        </label>
        <select
          id="archive-evidence"
          name="evidence"
          defaultValue={filters.evidenceType ?? ""}
          className="mt-1 w-full rounded-md border border-line bg-paper px-3 py-2 text-sm text-ink"
        >
          <option value="">All evidence types</option>
          {EVIDENCE_TYPES.map((evidence) => (
            <option key={evidence} value={evidence}>
              {EVIDENCE_OPTION_LABELS[evidence]}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="archive-period" className="block text-xs font-medium text-ink-soft">
          Historical period
        </label>
        <input
          id="archive-period"
          type="text"
          name="period"
          defaultValue={filters.historicalPeriod ?? ""}
          className="mt-1 w-full rounded-md border border-line bg-paper px-3 py-2 text-sm text-ink"
        />
      </div>

      <div>
        <label htmlFor="archive-location" className="block text-xs font-medium text-ink-soft">
          Location
        </label>
        <input
          id="archive-location"
          type="text"
          name="location"
          defaultValue={filters.location ?? ""}
          className="mt-1 w-full rounded-md border border-line bg-paper px-3 py-2 text-sm text-ink"
        />
      </div>

      <div className="sm:col-span-2 lg:col-span-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <label htmlFor="archive-sort" className="block text-xs font-medium text-ink-soft">
            Sort by
          </label>
          <select
            id="archive-sort"
            name="sort"
            defaultValue={filters.sort}
            className="mt-1 rounded-md border border-line bg-paper px-3 py-2 text-sm text-ink"
          >
            <option value="recent">Recently updated</option>
            <option value="title">Title (A–Z)</option>
          </select>
        </div>

        <div className="flex gap-3">
          <Link href="/archive" className="rounded-md border border-line px-4 py-2 text-sm font-medium text-ink-soft hover:text-ink">
            Clear filters
          </Link>
          <button
            type="submit"
            className="rounded-md bg-ink px-4 py-2 text-sm font-semibold text-paper transition-colors hover:bg-accent"
          >
            Apply
          </button>
        </div>
      </div>
    </form>
  );
}
