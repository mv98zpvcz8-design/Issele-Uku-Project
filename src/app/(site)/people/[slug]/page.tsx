import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { EvidenceBadge } from "@/components/archive/EvidenceBadge";
import { ConfidenceLabel } from "@/components/archive/ConfidenceLabel";
import { StateNotice, NOT_CONNECTED_NOTICE } from "@/components/ui/StateNotice";
import { createClient } from "@/lib/supabase/server";
import { SUPABASE_CONFIGURED } from "@/lib/supabase/config";

async function getPersonDetail(slug: string) {
  const supabase = await createClient();

  const { data: person } = await supabase.from("people").select("*").eq("slug", slug).maybeSingle();
  if (!person) return null;

  const { data: links } = await supabase.from("person_sources").select("source_id").eq("person_id", person.id);
  const sourceIds = (links ?? []).map((l) => l.source_id);
  const { data: sources } = sourceIds.length
    ? await supabase.from("sources").select("slug, title, citation").in("id", sourceIds)
    : { data: [] };

  return { person, sources: sources ?? [] };
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

  const { person, sources } = detail;

  return (
    <Container className="max-w-3xl py-12 sm:py-16">
      <Link href="/people" className="text-sm font-medium text-accent hover:underline">
        ← Back to people
      </Link>

      <h1 className="mt-4 font-display text-3xl font-semibold text-ink sm:text-4xl">{person.name}</h1>
      {person.titles.length > 0 && <p className="mt-1 text-ink-soft">{person.titles.join(", ")}</p>}
      {person.alternative_names.length > 0 && (
        <p className="mt-1 text-sm text-ink-soft">Also known as: {person.alternative_names.join(", ")}</p>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <EvidenceBadge evidenceType={person.evidence_type} />
        <ConfidenceLabel confidenceLevel={person.confidence_level} />
        {(person.birth_date || person.death_date) && (
          <span className="text-sm text-ink-soft">
            {person.birth_date ?? "?"} – {person.death_date ?? "present"}
          </span>
        )}
      </div>

      {person.biography && <p className="mt-8 text-lg leading-8 text-ink-soft">{person.biography}</p>}

      {person.associated_locations.length > 0 && (
        <p className="mt-6 text-sm text-ink-soft">
          Associated locations: {person.associated_locations.join(", ")}
        </p>
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
