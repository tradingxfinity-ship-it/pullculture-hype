"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Check as CheckIcon, MapPin, Package, Store, Undo2, Zap } from "lucide-react";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { Field, Input } from "@/components/ui/Form";
import { useToast } from "@/components/ui/Toast";
import { useAccount } from "./AccountProvider";
import { StatusChip } from "./AccountShell";
import { fmtDate, type VaultItem } from "@/lib/account";
import { usd } from "@/lib/data";

/* ------------------------------------------------------------------ */
/* Vault card                                                          */
/* ------------------------------------------------------------------ */

export function VaultCard({
  item,
  selected,
  onSelect,
  onAction,
}: {
  item: VaultItem;
  selected?: boolean;
  onSelect?: () => void;
  onAction: (a: "sell" | "list" | "ship" | "unlist", item: VaultItem) => void;
}) {
  const locked = item.status === "shipping";
  return (
    <article className={`group flex flex-col rounded-md transition-shadow ${selected ? "shadow-[0_0_0_2px_var(--accent)]" : ""}`}>
      <div className="slab-stage media relative aspect-[4/5] rounded-md border border-line bg-gradient-to-b from-ink-4 to-ink-2">
        <div className="slab-floor" aria-hidden />
        <div className="slab">
          <Image src={item.image} alt={`${item.name} ${item.grade}`} fill sizes="(min-width:1024px) 22vw, 45vw" className="object-contain" />
          <div className="slab-sweep" style={{ maskImage: `url(${item.image})`, WebkitMaskImage: `url(${item.image})` }} aria-hidden />
        </div>
        <div className="absolute inset-x-3 top-3 z-[2] flex items-center justify-between">
          {onSelect && !locked ? (
            <button
              type="button"
              onClick={onSelect}
              aria-pressed={selected}
              aria-label={selected ? `Deselect ${item.name}` : `Select ${item.name}`}
              className={`grid h-7 w-7 place-items-center rounded-[6px] border transition-colors ${
                selected ? "border-accent bg-accent text-accent-ink" : "border-line-strong bg-black/50 text-transparent hover:border-accent"
              }`}
            >
              <CheckIcon className="h-4 w-4" strokeWidth={3} />
            </button>
          ) : (
            <span />
          )}
          <StatusChip status={item.status} />
        </div>
      </div>

      <div className="flex flex-1 flex-col pt-4">
        <p className="eyebrow truncate">
          {item.grade} · {fmtDate(item.pulledAt)}
        </p>
        <h3 className="mt-1.5 truncate text-[17px] font-semibold tracking-[-0.02em] text-fg">{item.name}</h3>
        <p className="truncate text-[13px] text-fg-muted">{item.set}</p>

        <dl className="mt-4 grid grid-cols-2 border-t border-line pt-3">
          <div>
            <dt className="text-[11px] text-fg-dim">{item.status === "listed" ? "Listed at" : "Value"}</dt>
            <dd className="font-mono tabular-nums text-fg">{usd(item.status === "listed" && item.listPrice ? item.listPrice : item.value)}</dd>
          </div>
          <div className="text-right">
            <dt className="text-[11px] text-fg-dim">Instant buyback</dt>
            <dd className="font-mono tabular-nums text-accent">{usd(item.buyback)}</dd>
          </div>
        </dl>

        <div className="mt-3 grid grid-cols-3 gap-1.5">
          {locked ? (
            <Link
              href="/account/orders"
              className="col-span-3 flex h-9 items-center justify-center gap-1.5 rounded-sm border border-line-strong text-[12px] font-semibold text-fg-muted transition-colors hover:border-accent hover:text-accent"
            >
              <Package className="h-3.5 w-3.5" /> Track shipment
            </Link>
          ) : (
            <>
              <ActionBtn icon={<Zap className="h-3.5 w-3.5" />} label="Sell back" onClick={() => onAction("sell", item)} primary />
              {item.status === "listed" ? (
                <ActionBtn icon={<Undo2 className="h-3.5 w-3.5" />} label="Unlist" onClick={() => onAction("unlist", item)} />
              ) : (
                <ActionBtn icon={<Store className="h-3.5 w-3.5" />} label="List" onClick={() => onAction("list", item)} />
              )}
              <ActionBtn icon={<Package className="h-3.5 w-3.5" />} label="Ship" onClick={() => onAction("ship", item)} disabled={item.status === "listed"} />
            </>
          )}
        </div>
      </div>
    </article>
  );
}

