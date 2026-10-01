import type { Metadata } from "next";
import PageHeader from "@/components/ui/PageHeader";
import MarketBrowser from "@/components/sections/market/MarketBrowser";
import { sportIcon } from "@/components/ui/SportIcons";
import { categories } from "@/lib/data";

export const metadata: Metadata = { title: "Marketplace" };

export default function MarketplacePage() {
  return (
    <>
      <PageHeader
        compact
        eyebrow="Marketplace"
        title={[
          <>
            Market<span className="text-fg-dim">place.</span>
          </>,
        ]}
        meta={
          <ul className="flex gap-2 md:gap-2.5 lg:justify-end" aria-label="Categories">
            {categories.map((c) => {
              const I = sportIcon[c.slug];
              return (
                <li key={c.slug}>
                  <span
                    title={c.label}
                    className="group grid h-12 w-12 place-items-center rounded-md border border-line-strong bg-white/[0.03] text-fg-muted transition-all duration-base ease-out hover:-translate-y-1 hover:border-accent hover:bg-accent/10 hover:text-accent md:h-14 md:w-14"
                  >
                    <I aria-hidden className="h-6 w-6 transition-transform duration-slow ease-out group-hover:rotate-[-12deg] group-hover:scale-110 md:h-7 md:w-7" />
                    <span className="sr-only">{c.label}</span>
                  </span>
                </li>
              );
            })}
          </ul>
        }
      />
      <MarketBrowser />
    </>
  );
}
