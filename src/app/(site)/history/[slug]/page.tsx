import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { EvidenceBadge } from "@/components/archive/EvidenceBadge";
import { ConfidenceLabel } from "@/components/archive/ConfidenceLabel";
import { StateNotice, NOT_CONNECTED_NOTICE } from "@/components/ui/StateNotice";
import { createClient } from "@/lib/supabase/server";
import { SUPABASE_CONFIGURED } from "@/lib/supabase/config";

async function getEventDetail(slug: string) {
  const supabase = await createClient();

  const { data: event } = await supabase.from("historical_events").select("*").eq("slug", slug).maybeSingle();
  if (!event) return null;

  // Deliberately separate queries rather than a single PostgREST nested
  // embed: with two content tables joined only through a plain many-to-
  // many table, explicit queries are easier to verify correct than
  // relying on PostgREST's relationship-name inference sight unseen
  // (see DECISIONS.md's note on this in the Phase 4 write-up).
  const [placeResult, eventPeopleResult, eventSourcesResult] = await Promise.all([
    event.location_id
      ? supabase.from("places").select("slug, name").eq("id", event.location_id).maybeSingle()
      : Promise.resolve({ data: null }),
    supabase.from("event_people").select("person_id").eq("event_id", event.id),
    supabase.from("event_sources").select("source_id").eq("event_id", event.id),
  ]);

  const personIds = (eventPeopleResult.data ?? []).map((r) => r.person_id);
  const sourceIds = (eventSourcesResult.data ?? []).map((r) => r.source_id);

  const [peopleResult, sourcesResult] = await Promise.all([
    personIds.length
      ? supabase.from("people").select("slug, name").in("id", personIds)
      : Promise.resolve({ data: [] }),
    sourceIds.length
      ? supabase.from("sources").select("slug, title, citation").in("id", sourceIds)
      : Promise.resolve({ data: [] }),
  ]);

  return {
    event,
    place: placeResult.data,
    people: peopleResult.data ?? [],
    sources: sourcesResult.data ?? [],
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  if (!SUPABASE_CONFIGURED) return { title: "Historical event" };
  const { slug } = await params;
  const detail = await getEventDetail(slug);
  if (!detail) return { title: "Historical event" };
  return { title: detail.event.title, description: detail.event.description ?? undefined };
}

export default async function HistoricalEventPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  if (!SUPABASE_CONFIGURED) {
    return (
      <Container className="py-16">
        <StateNotice variant="not-connected" {...NOT_CONNECTED_NOTICE} />
      </Container>
    );
  }

  const { slug } = await params;
  const detail = await getEventDetail(slug);
  if (!detail) notFound();

  const { event, place, people, sources } = detail;

  return (
    <Container className="max-w-3xl py-12 sm:py-16">
      <Link href="/history" className="text-sm font-medium text-accent hover:underline">
        ← Back to history
      </Link>

      <h1 className="mt-4 font-display text-3xl font-semibold text-ink sm:text-4xl">{event.title}</h1>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <EvidenceBadge evidenceType={event.evidence_type} />
        <ConfidenceLabel confidenceLevel={event.confidence_level} />
        {event.date_display && <span className="text-sm text-ink-soft">{event.date_display}</span>}
      </div>

      {event.description && (
        <p className="mt-8 text-lg leading-8 text-ink-soft">{event.description}</p>
      )}

      {place && (
        <p className="mt-6 text-sm text-ink-soft">
          Location:{" "}
          <Link href={`/places/${place.slug}`} className="font-medium text-accent underline underline-offset-2">
            {place.name}
          </Link>
        </p>
      )}

      {people.length > 0 && (
        <div className="mt-6">
          <h2 className="font-display text-lg font-semibold text-ink">People involved</h2>
          <ul className="mt-2 flex flex-wrap gap-2">
            {people.map((person) => (
              <li key={person.slug}>
                <Link
                  href={`/people/${person.slug}`}
                  className="inline-block rounded-full border border-line px-3 py-1 text-sm text-ink hover:border-accent hover:text-accent"
                >
                  {person.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {sources.length > 0 && (
        <div className="mt-8 border-t border-line pt-6">
          <h2 className="font-display text-lg font-semibold text-ink">Sources</h2>
          <ul className="mt-2 space-y-2">
            {sources.map((source) => (
              <li key={source.slug} className="text-sm text-ink-soft">
                <Link href={`/research-library/${source.slug}`} className="hover:text-accent hover:underline">
                  {source.citation ?? source.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-10 rounded-lg border border-dashed border-line bg-paper-muted p-4 text-sm text-ink-soft">
        Have a source or correction for this event?{" "}
        <Link href="/submit" className="font-medium text-accent underline underline-offset-2">
          Submit it for review
        </Link>
        .
      </div>
    </Container>
  );
}