function ActionBtn({ icon, label, onClick, primary, disabled }: { icon: React.ReactNode; label: string; onClick: () => void; primary?: boolean; disabled?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={disabled ? "Unlist the card before shipping it" : undefined}
      className={`flex h-9 items-center justify-center gap-1.5 rounded-sm text-[12px] font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-35 ${
        primary ? "bg-accent text-accent-ink hover:shadow-[0_6px_20px_-6px_rgba(117,251,181,0.6)]" : "border border-line-strong text-fg hover:border-accent hover:text-accent"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Action modals                                                       */
/* ------------------------------------------------------------------ */

function MiniList({ items, price }: { items: VaultItem[]; price: (v: VaultItem) => number }) {
  return (
    <ul className="max-h-[260px] divide-y divide-line overflow-y-auto rounded-md border border-line">
      {items.map((v) => (
        <li key={v.id} className="flex items-center gap-3 p-3">
          <div className="relative h-12 w-9 shrink-0">
            <Image src={v.image} alt="" fill sizes="36px" className="object-contain" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-fg">{v.name}</p>
            <p className="truncate text-xs text-fg-dim">{v.grade}</p>
          </div>
          <span className="font-mono text-sm tabular-nums text-fg">{usd(price(v))}</span>
        </li>
      ))}
    </ul>
  );
}

export type PendingAction = { kind: "sell" | "list" | "ship"; items: VaultItem[] } | null;

export function VaultActionModals({ pending, onDone }: { pending: PendingAction; onDone: () => void }) {
  const { state, dispatch } = useAccount();
  const toast = useToast();
  const [price, setPrice] = useState("");
  const [addressId, setAddressId] = useState<string | null>(null);

  const items = pending?.items ?? [];
  const totalBuyback = items.reduce((n, v) => n + v.buyback, 0);
  const defaultAddress = state.addresses.find((a) => a.isDefault) ?? state.addresses[0];
  const chosenAddress = state.addresses.find((a) => a.id === (addressId ?? defaultAddress?.id));

  const close = () => {
    setPrice("");
    setAddressId(null);
    onDone();
  };

  return (
    <>
      <Modal
        open={pending?.kind === "sell"}
        onClose={close}
        title="Sell back instantly"
        description={items.length > 1 ? `${items.length} cards go straight to your balance.` : "The buyback amount goes straight to your balance."}
      >
        <MiniList items={items} price={(v) => v.buyback} />
        <div className="mt-4 flex items-center justify-between rounded-md border border-accent/30 bg-accent/[0.06] p-4">
          <span className="eyebrow">You receive</span>
          <span className="font-mono text-2xl tabular-nums text-accent">{usd(totalBuyback, true)}</span>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-3">
          <Button variant="secondary" size="md" onClick={close}>
            Keep {items.length > 1 ? "them" : "it"}
          </Button>
          <Button
            size="md"
            onClick={() => {
              dispatch({ type: "sellBack", ids: items.map((v) => v.id) });
              toast(`Sold back ${items.length > 1 ? `${items.length} cards` : items[0]?.name} for ${usd(totalBuyback, true)}. Balance updated.`);
              close();
            }}
          >
            Sell back
          </Button>
        </div>
      </Modal>

      <Modal open={pending?.kind === "list"} onClose={close} title="List on the Marketplace" description={items[0] ? `${items[0].name} · ${items[0].grade}` : undefined}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const n = Math.round(Number(price || items[0]?.value));
            if (!items[0] || !(n > 0)) return;
            dispatch({ type: "list", id: items[0].id, price: n });
            toast(`${items[0].name} listed for ${usd(n)}.`);
            close();
          }}
        >
          <Field label="Asking price" hint={items[0] ? `Est. value ${usd(items[0].value)}` : undefined}>
            <div className="relative">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 font-mono text-fg-dim">$</span>
              <Input
                type="number"
                min={1}
                step={1}
                inputMode="numeric"
                required
                value={price}
                placeholder={items[0] ? String(items[0].value) : ""}
                onChange={(e) => setPrice(e.target.value)}
                style={{ paddingLeft: "2rem" }}
              />
            </div>
          </Field>
          <p className="mt-3 text-xs text-fg-dim">Buyers can bid or make offers. You can unlist any time before it sells.</p>
          <div className="mt-6 grid grid-cols-2 gap-3">
            <Button type="button" variant="secondary" size="md" onClick={close}>
              Cancel
            </Button>
            <Button type="submit" size="md">
              List card
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        open={pending?.kind === "ship"}
        onClose={close}
        title={`Ship ${items.length > 1 ? `${items.length} cards` : "to me"}`}
        description="Shipping typically takes 2–4 weeks from withdrawal. Every card is sleeved and packed in a protective bubble mailer."
      >
        <MiniList items={items} price={(v) => v.value} />
        <p className="eyebrow mb-3 mt-6">Ship to</p>
        {state.addresses.length ? (
          <div className="space-y-2">
            {state.addresses.map((a) => {
              const on = chosenAddress?.id === a.id;
              return (
                <label key={a.id} className={`flex cursor-pointer items-start gap-3 rounded-md border p-3 transition-colors ${on ? "border-accent bg-accent/[0.05]" : "border-line-strong hover:border-white/25"}`}>
                  <input type="radio" name="ship-address" className="sr-only" checked={on} onChange={() => setAddressId(a.id)} />
                  <MapPin className={`mt-0.5 h-4 w-4 shrink-0 ${on ? "text-accent" : "text-fg-dim"}`} />
                  <span className="text-sm">
                    <span className="font-semibold text-fg">{a.label}</span>
                    <span className="block text-fg-muted">
                      {a.name}, {a.line1}, {a.city}, {a.region} {a.postal}, {a.country}
                    </span>
                  </span>
                </label>
              );
            })}
          </div>
        ) : (
          <p className="rounded-md border border-line p-4 text-sm text-fg-muted">
            No shipping address yet.{" "}
            <Link href="/account/settings?tab=addresses" onClick={close} className="font-medium text-accent hover:underline">
              Add one in Settings
            </Link>
            .
          </p>
        )}
        <div className="mt-6 grid grid-cols-2 gap-3">
          <Button variant="secondary" size="md" onClick={close}>
            Cancel
          </Button>
          <Button
            size="md"
            disabled={!chosenAddress}
            onClick={() => {
              dispatch({ type: "ship", ids: items.map((v) => v.id) });
              toast(`Shipment created for ${items.length > 1 ? `${items.length} cards` : items[0]?.name}. Track it in Orders.`);
              close();
            }}
          >
            Request shipment
          </Button>
        </div>
      </Modal>
    </>
  );
}
