import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Tag from "@/components/ui/Tag";
import type { Post } from "@/lib/blog";

export default function PostCard({ post, index, className = "" }: { post: Post; index?: number; className?: string }) {
  return (
    <Link href={`/blog/${post.slug}`} className={`group block ${className}`}>
      <div className="media media-mono relative aspect-[4/3] rounded-md border border-line">
        <Image src={post.image} alt="" fill sizes="(min-width:1024px) 30vw, 90vw" className="object-cover" />
        <div className="absolute left-3 top-3">
          <Tag tone="accent" className="bg-black/60">
            {post.category}
          </Tag>
        </div>
      </div>
      <div className="mt-5 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.1em] text-fg-dim">
        {index !== undefined && <span className="text-accent">{String(index + 1).padStart(2, "0")}</span>}
        <span>{post.date}</span>
        <span className="h-px w-4 bg-line-strong" aria-hidden />
        <span>{post.read}</span>
      </div>
      <h3 className="mt-3 flex items-start justify-between gap-4 text-xl font-semibold leading-[1.15] tracking-[-0.025em] text-fg transition-colors duration-fast group-hover:text-accent">
        <span>{post.title}</span>
        <ArrowUpRight className="arrow-nudge mt-1 h-5 w-5 shrink-0 text-fg-dim group-hover:text-accent" />
      </h3>
      <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-fg-muted">{post.excerpt}</p>
    </Link>
  );
}
