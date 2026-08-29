import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { EvidenceBadge } from "@/components/archive/EvidenceBadge";
import { StateNotice, NOT_CONNECTED_NOTICE, LOAD_ERROR_NOTICE } from "@/components/ui/StateNotice";
import { buildOrSearchFilter } from "@/lib/postgrest";
import { createClient } from "@/lib/supabase/server";
import { SUPABASE_CONFIGURED } from "@/lib/supabase/config";
import type { EvidenceType } from "@/lib/supabase/types";

export const metadata: Metadata = { title: "Search" };

interface SearchResult {
  id: string;
  href: string;
  title: string;
  evidenceType: EvidenceType;
}

interface SearchSection {
  label: string;
  results: SearchResult[];
}

async function runSearch(q: string): Promise<{ sections: SearchSection[]; error: boolean }> {
  const supabase = await createClient();

  const [archiveItems, people, places, events, culture, sources] = await Promise.all([
    supabase
      .from("archive_items")
      .select("id, slug, title, evidence_type")
      .or(buildOrSearchFilter(["title", "subtitle", "description", "abstract"], q))
      .limit(8),
    supabase
      .from("people")
      .select("id, slug, name, evidence_type")
      .or(buildOrSearchFilter(["name", "biography"], q))
      .limit(8),
    supabase
      .from("places")
      .select("id, slug, name, evidence_type")
      .or(buildOrSearchFilter(["name", "description", "historical_significance"], q))
      .limit(8),
    supabase
      .from("historical_events")
      .select("id, slug, title, evidence_type")
      .or(buildOrSearchFilter(["title", "description"], q))
      .limit(8),
    supabase
      .from("culture_categories")
      .select("id, slug, name, evidence_type")
      .or(buildOrSearchFilter(["name", "description"], q))
      .limit(8),
    supabase
      .from("sources")
      .select("id, slug, title, citation")
      .or(buildOrSearchFilter(["title", "citation", "author"], q))
      .limit(8),
  ]);

  const results = [archiveItems, people, places, events, culture, sources];
  if (results.some((r) => r.error)) {
    return { sections: [], error: true };
  }

  const sections: SearchSection[] = [
    {
      label: "Archive",
      results: (archiveItems.data ?? []).map((r) => ({
        id: r.id,
        href: `/archive/${r.slug}`,
        title: r.title,
        evidenceType: r.evidence_type,
      })),
    },
    {
      label: "People",
      results: (people.data ?? []).map((r) => ({
        id: r.id,
        href: `/people/${r.slug}`,
        title: r.name,
        evidenceType: r.evidence_type,
      })),
    },
    {
      label: "Places",
      results: (places.data ?? []).map((r) => ({
        id: r.id,
        href: `/places/${r.slug}`,
        title: r.name,
        evidenceType: r.evidence_type,
      })),
    },
    {
      label: "History",
      results: (events.data ?? []).map((r) => ({
        id: r.id,
        href: `/history/${r.slug}`,
        title: r.title,
        evidenceType: r.evidence_type,
      })),
    },
    {
      label: "Culture",
      results: (culture.data ?? []).map((r) => ({
        id: r.id,
        href: `/culture/${r.slug}`,
        title: r.name,
        evidenceType: r.evidence_type,
      })),
    },
    {
      label: "Research Library",
      // Sources have no evidence_type of their own (a citation isn't a
      // claim) — badge omitted for this section rather than faked.
      results: (sources.data ?? []).map((r) => ({
        id: r.id,
        href: `/research-library/${r.slug}`,
        title: r.citation ?? r.title,
        evidenceType: "UNVERIFIED" as EvidenceType,
      })),
    },
  ].filter((section) => section.results.length > 0);

  return { sections, error: false };
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q: rawQ } = await searchParams;
  const q = rawQ?.trim() ?? "";

  return (
    <Container className="max-w-3xl py-12 sm:py-16">
      <p className="text-sm font-medium uppercase tracking-widest text-accent">Search</p>
      <h1 className="mt-3 font-display text-3xl font-semibold text-ink sm:text-4xl">
        Search the archive
      </h1>

      <form action="/search" method="get" className="mt-6 flex gap-2">
        <label htmlFor="search-q" className="sr-only">
          Search
        </label>
        <input
          id="search-q"
          type="search"
          name="q"
          defaultValue={q}
          placeholder="Search people, places, history, culture, archive items…"
          className="w-full rounded-md border border-line bg-paper px-4 py-2.5 text-ink placeholder:text-ink-soft/70 focus:border-accent focus:outline-none"
        />
        <button
          type="submit"
          className="rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-paper hover:bg-accent/90"
        >
          Search
        </button>
      </form>

      <div className="mt-10">
        {!SUPABASE_CONFIGURED ? (
          <StateNotice variant="not-connected" {...NOT_CONNECTED_NOTICE} />
        ) : q.length === 0 ? (
          <p className="text-ink-soft">Enter a search term above to look across the whole site.</p>
        ) : (
          <SearchResults q={q} />
        )}
      </div>
    </Container>
  );
}

async function SearchResults({ q }: { q: string }) {
  const { sections, error } = await runSearch(q);

  if (error) return <StateNotice variant="error" {...LOAD_ERROR_NOTICE} />;

  if (sections.length === 0) {
    return (
      <StateNotice
        variant="empty"
        title={`No results for "${q}".`}
        description="Try a different spelling, or a broader term — search covers titles, names and descriptions across the whole site."
      />
    );
  }

  return (
    <div className="space-y-10">
      {sections.map((section) => (
        <section key={section.label}>
          <h2 className="font-display text-xl font-semibold text-ink">{section.label}</h2>
          <ul className="mt-2 divide-y divide-line border-y border-line">
            {section.results.map((result) => (
              <li key={result.id}>
                <Link
                  href={result.href}
                  className="flex flex-col gap-2 py-4 transition-colors hover:bg-paper-muted sm:flex-row sm:items-center sm:justify-between"
                >
                  <span className="font-medium text-ink">{result.title}</span>
                  {section.label !== "Research Library" && (
                    <EvidenceBadge evidenceType={result.evidenceType} />
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
