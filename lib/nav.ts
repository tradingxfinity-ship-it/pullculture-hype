// Single source for every navigation surface (rail, mobile menu, footer).

export const primaryNav = [
  { label: "Home", href: "/", icon: "home" },
  { label: "Pack", href: "/pack", icon: "package" },
  { label: "Marketplace", href: "/marketplace", icon: "store" },
  { label: "Leaderboard", href: "/leaderboard", icon: "trophy" },
] as const;

export const categoryNav = [
  { label: "Football", href: "/pack/football" },
  { label: "Basketball", href: "/pack/basketball" },
  { label: "Baseball", href: "/pack/baseball" },
  { label: "Pokémon", href: "/pack/pokemon" },
  { label: "Multi-Sport", href: "/pack/multi-sport" },
] as const;

export const footerNav = [
  { label: "Home", href: "/" },
  { label: "Packs", href: "/pack" },
  { label: "News", href: "/news" },
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
];

export const isActive = (pathname: string, href: string) =>
  href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/");
