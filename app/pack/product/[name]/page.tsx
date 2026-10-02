import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, RefreshCcw, ShieldCheck, Truck } from "lucide-react";
import BuyPanel from "@/components/sections/packs/BuyPanel";
import PullTiers from "@/components/sections/packs/PullTiers";
import HitList from "@/components/sections/packs/HitList";
import FavoriteButton from "@/components/account/FavoriteButton";
import SectionHeader from "@/components/ui/SectionHeader";
import Reveal from "@/components/ui/Reveal";
import SplitHeading from "@/components/ui/SplitHeading";
import Tag from "@/components/ui/Tag";
import PackCard from "@/components/cards/PackCard";
import { getPack, packDescription, packs, packsIn, pullTiers, usd } from "@/lib/data";

export function generateStaticParams() {
  return packs.map((p) => ({ name: p.name }));
}

const resolve = async (params: Promise<{ name: string }>) => getPack(decodeURIComponent((await params).name));

export async function generateMetadata({ params }: { params: Promise<{ name: string }> }): Promise<Metadata> {
  const p = await resolve(params);
  return { title: p?.name ?? "Pack" };
}

export default async function ProductPage({ params }: { params: Promise<{ name: string }> }) {
  const pack = await resolve(params);
  if (!pack) notFound();
  const siblings = packsIn(pack.category).filter((p) => p.name !== pack.name);
  // "Football Gold Pack" → "Football" / "Gold Pack"
  const words = pack.name.split(" ");
  const title = words.slice(0, -2).join(" ");
  const rest = words.slice(-2);

  return (
    <>
      <section className="relative overflow-hidden border-b border-line">
        <div className="glow absolute left-[10%] top-[10%] h-[70%] w-[50%]" aria-hidden />
        <div className="frame relative grid-12 gap-y-12 py-10 md:py-16">
          <div className="col-span-4 md:col-span-8 lg:col-span-12">
            <Link href={`/pack/${pack.category}`} className="group inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.12em] text-fg-muted hover:text-fg">
              <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-base group-hover:-translate-x-1" /> {pack.categoryLabel} packs
            </Link>
          </div>

          {/* Stage */}
          <Reveal className="col-span-4 md:col-span-8 lg:col-span-7">
            <div className="media ticks relative aspect-square overflow-hidden rounded-lg border border-line">
              <Image src={pack.image} alt={pack.name} fill priority sizes="(min-width:1024px) 55vw, 95vw" className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" aria-hidden />
              <div className="absolute inset-x-5 bottom-5 flex items-end justify-between font-mono text-[11px] uppercase tracking-[0.12em] text-fg/80">
                <span>HYP3 · {pack.tier} Series</span>
                <span>{pack.categoryLabel}</span>
              </div>
            </div>
          </Reveal>

          {/* Details */}
          <div className="col-span-4 flex flex-col md:col-span-8 lg:col-span-5 lg:pl-6">
            <Reveal className="is-in">
              <div className="flex flex-wrap items-center gap-2">
                <Tag tone={pack.tier.toLowerCase() as "silver" | "gold" | "platinum"}>{pack.tier}</Tag>
                <Tag>{pack.categoryLabel}</Tag>
                <Tag tone="accent">Provably fair</Tag>
                <FavoriteButton kind="packs" id={pack.name} label={pack.name} variant="icon" className="ml-auto" />
              </div>
              <SplitHeading as="h1" lines={[title, <span key="r" className="text-fg-dim">{rest.join(" ")}</span>]} className="mt-6 text-display-md font-bold" />
              <p className="mt-6 font-mono text-4xl tabular-nums text-accent">{usd(pack.price, true)}</p>
              <p className="mt-6 max-w-md text-[15px] leading-relaxed text-fg-muted">{packDescription(pack)}</p>

              <dl className="mt-8 grid grid-cols-3 border-y border-line">
                {pullTiers.map((t, i) => (
                  <div key={t.name} className={`py-4 ${i ? "border-l border-line pl-4" : ""}`}>
                    <dt className="eyebrow !text-[10px]">{t.name}</dt>
                    <dd className={`mt-1 font-mono text-lg ${i === 0 ? "text-accent" : "text-fg"}`}>{t.odds}</dd>
                  </div>
                ))}
              </dl>

              <div className="mt-8">
                <BuyPanel name={pack.name} slug={pack.slug} price={pack.price} />
              </div>

              <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-fg-muted">
                {[
                  [ShieldCheck, "Provably fair odds"],
                  [RefreshCcw, "Instant buyback"],
                  [Truck, "Ships U.S. & Canada"],
                ].map(([I, t]) => {
                  const Ico = I as typeof ShieldCheck;
                  return (
                    <li key={t as string} className="flex items-center gap-2">
                      <Ico className="h-4 w-4 text-accent" strokeWidth={1.5} /> {t as string}
                    </li>
                  );
                })}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="bg-ink-1 pt-section">
        <div className="frame">
          <SectionHeader
            index="→"
            label="Hit list"
            title={["Available", <>Pulls<span className="text-accent">.</span></>]}
            aside={<HitList packName={pack.name} />}
            className="mb-12 md:mb-16"
          />
          <PullTiers />
        </div>
      </section>

      {siblings.length > 0 && (
        <section className="frame border-t border-line py-section">
          <Reveal className="mb-12 flex items-end justify-between">
            <h2 className="text-display-sm font-bold">
              More <span className="text-fg-dim">{pack.categoryLabel}</span>
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2">
            {siblings.map((p, i) => (
              <Reveal key={p.name} delay={i * 80}>
                <PackCard pack={p} index={i} size="lg" />
              </Reveal>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
