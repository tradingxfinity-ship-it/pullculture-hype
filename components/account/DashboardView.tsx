"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Archive, ArrowDownLeft, Package, Scissors, Sparkles, Store, Tag as TagIcon, Trophy, Upload, Wallet, type LucideIcon } from "lucide-react";
import { useAccount, useAccountStats } from "./AccountProvider";
import { PanelTitle, StatusChip } from "./AccountShell";
import { OrderTimeline } from "./OrdersView";
import { fmtDate } from "@/lib/account";
import { num, usd } from "@/lib/data";

const quick = [
  { href: "/pack", label: "Rip a pack", body: "15 packs · from $25", icon: Scissors },
  { href: "/account/vault", label: "Ship cards", body: "Send hits to your door", icon: Package },
  { href: "/marketplace", label: "Marketplace", body: "Bid, buy and trade", icon: Store },
  { href: "/submit", label: "Submit cards", body: "Sell or grade yours", icon: Upload },
];

// Big faded icon behind a dashboard tile; animates while the tile is hovered
// (see "Dashboard tile hover" in globals.css).
function TileArt({ icon: I, art }: { icon: LucideIcon; art: string }) {
  return (
    <span className={`tile-art art-${art}`} aria-hidden>
      <I strokeWidth={1.25} />
      {art === "wallet" && (
        <>
          <span className="coin" />
          <span className="coin" />
          <span className="coin" />
        </>
      )}
    </span>
  );
}

