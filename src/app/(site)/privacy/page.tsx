import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = { title: "Privacy" };

export default function PrivacyPage() {
  return (
    <Container className="max-w-3xl py-16 sm:py-20">
      <p className="text-sm font-medium uppercase tracking-widest text-accent">Privacy</p>
      <h1 className="mt-3 font-display text-3xl font-semibold text-ink sm:text-4xl">
        Privacy policy (placeholder)
      </h1>
      <div className="mt-6 space-y-4 text-ink-soft">
        <p>
          {siteConfig.name} aims to collect as little personal information
          as possible. This page will be expanded into a full privacy
          policy before the submission and admin systems go live; for now
          it records our current intentions.
        </p>
        <p>
          <strong className="text-ink">What we intend to collect:</strong>{" "}
          only what is needed to review a correction or submission (such as
          a name and contact method, if you choose to provide one) and
          basic account information for administrators. We do not intend to
          collect personal data through tracking or advertising.
        </p>
        <p>
          <strong className="text-ink">Living individuals:</strong>{" "}
          personal information about living private individuals is not
          published without appropriate care and, where practical, consent.
        </p>
        <p>
          <strong className="text-ink">Data retention:</strong> submitted
          material and correction requests are retained for as long as
          needed for review, and indefinitely if incorporated into the
          archive with permission; otherwise it can be deleted on request.
        </p>
        <p>
          <strong className="text-ink">Deletion requests:</strong> if you
          have submitted personal data and would like it removed, contact
          us via the{" "}
          <a href="/contact" className="font-medium text-accent underline underline-offset-2">
            contact page
          </a>
          .
        </p>
      </div>
    </Container>
  );
}
