import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import PackCard from "@/components/cards/PackCard";
import Reveal from "@/components/ui/Reveal";
import Tabs from "@/components/ui/Tabs";
import LoopingSportIcon from "@/components/ui/LoopingSportIcon";
import { categories, getPack, packs, packsIn, tierPrice, trendingPacks, usd, type Category } from "@/lib/data";

const tabs = [
  { label: "All Packs", href: "/pack", count: packs.length },
  ...categories.map((c) => ({ label: c.label, href: `/pack/${c.slug}`, count: packsIn(c.slug).length })),
];

// Tier price chips, coloured like the packs themselves.
const tierBox = {
  Silver: "bg-gradient-to-br from-[#f2f4f6] to-[#aeb4bc] text-black",
  Gold: "bg-gradient-to-br from-[#f7df8f] to-[#c7972b] text-black",
  Platinum: "bg-gradient-to-br from-[#3a3e45] to-[#0d0e10] text-white ring-1 ring-inset ring-white/15",
} as const;

// Shared by /pack and /pack/[category]. Same order as before: category
// tabs, Trending Packs, then one block per category.
export default function PacksView({ active }: { active?: Category }) {
  const shown = active ? categories.filter((c) => c.slug === active) : categories;
  const activeCat = categories.find((c) => c.slug === active);
  const trending = trendingPacks.map(getPack).filter(Boolean) as NonNullable<ReturnType<typeof getPack>>[];

  return (
    <>
      <header className="relative overflow-hidden border-b border-line">
        <div className="glow absolute -right-20 -top-40 h-[360px] w-[620px]" aria-hidden />
        {/* Pack trio rising out of the tab bar — bottom half clipped by the header edge */}
        <div className="pointer-events-none absolute bottom-0 right-[var(--gutter)] hidden w-[min(34vw,500px)] translate-y-[52%] md:block" aria-hidden>
          <div className="glow absolute inset-[10%]" />
          {active && (
            // Category icon behind the packs, faded out toward them, replaying its signature move
            <div className="absolute left-1/2 top-[-40%] w-[50%] -translate-x-1/2 opacity-25 [mask-image:linear-gradient(to_bottom,#000_35%,transparent_90%)]">
              <LoopingSportIcon slug={active} className="ico-slow h-auto w-full text-fg" />
            </div>
          )}
          <Image src="/assets/cards/tier-packs.webp" alt="" width={1495} height={912} priority sizes="34vw" className="relative h-auto w-full drop-shadow-[0_-10px_40px_rgba(0,0,0,0.6)]" />
        </div>
        <div className="frame relative z-10 pb-8 pt-8 md:pb-10 md:pt-10">
          <Reveal className="is-in">
            <div className="mb-4 flex items-center gap-3">
              <span className="h-px w-8 bg-accent/60" aria-hidden />
              <span className="eyebrow text-accent">{active ? "Category" : "The Pack Room"}</span>
            </div>
            <h1 className="text-[clamp(2.25rem,5.2vw,5rem)] font-bold leading-[0.95] tracking-[-0.05em] text-fg sm:whitespace-nowrap">
              {active ? (
                <>
                  {activeCat!.label} <span className="text-fg-dim">Packs</span>
                </>
              ) : (
                <>
                  Pick a pack. Rip it <em className="font-serif font-normal italic tracking-[-0.02em] text-accent">open.</em>
                </>
              )}
            </h1>

            <div className="mt-6 md:mt-8">
              <ul className="flex gap-2 sm:gap-3">
                {(["Silver", "Gold", "Platinum"] as const).map((t) => (
                  <li key={t} className={`flex-1 rounded-md px-4 py-3 sm:min-w-[132px] sm:flex-none sm:px-5 ${tierBox[t]}`}>
                    <p className="font-mono text-[10px] uppercase tracking-[0.14em] opacity-70">{t}</p>
                    <p className="mt-0.5 font-mono text-xl font-semibold tabular-nums sm:text-2xl">{usd(tierPrice[t])}</p>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </header>

      <div className="sticky top-[var(--topbar-h)] z-20 border-b border-line bg-black/80 backdrop-blur-xl">
        <div className="frame">
          <Tabs items={tabs} active={active ? `/pack/${active}` : "/pack"} className="[&_ul]:border-b-0" />
        </div>
      </div>

      {!active && (
        <section className="frame pb-20 pt-8 md:pb-28 md:pt-10">
          <div className="mb-5 flex items-center gap-4 md:mb-6">
            <h2 className="text-xl font-bold tracking-[-0.03em] text-fg md:text-2xl">Trending Packs</h2>
            <span className="h-px flex-1 bg-line" aria-hidden />
            <span className="eyebrow hidden md:block">Most ripped · Last 24h</span>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:gap-x-6 lg:grid-cols-4">
            {trending.map((p, i) => (
              <Reveal key={p.name} delay={i * 80}>
                <PackCard pack={p} index={i} />
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {shown.map((c, ci) => {
        const list = packsIn(c.slug);
        return (
          <section key={c.slug} className={`border-t border-line ${ci % 2 ? "bg-ink-1" : "bg-ink-0"}`}>
            <div className="frame grid-12 gap-y-10 py-20 md:py-28">
              <div className="col-span-4 md:col-span-8 lg:col-span-4">
                <Reveal className="lg:sticky lg:top-[calc(var(--topbar-h)+96px)]">
                  <p className="font-mono text-[11px] tracking-[0.12em] text-accent">
                    {String(categories.indexOf(c) + 1).padStart(2, "0")} / {String(categories.length).padStart(2, "0")}
                  </p>
                  <h2 className="mt-4 text-[clamp(2.5rem,4.6vw,4.75rem)] font-bold leading-[0.9] tracking-[-0.045em]">
                    {c.label}
                    <span className="block text-fg-dim">Packs</span>
                  </h2>
                  <p className="mt-6 max-w-xs text-[15px] leading-relaxed text-fg-muted">{c.blurb}</p>
                  {!active && (
                    <Link href={`/pack/${c.slug}`} className="group mt-8 inline-flex items-center gap-2 text-sm font-medium text-fg">
                      <span className="link-u">View {c.label}</span>
                      <ArrowUpRight className="arrow-nudge h-4 w-4 text-accent" />
                    </Link>
                  )}
                </Reveal>
              </div>
              <div className="col-span-4 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 md:col-span-8 lg:col-span-8 xl:grid-cols-3">
                {list.map((p, i) => (
                  <Reveal key={p.name} delay={i * 90} className={i === 0 ? "sm:col-span-2 xl:col-span-1" : ""}>
                    <PackCard pack={p} index={i} />
                  </Reveal>
                ))}
              </div>
            </div>
          </section>
        );
      })}

      {active && (
        <section className="frame border-t border-line py-16">
          <p className="eyebrow mb-6">Other categories</p>
          <div className="flex flex-wrap gap-x-10 gap-y-4">
            {categories
              .filter((c) => c.slug !== active)
              .map((c) => (
                <Link key={c.slug} href={`/pack/${c.slug}`} className="group flex items-center gap-3 text-3xl font-bold tracking-[-0.04em] text-fg-dim transition-colors hover:text-fg md:text-5xl">
                  {c.label}
                  <ArrowUpRight className="arrow-nudge h-6 w-6 text-accent opacity-0 transition-opacity group-hover:opacity-100" />
                </Link>
              ))}
          </div>
        </section>
      )}
    </>
  );
}
