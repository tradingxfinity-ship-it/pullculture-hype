import type { Metadata } from "next";
import PageHeader from "@/components/ui/PageHeader";
import SubmitForm from "@/components/sections/submit/SubmitForm";

export const metadata: Metadata = { title: "Submit Cards" };

export default function SubmitPage() {
  return (
    <>
      <PageHeader
        compact
        eyebrow="Submit Cards"
        title={[
          <>
            Submit your <em className="font-serif font-normal italic tracking-[-0.02em] text-accent">cards.</em>
          </>,
        ]}
      />
      <section className="frame py-12 md:py-16">
        <SubmitForm />
      </section>
    </>
  );
}
