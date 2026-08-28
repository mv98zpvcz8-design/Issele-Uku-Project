import type { ReactNode } from "react";
import { Container } from "@/components/layout/Container";

export function PagePlaceholder({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children?: ReactNode;
}) {
  return (
    <Container className="py-16 sm:py-20">
      <p className="text-sm font-medium uppercase tracking-widest text-accent">{eyebrow}</p>
      <h1 className="mt-3 font-display text-3xl font-semibold text-ink sm:text-4xl">{title}</h1>
      <p className="mt-4 max-w-2xl text-lg leading-7 text-ink-soft">{description}</p>
      <div className="mt-8 rounded-lg border border-dashed border-line bg-paper-muted p-6 text-sm text-ink-soft">
        <p className="font-semibold text-ink">Research pending.</p>
        <p className="mt-1">
          This section&apos;s structure is in place; sourced content is being
          added in a later development phase. Nothing shown elsewhere on
          this site should be read as a finished historical record until it
          carries a source and an evidence label.
        </p>
      </div>
      {children}
    </Container>
  );
}
