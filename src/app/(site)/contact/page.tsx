import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <Container className="max-w-3xl py-16 sm:py-20">
      <p className="text-sm font-medium uppercase tracking-widest text-accent">Contact</p>
      <h1 className="mt-3 font-display text-3xl font-semibold text-ink sm:text-4xl">Get in touch</h1>
      <p className="mt-6 text-lg leading-7 text-ink-soft">
        For corrections or material contributions, please use the{" "}
        <a href="/submit" className="font-medium text-accent underline underline-offset-2">
          submission form
        </a>{" "}
        so your item enters our review process. For anything else, reach us
        at{" "}
        <a
          href={`mailto:${siteConfig.contactEmail}`}
          className="font-medium text-accent underline underline-offset-2"
        >
          {siteConfig.contactEmail}
        </a>
        .
      </p>
      <p className="mt-4 text-sm text-ink-soft">
        This contact address is a placeholder until a dedicated project
        address is set up.
      </p>
    </Container>
  );
}
