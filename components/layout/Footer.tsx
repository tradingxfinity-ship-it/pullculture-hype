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
const socialIcon = { Instagram: Instagram, X: XIcon, TikTok: TikTokIcon } as const;

const columns = [
  { title: "Explore", links: footerNav.slice(0, 4) },
  { title: "Help", links: footerNav.slice(4, 8) },
  { title: "Legal", links: footerNav.slice(8) },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-line bg-ink-1">
      <div className="glow absolute -top-40 left-1/4 h-[480px] w-[720px] opacity-70" aria-hidden />

      {/* Get Updated */}
      <div className="frame relative pb-20 pt-section">
        <div className="grid-12 gap-y-12">
          <Reveal className="col-span-4 md:col-span-8 lg:col-span-7">
            <div className="mb-8 flex items-center gap-3">
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
              className="text-display-md font-bold"
            />
          </Reveal>
          <Reveal delay={120} className="col-span-4 self-end md:col-span-8 lg:col-span-5">
            <p className="mb-6 max-w-md text-[15px] leading-relaxed text-fg-muted">
              Sign-Up to get notified and be the first in line for rare pack drops, new marketplace cards, and members-only offers.
            </p>
            <Newsletter />
          </Reveal>
        </div>
      </div>

      {/* Link grid */}
      <div className="frame relative">
        <div className="grid-12 gap-y-10 border-t border-line py-14">
          <div className="col-span-4 md:col-span-8 lg:col-span-4">
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

          <div className="col-span-2 md:col-span-2 lg:col-span-2">
            <p className="eyebrow mb-5">Follow Our Socials</p>
            <ul className="space-y-3">
              {socials.map((s) => {
                const I = socialIcon[s.label as keyof typeof socialIcon];
                return (
                  <li key={s.label}>
                    <a href={s.href} className="group inline-flex items-center gap-2.5 text-[15px] text-fg-2 transition-colors hover:text-accent">
                      <I className="h-4 w-4" />
                      <span className="link-u">{s.label}</span>
                      <ArrowUpRight className="arrow-nudge h-3.5 w-3.5 text-fg-dim" />
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
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
