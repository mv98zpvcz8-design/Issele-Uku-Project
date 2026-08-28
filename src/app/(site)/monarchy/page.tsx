import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/ui/PagePlaceholder";

export const metadata: Metadata = { title: "Monarchy" };

export default function MonarchyPage() {
  return (
    <PagePlaceholder
      eyebrow="Monarchy"
      title="The traditional institution"
      description="An overview of the traditional institution and a list of Obis, each with reign dates, historical notes, available sources and related events — published only as sources are confirmed."
    />
  );
}
