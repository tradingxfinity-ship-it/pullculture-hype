import type { Metadata } from "next";
import PageHeader from "@/components/ui/PageHeader";
import Tabs from "@/components/ui/Tabs";
import Reveal from "@/components/ui/Reveal";
import PullCard from "@/components/cards/PullCard";
import SaleRow from "@/components/cards/SaleRow";
import { LiveDot } from "@/components/ui/Tag";
import { recentPulls, recentSales } from "@/lib/data";

export const metadata: Metadata = { title: "Recents" };

const PULLS = "/recents?tab=RECENT+PULLS";
const SALES = "/recents?tab=RECENT+SALES";

export default async function RecentsPage({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  const { tab } = await searchParams;
  const sales = tab === "RECENT SALES";

  return (
    <>
      <PageHeader
        eyebrow="Live Feed"
        title={sales ? ["Recent", <span key="s" className="text-fg-dim">Sales.</span>] : ["Recent", <span key="p" className="text-fg-dim">Pulls.</span>]}
        intro={sales ? "Every marketplace sale as it clears." : "Every hit pulled on HYP3, as it happens. Odds shown on every rip."}
        meta={
          <span className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.12em] text-fg-muted">
            <LiveDot /> Updating live
          </span>
        }
      />
      <div className="sticky top-[var(--topbar-h)] z-20 border-b border-line bg-black/80 backdrop-blur-xl">
        <div className="frame">
          <Tabs
            items={[
              { label: "Recent Pulls", href: PULLS, count: recentPulls.length },
              { label: "Recent Sales", href: SALES, count: recentSales.length },
            ]}
            active={sales ? SALES : PULLS}
            className="[&_ul]:border-b-0"
          />
        </div>
      </div>

      <section className="frame py-12 md:py-16">
        {sales ? (
          <div>
            <div className="hidden grid-cols-[32px_64px_minmax(0,1fr)_130px_96px_36px] gap-5 border-b border-line-strong px-2 pb-3 md:grid">
              {["#", "", "Card", "When", "Price", ""].map((h, i) => (
                <span key={i} className={`eyebrow !text-[10px] ${h === "Price" ? "text-right" : ""}`}>
                  {h}
                </span>
              ))}
            </div>
            {recentSales.map((s, i) => (
              <Reveal key={s.id} delay={Math.min(i, 6) * 40}>
                <SaleRow sale={s} index={i} showBuyer />
              </Reveal>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {recentPulls.map((p, i) => (
              <Reveal key={p.id} delay={(i % 3) * 60}>
                <PullCard pull={p} showUser />
              </Reveal>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
