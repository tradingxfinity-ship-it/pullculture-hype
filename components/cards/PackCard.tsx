import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Scissors } from "lucide-react";
import Tag from "@/components/ui/Tag";
import { usd, type Pack } from "@/lib/data";

type Props = { pack: Pack; index?: number; size?: "md" | "lg"; priority?: boolean; className?: string };

// Editorial pack tile: framed art, tier tag, index number, name + price.
export default function PackCard({ pack, index, size = "md", priority, className = "" }: Props) {
  const sizes = size === "lg" ? "(min-width:1024px) 40vw, 90vw" : "(min-width:1024px) 22vw, (min-width:640px) 40vw, 75vw";
  return (
    <Link href={`/pack/product/${pack.slug}`} className={`group block ${className}`}>
      <div className="media media-rip ticks aspect-square rounded-md border border-line">
        <Image src={pack.image} alt={pack.name} fill priority={priority} sizes={sizes} className="object-cover" />

        {/* "Rip this pack" hover: scissors cut a perforation under the seal, the strip above
            peels open and the inside of the pack glows. Geometry matches the pack art
            (pack spans ~25–75% wide, seal ends ~15% down). See "Pack rip" in globals.css. */}
        <div className="rip-gap" aria-hidden />
        <div className="rip-flap-shadow" aria-hidden>
          <div className="rip-flap">
            <Image src={pack.image} alt="" fill sizes={sizes} className="object-cover" />
          </div>
        </div>
        <div className="rip-line" aria-hidden>
          <Scissors className="rip-scissors" strokeWidth={2} />
        </div>

        <div className="absolute inset-0 z-[3] bg-gradient-to-t from-black/70 via-transparent to-black/20" aria-hidden />
        <div className="absolute inset-x-3 top-3 z-[4] flex items-start justify-between">
          <Tag tone={pack.tier.toLowerCase() as "silver" | "gold" | "platinum"} className="bg-black/40">
            {pack.tier}
          </Tag>
          {index !== undefined && <span className="font-mono text-[11px] text-fg/70">No.{String(index + 1).padStart(2, "0")}</span>}
        </div>
        <div className="absolute inset-x-3 bottom-3 z-[4] flex items-center justify-between opacity-0 transition-all duration-base ease-out group-hover:opacity-100 max-md:opacity-100">
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-fg/80">Rip this pack</span>
          <span className="grid h-9 w-9 place-items-center rounded-full bg-accent text-accent-ink">
            <ArrowUpRight className="arrow-nudge h-4 w-4" />
          </span>
        </div>
      </div>
      <div className="mt-4 flex items-baseline justify-between gap-4 border-b border-line pb-2">
        <p className="eyebrow">{pack.categoryLabel}</p>
        <span className={`font-mono tabular-nums text-fg ${size === "lg" ? "text-lg" : "text-[14px]"}`}>{usd(pack.price, true)}</span>
      </div>
      <h3
        className={`mt-2.5 font-semibold leading-tight tracking-[-0.02em] text-fg transition-colors duration-fast group-hover:text-accent ${
          size === "lg" ? "text-2xl" : "text-[17px]"
        }`}
      >
        {pack.name}
      </h3>
    </Link>
  );
}
