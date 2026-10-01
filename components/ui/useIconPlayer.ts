"use client";

import { useCallback, useState } from "react";
import type { Category } from "@/lib/data";

// Tracks which category icons are mid-animation so each signature move
// (see "Category icon motion" in globals.css) plays once and completes.
export function useIconPlayer() {
  const [playing, setPlaying] = useState<Partial<Record<Category, boolean>>>({});
  const play = useCallback((c: Category) => setPlaying((p) => (p[c] ? p : { ...p, [c]: true })), []);
  const stop = useCallback((c: Category) => setPlaying((p) => ({ ...p, [c]: false })), []);

  // Props for the icon <svg>: animation classes + reset when its own animation ends.
  const iconProps = (c: Category) => ({
    className: `ico ico-${c} ${playing[c] ? "is-playing" : ""}`,
    onAnimationEnd: (e: React.AnimationEvent<SVGSVGElement>) => e.target === e.currentTarget && stop(c),
  });

  return { playing, play, iconProps };
}
