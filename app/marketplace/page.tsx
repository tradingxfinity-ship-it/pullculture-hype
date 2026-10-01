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
          <ul className="flex w-full items-end justify-between lg:pb-1" aria-label="Categories">
            {categories.map((c) => {
              const I = sportIcon[c.slug];
              return (
                <li key={c.slug} title={c.label}>
                  <I
                    aria-hidden
                    strokeWidth={1}
                    className="h-[clamp(40px,5.4vw,92px)] w-auto text-fg-2 transition-[color,transform,filter] duration-slow ease-out hover:-translate-y-2 hover:rotate-[-10deg] hover:text-accent hover:[filter:drop-shadow(0_0_24px_rgba(117,251,181,0.45))]"
                  />
                  <span className="sr-only">{c.label}</span>
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
