"use client";

import { useMemo, useRef, useState } from "react";
import { usd } from "@/lib/data";

export type PricePoint = { date: string; value: number };

// Round a step to 1 / 2 / 5 × 10^k so axis ticks land on clean numbers.
function niceStep(raw: number) {
  const exp = Math.pow(10, Math.floor(Math.log10(raw)));
  const f = raw / exp;
  return (f <= 1 ? 1 : f <= 2 ? 2 : f <= 5 ? 5 : 10) * exp;
}

const fmtDay = (iso: string) => new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", timeZone: "UTC" }).format(new Date(iso));
const fmtFull = (iso: string) => new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" }).format(new Date(iso));

/**
 * Single-series price line: 2px line over a 10% area wash, hairline grid,
 * crosshair that snaps to the nearest day, keyboard-steppable, with a
 * table view. Single series → no legend; the surrounding title names it.
 */
export default function PriceChart({ points, label, height = 240 }: { points: PricePoint[]; label: string; height?: number }) {
  const [hover, setHover] = useState<number | null>(null);
  const [view, setView] = useState<"chart" | "table">("chart");
  const box = useRef<HTMLDivElement>(null);

  const { line, area, ticks, lo, hi } = useMemo(() => {
    const vals = points.map((p) => p.value);
    const min = Math.min(...vals);
    const max = Math.max(...vals);
    const step = niceStep(Math.max(max - min, 1) / 4);
    const lo = Math.floor(min / step) * step;
    const hi = Math.ceil(max / step) * step;
    const ticks: number[] = [];
    for (let t = lo; t <= hi + step / 2; t += step) ticks.push(t);
    const n = points.length;
    const xy = points.map((p, i) => [(i / (n - 1)) * 1000, 1000 - ((p.value - lo) / (hi - lo || 1)) * 1000] as const);
    const line = xy.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`).join("");
    const area = `${line}L1000,1000L0,1000Z`;
    return { line, area, ticks, lo, hi };
  }, [points]);

  const n = points.length;
  const pct = (v: number) => ((v - lo) / (hi - lo || 1)) * 100;
  const i = hover ?? n - 1;
  const p = points[i];
  const first = points[0];
  const change = first ? ((p.value - first.value) / first.value) * 100 : 0;

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
    setHover(Math.round(ratio * (n - 1)));
  };
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    e.preventDefault();
    setHover((h) => Math.min(n - 1, Math.max(0, (h ?? n - 1) + (e.key === "ArrowRight" ? 1 : -1))));
  };

  // ~8 evenly spaced rows for the table view
  const tableRows = useMemo(() => {
    const k = Math.min(8, n);
    return Array.from({ length: k }, (_, j) => points[Math.round((j / (k - 1)) * (n - 1))]).reverse();
  }, [points, n]);

  return (
    <div>
      {/* Readout + view toggle */}
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div aria-live="polite">
          <p className="font-mono text-2xl tabular-nums text-fg">{usd(p.value)}</p>
          <p className="mt-0.5 text-xs text-fg-muted">
            {fmtFull(p.date)} ·{" "}
            <span className="text-fg-2">
              {change >= 0 ? "▲" : "▼"} {Math.abs(change).toFixed(1)}%
            </span>{" "}
            vs. start of range
          </p>
        </div>
        <div className="flex rounded-sm border border-line-strong p-0.5 text-[12px]" role="tablist" aria-label="View">
          {(["chart", "table"] as const).map((v) => (
            <button
              key={v}
              type="button"
              role="tab"
              aria-selected={view === v}
              onClick={() => setView(v)}
              className={`rounded-[5px] px-2.5 py-1 capitalize transition-colors ${view === v ? "bg-white/10 text-fg" : "text-fg-muted hover:text-fg"}`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {view === "chart" ? (
        <div className="flex gap-3">
          {/* Y axis */}
          <div className="relative w-12 shrink-0 font-mono text-[10px] tabular-nums text-fg-dim" style={{ height }} aria-hidden>
            {ticks.map((t) => (
              <span key={t} className="absolute right-0 -translate-y-1/2" style={{ top: `${100 - pct(t)}%` }}>
                {usd(t)}
              </span>
            ))}
          </div>

          <div className="min-w-0 flex-1">
            <div
              ref={box}
              role="img"
              aria-label={`${label}: ${usd(first.value)} on ${fmtFull(first.date)} to ${usd(points[n - 1].value)} on ${fmtFull(points[n - 1].date)}. Use arrow keys to step through days.`}
              tabIndex={0}
              onPointerMove={onMove}
              onPointerLeave={() => setHover(null)}
              onKeyDown={onKey}
              onBlur={() => setHover(null)}
              className="relative cursor-crosshair touch-none outline-none focus-visible:ring-1 focus-visible:ring-accent/60"
              style={{ height }}
            >
              {/* Gridlines */}
              {ticks.map((t) => (
                <span key={t} className="absolute inset-x-0 h-px bg-line" style={{ top: `${100 - pct(t)}%` }} aria-hidden />
              ))}

              <svg viewBox="0 0 1000 1000" preserveAspectRatio="none" className="absolute inset-0 h-full w-full overflow-visible" aria-hidden>
                <path d={area} fill="var(--accent)" fillOpacity="0.1" />
                <path d={line} fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
              </svg>

              {/* Crosshair, point and tooltip */}
              {hover !== null && (
                <>
                  <span className="pointer-events-none absolute inset-y-0 w-px bg-white/30" style={{ left: `${(i / (n - 1)) * 100}%` }} aria-hidden />
                  <span
                    className="pointer-events-none absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-ink-1 bg-accent"
                    style={{ left: `${(i / (n - 1)) * 100}%`, top: `${100 - pct(p.value)}%` }}
                    aria-hidden
                  />
                  <div
                    className="pointer-events-none absolute top-2 z-10 whitespace-nowrap rounded-sm border border-line-strong bg-ink-3/95 px-3 py-2 shadow-lg backdrop-blur"
                    style={i / (n - 1) > 0.6 ? { right: `${100 - (i / (n - 1)) * 100}%`, marginRight: 10 } : { left: `${(i / (n - 1)) * 100}%`, marginLeft: 10 }}
                    aria-hidden
                  >
                    <p className="font-mono text-sm font-semibold tabular-nums text-fg">{usd(p.value)}</p>
                    <p className="flex items-center gap-1.5 text-[11px] text-fg-muted">
                      <span className="h-0.5 w-3 rounded-full bg-accent" />
                      {fmtFull(p.date)}
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* X axis */}
            <div className="mt-2 flex justify-between font-mono text-[10px] text-fg-dim" aria-hidden>
              <span>{fmtDay(points[0].date)}</span>
              <span>{fmtDay(points[Math.floor((n - 1) / 2)].date)}</span>
              <span>{fmtDay(points[n - 1].date)}</span>
            </div>
          </div>
        </div>
      ) : (
        <table className="w-full text-sm">
          <caption className="sr-only">{label}</caption>
          <thead>
            <tr className="border-b border-line text-left">
              <th scope="col" className="py-2 font-mono text-[10px] font-normal uppercase tracking-[0.12em] text-fg-dim">
                Date
              </th>
              <th scope="col" className="py-2 text-right font-mono text-[10px] font-normal uppercase tracking-[0.12em] text-fg-dim">
                Est. value
              </th>
            </tr>
          </thead>
          <tbody>
            {tableRows.map((r) => (
              <tr key={r.date} className="border-b border-line last:border-0">
                <td className="py-2 text-fg-2">{fmtFull(r.date)}</td>
                <td className="py-2 text-right font-mono tabular-nums text-fg">{usd(r.value)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
