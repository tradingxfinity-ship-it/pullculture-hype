"use client";

import { useMemo, useState } from "react";
import { ArrowDownUp, Search, SlidersHorizontal, X } from "lucide-react";
import ListingCard from "@/components/cards/ListingCard";
import Reveal from "@/components/ui/Reveal";
import { categories, listings, type Category } from "@/lib/data";

const types = [
  { key: "all", label: "All Cards" },
  { key: "auction", label: "Auctions" },
  { key: "fixed", label: "Fixed Price" },
] as const;

export default function MarketBrowser() {
  const [q, setQ] = useState("");
  const [type, setType] = useState<(typeof types)[number]["key"]>("all");
  const [sort, setSort] = useState<"desc" | "asc">("desc");
  const [cat, setCat] = useState<Category | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const results = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return listings
      .filter((l) => type === "all" || l.type === type)
      .filter((l) => !cat || l.category === cat)
      .filter((l) => !needle || `${l.name} ${l.set} ${l.number}`.toLowerCase().includes(needle))
      .sort((a, b) => (sort === "desc" ? b.price - a.price : a.price - b.price));
  }, [q, type, sort, cat]);

  return (
    <>
      <div className="sticky top-[var(--topbar-h)] z-20 border-b border-line bg-black/80 backdrop-blur-xl">
        <div className="frame flex flex-col gap-3 py-3 lg:flex-row lg:items-center">
          <label className="group relative flex h-11 flex-1 items-center rounded-sm border border-line-strong bg-ink-2 px-3.5 transition-colors focus-within:border-accent">
            <Search className="h-4 w-4 text-fg-dim group-focus-within:text-accent" />
            <span className="sr-only">Search cards</span>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search cards, sets, numbers…"
              className="h-full flex-1 bg-transparent px-3 text-sm text-fg outline-none placeholder:text-fg-dim"
            />
            {q && (
              <button type="button" aria-label="Clear search" onClick={() => setQ("")} className="text-fg-dim hover:text-fg">
                <X className="h-4 w-4" />
              </button>
            )}
          </label>

          <div className="flex items-center gap-2">
            <div className="flex h-11 flex-1 rounded-sm border border-line-strong p-1 lg:flex-none" role="tablist" aria-label="Listing type">
              {types.map((t) => (
                <button
                  key={t.key}
                  role="tab"
                  aria-selected={type === t.key}
                  onClick={() => setType(t.key)}
                  className={`flex-1 whitespace-nowrap rounded-[6px] px-3 text-[13px] font-medium transition-colors duration-fast lg:flex-none ${
                    type === t.key ? "bg-accent text-accent-ink" : "text-fg-muted hover:text-fg"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setFiltersOpen((o) => !o)}
              aria-expanded={filtersOpen}
              className={`flex h-11 items-center gap-2 rounded-sm border px-3.5 text-[13px] font-medium transition-colors ${
                filtersOpen || cat ? "border-accent text-accent" : "border-line-strong text-fg hover:border-fg/60"
              }`}
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span className="hidden sm:inline">Filters</span>
            </button>
            <button
              type="button"
              onClick={() => setSort((s) => (s === "desc" ? "asc" : "desc"))}
              className="flex h-11 items-center gap-2 rounded-sm border border-line-strong px-3.5 text-[13px] font-medium text-fg transition-colors hover:border-fg/60"
            >
              <ArrowDownUp className="h-4 w-4" />
              <span className="hidden sm:inline">{sort === "desc" ? "High to Low" : "Low to High"}</span>
            </button>
          </div>
        </div>

        <div className={`grid transition-[grid-template-rows] duration-base ease-out ${filtersOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
          <div className="overflow-hidden">
            <div className="frame flex flex-wrap items-center gap-2 border-t border-line py-3">
              <span className="eyebrow mr-2">Category</span>
              {[{ slug: null, label: "All" }, ...categories].map((c) => (
                <button
                  key={c.label}
                  type="button"
                  onClick={() => setCat(c.slug as Category | null)}
                  className={`h-8 rounded-[6px] border px-3 text-[13px] transition-colors ${
                    cat === c.slug ? "border-accent bg-accent/10 text-accent" : "border-line-strong text-fg-muted hover:text-fg"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <section className="frame py-12 md:py-16">
        <div className="mb-8 flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.12em] text-fg-dim">
          <span>
            <span className="text-fg">{String(results.length).padStart(2, "0")}</span> results
          </span>
          <span>{types.find((t) => t.key === type)?.label}</span>
        </div>
        {results.length ? (
          <div className="grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-3 md:gap-x-6 xl:grid-cols-4">
            {results.map((l, i) => (
              <Reveal key={l.id} delay={(i % 4) * 60}>
                <ListingCard item={l} />
              </Reveal>
            ))}
          </div>
        ) : (
          <div className="grid place-items-center border border-dashed border-line-strong py-24 text-center">
            <p className="text-2xl font-semibold text-fg">Nothing matches that.</p>
            <p className="mt-2 text-fg-muted">Try a different search or clear your filters.</p>
          </div>
        )}
      </section>
    </>
  );
}
