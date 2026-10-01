"use client";

import { useEffect, useRef } from "react";
import { sportIcon } from "./SportIcons";
import { useIconPlayer } from "./useIconPlayer";
import type { Category } from "@/lib/data";

// A category icon that replays its signature move on a loop, resting
// `gap` ms between runs. Used as decorative backdrop art.
export default function LoopingSportIcon({ slug, gap = 1600, className = "" }: { slug: Category; gap?: number; className?: string }) {
  const { playing, play, iconProps } = useIconPlayer();
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const I = sportIcon[slug];
  const on = !!playing[slug];

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!on) timer.current = setTimeout(() => play(slug), gap);
    return () => clearTimeout(timer.current);
  }, [on, slug, gap, play]);

  const { className: anim, ...icon } = iconProps(slug);
  return <I aria-hidden strokeWidth={1} {...icon} className={`${anim} ${className}`} />;
}
