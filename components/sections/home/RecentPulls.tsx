import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Marquee from "@/components/ui/Marquee";
import Reveal from "@/components/ui/Reveal";
import SplitHeading from "@/components/ui/SplitHeading";
import PullCard from "@/components/cards/PullCard";
import { LiveDot } from "@/components/ui/Tag";
import { recentPulls } from "@/lib/data";

// Live feed rendered as two counter-scrolling marquees.
export default function RecentPulls() {
  const a = recentPulls.slice(0, 8);
  const b = recentPulls.slice(8, 16);

  return (
    <section className="relative overflow-hidden border-y border-line bg-ink-2 py-20 md:py-28">
      <div className="frame mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <Reveal>
          <div className="mb-6 flex items-center gap-3">
            <span className="font-mono text-[11px] tracking-[0.12em] text-accent">02</span>
            <span className="h-px w-8 bg-accent/60" />
            <span className="eyebrow flex items-center gap-2">
              <LiveDot /> Live Feed
            </span>
          </div>
          <SplitHeading lines={["Recent Pulls"]} className="text-display-md font-bold" />
        </Reveal>
        <Link href="/recents?tab=RECENT+PULLS" className="group inline-flex items-center gap-2 text-sm font-medium text-fg">
          <span className="link-u">See all pulls</span>
          <span className="grid h-8 w-8 place-items-center rounded-full border border-line-strong transition-colors duration-base group-hover:border-accent group-hover:bg-accent group-hover:text-accent-ink">
            <ArrowUpRight className="arrow-nudge h-3.5 w-3.5" />
          </span>
        </Link>
      </div>

      <div className="space-y-4 [mask-image:linear-gradient(to_right,transparent,#000_8%,#000_92%,transparent)]">
        <Marquee duration={70}>
          {a.map((p) => (
            <PullCard key={p.id} pull={p} className="mr-4 w-[300px] md:w-[340px]" />
          ))}
        </Marquee>
        <Marquee duration={80} reverse>
          {b.map((p) => (
            <PullCard key={p.id} pull={p} className="mr-4 w-[300px] md:w-[340px]" />
          ))}
        </Marquee>
      </div>
    </section>
  );
}
