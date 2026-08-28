import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/ui/PagePlaceholder";

export const metadata: Metadata = { title: "Archive" };

export default function ArchivePage() {
  return (
    <PagePlaceholder
      eyebrow="Archive"
      title="Search the archive"
      description="Photographs, documents, books, newspaper articles, maps, audio recordings, oral-history interviews, video, letters and more — each with source information, an evidence label and a confidence level. Search and filtering arrive once the archive database is connected (Phase 3)."
    />
  );
}
