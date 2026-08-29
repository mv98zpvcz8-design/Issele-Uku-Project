import type { Metadata } from "next";
import { SubmitForm } from "./SubmitForm";

export const metadata: Metadata = {
  title: "Submit",
  description: "Offer a correction, additional source, or material for the Issele-Uku archive.",
};

export default function SubmitPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <p className="text-sm font-medium uppercase tracking-widest text-accent">Submit</p>
      <h1 className="mt-2 font-display text-3xl font-semibold text-ink">
        Offer a correction or contribute material
      </h1>
      <p className="mt-4 text-ink-soft">
        Submit a factual correction, an additional source, a copyright concern, help identifying
        people in a photograph, or a description of photographs, documents or oral history you&apos;d
        like to offer. Nothing submitted here is published automatically — a member of the project
        team reviews every submission first.
      </p>

      <SubmitForm />
    </div>
  );
}
