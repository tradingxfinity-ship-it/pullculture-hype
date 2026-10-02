"use client";

import { useState } from "react";
import { ArrowDownLeft, ArrowUpRight, Info, Plus, Receipt } from "lucide-react";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { Field, Input } from "@/components/ui/Form";
import { useAccount } from "./AccountProvider";
import { EmptyState, PanelTitle } from "./AccountShell";
import { fmtDate, type TxType } from "@/lib/account";
import { usd } from "@/lib/data";

// Money never moves in the demo: Add funds / Withdraw explain that payments
// aren't connected instead of changing the balance.
const NOT_CONNECTED = "Payments aren’t connected yet — no money moved and your balance hasn’t changed. Card payments will run through Stripe once checkout launches.";

const types: { key: "all" | TxType; label: string }[] = [
  { key: "all", label: "All" },
  { key: "deposit", label: "Deposits" },
  { key: "pack", label: "Packs" },
  { key: "buyback", label: "Buybacks" },
  { key: "sale", label: "Sales" },
  { key: "purchase", label: "Purchases" },
];
const typeLabel: Record<TxType, string> = { deposit: "Deposit", pack: "Pack", buyback: "Buyback", sale: "Sale", purchase: "Purchase", withdrawal: "Withdrawal" };

export default function WalletView() {
  const { state } = useAccount();
  const [filter, setFilter] = useState<(typeof types)[number]["key"]>("all");
  const [modal, setModal] = useState<"add" | "withdraw" | null>(null);
  const [amount, setAmount] = useState("50");
  const [note, setNote] = useState(false);

  const txs = state.transactions.filter((t) => filter === "all" || t.type === filter);
  const moneyIn = state.transactions.filter((t) => t.amount > 0).reduce((n, t) => n + t.amount, 0);
  const moneyOut = state.transactions.filter((t) => t.amount < 0).reduce((n, t) => n - t.amount, 0);

  const close = () => {
    setModal(null);
    setNote(false);
  };

  return (
    <div className="space-y-12">
      {/* Balance */}
      <section className="relative overflow-hidden rounded-lg border border-accent/30 bg-[radial-gradient(ellipse_at_85%_0%,rgba(117,251,181,0.16),transparent_60%)] p-6 md:p-8">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow">Available balance</p>
            <p className="mt-3 font-mono text-[clamp(2.5rem,6vw,4.5rem)] leading-none tabular-nums text-fg">{usd(state.balance, true)}</p>
            <dl className="mt-6 flex gap-8 text-sm">
              <div>
                <dt className="text-fg-dim">Money in</dt>
                <dd className="font-mono tabular-nums text-accent">+{usd(moneyIn, true)}</dd>
              </div>
              <div>
                <dt className="text-fg-dim">Money out</dt>
                <dd className="font-mono tabular-nums text-fg">−{usd(moneyOut, true)}</dd>
              </div>
            </dl>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button size="lg" onClick={() => setModal("add")}>
              <Plus className="h-4 w-4" /> Add funds
            </Button>
            <Button variant="secondary" size="lg" onClick={() => setModal("withdraw")}>
              Withdraw
            </Button>
          </div>
        </div>
      </section>

      {/* Transactions */}
      <section>
        <PanelTitle title="Transactions" />
        <div className="no-scrollbar -mx-gutter mb-5 overflow-x-auto px-gutter">
          <div className="flex w-max gap-2">
            {types.map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => setFilter(t.key)}
                aria-pressed={filter === t.key}
                className={`h-9 rounded-[6px] border px-3.5 text-[13px] transition-colors ${filter === t.key ? "border-accent bg-accent/10 text-accent" : "border-line-strong text-fg-muted hover:text-fg"}`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {txs.length ? (
          <ul className="divide-y divide-line rounded-md border border-line">
            {txs.map((t) => (
              <li key={t.id} className="grid grid-cols-[32px_1fr_auto] items-center gap-4 p-4 md:grid-cols-[32px_1fr_120px_110px_auto]">
                <span className={`grid h-8 w-8 place-items-center rounded-full ${t.amount > 0 ? "bg-accent/10 text-accent" : "bg-white/5 text-fg-muted"}`}>
                  {t.amount > 0 ? <ArrowDownLeft className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm text-fg">{t.label}</p>
                  <p className="text-xs text-fg-dim md:hidden">
                    {typeLabel[t.type]} · {fmtDate(t.date)}
                  </p>
                </div>
                <span className="hidden font-mono text-[11px] uppercase tracking-[0.1em] text-fg-dim md:block">{typeLabel[t.type]}</span>
                <span className="hidden text-sm text-fg-muted md:block">{fmtDate(t.date)}</span>
                <span className={`text-right font-mono tabular-nums ${t.amount > 0 ? "text-accent" : "text-fg"}`}>
                  {t.amount > 0 ? "+" : "−"}
                  {usd(Math.abs(t.amount), true)}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState icon={<Receipt className="h-6 w-6" />} title="No transactions" body="Nothing of this type yet." />
        )}
      </section>

      <Modal
        open={modal !== null}
        onClose={close}
        title={modal === "add" ? "Add funds" : "Withdraw"}
        description={modal === "add" ? "Top up your balance to rip packs and bid on the Marketplace." : `Cash out up to ${usd(state.balance, true)} from your balance.`}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setNote(true);
          }}
        >
          {modal === "add" && (
            <div className="mb-4 grid grid-cols-4 gap-2">
              {["25", "50", "100", "250"].map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setAmount(v)}
                  className={`h-11 rounded-sm border font-mono text-sm transition-colors ${amount === v ? "border-accent bg-accent/10 text-accent" : "border-line-strong text-fg hover:border-white/25"}`}
                >
                  ${v}
                </button>
              ))}
            </div>
          )}
          <Field label="Amount" hint="USD">
            <div className="relative">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 font-mono text-fg-dim">$</span>
              <Input
                type="number"
                min={modal === "add" ? 5 : 1}
                max={modal === "withdraw" ? state.balance : undefined}
                step={1}
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                style={{ paddingLeft: "2rem" }}
              />
            </div>
          </Field>
          {note && (
            <p role="status" className="mt-4 flex gap-2.5 rounded-sm border border-accent/30 bg-accent/[0.06] p-3 text-[13px] leading-relaxed text-fg-2">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
              {NOT_CONNECTED}
            </p>
          )}
          <div className="mt-6 grid grid-cols-2 gap-3">
            <Button type="button" variant="secondary" size="md" onClick={close}>
              {note ? "Close" : "Cancel"}
            </Button>
            <Button type="submit" size="md">
              {modal === "add" ? `Add ${usd(Number(amount) || 0)}` : `Withdraw ${usd(Number(amount) || 0)}`}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
