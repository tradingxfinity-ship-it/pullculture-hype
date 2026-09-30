import CountUp from "@/components/ui/CountUp";
import Icon from "@/components/ui/Icon";
import Reveal from "@/components/ui/Reveal";
import { stats } from "@/lib/data";

// HYP3 Stats — oversized counters on a ruled grid with ghost type behind.
export default function Stats() {
  return (
    <section className="relative overflow-hidden bg-ink-0 py-section">
      <p
        aria-hidden
        className="pointer-events-none absolute -left-[2vw] top-1/2 -translate-y-1/2 select-none whitespace-nowrap text-[28vw] font-black leading-none tracking-[-0.07em] text-outline"
      >
        HYP3
      </p>
      <div className="frame relative">
        <Reveal className="mb-12 flex items-baseline justify-between gap-6 md:mb-16">
          <h2 className="text-display-sm font-bold">
            HYP3 <span className="text-accent">Stats</span>
          </h2>
          <span className="eyebrow hidden sm:block">Updated live · All time</span>
        </Reveal>
        <div className="grid grid-cols-1 border-t border-line md:grid-cols-3">
          {stats.map((s, i) => (
            <Reveal
              key={s.label}
              delay={i * 100}
              className="group relative border-b border-line py-10 md:border-b-0 md:py-14 md:[&:not(:first-child)]:border-l md:[&:not(:first-child)]:pl-8 lg:[&:not(:first-child)]:pl-10"
            >
              <div className="mb-8 flex items-center justify-between pr-2">
                <span className="flex items-center gap-2 text-sm text-fg-muted">
                  <Icon name={s.icon} className="h-4 w-4 text-accent" />
                  {s.label}
                </span>
                <span className="font-mono text-[11px] text-fg-dim">0{i + 1}</span>
              </div>
              <CountUp to={s.value} className="block text-[clamp(3.5rem,7vw,7.5rem)] font-bold leading-[0.85] tracking-[-0.05em] text-fg" />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
