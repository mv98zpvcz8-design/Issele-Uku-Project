import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { ArchiveFilters } from "@/components/archive/ArchiveFilters";
import { ArchiveCard } from "@/components/archive/ArchiveCard";
import { createClient } from "@/lib/supabase/server";
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

const SUPABASE_CONFIGURED = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

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
          <NotConnectedState />
        ) : (
          <ArchiveResults filters={filters} rawSearchParams={rawSearchParams} />
        )}
      </div>
    </Container>
  );
}

function NotConnectedState() {
  return (
    <div className="rounded-lg border border-dashed border-line bg-paper-muted p-8 text-center">
      <p className="font-semibold text-ink">The archive database isn&apos;t connected yet.</p>
      <p className="mt-2 text-sm text-ink-soft">
        This page is fully built and will show live, searchable records as soon as a Supabase
        project is connected (see DEPLOYMENT.md). This is expected during development — it is not
        a bug.
      </p>
    </div>
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
    return (
      <div className="rounded-lg border border-line bg-paper-muted p-8 text-center">
        <p className="font-semibold text-ink">The archive couldn&apos;t be loaded.</p>
        <p className="mt-2 text-sm text-ink-soft">
          Something went wrong reaching the database. Please try again shortly.
        </p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-line bg-paper-muted p-8 text-center">
        <p className="font-semibold text-ink">No records match these filters.</p>
        <p className="mt-2 text-sm text-ink-soft">
          Try clearing a filter, or check back later — the archive is continuously growing.
        </p>
      </div>
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
