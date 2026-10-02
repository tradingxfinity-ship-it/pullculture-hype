"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Clock, Tag as TagIcon } from "lucide-react";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { Field, Input } from "@/components/ui/Form";
import { useToast } from "@/components/ui/Toast";
import { useAccount } from "./AccountProvider";
import { EmptyState, StatusChip } from "./AccountShell";
import type { Offer } from "@/lib/account";
import { usd } from "@/lib/data";

// Relative expiry, computed only on the client to avoid hydration mismatch.
function useNow() {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(t);
  }, []);
  return now;
}

function expiry(iso: string, now: number | null) {
  if (now === null) return "";
  const h = Math.round((new Date(iso).getTime() - now) / 3_600_000);
  if (h <= 0) return "Expired";
  return h >= 24 ? `${Math.floor(h / 24)}d ${h % 24}h left` : `${h}h left`;
}

export default function OffersView() {
  const { state, dispatch } = useAccount();
  const toast = useToast();
  const now = useNow();
  const [tab, setTab] = useState<"received" | "sent">("received");
  const [accepting, setAccepting] = useState<Offer | null>(null);
  const [countering, setCountering] = useState<Offer | null>(null);
  const [counter, setCounter] = useState("");

  const list = state.offers.filter((o) => o.direction === tab);
  const pendingCount = (d: "received" | "sent") => state.offers.filter((o) => o.direction === d && o.status === "pending").length;

  return (
    <>
      <div className="mb-8 flex h-11 w-fit rounded-sm border border-line-strong p-1" role="tablist" aria-label="Offers">
        {(["received", "sent"] as const).map((d) => (
          <button
            key={d}
            role="tab"
            aria-selected={tab === d}
            onClick={() => setTab(d)}
            className={`flex items-center gap-2 rounded-[6px] px-4 text-[13px] font-medium capitalize transition-colors ${tab === d ? "bg-accent text-accent-ink" : "text-fg-muted hover:text-fg"}`}
          >
            {d}
            {pendingCount(d) > 0 && <span className={`font-mono text-[10px] ${tab === d ? "" : "text-accent"}`}>{pendingCount(d)}</span>}
          </button>
        ))}
      </div>

      {list.length ? (
        <ul className="space-y-3">
          {list.map((o) => {
            const diff = Math.round(((o.amount - o.ask) / o.ask) * 100);
            const pending = o.status === "pending";
            return (
              <li key={o.id} className={`flex flex-col gap-5 rounded-md border bg-ink-1 p-4 sm:p-5 md:flex-row md:items-center ${pending ? "border-line-strong" : "border-line opacity-70"}`}>
                <div className="flex min-w-0 flex-1 items-center gap-4">
                  <div className="relative h-20 w-14 shrink-0">
                    <Image src={o.image} alt="" fill sizes="56px" className="object-contain drop-shadow-[0_8px_10px_rgba(0,0,0,0.7)]" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="truncate font-semibold text-fg">{o.card}</p>
                      <StatusChip status={o.status} />
                    </div>
                    <p className="truncate text-sm text-fg-muted">{o.set}</p>
                    <p className="mt-1 flex items-center gap-1.5 text-xs text-fg-dim">
                      {tab === "received" ? "From" : "To"} <span className="text-accent">{o.counterparty}</span>
                      {pending && now !== null && (
                        <>
                          <span>·</span>
                          <Clock className="h-3 w-3" /> {expiry(o.expiresAt, now)}
                        </>
                      )}
                    </p>
                  </div>
                </div>

                <dl className="flex gap-8 md:w-[230px] md:justify-end">
                  <div>
                    <dt className="text-[11px] text-fg-dim">Asking</dt>
                    <dd className="font-mono tabular-nums text-fg-muted">{usd(o.ask)}</dd>
                  </div>
                  <div className="text-right">
                    <dt className="text-[11px] text-fg-dim">{o.status === "countered" ? "Your counter" : "Offer"}</dt>
                    <dd className="font-mono text-lg tabular-nums text-accent">{usd(o.status === "countered" && o.counter ? o.counter : o.amount)}</dd>
                    {o.status !== "countered" && <dd className="text-[11px] text-fg-dim">{diff}% vs ask</dd>}
                  </div>
                </dl>

                {pending && (
                  <div className="flex gap-2 md:w-auto">
                    {tab === "received" ? (
                      <>
                        <Button size="sm" onClick={() => setAccepting(o)}>
                          Accept
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => {
                            setCounter(String(Math.round((o.amount + o.ask) / 2)));
                            setCountering(o);
                          }}
                        >
                          Counter
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            dispatch({ type: "offer", id: o.id, status: "declined" });
                            toast(`Declined ${o.counterparty}’s offer.`, "info");
                          }}
                        >
                          Decline
                        </Button>
                      </>
                    ) : (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          dispatch({ type: "offer", id: o.id, status: "cancelled" });
                          toast(`Offer on ${o.card} cancelled.`, "info");
                        }}
                      >
                        Cancel offer
                      </Button>
                    )}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      ) : (
        <EmptyState
          icon={<TagIcon className="h-6 w-6" />}
          title={tab === "received" ? "No offers yet" : "You haven’t made any offers"}
          body={tab === "received" ? "List a card from your vault and buyers can send you offers." : "Find a card on the Marketplace and make an offer."}
          action={<Button href={tab === "received" ? "/account/vault" : "/marketplace"} arrow>{tab === "received" ? "Go to vault" : "Browse Marketplace"}</Button>}
        />
      )}

      <Modal open={!!accepting} onClose={() => setAccepting(null)} title="Accept this offer?" description={accepting ? `${accepting.card} sells to ${accepting.counterparty}.` : undefined}>
        {accepting && (
          <>
            <div className="flex items-center justify-between rounded-md border border-accent/30 bg-accent/[0.06] p-4">
              <span className="eyebrow">You receive</span>
              <span className="font-mono text-2xl tabular-nums text-accent">{usd(accepting.amount)}</span>
            </div>
            <p className="mt-3 text-xs text-fg-dim">Other offers on this card will be declined automatically.</p>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <Button variant="secondary" size="md" onClick={() => setAccepting(null)}>
                Not yet
              </Button>
              <Button
                size="md"
                onClick={() => {
                  dispatch({ type: "offer", id: accepting.id, status: "accepted" });
                  toast(`Sold ${accepting.card} for ${usd(accepting.amount)}. Balance updated.`);
                  setAccepting(null);
                }}
              >
                Accept offer
              </Button>
            </div>
          </>
        )}
      </Modal>

      <Modal open={!!countering} onClose={() => setCountering(null)} title="Counter offer" description={countering ? `${countering.counterparty} offered ${usd(countering.amount)} · you’re asking ${usd(countering.ask)}` : undefined}>
        {countering && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const n = Math.round(Number(counter));
              if (!(n > countering.amount)) return;
              dispatch({ type: "counter", id: countering.id, amount: n });
              toast(`Counter of ${usd(n)} sent to ${countering.counterparty}.`);
              setCountering(null);
            }}
          >
            <Field label="Your counter" hint={`Above ${usd(countering.amount)}`}>
              <div className="relative">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 font-mono text-fg-dim">$</span>
                <Input type="number" required min={countering.amount + 1} step={1} value={counter} onChange={(e) => setCounter(e.target.value)} style={{ paddingLeft: "2rem" }} />
              </div>
            </Field>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <Button type="button" variant="secondary" size="md" onClick={() => setCountering(null)}>
                Cancel
              </Button>
              <Button type="submit" size="md">
                Send counter
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </>
  );
}
