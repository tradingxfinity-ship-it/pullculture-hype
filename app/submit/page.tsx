import type { Metadata } from "next";
import SubmitFlow from "@/components/submit/SubmitFlow";

export const metadata: Metadata = { title: "Submit Cards" };

// Same flow as the Submit Cards popup, as a standalone page for direct links.
export default function SubmitPage() {
  return (
    <section className="frame flex justify-center py-12 md:py-16">
      <div className="w-full max-w-[780px]">
        <SubmitFlow embedded />
      </div>
    </section>
  );
}
