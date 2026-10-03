"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Hand, RotateCcw, Sparkles, Wallet, Zap } from "lucide-react";
import Button from "@/components/ui/Button";
import Logo from "@/components/ui/Logo";
import Tag from "@/components/ui/Tag";
import { useToast } from "@/components/ui/Toast";
import { useAccount } from "@/components/account/AccountProvider";
import { pullTiers, usd, type Pack } from "@/lib/data";
import type { VaultItem } from "@/lib/account";
import FxCanvas, { type BurstOpts, type FxHandle } from "./FxCanvas";

// Demo pack opening. Pulls are drawn locally, weighted by the tier odds the
// site lists, and land in the demo vault. Replace `drawPull` with the
// server's provably-fair result when packs can really be bought.

type Phase = "ready" | "opening" | "reveal" | "summary";
type TierName = (typeof pullTiers)[number]["name"];

const tierStyle: Record<TierName, { color: string; label: string }> = {
  Grail: { color: "117,251,181", label: "Grail" },
  Chasers: { color: "232,196,106", label: "Chaser" },
  Series: { color: "212,215,220", label: "Series" },
};
const valueRange: Record<TierName, [number, number]> = { Grail: [2500, 4200], Chasers: [150, 650], Series: [20, 80] };
const grades: Record<TierName, string[]> = { Grail: ["PSA 10"], Chasers: ["PSA 9", "PSA 10"], Series: ["Raw", "PSA 8", "PSA 9"] };
const pick = <T,>(a: T[]) => a[Math.floor(Math.random() * a.length)];

type Pull = VaultItem & { tier: TierName };

function drawPull(pack: Pack): Pull {
  const weights = pullTiers.map((t) => parseFloat(t.odds));
  let r = Math.random() * weights.reduce((a, b) => a + b, 0);
  const tier = pullTiers.find((_, i) => (r -= weights[i]) < 0) ?? pullTiers[pullTiers.length - 1];
  const [lo, hi] = valueRange[tier.name as TierName];
  const value = Math.round(lo + Math.random() * (hi - lo));
  return {
    id: `p${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`,
    tier: tier.name as TierName,
    name: pick(tier.cards),
    set: `${pack.name} · ${tierStyle[tier.name as TierName].label}`,
    grade: pick(grades[tier.name as TierName]),
    image: "/assets/cards/Pack-02.webp",
    value,
    buyback: Math.round(value * 0.8),
    pack: pack.name,
    pulledAt: new Date().toISOString().slice(0, 10),
    status: "vault",
  };
}

// Pack geometry as % of the cut-out pack box. In the square art the pack
// spans 25–75% across and 6.5–93.5% down; the seal tears along TEAR.
const TEAR = 9;
const teeth: [number, number][] = Array.from({ length: 19 }, (_, i) => [(100 * i) / 18, TEAR + (i % 2 ? 0.8 : -0.8)]);
const poly = (pts: [number, number][]) => `polygon(${pts.map(([x, y]) => `${+x.toFixed(2)}% ${+y.toFixed(2)}%`).join(", ")})`;
const STRIP_CLIP = poly([[0, 0], [100, 0], ...[...teeth].reverse()]);
const BODY_CLIP = poly([...teeth, [95, 13.7], [95, 86.3], [100, 91.4], [100, 100], [0, 100], [0, 91.4], [5, 86.3], [5, 13.7]]);

// Foil confetti colours per pack tier
const foil: Record<Pack["tier"], string[]> = {
  Silver: ["#eef0f3", "#b4b9c2", "#8d939d", "#ffffff"],
  Gold: ["#f7dc85", "#d4a53f", "#fff0b8", "#a8791f"],
  Platinum: ["#e7f1ff", "#a9bedc", "#cfd8e6", "#ffffff"],
};

// Opening timeline (ms): strip flies, beams, card rises, pack drops, card settles
const OPEN_MS = 2300;

function PackArt({ src, clip, className = "" }: { src: string; clip: string; className?: string }) {
  return (
    <div className={`absolute inset-0 ${className}`} style={{ clipPath: clip }}>
      <div className="rip-art">
        <Image src={src} alt="" fill priority sizes="520px" className="object-cover" draggable={false} />
      </div>
      <div className="rip-foil" />
    </div>
  );
}

