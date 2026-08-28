/**
 * Central branding and navigation configuration.
 *
 * The working project name and mission statement are not finalized. Every
 * user-facing surface (metadata, header, footer, homepage) should read from
 * this file rather than hard-coding the name, so a rebrand later is a
 * one-file change, not a repo-wide find-and-replace.
 */

export const siteConfig = {
  name: "Oligbo Digital Archive",
  shortName: "Oligbo Archive",
  tagline: "Preserve Issele-Uku's past. Connect Issele-Uku's people. Support Issele-Uku's future.",
  description:
    "An independent, community-built digital heritage archive for Issele-Uku, Delta State, Nigeria — history, culture, oral history and photographic records, presented with clear sourcing and evidence labelling.",
  location: "Issele-Uku, Delta State, Nigeria",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  contactEmail: "contact@example.org",
} as const;

export type NavItem = {
  label: string;
  href: string;
  description: string;
};

export const primaryNav: NavItem[] = [
  { label: "History", href: "/history", description: "Periods, events, migrations and political developments." },
  { label: "Monarchy", href: "/monarchy", description: "The traditional institution and the list of Obis." },
  { label: "Culture", href: "/culture", description: "Festivals, customs, language, dress and ceremony." },
  { label: "People & Places", href: "/people", description: "Notable figures, quarters, markets and landmarks." },
  { label: "Archive", href: "/archive", description: "Search photographs, documents, audio, maps and more." },
  { label: "Research Library", href: "/research-library", description: "Bibliographic records for books, papers and sources." },
  { label: "Timeline", href: "/timeline", description: "An interactive historical timeline." },
];

export const secondaryNav: NavItem[] = [
  { label: "Transparency", href: "/transparency", description: "Who built this, methodology, and current status." },
  { label: "Submit", href: "/submit", description: "Offer corrections, sources or material for review." },
  { label: "Privacy", href: "/privacy", description: "How we handle personal data." },
];
