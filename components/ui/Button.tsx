"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useRef, type ComponentProps, type ReactNode } from "react";

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

const base =
  "group/btn relative inline-flex select-none items-center justify-center gap-2.5 whitespace-nowrap rounded-sm font-semibold tracking-[-0.01em] transition-[background,color,border-color,box-shadow,transform] duration-base ease-out active:scale-[0.98] disabled:pointer-events-none disabled:opacity-40";

const variants: Record<Variant, string> = {
  primary:
    "bg-accent text-accent-ink hover:shadow-[0_0_0_1px_rgba(117,251,181,0.5),0_10px_40px_-8px_rgba(117,251,181,0.45)]",
  secondary: "border border-line-strong bg-transparent text-fg hover:border-fg/60 hover:bg-white/[0.03]",
  ghost: "text-fg-muted hover:text-fg",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3.5 text-[13px]",
  md: "h-11 px-5 text-sm",
  lg: "h-14 px-7 text-[15px]",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  href,
  arrow,
  magnetic,
  full,
  className = "",
  ...rest
}: Props) {
  const ref = useRef<HTMLSpanElement>(null);

  // Subtle magnetic pull toward the cursor (desktop pointers only).
  const onMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!magnetic || !ref.current || !matchMedia("(pointer:fine)").matches) return;
    const r = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width / 2) * 0.18;
    const y = (e.clientY - r.top - r.height / 2) * 0.28;
    ref.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  };
  const onLeave = () => {
    if (ref.current) ref.current.style.transform = "";
  };

  const content = (
    <span
      ref={ref}
      className="inline-flex items-center gap-2.5 transition-transform duration-slow ease-out"
    >
      {children}
      {arrow && (
        <span className="relative inline-flex h-4 w-4 overflow-hidden" aria-hidden>
          <ArrowUpRight className="absolute h-4 w-4 transition-transform duration-base ease-out group-hover/btn:-translate-y-4 group-hover/btn:translate-x-4" />
          <ArrowUpRight className="absolute h-4 w-4 -translate-x-4 translate-y-4 transition-transform duration-base ease-out group-hover/btn:translate-x-0 group-hover/btn:translate-y-0" />
        </span>
      )}
    </span>
  );

  const cls = `${base} ${variants[variant]} ${sizes[size]} ${full ? "w-full" : ""} ${className}`;

  if (href) {
    return (
      <Link href={href} className={cls} onMouseMove={onMove} onMouseLeave={onLeave}>
        {content}
      </Link>
    );
  }
  return (
    <button className={cls} onMouseMove={onMove} onMouseLeave={onLeave} {...rest}>
      {content}
    </button>
  );
}
