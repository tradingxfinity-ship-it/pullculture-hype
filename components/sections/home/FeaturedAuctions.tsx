import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import ListingCard from "@/components/cards/ListingCard";
import SectionHeader from "@/components/ui/SectionHeader";
import Countdown from "@/components/ui/Countdown";
import Reveal from "@/components/ui/Reveal";
import Tag, { LiveDot } from "@/components/ui/Tag";
import { featuredListing as f, listings, usd } from "@/lib/data";

// One dominant lot (≈60%) with four supporting lots beside it.
export default function FeaturedAuctions() {
  const side = listings.filter((l) => l.type === "auction").slice(0, 4);

  return (
    <section className="relative bg-ink-1 py-section">
      <div className="frame">
        <SectionHeader
          index="03"
          label="Marketplace"
          title={[
            "Featured",
            <>
              Auctions<span className="text-accent">.</span>
            </>,
          ]}
          aside="Graded slabs from the vault and the community. Trade in your pulls or bid outright."
          action={{ href: "/marketplace", label: "See all auctions" }}
          className="mb-14 md:mb-20"
        />

        <div className="grid-12 gap-y-12">
          {/* Lead lot */}
          <Reveal className="col-span-4 md:col-span-8 lg:col-span-7">
            <Link href={f.href} className="group block">
              <div className="media relative aspect-[4/3.4] rounded-lg border border-line bg-[radial-gradient(ellipse_at_50%_40%,#1a1a1a_0%,#070707_70%)] sm:aspect-[4/3]">
                <div className="grid-bg absolute inset-0 opacity-50" aria-hidden />
                <div className="glow absolute left-1/2 top-1/2 h-3/4 w-2/3 -translate-x-1/2 -translate-y-1/2" aria-hidden />
                {/* Slab turntable: continuous Y-axis spin, paused on hover */}
                <div className="absolute inset-[9%] flex items-center justify-center [perspective:1400px]">
                  <div className="relative aspect-[267/449] h-full animate-spin-y [transform-style:preserve-3d] group-hover:[animation-play-state:paused]">
                    <div className="absolute inset-0 [backface-visibility:hidden]">
                      <Image
                        src={f.image}
                        alt={`${f.player} ${f.title}`}
                        fill
                        sizes="(min-width:1024px) 30vw, 60vw"
                        className="object-contain drop-shadow-[0_40px_50px_rgba(0,0,0,0.9)]"
                      />
                    </div>
                    {/* Back face shows the front art for now, so the slab reads the same from both sides */}
                    <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)]" aria-hidden>
                      <Image
                        src={f.image}
                        alt=""
                        fill
                        sizes="(min-width:1024px) 30vw, 60vw"
                        className="object-contain drop-shadow-[0_40px_50px_rgba(0,0,0,0.9)]"
                      />
                    </div>
                  </div>
                </div>
                <div className="absolute inset-x-4 top-4 flex items-center justify-between md:inset-x-6 md:top-6">
                  <Tag tone="solid">Lot of the week</Tag>
                  <span className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.12em] text-fg-muted">
                    <LiveDot /> {f.bids} bids
                  </span>
                </div>
                <p
                  aria-hidden
                  className="absolute -bottom-3 right-4 font-mono text-[18vw] font-bold leading-none tracking-[-0.08em] text-white/[0.04] lg:text-[11vw]"
                >
                  {f.number}
                </p>
              </div>
              <div className="mt-6 grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
                <div>
                  <p className="eyebrow mb-2 text-accent">{f.grade}</p>
                  <h3 className="text-3xl font-bold leading-[1] tracking-[-0.035em] text-fg transition-colors duration-fast group-hover:text-accent md:text-4xl">
                    {f.player} <span className="text-fg-dim">{f.number}</span>
                  </h3>
                  <p className="mt-2 text-fg-muted">{f.title}</p>
                </div>
                <div className="md:text-right">
                  <p className="eyebrow mb-1">Current bid</p>
                  <p className="font-mono text-3xl tabular-nums text-fg">{usd(f.price)}</p>
                </div>
              </div>
              <div className="mt-6 flex flex-wrap items-center justify-between gap-6 border-t border-line pt-6">
                <Countdown seconds={4 * 86400 + 7 * 3600 + 21 * 60 + 44} />
                <span className="inline-flex h-12 items-center gap-2 rounded-sm bg-accent px-6 text-sm font-semibold text-accent-ink transition-shadow duration-base group-hover:shadow-[0_10px_40px_-8px_rgba(117,251,181,0.5)]">
                  Bid Now <ArrowUpRight className="arrow-nudge h-4 w-4" />
                </span>
              </div>
            </Link>
          </Reveal>

          {/* Supporting lots */}
          <div className="col-span-4 grid grid-cols-2 gap-x-4 gap-y-10 md:col-span-8 md:gap-x-6 lg:col-span-5">
            {side.map((l, i) => (
              <Reveal key={l.id} delay={i * 80}>
                <ListingCard item={l} />
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
