"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { ArrowUpRight, ChevronRight, CircleHelp } from "lucide-react";
import Logo from "@/components/ui/Logo";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import { LiveDot } from "@/components/ui/Tag";
import { sportIcon } from "@/components/ui/SportIcons";
import { useIconPlayer } from "@/components/ui/useIconPlayer";
import { categoryNav, isActive, primaryNav } from "@/lib/nav";
import { useAccount } from "@/components/account/AccountProvider";
import { usd } from "@/lib/data";

// Desktop side rail. Same information architecture as before — primary
// nav, sport categories, How it works, Submit Cards — set as an editorial
// index rather than a rounded panel.
export default function Rail() {
  const pathname = usePathname();
  const { play, iconProps } = useIconPlayer();
  const {
    state: { user, balance },
  } = useAccount();
  const inAccount = pathname.startsWith("/account");

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-rail flex-col border-r border-line bg-ink-1 lg:flex">
      <div className="flex h-[var(--topbar-h)] items-center border-b border-line px-6">
        <Logo className="h-7 w-auto" />
      </div>

      <nav className="no-scrollbar flex-1 overflow-y-auto px-3 py-6" aria-label="Primary">
        <p className="eyebrow mb-3 px-3">Index</p>
        <ul className="space-y-0.5">
          {primaryNav.map((item, i) => {
            const active = isActive(pathname, item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`group relative flex h-10 items-center gap-3 rounded-sm px-3 text-[14px] font-medium transition-colors duration-fast ${
                    active ? "bg-white/[0.04] text-fg" : "text-fg-muted hover:bg-white/[0.02] hover:text-fg"
                  }`}
                >
                  <span
                    className={`absolute left-0 top-1/2 h-4 w-[2px] -translate-y-1/2 rounded-full bg-accent transition-transform duration-base ease-out ${
                      active ? "scale-y-100" : "scale-y-0"
                    }`}
                    aria-hidden
                  />
                  <Icon name={item.icon} className={`h-[17px] w-[17px] ${active ? "text-accent" : ""}`} />
                  <span className="flex-1">{item.label}</span>
                  <span className={`font-mono text-[10px] ${active ? "text-accent" : "text-fg-dim"}`}>0{i + 1}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="hairline mx-3 my-6" />

        <p className="eyebrow mb-3 px-3">Categories</p>
        <ul className="space-y-0.5">
          {categoryNav.map((item) => {
            const active = pathname === item.href;
            const I = sportIcon[item.slug];
            const { className, ...icon } = iconProps(item.slug);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onPointerEnter={() => play(item.slug)}
                  className={`group flex h-10 items-center justify-between rounded-sm px-3 text-[14px] font-medium transition-colors duration-fast ${
                    active ? "bg-white/[0.04] text-accent" : "text-fg-muted hover:bg-white/[0.02] hover:text-fg"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <I aria-hidden strokeWidth={1.5} {...icon} className={`${className} h-[18px] w-[18px] shrink-0 ${active ? "text-accent" : ""}`} />
                    <span className="transition-transform duration-base ease-out group-hover:translate-x-1">{item.label}</span>
                  </span>
                  <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition-all duration-base ease-out group-hover:opacity-100 group-hover:text-accent" />
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="hairline mx-3 my-6" />

        <Link
          href="/how-it-works"
          className={`flex h-10 items-center gap-3 rounded-sm px-3 text-[14px] font-medium transition-colors duration-fast ${
            isActive(pathname, "/how-it-works") ? "text-accent" : "text-fg-muted hover:text-fg"
          }`}
        >
          <CircleHelp className="h-[17px] w-[17px]" strokeWidth={1.5} />
          How It Works?
        </Link>
      </nav>

      <div className="space-y-4 border-t border-line p-5">
        {/* Profile (demo account) */}
        <Link
          href="/account"
          aria-current={inAccount ? "page" : undefined}
          className={`group flex items-center gap-3 rounded-md border p-2.5 transition-colors ${
            inAccount ? "border-accent/50 bg-accent/[0.06]" : "border-line hover:border-line-strong hover:bg-white/[0.02]"
          }`}
        >
          <span className="relative shrink-0">
            <Image src={user.avatar} alt="" width={40} height={40} className="h-10 w-10 rounded-[6px] object-cover" />
            <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-ink-1 bg-accent" aria-hidden />
          </span>
          <span className="min-w-0 flex-1">
            <span className={`block truncate text-sm font-semibold ${inAccount ? "text-accent" : "text-fg"}`}>{user.name}</span>
            <span className="block truncate font-mono text-[12px] tabular-nums text-accent">{usd(balance, true)}</span>
          </span>
          <ChevronRight className="h-4 w-4 shrink-0 text-fg-dim transition-transform duration-base group-hover:translate-x-0.5 group-hover:text-accent" />
        </Link>
        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.12em] text-fg-dim">
          <LiveDot /> Vault open · Drops Fri
        </div>
        <Button href="/submit" variant="primary" size="md" full arrow magnetic>
          Submit Cards
        </Button>
      </div>
    </aside>
  );
}
