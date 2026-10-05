// Single source for every navigation surface (rail, mobile menu, footer).

import type { Category } from "./data";

export const primaryNav = [
  { label: "Home", href: "/", icon: "home" },
  { label: "Pack", href: "/pack", icon: "package" },
  { label: "Marketplace", href: "/marketplace", icon: "store" },
  { label: "Leaderboard", href: "/leaderboard", icon: "trophy" },
  { label: "Blog", href: "/blog", icon: "book" },
] as const;

export const categoryNav = [
  { label: "Football", href: "/pack/football", slug: "football" },
  { label: "Basketball", href: "/pack/basketball", slug: "basketball" },
  { label: "Baseball", href: "/pack/baseball", slug: "baseball" },
  { label: "Pokémon", href: "/pack/pokemon", slug: "pokemon" },
  { label: "Multi-Sport", href: "/pack/multi-sport", slug: "multi-sport" },
] as const satisfies readonly { label: string; href: string; slug: Category }[];

export const footerNav = [
  { label: "Home", href: "/" },
  { label: "Packs", href: "/pack" },
  { label: "Blog", href: "/blog" },
  { label: "FAQ", href: "/how-it-works#faq" },
  { label: "Support", href: "#" },
  { label: "Feedback", href: "#" },
  { label: "Shipping", href: "/shipping" },
  { label: "Provably Fair", href: "#" },
  { label: "Terms", href: "/terms-of-service" },
  { label: "Privacy", href: "/privacy-policy" },
];

export const socials = [
  { label: "Instagram", href: "#" },
  { label: "X", href: "#" },
  { label: "TikTok", href: "#" },
  { label: "Discord", href: "#" },
];

export const isActive = (pathname: string, href: string) =>
  href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/");
