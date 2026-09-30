"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import Button from "@/components/ui/Button";

// Half-height banner. The artwork carries the packs on its right side, so
// the headline and actions sit on the dark left, under a soft scrim.
export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const img = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    requestAnimationFrame(() => el.classList.add("is-in"));
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    const onScroll = () => {
      raf ||= requestAnimationFrame(() => {
        if (img.current) img.current.style.transform = `translate3d(0, ${window.scrollY * 0.15}px, 0) scale(1.05)`;
        raf = 0;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section
      ref={root}
      className="relative -mt-[var(--topbar-h)] flex h-[clamp(440px,56vh,540px)] items-end overflow-hidden bg-ink-0"
    >
      <div ref={img} className="absolute inset-0 will-change-transform" aria-hidden>
        <Image
          src="/assets/banners/hero-banner.webp"
          alt="Platinum, Ember and Gold Basketball packs"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[72%_center] md:object-right"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/35 to-transparent md:via-black/20" aria-hidden />
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/80 to-transparent" aria-hidden />
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black to-transparent" aria-hidden />

      <div className="frame relative w-full pb-10 md:pb-14">
        <h1 className="text-[clamp(2.75rem,6vw,6rem)] font-bold leading-[0.9] tracking-[-0.055em] text-fg">
          <span className="line-mask">
            <span>Rip packs.</span>
          </span>
          <span className="line-mask">
            <span style={{ "--line-delay": "100ms" } as React.CSSProperties}>
              Pull <em className="font-serif font-normal italic tracking-[-0.03em] text-accent">grails.</em>
            </span>
          </span>
        </h1>

        <div
          data-reveal=""
          className="mt-8 flex flex-wrap items-center gap-3 [.is-in_&]:translate-y-0 [.is-in_&]:opacity-100"
          style={{ "--reveal-delay": "400ms" } as React.CSSProperties}
        >
          <Button href="/pack" size="lg" arrow magnetic>
            Rip A Pack
          </Button>
          <Button href="/marketplace" variant="secondary" size="lg" className="bg-black/30 backdrop-blur-sm">
            Marketplace
          </Button>
        </div>
      </div>
    </section>
  );
}
