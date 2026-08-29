import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { EvidenceBadge } from "@/components/archive/EvidenceBadge";
import { ConfidenceLabel } from "@/components/archive/ConfidenceLabel";
import { CoverImage } from "@/components/archive/CoverImage";
import { AttachedPhotos } from "@/components/archive/AttachedPhotos";
import { StateNotice, NOT_CONNECTED_NOTICE } from "@/components/ui/StateNotice";
import { PERSON_CATEGORY_LABELS } from "@/lib/content/labels";
import { createClient } from "@/lib/supabase/server";
import { SUPABASE_CONFIGURED } from "@/lib/supabase/config";

async function getPersonDetail(slug: string) {
  const supabase = await createClient();

  const { data: person } = await supabase.from("people").select("*").eq("slug", slug).maybeSingle();
  if (!person) return null;

  const [sourceLinks, placeLinks, eventLinks] = await Promise.all([
    supabase.from("person_sources").select("source_id").eq("person_id", person.id),
    supabase.from("place_people").select("place_id").eq("person_id", person.id),
    supabase.from("event_people").select("event_id").eq("person_id", person.id),
  ]);

  const sourceIds = (sourceLinks.data ?? []).map((l) => l.source_id);
  const placeIds = (placeLinks.data ?? []).map((l) => l.place_id);
  const eventIds = (eventLinks.data ?? []).map((l) => l.event_id);

  const [sources, places, events] = await Promise.all([
    sourceIds.length
      ? supabase.from("sources").select("slug, title, citation").in("id", sourceIds)
      : Promise.resolve({ data: [] }),
    placeIds.length
      ? supabase.from("places").select("slug, name").in("id", placeIds)
      : Promise.resolve({ data: [] }),
    eventIds.length
      ? supabase.from("historical_events").select("slug, title").in("id", eventIds)
      : Promise.resolve({ data: [] }),
  ]);

  return {
    person,
    sources: sources.data ?? [],
    places: places.data ?? [],
    events: events.data ?? [],
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  if (!SUPABASE_CONFIGURED) return { title: "Person" };
  const { slug } = await params;
  const detail = await getPersonDetail(slug);
  if (!detail) return { title: "Person" };
  return { title: detail.person.name, description: detail.person.biography ?? undefined };
}

export default async function PersonPage({ params }: { params: Promise<{ slug: string }> }) {
  if (!SUPABASE_CONFIGURED) {
    return (
      <Container className="py-16">
        <StateNotice variant="not-connected" {...NOT_CONNECTED_NOTICE} />
      </Container>
    );
  }

  const { slug } = await params;
  const detail = await getPersonDetail(slug);
  if (!detail) notFound();

  const { person, sources, places, events } = detail;

  return (
    <Container className="max-w-3xl py-12 sm:py-16">
      <Link href="/people" className="text-sm font-medium text-accent hover:underline">
        ← Back to people
      </Link>

      <CoverImage mediaId={person.image_media_id} alt={person.name} />

      <h1 className="mt-4 font-display text-3xl font-semibold text-ink sm:text-4xl">{person.name}</h1>
      {person.titles.length > 0 && <p className="mt-1 text-ink-soft">{person.titles.join(", ")}</p>}
      {person.alternative_names.length > 0 && (
        <p className="mt-1 text-sm text-ink-soft">Also known as: {person.alternative_names.join(", ")}</p>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <EvidenceBadge evidenceType={person.evidence_type} />
        <ConfidenceLabel confidenceLevel={person.confidence_level} />
        <span className="rounded-full border border-line bg-paper-muted px-3 py-1 text-xs font-medium text-ink-soft">
          {PERSON_CATEGORY_LABELS[person.person_category]}
        </span>
        {(person.birth_date || person.death_date) && (
          <span className="text-sm text-ink-soft">
            {person.birth_date ?? "?"} – {person.death_date ?? "present"}
          </span>
        )}
      </div>

      {person.current_residence && (
        <p className="mt-4 text-sm text-ink-soft">Currently based in: {person.current_residence}</p>
      )}

      {person.biography && <p className="mt-8 text-lg leading-8 text-ink-soft">{person.biography}</p>}

      {person.associated_locations.length > 0 && (
        <p className="mt-6 text-sm text-ink-soft">
          Associated locations: {person.associated_locations.join(", ")}
        </p>
      )}

      <AttachedPhotos entityType="person" entityId={person.id} />

      {(places.length > 0 || events.length > 0) && (
        <div className="mt-8 flex flex-wrap gap-10 border-t border-line pt-6">
          {places.length > 0 && (
            <div>
              <h2 className="font-display text-lg font-semibold text-ink">Associated places</h2>
              <ul className="mt-2 space-y-1">
                {places.map((place) => (
                  <li key={place.slug}>
                    <Link
                      href={`/places/${place.slug}`}
                      className="text-sm font-medium text-accent underline underline-offset-2"
                    >
                      {place.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {events.length > 0 && (
            <div>
              <h2 className="font-display text-lg font-semibold text-ink">Related events</h2>
              <ul className="mt-2 space-y-1">
                {events.map((event) => (
                  <li key={event.slug}>
                    <Link
                      href={`/history/${event.slug}`}
                      className="text-sm font-medium text-accent underline underline-offset-2"
                    >
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
