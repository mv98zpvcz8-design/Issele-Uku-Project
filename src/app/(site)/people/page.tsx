import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { EvidenceBadge } from "@/components/archive/EvidenceBadge";
import { StateNotice, NOT_CONNECTED_NOTICE, LOAD_ERROR_NOTICE } from "@/components/ui/StateNotice";
import { createClient } from "@/lib/supabase/server";
import { SUPABASE_CONFIGURED } from "@/lib/supabase/config";

export const metadata: Metadata = { title: "People & Places" };

export default async function PeoplePage() {
  return (
    <Container className="py-12 sm:py-16">
      <p className="text-sm font-medium uppercase tracking-widest text-accent">People & Places</p>
      <h1 className="mt-3 font-display text-3xl font-semibold text-ink sm:text-4xl">People</h1>
      <p className="mt-4 max-w-2xl text-ink-soft">
        Traditional leaders, historical figures, artists, academics and notable residents.
        Personal information about living private individuals is not published without
        appropriate care. Looking for quarters, markets and landmarks? Visit{" "}
        <Link href="/places" className="font-medium text-accent underline underline-offset-2">
          Places
        </Link>
        .
      </p>

      <div className="mt-8">
        {!SUPABASE_CONFIGURED ? (
          <StateNotice variant="not-connected" {...NOT_CONNECTED_NOTICE} />
        ) : (
          <PeopleList />
        )}
      </div>
    </Container>
  );
}

async function PeopleList() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("people").select("*").order("name", { ascending: true });

  if (error) return <StateNotice variant="error" {...LOAD_ERROR_NOTICE} />;

  if (!data || data.length === 0) {
    return (
      <StateNotice
        variant="empty"
        title="No people published yet."
        description="This section is being built out as biographies are researched and verified."
      />
    );
  }

  return (
    <ul className="mt-2 divide-y divide-line border-y border-line">
      {data.map((person) => (
        <li key={person.id}>
          <Link
            href={`/people/${person.slug}`}
            className="flex flex-col gap-2 py-5 transition-colors hover:bg-paper-muted sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <h2 className="font-display text-lg font-semibold text-ink">{person.name}</h2>
              {person.titles.length > 0 && (
                <p className="mt-1 text-sm text-ink-soft">{person.titles.join(", ")}</p>
              )}
            </div>
            <EvidenceBadge evidenceType={person.evidence_type} />
          </Link>
        </li>
      ))}
    </ul>
  );
}
