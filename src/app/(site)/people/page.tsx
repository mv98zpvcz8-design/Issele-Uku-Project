import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { EvidenceBadge } from "@/components/archive/EvidenceBadge";
import { StateNotice, NOT_CONNECTED_NOTICE, LOAD_ERROR_NOTICE } from "@/components/ui/StateNotice";
import { PERSON_CATEGORY_LABELS } from "@/lib/content/labels";
import { createClient } from "@/lib/supabase/server";
import { SUPABASE_CONFIGURED } from "@/lib/supabase/config";
import type { Database } from "@/lib/supabase/types";

type Person = Database["public"]["Tables"]["people"]["Row"];

const CATEGORY_ORDER: Person["person_category"][] = [
  "historical",
  "contemporary_local",
  "notable_diaspora",
  "mentioned",
];

export const metadata: Metadata = { title: "People & Places" };

export default async function PeoplePage() {
  return (
    <Container className="py-12 sm:py-16">
      <p className="text-sm font-medium uppercase tracking-widest text-accent">People & Places</p>
      <h1 className="mt-3 font-display text-3xl font-semibold text-ink sm:text-4xl">People</h1>
      <p className="mt-4 max-w-2xl text-ink-soft">
        Traditional leaders, historical figures, artists and academics — including notable people
        now living in the diaspora, and people who appear within a story, event or source but do
        not yet have dedicated research of their own. Personal information about living private
        individuals is not published without appropriate care. Looking for quarters, markets and
        landmarks? Visit{" "}
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

  const groups = CATEGORY_ORDER.map((category) => ({
    category,
    people: data.filter((person) => person.person_category === category),
  })).filter((group) => group.people.length > 0);

  return (
    <div className="mt-2 space-y-10">
      {groups.map((group) => (
        <section key={group.category}>
          <h2 className="font-display text-xl font-semibold text-ink">
            {PERSON_CATEGORY_LABELS[group.category]}
          </h2>
          <ul className="mt-2 divide-y divide-line border-y border-line">
            {group.people.map((person) => (
              <li key={person.id}>
                <Link
                  href={`/people/${person.slug}`}
                  className="flex flex-col gap-2 py-5 transition-colors hover:bg-paper-muted sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <h3 className="font-display text-lg font-semibold text-ink">{person.name}</h3>
                    {person.titles.length > 0 && (
                      <p className="mt-1 text-sm text-ink-soft">{person.titles.join(", ")}</p>
                    )}
                    {person.current_residence && (
                      <p className="mt-1 text-sm text-ink-soft">Based in: {person.current_residence}</p>
                    )}
                  </div>
                  <EvidenceBadge evidenceType={person.evidence_type} />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
