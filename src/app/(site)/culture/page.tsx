import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/ui/PagePlaceholder";

export const metadata: Metadata = { title: "Culture" };

export default function CulturePage() {
  return (
    <PagePlaceholder
      eyebrow="Culture"
      title="Living traditions and practice"
      description="Festivals, customs, music, dance, food, clothing (including Akwa Ocha), titles, ceremonies, language and traditional institutions. Categories here are designed to grow — new categories can be added without changing the structure of the site."
    />
  );
}
