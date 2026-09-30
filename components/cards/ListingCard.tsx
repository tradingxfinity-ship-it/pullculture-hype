import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import Tag from "@/components/ui/Tag";
import { usd, type Listing } from "@/lib/data";

// Marketplace listing: slabbed card on a lit stage, metadata below.
export default function ListingCard({ item, className = "" }: { item: Listing; className?: string }) {
  return (
    <Link href={`/marketplace/${encodeURIComponent(item.name)}`} className={`group flex flex-col ${className}`}>
      <div className="media relative aspect-[4/5] rounded-md border border-line bg-gradient-to-b from-ink-4 to-ink-2 transition-colors duration-base group-hover:border-line-strong">
        <div className="absolute inset-x-8 bottom-4 h-8 rounded-[50%] bg-black/80 blur-xl" aria-hidden />
        <div className="glow absolute left-1/2 top-1/2 h-2/3 w-2/3 -translate-x-1/2 -translate-y-1/2 opacity-0 transition-opacity duration-slow group-hover:opacity-100" aria-hidden />
        <Image src={item.image} alt={`${item.name} ${item.set}`} fill sizes="(min-width:1024px) 22vw, 45vw" className="object-contain p-[12%]" />
        <div className="absolute inset-x-3 top-3 flex items-center justify-between">
          <Tag tone={item.type === "auction" ? "accent" : "default"} className="bg-black/50">
            {item.type === "auction" ? "Auction" : "Buy now"}
          </Tag>
          <span className="flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.1em] text-fg-muted">
            <Clock className="h-3 w-3" /> {item.endsIn}
          </span>
        </div>
      </div>
      <div className="flex flex-1 flex-col pt-4">
        <p className="eyebrow">
          {item.set} · {item.number}
        </p>
        <h3 className="mt-1.5 text-[17px] font-semibold tracking-[-0.02em] text-fg transition-colors duration-fast group-hover:text-accent">
          {item.name}
        </h3>
        <div className="mt-4 flex items-end justify-between border-t border-line pt-3">
          <div>
            <p className="font-mono text-lg tabular-nums text-fg">{usd(item.price)}</p>
            <p className="text-xs text-fg-dim">{item.type === "auction" ? `${item.bids} bids` : "Fixed price"}</p>
          </div>
          <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-accent">
            {item.type === "auction" ? "Bid Now" : "Buy Now"}
            <ArrowRight className="arrow-nudge-x h-3.5 w-3.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
