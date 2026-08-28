import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/ui/PagePlaceholder";

export const metadata: Metadata = { title: "Places" };

export default function PlacesPage() {
  return (
    <PagePlaceholder
      eyebrow="People & Places"
      title="Places"
      description="Quarters, historical locations, the palace, markets, churches, schools and culturally significant sites in and around Issele-Uku."
    />
  );
}
