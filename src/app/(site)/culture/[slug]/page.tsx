import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { EvidenceBadge } from "@/components/archive/EvidenceBadge";
import { ConfidenceLabel } from "@/components/archive/ConfidenceLabel";
import { ArchiveCard } from "@/components/archive/ArchiveCard";
import { StateNotice, NOT_CONNECTED_NOTICE } from "@/components/ui/StateNotice";
import { createClient } from "@/lib/supabase/server";
import { SUPABASE_CONFIGURED } from "@/lib/supabase/config";

async function getCategoryDetail(slug: string) {
  const supabase = await createClient();

  const { data: category } = await supabase
    .from("culture_categories")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (!category) return null;

  const { data: links } = await supabase
    .from("archive_item_culture_categories")
    .select("archive_item_id")
    .eq("category_id", category.id);

  const itemIds = (links ?? []).map((l) => l.archive_item_id);
  const { data: items } = itemIds.length
    ? await supabase.from("archive_items").select("*").in("id", itemIds)
    : { data: [] };

  return { category, items: items ?? [] };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  if (!SUPABASE_CONFIGURED) return { title: "Culture" };
  const { slug } = await params;
  const detail = await getCategoryDetail(slug);
  if (!detail) return { title: "Culture" };
  return { title: detail.category.name, description: detail.category.description ?? undefined };
}

export default async function CultureCategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  if (!SUPABASE_CONFIGURED) {
    return (
      <Container className="py-16">
        <StateNotice variant="not-connected" {...NOT_CONNECTED_NOTICE} />
      </Container>
    );
  }

  const { slug } = await params;
  const detail = await getCategoryDetail(slug);
  if (!detail) notFound();

  const { category, items } = detail;

  return (
    <Container className="py-12 sm:py-16">
      <Link href="/culture" className="text-sm font-medium text-accent hover:underline">
        ← Back to culture
      </Link>

      <h1 className="mt-4 max-w-2xl font-display text-3xl font-semibold text-ink sm:text-4xl">
        {category.name}
      </h1>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <EvidenceBadge evidenceType={category.evidence_type} />
        <ConfidenceLabel confidenceLevel={category.confidence_level} />
      </div>

      {category.description && (
        <p className="mt-6 max-w-2xl text-lg leading-8 text-ink-soft">{category.description}</p>
      )}

      {items.length > 0 && (
        <div className="mt-10 border-t border-line pt-8">
          <h2 className="font-display text-lg font-semibold text-ink">Related archive records</h2>
          <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <ArchiveCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      )}
    </Container>
  );
}
