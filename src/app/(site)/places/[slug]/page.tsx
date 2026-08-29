import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { EvidenceBadge } from "@/components/archive/EvidenceBadge";
import { ConfidenceLabel } from "@/components/archive/ConfidenceLabel";
import { CoverImage } from "@/components/archive/CoverImage";
import { AttachedPhotos } from "@/components/archive/AttachedPhotos";
import { StateNotice, NOT_CONNECTED_NOTICE } from "@/components/ui/StateNotice";
import { createClient } from "@/lib/supabase/server";
import { SUPABASE_CONFIGURED } from "@/lib/supabase/config";

async function getPlaceDetail(slug: string) {
  const supabase = await createClient();

  const { data: place } = await supabase.from("places").select("*").eq("slug", slug).maybeSingle();
  if (!place) return null;

  const [peopleLinksResult, eventLinksResult, sourceLinksResult] = await Promise.all([
    supabase.from("place_people").select("person_id").eq("place_id", place.id),
    supabase.from("place_events").select("event_id").eq("place_id", place.id),
    supabase.from("place_sources").select("source_id").eq("place_id", place.id),
  ]);

  const personIds = (peopleLinksResult.data ?? []).map((r) => r.person_id);
  const eventIds = (eventLinksResult.data ?? []).map((r) => r.event_id);
  const sourceIds = (sourceLinksResult.data ?? []).map((r) => r.source_id);

  const [peopleResult, eventsResult, sourcesResult] = await Promise.all([
    personIds.length
      ? supabase.from("people").select("slug, name").in("id", personIds)
      : Promise.resolve({ data: [] }),
    eventIds.length
      ? supabase.from("historical_events").select("slug, title").in("id", eventIds)
      : Promise.resolve({ data: [] }),
    sourceIds.length
      ? supabase.from("sources").select("slug, title, citation").in("id", sourceIds)
      : Promise.resolve({ data: [] }),
  ]);

  return {
    place,
    people: peopleResult.data ?? [],
    events: eventsResult.data ?? [],
    sources: sourcesResult.data ?? [],
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  if (!SUPABASE_CONFIGURED) return { title: "Place" };
  const { slug } = await params;
  const detail = await getPlaceDetail(slug);
  if (!detail) return { title: "Place" };
  return { title: detail.place.name, description: detail.place.description ?? undefined };
}

export default async function PlacePage({ params }: { params: Promise<{ slug: string }> }) {
  if (!SUPABASE_CONFIGURED) {
    return (
      <Container className="py-16">
        <StateNotice variant="not-connected" {...NOT_CONNECTED_NOTICE} />
      </Container>
    );
  }

  const { slug } = await params;
  const detail = await getPlaceDetail(slug);
  if (!detail) notFound();

  const { place, people, events, sources } = detail;

  return (
    <Container className="max-w-3xl py-12 sm:py-16">
      <Link href="/places" className="text-sm font-medium text-accent hover:underline">
        ← Back to places
      </Link>

      <CoverImage mediaId={place.cover_media_id} alt={place.name} />

      <h1 className="mt-4 font-display text-3xl font-semibold text-ink sm:text-4xl">{place.name}</h1>
      {place.category && <p className="mt-1 capitalize text-ink-soft">{place.category}</p>}

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <EvidenceBadge evidenceType={place.evidence_type} />
        <ConfidenceLabel confidenceLevel={place.confidence_level} />
      </div>

      {place.description && <p className="mt-8 text-lg leading-8 text-ink-soft">{place.description}</p>}

      {place.historical_significance && (
        <div className="mt-6">
          <h2 className="font-display text-lg font-semibold text-ink">Historical significance</h2>
          <p className="mt-2 leading-7 text-ink-soft">{place.historical_significance}</p>
        </div>
      )}

      <AttachedPhotos entityType="place" entityId={place.id} />

      {(people.length > 0 || events.length > 0) && (
        <div className="mt-8 flex flex-wrap gap-10 border-t border-line pt-6">
          {people.length > 0 && (
            <div>
              <h2 className="font-display text-lg font-semibold text-ink">Associated people</h2>
              <ul className="mt-2 space-y-1">
                {people.map((person) => (
                  <li key={person.slug}>
                    <Link href={`/people/${person.slug}`} className="text-sm font-medium text-accent underline underline-offset-2">
                      {person.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {events.length > 0 && (
            <div>
              <h2 className="font-display text-lg font-semibold text-ink">Associated events</h2>
              <ul className="mt-2 space-y-1">
                {events.map((event) => (
                  <li key={event.slug}>
                    <Link href={`/history/${event.slug}`} className="text-sm font-medium text-accent underline underline-offset-2">
                      {event.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
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
    </Container>
  );
}
