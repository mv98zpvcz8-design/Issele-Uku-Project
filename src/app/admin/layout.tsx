import type { Metadata } from "next";
import type { ReactNode } from "react";

// A crawler shouldn't index the staff sign-in page or any admin page
// regardless of the public site's own indexing setting — robots.ts
// already disallows crawling /admin, but a meta `noindex` is the
// stronger signal for a URL a crawler discovers some other way (a
// stray external link, for instance), since it survives even where a
// disallow rule doesn't guarantee de-indexing. Applies to /admin/login
// and everything under /admin/(protected) — this layout sits above
// both without adding any markup of its own, so it doesn't interact
// with the auth guard, which stays solely on (protected)/layout.tsx
// (see DECISIONS.md D-028).
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return children;
}