export default function RipExperience({ pack, qty }: { pack: Pack; qty: number }) {
  const { state, dispatch, hydrated } = useAccount();
  const toast = useToast();
  const [phase, setPhase] = useState<Phase>("ready");
  const [index, setIndex] = useState(0);
  const [pulls, setPulls] = useState<Pull[]>([]);
  const [flipped, setFlipped] = useState(false);
  const [tearing, setTearing] = useState(false);
  const [impact, setImpact] = useState(0);
  const [quake, setQuake] = useState(false);
  const stage = useRef<HTMLDivElement>(null);
  const cardEl = useRef<HTMLButtonElement>(null);
  const fx = useRef<FxHandle>(null);
  const tear = useRef({ p: 0, lastX: 0, step: 0, raf: 0, active: false });
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const later = (ms: number, fn: () => void) => void timers.current.push(setTimeout(fn, ms));
  useEffect(
    () => () => {
      timers.current.forEach(clearTimeout);
      cancelAnimationFrame(tear.current.raf);
    },
    [],
  );

  const current = pulls[index];
  const canAfford = state.balance >= pack.price;
  const ready = phase === "ready" && hydrated && canAfford;
  const tierRgb = current && phase !== "ready" ? tierStyle[current.tier].color : "117,251,181";
  const setVar = (k: string, v: string) => stage.current?.style.setProperty(k, v);

  // --- Tear -------------------------------------------------------------
  const setProgress = (p: number) => {
    const t = tear.current;
    t.p = Math.max(0, Math.min(1, p));
    setVar("--p", t.p.toFixed(3));
    const step = Math.floor(t.p * 24);
    if (step > t.step) {
      // sparks off the leading edge, and a tick on phones like a zip catching
      fx.current?.burstAt(stage.current, t.p, TEAR / 100, { count: 3, kind: "spark", colors: ["#ffffff", "#75FBB5"], spread: 1.8, speed: [120, 340], gravity: 600, size: [1.2, 2.4], life: [0.25, 0.55] });
      if (step % 3 === 0) navigator.vibrate?.(5);
    }
    t.step = step;
  };

  const animateTo = (target: number, ms: number, done?: () => void) => {
    const t = tear.current;
    cancelAnimationFrame(t.raf);
    const from = t.p;
    const t0 = performance.now();
    const frame = (now: number) => {
      const k = Math.min(1, (now - t0) / ms);
      const e = target > from ? k * k * (3 - 2 * k) : 1 - (1 - k) ** 3;
      setProgress(from + (target - from) * e);
      if (k < 1) t.raf = requestAnimationFrame(frame);
      else done?.();
    };
    t.raf = requestAnimationFrame(frame);
  };

  const open = () => {
    if (phase !== "ready") return;
    const t = tear.current;
    t.active = false;
    cancelAnimationFrame(t.raf);
    setProgress(1);
    setTearing(false);

    const pull = drawPull(pack);
    dispatch({ type: "rip", pack: pack.name, price: pack.price, items: [pull] });
    setPulls((ps) => [...ps.slice(0, index), pull]);
    setFlipped(false);
    setPhase("opening");

    const w = stage.current?.clientWidth ?? 200;
    const col = `rgb(${tierStyle[pull.tier].color})`;
    fx.current?.burstAt(stage.current, 0.5, TEAR / 100, { count: 48, colors: foil[pack.tier], width: w, spread: 2, speed: [260, 760], gravity: 1200 });
    fx.current?.burstAt(stage.current, 0.5, TEAR / 100, { count: 34, kind: "spark", colors: ["#ffffff", col], width: w * 0.8, spread: 1.3, speed: [320, 860], gravity: 250, size: [1.5, 3], life: [0.4, 0.9] });
    navigator.vibrate?.([12, 40, 20]);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    later(reduced ? 150 : OPEN_MS, () => setPhase("reveal"));
  };

  const autoTear = () => {
    if (!ready || tearing) return;
    setTearing(true);
    animateTo(1, 750, open);
  };

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!ready || e.button > 0) return;
    const t = tear.current;
    cancelAnimationFrame(t.raf);
    t.active = true;
    t.lastX = e.clientX;
    e.currentTarget.setPointerCapture(e.pointerId);
    setTearing(true);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = stage.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const mx = (e.clientX - r.left) / r.width;
    const my = (e.clientY - r.top) / r.height;
    if (phase === "ready") {
      setVar("--rx", `${((0.5 - my) * 14).toFixed(2)}deg`);
      setVar("--ry", `${((mx - 0.5) * 18).toFixed(2)}deg`);
      setVar("--mx", `${(mx * 100).toFixed(1)}%`);
    } else if (phase === "reveal" && flipped) {
      setVar("--crx", `${((0.5 - my) * 16).toFixed(2)}deg`);
      setVar("--cry", `${((mx - 0.5) * 22).toFixed(2)}deg`);
      setVar("--gx", `${(mx * 100).toFixed(1)}%`);
      setVar("--gy", `${(my * 100).toFixed(1)}%`);
    }
    const t = tear.current;
    if (!t.active) return;
    const dx = e.clientX - t.lastX;
    t.lastX = e.clientX;
    if (dx > 0) setProgress(t.p + dx / (r.width * 0.8));
    if (t.p >= 1) open();
  };

  const onPointerUp = () => {
    const t = tear.current;
    if (!t.active) return;
    t.active = false;
    if (t.p > 0.5) animateTo(1, 260, open);
    else animateTo(0, 420, () => setTearing(false));
  };

  const onPointerLeave = () => {
    for (const k of ["--rx", "--ry", "--crx", "--cry"]) setVar(k, "0deg");
  };

  // --- Reveal -----------------------------------------------------------
  const flip = () => {
    if (phase !== "reveal" || flipped || !current) return;
    setFlipped(true);
    const tier = current.tier;
    const col = `rgb(${tierStyle[tier].color})`;
    later(330, () => {
      setImpact((n) => n + 1);
      const el = cardEl.current;
      const at = (o: BurstOpts) => fx.current?.burstAt(el, 0.5, 0.45, { spread: Math.PI * 2, ...o });
      if (tier === "Grail") {
        setQuake(true);
        later(700, () => setQuake(false));
        navigator.vibrate?.([30, 60, 30, 60, 80]);
        at({ count: 150, colors: ["#75FBB5", "#ffffff", "#b9ffd9", "#2fd98a", "#e8c46a"], speed: [320, 1100], gravity: 650, life: [1.5, 2.8] });
        at({ count: 70, kind: "spark", colors: ["#ffffff", col], speed: [420, 1300], gravity: 150, size: [1.5, 3.5], life: [0.5, 1.2] });
        later(450, () => at({ count: 60, colors: ["#75FBB5", "#ffffff", "#2fd98a"], angle: -Math.PI / 2, spread: 1.4, speed: [500, 900], gravity: 700, life: [1.6, 2.6] }));
      } else if (tier === "Chasers") {
        navigator.vibrate?.([20, 50, 30]);
        at({ count: 80, colors: ["#e8c46a", "#fff0b8", "#c9952d", "#ffffff"], speed: [260, 820], gravity: 750, life: [1.2, 2.2] });
        at({ count: 34, kind: "spark", colors: ["#ffffff", col], speed: [300, 900], gravity: 200, size: [1.2, 3], life: [0.4, 0.9] });
      } else {
        navigator.vibrate?.(15);
        at({ count: 30, kind: "spark", colors: ["#ffffff", col], speed: [200, 560], gravity: 250, size: [1, 2.4], life: [0.35, 0.8] });
      }
    });
  };

  const resetTear = () => {
    cancelAnimationFrame(tear.current.raf);
    tear.current = { p: 0, lastX: 0, step: 0, raf: 0, active: false };
    setTearing(false);
    setFlipped(false);
    setImpact(0);
  };

  const next = () => {
    if (index + 1 < qty) {
      resetTear();
      setIndex(index + 1);
      setPhase("ready");
    } else setPhase("summary");
  };

  const restart = () => {
    resetTear();
    setPulls([]);
    setIndex(0);
    setPhase("ready");
  };

  // Summary: which of this session's pulls are still sitting in the vault
  const stillInVault = pulls.filter((p) => state.vault.some((v) => v.id === p.id && v.status === "vault"));
  const totalValue = pulls.reduce((n, p) => n + p.value, 0);
  const sellable = stillInVault.reduce((n, p) => n + p.buyback, 0);
  const opened = phase === "opening" || phase === "reveal";
  const strength = current?.tier === "Grail" ? 1 : current?.tier === "Chasers" ? 0.7 : 0.4;

  return (
    <section className="relative flex min-h-[calc(100svh-var(--topbar-h)-36px)] flex-col overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 transition-[background] duration-slow"
        style={{ background: `radial-gradient(ellipse 55% 60% at 50% 42%, rgba(${tierRgb},${opened ? 0.1 + strength * 0.16 : 0.14}), transparent 70%)` }}
        aria-hidden
      />
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-40" aria-hidden />
      <FxCanvas ref={fx} />
      {impact > 0 && (
        <div key={impact} className="rip-flash pointer-events-none absolute inset-0 z-40" style={{ "--tier": tierRgb, "--flash": strength * 0.85 } as React.CSSProperties} aria-hidden />
      )}

      {/* Top row */}
      <div className="frame relative flex items-center justify-between gap-4 border-b border-line py-4">
        <Link href={`/pack/product/${pack.slug}`} className="group inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.12em] text-fg-muted hover:text-fg">
          <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" /> {pack.name}
        </Link>
        <div className="flex items-center gap-3">
          {qty > 1 && phase !== "summary" && (
            <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-fg-muted">
              Pack <span className="text-accent">{index + 1}</span> / {qty}
            </span>
          )}
          <span className="inline-flex h-8 items-center gap-2 rounded-sm border border-line-strong px-3 font-mono text-[12px] tabular-nums text-fg">
            <Wallet className="h-3.5 w-3.5 text-accent" /> {usd(state.balance, true)}
          </span>
        </div>
      </div>

      <div className="frame relative flex flex-1 flex-col items-center justify-center py-8">
        {phase !== "summary" && (
          <div className="flex w-full flex-col items-center">
            {/* STAGE: the pack sits over the card; tearing the seal lets the card out */}
            <div
              key={index}
              ref={stage}
              className={`rip-stage ${phase === "ready" ? "is-ready" : "is-open"} ${phase === "reveal" ? "is-reveal" : ""} ${tearing ? "is-tearing" : ""} ${ready ? "cursor-grab" : ""} ${quake ? "is-quake" : ""}`}
              style={{ "--tier": tierRgb, "--strength": strength } as React.CSSProperties}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
              onPointerLeave={onPointerLeave}
            >
              <div className="rip-beams" aria-hidden />

              <div className="rip-card-slot">
                {impact > 0 && <span key={impact} className="rip-shock" aria-hidden />}
                <div className="rip-card-tilt">
                  <button
                    ref={cardEl}
                    type="button"
                    onClick={flip}
                    disabled={phase !== "reveal" || flipped}
                    tabIndex={phase === "reveal" ? 0 : -1}
                    aria-hidden={phase !== "reveal"}
                    aria-label={flipped && current ? `${current.name}, ${current.grade}` : "Flip card to reveal"}
                    className={`card-flip relative block h-full w-full ${flipped ? "is-flipped" : ""} ${phase === "reveal" && !flipped ? "card-hint cursor-pointer" : ""}`}
                  >
                    <span className="card-face rip-card-back card-back-pattern grid place-items-center overflow-hidden rounded-md">
                      <span className="flex flex-col items-center gap-4">
                        <Logo link={false} className="h-7 w-auto" />
                        <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-fg-muted">Tap to reveal</span>
                      </span>
                    </span>
                    <span className="card-face card-face-front" style={{ filter: `drop-shadow(0 0 ${20 + strength * 30}px rgba(${tierRgb},0.5)) drop-shadow(0 30px 40px rgba(0,0,0,0.8))` }}>
                      {current && <Image src={current.image} alt="" fill sizes="300px" className="object-contain" />}
                      {flipped && <span className="rip-glare" aria-hidden />}
                    </span>
                  </button>
                </div>
              </div>

              <div className="rip-pack" aria-hidden>
                <div className="rip-pack-tilt">
                  <div className="rip-gap-light" />
                  <PackArt src={pack.image} clip={BODY_CLIP} />
                  <PackArt src={pack.image} clip={STRIP_CLIP} className="rip-strip" />
                  <div className="rip-tear-line" />
                  {ready && !tearing && (
                    <div className="rip-guide">
                      <span />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* INFO */}
            <div className="relative mt-8 flex min-h-[210px] w-full max-w-xl flex-col items-center text-center">
              {phase === "ready" && (
                <div key={`info-${index}`} className={`transition-opacity duration-base ${tearing ? "opacity-40" : "opacity-100"}`}>
                  <div className="flex items-center justify-center gap-2">
                    <Tag tone={pack.tier.toLowerCase() as "silver" | "gold" | "platinum"}>{pack.tier}</Tag>
                    <Tag>{pack.categoryLabel}</Tag>
                    <span className="font-mono text-sm tabular-nums text-accent">{usd(pack.price, true)}</span>
                  </div>
                  <h1 className="mt-3 text-[clamp(1.6rem,3.6vw,2.5rem)] font-bold leading-none tracking-[-0.045em]">{pack.name}</h1>

                  {hydrated && !canAfford ? (
                    <div className="mt-6 rounded-md border border-line-strong bg-ink-1 p-5 text-sm text-fg-muted">
                      <p className="font-semibold text-fg">Not enough balance</p>
                      <p className="mt-1">You need {usd(pack.price - state.balance, true)} more to rip this pack.</p>
                      <div className="mt-4 flex flex-wrap justify-center gap-2">
                        <Button href="/account/wallet" size="sm">
                          Add funds
                        </Button>
                        <Button href="/account/settings?tab=demo" variant="secondary" size="sm">
                          Reset demo
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="mt-4 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-fg-muted">
                        <Hand className="h-3.5 w-3.5 text-accent" /> Swipe across the seal to tear it
                      </p>
                      <div>
                        <Button size="lg" magnetic arrow className="mt-5 min-w-[220px]" onClick={autoTear} disabled={!ready || tearing}>
                          Rip it open
                        </Button>
                      </div>
                    </>
                  )}
                  <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.14em] text-fg-dim">Demo pull · no real charge</p>
                </div>
              )}

              {phase === "reveal" && current && !flipped && (
                <p className="reveal-in mt-6 animate-pulse font-mono text-[11px] uppercase tracking-[0.16em] text-fg-muted">Tap the card to flip it</p>
              )}

              {phase === "reveal" && current && flipped && (
                <div className="reveal-in">
                  <span className="inline-flex h-7 items-center gap-1.5 rounded-[6px] px-2.5 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-black" style={{ background: `rgb(${tierStyle[current.tier].color})` }}>
                    {current.tier === "Grail" && <Sparkles className="h-3.5 w-3.5" />}
                    {tierStyle[current.tier].label} pull
                  </span>
                  <h2 className="mt-3 text-[clamp(1.75rem,4.5vw,3rem)] font-bold leading-none tracking-[-0.05em]">{current.name}</h2>
                  <p className="mt-2 text-fg-muted">
                    {current.grade} · est. <span className="font-mono text-fg">{usd(current.value)}</span> · buyback <span className="font-mono text-accent">{usd(current.buyback)}</span>
                  </p>
                  <div className="mt-6 flex flex-wrap justify-center gap-3">
                    <Button size="lg" arrow magnetic onClick={next}>
                      {index + 1 < qty ? `Rip pack ${index + 2} of ${qty}` : qty > 1 ? "See results" : "Done"}
                    </Button>
                  </div>
                  <p className="mt-3 text-xs text-fg-dim">Saved to your vault</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* SUMMARY */}
        {phase === "summary" && (
          <div className="step-in w-full max-w-4xl" style={{ "--dir": 1 } as React.CSSProperties}>
            <div className="text-center">
              <p className="eyebrow text-accent">{pulls.length === 1 ? "Your pull" : `Your ${pulls.length} pulls`}</p>
              <h1 className="mt-3 text-[clamp(2rem,5vw,3.5rem)] font-bold leading-none tracking-[-0.05em]">
                Nice <em className="font-serif font-normal italic tracking-[-0.02em] text-accent">rip.</em>
              </h1>
              <p className="mt-3 text-fg-muted">
                Est. total <span className="font-mono text-fg">{usd(totalValue)}</span> for {usd(pack.price * pulls.length)}
              </p>
            </div>

            <ul className="mt-10 flex flex-wrap justify-center gap-3">
              {pulls.map((p) => {
                const sold = !state.vault.some((v) => v.id === p.id);
                return (
                  <li key={p.id} className={`w-[calc(50%-6px)] rounded-md border bg-ink-1 p-4 text-center transition-opacity sm:w-[180px] ${sold ? "opacity-50" : ""}`} style={{ borderColor: `rgba(${tierStyle[p.tier].color},0.35)` }}>
                    <div className="relative mx-auto aspect-[147/250] w-20">
                      <Image src={p.image} alt="" fill sizes="80px" className="object-contain drop-shadow-[0_10px_14px_rgba(0,0,0,0.7)]" />
                    </div>
                    <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.12em]" style={{ color: `rgb(${tierStyle[p.tier].color})` }}>
                      {tierStyle[p.tier].label}
                    </p>
                    <p className="mt-1 truncate font-semibold text-fg">{p.name}</p>
                    <p className="text-xs text-fg-dim">{p.grade}</p>
                    <p className="mt-2 font-mono text-sm tabular-nums text-fg">{sold ? "Sold back" : usd(p.value)}</p>
                  </li>
                );
              })}
            </ul>

            <div className="mt-10 flex flex-wrap justify-center gap-3">
              {stillInVault.length > 0 && (
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={() => {
                    dispatch({ type: "sellBack", ids: stillInVault.map((p) => p.id) });
                    toast(`Sold back ${stillInVault.length > 1 ? `${stillInVault.length} cards` : stillInVault[0].name} for ${usd(sellable, true)}.`);
                  }}
                >
                  <Zap className="h-4 w-4" /> Sell {stillInVault.length > 1 ? "all " : ""}back · {usd(sellable)}
                </Button>
              )}
              <Button href="/account/vault" variant="secondary" size="lg">
                Go to vault
              </Button>
              <Button size="lg" onClick={restart} magnetic>
                <RotateCcw className="h-4 w-4" /> Rip again
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
