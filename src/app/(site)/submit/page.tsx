import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/ui/PagePlaceholder";

export const metadata: Metadata = { title: "Submit" };

export default function SubmitPage() {
  return (
    <PagePlaceholder
      eyebrow="Submit"
      title="Offer a correction or contribute material"
      description="Soon you'll be able to submit factual corrections, additional sources, copyright concerns, help identifying people in photographs, photographs, documents or oral history for review. Nothing submitted is published automatically — everything goes through review first."
    />
  );
}
