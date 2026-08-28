import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { EvidenceBadge } from "@/components/archive/EvidenceBadge";
import { StateNotice, NOT_CONNECTED_NOTICE, LOAD_ERROR_NOTICE } from "@/components/ui/StateNotice";
import { createClient } from "@/lib/supabase/server";
import { SUPABASE_CONFIGURED } from "@/lib/supabase/config";

export const metadata: Metadata = {
  title: "History",
  description: "Chronological periods, events, migrations and political developments.",
};

export default async function HistoryPage() {
  return (
    <Container className="py-12 sm:py-16">
      <p className="text-sm font-medium uppercase tracking-widest text-accent">History</p>
      <h1 className="mt-3 font-display text-3xl font-semibold text-ink sm:text-4xl">
        Periods, events and developments
      </h1>
      <p className="mt-4 max-w-2xl text-ink-soft">
        Chronological periods, historical events, migrations, political developments and external
        relations — each with its evidence type. See also the{" "}
        <Link href="/timeline" className="font-medium text-accent underline underline-offset-2">
          interactive timeline
        </Link>
        .
      </p>

      <div className="mt-8">
        {!SUPABASE_CONFIGURED ? (
          <StateNotice variant="not-connected" {...NOT_CONNECTED_NOTICE} />
        ) : (
          <EventList />
        )}
      </div>
    </Container>
  );
}

async function EventList() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("historical_events")
    .select("*")
    .order("date_from", { ascending: true, nullsFirst: false })
    .order("title", { ascending: true });

  if (error) return <StateNotice variant="error" {...LOAD_ERROR_NOTICE} />;

  if (!data || data.length === 0) {
    return (
      <StateNotice
        variant="empty"
        title="No historical events published yet."
        description="This section is being built out. Check back as research is verified and published."
      />
    );
  }

  return (
    <ul className="mt-2 divide-y divide-line border-y border-line">
      {data.map((event) => (
        <li key={event.id}>
          <Link
            href={`/history/${event.slug}`}
            className="flex flex-col gap-2 py-5 transition-colors hover:bg-paper-muted sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <h2 className="font-display text-lg font-semibold text-ink">{event.title}</h2>
              {event.description && (
                <p className="mt-1 line-clamp-2 max-w-xl text-sm text-ink-soft">{event.description}</p>
              )}
            </div>
            <div className="flex shrink-0 items-center gap-3">
              {event.date_display && <span className="text-sm text-ink-soft">{event.date_display}</span>}
              <EvidenceBadge evidenceType={event.evidence_type} />
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
