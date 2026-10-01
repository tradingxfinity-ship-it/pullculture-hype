"use client";

import { useEffect, useRef, useState } from "react";
import { ListChecks, X } from "lucide-react";
import Button from "@/components/ui/Button";
import { pullTiers } from "@/lib/data";

const rows = pullTiers.flatMap((t) => t.cards.map((name) => ({ name, tier: t.name, odds: t.odds })));

// "View Hit List" button + slide-in panel listing every card in the pack.
export default function HitList({ packName }: { packName: string }) {
  const [open, setOpen] = useState(false);
  const [tier, setTier] = useState<string | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    document.documentElement.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const shown = tier ? rows.filter((r) => r.tier === tier) : rows;

  return (
    <>
      <Button variant="secondary" size="md" onClick={() => setOpen(true)} aria-haspopup="dialog">
        <ListChecks className="h-4 w-4" /> View Hit List
      </Button>

      <div className={`fixed inset-0 z-50 text-left ${open ? "visible" : "invisible"}`} role="dialog" aria-modal="true" aria-label={`${packName} hit list`}>
        <div
          onClick={() => setOpen(false)}
          className={`absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-base ${open ? "opacity-100" : "opacity-0"}`}
        />
        <aside
          className={`absolute inset-y-0 right-0 flex w-full max-w-md flex-col border-l border-line bg-ink-1 transition-transform duration-slow ease-out ${
            open ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-start justify-between gap-4 border-b border-line p-6">
            <div>
              <p className="eyebrow text-accent">Hit list</p>
              <h2 className="mt-2 text-2xl font-bold tracking-[-0.03em]">{packName}</h2>
              <p className="mt-1 text-sm text-fg-muted">{rows.length} cards you can pull</p>
            </div>
            <button
              ref={closeRef}
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close hit list"
              className="grid h-9 w-9 shrink-0 place-items-center rounded-sm border border-line-strong text-fg transition-colors hover:border-accent hover:text-accent"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex flex-wrap gap-2 border-b border-line px-6 py-4">
            {[null, ...pullTiers.map((t) => t.name)].map((t) => (
              <button
                key={t ?? "all"}
                type="button"
                onClick={() => setTier(t)}
                aria-pressed={tier === t}
                className={`h-8 rounded-[6px] border px-3 text-[13px] transition-colors ${
                  tier === t ? "border-accent bg-accent/10 text-accent" : "border-line-strong text-fg-muted hover:text-fg"
                }`}
              >
                {t ?? "All"}
              </button>
            ))}
          </div>

          <ol className="flex-1 overflow-y-auto px-6">
            {shown.map((r, i) => (
              <li key={r.name} className="grid grid-cols-[32px_1fr_auto_56px] items-center gap-3 border-b border-line py-3.5">
                <span className="font-mono text-[11px] text-fg-dim">{String(i + 1).padStart(2, "0")}</span>
                <span className="font-medium text-fg">{r.name}</span>
                <span className={`font-mono text-[10px] uppercase tracking-[0.12em] ${r.tier === "Grail" ? "text-accent" : "text-fg-dim"}`}>{r.tier}</span>
                <span className="text-right font-mono text-sm tabular-nums text-fg-2">{r.odds}</span>
              </li>
            ))}
          </ol>

          <p className="border-t border-line px-6 py-4 font-mono text-[11px] uppercase tracking-[0.12em] text-fg-dim">Pull chance shown by tier</p>
        </aside>
      </div>
    </>
  );
}
