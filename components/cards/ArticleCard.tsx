import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Tag from "@/components/ui/Tag";
import type { Article } from "@/lib/data";

export default function ArticleCard({ article, index, className = "" }: { article: Article; index?: number; className?: string }) {
  return (
    <Link href="/news" className={`group block ${className}`}>
      <div className="media media-mono relative aspect-[4/3] rounded-md border border-line">
        <Image src={article.image} alt="" fill sizes="(min-width:1024px) 30vw, 90vw" className="object-cover" />
        <div className="absolute left-3 top-3">
          <Tag tone="accent" className="bg-black/60">
            {article.category}
          </Tag>
        </div>
      </div>
      <div className="mt-5 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.1em] text-fg-dim">
        {index !== undefined && <span className="text-accent">{String(index + 1).padStart(2, "0")}</span>}
        <span>{article.date}</span>
        <span className="h-px w-4 bg-line-strong" aria-hidden />
        <span>{article.read}</span>
      </div>
      <h3 className="mt-3 flex items-start justify-between gap-4 text-xl font-semibold leading-[1.15] tracking-[-0.025em] text-fg transition-colors duration-fast group-hover:text-accent">
        <span>{article.title}</span>
        <ArrowUpRight className="arrow-nudge mt-1 h-5 w-5 shrink-0 text-fg-dim group-hover:text-accent" />
      </h3>
    </Link>
  );
}
