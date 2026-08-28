import Link from "next/link";
import { Container } from "./Container";
import { primaryNav, secondaryNav, siteConfig } from "@/lib/site-config";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-16 border-t border-line bg-paper-muted">
      <Container className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2 lg:col-span-2">
          <p className="font-display text-lg font-semibold text-ink">{siteConfig.name}</p>
          <p className="mt-3 max-w-sm text-sm leading-6 text-ink-soft">
            {siteConfig.tagline}
          </p>
          <p className="mt-4 max-w-sm text-sm leading-6 text-ink-soft">
            An independent digital heritage initiative currently under
            development, not affiliated with or endorsed by the palace,
            any government body, or the Issele-Uku Development Union.
          </p>
        </div>

        <nav aria-label="Explore">
          <h2 className="text-sm font-semibold text-ink">Explore</h2>
          <ul className="mt-3 space-y-2">
            {primaryNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-sm text-ink-soft hover:text-accent">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="About">
          <h2 className="text-sm font-semibold text-ink">About</h2>
          <ul className="mt-3 space-y-2">
            {secondaryNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-sm text-ink-soft hover:text-accent">
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/contact" className="text-sm text-ink-soft hover:text-accent">
                Contact
              </Link>
            </li>
          </ul>
        </nav>
      </Container>

      <div className="border-t border-line">
        <Container className="flex flex-col gap-2 py-4 text-xs text-ink-soft sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {year} {siteConfig.name}. Working name — subject to change.</p>
          <p>Content is continuously researched and verified. See our sourcing policy.</p>
        </Container>
      </div>
    </footer>
  );
}
