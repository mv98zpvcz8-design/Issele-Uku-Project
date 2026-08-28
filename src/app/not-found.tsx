import Link from "next/link";
import { Container } from "@/components/layout/Container";

export default function NotFound() {
  return (
    <Container className="flex flex-1 flex-col items-start justify-center py-24">
      <p className="text-sm font-medium uppercase tracking-widest text-accent">404</p>
      <h1 className="mt-3 font-display text-3xl font-semibold text-ink">Page not found</h1>
      <p className="mt-4 max-w-md text-ink-soft">
        The page you&apos;re looking for doesn&apos;t exist, or hasn&apos;t
        been built yet.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-md bg-ink px-5 py-3 text-sm font-semibold text-paper transition-colors hover:bg-accent"
      >
        Return home
      </Link>
    </Container>
  );
}
