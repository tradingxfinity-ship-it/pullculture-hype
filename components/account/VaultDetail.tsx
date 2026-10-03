"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { Package, Store, Undo2, X, Zap } from "lucide-react";
import PriceChart from "@/components/ui/PriceChart";
import { useAccount } from "./AccountProvider";
import { StatusChip } from "./AccountShell";
import { fmtDate, priceHistory, sampleComps, type VaultItem } from "@/lib/account";
import { usd } from "@/lib/data";

const ranges = [
  { key: "1M", days: 30 },
  { key: "3M", days: 90 },
  { key: "6M", days: 180 },
  { key: "1Y", days: 365 },
] as const;

/**
 * Slide-in detail panel for a vault card: the slab, its facts, a value chart
 * with ranges, recent comparable sales and the same actions as the card.
 * Price data is a seeded sample until real market data is connected.
 */
export default function VaultDetail({
  id,
  onClose,
  onAction,
}: {
  id: string | null;
  onClose: () => void;
  onAction: (a: "sell" | "list" | "ship" | "unlist", item: VaultItem) => void;
}) {
  const { state } = useAccount();
  const item = state.vault.find((v) => v.id === id) ?? null;
  const [range, setRange] = useState<(typeof ranges)[number]["key"]>("3M");
  const closeRef = useRef<HTMLButtonElement>(null);
  const open = !!item;

  // Close automatically if the card leaves the vault (e.g. sold back).
  useEffect(() => {
    if (id && !item) onClose();
  }, [id, item, onClose]);

  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    document.documentElement.style.overflow = "hidden";
    const t = setTimeout(() => closeRef.current?.focus(), 50);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t);
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      prev?.focus?.();
    };
  }, [open, onClose]);

  const history = useMemo(() => (item ? priceHistory(item) : []), [item]);
  const comps = useMemo(() => (item ? sampleComps(item, history) : []), [item, history]);
  const days = ranges.find((r) => r.key === range)!.days;
  const slice = useMemo(() => history.slice(-days), [history, days]);

  const act = (a: "sell" | "list" | "ship" | "unlist") => {
    if (!item) return;
    onClose();
    onAction(a, item);
  };

  if (!item) return null;
  const locked = item.status === "shipping";
  const hi = Math.max(...history.map((p) => p.value));
  const lo = Math.min(...history.map((p) => p.value));

  return (
    <div className="fixed inset-0 z-[60]">
      <div onClick={onClose} className="modal-fade absolute inset-0 bg-black/75 backdrop-blur-md" />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={`${item.name} details`}
        className="drawer-in absolute inset-y-0 right-0 flex w-full max-w-[720px] flex-col border-l border-line bg-ink-1"
      >
        <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-4 sm:px-8">
          <div className="flex items-center gap-3">
            <StatusChip status={item.status} />
            <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-fg-dim">Vault card</span>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close details"
            className="grid h-9 w-9 place-items-center rounded-sm border border-line-strong text-fg transition-colors hover:border-accent hover:text-accent"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Hero */}
          <section className="grid gap-6 px-5 py-8 sm:grid-cols-[200px_1fr] sm:px-8">
            <div className="relative mx-auto aspect-[147/250] w-[160px] sm:w-full">
              <div className="glow absolute inset-[-20%]" aria-hidden />
              <Image src={item.image} alt={`${item.name} ${item.grade}`} fill sizes="200px" className="object-contain drop-shadow-[0_24px_30px_rgba(0,0,0,0.8)]" />
            </div>
            <div className="flex flex-col">
              <p className="eyebrow">{item.grade}</p>
              <h2 className="mt-2 text-[clamp(1.75rem,4vw,2.5rem)] font-bold leading-[1] tracking-[-0.04em]">{item.name}</h2>
              <p className="mt-2 text-fg-muted">{item.set}</p>

              <dl className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-md border border-line bg-line">
                {[
                  ["Est. value", usd(item.value), "text-fg"],
                  ["Instant buyback", usd(item.buyback), "text-accent"],
                  [item.status === "listed" ? "Listed at" : "1Y range", item.status === "listed" && item.listPrice ? usd(item.listPrice) : `${usd(lo)}–${usd(hi)}`, "text-fg"],
                  ["Pulled", fmtDate(item.pulledAt), "text-fg"],
                ].map(([k, v, c]) => (
                  <div key={k} className="bg-ink-1 p-3.5">
                    <dt className="text-[11px] text-fg-dim">{k}</dt>
                    <dd className={`mt-0.5 font-mono tabular-nums ${c}`}>{v}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-3 text-xs text-fg-dim">
                From a{" "}
                <Link href={`/pack/product/${encodeURIComponent(item.pack)}`} onClick={onClose} className="text-fg-muted underline-offset-4 hover:text-accent hover:underline">
                  {item.pack}
                </Link>
              </p>
            </div>
          </section>

          {/* Chart */}
          <section className="border-t border-line px-5 py-8 sm:px-8">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-xl font-bold tracking-[-0.03em]">Price history</h3>
              <div className="flex rounded-sm border border-line-strong p-0.5" role="tablist" aria-label="Time range">
                {ranges.map((r) => (
                  <button
                    key={r.key}
                    type="button"
                    role="tab"
                    aria-selected={range === r.key}
                    onClick={() => setRange(r.key)}
                    className={`rounded-[5px] px-3 py-1 font-mono text-[12px] transition-colors ${range === r.key ? "bg-accent text-accent-ink" : "text-fg-muted hover:text-fg"}`}
                  >
                    {r.key}
                  </button>
                ))}
              </div>
            </div>
            <PriceChart key={range} points={slice} label={`Estimated value of ${item.name}, last ${range}`} />
            <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.12em] text-fg-dim">Sample data · market pricing not connected yet</p>
          </section>

          {/* Comps */}
          <section className="border-t border-line px-5 py-8 sm:px-8">
            <h3 className="mb-4 text-xl font-bold tracking-[-0.03em]">Recent comparable sales</h3>
            <ul className="divide-y divide-line rounded-md border border-line">
              {comps.map((c, i) => (
                <li key={i} className="flex items-center justify-between gap-4 px-4 py-3 text-sm">
                  <span className="text-fg-2">{fmtDate(c.date)}</span>
                  <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-fg-dim">{c.grade}</span>
                  <span className="font-mono tabular-nums text-fg">{usd(c.price)}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-3 gap-2 border-t border-line p-4 sm:px-8">
          {locked ? (
            <Link
              href="/account/orders"
              onClick={onClose}
              className="col-span-3 flex h-12 items-center justify-center gap-2 rounded-sm border border-line-strong text-sm font-semibold text-fg-muted transition-colors hover:border-accent hover:text-accent"
            >
              <Package className="h-4 w-4" /> Track shipment
            </Link>
          ) : (
            <>
              <button
                type="button"
                onClick={() => act("sell")}
                className="flex h-12 items-center justify-center gap-2 rounded-sm bg-accent text-sm font-semibold text-accent-ink transition-shadow hover:shadow-[0_8px_24px_-6px_rgba(117,251,181,0.6)]"
              >
                <Zap className="h-4 w-4" /> Sell back
              </button>
              {item.status === "listed" ? (
                <button type="button" onClick={() => act("unlist")} className="flex h-12 items-center justify-center gap-2 rounded-sm border border-line-strong text-sm font-semibold text-fg transition-colors hover:border-accent hover:text-accent">
                  <Undo2 className="h-4 w-4" /> Unlist
                </button>
              ) : (
                <button type="button" onClick={() => act("list")} className="flex h-12 items-center justify-center gap-2 rounded-sm border border-line-strong text-sm font-semibold text-fg transition-colors hover:border-accent hover:text-accent">
                  <Store className="h-4 w-4" /> List
                </button>
              )}
              <button
                type="button"
                onClick={() => act("ship")}
                disabled={item.status === "listed"}
                title={item.status === "listed" ? "Unlist the card before shipping it" : undefined}
                className="flex h-12 items-center justify-center gap-2 rounded-sm border border-line-strong text-sm font-semibold text-fg transition-colors hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-35"
              >
                <Package className="h-4 w-4" /> Ship
              </button>
            </>
          )}
        </div>
      </aside>
    </div>
  );
}
