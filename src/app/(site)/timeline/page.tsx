import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { EvidenceBadge } from "@/components/archive/EvidenceBadge";
import { TimelineFilters } from "@/components/timeline/TimelineFilters";
import { StateNotice, NOT_CONNECTED_NOTICE, LOAD_ERROR_NOTICE } from "@/components/ui/StateNotice";
import { buildTimelineSearchFilter, parseTimelineSearchParams } from "@/lib/timeline/search";
import { sortEventsChronologically } from "@/lib/timeline/sort";
import { createClient } from "@/lib/supabase/server";
import { SUPABASE_CONFIGURED } from "@/lib/supabase/config";

export const metadata: Metadata = {
  title: "Timeline",
  description: "An interactive historical timeline supporting uncertain dates and date ranges.",
};

export default async function TimelinePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const rawSearchParams = await searchParams;
  const filters = parseTimelineSearchParams(rawSearchParams);

  return (
    <Container className="py-12 sm:py-16">
      <p className="text-sm font-medium uppercase tracking-widest text-accent">Timeline</p>
      <h1 className="mt-3 font-display text-3xl font-semibold text-ink sm:text-4xl">
        An interactive historical timeline
      </h1>
      <p className="mt-4 max-w-2xl text-ink-soft">
        Events are ordered chronologically where a date is known; events with only an approximate
        or uncertain date are shown with that uncertainty stated plainly rather than a guessed
        exact date. See also{" "}
        <Link href="/history" className="font-medium text-accent underline underline-offset-2">
          History
        </Link>
        .
      </p>

      <div className="mt-8">
        <TimelineFilters filters={filters} />
      </div>

      <div className="mt-10">
        {!SUPABASE_CONFIGURED ? (
          <StateNotice variant="not-connected" {...NOT_CONNECTED_NOTICE} />
        ) : (
          <TimelineEvents filters={filters} />
        )}
      </div>
    </Container>
  );
}

async function TimelineEvents({ filters }: { filters: ReturnType<typeof parseTimelineSearchParams> }) {
  const supabase = await createClient();

  let query = supabase.from("historical_events").select("*");
  if (filters.q) query = query.or(buildTimelineSearchFilter(filters.q));
  if (filters.evidenceType) query = query.eq("evidence_type", filters.evidenceType);

  const { data: fetchedEvents, error } = await query;

  if (error) return <StateNotice variant="error" {...LOAD_ERROR_NOTICE} />;

  // Sorted client-side, not via .order() — date_from and date_exact are
  // alternative ways of expressing a known date (an event has one or the
  // other), and PostgREST can't coalesce two columns into one sort key.
  // See sort.ts for why chaining .order() calls would silently misorder
  // events that only have date_exact set.
  const events = fetchedEvents ? sortEventsChronologically(fetchedEvents) : fetchedEvents;

  if (!events || events.length === 0) {
    return (
      <StateNotice
        variant="empty"
        title="No events match these filters."
        description="Try clearing a filter, or check back later — the timeline is continuously growing."
      />
    );
  }

  const eventIds = events.map((e) => e.id);
  const locationIds = [...new Set(events.map((e) => e.location_id).filter((id): id is string => Boolean(id)))];

  const [placesResult, eventPeopleResult, eventArchiveItemsResult] = await Promise.all([
    locationIds.length
      ? supabase.from("places").select("id, slug, name").in("id", locationIds)
      : Promise.resolve({ data: [] }),
    supabase.from("event_people").select("event_id, person_id").in("event_id", eventIds),
    supabase.from("event_archive_items").select("event_id, archive_item_id").in("event_id", eventIds),
  ]);

  const places = placesResult.data ?? [];
  const personIds = [...new Set((eventPeopleResult.data ?? []).map((r) => r.person_id))];
  const archiveItemIds = [...new Set((eventArchiveItemsResult.data ?? []).map((r) => r.archive_item_id))];

  const [peopleResult, archiveItemsResult] = await Promise.all([
    personIds.length
      ? supabase.from("people").select("id, slug, name").in("id", personIds)
      : Promise.resolve({ data: [] }),
    archiveItemIds.length
      ? supabase.from("archive_items").select("id, slug, title").in("id", archiveItemIds)
      : Promise.resolve({ data: [] }),
  ]);

  const placeById = new Map(places.map((p) => [p.id, p]));
  const peopleById = new Map((peopleResult.data ?? []).map((p) => [p.id, p]));
  const archiveItemById = new Map((archiveItemsResult.data ?? []).map((a) => [a.id, a]));

  const peopleByEvent = new Map<string, { slug: string; name: string }[]>();
  for (const link of eventPeopleResult.data ?? []) {
    const person = peopleById.get(link.person_id);
    if (!person) continue;
    const list = peopleByEvent.get(link.event_id) ?? [];
    list.push(person);
    peopleByEvent.set(link.event_id, list);
  }

  const archiveItemsByEvent = new Map<string, { slug: string; title: string }[]>();
  for (const link of eventArchiveItemsResult.data ?? []) {
    const item = archiveItemById.get(link.archive_item_id);
    if (!item) continue;
    const list = archiveItemsByEvent.get(link.event_id) ?? [];
    list.push(item);
    archiveItemsByEvent.set(link.event_id, list);
  }

  return (
    <ol className="relative border-l border-line pl-6 sm:pl-8">
      {events.map((event) => {
        const place = event.location_id ? placeById.get(event.location_id) : undefined;
        const people = peopleByEvent.get(event.id) ?? [];
        const archiveItems = archiveItemsByEvent.get(event.id) ?? [];

        return (
          <li key={event.id} className="relative pb-10 last:pb-0">
            <span
              aria-hidden="true"
              className="absolute -left-[calc(1.5rem+3px)] top-1.5 h-2.5 w-2.5 rounded-full bg-accent sm:-left-[calc(2rem+3px)]"
            />

            <div className="flex flex-wrap items-center gap-3">
              {event.date_display && (
                <span className="text-sm font-semibold text-accent">{event.date_display}</span>
              )}
              <EvidenceBadge evidenceType={event.evidence_type} />
            </div>

            <h2 className="mt-1 font-display text-lg font-semibold text-ink">
              <Link href={`/history/${event.slug}`} className="hover:text-accent">
                {event.title}
              </Link>
            </h2>

            {event.description && (
              <p className="mt-1 line-clamp-2 max-w-2xl text-sm text-ink-soft">{event.description}</p>
            )}

            {(place || people.length > 0 || archiveItems.length > 0) && (
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-soft">
                {place && (
                  <Link href={`/places/${place.slug}`} className="hover:text-accent hover:underline">
                    📍 {place.name}
                  </Link>
                )}
                {people.map((person) => (
                  <Link key={person.slug} href={`/people/${person.slug}`} className="hover:text-accent hover:underline">
                    {person.name}
                  </Link>
                ))}
                {archiveItems.map((item) => (
                  <Link key={item.slug} href={`/archive/${item.slug}`} className="hover:text-accent hover:underline">
                    View record: {item.title}
                  </Link>
                ))}
              </div>
            )}
          </li>
        );
      })}
    </ol>
  );
}
