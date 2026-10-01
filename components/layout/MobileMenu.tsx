"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { LogIn, X } from "lucide-react";
import Button from "@/components/ui/Button";
import Logo from "@/components/ui/Logo";
import { sportIcon } from "@/components/ui/SportIcons";
import { categoryNav, isActive, primaryNav } from "@/lib/nav";

// Full-screen editorial menu for < lg.
export default function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  const links = [...primaryNav, { label: "How It Works?", href: "/how-it-works" }];

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col bg-ink-1 transition-[opacity,visibility] duration-base ease-out lg:hidden ${
        open ? "visible opacity-100" : "invisible opacity-0"
      }`}
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
    >
      <div className="glow absolute -right-32 top-1/3 h-96 w-96" aria-hidden />
      <div className="frame flex h-[var(--topbar-h)] shrink-0 items-center justify-between border-b border-line">
        <Logo className="h-6 w-auto" />
        <button
          type="button"
          onClick={onClose}
          aria-label="Close menu"
          className="grid h-9 w-9 place-items-center rounded-sm border border-line-strong text-fg"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <nav className="frame relative flex-1 overflow-y-auto py-8" aria-label="Mobile">
        <ul>
          {links.map((l, i) => {
            const active = isActive(pathname, l.href);
            return (
              <li
                key={l.href}
                className="border-b border-line transition-[opacity,transform] duration-slow ease-out"
                style={{ transitionDelay: open ? `${80 + i * 50}ms` : "0ms", opacity: open ? 1 : 0, transform: open ? "none" : "translateY(16px)" }}
              >
                <Link href={l.href} className="flex items-baseline justify-between py-4">
                  <span className={`text-[2.5rem] font-bold leading-none tracking-[-0.04em] ${active ? "text-accent" : "text-fg"}`}>
                    {l.label}
                  </span>
                  <span className="font-mono text-[11px] text-fg-dim">0{i + 1}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        <p className="eyebrow mb-3 mt-10">Categories</p>
        <div className="flex flex-wrap gap-2">
          {categoryNav.map((c) => {
            const I = sportIcon[c.slug];
            return (
              <Link
                key={c.href}
                href={c.href}
                className={`flex h-10 items-center gap-2 rounded-sm border px-3.5 text-sm ${
                  pathname === c.href ? "border-accent text-accent" : "border-line-strong text-fg-2"
                }`}
              >
                <I aria-hidden className="h-4 w-4" />
                {c.label}
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="frame grid shrink-0 grid-cols-2 gap-3 border-t border-line py-5">
        <Button href="#" variant="secondary" size="lg">
          <LogIn className="h-4 w-4" /> Log in
        </Button>
        <Button href="#" variant="primary" size="lg" arrow>
          Submit Cards
        </Button>
      </div>
    </div>
  );
}
