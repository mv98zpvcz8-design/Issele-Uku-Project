import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";

// Belt-and-suspenders alongside the per-page `robots` metadata in
// layout.tsx: this is an early independent prototype and must not be
// indexed until there is a deliberate decision to open it up (see
// DECISIONS.md and NEXT_PUBLIC_ALLOW_SEARCH_INDEXING).
export default function robots(): MetadataRoute.Robots {
  const allowIndexing = process.env.NEXT_PUBLIC_ALLOW_SEARCH_INDEXING === "true";

  return {
    rules: {
      userAgent: "*",
      allow: allowIndexing ? "/" : undefined,
      disallow: allowIndexing ? undefined : "/",
    },
    sitemap: allowIndexing ? `${siteConfig.url}/sitemap.xml` : undefined,
  };
}
