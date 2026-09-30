import type { Metadata } from "next";
import Image from "next/image";
import { Eye, MoreHorizontal } from "lucide-react";
import CardViewer from "@/components/sections/market/CardViewer";
import Comps from "@/components/sections/market/Comps";
import ListingCard from "@/components/cards/ListingCard";
import Button from "@/components/ui/Button";
import Countdown from "@/components/ui/Countdown";
import Reveal from "@/components/ui/Reveal";
import SectionHeader from "@/components/ui/SectionHeader";
import { LiveDot } from "@/components/ui/Tag";
import { cardDetail as c, listings, usd } from "@/lib/data";

export const metadata: Metadata = { title: `${c.player} ${c.number}` };

// The previous site rendered this LeBron lot for every listing URL; kept as-is.
export default function ListingPage() {
  return (
    <>
      <section className="frame grid-12 gap-y-12 py-10 md:py-16">
        <div className="col-span-4 md:col-span-8 lg:col-span-6">
          <div className="lg:sticky lg:top-[calc(var(--topbar-h)+24px)]">
            <CardViewer src={c.image} alt={`${c.player} ${c.title} ${c.subtitle}`} />
          </div>
        </div>

        <div className="col-span-4 md:col-span-8 lg:col-span-6 lg:pl-8">
          <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.12em] text-fg-dim">
            <span className="flex items-center gap-2">
              <LiveDot /> Live auction
            </span>
            <span className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <Eye className="h-3.5 w-3.5" /> {c.watchers}
              </span>
              <button type="button" aria-label="More actions" className="text-fg-muted hover:text-fg">
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </span>
          </div>

          <h1 className="mt-6 text-display-md font-bold">
            {c.player} <span className="text-accent">{c.number}</span>
          </h1>
          <p className="mt-4 text-xl font-medium tracking-[-0.02em] text-fg-2 md:text-2xl">
            {c.title}
            <br />
            {c.subtitle}
          </p>
          <p className="mt-3 font-mono text-lg text-accent">{c.grade}</p>

          <div className="mt-8 flex items-center gap-3 border-y border-line py-4">
            <Image src="/assets/users/user-01.webp" alt="" width={32} height={32} className="h-8 w-8 rounded-full object-cover" />
            <span className="eyebrow">Card owner</span>
            <span className="text-sm font-medium text-accent">{c.owner}</span>
          </div>

          {/* Auction */}
          <div className="mt-8 rounded-lg border border-line bg-ink-2 p-5 md:p-7">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <p className="eyebrow">Current bid</p>
                <p className="mt-2 font-mono text-4xl tabular-nums text-fg md:text-5xl">{usd(c.auction.price)}</p>
                <p className="mt-2 text-sm text-fg-muted">
                  {c.auction.bids} Bids · {c.auction.ends}
                </p>
              </div>
              <Countdown seconds={4 * 86400 + 7 * 3600 + 21 * 60 + 44} />
            </div>
            <Button size="lg" full arrow magnetic className="mt-7">
              Bid Now
            </Button>
          </div>

          {/* Card information */}
          <h2 className="eyebrow mb-4 mt-12">Card information</h2>
          <dl className="grid grid-cols-2 border-l border-t border-line sm:grid-cols-3">
            {c.info.map(([k, v]) => (
              <div key={k} className="border-b border-r border-line p-4 transition-colors hover:bg-white/[0.02]">
                <dt className="font-mono text-[10px] uppercase tracking-[0.12em] text-fg-dim">{k}</dt>
                <dd className="mt-1.5 text-[15px] font-medium text-fg">{v}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-14">
            <Comps />
          </div>
        </div>
      </section>

      <section className="border-t border-line bg-ink-1 py-section">
        <div className="frame">
          <SectionHeader index="→" label="Keep browsing" title={["Similar", "Auctions"]} action={{ href: "/marketplace", label: "See all" }} className="mb-14" />
          <div className="grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-4 md:gap-x-6">
            {listings.slice(0, 4).map((l, i) => (
              <Reveal key={l.id} delay={i * 70}>
                <ListingCard item={l} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
