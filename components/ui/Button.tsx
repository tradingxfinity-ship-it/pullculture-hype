"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Children, useRef, type ComponentProps, type ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

type Props = {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  href?: string;
  arrow?: boolean;
  magnetic?: boolean;
  full?: boolean;
  className?: string;
} & Omit<ComponentProps<"button">, "children">;

// Motion lives in globals.css (.btn*): letter roll, cursor spotlight,
// shine sweep (primary), liquid fill from the entry point (secondary),
// and a click ripple.
const base =
  "btn group/btn relative isolate inline-flex select-none items-center justify-center gap-2.5 overflow-hidden whitespace-nowrap rounded-sm font-semibold tracking-[-0.01em] transition-[background,color,border-color,box-shadow,transform] duration-base ease-out active:scale-[0.97] disabled:pointer-events-none disabled:opacity-40";

const variants: Record<Variant, string> = {
  primary:
    "btn-primary bg-accent text-accent-ink hover:shadow-[0_0_0_1px_rgba(117,251,181,0.5),0_10px_40px_-8px_rgba(117,251,181,0.55)]",
  secondary: "btn-secondary border border-line-strong bg-transparent text-fg hover:border-accent hover:text-accent-ink",
  ghost: "btn-ghost text-fg-muted hover:text-fg",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3.5 text-[13px]",
  md: "h-11 px-5 text-sm",
  lg: "h-14 px-7 text-[15px]",
};

// Split text children into per-letter spans so they can roll in a wave.
// Icons and other elements pass through untouched.
function splitLabel(children: ReactNode) {
  let i = 0;
  return Children.map(children, (node) =>
    typeof node === "string" ? (
      <span className="btn-word">
        {node.split("").map((ch) => (
          <span key={i} className="btn-ch" style={{ "--i": i++ } as React.CSSProperties}>
            {ch === " " ? " " : ch}
          </span>
        ))}
      </span>
    ) : (
      node
    ),
  );
}

const plainText = (children: ReactNode) =>
  Children.toArray(children)
    .filter((c) => typeof c === "string" || typeof c === "number")
    .join("")
    .trim();

export default function Button({
  children,
  variant = "primary",
  size = "md",
  href,
  arrow,
  magnetic,
  full,
  className = "",
  onPointerDown,
  ...rest
}: Props) {
  const ref = useRef<HTMLSpanElement>(null);

  // Track the pointer for the spotlight / fill origin, plus a subtle
  // magnetic pull toward the cursor (desktop pointers only).
  const track = (e: React.PointerEvent<HTMLElement>) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
    if (!magnetic || !ref.current || e.pointerType !== "mouse") return;
    const x = (e.clientX - r.left - r.width / 2) * 0.18;
    const y = (e.clientY - r.top - r.height / 2) * 0.28;
    ref.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  };
  const onLeave = (e: React.PointerEvent<HTMLElement>) => {
    track(e);
    if (ref.current) ref.current.style.transform = "";
  };

  // Click ripple from the press point.
  const ripple = (e: React.PointerEvent<HTMLElement>) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const size = Math.max(r.width, r.height) * 2.2;
    const dot = document.createElement("span");
    dot.className = "btn-ripple";
    dot.style.cssText = `left:${e.clientX - r.left}px;top:${e.clientY - r.top}px;width:${size}px;height:${size}px`;
    el.appendChild(dot);
    dot.addEventListener("animationend", () => dot.remove());
  };

  const label = plainText(children);

  const content = (
    <>
      <span className="btn-spot" aria-hidden />
      {variant === "primary" && <span className="btn-shine" aria-hidden />}
      {variant === "secondary" && <span className="btn-fill" aria-hidden />}
      <span ref={ref} className="relative z-[1] inline-flex items-center gap-2.5 transition-transform duration-slow ease-out">
        <span className="btn-label" aria-hidden={label ? true : undefined}>
          {splitLabel(children)}
        </span>
        {label && <span className="sr-only">{label}</span>}
        {arrow && (
          <span className="relative inline-flex h-4 w-4 overflow-hidden" aria-hidden>
            <ArrowUpRight className="absolute h-4 w-4 transition-transform duration-base ease-out group-hover/btn:-translate-y-4 group-hover/btn:translate-x-4" />
            <ArrowUpRight className="absolute h-4 w-4 -translate-x-4 translate-y-4 transition-transform duration-base ease-out group-hover/btn:translate-x-0 group-hover/btn:translate-y-0" />
          </span>
        )}
      </span>
    </>
  );

  const cls = `${base} ${variants[variant]} ${sizes[size]} ${full ? "w-full" : ""} ${className}`;
  const handlers = {
    onPointerEnter: track,
    onPointerMove: track,
    onPointerLeave: onLeave,
  };

  if (href) {
    return (
      <Link href={href} className={cls} {...handlers} onPointerDown={ripple}>
        {content}
      </Link>
    );
  }
  return (
    <button
      className={cls}
      {...handlers}
      onPointerDown={(e) => {
        ripple(e);
        onPointerDown?.(e as React.PointerEvent<HTMLButtonElement>);
      }}
      {...rest}
    >
      {content}
    </button>
  );
}
