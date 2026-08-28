import type { Metadata } from "next";
import Link from "next/link";
import { PagePlaceholder } from "@/components/ui/PagePlaceholder";

export const metadata: Metadata = { title: "People & Places" };

export default function PeoplePage() {
  return (
    <PagePlaceholder
      eyebrow="People & Places"
      title="People & Places"
      description="Traditional leaders, historical figures, artists, academics and notable residents; and quarters, markets, the palace, schools, churches and other significant sites. Personal information about living private individuals is not published without appropriate care."
    >
      <p className="mt-6 text-sm text-ink-soft">
        Looking for quarters, markets and landmarks? Visit{" "}
        <Link href="/places" className="font-medium text-accent underline underline-offset-2">
          Places
        </Link>
        .
      </p>
    </PagePlaceholder>
  );
}
