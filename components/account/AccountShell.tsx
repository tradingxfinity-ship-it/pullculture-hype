"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { Eye, Heart, LayoutDashboard, Package, Settings, Tag as TagIcon, Vault, Wallet } from "lucide-react";
import Button from "@/components/ui/Button";
import Tag from "@/components/ui/Tag";
import { useAccount, useAccountStats } from "./AccountProvider";
import { fmtDate } from "@/lib/account";
import { num, usd } from "@/lib/data";

const tabs = [
  { href: "/account", label: "Dashboard", icon: LayoutDashboard },
  { href: "/account/vault", label: "Vault", icon: Vault },
  { href: "/account/favorites", label: "Favorites", icon: Heart },
  { href: "/account/offers", label: "Offers", icon: TagIcon, badge: "offers" as const },
  { href: "/account/wallet", label: "Wallet", icon: Wallet },
  { href: "/account/orders", label: "Orders", icon: Package, badge: "orders" as const },
  { href: "/account/settings", label: "Settings", icon: Settings },
];

export default function AccountShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { state } = useAccount();
  const stats = useAccountStats();
  const badges = { offers: stats.pendingOffers, orders: stats.activeOrders };

  return (
    <>
      <header className="relative overflow-hidden border-b border-line">
        <div className="grid-bg absolute inset-0 opacity-50" aria-hidden />
        <div className="glow absolute -right-20 -top-40 h-[360px] w-[620px]" aria-hidden />
        <div className="frame relative flex flex-col gap-6 py-8 md:py-10 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex items-center gap-5">
            <div className="relative">
              <Image src={state.user.avatar} alt="" width={80} height={80} className="h-16 w-16 rounded-md object-cover ring-1 ring-accent/50 md:h-20 md:w-20" />
              <span className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-ink-0 bg-accent" aria-label="Online" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-[clamp(1.75rem,3.4vw,2.75rem)] font-bold leading-none tracking-[-0.045em]">{state.user.name}</h1>
                <span title="No account system yet — this is sample data saved in your browser.">
                  <Tag>Demo data</Tag>
                </span>
              </div>
              <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.12em] text-fg-dim">
                @{state.user.handle} · Member since {fmtDate(state.user.joined)}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-end gap-x-8 gap-y-4">
            <dl className="flex gap-6 sm:gap-8">
              <div>
                <dt className="eyebrow !text-[10px]">Balance</dt>
                <dd className="mt-1 font-mono text-xl tabular-nums text-accent sm:text-2xl">{usd(state.balance, true)}</dd>
              </div>
              <div>
                <dt className="eyebrow !text-[10px]">Points</dt>
                <dd className="mt-1 font-mono text-xl tabular-nums text-fg sm:text-2xl">{num(state.points)}</dd>
              </div>
              <div>
                <dt className="eyebrow !text-[10px]">Rank</dt>
                <dd className="mt-1 font-mono text-xl tabular-nums text-fg sm:text-2xl">#{num(state.rank)}</dd>
              </div>
            </dl>
            <div className="flex gap-2">
              <Button href={`/u/${state.user.handle}`} variant="secondary" size="sm">
                <Eye className="h-4 w-4" /> View profile
              </Button>
              <Button href="/account/wallet" variant="secondary" size="sm">
                <Wallet className="h-4 w-4" /> Add funds
              </Button>
            </div>
          </div>
        </div>
      </header>

      <nav className="sticky top-[var(--topbar-h)] z-20 border-b border-line bg-black/80 backdrop-blur-xl" aria-label="Account">
        <div className="frame no-scrollbar overflow-x-auto">
          <ul className="flex w-max gap-1">
            {tabs.map((t) => {
              const on = t.href === "/account" ? pathname === "/account" : pathname.startsWith(t.href);
              const count = t.badge ? badges[t.badge] : 0;
              const I = t.icon;
              return (
                <li key={t.href}>
                  <Link
                    href={t.href}
                    aria-current={on ? "page" : undefined}
                    className={`relative flex h-12 items-center gap-2 px-3.5 text-sm font-medium transition-colors ${on ? "text-fg" : "text-fg-muted hover:text-fg"}`}
                  >
                    <I className={`h-4 w-4 ${on ? "text-accent" : ""}`} strokeWidth={1.75} />
                    {t.label}
                    {count > 0 && (
                      <span className="grid h-[18px] min-w-[18px] place-items-center rounded-full bg-accent px-1 font-mono text-[10px] font-semibold text-accent-ink">{count}</span>
                    )}
                    <span className={`absolute inset-x-3 -bottom-px h-[2px] origin-left bg-accent transition-transform duration-base ease-out ${on ? "scale-x-100" : "scale-x-0"}`} aria-hidden />
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      <div className="frame py-10 md:py-14">{children}</div>
    </>
  );
}

// Shared bits for account pages

export function PanelTitle({ title, action }: { title: ReactNode; action?: ReactNode }) {
  return (
    <div className="mb-5 flex items-center justify-between gap-4">
      <h2 className="text-xl font-bold tracking-[-0.03em] md:text-2xl">{title}</h2>
      {action}
    </div>
  );
}

export function EmptyState({ icon, title, body, action }: { icon: ReactNode; title: string; body: string; action?: ReactNode }) {
  return (
    <div className="grid place-items-center rounded-lg border border-dashed border-line-strong px-6 py-16 text-center">
      <div className="grid h-14 w-14 place-items-center rounded-full bg-white/5 text-accent">{icon}</div>
      <p className="mt-5 text-xl font-semibold tracking-[-0.02em] text-fg">{title}</p>
      <p className="mt-2 max-w-sm text-sm text-fg-muted">{body}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

const chipTone: Record<string, string> = {
  vault: "border-line-strong text-fg-muted",
  listed: "border-accent/40 text-accent",
  shipping: "border-tier-gold/40 text-tier-gold",
  pending: "border-tier-gold/40 text-tier-gold",
  accepted: "border-accent/40 text-accent",
  declined: "border-line-strong text-fg-dim",
  cancelled: "border-line-strong text-fg-dim",
  countered: "border-tier-platinum/40 text-tier-platinum",
  processing: "border-tier-gold/40 text-tier-gold",
  packed: "border-tier-gold/40 text-tier-gold",
  shipped: "border-accent/40 text-accent",
  delivered: "border-line-strong text-fg-muted",
};
const chipLabel: Record<string, string> = { vault: "In vault" };

export function StatusChip({ status }: { status: string }) {
  return (
    <span className={`inline-flex h-6 items-center rounded-[6px] border px-2 font-mono text-[10px] uppercase tracking-[0.12em] ${chipTone[status] ?? chipTone.vault}`}>
      {chipLabel[status] ?? status}
    </span>
  );
}
