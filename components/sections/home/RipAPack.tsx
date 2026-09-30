import PackCard from "@/components/cards/PackCard";
import SectionHeader from "@/components/ui/SectionHeader";
import HScroll from "@/components/ui/HScroll";
import { featuredPackOrder, getPack } from "@/lib/data";

export default function RipAPack() {
  const list = featuredPackOrder.map(getPack).filter(Boolean) as NonNullable<ReturnType<typeof getPack>>[];

  return (
    <section className="relative bg-ink-0 pb-section pt-12 md:pt-16">
      <div className="frame">
        <SectionHeader
          index="01"
          label="Rip A Pack"
          title={[
            "Rip a pack.",
            <>
              Chase the <em className="font-serif font-normal italic tracking-[-0.02em] text-accent">hit.</em>
            </>,
          ]}
          aside="Fifteen curated packs across five categories and three tiers. Clear odds, no bulk, every hit shippable."
          action={{ href: "/pack", label: "See all packs" }}
          className="mb-14 md:mb-20"
        />
      </div>
      <HScroll label="Packs">
        {list.map((p, i) => (
          <PackCard key={p.name} pack={p} index={i} className="w-[72vw] shrink-0 sm:w-[44vw] md:w-[36vw] lg:w-[26vw] xl:w-[22vw] 2xl:w-[340px]" />
        ))}
      </HScroll>
    </section>
  );
}
