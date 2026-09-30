"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import Button from "@/components/ui/Button";

// Half-height banner: the original basketball collage, dimmed, with the
// headline and two actions set over it. The image drifts slowly on scroll.
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
        if (img.current) img.current.style.transform = `translate3d(0, ${window.scrollY * 0.18}px, 0) scale(1.06)`;
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
      className="relative -mt-[var(--topbar-h)] flex h-[clamp(420px,54vh,520px)] items-end overflow-hidden bg-ink-0"
    >
      <div ref={img} className="absolute inset-0 will-change-transform" aria-hidden>
        <Image src="/assets/banners/Banner-img-01.webp" alt="" fill priority sizes="100vw" className="object-cover object-center brightness-[2.2] contrast-[1.1]" />
      </div>
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_50%_80%_at_85%_100%,rgba(117,251,181,0.16),transparent_70%)]"
        aria-hidden
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/10" aria-hidden />

      <div className="frame relative flex w-full flex-col justify-between gap-8 pb-10 md:flex-row md:items-end md:pb-14">
        <h1 className="text-[clamp(2.75rem,6.4vw,6.5rem)] font-bold leading-[0.9] tracking-[-0.055em] text-fg">
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
          className="flex flex-wrap items-center gap-3 [.is-in_&]:translate-y-0 [.is-in_&]:opacity-100"
          style={{ "--reveal-delay": "400ms" } as React.CSSProperties}
        >
          <Button href="/pack" size="lg" arrow magnetic>
            Rip A Pack
          </Button>
          <Button href="/marketplace" variant="secondary" size="lg">
            Marketplace
          </Button>
        </div>
      </div>
    </section>
  );
}
