"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { EyeOff, Instagram, Pencil, Share2, Sparkles, UserRoundX } from "lucide-react";
import Button from "@/components/ui/Button";
import { TikTokIcon, XIcon } from "@/components/ui/SocialIcons";
import { useToast } from "@/components/ui/Toast";
import { useAccount } from "./AccountProvider";
import { StatusChip } from "./AccountShell";
import { fmtDate, type VaultItem } from "@/lib/account";
import { num, usd } from "@/lib/data";

// Public collector profile. Only the demo account exists today, so other
// handles show a not-found state; swap the lookup for an API call later.

const socialLinks = [
  { key: "instagram", label: "Instagram", href: (h: string) => `https://instagram.com/${h}`, icon: (p: { className?: string }) => <Instagram {...p} strokeWidth={1.75} /> },
  { key: "x", label: "X", href: (h: string) => `https://x.com/${h}`, icon: XIcon },
  { key: "tiktok", label: "TikTok", href: (h: string) => `https://tiktok.com/@${h}`, icon: TikTokIcon },
] as const;

type Tab = "collection" | "sale" | "pulls";

function CardTile({ v, showValue, meta }: { v: VaultItem; showValue: boolean; meta?: string }) {
  return (
    <div className="group">
      <div className="relative aspect-[4/5] overflow-hidden rounded-md border border-line bg-ink-2 transition-colors duration-base group-hover:border-line-strong">
        <div className="absolute inset-[10%] transition-transform duration-slow ease-out group-hover:-translate-y-1.5 group-hover:scale-[1.04]">
          <Image src={v.image} alt="" fill sizes="(min-width:1024px) 220px, 45vw" className="object-contain drop-shadow-[0_18px_18px_rgba(0,0,0,0.6)]" />
        </div>
        {v.status === "listed" && (
          <span className="absolute left-2.5 top-2.5">
            <StatusChip status="listed" />
          </span>
        )}
      </div>
      <p className="mt-3 truncate font-semibold text-fg">{v.name}</p>
      <div className="mt-0.5 flex items-center justify-between gap-2 font-mono text-[11px] uppercase tracking-[0.08em] text-fg-dim">
        <span className="truncate">{meta ?? v.grade}</span>
        {v.status === "listed" && v.listPrice ? <span className="text-accent">{usd(v.listPrice)}</span> : showValue && <span className="text-fg-2">{usd(v.value)}</span>}
      </div>
    </div>
  );
}

