import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { EvidenceBadge } from "@/components/archive/EvidenceBadge";
import { ConfidenceLabel } from "@/components/archive/ConfidenceLabel";
import { CopyrightNotice } from "@/components/archive/CopyrightNotice";
import { humanizeRecordType } from "@/lib/archive/labels";
import { createClient } from "@/lib/supabase/server";

const SUPABASE_CONFIGURED = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

async function getItem(slug: string) {
  const supabase = await createClient();
  // RLS already restricts this to publicly-visible rows for an
  // unauthenticated request — no need to filter on verification_status
  // here, the database is the enforcement point (see ARCHITECTURE.md).
  const { data } = await supabase.from("archive_items").select("*").eq("slug", slug).maybeSingle();
  return data;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  if (!SUPABASE_CONFIGURED) return { title: "Archive record" };
  const { slug } = await params;
  const item = await getItem(slug);
  if (!item) return { title: "Archive record" };
  return {
    title: item.title,
    description: item.description ?? item.abstract ?? undefined,
  };
}

export default async function ArchiveItemPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  if (!SUPABASE_CONFIGURED) {
    return (
      <Container className="py-16">
        <div className="rounded-lg border border-dashed border-line bg-paper-muted p-8 text-center">
          <p className="font-semibold text-ink">The archive database isn&apos;t connected yet.</p>
          <p className="mt-2 text-sm text-ink-soft">
            This page will show the record once a Supabase project is connected.
          </p>
        </div>
      </Container>
    );
  }

  const { slug } = await params;
  const item = await getItem(slug);

  if (!item) {
    notFound();
  }

  return (
    <Container className="max-w-3xl py-12 sm:py-16">
      <Link href="/archive" className="text-sm font-medium text-accent hover:underline">
        ← Back to archive
      </Link>

      <p className="mt-4 text-sm font-medium uppercase tracking-widest text-accent">
        {humanizeRecordType(item.record_type)}
      </p>
      <h1 className="mt-2 font-display text-3xl font-semibold text-ink sm:text-4xl">{item.title}</h1>
      {item.subtitle && <p className="mt-2 text-lg text-ink-soft">{item.subtitle}</p>}

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <EvidenceBadge evidenceType={item.evidence_type} />
        <ConfidenceLabel confidenceLevel={item.confidence_level} />
        {item.date_display && <span className="text-sm text-ink-soft">{item.date_display}</span>}
      </div>

      <div className="mt-6 flex aspect-video items-center justify-center rounded-lg border border-dashed border-line bg-paper-muted">
        <p className="text-sm text-ink-soft">No media attached to this record yet.</p>
      </div>

      {item.description && (
        <p className="mt-8 text-lg leading-8 text-ink-soft">{item.description}</p>
      )}

      {item.abstract && (
        <div className="mt-6">
          <h2 className="font-display text-lg font-semibold text-ink">Abstract</h2>
          <p className="mt-2 leading-7 text-ink-soft">{item.abstract}</p>
        </div>
      )}

      {item.cultural_sensitivity && (
        <div className="mt-6 rounded-lg border border-line bg-paper-muted p-4">
          <p className="text-sm font-semibold text-ink">A note on this record</p>
          <p className="mt-1 text-sm text-ink-soft">{item.cultural_sensitivity}</p>
        </div>
      )}

      <dl className="mt-10 grid gap-x-8 gap-y-4 border-t border-line pt-6 sm:grid-cols-2">
        {item.historical_period && (
          <Field label="Historical period" value={item.historical_period} />
        )}
        {item.creator && <Field label="Creator" value={item.creator} />}
        {item.contributor && <Field label="Contributor" value={item.contributor} />}
        {item.location && <Field label="Location" value={item.location} />}
        {item.language && <Field label="Language" value={item.language} />}
        {item.source_repository && <Field label="Repository" value={item.source_repository} />}
      </dl>

      {(item.source_name || item.source_citation || item.source_url) && (
        <div className="mt-8 border-t border-line pt-6">
          <h2 className="font-display text-lg font-semibold text-ink">Source</h2>
          {item.source_citation && <p className="mt-2 text-sm text-ink-soft">{item.source_citation}</p>}
          {!item.source_citation && item.source_name && (
            <p className="mt-2 text-sm text-ink-soft">{item.source_name}</p>
          )}
          {item.source_url && (
            <a
              href={item.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-block text-sm font-medium text-accent underline underline-offset-2"
            >
              View external source →
            </a>
          )}
        </div>
      )}

      <div className="mt-8 border-t border-line pt-6">
        <h2 className="font-display text-lg font-semibold text-ink">Rights</h2>
        <div className="mt-2">
          <CopyrightNotice copyrightStatus={item.copyright_status} rightsHolder={item.rights_holder} />
        </div>
      </div>

      <div className="mt-10 rounded-lg border border-dashed border-line bg-paper-muted p-4 text-sm text-ink-soft">
        Noticed an error, or can you help identify someone or something in this record?{" "}
        <Link href="/submit" className="font-medium text-accent underline underline-offset-2">
          Submit a correction
        </Link>
        .
      </div>
    </Container>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wide text-ink-soft">{label}</dt>
      <dd className="mt-1 text-sm text-ink">{value}</dd>
    </div>
  );
}
