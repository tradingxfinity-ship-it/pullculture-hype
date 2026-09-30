import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import PackCard from "@/components/cards/PackCard";
import HScroll from "@/components/ui/HScroll";
import { featuredPackOrder, getPack } from "@/lib/data";

// Slim header row so the packs sit right under the banner.
export default function RipAPack() {
  const list = featuredPackOrder.map(getPack).filter(Boolean) as NonNullable<ReturnType<typeof getPack>>[];

  return (
    <section className="relative bg-ink-0 pb-section pt-6 md:pt-8">
      <div className="frame mb-5 flex items-center gap-4 md:mb-6">
        <h2 className="flex items-baseline gap-3 text-xl font-bold tracking-[-0.03em] text-fg md:text-2xl">
          <span className="font-mono text-[11px] font-normal tracking-[0.12em] text-accent">01</span>
          Rip A Pack
        </h2>
        <span className="h-px flex-1 bg-line" aria-hidden />
        <Link href="/pack" className="group inline-flex items-center gap-2 text-sm font-medium text-fg">
          <span className="link-u">See all</span>
          <ArrowUpRight className="arrow-nudge h-4 w-4 text-accent" />
        </Link>
      </div>
      <HScroll label="Packs">
        {list.map((p, i) => (
          <PackCard key={p.name} pack={p} index={i} className="w-[60vw] shrink-0 sm:w-[34vw] md:w-[26vw] lg:w-[19vw] xl:w-[17vw] 2xl:w-[290px]" />
        ))}
      </HScroll>
    </section>
  );
}
