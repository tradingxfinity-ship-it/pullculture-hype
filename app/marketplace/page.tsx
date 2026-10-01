import type { Metadata } from "next";
import PageHeader from "@/components/ui/PageHeader";
import MarketBrowser from "@/components/sections/market/MarketBrowser";
import CategoryIcons from "@/components/sections/market/CategoryIcons";

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
        meta={<CategoryIcons />}
      />
      <MarketBrowser />
    </>
  );
}
