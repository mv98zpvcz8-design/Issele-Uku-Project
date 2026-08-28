import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { EvidenceBadge } from "@/components/archive/EvidenceBadge";
import { StateNotice, NOT_CONNECTED_NOTICE, LOAD_ERROR_NOTICE } from "@/components/ui/StateNotice";
import { createClient } from "@/lib/supabase/server";
import { SUPABASE_CONFIGURED } from "@/lib/supabase/config";

export const metadata: Metadata = {
  title: "Monarchy",
  description: "An overview of the traditional institution and the list of Obis.",
};

export default async function MonarchyPage() {
  return (
    <Container className="py-12 sm:py-16">
      <p className="text-sm font-medium uppercase tracking-widest text-accent">Monarchy</p>
      <h1 className="mt-3 font-display text-3xl font-semibold text-ink sm:text-4xl">
        The traditional institution
      </h1>
      <p className="mt-4 max-w-2xl text-ink-soft">
        An overview of the traditional institution and a list of Obis, each with reign dates,
        historical notes and available sources — published only as sources are confirmed.
      </p>

      <div className="mt-8">
        {!SUPABASE_CONFIGURED ? (
          <StateNotice variant="not-connected" {...NOT_CONNECTED_NOTICE} />
        ) : (
          <MonarchList />
        )}
      </div>
    </Container>
  );
}

async function MonarchList() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("monarchs")
    .select("*")
    .order("reign_start", { ascending: true, nullsFirst: false })
    .order("name", { ascending: true });

  if (error) return <StateNotice variant="error" {...LOAD_ERROR_NOTICE} />;

  if (!data || data.length === 0) {
    return (
      <StateNotice
        variant="empty"
        title="No monarchy records published yet."
        description="This section is being built out as sources are verified."
      />
    );
  }

  return (
    <ul className="mt-2 divide-y divide-line border-y border-line">
      {data.map((monarch) => (
        <li key={monarch.id}>
          <Link
            href={`/monarchy/${monarch.slug}`}
            className="flex flex-col gap-2 py-5 transition-colors hover:bg-paper-muted sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <h2 className="font-display text-lg font-semibold text-ink">
                {monarch.regnal_name ?? monarch.name}
              </h2>
              {monarch.reign_display && <p className="mt-1 text-sm text-ink-soft">{monarch.reign_display}</p>}
            </div>
            <EvidenceBadge evidenceType={monarch.evidence_type} />
          </Link>
        </li>
      ))}
    </ul>
  );
}
