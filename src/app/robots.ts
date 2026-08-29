import type { MetadataRoute } from "next";

// Belt-and-suspenders alongside the per-page `robots` metadata in
// layout.tsx: this is an early independent prototype and must not be
// indexed until there is a deliberate decision to open it up (see
// DECISIONS.md and NEXT_PUBLIC_ALLOW_SEARCH_INDEXING).
//
// /admin is disallowed unconditionally, even once public indexing is
// turned on — a crawler has no legitimate reason to see the staff
// sign-in page or learn the admin panel's URL structure, even though
// auth + RLS mean it couldn't read any actual data through it.
//
// No `sitemap` entry yet: one doesn't exist in this repo, and pointing
// robots.txt at a URL that 404s the moment indexing is turned on would
// be its own bug. Add a real sitemap.ts alongside flipping
// NEXT_PUBLIC_ALLOW_SEARCH_INDEXING to "true", not before.
export default function robots(): MetadataRoute.Robots {
  const allowIndexing = process.env.NEXT_PUBLIC_ALLOW_SEARCH_INDEXING === "true";

  return {
    rules: {
      userAgent: "*",
      allow: allowIndexing ? "/" : undefined,
      disallow: allowIndexing ? "/admin" : "/",
    },
  };
}
