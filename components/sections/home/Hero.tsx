"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { ArrowDown } from "lucide-react";
import Button from "@/components/ui/Button";
import Tag, { LiveDot } from "@/components/ui/Tag";

// Magazine-cover hero: masthead, cover line, and a layered stack of the
// Ember pack and two graded slabs that drift with the cursor and scroll.
export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const bg = useRef<HTMLDivElement>(null);
  const layers = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    requestAnimationFrame(() => el.classList.add("is-in"));
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let mx = 0,
      my = 0,
      raf = 0;
    const render = () => {
      const y = window.scrollY;
      if (bg.current) bg.current.style.transform = `translate3d(0, ${y * 0.25}px, 0) scale(1.08)`;
      layers.current.forEach((l) => {
        const d = Number(l.dataset.depth ?? 0);
        l.style.transform = `translate3d(${mx * d}px, ${my * d - y * d * 0.06}px, 0)`;
      });
      raf = 0;
    };
    const queue = () => (raf ||= requestAnimationFrame(render));
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      mx = (e.clientX / window.innerWidth - 0.5) * 2;
      my = (e.clientY / window.innerHeight - 0.5) * 2;
      queue();
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("scroll", queue, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", queue);
      cancelAnimationFrame(raf);
    };
  }, []);

  const layer = (i: number) => (n: HTMLDivElement | null) => {
    if (n) layers.current[i] = n;
  };

  return (
    <section
      ref={root}
      className="relative -mt-[var(--topbar-h)] flex min-h-[640px] flex-col overflow-hidden bg-ink-0 pt-[var(--topbar-h)] lg:h-[calc(100svh-36px)] lg:max-h-[1080px] lg:min-h-[720px]"
    >
      {/* Backdrop: the original banner, desaturated and pushed back */}
      <div ref={bg} className="absolute inset-0 will-change-transform" aria-hidden>
        <Image src="/assets/banners/Banner-img-01.webp" alt="" fill priority sizes="100vw" className="object-cover opacity-60 grayscale" />
      </div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_45%,transparent_0%,rgba(0,0,0,0.65)_55%,#000_85%)]" aria-hidden />
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black via-black/80 to-transparent" aria-hidden />
      <div className="grid-bg absolute inset-0 opacity-40" aria-hidden />
      <div className="glow absolute right-[8%] top-[18%] h-[60%] w-[46%]" aria-hidden />

      <div className="frame relative flex flex-1 flex-col">
        {/* Cover metadata */}
        <div className="flex items-center justify-between border-b border-line py-4 font-mono text-[11px] uppercase tracking-[0.14em] text-fg-muted">
          <span className="flex items-center gap-2">
            <LiveDot /> Issue Nº 026
          </span>
          <span className="hidden sm:block">The Chase Issue — Fall Drop</span>
          <span>$25 — $100</span>
        </div>

        {/* Masthead */}
        <h1 className="sr-only">Pull Culture — rip packs, pull grails</h1>
        <div aria-hidden className="relative z-10 mt-6 select-none md:mt-8">
          <span className="line-mask">
            <span className="masthead text-fg">
              Pull Culture
            </span>
          </span>
        </div>

        <div className="relative grid flex-1 grid-cols-1 items-end gap-10 pb-10 pt-8 lg:grid-cols-12 lg:gap-6 lg:pb-14">
          {/* Cover line */}
          <div className="relative z-10 lg:col-span-5">
            <div className="line-mask mb-5">
              <span style={{ "--line-delay": "200ms" } as React.CSSProperties} className="!flex items-center gap-3">
                <span className="font-mono text-[11px] tracking-[0.12em] text-accent">01</span>
                <span className="h-px w-8 bg-accent/60" />
                <span className="eyebrow">Cover Story</span>
              </span>
            </div>
            <p className="text-display-sm font-bold text-fg">
              <span className="line-mask">
                <span style={{ "--line-delay": "260ms" } as React.CSSProperties}>Rip packs.</span>
              </span>
              <span className="line-mask">
                <span style={{ "--line-delay": "340ms" } as React.CSSProperties}>
                  Pull <em className="font-serif font-normal italic tracking-[-0.02em] text-accent">grails.</em>
                </span>
              </span>
            </p>
            <p className="mt-6 max-w-[420px] text-[15px] leading-relaxed text-fg-muted">
              Curated packs of graded sports and Pokémon cards. Provably fair odds, instant buyback, and a marketplace for the cards you actually
              want — shipped from our vault to your door.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button href="/pack" size="lg" arrow magnetic>
                Rip A Pack
              </Button>
              <Button href="/marketplace" variant="secondary" size="lg">
                Browse Marketplace
              </Button>
            </div>
          </div>

          {/* Layered imagery */}
          <div className="pointer-events-none relative h-[380px] sm:h-[460px] lg:col-span-7 lg:h-full lg:min-h-[420px]">
            <div ref={layer(0)} data-depth="10" className="absolute left-[4%] top-[14%] w-[34%] max-w-[230px] will-change-transform sm:left-[10%]">
              <div className="animate-float [--rot:-9deg]" style={{ animationDelay: "-2s" }}>
                <Image src="/assets/cards/Pack-02.webp" alt="" width={147} height={250} className="h-auto w-full opacity-80 drop-shadow-[0_30px_40px_rgba(0,0,0,0.8)]" />
              </div>
            </div>
            <div ref={layer(1)} data-depth="16" className="absolute right-[2%] top-[4%] w-[36%] max-w-[250px] will-change-transform sm:right-[8%]">
              <div className="animate-float [--rot:8deg]" style={{ animationDelay: "-4s" }}>
                <Image src="/assets/cards/Pack-03.webp" alt="" width={267} height={449} className="h-auto w-full drop-shadow-[0_30px_40px_rgba(0,0,0,0.8)]" />
              </div>
            </div>
            <div ref={layer(2)} data-depth="24" className="absolute bottom-0 left-1/2 w-[46%] max-w-[330px] will-change-transform">
              <div className="-translate-x-1/2">
                <div className="animate-float [--rot:-2deg]">
                  <Image
                    src="/assets/product/product-singular.webp"
                    alt="Pull Culture Ember Basketball pack"
                    width={431}
                    height={720}
                    priority
                    className="h-auto w-full drop-shadow-[0_40px_60px_rgba(0,0,0,0.9)]"
                  />
                </div>
              </div>
            </div>

            {/* Floating metadata */}
            <div ref={layer(3)} data-depth="6" className="absolute left-0 top-[58%] hidden will-change-transform sm:block lg:left-[2%]">
              <div className="rounded-sm border border-line-strong bg-black/60 px-3 py-2 backdrop-blur-md">
                <p className="eyebrow !text-[10px]">Grail odds</p>
                <p className="font-mono text-sm text-accent">0.1% · Pikachu</p>
              </div>
            </div>
            <div ref={layer(4)} data-depth="8" className="absolute right-0 top-[64%] will-change-transform lg:right-[4%]">
              <div className="rounded-sm border border-line-strong bg-black/60 px-3 py-2 backdrop-blur-md">
                <p className="eyebrow !text-[10px]">LeBron James #78</p>
                <p className="font-mono text-sm text-fg">PSA 8.5 · Auto 10 · /23</p>
              </div>
            </div>
            <div className="absolute right-[6%] top-0 hidden lg:block">
              <Tag tone="accent" className="bg-black/50">
                Ember Series
              </Tag>
            </div>
          </div>
        </div>

        {/* Base strip */}
        <div className="relative z-10 hidden items-center justify-between border-t border-line py-4 font-mono text-[11px] uppercase tracking-[0.14em] text-fg-dim md:flex">
          <span>No bulk · No filler</span>
          <span>Provably fair drops</span>
          <span>Instant buyback</span>
          <span className="flex items-center gap-2 text-fg-muted">
            Scroll <ArrowDown className="h-3.5 w-3.5 animate-bounce" />
          </span>
        </div>
      </div>
    </section>
  );
}
