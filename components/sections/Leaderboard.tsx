"use client";

import Image from "next/image";
import { useState } from "react";
import { Clock } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import { useCountdown } from "@/components/ui/Countdown";
import { me, num, podium, podiumPrize, ranking } from "@/lib/data";

const pad = (n: number) => String(n).padStart(2, "0");

export default function Leaderboard() {
  const [period, setPeriod] = useState<"this" | "last">("this");
  const t = useCountdown(4 * 3600 + 13 * 60 + 41);

  return (
    <>
      {/* Controls + timer */}
      <div className="frame flex flex-col gap-6 border-b border-line py-6 md:flex-row md:items-center md:justify-between">
        <div className="flex h-11 w-full rounded-sm border border-line-strong p-1 md:w-auto" role="tablist" aria-label="Period">
          {(
            [
              ["this", "This Month"],
              ["last", "Last Month"],
            ] as const
          ).map(([k, label]) => (
            <button
              key={k}
              role="tab"
              aria-selected={period === k}
              onClick={() => setPeriod(k)}
              className={`flex-1 rounded-[6px] px-5 text-[13px] font-medium transition-colors md:flex-none ${
                period === k ? "bg-accent text-accent-ink" : "text-fg-muted hover:text-fg"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-4">
          <span className="eyebrow flex items-center gap-2">
            <Clock className="h-3.5 w-3.5 text-accent" /> Time left
          </span>
          <span className="font-mono text-2xl tabular-nums text-fg">
            {t.d}d {pad(t.h)}h {pad(t.m)}m {pad(t.s)}s
          </span>
        </div>
      </div>

      {/* Podium */}
      <section className="relative overflow-hidden border-b border-line">
        <div className="glow absolute left-1/2 top-0 h-[520px] w-[760px] -translate-x-1/2" aria-hidden />
        <div className="frame relative grid grid-cols-1 items-end gap-4 pb-0 pt-16 md:grid-cols-3 md:gap-0 md:pt-24">
          {podium.map((p, i) => {
            const first = p.rank === 1;
            return (
              <Reveal
                key={p.rank}
                delay={first ? 0 : 150}
                className={`relative flex flex-col items-center border-line text-center md:border-x ${first ? "order-first md:order-none" : ""} ${
                  i === 0 ? "md:border-r-0" : i === 2 ? "md:border-l-0" : ""
                }`}
              >
                <span
                  aria-hidden
                  className={`pointer-events-none absolute left-1/2 -translate-x-1/2 select-none font-black leading-none tracking-[-0.08em] ${
                    first ? "-top-6 text-[14rem] text-accent/[0.07]" : "-top-2 text-[10rem] text-white/[0.04]"
                  }`}
                >
                  {pad(p.rank)}
                </span>
                <div className="relative">
                  <div className={`overflow-hidden rounded-md border ${first ? "h-36 w-36 border-accent/60 md:h-44 md:w-44" : "h-28 w-28 border-line-strong md:h-32 md:w-32"}`}>
                    <Image src="/assets/users/user-01.webp" alt="" width={200} height={200} className="h-full w-full object-cover" />
                  </div>
                  <Image src={p.medal} alt={`Rank ${p.rank}`} width={40} height={40} className="absolute -bottom-4 left-1/2 h-9 w-9 -translate-x-1/2" />
                </div>
                <p className="mt-8 font-mono text-[11px] uppercase tracking-[0.14em] text-fg-dim">Rank {pad(p.rank)}</p>
                <h3 className={`mt-2 font-bold tracking-[-0.04em] ${first ? "text-5xl text-accent" : "text-3xl text-fg"}`}>{p.name}</h3>
                <p className="mt-2 font-mono text-sm text-fg-muted">{num(p.points)} pts</p>
                <div className={`mt-8 w-full border-t border-line px-6 py-6 ${first ? "bg-white/[0.03] pb-16" : "pb-8"}`}>
                  <p className="eyebrow !text-[10px] text-accent">Prize</p>
                  <p className="mx-auto mt-2 max-w-[240px] text-[15px] font-medium leading-snug text-fg-2">{podiumPrize}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* You */}
      <section className="frame grid grid-cols-1 border-b border-line sm:grid-cols-3">
        {[
          ["You have", `${num(me.points)} Points`],
          ["Your current rank", `#${me.rank}`],
          ["Points earned today", num(me.today)],
        ].map(([k, v], i) => (
          <div key={k} className={`py-8 ${i ? "border-line sm:border-l sm:pl-8" : ""} max-sm:border-b`}>
            <p className="eyebrow">{k}</p>
            <p className="mt-2 font-mono text-3xl tabular-nums text-accent">{v}</p>
          </div>
        ))}
      </section>

      {/* Rules + table */}
      <section className="frame grid-12 gap-y-12 py-section">
        <div className="col-span-4 md:col-span-8 lg:col-span-4">
          <Reveal className="lg:sticky lg:top-[calc(var(--topbar-h)+40px)]">
            <p className="eyebrow mb-4 text-accent">How it works</p>
            <h2 className="text-display-sm font-bold">
              Pull Packs, Rank Up, and <span className="text-accent">Win Prizes</span>
            </h2>
            <p className="mt-6 max-w-sm text-[15px] leading-relaxed text-fg-muted">
              Every pull counts! Earn points all month, track your live progress, and rise up the ranks. Bigger packs mean bigger points. Points
              and prizes reset monthly. It’s time to compete for some monthly prizes!
            </p>
          </Reveal>
        </div>
        <div className="col-span-4 md:col-span-8 lg:col-span-8">
          <div className="grid grid-cols-[48px_1fr_auto] gap-4 border-b border-line-strong pb-3 sm:grid-cols-[56px_1fr_140px_140px]">
            {["Rank", "Collector", "Points", "Prize"].map((h, i) => (
              <span key={h} className={`eyebrow !text-[10px] ${i >= 2 ? "text-right" : ""} ${i === 3 ? "hidden sm:block" : ""}`}>
                {h}
              </span>
            ))}
          </div>
          <ol>
            {ranking.map((r, i) => (
              <Reveal as="li" key={r.rank} delay={Math.min(i, 8) * 40}>
                <div className="grid grid-cols-[48px_1fr_auto] items-center gap-4 border-b border-line py-4 transition-colors hover:bg-white/[0.02] sm:grid-cols-[56px_1fr_140px_140px]">
                  <span className="font-mono text-sm text-fg-dim">#{r.rank}</span>
                  <span className="flex min-w-0 items-center gap-3">
                    <Image src="/assets/users/user-01.webp" alt="" width={32} height={32} className="h-8 w-8 shrink-0 rounded-[6px] object-cover" />
                    <span className="min-w-0">
                      <span className="block truncate font-medium text-fg">{r.name}</span>
                      <span className="block text-xs text-accent sm:hidden">{r.prize}</span>
                    </span>
                  </span>
                  <span className="text-right font-mono tabular-nums text-fg">{num(r.points)}</span>
                  <span className={`hidden text-right text-sm sm:block ${r.prize === "Premium Pack" ? "text-accent" : "text-fg-muted"}`}>{r.prize}</span>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}
