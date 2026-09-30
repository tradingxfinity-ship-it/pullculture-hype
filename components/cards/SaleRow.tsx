import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { usd, type Sale } from "@/lib/data";

// Ledger-style row. Collapses to a stacked layout below md.
export default function SaleRow({ sale, index, showBuyer }: { sale: Sale; index: number; showBuyer?: boolean }) {
  return (
    <Link
      href="/recents?tab=RECENT+SALES"
      className="group relative grid grid-cols-[56px_1fr_auto] items-center gap-4 border-b border-line py-4 transition-colors duration-base hover:bg-white/[0.02] md:grid-cols-[32px_64px_minmax(0,1fr)_130px_96px_36px] md:gap-5 md:px-2"
    >
      <span className="hidden font-mono text-[11px] text-fg-dim md:block">{String(index + 1).padStart(2, "0")}</span>
      <div className="media relative aspect-[3/4] w-14 rounded-[6px] bg-ink-4 md:w-16">
        <Image src={sale.image} alt={sale.set} fill sizes="64px" className="object-contain p-1" />
      </div>
      <div className="min-w-0">
        <h3 className="truncate text-[15px] font-semibold tracking-[-0.01em] text-fg transition-colors duration-fast group-hover:text-accent md:text-base">
          {sale.set}
        </h3>
        <p className="truncate text-[13px] text-fg-muted">{sale.detail}</p>
        <p className="mt-1 truncate font-mono text-[11px] text-fg-dim">
          <span className="md:hidden">{sale.ago} · </span>
          {showBuyer ? (
            <>
              Buyer <span className="text-accent">{sale.buyer}</span>
            </>
          ) : (
            sale.pack
          )}
        </p>
      </div>
      <p className="hidden font-mono text-[12px] text-fg-dim md:block">{sale.ago}</p>
      <p className="text-right font-mono text-base tabular-nums text-fg md:text-lg">{usd(sale.price)}</p>
      <span className="hidden h-9 w-9 place-items-center justify-self-end rounded-full border border-line-strong transition-colors duration-base group-hover:border-accent group-hover:bg-accent group-hover:text-accent-ink md:grid">
        <ArrowUpRight className="arrow-nudge h-4 w-4" />
        <span className="sr-only">View Sale</span>
      </span>
    </Link>
  );
}
