import Reveal from "@/components/ui/Reveal";
import { pullTiers } from "@/lib/data";

// "Available Pulls" — each odds tier is a row with a sticky label and a
// grid of slab silhouettes. The grail tier gets the spotlight.
export default function PullTiers() {
  return (
    <div className="divide-y divide-line border-t border-line">
      {pullTiers.map((tier, ti) => {
        const grail = ti === 0;
        return (
          <div key={tier.name} className="grid-12 gap-y-8 py-14 md:py-20">
            <div className="col-span-4 md:col-span-8 lg:col-span-3">
              <Reveal className="lg:sticky lg:top-[calc(var(--topbar-h)+40px)]">
                <p className="font-mono text-[11px] tracking-[0.12em] text-fg-dim">Tier {String(ti + 1).padStart(2, "0")}</p>
                <h3 className={`mt-3 text-display-sm font-bold uppercase ${grail ? "text-accent" : ""}`}>{tier.name}</h3>
                <div className="mt-5 flex items-baseline gap-3 border-t border-line pt-4">
                  <span className="eyebrow">Pull chance</span>
                  <span className="font-mono text-2xl text-fg">{tier.odds}</span>
                </div>
                <p className="mt-2 font-mono text-[11px] text-fg-dim">{tier.cards.length} card{tier.cards.length > 1 ? "s" : ""} in tier</p>
              </Reveal>
            </div>
            <div
              className={`col-span-4 grid gap-3 md:col-span-8 lg:col-span-9 ${
                grail ? "grid-cols-1" : "grid-cols-3 sm:grid-cols-3 xl:grid-cols-5"
              }`}
            >
              {tier.cards.map((name, i) => (
                <Reveal key={name} delay={Math.min(i, 8) * 40}>
                  <div
                    className={`group relative flex ${grail ? "aspect-[4/3] sm:aspect-[21/9]" : "min-h-[104px] gap-3 max-sm:p-3 sm:aspect-[3/4]"} flex-col justify-between overflow-hidden rounded-md border p-4 transition-colors duration-base ${
                      grail
                        ? "border-accent/40 bg-[radial-gradient(ellipse_at_50%_30%,rgba(117,251,181,0.18),#070707_70%)]"
                        : "border-line bg-ink-2 hover:border-line-strong"
                    }`}
                  >
                    <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.12em] text-fg-dim">
                      <span>{tier.name}</span>
                      <span>#{String(i + 1).padStart(3, "0")}</span>
                    </div>
                    <div
                      className={`mx-auto rounded-[6px] border border-line-strong bg-gradient-to-br from-white/[0.06] to-transparent transition-transform duration-slow ease-out group-hover:-translate-y-1 group-hover:rotate-[-2deg] ${
                        grail ? "aspect-[3/4] h-[52%]" : "hidden h-[46%] w-[62%] sm:block"
                      }`}
                      aria-hidden
                    />
                    <div>
                      <p className={`font-bold tracking-[-0.03em] ${grail ? "text-4xl text-fg" : "text-[15px] text-fg-2 sm:text-lg"}`}>{name}</p>
                      <p className="mt-1 font-mono text-[11px] text-fg-dim">{tier.odds} odds</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
