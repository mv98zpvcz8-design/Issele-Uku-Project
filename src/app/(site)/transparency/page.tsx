import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Transparency & Methodology",
  description: "Who built this, our current independent status, sourcing methodology, and how to submit corrections.",
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-line py-8 first:border-t-0 first:pt-0">
      <h2 className="font-display text-xl font-semibold text-ink">{title}</h2>
      <div className="mt-3 space-y-3 text-ink-soft">{children}</div>
    </section>
  );
}

export default function TransparencyPage() {
  return (
    <Container className="max-w-3xl py-16 sm:py-20">
      <p className="text-sm font-medium uppercase tracking-widest text-accent">Transparency</p>
      <h1 className="mt-3 font-display text-3xl font-semibold text-ink sm:text-4xl">
        Status, methodology and policies
      </h1>
      <p className="mt-4 text-lg leading-7 text-ink-soft">
        This page exists so that no one — a visitor, a researcher, a
        journalist, or a member of the palace or community leadership —
        mistakes {siteConfig.name} for something it is not yet.
      </p>

      <div className="mt-10">
        <Section title="Current status">
          <p>
            {siteConfig.name} is an independent digital heritage initiative
            currently under development. It has not been created, operated,
            reviewed, endorsed, or authorized by the Obi of Issele-Uku, the
            palace, the Issele-Uku Development Union, or any government
            body.
          </p>
          <p>
            It is intended to be shown to the Obi and to relevant community
            stakeholders for review and discussion once it reaches a
            suitable stage — but until any such endorsement is explicitly
            granted and stated on this site, none should be assumed.
          </p>
        </Section>

        <Section title="Who is building this">
          <p>
            This project is being built by an individual member of the
            Issele-Uku community and diaspora, using publicly available
            tools, as a starting point for a community and diaspora-wide
            heritage effort. It is not a registered organization at this
            stage.
          </p>
        </Section>

        <Section title="Methodology and sourcing policy">
          <p>
            Historical claims on this site are, wherever possible, tied to
            a stated source and labelled with an evidence type:
          </p>
          <ul className="list-disc space-y-1 pl-5">
            <li><strong>Documented</strong> — supported by documentary, archival, academic or otherwise verifiable sources.</li>
            <li><strong>Oral tradition</strong> — based primarily on oral history, community tradition, or inherited accounts.</li>
            <li><strong>Interpretation</strong> — a scholarly or editorial interpretation rather than a directly documented fact.</li>
            <li><strong>Disputed</strong> — multiple conflicting historical accounts exist.</li>
            <li><strong>Unverified</strong> — recorded but not yet sufficiently verified for publication as settled fact.</li>
          </ul>
          <p>
            We do not treat oral tradition as proven documentary fact, and
            we do not suppress oral traditions simply because they are
            undocumented — they are labelled clearly instead. Where no
            reliable source is yet available for something the site
            structurally anticipates, we say so directly (for example,
            &ldquo;research pending&rdquo;) rather than filling the gap with
            a guess.
          </p>
        </Section>

        <Section title="Copyright policy">
          <p>
            We distinguish public-domain material, material we have
            explicit permission to host, copyrighted material for which we
            store bibliographic/citation information only, material with
            unknown rights status, and restricted material. We do not
            re-host copyrighted books, documents, photographs or recordings
            without permission — where permission has not been obtained,
            you will find a citation and, where legally appropriate, a link
            to the original source rather than the file itself.
          </p>
        </Section>

        <Section title="Cultural sensitivity">
          <p>
            Some material — particularly oral history — may touch on
            matters that are sensitive to individuals, families, or
            traditional institutions. Such material is not published
            automatically; it is reviewed for consent, sensitivity, and
            publication permission first, and can be restricted in part or
            in full at the request of those it concerns.
          </p>
        </Section>

        <Section title="Correction policy">
          <p>
            If you find an error, have an additional source, have a
            copyright concern, can help identify someone in a photograph,
            or have context to add, you can submit it through the{" "}
            <a href="/submit" className="font-medium text-accent underline underline-offset-2">
              submission form
            </a>
            . Corrections are reviewed before any published record is
            changed — submitting a correction does not itself alter the
            site.
          </p>
        </Section>

        <Section title="What this site does not do">
          <p>
            This prototype does not process donations, payments, or
            investments, and does not currently operate any fundraising
            function. It does not represent itself as an official
            historical authority on Issele-Uku.
          </p>
        </Section>
      </div>
    </Container>
  );
}
