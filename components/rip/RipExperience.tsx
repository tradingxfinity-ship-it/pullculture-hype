"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, RotateCcw, Scissors, Sparkles, Wallet, Zap } from "lucide-react";
import Button from "@/components/ui/Button";
import Logo from "@/components/ui/Logo";
import Tag from "@/components/ui/Tag";
import { useToast } from "@/components/ui/Toast";
import { useAccount } from "@/components/account/AccountProvider";
import { pullTiers, usd, type Pack } from "@/lib/data";
import type { VaultItem } from "@/lib/account";

// Demo pack opening. Pulls are drawn locally, weighted by the tier odds the
// site lists, and land in the demo vault. Replace `drawPull` with the
// server's provably-fair result when packs can really be bought.

type Phase = "ready" | "ripping" | "reveal" | "summary";
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

function PackArt({ pack, open }: { pack: Pack; open: boolean }) {
  return (
    <div className={`media media-rip relative aspect-square w-full overflow-hidden rounded-lg border border-line ${open ? "rip-open" : ""}`}>
      <Image src={pack.image} alt={pack.name} fill priority sizes="360px" className="object-cover" />
      <div className="rip-gap" aria-hidden />
      <div className="rip-flap-shadow" aria-hidden>
        <div className="rip-flap">
          <Image src={pack.image} alt="" fill sizes="360px" className="object-cover" />
        </div>
      </div>
      <div className="rip-line" aria-hidden>
        <Scissors className="rip-scissors" strokeWidth={2} />
      </div>
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
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  const current = pulls[index];
  const canAfford = state.balance >= pack.price;
  const glow = phase === "reveal" && flipped && current ? tierStyle[current.tier].color : "117,251,181";

  const rip = () => {
    if (!canAfford || phase !== "ready") return;
    const pull = drawPull(pack);
    dispatch({ type: "rip", pack: pack.name, price: pack.price, items: [pull] });
    setPulls((p) => [...p.slice(0, index), pull]);
    setFlipped(false);
    setPhase("ripping");
    timer.current = setTimeout(() => setPhase("reveal"), 1700);
  };

  const next = () => {
    if (index + 1 < qty) {
      setIndex(index + 1);
      setFlipped(false);
      setPhase("ready");
    } else setPhase("summary");
  };

  const restart = () => {
    setPulls([]);
    setIndex(0);
    setFlipped(false);
    setPhase("ready");
  };

  // Summary: which of this session's pulls are still sitting in the vault
  const stillInVault = pulls.filter((p) => state.vault.some((v) => v.id === p.id && v.status === "vault"));
  const totalValue = pulls.reduce((n, p) => n + p.value, 0);
  const sellable = stillInVault.reduce((n, p) => n + p.buyback, 0);

  return (
    <section className="relative flex min-h-[calc(100svh-var(--topbar-h)-36px)] flex-col overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 transition-[background] duration-slow"
        style={{ background: `radial-gradient(ellipse 55% 60% at 50% 48%, rgba(${glow},0.16), transparent 70%)` }}
        aria-hidden
      />
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-40" aria-hidden />

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

      <div className="frame relative flex flex-1 flex-col items-center justify-center py-12">
        {/* READY / RIPPING */}
        {(phase === "ready" || phase === "ripping") && (
          <div key={`pack-${index}`} className="step-in flex w-full max-w-[360px] flex-col items-center" style={{ "--dir": 1 } as React.CSSProperties}>
            <div className={`relative w-[min(78vw,340px)] ${phase === "ready" ? "rip-pack-idle" : "rip-shake"}`}>
              <div className={phase === "ripping" ? "" : "transition-transform duration-slow hover:scale-[1.02]"}>
                <PackArt pack={pack} open={phase === "ripping"} />
              </div>
              {phase === "ripping" && (
                <div className="rip-burst pointer-events-none absolute inset-[-40%] rounded-full" style={{ background: "radial-gradient(circle, rgba(255,255,255,0.9), rgba(117,251,181,0.55) 25%, transparent 60%)", animationDelay: "1250ms" }} aria-hidden />
              )}
            </div>

            <div className={`mt-10 text-center transition-opacity duration-base ${phase === "ripping" ? "opacity-0" : "opacity-100"}`}>
              <div className="flex justify-center gap-2">
                <Tag tone={pack.tier.toLowerCase() as "silver" | "gold" | "platinum"}>{pack.tier}</Tag>
                <Tag>{pack.categoryLabel}</Tag>
              </div>
              <h1 className="mt-4 text-[clamp(1.75rem,4vw,2.75rem)] font-bold leading-none tracking-[-0.045em]">{pack.name}</h1>
              <p className="mt-2 font-mono text-lg tabular-nums text-accent">{usd(pack.price, true)}</p>

              {hydrated && !canAfford ? (
                <div className="mt-8 rounded-md border border-line-strong bg-ink-1 p-5 text-sm text-fg-muted">
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
                <Button size="lg" magnetic arrow className="mt-8 min-w-[220px]" onClick={rip}>
                  Rip it open
                </Button>
              )}
              <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.14em] text-fg-dim">Demo pull · no real charge</p>
            </div>
          </div>
        )}

        {/* REVEAL */}
        {phase === "reveal" && current && (
          <div key={`reveal-${index}`} className="flex w-full flex-col items-center">
            <div className="card-rise relative [perspective:1400px]">
              {flipped && current.tier === "Grail" && (
                <div className="spark-ring pointer-events-none absolute inset-0" aria-hidden>
                  {Array.from({ length: 14 }, (_, i) => (
                    <span key={i} style={{ "--a": `${(360 / 14) * i}deg`, "--d": `${150 + (i % 3) * 40}px` } as React.CSSProperties} />
                  ))}
                </div>
              )}
              <button
                type="button"
                onClick={() => setFlipped(true)}
                disabled={flipped}
                aria-label={flipped ? `${current.name}, ${current.grade}` : "Flip card to reveal"}
                className={`card-flip relative block aspect-[147/250] w-[min(62vw,250px)] ${flipped ? "is-flipped" : "card-hint cursor-pointer"}`}
              >
                <span className="card-face card-back-pattern grid place-items-center overflow-hidden rounded-md border border-accent/40 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9)]">
                  <span className="flex flex-col items-center gap-4">
                    <Logo link={false} className="h-8 w-auto" />
                    <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-fg-muted">Tap to reveal</span>
                  </span>
                </span>
                <span
                  className="card-face card-face-front"
                  style={{ filter: `drop-shadow(0 0 40px rgba(${tierStyle[current.tier].color},0.45)) drop-shadow(0 30px 40px rgba(0,0,0,0.8))` }}
                >
                  <Image src={current.image} alt="" fill sizes="260px" className="object-contain" />
                </span>
              </button>
            </div>

            {flipped ? (
              <div className="reveal-in mt-10 text-center">
                <span
                  className="inline-flex h-7 items-center gap-1.5 rounded-[6px] px-2.5 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-black"
                  style={{ background: `rgb(${tierStyle[current.tier].color})` }}
                >
                  {current.tier === "Grail" && <Sparkles className="h-3.5 w-3.5" />}
                  {tierStyle[current.tier].label} pull
                </span>
                <h2 className="mt-4 text-[clamp(2rem,5vw,3.5rem)] font-bold leading-none tracking-[-0.05em]">{current.name}</h2>
                <p className="mt-2 text-fg-muted">
                  {current.grade} · est. <span className="font-mono text-fg">{usd(current.value)}</span> · buyback{" "}
                  <span className="font-mono text-accent">{usd(current.buyback)}</span>
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-3">
                  <Button size="lg" arrow magnetic onClick={next}>
                    {index + 1 < qty ? `Rip pack ${index + 2} of ${qty}` : qty > 1 ? "See results" : "Done"}
                  </Button>
                </div>
                <p className="mt-4 text-xs text-fg-dim">Saved to your vault</p>
              </div>
            ) : (
              <p className="mt-10 animate-pulse font-mono text-[11px] uppercase tracking-[0.16em] text-fg-muted">Tap the card</p>
            )}
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
