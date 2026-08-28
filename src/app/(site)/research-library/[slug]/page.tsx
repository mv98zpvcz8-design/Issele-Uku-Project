import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { StateNotice, NOT_CONNECTED_NOTICE } from "@/components/ui/StateNotice";
import { accessStatusLabel } from "@/lib/content/labels";
import { createClient } from "@/lib/supabase/server";
import { SUPABASE_CONFIGURED } from "@/lib/supabase/config";

async function getSource(slug: string) {
  const supabase = await createClient();
  const { data } = await supabase.from("sources").select("*").eq("slug", slug).maybeSingle();
  return data;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  if (!SUPABASE_CONFIGURED) return { title: "Source" };
  const { slug } = await params;
  const source = await getSource(slug);
  if (!source) return { title: "Source" };
  return { title: source.title };
}

export default async function SourcePage({ params }: { params: Promise<{ slug: string }> }) {
  if (!SUPABASE_CONFIGURED) {
    return (
      <Container className="py-16">
        <StateNotice variant="not-connected" {...NOT_CONNECTED_NOTICE} />
      </Container>
    );
  }

  const { slug } = await params;
  const source = await getSource(slug);
  if (!source) notFound();

  return (
    <Container className="max-w-2xl py-12 sm:py-16">
      <Link href="/research-library" className="text-sm font-medium text-accent hover:underline">
        ← Back to research library
      </Link>

      <p className="mt-4 text-sm font-medium uppercase tracking-widest text-accent">
        {source.source_type?.replaceAll("_", " ") ?? "Source"}
      </p>
      <h1 className="mt-2 font-display text-3xl font-semibold text-ink sm:text-4xl">{source.title}</h1>

      <p className="mt-4 text-ink-soft">
        {[source.author, source.publisher, source.publication_date?.slice(0, 4)].filter(Boolean).join(" · ")}
      </p>

      <span className="mt-4 inline-block rounded-full border border-line bg-paper-muted px-3 py-1 text-xs font-medium text-ink-soft">
        {accessStatusLabel(source.access_status)}
      </span>

      {source.citation && (
        <div className="mt-8 border-t border-line pt-6">
          <h2 className="font-display text-lg font-semibold text-ink">Citation</h2>
          <p className="mt-2 text-ink-soft">{source.citation}</p>
        </div>
      )}

      {source.reliability_notes && (
        <div className="mt-6">
          <h2 className="font-display text-lg font-semibold text-ink">Notes</h2>
          <p className="mt-2 text-sm text-ink-soft">{source.reliability_notes}</p>
        </div>
      )}

      <dl className="mt-8 grid gap-4 border-t border-line pt-6 sm:grid-cols-2">
        {source.isbn && (
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-ink-soft">ISBN</dt>
            <dd className="mt-1 text-sm text-ink">{source.isbn}</dd>
          </div>
        )}
        {source.archive_reference && (
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-ink-soft">Archive reference</dt>
            <dd className="mt-1 text-sm text-ink">{source.archive_reference}</dd>
          </div>
        )}
      </dl>

      {source.url && (
        <a
          href={source.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-block text-sm font-medium text-accent underline underline-offset-2"
        >
          View external source →
        </a>
      )}
    </Container>
  );
}