export default function DashboardView() {
  const { state } = useAccount();
  const stats = useAccountStats();
  const recent = [...state.vault].sort((a, b) => b.pulledAt.localeCompare(a.pulledAt)).slice(0, 4);
  const offers = state.offers.filter((o) => o.direction === "received" && o.status === "pending");
  const activeOrder = state.orders.find((o) => o.status !== "delivered");

  const tiles = [
    { label: "Vault value", value: usd(stats.vaultValue), sub: `${stats.vaultCount} cards · ${stats.listedCount} listed`, href: "/account/vault", icon: Archive, art: "vault", accent: true },
    { label: "Balance", value: usd(state.balance, true), sub: "Add funds", href: "/account/wallet", icon: Wallet, art: "wallet" },
    { label: "Points", value: num(state.points), sub: `+${num(state.pointsToday)} today`, href: "/leaderboard", icon: Sparkles, art: "points" },
    { label: "Monthly rank", value: `#${num(state.rank)}`, sub: "View leaderboard", href: "/leaderboard", icon: Trophy, art: "rank" },
  ];

  return (
    <div className="space-y-14">
      <h2 className="text-[clamp(2rem,4vw,3.25rem)] font-bold leading-[0.95] tracking-[-0.045em]">
        Welcome back, <em className="font-serif font-normal italic tracking-[-0.02em] text-accent">{state.user.name}.</em>
      </h2>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {tiles.map((t) => {
          const I = t.icon;
          return (
            <Link
              key={t.label}
              href={t.href}
              className={`dash-tile group relative isolate overflow-hidden rounded-md border p-5 ${t.accent ? "border-accent/40 bg-accent/[0.05]" : "border-line bg-ink-1"}`}
            >
              <TileArt icon={I} art={t.art} />
              <div className="relative flex items-center gap-2">
                <I className={`h-4 w-4 shrink-0 transition-colors group-hover:text-accent-ink ${t.accent ? "text-accent" : "text-fg-dim"}`} />
                <span className="eyebrow !text-[10px] transition-colors group-hover:!text-black/70">{t.label}</span>
              </div>
              <p
                className={`relative mt-4 font-mono text-[clamp(1.4rem,2.4vw,2rem)] tabular-nums leading-none transition-colors group-hover:text-accent-ink ${
                  t.accent ? "text-accent" : "text-fg"
                }`}
              >
                {t.value}
              </p>
              <p className="relative mt-2 flex items-center justify-between text-xs text-fg-muted transition-colors group-hover:text-black/70">
                {t.sub}
                <ArrowUpRight className="arrow-nudge h-3.5 w-3.5 text-fg-dim group-hover:text-accent-ink" />
              </p>
            </Link>
          );
        })}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {quick.map((q) => {
          const I = q.icon;
          return (
            <Link key={q.href} href={q.href} className="group flex items-center gap-4 rounded-md border border-line p-4 transition-all hover:-translate-y-0.5 hover:border-accent">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-sm bg-white/5 text-fg transition-colors group-hover:bg-accent group-hover:text-accent-ink">
                <I className="h-5 w-5" strokeWidth={1.75} />
              </span>
              <span className="min-w-0">
                <span className="block truncate font-semibold text-fg">{q.label}</span>
                <span className="block truncate text-xs text-fg-dim">{q.body}</span>
              </span>
            </Link>
          );
        })}
      </div>

      {/* Recent pulls */}
      <section>
        <PanelTitle
          title="Recent pulls"
          action={
            <Link href="/account/vault" className="group inline-flex items-center gap-1.5 text-sm font-medium text-fg">
              <span className="link-u">Open vault</span> <ArrowUpRight className="arrow-nudge h-4 w-4 text-accent" />
            </Link>
          }
        />
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {recent.map((v) => (
            <Link key={v.id} href="/account/vault" className="group flex items-center gap-3 rounded-md border border-line bg-ink-1 p-3 transition-colors hover:border-line-strong">
              <div className="relative h-20 w-14 shrink-0 transition-transform duration-base ease-out group-hover:-translate-y-0.5 group-hover:rotate-[-3deg]">
                <Image src={v.image} alt="" fill sizes="56px" className="object-contain drop-shadow-[0_8px_10px_rgba(0,0,0,0.7)]" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-fg">{v.name}</p>
                <p className="truncate text-xs text-fg-dim">{v.grade}</p>
                <p className="mt-1.5 font-mono text-sm tabular-nums text-fg">{usd(v.value)}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <div className="grid gap-10 lg:grid-cols-2">
        {/* Offers */}
        <section>
          <PanelTitle
            title={
              <>
                Offers for you {offers.length > 0 && <span className="ml-1 font-mono text-base text-accent">{offers.length}</span>}
              </>
            }
            action={
              <Link href="/account/offers" className="group inline-flex items-center gap-1.5 text-sm font-medium text-fg">
                <span className="link-u">All offers</span> <ArrowUpRight className="arrow-nudge h-4 w-4 text-accent" />
              </Link>
            }
          />
          {offers.length ? (
            <ul className="divide-y divide-line rounded-md border border-line">
              {offers.slice(0, 3).map((o) => (
                <li key={o.id}>
                  <Link href="/account/offers" className="flex items-center gap-4 p-4 transition-colors hover:bg-white/[0.02]">
                    <TagIcon className="h-4 w-4 shrink-0 text-accent" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-fg">{o.card}</p>
                      <p className="truncate text-xs text-fg-dim">from {o.counterparty} · ask {usd(o.ask)}</p>
                    </div>
                    <span className="font-mono tabular-nums text-accent">{usd(o.amount)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="rounded-md border border-line p-5 text-sm text-fg-muted">No offers waiting. List a card to start getting offers.</p>
          )}
        </section>

        {/* Activity */}
        <section>
          <PanelTitle
            title="Recent activity"
            action={
              <Link href="/account/wallet" className="group inline-flex items-center gap-1.5 text-sm font-medium text-fg">
                <span className="link-u">Wallet</span> <ArrowUpRight className="arrow-nudge h-4 w-4 text-accent" />
              </Link>
            }
          />
          <ul className="divide-y divide-line rounded-md border border-line">
            {state.transactions.slice(0, 5).map((t) => (
              <li key={t.id} className="flex items-center gap-4 p-4">
                <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full ${t.amount > 0 ? "bg-accent/10 text-accent" : "bg-white/5 text-fg-muted"}`}>
                  {t.amount > 0 ? <ArrowDownLeft className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-fg">{t.label}</p>
                  <p className="text-xs text-fg-dim">{fmtDate(t.date)}</p>
                </div>
                <span className={`font-mono text-sm tabular-nums ${t.amount > 0 ? "text-accent" : "text-fg"}`}>
                  {t.amount > 0 ? "+" : "−"}
                  {usd(Math.abs(t.amount), true)}
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* Active shipment */}
      {activeOrder && (
        <section>
          <PanelTitle
            title="On its way"
            action={
              <Link href="/account/orders" className="group inline-flex items-center gap-1.5 text-sm font-medium text-fg">
                <span className="link-u">All orders</span> <ArrowUpRight className="arrow-nudge h-4 w-4 text-accent" />
              </Link>
            }
          />
          <div className="rounded-md border border-line bg-ink-1 p-5 md:p-6">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <p className="font-semibold text-fg">
                {activeOrder.id} <span className="font-normal text-fg-dim">· {activeOrder.items.map((i) => i.name).join(", ")}</span>
              </p>
              <StatusChip status={activeOrder.status} />
            </div>
            <OrderTimeline status={activeOrder.status} />
          </div>
        </section>
      )}
    </div>
  );
}
