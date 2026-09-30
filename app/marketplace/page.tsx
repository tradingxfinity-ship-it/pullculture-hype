import type { Metadata } from "next";
import PageHeader from "@/components/ui/PageHeader";
import MarketBrowser from "@/components/sections/market/MarketBrowser";
import { LiveDot } from "@/components/ui/Tag";

export const metadata: Metadata = { title: "Marketplace" };

export default function MarketplacePage() {
  return (
    <>
      <PageHeader
        eyebrow="Marketplace"
        title={["Market", <span key="p" className="text-fg-dim">place.</span>]}
        intro="Flip your extras into the graded cards you’ve been chasing. Trade pulls from your inventory, bid on auctions, or buy outright."
        meta={
          <span className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.12em] text-fg-muted">
            <LiveDot /> Live auctions ending daily
          </span>
        }
      />
      <MarketBrowser />
    </>
  );
}
