"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Container } from "@/components/layout/Container";

/**
 * Error boundaries are client components by contract. Deliberately does
 * NOT render `error.message` — an unhandled error could in principle
 * carry details not meant for a public visitor (a security-reviewer
 * concern, not a hypothetical one); `error.digest` is the safe,
 * information-free identifier meant for exactly this.
 */
export default function GlobalRouteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Container className="flex flex-1 flex-col items-start justify-center py-24">
      <p className="text-sm font-medium uppercase tracking-widest text-accent">Error</p>
      <h1 className="mt-3 font-display text-3xl font-semibold text-ink">Something went wrong</h1>
      <p className="mt-4 max-w-md text-ink-soft">
        This wasn&apos;t supposed to happen. Nothing has been lost — try again, or head back home.
        {error.digest && (
          <>
            {" "}
            If this keeps happening, reference{" "}
            <span className="font-mono text-xs">{error.digest}</span>.
          </>
        )}
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => reset()}
          className="rounded-md bg-ink px-5 py-3 text-sm font-semibold text-paper transition-colors hover:bg-accent"
        >
          Try again
        </button>
        <Link
          href="/"
          className="rounded-md border border-line px-5 py-3 text-sm font-medium text-ink-soft hover:text-ink"
        >
          Return home
        </Link>
      </div>
    </Container>
  );
}
