import Link from "next/link";
import { ArrowUpRight, Instagram } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import SplitHeading from "@/components/ui/SplitHeading";
import Logo from "@/components/ui/Logo";
import { LiveDot } from "@/components/ui/Tag";
import Newsletter from "./Newsletter";
import { footerNav, socials } from "@/lib/nav";

const XIcon = (p: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p} aria-hidden>
    <path d="M17.75 3h3.07l-6.7 7.66L22 21h-6.17l-4.83-6.32L5.47 21H2.4l7.17-8.2L2 3h6.33l4.37 5.77L17.75 3Zm-1.08 16.2h1.7L7.4 4.72H5.57L16.67 19.2Z" />
  </svg>
);
const TikTokIcon = (p: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p} aria-hidden>
    <path d="M16.6 5.82A4.28 4.28 0 0 1 15.54 3h-3.09v12.4a2.59 2.59 0 1 1-2.59-2.63c.27 0 .53.04.78.12V9.73a5.73 5.73 0 0 0-.78-.05A5.69 5.69 0 1 0 15.54 15.4V9.01a7.35 7.35 0 0 0 4.3 1.38V7.3a4.3 4.3 0 0 1-3.24-1.48Z" />
  </svg>
);
const DiscordIcon = (p: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p} aria-hidden>
    <path d="M20.32 4.37a19.8 19.8 0 0 0-4.89-1.52.07.07 0 0 0-.08.04c-.21.38-.44.87-.6 1.25a18.27 18.27 0 0 0-5.49 0 12.6 12.6 0 0 0-.62-1.25.08.08 0 0 0-.08-.04 19.74 19.74 0 0 0-4.88 1.52.07.07 0 0 0-.03.03C.53 9.05-.32 13.58.1 18.06c0 .02.01.04.03.06a19.9 19.9 0 0 0 5.99 3.03.08.08 0 0 0 .09-.03c.46-.63.87-1.3 1.22-1.99a.08.08 0 0 0-.04-.11 13.1 13.1 0 0 1-1.87-.89.08.08 0 0 1-.01-.13c.13-.09.25-.19.37-.29a.07.07 0 0 1 .08-.01c3.93 1.79 8.18 1.79 12.06 0a.07.07 0 0 1 .08.01c.12.1.25.2.37.29a.08.08 0 0 1-.01.13c-.6.35-1.22.64-1.87.89a.08.08 0 0 0-.04.11c.36.7.77 1.36 1.22 1.99a.08.08 0 0 0 .09.03 19.84 19.84 0 0 0 6-3.03.08.08 0 0 0 .03-.06c.5-5.18-.84-9.67-3.55-13.66a.06.06 0 0 0-.03-.03ZM8.02 15.33c-1.18 0-2.16-1.09-2.16-2.42 0-1.33.96-2.42 2.16-2.42 1.21 0 2.18 1.1 2.16 2.42 0 1.33-.96 2.42-2.16 2.42Zm7.97 0c-1.18 0-2.15-1.09-2.15-2.42 0-1.33.95-2.42 2.15-2.42 1.21 0 2.18 1.1 2.16 2.42 0 1.33-.95 2.42-2.16 2.42Z" />
  </svg>
);
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
      <div className="relative select-none overflow-hidden" aria-hidden>
        <div className="frame">
          <p className="masthead translate-y-[14%] text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.16)]">
            Pull <span className="[-webkit-text-stroke:1px_rgba(117,251,181,0.55)]">Culture</span>
          </p>
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