export default function PublicProfile({ handle }: { handle: string }) {
  const { state, hydrated } = useAccount();
  const toast = useToast();
  const [tab, setTab] = useState<Tab>("collection");

  if (!hydrated) return <div className="min-h-[70vh]" aria-busy />;

  const { user, profile } = state;
  if (handle.toLowerCase() !== user.handle.toLowerCase()) {
    return (
      <section className="frame grid min-h-[60vh] place-items-center py-20 text-center">
        <div>
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-white/5 text-accent">
            <UserRoundX className="h-6 w-6" />
          </div>
          <h1 className="mt-6 text-3xl font-bold tracking-[-0.04em]">@{handle} isn’t here</h1>
          <p className="mx-auto mt-3 max-w-sm text-fg-muted">Collector profiles go live with accounts. For now, only your own demo profile can be viewed.</p>
          <div className="mt-8 flex justify-center gap-3">
            <Button href={`/u/${user.handle}`} size="md">
              View my profile
            </Button>
            <Button href="/leaderboard" variant="secondary" size="md">
              Leaderboard
            </Button>
          </div>
        </div>
      </section>
    );
  }

  const owned = state.vault.filter((v) => v.status !== "shipping");
  const listed = owned.filter((v) => v.status === "listed");
  const showcase = profile.showcase.map((id) => owned.find((v) => v.id === id)).filter((v): v is VaultItem => !!v);
  const pulls = [...owned].sort((a, b) => b.pulledAt.localeCompare(a.pulledAt)).slice(0, 8);
  const total = owned.reduce((n, v) => n + v.value, 0);
  const socials = socialLinks.filter((s) => user.socials[s.key]);

  const stats = [
    { label: "Rank", value: `#${num(state.rank)}` },
    { label: "Points", value: num(state.points) },
    { label: "Cards", value: num(owned.length) },
    { label: "For sale", value: num(listed.length) },
    ...(profile.showValue ? [{ label: "Collection", value: usd(total), accent: true }] : []),
  ];

  const share = async () => {
    const url = `${location.origin}/u/${user.handle}`;
    try {
      if (navigator.share) await navigator.share({ title: `${user.name} on HYP3`, url });
      else {
        await navigator.clipboard.writeText(url);
        toast("Profile link copied.");
      }
    } catch {
      // share sheet dismissed
    }
  };

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: "collection", label: "Collection", count: owned.length },
    { key: "sale", label: "For sale", count: listed.length },
    { key: "pulls", label: "Recent pulls", count: pulls.length },
  ];
  const hidden = !profile.showCollection && tab !== "sale";

  return (
    <>
      {/* Owner bar */}
      <div className="border-b border-accent/20 bg-accent/[0.06]">
        <div className="frame flex flex-wrap items-center justify-between gap-3 py-3 text-sm">
          <p className="text-fg-2">
            <span className="font-semibold text-accent">This is your public profile.</span> It’s what other collectors see.
          </p>
          <Link href="/account/settings?tab=public" className="link-u font-medium text-fg">
            Choose what’s shown
          </Link>
        </div>
      </div>

      {/* Cover + identity */}
      <section className="frame pt-6 md:pt-8">
        <div className="relative aspect-[1250/350] min-h-[150px] overflow-hidden rounded-lg border border-line bg-ink-2">
          <Image src={user.cover} alt="" fill priority sizes="(min-width:1024px) 1200px, 100vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" aria-hidden />
        </div>

        <div className="relative px-1 md:px-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div className="flex items-end gap-5">
              <div className="relative -mt-14 h-28 w-28 shrink-0 overflow-hidden rounded-lg border-2 border-accent bg-ink-2 shadow-[0_16px_40px_-10px_rgba(0,0,0,0.9)] md:-mt-20 md:h-36 md:w-36">
                <Image src={user.avatar} alt={user.name} fill sizes="144px" className="object-cover" />
              </div>
              <div className="pb-1">
                <h1 className="text-[clamp(2rem,4.5vw,3.5rem)] font-bold leading-none tracking-[-0.05em]">{user.name}</h1>
                <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.12em] text-fg-dim">
                  @{user.handle} · Member since {fmtDate(user.joined)}
                </p>
              </div>
            </div>
            <div className="flex gap-2 md:pb-2">
              <Button variant="secondary" size="sm" onClick={share}>
                <Share2 className="h-4 w-4" /> Share
              </Button>
              <Button href="/account/settings" size="sm">
                <Pencil className="h-4 w-4" /> Edit profile
              </Button>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-xl">
              {user.bio && <p className="text-[17px] leading-relaxed text-fg-2">{user.bio}</p>}
              {socials.length > 0 && (
                <ul className="mt-4 flex flex-wrap gap-2">
                  {socials.map((s) => (
                    <li key={s.key}>
                      <a
                        href={s.href(user.socials[s.key])}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex h-9 items-center gap-2 rounded-sm border border-line-strong px-3 text-sm text-fg-muted transition-colors hover:border-accent hover:text-accent"
                      >
                        <s.icon className="h-4 w-4" />@{user.socials[s.key]}
                        <span className="sr-only"> on {s.label}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <dl className="grid grid-cols-3 gap-px overflow-hidden rounded-md border border-line bg-line sm:grid-cols-5 lg:min-w-[520px]">
              {stats.map((s) => (
                <div key={s.label} className="bg-ink-1 px-4 py-3.5">
                  <dt className="eyebrow !text-[10px]">{s.label}</dt>
                  <dd className={`mt-1 font-mono text-lg tabular-nums ${"accent" in s ? "text-accent" : "text-fg"}`}>{s.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* Showcase */}
      {showcase.length > 0 && (
        <section className="frame mt-12 md:mt-16">
          <div className="relative overflow-hidden rounded-lg border border-line bg-ink-1 px-5 py-8 md:px-10 md:py-10">
            <div className="glow absolute -top-32 left-1/2 h-[360px] w-[720px] -translate-x-1/2" aria-hidden />
            <p className="relative eyebrow flex items-center gap-2 text-accent">
              <Sparkles className="h-3.5 w-3.5" /> Showcase
            </p>
            <ul className="relative mt-8 grid grid-cols-2 gap-6 md:grid-cols-4">
              {showcase.map((v, i) => (
                <li key={v.id} className="group text-center">
                  <div className="relative mx-auto aspect-[147/250] w-full max-w-[200px] transition-transform duration-slow ease-out group-hover:-translate-y-2 group-hover:rotate-[-1.5deg]">
                    <Image src={v.image} alt="" fill sizes="200px" className="object-contain drop-shadow-[0_24px_30px_rgba(0,0,0,0.75)]" />
                  </div>
                  <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.14em] text-accent">0{i + 1}</p>
                  <p className="mt-1 truncate font-semibold text-fg">{v.name}</p>
                  <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-fg-dim">
                    {v.grade}
                    {profile.showValue && <> · {usd(v.value)}</>}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Tabs */}
      <section className="frame pb-section pt-12 md:pt-16">
        <nav aria-label="Profile" className="no-scrollbar overflow-x-auto border-b border-line">
          <ul className="flex w-max gap-1">
            {tabs.map((t) => (
              <li key={t.key}>
                <button
                  type="button"
                  onClick={() => setTab(t.key)}
                  aria-current={tab === t.key ? "page" : undefined}
                  className={`relative flex h-12 items-center gap-2 px-3.5 text-sm font-medium transition-colors ${tab === t.key ? "text-fg" : "text-fg-muted hover:text-fg"}`}
                >
                  {t.label}
                  <span className={`font-mono text-[11px] ${tab === t.key ? "text-accent" : "text-fg-dim"}`}>{t.count}</span>
                  <span className={`absolute inset-x-3 -bottom-px h-[2px] origin-left bg-accent transition-transform duration-base ease-out ${tab === t.key ? "scale-x-100" : "scale-x-0"}`} aria-hidden />
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div key={tab} className="step-in mt-8" style={{ "--dir": 1 } as React.CSSProperties}>
          {hidden ? (
            <div className="grid place-items-center rounded-lg border border-dashed border-line-strong px-6 py-16 text-center">
              <EyeOff className="h-6 w-6 text-fg-dim" />
              <p className="mt-4 font-semibold text-fg">Collection is private</p>
              <p className="mt-1 text-sm text-fg-muted">Visitors can’t see your vault. You can change this in settings.</p>
            </div>
          ) : (
            (() => {
              const list = tab === "sale" ? listed : tab === "pulls" ? pulls : owned;
              if (!list.length)
                return <p className="rounded-lg border border-dashed border-line-strong px-6 py-16 text-center text-fg-muted">{tab === "sale" ? "Nothing listed right now." : "No cards yet."}</p>;
              return (
                <ul className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-5">
                  {list.map((v) => (
                    <li key={v.id}>
                      <CardTile v={v} showValue={profile.showValue} meta={tab === "pulls" ? `${fmtDate(v.pulledAt)} · ${v.pack.replace(/ Pack$/, "")}` : undefined} />
                    </li>
                  ))}
                </ul>
              );
            })()
          )}
        </div>
      </section>
    </>
  );
}
