"use client";

import { useEffect, useMemo, useState } from "react";
import { Archive, ArrowDownUp, Package, Search, X, Zap } from "lucide-react";
import Button from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";
import { useToast } from "@/components/ui/Toast";
import { useAccount } from "./AccountProvider";
import { EmptyState } from "./AccountShell";
import { VaultActionModals, VaultCard, type PendingAction } from "./VaultActions";
import { usd } from "@/lib/data";
import type { VaultItem, VaultStatus } from "@/lib/account";

const filters: { key: "all" | VaultStatus; label: string }[] = [
  { key: "all", label: "All" },
  { key: "vault", label: "In vault" },
  { key: "listed", label: "Listed" },
  { key: "shipping", label: "Shipping" },
];
const sorts = [
  { key: "new", label: "Newest" },
  { key: "high", label: "Value: high to low" },
  { key: "low", label: "Value: low to high" },
] as const;

export default function VaultView() {
  const { state, dispatch } = useAccount();
  const toast = useToast();
  const [filter, setFilter] = useState<(typeof filters)[number]["key"]>("all");
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<(typeof sorts)[number]["key"]>("new");
  const [selected, setSelected] = useState<string[]>([]);
  const [pending, setPending] = useState<PendingAction>(null);

  const items = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return state.vault
      .filter((v) => filter === "all" || v.status === filter)
      .filter((v) => !needle || `${v.name} ${v.set} ${v.grade} ${v.pack}`.toLowerCase().includes(needle))
      .sort((a, b) => (sort === "new" ? b.pulledAt.localeCompare(a.pulledAt) : sort === "high" ? b.value - a.value : a.value - b.value));
  }, [state.vault, filter, q, sort]);

  const count = (k: (typeof filters)[number]["key"]) => (k === "all" ? state.vault.length : state.vault.filter((v) => v.status === k).length);
  const sel = state.vault.filter((v) => selected.includes(v.id));
  const shippable = sel.filter((v) => v.status === "vault");

  const onAction = (a: "sell" | "list" | "ship" | "unlist", item: VaultItem) => {
    if (a === "unlist") {
      dispatch({ type: "unlist", id: item.id });
      toast(`${item.name} is back in your vault.`, "info");
      return;
    }
    setPending({ kind: a, items: [item] });
  };

  // Drop selections that were sold or sent to shipping.
  useEffect(() => {
    setSelected((s) => s.filter((id) => state.vault.some((v) => v.id === id && v.status !== "shipping")));
  }, [state.vault]);

  const toggle = (id: string) => setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  return (
    <>
      {/* Toolbar */}
      <div className="mb-8 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="no-scrollbar -mx-gutter flex overflow-x-auto px-gutter">
          <div className="flex h-11 rounded-sm border border-line-strong p-1" role="tablist" aria-label="Filter vault">
            {filters.map((f) => (
              <button
                key={f.key}
                role="tab"
                aria-selected={filter === f.key}
                onClick={() => setFilter(f.key)}
                className={`flex items-center gap-2 whitespace-nowrap rounded-[6px] px-3.5 text-[13px] font-medium transition-colors ${
                  filter === f.key ? "bg-accent text-accent-ink" : "text-fg-muted hover:text-fg"
                }`}
              >
                {f.label}
                <span className={`font-mono text-[10px] ${filter === f.key ? "" : "text-fg-dim"}`}>{count(f.key)}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="flex gap-2">
          <label className="group flex h-11 flex-1 items-center rounded-sm border border-line-strong bg-ink-2 px-3.5 transition-colors focus-within:border-accent lg:w-64 lg:flex-none">
            <Search className="h-4 w-4 text-fg-dim group-focus-within:text-accent" />
            <span className="sr-only">Search vault</span>
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search your vault…" className="h-full flex-1 bg-transparent px-3 text-sm text-fg outline-none placeholder:text-fg-dim" />
            {q && (
              <button type="button" aria-label="Clear search" onClick={() => setQ("")} className="text-fg-dim hover:text-fg">
                <X className="h-4 w-4" />
              </button>
            )}
          </label>
          <label className="relative flex h-11 items-center rounded-sm border border-line-strong px-3 text-[13px] text-fg">
            <ArrowDownUp className="pointer-events-none h-4 w-4" />
            <span className="sr-only">Sort</span>
            <select value={sort} onChange={(e) => setSort(e.target.value as typeof sort)} className="h-full appearance-none bg-transparent pl-2 pr-1 outline-none">
              {sorts.map((s) => (
                <option key={s.key} value={s.key} className="bg-ink-2">
                  {s.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {items.length ? (
        <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-6 xl:grid-cols-4">
          {items.map((v, i) => (
            <Reveal key={v.id} delay={(i % 4) * 60}>
              <VaultCard item={v} selected={selected.includes(v.id)} onSelect={() => toggle(v.id)} onAction={onAction} />
            </Reveal>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<Archive className="h-6 w-6" />}
          title={state.vault.length ? "Nothing matches" : "Your vault is empty"}
          body={state.vault.length ? "Try another filter or search." : "Every card you pull lands here. Rip a pack to start your collection."}
          action={!state.vault.length && <Button href="/pack" arrow>Rip a pack</Button>}
        />
      )}

      {/* Bulk action bar */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-30 border-t border-line bg-black/85 backdrop-blur-xl transition-transform duration-slow ease-out lg:left-rail ${
          sel.length ? "translate-y-0" : "translate-y-full"
        }`}
        aria-hidden={!sel.length}
      >
        <div className="frame flex h-[72px] items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            <button type="button" onClick={() => setSelected([])} aria-label="Clear selection" className="grid h-9 w-9 place-items-center rounded-sm border border-line-strong text-fg-muted hover:text-fg">
              <X className="h-4 w-4" />
            </button>
            <p className="text-sm">
              <span className="font-semibold text-fg">{sel.length} selected</span>
              <span className="hidden text-fg-muted sm:inline"> · buyback {usd(sel.reduce((n, v) => n + v.buyback, 0))}</span>
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              disabled={!shippable.length}
              tabIndex={sel.length ? 0 : -1}
              onClick={() => setPending({ kind: "ship", items: shippable })}
            >
              <Package className="h-4 w-4" /> Ship{shippable.length && shippable.length !== sel.length ? ` ${shippable.length}` : ""}
            </Button>
            <Button size="sm" tabIndex={sel.length ? 0 : -1} onClick={() => setPending({ kind: "sell", items: sel })}>
              <Zap className="h-4 w-4" /> Sell back
            </Button>
          </div>
        </div>
      </div>

      <VaultActionModals pending={pending} onDone={() => setPending(null)} />
    </>
  );
}
