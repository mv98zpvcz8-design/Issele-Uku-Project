import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/ui/PagePlaceholder";

export const metadata: Metadata = { title: "Timeline" };

export default function TimelinePage() {
  return (
    <PagePlaceholder
      eyebrow="Timeline"
      title="An interactive historical timeline"
      description="A mobile-friendly timeline supporting uncertain dates and date ranges, filterable by period and topic, linking through to archive records, people and places. Built in Phase 5 once historical events are in the database."
    />
  );
}
