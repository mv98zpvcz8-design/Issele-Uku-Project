import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { primaryNav, siteConfig } from "@/lib/site-config";

export default function HomePage() {
  return (
    <>
      <section className="border-b border-line bg-paper py-16 sm:py-24">
        <Container>
          <p className="hero-enter text-sm font-medium uppercase tracking-widest text-accent">
            {siteConfig.location}
          </p>
          <h1 className="hero-enter mt-4 max-w-3xl font-display text-4xl font-semibold leading-tight text-ink sm:text-5xl [animation-delay:80ms]">
            {siteConfig.tagline}
          </h1>
          <p className="hero-enter mt-6 max-w-2xl text-lg leading-8 text-ink-soft [animation-delay:160ms]">
            {siteConfig.name} is a community and diaspora-built effort to
            gather, verify and preserve the history, culture and living
            memory of Issele-Uku — as a searchable archive, a research
            library, and a place to explore where this history comes from.
          </p>
          <div className="hero-enter mt-8 flex flex-wrap gap-3 [animation-delay:240ms]">
            <Link
              href="/history"
              className="rounded-md bg-ink px-5 py-3 text-sm font-semibold text-paper transition-all duration-200 hover:-translate-y-0.5 hover:bg-accent hover:shadow-md"
            >
              Explore History
            </Link>
            <Link
              href="/archive"
              className="rounded-md border border-line px-5 py-3 text-sm font-semibold text-ink transition-all duration-200 hover:-translate-y-0.5 hover:border-accent hover:text-accent hover:shadow-sm"
            >
              Browse the Archive
            </Link>
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container>
          <h2 className="reveal font-display text-2xl font-semibold text-ink">What you can explore</h2>
          <p className="reveal mt-2 max-w-2xl text-ink-soft">
            The archive is organized around six main sections. Each is being
            built out with sourced, evidence-labelled material — content
            that isn&apos;t yet verified is marked clearly rather than
            presented as settled fact.
          </p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {primaryNav
              .filter((item) => item.href !== "/timeline")
              .map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="reveal group rounded-lg border border-line bg-paper p-6 transition-all duration-200 hover:-translate-y-1 hover:border-accent hover:shadow-md"
                >
                  <h3 className="font-display text-lg font-semibold text-ink transition-colors group-hover:text-accent">
                    {item.label}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-ink-soft">{item.description}</p>
                </Link>
              ))}
          </div>
        </Container>
      </section>

      <section className="border-y border-line bg-paper-muted py-16 sm:py-20">
        <Container className="reveal max-w-3xl">
          <h2 className="font-display text-2xl font-semibold text-ink">
            An independent, ongoing effort
          </h2>
          <div className="mt-4 space-y-4 text-ink-soft">
            <p>
              This project is currently an independent community and
              diaspora initiative. It has not yet been formally endorsed by
              the palace, the Issele-Uku Development Union, or any
              government body.
            </p>
            <p>
              Historical material here is continuously being researched,
              sourced and verified. Where an account is based on oral
              tradition, interpretation, or has not yet been verified, that
              is stated plainly next to the record rather than presented as
              settled fact.
            </p>
          </div>
          <Link
            href="/transparency"
            className="mt-6 inline-block text-sm font-semibold text-accent underline underline-offset-4 transition-opacity hover:opacity-70"
          >
            Read the full transparency &amp; methodology statement →
          </Link>
        </Container>
      </section>
    </>
  );
}
