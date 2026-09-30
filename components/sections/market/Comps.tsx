"use client";

import { useState } from "react";
import { ChevronDown, Flag } from "lucide-react";
import { cardDetail } from "@/lib/data";

const ranges = ["1M", "3M", "6M", "12M", "ALL"];

// Recent card sales chart (Comps) with an Activity tab.
export default function Comps() {
  const [tab, setTab] = useState<"comps" | "activity">("comps");
  const [range, setRange] = useState("1M");
  const data = cardDetail.comps;

  const W = 800,
    H = 260,
    max = 180;
  const pts = data.map((d, i) => [(i / (data.length - 1)) * W, H - (d.v / max) * H] as const);
  const path = pts.reduce((acc, [x, y], i) => {
    if (!i) return `M${x},${y}`;
    const [px, py] = pts[i - 1];
    const cx = (px + x) / 2;
    return `${acc} C${cx},${py} ${cx},${y} ${x},${y}`;
  }, "");

  return (
    <div>
      <div className="flex gap-6 border-b border-line" role="tablist">
        {(["comps", "activity"] as const).map((t) => (
          <button
            key={t}
            role="tab"
            aria-selected={tab === t}
            onClick={() => setTab(t)}
            className={`relative h-12 text-sm font-medium capitalize transition-colors ${tab === t ? "text-fg" : "text-fg-muted hover:text-fg"}`}
          >
            {t}
            <span className={`absolute inset-x-0 -bottom-px h-[2px] bg-accent transition-transform duration-base ${tab === t ? "scale-x-100" : "scale-x-0"}`} />
          </button>
        ))}
      </div>

      {tab === "comps" ? (
        <div className="pt-8">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <h3 className="text-2xl font-semibold tracking-[-0.03em]">Recent Card Sales</h3>
            <button type="button" className="inline-flex items-center gap-2 text-[13px] text-fg-muted transition-colors hover:text-fg">
              <Flag className="h-3.5 w-3.5 text-accent" /> Report Problem
            </button>
          </div>
          <div className="mb-6 flex flex-wrap gap-2">
            <button type="button" className="flex h-9 items-center gap-2 rounded-sm border border-accent px-3 text-[13px] text-accent">
              PSA 8.5 <ChevronDown className="h-3.5 w-3.5" />
            </button>
            {ranges.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRange(r)}
                aria-pressed={range === r}
                className={`h-9 rounded-sm border px-3 font-mono text-[12px] transition-colors ${
                  range === r ? "border-fg bg-fg text-black" : "border-line-strong text-fg-muted hover:text-fg"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
          <div className="rounded-md border border-line bg-ink-2 p-4 md:p-6">
            <div className="flex">
              <div className="flex w-12 flex-col justify-between pb-6 font-mono text-[11px] text-fg-dim">
                {[180, 135, 90, 45, 0].map((v) => (
                  <span key={v}>${v}</span>
                ))}
              </div>
              <div className="flex-1">
                <svg viewBox={`0 -10 ${W} ${H + 20}`} className="h-56 w-full overflow-visible md:h-64" preserveAspectRatio="none" role="img" aria-label="Sale price trend">
                  <defs>
                    <linearGradient id="comp-fill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#75FBB5" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#75FBB5" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  {[0, 0.25, 0.5, 0.75, 1].map((f) => (
                    <line key={f} x1="0" x2={W} y1={H * f} y2={H * f} stroke="rgba(255,255,255,0.08)" vectorEffect="non-scaling-stroke" />
                  ))}
                  <path d={`${path} L${W},${H} L0,${H} Z`} fill="url(#comp-fill)" />
                  <path d={path} fill="none" stroke="#75FBB5" strokeWidth="2" vectorEffect="non-scaling-stroke" />
                </svg>
                <div className="mt-2 flex justify-between font-mono text-[11px] text-fg-dim">
                  {data.map((d) => (
                    <span key={d.d}>{d.d}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <ul className="pt-6">
          {Array.from({ length: 5 }, (_, i) => (
            <li key={i} className="flex items-center justify-between border-b border-line py-4 text-sm">
              <span className="text-fg-2">
                <span className="text-accent">@Steezy</span> placed a bid
              </span>
              <span className="font-mono text-fg">${(25215 - i * 450).toLocaleString("en-US")}</span>
              <span className="font-mono text-[11px] text-fg-dim">{(i + 1) * 3}m ago</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
