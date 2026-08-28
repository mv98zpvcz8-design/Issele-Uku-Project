import type { ReactNode } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { StatusBanner } from "@/components/layout/StatusBanner";

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <StatusBanner />
      <Header />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <Footer />
    </>
  );
}
