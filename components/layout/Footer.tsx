import Link from "next/link";
import { ArrowUpRight, Instagram } from "lucide-react";
import { DiscordIcon, TikTokIcon, XIcon } from "@/components/ui/SocialIcons";
import Reveal from "@/components/ui/Reveal";
import SplitHeading from "@/components/ui/SplitHeading";
import Logo from "@/components/ui/Logo";
import { LiveDot } from "@/components/ui/Tag";
import Newsletter from "./Newsletter";
import Wordmark from "./Wordmark";
import { footerNav, socials } from "@/lib/nav";

const socialIcon = { Instagram: Instagram, X: XIcon, TikTok: TikTokIcon, Discord: DiscordIcon } as const;

const columns = [
  { title: "Explore", links: footerNav.slice(0, 4) },
  { title: "Help", links: footerNav.slice(4, 8) },
  { title: "Legal", links: footerNav.slice(8) },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-line bg-ink-1">
      <div className="glow absolute -top-40 left-1/4 h-[480px] w-[720px] opacity-70" aria-hidden />

      {/* Get Updated — copy + form left, socials right */}
      <div className="frame relative py-14 md:py-16">
        <div className="grid-12 items-center gap-y-10">
          <Reveal className="col-span-4 md:col-span-8 lg:col-span-6">
            <div className="mb-5 flex items-center gap-3">
              <span className="font-mono text-[11px] tracking-[0.12em] text-accent">∞</span>
              <span className="h-px w-8 bg-accent/60" aria-hidden />
              <span className="eyebrow">Get Updated</span>
            </div>
            <SplitHeading
              lines={[
                "First in line",
                <>
                  for the <em className="font-serif font-normal italic tracking-[-0.02em] text-accent">next</em> drop.
                </>,
              ]}
              className="text-[clamp(2.5rem,4.6vw,4.75rem)] font-bold leading-[0.92] tracking-[-0.045em]"
            />
            <p className="mb-4 mt-5 max-w-md text-[15px] leading-relaxed text-fg-muted">
              Sign-Up to get notified and be the first in line for rare pack drops, new marketplace cards, and members-only offers.
            </p>
            <Newsletter />
          </Reveal>

          <Reveal delay={120} className="col-span-4 md:col-span-8 lg:col-span-5 lg:col-start-8">
            <p className="eyebrow mb-3">Follow Our Socials</p>
            <ul className="grid grid-cols-2 gap-3 md:gap-4">
              {socials.map((s) => {
                const I = socialIcon[s.label as keyof typeof socialIcon];
                return (
                  <li key={s.label}>
                    <a
                      href={s.href}
                      aria-label={s.label}
                      className="group relative flex h-28 flex-col justify-between overflow-hidden rounded-lg bg-accent p-4 text-accent-ink md:h-36 transition-[transform,box-shadow] duration-base ease-out hover:-translate-y-1 hover:shadow-[0_18px_50px_-12px_rgba(117,251,181,0.55)] md:p-5"
                    >
                      <span className="absolute inset-0 origin-bottom scale-y-0 bg-white/25 transition-transform duration-slow ease-out group-hover:scale-y-100" aria-hidden />
                      <span className="relative flex items-start justify-between">
                        <I className="h-8 w-8 transition-transform duration-slow ease-out group-hover:-rotate-6 group-hover:scale-110 md:h-10 md:w-10" />
                        <ArrowUpRight className="arrow-nudge h-5 w-5" />
                      </span>
                      <span className="relative text-lg font-bold tracking-[-0.03em] md:text-xl">{s.label}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </Reveal>
        </div>
      </div>

      {/* Link grid */}
      <div className="frame relative">
        <div className="grid-12 gap-y-10 border-t border-line py-14">
          <div className="col-span-4 md:col-span-8 lg:col-span-6">
            <Logo className="h-8 w-auto" />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-fg-dim">
              Curated packs, graded hits, and a marketplace built by lifelong collectors.
            </p>
            <div className="mt-6 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.12em] text-fg-muted">
              <LiveDot /> Shipping to U.S. &amp; Canada
            </div>
          </div>

          {columns.map((col) => (
            <nav key={col.title} className="col-span-2 md:col-span-2 lg:col-span-2" aria-label={col.title}>
              <p className="eyebrow mb-5">{col.title}</p>
              <ul className="space-y-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="link-u text-[15px] text-fg-2 transition-colors hover:text-accent">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

        </div>
      </div>

      {/* Oversized wordmark */}
      <div className="relative select-none overflow-hidden">
        <div className="frame">
          <div className="pb-10 pt-4 md:pb-14">
            <Wordmark />
          </div>
        </div>
      </div>

      <div className="frame relative border-t border-line bg-ink-1">
        <div className="flex flex-col gap-2 py-6 font-mono text-[11px] uppercase tracking-[0.12em] text-fg-dim sm:flex-row sm:items-center sm:justify-between">
          <p>Copyright © 2026 HYP3. All Rights Reserved.</p>
          <p>Issue 026 — Built for the chase</p>
        </div>
      </div>
    </footer>
  );
}
