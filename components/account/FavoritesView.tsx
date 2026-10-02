"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import Button from "@/components/ui/Button";
import PackCard from "@/components/cards/PackCard";
import ListingCard from "@/components/cards/ListingCard";
import { useAccount } from "./AccountProvider";
import { EmptyState } from "./AccountShell";
import { getPack, listings } from "@/lib/data";

export default function FavoritesView() {
  const { state } = useAccount();
  const [tab, setTab] = useState<"packs" | "listings">("packs");

  const packs = state.favorites.packs.map(getPack).filter(Boolean) as NonNullable<ReturnType<typeof getPack>>[];
  const items = state.favorites.listings.map((id) => listings.find((l) => l.id === id)).filter(Boolean) as (typeof listings)[number][];

  return (
    <>
      <div className="mb-8 flex h-11 w-fit rounded-sm border border-line-strong p-1" role="tablist" aria-label="Favorites">
        {(
          [
            ["packs", "Packs", packs.length],
            ["listings", "Marketplace", items.length],
          ] as const
        ).map(([k, label, n]) => (
          <button
            key={k}
            role="tab"
            aria-selected={tab === k}
            onClick={() => setTab(k)}
            className={`flex items-center gap-2 rounded-[6px] px-4 text-[13px] font-medium transition-colors ${tab === k ? "bg-accent text-accent-ink" : "text-fg-muted hover:text-fg"}`}
          >
            {label} <span className={`font-mono text-[10px] ${tab === k ? "" : "text-fg-dim"}`}>{n}</span>
          </button>
        ))}
      </div>

      {tab === "packs" ? (
        packs.length ? (
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-6 xl:grid-cols-4">
            {packs.map((p) => (
              <PackCard key={p.name} pack={p} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<Heart className="h-6 w-6" />}
            title="No saved packs"
            body="Tap Save on any pack to keep it here for your next rip."
            action={<Button href="/pack" arrow>Browse packs</Button>}
          />
        )
      ) : items.length ? (
        <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-6 xl:grid-cols-4">
          {items.map((l) => (
            <ListingCard key={l.id} item={l} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<Heart className="h-6 w-6" />}
          title="No saved cards"
          body="Save Marketplace listings to watch their price and bids."
          action={<Button href="/marketplace" arrow>Browse Marketplace</Button>}
        />
      )}
    </>
  );
}
