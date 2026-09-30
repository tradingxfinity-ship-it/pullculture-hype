import Image from "next/image";
import { LiveDot } from "@/components/ui/Tag";
import type { Pull } from "@/lib/data";

// Compact "just pulled" ticket used in the live feed and on /recents.
export default function PullCard({ pull, showUser, className = "" }: { pull: Pull; showUser?: boolean; className?: string }) {
  return (
    <article className={`group flex gap-4 rounded-md border border-line bg-ink-2 p-3 transition-colors duration-base hover:border-line-strong ${className}`}>
      <div className="media relative aspect-[3/4] w-[88px] shrink-0 rounded-sm bg-ink-4">
        <Image src={pull.image} alt={pull.set} fill sizes="100px" className="object-contain p-1.5" />
      </div>
      <div className="flex min-w-0 flex-1 flex-col py-1">
        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.12em] text-accent">
          <LiveDot /> {pull.odds}
        </div>
        <h3 className="mt-2 truncate text-[15px] font-semibold tracking-[-0.01em] text-fg">{pull.pack}</h3>
        <p className="truncate text-[13px] text-fg-muted">{pull.set}</p>
        <div className="mt-auto flex items-center justify-between gap-2 pt-3 text-[11px] text-fg-dim">
          <span className="truncate">{showUser ? <>Pulled by <span className="text-accent">{pull.user}</span></> : pull.from}</span>
          <span className="shrink-0 font-mono">{pull.ago}</span>
        </div>
      </div>
    </article>
  );
}
