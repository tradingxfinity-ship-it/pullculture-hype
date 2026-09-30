import type { ReactNode } from "react";
import type { Tier } from "@/lib/data";

type Tone = "default" | "accent" | "solid" | Lowercase<Tier>;

const tones: Record<Tone, string> = {
  default: "border-line-strong text-fg-muted",
  accent: "border-accent/40 text-accent",
  solid: "border-accent bg-accent text-accent-ink",
  silver: "border-tier-silver/30 text-tier-silver",
  gold: "border-tier-gold/40 text-tier-gold",
  platinum: "border-tier-platinum/35 text-tier-platinum",
};

export default function Tag({ children, tone = "default", className = "" }: { children: ReactNode; tone?: Tone; className?: string }) {
  return (
    <span
      className={`inline-flex h-6 items-center gap-1.5 rounded-[6px] border px-2 font-mono text-[10px] uppercase leading-none tracking-[0.12em] backdrop-blur-sm ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}

export function LiveDot({ className = "" }: { className?: string }) {
  return <span className={`inline-block h-1.5 w-1.5 shrink-0 animate-pulse-dot rounded-full bg-accent ${className}`} aria-hidden />;
}
