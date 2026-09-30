import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import PackCard from "@/components/cards/PackCard";
import PageHeader from "@/components/ui/PageHeader";
import Reveal from "@/components/ui/Reveal";
import Tabs from "@/components/ui/Tabs";
import { categories, getPack, packs, packsIn, tierPrice, trendingPacks, usd, type Category } from "@/lib/data";

const tabs = [
  { label: "All Packs", href: "/pack", count: packs.length },
  ...categories.map((c) => ({ label: c.label, href: `/pack/${c.slug}`, count: packsIn(c.slug).length })),
];

// Shared by /pack and /pack/[category]. Same order as before: category
// tabs, Trending Packs, then one block per category.
export default function PacksView({ active }: { active?: Category }) {
  const shown = active ? categories.filter((c) => c.slug === active) : categories;
  const activeCat = categories.find((c) => c.slug === active);
  const trending = trendingPacks.map(getPack).filter(Boolean) as NonNullable<ReturnType<typeof getPack>>[];

  return (
    <>
      <PageHeader
        eyebrow={active ? "Category" : "The Pack Room"}
        title={active ? [activeCat!.label, <span key="p" className="text-fg-dim">Packs</span>] : ["Pick a pack.", <>Rip it <em key="e" className="font-serif font-normal italic tracking-[-0.02em] text-accent">open.</em></>]}
        intro={active ? activeCat!.blurb : "Three tiers across five categories. Every pack shows its odds up front, and every hit can be sold back instantly or shipped to your door."}
        meta={
          <div className="flex gap-8 font-mono text-sm">
            {(["Silver", "Gold", "Platinum"] as const).map((t) => (
              <div key={t}>
                <p className="eyebrow !text-[10px]">{t}</p>
                <p className="mt-1 text-fg">{usd(tierPrice[t])}</p>
              </div>
            ))}
          </div>
        }
      />

      <div className="sticky top-[var(--topbar-h)] z-20 border-b border-line bg-black/80 backdrop-blur-xl">
        <div className="frame">
          <Tabs items={tabs} active={active ? `/pack/${active}` : "/pack"} className="[&_ul]:border-b-0" />
        </div>
      </div>

      {!active && (
        <section className="frame py-20 md:py-28">
          <Reveal className="mb-10 flex items-end justify-between gap-6 md:mb-14">
            <div>
              <p className="eyebrow mb-4 text-accent">Trending now</p>
              <h2 className="text-display-sm font-bold">Trending Packs</h2>
            </div>
            <span className="eyebrow hidden md:block">Most ripped · Last 24h</span>
          </Reveal>
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
