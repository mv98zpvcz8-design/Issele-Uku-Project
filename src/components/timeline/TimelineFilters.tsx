import Link from "next/link";
import { EVIDENCE_TYPES, type TimelineFilters as Filters } from "@/lib/timeline/search";

const EVIDENCE_OPTION_LABELS: Record<(typeof EVIDENCE_TYPES)[number], string> = {
  DOCUMENTED: "Documented",
  ORAL_TRADITION: "Oral tradition",
  INTERPRETATION: "Interpretation",
  DISPUTED: "Disputed",
  UNVERIFIED: "Unverified",
};

/** Plain GET <form> — same rationale as ArchiveFilters: no JS required, shareable URL. */
export function TimelineFilters({ filters }: { filters: Filters }) {
  return (
    <form method="get" className="flex flex-wrap items-end gap-4 rounded-lg border border-line bg-paper-muted p-4">
      <div className="min-w-[12rem] flex-1">
        <label htmlFor="timeline-q" className="block text-xs font-medium text-ink-soft">
          Search
        </label>
        <input
          id="timeline-q"
          type="search"
          name="q"
          defaultValue={filters.q ?? ""}
          placeholder="Search event titles and descriptions…"
          className="mt-1 w-full rounded-md border border-line bg-paper px-3 py-2 text-sm text-ink"
        />
      </div>

      <div>
        <label htmlFor="timeline-evidence" className="block text-xs font-medium text-ink-soft">
          Evidence type
        </label>
        <select
          id="timeline-evidence"
          name="evidence"
          defaultValue={filters.evidenceType ?? ""}
          className="mt-1 rounded-md border border-line bg-paper px-3 py-2 text-sm text-ink"
        >
          <option value="">All evidence types</option>
          {EVIDENCE_TYPES.map((evidence) => (
            <option key={evidence} value={evidence}>
              {EVIDENCE_OPTION_LABELS[evidence]}
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-3">
        <Link href="/timeline" className="rounded-md border border-line px-4 py-2 text-sm font-medium text-ink-soft hover:text-ink">
          Clear
        </Link>
        <button
          type="submit"
          className="rounded-md bg-ink px-4 py-2 text-sm font-semibold text-paper transition-colors hover:bg-accent"
        >
          Apply
        </button>
      </div>
    </form>
  );
}
