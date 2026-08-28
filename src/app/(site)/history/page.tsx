import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/ui/PagePlaceholder";

export const metadata: Metadata = { title: "History" };

export default function HistoryPage() {
  return (
    <PagePlaceholder
      eyebrow="History"
      title="Periods, events and developments"
      description="Chronological periods, historical events, migrations, political developments and external relations — each presented with its supporting evidence and, where accounts differ, more than one interpretation."
    />
  );
}
