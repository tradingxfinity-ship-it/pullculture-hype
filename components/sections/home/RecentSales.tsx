import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import SaleRow from "@/components/cards/SaleRow";
import Reveal from "@/components/ui/Reveal";
import SplitHeading from "@/components/ui/SplitHeading";
import { recentSales, usd } from "@/lib/data";

// Sticky title column on the left, dense sales ledger scrolling past it.
export default function RecentSales() {
  const volume = recentSales.reduce((n, s) => n + s.price, 0);

  return (
    <section className="relative bg-ink-0 py-section">
      <div className="frame grid-12 gap-y-12">
        <div className="col-span-4 md:col-span-8 lg:col-span-4">
          <Reveal className="lg:sticky lg:top-[calc(var(--topbar-h)+40px)]">
            <div className="mb-6 flex items-center gap-3">
              <span className="font-mono text-[11px] tracking-[0.12em] text-accent">04</span>
              <span className="h-px w-8 bg-accent/60" />
              <span className="eyebrow">The Ledger</span>
            </div>
            <SplitHeading lines={["Recent", "Sales"]} className="text-display-md font-bold" />
            <p className="mt-6 max-w-xs text-[15px] leading-relaxed text-fg-muted">
              Every sale on HYP3, as it clears. Real hits, real value — tracked in the open.
            </p>
            <dl className="mt-10 grid max-w-xs grid-cols-2 border-t border-line pt-6">
              <div>
                <dt className="eyebrow">Last hour</dt>
                <dd className="mt-1 font-mono text-xl text-fg">{recentSales.length} sales</dd>
              </div>
              <div>
                <dt className="eyebrow">Volume</dt>
                <dd className="mt-1 font-mono text-xl text-accent">{usd(volume)}</dd>
              </div>
            </dl>
            <Link href="/recents?tab=RECENT+SALES" className="group mt-10 inline-flex items-center gap-2 text-sm font-medium text-fg">
              <span className="link-u">See all sales</span>
              <span className="grid h-8 w-8 place-items-center rounded-full border border-line-strong transition-colors duration-base group-hover:border-accent group-hover:bg-accent group-hover:text-accent-ink">
                <ArrowUpRight className="arrow-nudge h-3.5 w-3.5" />
              </span>
            </Link>
          </Reveal>
        </div>

        <div className="col-span-4 md:col-span-8 lg:col-span-8">
          <div className="hidden grid-cols-[32px_64px_minmax(0,1fr)_130px_96px_36px] gap-5 border-b border-line-strong px-2 pb-3 md:grid">
            {["#", "", "Card", "When", "Price", ""].map((h, i) => (
              <span key={i} className={`eyebrow !text-[10px] ${h === "Price" ? "text-right" : ""}`}>
                {h}
              </span>
            ))}
          </div>
          {recentSales.map((s, i) => (
            <Reveal key={s.id} delay={Math.min(i, 6) * 50}>
              <SaleRow sale={s} index={i} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
