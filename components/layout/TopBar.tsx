"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { LogIn, Menu, Search, UserPlus } from "lucide-react";
import Logo from "@/components/ui/Logo";
import Button from "@/components/ui/Button";
import { LiveDot } from "@/components/ui/Tag";
import MobileMenu from "./MobileMenu";

const crumbLabel = (pathname: string) => {
  const seg = pathname.split("/").filter((s) => s && s !== "product");
  if (!seg.length) return ["Home"];
  return seg.map((s) =>
    decodeURIComponent(s)
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase()),
  );
};

// Sticky utility bar. Transparent at the top of the page; picks up a
// blurred backdrop and hairline once the page scrolls.
export default function TopBar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  const crumbs = crumbLabel(pathname);

  return (
    <>
      <header
        className={`sticky top-0 z-30 h-[var(--topbar-h)] border-b transition-[background,border-color,backdrop-filter] duration-base ease-out ${
          scrolled || open ? "border-line bg-black/70 backdrop-blur-xl backdrop-saturate-150" : "border-transparent bg-transparent"
        }`}
      >
        <div className="frame flex h-full items-center justify-between gap-4">
          {/* Mobile brand */}
          <div className="lg:hidden">
            <Logo className="h-6 w-auto" />
          </div>

          {/* Desktop breadcrumb */}
          <nav aria-label="Breadcrumb" className="hidden min-w-0 items-center gap-2 font-mono text-[11px] uppercase tracking-[0.12em] lg:flex">
            <Link href="/" className="text-fg-dim transition-colors hover:text-fg">
              Pull Culture
            </Link>
            {crumbs.map((c, i) => (
              <span key={i} className="flex min-w-0 items-center gap-2">
                <span className="text-fg-dim">/</span>
                <span className={`truncate ${i === crumbs.length - 1 ? "text-fg" : "text-fg-dim"}`}>{c}</span>
              </span>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <div className="mr-3 hidden items-center gap-2 font-mono text-[11px] uppercase tracking-[0.12em] text-fg-muted xl:flex">
              <LiveDot /> 27,102 packs ripped
            </div>
            <Link
              href="/marketplace"
              aria-label="Search the marketplace"
              className="hidden h-9 w-9 place-items-center rounded-sm text-fg-muted transition-colors hover:bg-white/5 hover:text-fg sm:grid"
            >
              <Search className="h-4 w-4" />
            </Link>
            <Button href="#" variant="ghost" size="sm" className="hidden sm:inline-flex">
              <LogIn className="h-4 w-4" /> Log in
            </Button>
            <Button href="#" variant="primary" size="sm">
              <UserPlus className="h-4 w-4" /> Sign Up
            </Button>
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-label={open ? "Close menu" : "Open menu"}
              className="grid h-9 w-9 place-items-center rounded-sm border border-line-strong text-fg transition-colors hover:border-fg/60 lg:hidden"
            >
              <Menu className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>
      <MobileMenu open={open} onClose={() => setOpen(false)} />
    </>
  );
}
