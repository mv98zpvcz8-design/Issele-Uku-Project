import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { AttachedPhotos } from "@/components/archive/AttachedPhotos";
import { StateNotice, NOT_CONNECTED_NOTICE } from "@/components/ui/StateNotice";
import { accessStatusLabel } from "@/lib/content/labels";
import { createClient } from "@/lib/supabase/server";
import { SUPABASE_CONFIGURED } from "@/lib/supabase/config";

async function getSource(slug: string) {
  const supabase = await createClient();
  const { data: source } = await supabase.from("sources").select("*").eq("slug", slug).maybeSingle();
  if (!source) return null;

  // "Referenced by" reverse lookups — the forward direction (an event's
  // own page listing its sources) already existed; the source's own
  // page listing what cites it did not.
  const [eventLinks, placeLinks, personLinks, monarchLinks] = await Promise.all([
    supabase.from("event_sources").select("event_id").eq("source_id", source.id),
    supabase.from("place_sources").select("place_id").eq("source_id", source.id),
    supabase.from("person_sources").select("person_id").eq("source_id", source.id),
    supabase.from("monarch_sources").select("monarch_id").eq("source_id", source.id),
  ]);

  const [events, places, people, monarchs] = await Promise.all([
    eventLinks.data?.length
      ? supabase.from("historical_events").select("slug, title").in("id", eventLinks.data.map((r) => r.event_id))
      : Promise.resolve({ data: [] }),
    placeLinks.data?.length
      ? supabase.from("places").select("slug, name").in("id", placeLinks.data.map((r) => r.place_id))
      : Promise.resolve({ data: [] }),
    personLinks.data?.length
      ? supabase.from("people").select("slug, name").in("id", personLinks.data.map((r) => r.person_id))
      : Promise.resolve({ data: [] }),
    monarchLinks.data?.length
      ? supabase
          .from("monarchs")
          .select("slug, name, regnal_name")
          .in("id", monarchLinks.data.map((r) => r.monarch_id))
      : Promise.resolve({ data: [] }),
  ]);

  return {
    source,
    referencedBy: {
      events: events.data ?? [],
      places: places.data ?? [],
      people: people.data ?? [],
      monarchs: monarchs.data ?? [],
    },
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  if (!SUPABASE_CONFIGURED) return { title: "Source" };
  const { slug } = await params;
  const detail = await getSource(slug);
  if (!detail) return { title: "Source" };
  return { title: detail.source.title };
}

export default async function SourcePage({ params }: { params: Promise<{ slug: string }> }) {
  if (!SUPABASE_CONFIGURED) {
    return (
      <Container className="py-16">
        <StateNotice variant="not-connected" {...NOT_CONNECTED_NOTICE} />
      </Container>
    );
  }

  const { slug } = await params;
  const detail = await getSource(slug);
  if (!detail) notFound();
  const { source, referencedBy } = detail;
  const hasReferences =
    referencedBy.events.length > 0 ||
    referencedBy.places.length > 0 ||
    referencedBy.people.length > 0 ||
    referencedBy.monarchs.length > 0;

  return (
    <Container className="max-w-2xl py-12 sm:py-16">
      <Link href="/research-library" className="text-sm font-medium text-accent hover:underline">
        ← Back to research library
      </Link>

      <p className="mt-4 text-sm font-medium uppercase tracking-widest text-accent">
        {source.source_type?.replaceAll("_", " ") ?? "Source"}
      </p>
      <h1 className="mt-2 font-display text-3xl font-semibold text-ink sm:text-4xl">{source.title}</h1>

      <p className="mt-4 text-ink-soft">
        {[source.author, source.publisher, source.publication_date?.slice(0, 4)].filter(Boolean).join(" · ")}
      </p>

      <span className="mt-4 inline-block rounded-full border border-line bg-paper-muted px-3 py-1 text-xs font-medium text-ink-soft">
        {accessStatusLabel(source.access_status)}
      </span>

      {source.citation && (
        <div className="mt-8 border-t border-line pt-6">
          <h2 className="font-display text-lg font-semibold text-ink">Citation</h2>
          <p className="mt-2 text-ink-soft">{source.citation}</p>
        </div>
      )}

      {source.reliability_notes && (
        <div className="mt-6">
          <h2 className="font-display text-lg font-semibold text-ink">Notes</h2>
          <p className="mt-2 text-sm text-ink-soft">{source.reliability_notes}</p>
        </div>
      )}

      <AttachedPhotos entityType="source" entityId={source.id} />

      {hasReferences && (
        <div className="mt-8 border-t border-line pt-6">
          <h2 className="font-display text-lg font-semibold text-ink">Cited by</h2>
          <ul className="mt-2 flex flex-wrap gap-2">
            {referencedBy.events.map((e) => (
              <li key={`event-${e.slug}`}>
                <Link
                  href={`/history/${e.slug}`}
                  className="inline-block rounded-full border border-line px-3 py-1 text-sm text-ink hover:border-accent hover:text-accent"
                >
                  {e.title}
                </Link>
              </li>
            ))}
            {referencedBy.places.map((p) => (
              <li key={`place-${p.slug}`}>
                <Link
                  href={`/places/${p.slug}`}
                  className="inline-block rounded-full border border-line px-3 py-1 text-sm text-ink hover:border-accent hover:text-accent"
                >
                  {p.name}
                </Link>
              </li>
            ))}
            {referencedBy.people.map((p) => (
              <li key={`person-${p.slug}`}>
                <Link
                  href={`/people/${p.slug}`}
                  className="inline-block rounded-full border border-line px-3 py-1 text-sm text-ink hover:border-accent hover:text-accent"
                >
                  {p.name}
                </Link>
              </li>
            ))}
            {referencedBy.monarchs.map((m) => (
              <li key={`monarch-${m.slug}`}>
                <Link
                  href={`/monarchy/${m.slug}`}
                  className="inline-block rounded-full border border-line px-3 py-1 text-sm text-ink hover:border-accent hover:text-accent"
                >
                  {m.regnal_name ?? m.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      <dl className="mt-8 grid gap-4 border-t border-line pt-6 sm:grid-cols-2">
        {source.isbn && (
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-ink-soft">ISBN</dt>
            <dd className="mt-1 text-sm text-ink">{source.isbn}</dd>
          </div>
        )}
        {source.archive_reference && (
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-ink-soft">Archive reference</dt>
            <dd className="mt-1 text-sm text-ink">{source.archive_reference}</dd>
          </div>
        )}
      </dl>

      {source.url && (
        <a
          href={source.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-block text-sm font-medium text-accent underline underline-offset-2"
        >
          View external source →
        </a>
      )}
    </Container>
  );
}
