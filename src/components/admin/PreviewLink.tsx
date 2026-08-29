import Link from "next/link";

/**
 * Links straight to the real public URL — no separate preview
 * rendering path needed. This works even for a DRAFT/REVIEW record
 * because RLS's "staff can read all" policy applies to the admin's own
 * authenticated session: a signed-in staff member sees the same page an
 * anonymous visitor would once it's PUBLISHED, using the live public
 * route, not a special-cased preview mode that could drift from it.
 */
export function PreviewLink({ href }: { href: string }) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-sm font-medium text-accent hover:underline"
    >
      Preview on public site →
    </Link>
  );
}
