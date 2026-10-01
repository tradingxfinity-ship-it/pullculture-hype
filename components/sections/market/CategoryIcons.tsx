"use client";

import { useState } from "react";
import { sportIcon } from "@/components/ui/SportIcons";
import { categories, type Category } from "@/lib/data";

// Marketplace header icons. Each plays its own signature move once per
// hover (or tap) and always finishes, even if the pointer leaves early.
// Keyframes live under "Category icon motion" in globals.css.
export default function CategoryIcons() {
  const [playing, setPlaying] = useState<Partial<Record<Category, boolean>>>({});
  const play = (c: Category) => setPlaying((p) => (p[c] ? p : { ...p, [c]: true }));
  const stop = (c: Category) => setPlaying((p) => ({ ...p, [c]: false }));

  return (
    <ul className="flex w-full items-end justify-between lg:pb-1" aria-label="Categories">
      {categories.map((c) => {
        const I = sportIcon[c.slug];
        const on = !!playing[c.slug];
        return (
          <li key={c.slug} title={c.label} className="relative [perspective:500px]" onPointerEnter={() => play(c.slug)} onClick={() => play(c.slug)}>
            <I
              aria-hidden
              strokeWidth={1}
              className={`ico ico-${c.slug} h-[clamp(40px,5.4vw,92px)] w-auto text-fg-2 hover:text-accent ${on ? "is-playing" : ""}`}
              onAnimationEnd={(e) => e.target === e.currentTarget && stop(c.slug)}
            />
            {c.slug === "basketball" && <span className={`ico-floor ${on ? "is-playing" : ""}`} aria-hidden />}
            <span className="sr-only">{c.label}</span>
          </li>
        );
      })}
    </ul>
  );
}
