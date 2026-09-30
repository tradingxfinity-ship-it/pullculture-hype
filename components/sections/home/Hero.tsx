"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import Button from "@/components/ui/Button";

// Deliberately minimal: headline, one line of copy, two actions, and a
// single pack under a soft glow. The pack eases toward the cursor.
export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const pack = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    requestAnimationFrame(() => el.classList.add("is-in"));
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let tx = 0,
      ty = 0,
      x = 0,
      y = 0;
    const loop = () => {
      x += (tx - x) * 0.06;
      y += (ty - y) * 0.06;
      if (pack.current) pack.current.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${x * 0.12}deg)`;
      raf = requestAnimationFrame(loop);
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      tx = (e.clientX / window.innerWidth - 0.5) * 28;
      ty = (e.clientY / window.innerHeight - 0.5) * 20;
    };
    window.addEventListener("pointermove", onMove);
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section
      ref={root}
      className="relative -mt-[var(--topbar-h)] flex min-h-[680px] items-center overflow-hidden bg-ink-0 pt-[var(--topbar-h)] lg:h-[calc(100svh-36px)] lg:max-h-[980px]"
    >
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_60%_70%_at_75%_50%,rgba(117,251,181,0.14),transparent_70%)]"
        aria-hidden
      />

      <div className="frame relative grid w-full items-center gap-10 py-12 lg:grid-cols-12 lg:gap-6">
        <div className="relative z-10 lg:col-span-7">
          <h1 className="text-[clamp(3.25rem,8.4vw,9rem)] font-bold leading-[0.88] tracking-[-0.055em] text-fg">
            <span className="line-mask">
              <span>Rip packs.</span>
            </span>
            <span className="line-mask">
              <span style={{ "--line-delay": "100ms" } as React.CSSProperties}>
                Pull <em className="font-serif font-normal italic tracking-[-0.03em] text-accent">grails.</em>
              </span>
            </span>
          </h1>

          <p
            data-reveal=""
            className="mt-8 max-w-md text-lg leading-relaxed text-fg-muted [.is-in_&]:translate-y-0 [.is-in_&]:opacity-100"
            style={{ "--reveal-delay": "350ms" } as React.CSSProperties}
          >
            Graded sports and Pokémon cards, with odds you can see before you rip.
          </p>

          <div
            data-reveal=""
            className="mt-10 flex flex-wrap items-center gap-3 [.is-in_&]:translate-y-0 [.is-in_&]:opacity-100"
            style={{ "--reveal-delay": "480ms" } as React.CSSProperties}
          >
            <Button href="/pack" size="lg" arrow magnetic>
              Rip A Pack
            </Button>
            <Button href="/marketplace" variant="secondary" size="lg">
              Marketplace
            </Button>
          </div>
        </div>

        <div className="pointer-events-none relative flex justify-center lg:col-span-5 lg:justify-end">
          <div className="glow absolute left-1/2 top-1/2 h-[90%] w-[90%] -translate-x-1/2 -translate-y-1/2 opacity-90" aria-hidden />
          <div ref={pack} className="relative will-change-transform">
            <div className="animate-float [--rot:3deg]">
              <Image
                src="/assets/product/product-singular.webp"
                alt="Pull Culture Ember Basketball pack"
                width={431}
                height={720}
                priority
                className="h-auto w-[min(62vw,300px)] drop-shadow-[0_40px_60px_rgba(0,0,0,0.85)] lg:mr-[6%] lg:w-[min(19vw,320px)]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
