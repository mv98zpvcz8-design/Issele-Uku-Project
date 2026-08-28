import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { ArchiveFilters } from "@/components/archive/ArchiveFilters";
import { ArchiveCard } from "@/components/archive/ArchiveCard";
import { createClient } from "@/lib/supabase/server";
import { SUPABASE_CONFIGURED } from "@/lib/supabase/config";
import { StateNotice, NOT_CONNECTED_NOTICE, LOAD_ERROR_NOTICE } from "@/components/ui/StateNotice";
import {
  ARCHIVE_PAGE_SIZE,
  archiveOffset,
  buildArchiveSearchFilter,
  parseArchiveSearchParams,
} from "@/lib/archive/search";

export const metadata: Metadata = {
  title: "Archive",
  description: "Search photographs, documents, audio, maps and more from the Issele-Uku archive.",
};

function buildPageHref(searchParams: Record<string, string | string[] | undefined>, page: number) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(searchParams)) {
    if (key === "page" || value === undefined) continue;
    params.set(key, Array.isArray(value) ? value[0] : value);
  }
  if (page > 1) params.set("page", String(page));
  const qs = params.toString();
  return qs ? `/archive?${qs}` : "/archive";
}

export default async function ArchivePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const rawSearchParams = await searchParams;
  const filters = parseArchiveSearchParams(rawSearchParams);

  return (
    <Container className="py-12 sm:py-16">
      <p className="text-sm font-medium uppercase tracking-widest text-accent">Archive</p>
      <h1 className="mt-3 font-display text-3xl font-semibold text-ink sm:text-4xl">
        Search the archive
      </h1>
      <p className="mt-4 max-w-2xl text-ink-soft">
        Every record below is publicly visible because it has been reviewed and published.
        Each carries an evidence label — see what that means on the{" "}
        <Link href="/transparency" className="font-medium text-accent underline underline-offset-2">
          transparency page
        </Link>
        .
      </p>

      <div className="mt-8">
        <ArchiveFilters filters={filters} />
      </div>

      <div className="mt-8">
        {!SUPABASE_CONFIGURED ? (
          <StateNotice variant="not-connected" {...NOT_CONNECTED_NOTICE} />
        ) : (
          <ArchiveResults filters={filters} rawSearchParams={rawSearchParams} />
        )}
      </div>
    </Container>
  );
}

async function ArchiveResults({
  filters,
  rawSearchParams,
}: {
  filters: ReturnType<typeof parseArchiveSearchParams>;
  rawSearchParams: Record<string, string | string[] | undefined>;
}) {
  const supabase = await createClient();

  let query = supabase.from("archive_items").select("*", { count: "exact" });

  if (filters.q) query = query.or(buildArchiveSearchFilter(filters.q));
  if (filters.recordType) query = query.eq("record_type", filters.recordType);
  if (filters.evidenceType) query = query.eq("evidence_type", filters.evidenceType);
  if (filters.historicalPeriod) query = query.eq("historical_period", filters.historicalPeriod);
  if (filters.language) query = query.eq("language", filters.language);
  if (filters.location) query = query.ilike("location", `%${filters.location}%`);

  query =
    filters.sort === "title"
      ? query.order("title", { ascending: true })
      : query.order("featured", { ascending: false }).order("updated_at", { ascending: false });

  const from = archiveOffset(filters);
  query = query.range(from, from + ARCHIVE_PAGE_SIZE - 1);

  const { data, error, count } = await query;

  if (error) {
    return <StateNotice variant="error" {...LOAD_ERROR_NOTICE} />;
  }

  if (!data || data.length === 0) {
    return (
      <StateNotice
        variant="empty"
        title="No records match these filters."
        description="Try clearing a filter, or check back later — the archive is continuously growing."
      />
    );
  }

  const totalPages = count ? Math.ceil(count / ARCHIVE_PAGE_SIZE) : 1;

  return (
    <>
      <p className="text-sm text-ink-soft">
        {count} {count === 1 ? "record" : "records"} found
      </p>
      <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {data.map((item) => (
          <ArchiveCard key={item.id} item={item} />
        ))}
      </div>

      {totalPages > 1 && (
        <nav aria-label="Pagination" className="mt-8 flex items-center justify-between">
          <Link
            href={buildPageHref(rawSearchParams, Math.max(1, filters.page - 1))}
            aria-disabled={filters.page <= 1}
            className={`text-sm font-medium ${
              filters.page <= 1 ? "pointer-events-none text-ink-soft/40" : "text-accent hover:underline"
            }`}
          >
            ← Previous
          </Link>
          <p className="text-sm text-ink-soft">
            Page {filters.page} of {totalPages}
          </p>
          <Link
            href={buildPageHref(rawSearchParams, Math.min(totalPages, filters.page + 1))}
            aria-disabled={filters.page >= totalPages}
            className={`text-sm font-medium ${
              filters.page >= totalPages ? "pointer-events-none text-ink-soft/40" : "text-accent hover:underline"
            }`}
          >
            Next →
          </Link>
        </nav>
      )}
    </>
  );
}
