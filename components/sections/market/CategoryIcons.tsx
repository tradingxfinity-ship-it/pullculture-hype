"use client";

import { sportIcon } from "@/components/ui/SportIcons";
import { useIconPlayer } from "@/components/ui/useIconPlayer";
import { categories } from "@/lib/data";

// Marketplace header icons. Each plays its own signature move once per
// hover (or tap) and always finishes, even if the pointer leaves early.
// Keyframes live under "Category icon motion" in globals.css.
export default function CategoryIcons() {
  const { playing, play, iconProps } = useIconPlayer();

  return (
    <ul className="flex w-full items-end justify-between lg:pb-1" aria-label="Categories">
      {categories.map((c) => {
        const I = sportIcon[c.slug];
        const on = !!playing[c.slug];
        const { className, ...icon } = iconProps(c.slug);
        return (
          <li key={c.slug} title={c.label} className="relative [perspective:500px]" onPointerEnter={() => play(c.slug)} onClick={() => play(c.slug)}>
            <I aria-hidden strokeWidth={1} {...icon} className={`${className} h-[clamp(40px,5.4vw,92px)] w-auto text-fg-2 hover:text-accent`} />
            {c.slug === "basketball" && <span className={`ico-floor ${on ? "is-playing" : ""}`} aria-hidden />}
            <span className="sr-only">{c.label}</span>
          </li>
        );
      })}
    </ul>
  );
}
