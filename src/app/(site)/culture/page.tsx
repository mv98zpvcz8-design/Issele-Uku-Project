import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { StateNotice, NOT_CONNECTED_NOTICE, LOAD_ERROR_NOTICE } from "@/components/ui/StateNotice";
import { createClient } from "@/lib/supabase/server";
import { SUPABASE_CONFIGURED } from "@/lib/supabase/config";

export const metadata: Metadata = {
  title: "Culture",
  description: "Festivals, customs, language, dress and ceremony.",
};

export default async function CulturePage() {
  return (
    <Container className="py-12 sm:py-16">
      <p className="text-sm font-medium uppercase tracking-widest text-accent">Culture</p>
      <h1 className="mt-3 font-display text-3xl font-semibold text-ink sm:text-4xl">
        Living traditions and practice
      </h1>
      <p className="mt-4 max-w-2xl text-ink-soft">
        Festivals, customs, music, dance, food, clothing (including Akwa Ocha), titles, ceremonies,
        language and traditional institutions. Categories here can grow over time.
      </p>

      <div className="mt-8">
        {!SUPABASE_CONFIGURED ? (
          <StateNotice variant="not-connected" {...NOT_CONNECTED_NOTICE} />
        ) : (
          <CategoryGrid />
        )}
      </div>
    </Container>
  );
}

async function CategoryGrid() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("culture_categories").select("*").order("name", { ascending: true });

  if (error) return <StateNotice variant="error" {...LOAD_ERROR_NOTICE} />;

  if (!data || data.length === 0) {
    return (
      <StateNotice
        variant="empty"
        title="No culture categories published yet."
        description="This section is being built out. New categories can be added at any time without changing the site's structure."
      />
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {data.map((category) => (
        <Link
          key={category.id}
          href={`/culture/${category.slug}`}
          className="group rounded-lg border border-line bg-paper p-5 transition-all duration-200 hover:-translate-y-1 hover:border-accent hover:shadow-md"
        >
          <h2 className="font-display text-lg font-semibold text-ink group-hover:text-accent">
            {category.name}
          </h2>
          {category.description && (
            <p className="mt-2 line-clamp-3 text-sm leading-6 text-ink-soft">{category.description}</p>
          )}
        </Link>
      ))}
    </div>
  );
}
