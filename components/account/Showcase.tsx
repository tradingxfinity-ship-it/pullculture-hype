"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Sparkles } from "lucide-react";
import type { VaultItem } from "@/lib/account";
import { usd } from "@/lib/data";

// Public-profile showcase set as a lit display case: spotlights flicker on
// as it scrolls into view, slabs rise onto glowing pedestals and float over
// a mirror floor, and each slab tilts toward the pointer with a holo sheen.

// Left-to-right placement so the #1 pin sits in the middle
const arrange: Record<number, number[]> = { 1: [0], 2: [0, 1], 3: [1, 0, 2], 4: [2, 0, 1, 3] };

// Fixed dust motes (deterministic so server and client markup match)
const motes = Array.from({ length: 22 }, (_, i) => ({
  left: (i * 37) % 100,
  top: 15 + ((i * 53) % 70),
  size: 1 + (i % 3),
  delay: -((i * 1.7) % 9),
  dur: 9 + (i % 5) * 2,
}));

function Slab({ v, rank, angle, showValue }: { v: VaultItem; rank: number; angle: number; showValue: boolean }) {
  const el = useRef<HTMLDivElement>(null);
  const featured = rank === 0;

  const move = (e: React.PointerEvent) => {
    const r = el.current?.getBoundingClientRect();
    if (!r || !el.current) return;
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    el.current.style.setProperty("--rx", `${((0.5 - y) * 22).toFixed(2)}deg`);
    el.current.style.setProperty("--ry", `${((x - 0.5) * 26).toFixed(2)}deg`);
    el.current.style.setProperty("--gx", `${(x * 100).toFixed(1)}%`);
    el.current.style.setProperty("--gy", `${(y * 100).toFixed(1)}%`);
  };
  const leave = () => {
    for (const k of ["--rx", "--ry"]) el.current?.style.setProperty(k, "0deg");
  };

  return (
    <li className={`sc-item group ${featured ? "is-featured" : ""}`} style={{ "--i": rank, "--angle": `${angle}deg` } as React.CSSProperties}>
      <div className="sc-beam" aria-hidden />
      <div ref={el} className="sc-slab" onPointerMove={move} onPointerLeave={leave}>
        <div className="sc-float">
          <div className="sc-tilt">
            {featured ? (
              // Turntable: same slab on both faces, paused while hovered
              <div className="sc-spin">
                <div className="sc-face">
                  <Image src={v.image} alt={`${v.name}, ${v.grade}`} fill sizes="260px" className="object-contain" />
                  <span className="sc-holo" aria-hidden />
                  <span className="sc-sweep" aria-hidden />
                  <span className="sc-glare" aria-hidden />
                </div>
                <div className="sc-face sc-face-back" aria-hidden>
                  <Image src={v.image} alt="" fill sizes="260px" className="object-contain" />
                  <span className="sc-sweep" />
                </div>
              </div>
            ) : (
              <>
                <Image src={v.image} alt={`${v.name}, ${v.grade}`} fill sizes="200px" className="object-contain" />
                <span className="sc-holo" aria-hidden />
                <span className="sc-sweep" aria-hidden />
                <span className="sc-glare" aria-hidden />
              </>
            )}
          </div>
          <div className="sc-reflection" aria-hidden>
            {featured ? (
              <div className="sc-spin">
                <div className="sc-face">
                  <Image src={v.image} alt="" fill sizes="200px" className="object-contain" />
                </div>
                <div className="sc-face sc-face-back">
                  <Image src={v.image} alt="" fill sizes="200px" className="object-contain" />
                </div>
              </div>
            ) : (
              <Image src={v.image} alt="" fill sizes="200px" className="object-contain" />
            )}
          </div>
        </div>
      </div>
      <div className="sc-pedestal" aria-hidden />
      <div className="sc-plaque">
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-accent">{featured ? "★ Grail of the vault" : `No. 0${rank + 1}`}</span>
        <span className="mt-1.5 block truncate font-semibold text-fg">{v.name}</span>
        <span className="mt-0.5 block font-mono text-[11px] uppercase tracking-[0.08em] text-fg-dim">
          {v.grade}
          {showValue && <> · <span className="text-fg-2">{usd(v.value)}</span></>}
        </span>
      </div>
    </li>
  );
}

export default function Showcase({ cards, showValue }: { cards: VaultItem[]; showValue: boolean }) {
  const root = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && (setInView(true), io.disconnect()), { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const order = arrange[cards.length] ?? arrange[4];
  const mid = (order.length - 1) / 2;

  return (
    <section ref={root} className={`showcase relative overflow-hidden rounded-lg border border-line ${inView ? "is-in" : ""}`} aria-label="Showcase">
      <div className="sc-floor" aria-hidden />
      <div className="sc-motes" aria-hidden>
        {motes.map((m, i) => (
          <span key={i} style={{ left: `${m.left}%`, top: `${m.top}%`, width: m.size, height: m.size, animationDelay: `${m.delay}s`, animationDuration: `${m.dur}s` }} />
        ))}
      </div>

      <div className="relative flex flex-wrap items-end justify-between gap-4 px-5 pt-7 md:px-10 md:pt-9">
        <div>
          <p className="eyebrow flex items-center gap-2 text-accent">
            <Sparkles className="h-3.5 w-3.5" /> Showcase
          </p>
          <h2 className="mt-2 text-[clamp(1.6rem,3vw,2.4rem)] font-bold leading-none tracking-[-0.045em]">
            Pride of the <em className="font-serif font-normal italic tracking-[-0.02em] text-accent">vault.</em>
          </h2>
        </div>
        <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-fg-dim">{cards.length} pinned</span>
      </div>

      <ul className="sc-stage relative">
        {order.map((idx, pos) => (
          <Slab key={cards[idx].id} v={cards[idx]} rank={idx} angle={(mid - pos) * 9} showValue={showValue} />
        ))}
      </ul>
    </section>
  );
}
