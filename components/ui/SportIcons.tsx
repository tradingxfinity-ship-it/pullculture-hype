import type { SVGProps } from "react";
import type { Category } from "@/lib/data";

// Line icons for each category, drawn on a 24px grid to match Lucide.
// Parts that animate on their own carry classes (see "Category icon
// motion" in globals.css).
type P = SVGProps<SVGSVGElement>;
const base = { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round" } as const;

// Four-point sparkle centred on (x, y).
const spark = (x: number, y: number, s: number) =>
  `M${x} ${y - s}Q${x} ${y} ${x + s} ${y}Q${x} ${y} ${x} ${y + s}Q${x} ${y} ${x - s} ${y}Q${x} ${y} ${x} ${y - s}Z`;

export const FootballIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M4.6 19.4C2.9 17.7 3 12.4 7.7 7.7S17.7 2.9 19.4 4.6s1.6 7-3.1 11.7-10 4.8-11.7 3.1Z" />
    <path d="m9.5 14.5 5-5M10.5 11l2.5 2.5M12 9.5l2.5 2.5M9 12.5l2.5 2.5" />
    <path d="M15.5 4.3c.8 1.8 2.4 3.4 4.2 4.2M4.3 15.5c.8 1.8 2.4 3.4 4.2 4.2" />
  </svg>
);

export const BasketballIcon = (p: P) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18M12 3v18" />
    <path d="M5.6 5.6c2.6 2.6 2.6 10.2 0 12.8M18.4 5.6c-2.6 2.6-2.6 10.2 0 12.8" />
  </svg>
);

export const BaseballIcon = (p: P) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M6.2 5.1a10 10 0 0 1 0 13.8M17.8 5.1a10 10 0 0 0 0 13.8" />
    <path d="m6.4 8.2 1.7-.6M7.4 11.2h1.7M6.4 15.8l1.7.6M17.6 8.2l-1.7-.6M16.6 11.2h-1.7M17.6 15.8l-1.7.6" />
  </svg>
);

export const PokeballIcon = (p: P) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h6M15 12h6" />
    <circle className="pb-btn" cx="12" cy="12" r="3" />
  </svg>
);

export const TrophyIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M8 4h8v5a4 4 0 0 1-8 0V4Z" />
    <path d="M8 6H5.5a1.5 1.5 0 0 0 0 3c.9 0 1.7 0 2.5.5M16 6h2.5a1.5 1.5 0 0 1 0 3c-.9 0-1.7 0-2.5.5" />
    <path d="M12 13v3M8.5 20h7M9.5 20c0-2 1-4 2.5-4s2.5 2 2.5 4" />
    <path className="tr-spark" d={spark(3, 2.5, 1.8)} fill="currentColor" stroke="none" />
    <path className="tr-spark" d={spark(21.5, 3.5, 1.4)} fill="currentColor" stroke="none" style={{ animationDelay: "160ms" }} />
    <path className="tr-spark" d={spark(20.5, 14, 1.1)} fill="currentColor" stroke="none" style={{ animationDelay: "320ms" }} />
    <path className="tr-spark" d={spark(3.5, 13.5, 1)} fill="currentColor" stroke="none" style={{ animationDelay: "240ms" }} />
  </svg>
);

export const sportIcon: Record<Category, (p: P) => React.JSX.Element> = {
  football: FootballIcon,
  basketball: BasketballIcon,
  baseball: BaseballIcon,
  pokemon: PokeballIcon,
  "multi-sport": TrophyIcon,
};
