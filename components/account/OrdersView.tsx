"use client";

import Image from "next/image";
import { useState } from "react";
import { Check as CheckIcon, Copy, Package, Truck } from "lucide-react";
import Button from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { useAccount } from "./AccountProvider";
import { EmptyState, StatusChip } from "./AccountShell";
import { fmtDate, orderSteps, type OrderStatus } from "@/lib/account";

export function OrderTimeline({ status }: { status: OrderStatus }) {
  const at = orderSteps.findIndex((s) => s.key === status);
  return (
    <ol className="grid grid-cols-4">
      {orderSteps.map((s, i) => {
        const done = i <= at;
        return (
          <li key={s.key} className="relative">
            {i > 0 && <span className={`absolute right-1/2 top-[11px] h-[2px] w-full ${i <= at ? "bg-accent" : "bg-line"}`} aria-hidden />}
            <div className="relative flex flex-col items-center gap-2 text-center">
              <span
                className={`grid h-6 w-6 place-items-center rounded-full border-2 ${
                  i === at && status !== "delivered" ? "border-accent bg-ink-0 shadow-[0_0_0_4px_rgba(117,251,181,0.15)]" : done ? "border-accent bg-accent text-accent-ink" : "border-line-strong bg-ink-0"
                }`}
              >
                {done && !(i === at && status !== "delivered") && <CheckIcon className="h-3 w-3" strokeWidth={3} />}
                {i === at && status !== "delivered" && <span className="h-2 w-2 animate-pulse-dot rounded-full bg-accent" />}
              </span>
              <span className={`font-mono text-[10px] uppercase tracking-[0.1em] ${done ? "text-fg" : "text-fg-dim"}`}>{s.label}</span>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

const filters = [
  { key: "all", label: "All" },
  { key: "active", label: "In progress" },
  { key: "delivered", label: "Delivered" },
] as const;

export default function OrdersView() {
  const { state } = useAccount();
  const toast = useToast();
  const [filter, setFilter] = useState<(typeof filters)[number]["key"]>("all");

  const orders = state.orders.filter((o) => filter === "all" || (filter === "delivered" ? o.status === "delivered" : o.status !== "delivered"));

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast("Tracking number copied.", "info");
    } catch {
      toast("Couldn’t copy — select the number to copy it.", "info");
    }
  };

  return (
    <>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex h-11 rounded-sm border border-line-strong p-1" role="tablist" aria-label="Filter orders">
          {filters.map((f) => (
            <button
              key={f.key}
              role="tab"
              aria-selected={filter === f.key}
              onClick={() => setFilter(f.key)}
              className={`rounded-[6px] px-4 text-[13px] font-medium transition-colors ${filter === f.key ? "bg-accent text-accent-ink" : "text-fg-muted hover:text-fg"}`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <Button href="/account/vault" variant="secondary" size="sm">
          <Package className="h-4 w-4" /> Ship more cards
        </Button>
      </div>

      {orders.length ? (
        <ul className="space-y-4">
          {orders.map((o) => (
            <li key={o.id} className="rounded-md border border-line bg-ink-1 p-5 md:p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <p className="font-mono text-lg tabular-nums text-fg">{o.id}</p>
                    <StatusChip status={o.status} />
                  </div>
                  <p className="mt-1 text-sm text-fg-muted">
                    {o.kind === "shipment" ? "Vault withdrawal" : "Marketplace purchase"} · {fmtDate(o.date)} · {o.items.length} item{o.items.length > 1 ? "s" : ""}
                  </p>
                </div>
                <div className="flex -space-x-3">
                  {o.items.slice(0, 4).map((it, i) => (
                    <div key={i} className="relative h-14 w-10 rounded-[4px] bg-ink-3 ring-2 ring-ink-1">
                      <Image src={it.image} alt="" fill sizes="40px" className="object-contain" />
                    </div>
                  ))}
                </div>
              </div>

              <ul className="mt-4 flex flex-wrap gap-2">
                {o.items.map((it, i) => (
                  <li key={i} className="rounded-[6px] border border-line px-2.5 py-1 text-xs text-fg-2">
                    {it.name}
                  </li>
                ))}
              </ul>

              <div className="mt-6">
                <OrderTimeline status={o.status} />
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4 text-sm">
                {o.tracking ? (
                  <p className="flex items-center gap-2 text-fg-muted">
                    <Truck className="h-4 w-4 text-accent" />
                    {o.carrier} <span className="select-all font-mono text-fg">{o.tracking}</span>
                    <button type="button" onClick={() => copy(o.tracking!)} aria-label="Copy tracking number" className="text-fg-dim transition-colors hover:text-accent">
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                  </p>
                ) : (
                  <p className="text-fg-muted">Tracking appears here once your package ships. Shipping typically takes 2–4 weeks from withdrawal.</p>
                )}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState
          icon={<Package className="h-6 w-6" />}
          title="No orders here"
          body="Ship cards from your vault and they’ll show up here with tracking."
          action={<Button href="/account/vault" arrow>Go to vault</Button>}
        />
      )}
    </>
  );
}
