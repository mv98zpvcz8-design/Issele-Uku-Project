import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { StateNotice, NOT_CONNECTED_NOTICE, LOAD_ERROR_NOTICE } from "@/components/ui/StateNotice";
import { createClient } from "@/lib/supabase/server";
import { SUPABASE_CONFIGURED } from "@/lib/supabase/config";
import { accessStatusLabel } from "@/lib/content/labels";

export const metadata: Metadata = {
  title: "Research Library",
  description: "Bibliographic records for books, journal articles, theses, archival collections and more.",
};

export default async function ResearchLibraryPage() {
  return (
    <Container className="py-12 sm:py-16">
      <p className="text-sm font-medium uppercase tracking-widest text-accent">Research Library</p>
      <h1 className="mt-3 font-display text-3xl font-semibold text-ink sm:text-4xl">
        Bibliographic records
      </h1>
      <p className="mt-4 max-w-2xl text-ink-soft">
        Books, journal articles, theses, archival collections, official documents, newspaper
        material, websites and research projects relevant to Issele-Uku. Each entry states
        clearly whether full text, external access, or metadata only is available.
      </p>

      <div className="mt-8">
        {!SUPABASE_CONFIGURED ? (
          <StateNotice variant="not-connected" {...NOT_CONNECTED_NOTICE} />
        ) : (
          <SourceList />
        )}
      </div>
    </Container>
  );
}

async function SourceList() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("sources").select("*").order("title", { ascending: true });

  if (error) return <StateNotice variant="error" {...LOAD_ERROR_NOTICE} />;

  if (!data || data.length === 0) {
    return (
      <StateNotice
        variant="empty"
        title="No bibliographic records published yet."
        description="This section is being built out as sources are catalogued and verified."
      />
    );
  }

  return (
    <ul className="mt-2 divide-y divide-line border-y border-line">
      {data.map((source) => (
        <li key={source.id}>
          <Link
            href={`/research-library/${source.slug}`}
            className="flex flex-col gap-2 py-5 transition-colors hover:bg-paper-muted sm:flex-row sm:items-start sm:justify-between"
          >
            <div>
              <h2 className="font-display text-lg font-semibold text-ink">{source.title}</h2>
              <p className="mt-1 text-sm text-ink-soft">
                {[source.author, source.publisher, source.publication_date?.slice(0, 4)]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
            </div>
            <span className="shrink-0 rounded-full border border-line bg-paper px-2.5 py-1 text-xs font-medium text-ink-soft">
              {accessStatusLabel(source.access_status)}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
