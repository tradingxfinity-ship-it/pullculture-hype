"use client";

import { useEffect, useRef, useState } from "react";
import { Minus, Plus, ShoppingBag } from "lucide-react";
import Button from "@/components/ui/Button";
import { usd } from "@/lib/data";

function Stepper({ qty, setQty, size = "md" }: { qty: number; setQty: (n: number) => void; size?: "sm" | "md" }) {
  const h = size === "sm" ? "h-10" : "h-14";
  return (
    <div className={`flex ${h} items-center rounded-sm border border-line-strong`}>
      <button type="button" aria-label="Decrease quantity" onClick={() => setQty(Math.max(1, qty - 1))} className={`grid ${h} w-10 place-items-center text-fg-muted transition-colors hover:text-accent`}>
        <Minus className="h-4 w-4" />
      </button>
      <output aria-live="polite" className="w-8 text-center font-mono tabular-nums text-fg">
        {qty}
      </output>
      <button type="button" aria-label="Increase quantity" onClick={() => setQty(Math.min(10, qty + 1))} className={`grid ${h} w-10 place-items-center text-fg-muted transition-colors hover:text-accent`}>
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}

// Inline purchase controls plus a bottom bar that docks once they scroll away.
export default function BuyPanel({ name, slug, price }: { name: string; slug: string; price: number }) {
  const [qty, setQty] = useState(1);
  const [docked, setDocked] = useState(false);
  const anchor = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = anchor.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setDocked(!e.isIntersecting && e.boundingClientRect.top < 0));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <>
      <div ref={anchor} className="flex flex-wrap items-center gap-3">
        <Stepper qty={qty} setQty={setQty} />
        <Button href={`/rip/${slug}?qty=${qty}`} size="lg" arrow magnetic className="flex-1">
          Buy Now · {usd(price * qty, true)}
        </Button>
      </div>

      <div
        className={`fixed bottom-0 right-0 z-30 border-t border-line bg-black/80 backdrop-blur-xl transition-transform duration-slow ease-out lg:left-rail left-0 ${
          docked ? "translate-y-0" : "translate-y-full"
        }`}
        aria-hidden={!docked}
      >
        <div className="frame flex h-[72px] items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-4">
            <ShoppingBag className="hidden h-5 w-5 text-accent sm:block" strokeWidth={1.5} />
            <p className="font-mono text-lg tabular-nums text-accent">{usd(price, true)}</p>
            <p className="hidden truncate font-semibold text-fg sm:block">{name}</p>
          </div>
          <div className="flex items-center gap-3">
            <Stepper qty={qty} setQty={setQty} size="sm" />
            <Button href={`/rip/${slug}?qty=${qty}`} size="md" tabIndex={docked ? 0 : -1}>
              Buy Now
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
