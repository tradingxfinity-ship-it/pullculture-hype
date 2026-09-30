"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

// Scroll-snapping horizontal row with arrow controls and a progress rule.
// Bleeds to the right edge so the next item peeks in.
export default function HScroll({ children, label }: { children: ReactNode; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [edges, setEdges] = useState({ start: true, end: false });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => {
      const max = el.scrollWidth - el.clientWidth;
      setProgress(max > 0 ? el.scrollLeft / max : 0);
      setEdges({ start: el.scrollLeft < 4, end: el.scrollLeft > max - 4 });
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const go = (dir: 1 | -1) => ref.current?.scrollBy({ left: dir * ref.current.clientWidth * 0.8, behavior: "smooth" });

  return (
    <div>
      <div
        ref={ref}
        role="region"
        aria-label={label}
        tabIndex={0}
        className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pl-gutter md:gap-6 [&>*]:snap-start [&>*]:scroll-ml-[var(--gutter)]"
      >
        {children}
        <div aria-hidden className="w-[calc(var(--gutter)-16px)] shrink-0 md:w-[calc(var(--gutter)-24px)]" />
      </div>
      <div className="frame mt-10 flex items-center gap-6">
        <div className="relative h-px flex-1 bg-line">
          <div
            className="absolute inset-y-0 left-0 bg-accent transition-[width] duration-fast ease-out"
            style={{ width: `${Math.max(8, progress * 100)}%` }}
          />
        </div>
        <div className="flex gap-2">
          {([-1, 1] as const).map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => go(d)}
              disabled={d === -1 ? edges.start : edges.end}
              aria-label={d === -1 ? "Previous" : "Next"}
              className="grid h-11 w-11 place-items-center rounded-full border border-line-strong text-fg transition-colors duration-base hover:border-accent hover:text-accent disabled:opacity-30 disabled:hover:border-line-strong disabled:hover:text-fg"
            >
              {d === -1 ? <ArrowLeft className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
