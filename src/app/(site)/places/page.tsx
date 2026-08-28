import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { EvidenceBadge } from "@/components/archive/EvidenceBadge";
import { StateNotice, NOT_CONNECTED_NOTICE, LOAD_ERROR_NOTICE } from "@/components/ui/StateNotice";
import { createClient } from "@/lib/supabase/server";
import { SUPABASE_CONFIGURED } from "@/lib/supabase/config";

export const metadata: Metadata = { title: "Places" };

export default async function PlacesPage() {
  return (
    <Container className="py-12 sm:py-16">
      <p className="text-sm font-medium uppercase tracking-widest text-accent">People & Places</p>
      <h1 className="mt-3 font-display text-3xl font-semibold text-ink sm:text-4xl">Places</h1>
      <p className="mt-4 max-w-2xl text-ink-soft">
        Quarters, historical locations, the palace, markets, churches, schools and culturally
        significant sites in and around Issele-Uku.
      </p>

      <div className="mt-8">
        {!SUPABASE_CONFIGURED ? (
          <StateNotice variant="not-connected" {...NOT_CONNECTED_NOTICE} />
        ) : (
          <PlacesList />
        )}
      </div>
    </Container>
  );
}

async function PlacesList() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("places").select("*").order("name", { ascending: true });

  if (error) return <StateNotice variant="error" {...LOAD_ERROR_NOTICE} />;

  if (!data || data.length === 0) {
    return (
      <StateNotice
        variant="empty"
        title="No places published yet."
        description="This section is being built out as descriptions are researched and verified."
      />
    );
  }

  return (
    <ul className="mt-2 divide-y divide-line border-y border-line">
      {data.map((place) => (
        <li key={place.id}>
          <Link
            href={`/places/${place.slug}`}
            className="flex flex-col gap-2 py-5 transition-colors hover:bg-paper-muted sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <h2 className="font-display text-lg font-semibold text-ink">{place.name}</h2>
              {place.category && <p className="mt-1 text-sm capitalize text-ink-soft">{place.category}</p>}
            </div>
            <EvidenceBadge evidenceType={place.evidence_type} />
          </Link>
        </li>
      ))}
    </ul>
  );
}
