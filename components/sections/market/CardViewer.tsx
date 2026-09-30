"use client";

import Image from "next/image";
import { useState } from "react";

// Slab viewer with a front/back flip.
export default function CardViewer({ src, alt }: { src: string; alt: string }) {
  const [side, setSide] = useState<"front" | "back">("front");

  return (
    <div>
      <div className="ticks relative aspect-[4/5] overflow-hidden rounded-lg border border-line bg-[radial-gradient(ellipse_at_50%_40%,#1b1b1b_0%,#060606_70%)] [perspective:1600px]">
        <div className="grid-bg absolute inset-0 opacity-50" aria-hidden />
        <div className="glow absolute left-1/2 top-1/2 h-2/3 w-2/3 -translate-x-1/2 -translate-y-1/2" aria-hidden />
        <div
          className="absolute inset-[10%] transition-transform duration-[900ms] ease-out [transform-style:preserve-3d]"
          style={{ transform: side === "back" ? "rotateY(180deg)" : "none" }}
        >
          <div className="absolute inset-0 [backface-visibility:hidden]">
            <Image src={src} alt={alt} fill priority sizes="(min-width:1024px) 40vw, 90vw" className="object-contain drop-shadow-[0_40px_50px_rgba(0,0,0,0.9)]" />
          </div>
          <div className="absolute inset-0 grid place-items-center [backface-visibility:hidden] [transform:rotateY(180deg)]">
            <div className="grid aspect-[267/449] h-full place-items-center rounded-md border border-line-strong bg-gradient-to-br from-ink-5 to-ink-2">
              <div className="text-center">
                <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-fg-dim">Cert</p>
                <p className="mt-1 font-mono text-xl text-fg">63140708</p>
                <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.14em] text-accent">PSA verified</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2">
        {(["front", "back"] as const).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setSide(s)}
            aria-pressed={side === s}
            className={`h-11 rounded-sm border text-sm font-medium capitalize transition-colors ${
              side === s ? "border-accent bg-accent text-accent-ink" : "border-line-strong text-fg hover:border-fg/60"
            }`}
          >
            View {s}
          </button>
        ))}
      </div>
    </div>
  );
}
