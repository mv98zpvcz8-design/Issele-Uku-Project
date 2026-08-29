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

async function getMonarchDetail(slug: string) {
  const supabase = await createClient();

  const { data: monarch } = await supabase.from("monarchs").select("*").eq("slug", slug).maybeSingle();
  if (!monarch) return null;

  // Two FKs from monarchs to monarchs (predecessor_id/successor_id) make
  // a PostgREST nested embed ambiguous without a !fkey hint — plain
  // follow-up queries are simpler to get right without a live project to
  // verify the embed syntax against.
  const [predecessorResult, successorResult, monarchSourcesResult, monarchEventsResult] = await Promise.all([
    monarch.predecessor_id
      ? supabase.from("monarchs").select("slug, name, regnal_name").eq("id", monarch.predecessor_id).maybeSingle()
      : Promise.resolve({ data: null }),
    monarch.successor_id
      ? supabase.from("monarchs").select("slug, name, regnal_name").eq("id", monarch.successor_id).maybeSingle()
      : Promise.resolve({ data: null }),
    supabase.from("monarch_sources").select("source_id").eq("monarch_id", monarch.id),
    supabase.from("monarch_events").select("event_id").eq("monarch_id", monarch.id),
  ]);

  const sourceIds = (monarchSourcesResult.data ?? []).map((r) => r.source_id);
  const eventIds = (monarchEventsResult.data ?? []).map((r) => r.event_id);

  const [sourcesResult, eventsResult] = await Promise.all([
    sourceIds.length
      ? supabase.from("sources").select("slug, title, citation").in("id", sourceIds)
      : Promise.resolve({ data: [] }),
    eventIds.length
      ? supabase.from("historical_events").select("slug, title").in("id", eventIds)
      : Promise.resolve({ data: [] }),
  ]);

  return {
    monarch,
    predecessor: predecessorResult.data,
    successor: successorResult.data,
    sources: sourcesResult.data ?? [],
    events: eventsResult.data ?? [],
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  if (!SUPABASE_CONFIGURED) return { title: "Monarch" };
  const { slug } = await params;
  const detail = await getMonarchDetail(slug);
  if (!detail) return { title: "Monarch" };
  return { title: detail.monarch.regnal_name ?? detail.monarch.name };
}

export default async function MonarchPage({ params }: { params: Promise<{ slug: string }> }) {
  if (!SUPABASE_CONFIGURED) {
    return (
      <Container className="py-16">
        <StateNotice variant="not-connected" {...NOT_CONNECTED_NOTICE} />
      </Container>
    );
  }

  const { slug } = await params;
  const detail = await getMonarchDetail(slug);
  if (!detail) notFound();

  const { monarch, predecessor, successor, sources, events } = detail;

  return (
    <Container className="max-w-3xl py-12 sm:py-16">
      <Link href="/monarchy" className="text-sm font-medium text-accent hover:underline">
        ← Back to monarchy
      </Link>

      <CoverImage mediaId={monarch.image_media_id} alt={monarch.regnal_name ?? monarch.name} />

      <h1 className="mt-4 font-display text-3xl font-semibold text-ink sm:text-4xl">
        {monarch.regnal_name ?? monarch.name}
      </h1>
      {monarch.regnal_name && monarch.regnal_name !== monarch.name && (
        <p className="mt-1 text-ink-soft">{monarch.name}</p>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <EvidenceBadge evidenceType={monarch.evidence_type} />
        <ConfidenceLabel confidenceLevel={monarch.confidence_level} />
        {monarch.reign_display && <span className="text-sm text-ink-soft">{monarch.reign_display}</span>}
      </div>

      {monarch.biography && <p className="mt-8 text-lg leading-8 text-ink-soft">{monarch.biography}</p>}

      <AttachedPhotos entityType="monarch" entityId={monarch.id} />

      {(predecessor || successor) && (
        <div className="mt-8 flex flex-wrap gap-8 border-t border-line pt-6">
          {predecessor && (
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-ink-soft">Predecessor</p>
              <Link
                href={`/monarchy/${predecessor.slug}`}
                className="mt-1 block font-medium text-accent underline underline-offset-2"
              >
                {predecessor.regnal_name ?? predecessor.name}
              </Link>
            </div>
          )}
          {successor && (
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-ink-soft">Successor</p>
              <Link
                href={`/monarchy/${successor.slug}`}
                className="mt-1 block font-medium text-accent underline underline-offset-2"
              >
                {successor.regnal_name ?? successor.name}
              </Link>
            </div>
          )}
        </div>
      )}

      {events.length > 0 && (
        <div className="mt-8 border-t border-line pt-6">
          <h2 className="font-display text-lg font-semibold text-ink">Major events</h2>
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
