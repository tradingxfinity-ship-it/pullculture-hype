import type { Metadata } from "next";
import { Mail } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import Reveal from "@/components/ui/Reveal";
import SubmitForm from "@/components/sections/submit/SubmitForm";

export const metadata: Metadata = { title: "Submit Cards" };

const steps = [
  { title: "Tell us about your cards", body: "Add each card with photos and an estimated value." },
  { title: "We review your submission", body: "Our team checks the details and follows up by email." },
  { title: "Ship to the vault", body: "Send your cards to our U.S.-based fulfillment center, sleeved and protected." },
];

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

      <section className="frame grid-12 gap-y-12 py-12 md:py-16">
        <aside className="col-span-4 md:col-span-8 lg:col-span-4">
          <Reveal className="lg:sticky lg:top-[calc(var(--topbar-h)+32px)]">
            <p className="eyebrow mb-6 text-accent">How it works</p>
            <ol className="space-y-6 border-l border-line pl-6">
              {steps.map((s, i) => (
                <li key={s.title} className="relative">
                  <span className="absolute -left-[31px] top-0.5 grid h-[13px] w-[13px] place-items-center rounded-full border border-accent bg-ink-0">
                    <span className="h-[5px] w-[5px] rounded-full bg-accent" />
                  </span>
                  <p className="font-mono text-[11px] text-fg-dim">0{i + 1}</p>
                  <h3 className="mt-1 text-lg font-semibold tracking-[-0.02em]">{s.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-fg-muted">{s.body}</p>
                </li>
              ))}
            </ol>
            <a
              href="mailto:support@hyp3.gg"
              className="group mt-10 flex items-center gap-3 rounded-md border border-line p-4 text-sm text-fg-muted transition-colors hover:border-accent"
            >
              <Mail className="h-4 w-4 text-accent" />
              <span>
                Questions? <span className="link-u text-fg">support@hyp3.gg</span>
              </span>
            </a>
          </Reveal>
        </aside>

        <div className="col-span-4 md:col-span-8 lg:col-span-8">
          <SubmitForm />
        </div>
      </section>
    </>
  );
}
