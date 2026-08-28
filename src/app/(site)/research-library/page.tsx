import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/ui/PagePlaceholder";

export const metadata: Metadata = { title: "Research Library" };

export default function ResearchLibraryPage() {
  return (
    <PagePlaceholder
      eyebrow="Research Library"
      title="Bibliographic records"
      description="Books, journal articles, theses, archival collections, official documents, newspaper material, websites and research projects relevant to Issele-Uku — each marked clearly as full text available, external access available, metadata only, or access restricted."
    />
  );
}
