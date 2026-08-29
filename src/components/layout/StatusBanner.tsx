import Link from "next/link";
import { Container } from "./Container";

/**
 * Prominent, unmissable independence/status disclaimer. This must never be
 * removed or softened without an explicit decision recorded in
 * DECISIONS.md — it is the primary safeguard against the site being
 * mistaken for an official palace/community publication.
 */
export function StatusBanner() {
  return (
    <div data-print-hide className="border-b border-line bg-paper-muted">
      <Container className="flex flex-col gap-1 py-2.5 text-sm text-ink-soft sm:flex-row sm:items-center sm:justify-center sm:gap-2 sm:text-center">
        <p>
          An independent digital heritage initiative currently under
          development. Not an official palace, community union, or
          government publication.
        </p>
        <Link href="/transparency" className="font-medium text-accent underline underline-offset-2">
          Read our status &amp; methodology
        </Link>
      </Container>
    </div>
  );
}
