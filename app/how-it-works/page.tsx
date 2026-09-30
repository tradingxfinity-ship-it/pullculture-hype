import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Faq from "@/components/sections/Faq";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import Reveal from "@/components/ui/Reveal";
import SectionHeader from "@/components/ui/SectionHeader";
import SplitHeading from "@/components/ui/SplitHeading";
import { steps } from "@/lib/data";

export const metadata: Metadata = { title: "How It Works" };

export default function HowItWorksPage() {
  return (
    <>
      {/* What is HYP3 */}
      <section className="relative overflow-hidden border-b border-line">
        <div className="grid-bg absolute inset-0 opacity-50" aria-hidden />
        <div className="glow absolute -right-40 top-10 h-[560px] w-[760px]" aria-hidden />
        <div className="frame relative py-16 md:py-24">
          <Reveal>
            <div className="mb-8 flex items-center gap-3">
              <span className="h-px w-8 bg-accent/60" />
              <span className="eyebrow text-accent">How It Works</span>
            </div>
            <h1 className="text-display-lg font-bold">
              <span className="line-mask">
                <span>What is</span>
              </span>
              <span className="line-mask">
                <span style={{ "--line-delay": "100ms" } as React.CSSProperties} className="!flex items-end gap-[0.08em]">
                  <Image src="/assets/logo/hyp3.svg" alt="HYP3" width={3000} height={819} priority className="h-[0.78em] w-auto" />
                  <span className="text-accent">?</span>
                </span>
              </span>
            </h1>
          </Reveal>

          <div className="grid-12 mt-16 gap-y-8 md:mt-24">
            <Reveal className="col-span-4 md:col-span-8 lg:col-span-7">
              <p className="text-2xl font-medium leading-[1.3] tracking-[-0.02em] text-fg md:text-[2rem]">
                HYP3 transforms the way you collect! Experience the rush of opening packs filled with rare sports and trading cards — from Pokémon
                to NFL, NBA, and more.
              </p>
            </Reveal>
            <Reveal delay={120} className="col-span-4 space-y-5 text-[15px] leading-relaxed text-fg-muted md:col-span-8 lg:col-span-4 lg:col-start-9">
              <p>
                At HYP3, we’re serious about cutting the clutter. No bulk. No filler. Trade your unwanted pulls in our Marketplace for the cards
                you actually want — or sell them back instantly for cash and keep ripping.
              </p>
              <p>
                Our provably fair drops, clear odds, and available hit tracker put you fully in control. No bulk, no guessing... Just pure HYP3
                chase energy and real rewards. When you hit something big, we ship it straight to you.
              </p>
              <p>
                Got cards you’d rather pass on? Trade them back for instant cash and keep the excitement going with more openings. Every rip
                brings you closer to your dream lineup.
              </p>
              <p className="text-fg-2">
                Backed by a team of lifelong collectors and industry pros, HYP3 is built to deliver transparency, excitement, and the next
                evolution of the collectible experience.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* How does HYP3 work */}
      <section className="bg-ink-1 py-section">
        <div className="frame">
          <SectionHeader
            index="01"
            label="The Process"
            title={["How does", <>HYP3 work<span className="text-accent">?</span></>]}
            aside="HYP3 redefines collecting! Explore curated packs from premier TCGs and sports lines like Pokémon, NFL, NBA, and more. Each pack offers real value: cash out your hits for cash, sell them on our marketplace or redeem them for shipment directly to your doorstep."
            className="mb-16 md:mb-24"
          />
          <ol className="grid grid-cols-1 border-t border-line sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <Reveal
                as="li"
                key={s.title}
                delay={i * 100}
                className="group relative border-b border-line py-10 sm:px-6 sm:[&:nth-child(even)]:border-l lg:border-b-0 lg:[&:not(:first-child)]:border-l lg:first:pl-0"
              >
                <div className="flex items-start justify-between">
                  <span className="text-[5rem] font-bold leading-none tracking-[-0.06em] text-fg-dim/40 transition-colors duration-base group-hover:text-accent md:text-[6rem]">
                    0{i + 1}
                  </span>
                  <Icon name={s.icon} className="h-6 w-6 text-accent" />
                </div>
                <h3 className="mt-10 text-2xl font-bold uppercase tracking-[-0.03em]">{s.title}</h3>
                <p className="mt-3 max-w-xs text-[15px] leading-relaxed text-fg-muted">{s.body}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Get the cards you want */}
      <section className="relative overflow-hidden py-section">
        <div className="frame grid-12 items-center gap-y-12">
          <Reveal className="col-span-4 md:col-span-8 lg:col-span-6">
            <p className="eyebrow mb-6 text-accent">02 — The Marketplace</p>
            <SplitHeading lines={["Get the cards", <>you <em key="e" className="font-serif font-normal italic tracking-[-0.02em] text-accent">want.</em></>]} className="text-display-md font-bold" />
            <div className="mt-8 max-w-lg space-y-5 text-[15px] leading-relaxed text-fg-muted">
              <p>
                HYP3 makes collecting clean and exciting — no piles of commons, no wasted packs. Don’t love your pulls? Sell them back instantly
                for cash and keep ripping for the ones you want.
              </p>
              <p>Our Marketplace lets you flip your extras into the graded cards you’ve been chasing.</p>
              <p className="text-xl font-semibold tracking-[-0.02em] text-fg">Real hits. Real value.</p>
            </div>
            <div className="mt-10 flex flex-wrap gap-3">
              <Button href="/marketplace" size="lg" arrow magnetic>
                Explore Marketplace
              </Button>
              <Button href="/pack" variant="secondary" size="lg">
                Rip A Pack
              </Button>
            </div>
          </Reveal>
          <Reveal delay={150} className="col-span-4 md:col-span-8 lg:col-span-5 lg:col-start-8">
            <div className="ticks relative aspect-[4/5] rounded-lg border border-line bg-[radial-gradient(ellipse_at_50%_40%,#171717_0%,#050505_70%)]">
              <div className="glow absolute inset-[15%]" aria-hidden />
              <Image src="/assets/cards/Pack-02.webp" alt="" width={147} height={250} className="absolute left-[14%] top-[16%] w-[38%] -rotate-[8deg] opacity-80 drop-shadow-[0_30px_40px_rgba(0,0,0,0.8)]" />
              <Image src="/assets/cards/Pack-03.webp" alt="" width={267} height={449} className="absolute right-[12%] top-[12%] w-[46%] rotate-[5deg] drop-shadow-[0_30px_40px_rgba(0,0,0,0.9)]" />
              <p className="absolute inset-x-5 bottom-5 flex justify-between font-mono text-[11px] uppercase tracking-[0.12em] text-fg-dim">
                <span>Trade in</span>
                <span className="text-accent">→ Trade up</span>
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Shipping */}
      <section className="border-y border-line bg-ink-2 py-section">
        <div className="frame grid-12 gap-y-12">
          <Reveal className="col-span-4 md:col-span-8 lg:col-span-5">
            <p className="eyebrow mb-6 text-accent">03 — Fulfillment</p>
            <h2 className="text-display-md font-bold">Shipping</h2>
            <dl className="mt-10 grid grid-cols-3 border-t border-line">
              {[
                ["Ships in", "2–4 wks"],
                ["Regions", "US · CA"],
                ["Packed", "Sleeved"],
              ].map(([k, v], i) => (
                <div key={k} className={`pt-5 ${i ? "border-l border-line pl-4" : ""}`}>
                  <dt className="eyebrow !text-[10px]">{k}</dt>
                  <dd className="mt-1 font-mono text-lg text-fg">{v}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
          <Reveal delay={120} className="col-span-4 space-y-5 text-[15px] leading-relaxed text-fg-muted md:col-span-8 lg:col-span-6 lg:col-start-7">
            <p className="text-lg text-fg-2">
              All orders are processed and shipped from our U.S.-based fulfillment center, where we also maintain an immense inventory of raw and
              graded trading cards and sports card.
            </p>
            <p>
              Shipping typically takes 2–4 weeks from withdrawal, and we’re continuously optimizing our logistics to deliver faster and more
              efficiently.
            </p>
            <p>
              Each order is handled with industry-leading care — every card is sleeved and packed securely in a bubble mailer. With hundreds of
              thousands of cards shipped to collectors worldwide, ensuring safe and timely delivery remains our top priority.
            </p>
            <p className="text-fg">We currently ship to the U.S. and Canada.</p>
            <Link href="/shipping" className="group inline-flex items-center gap-2 pt-2 text-sm font-medium text-fg">
              <span className="link-u">Full shipping policy</span>
              <ArrowUpRight className="arrow-nudge h-4 w-4 text-accent" />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24 py-section">
        <div className="frame grid-12 gap-y-12">
          <div className="col-span-4 md:col-span-8 lg:col-span-4">
            <Reveal className="lg:sticky lg:top-[calc(var(--topbar-h)+40px)]">
              <p className="eyebrow mb-6 text-accent">04 — Questions</p>
              <h2 className="text-display-lg font-bold">FAQ</h2>
              <p className="mt-6 max-w-xs text-[15px] leading-relaxed text-fg-muted">Still stuck? Reach the team at support@hyp3.gg.</p>
            </Reveal>
          </div>
          <div className="col-span-4 md:col-span-8 lg:col-span-8">
            <Faq />
          </div>
        </div>
      </section>
    </>
  );
}
