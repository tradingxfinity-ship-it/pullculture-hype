import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import BlogGrid from "@/components/blog/BlogGrid";
import PageHeader from "@/components/ui/PageHeader";
import Reveal from "@/components/ui/Reveal";
import Tag from "@/components/ui/Tag";
import { posts } from "@/lib/blog";

export const metadata: Metadata = { title: "Blog", description: "Guides, collector stories and set breakdowns from the HYP3 team." };

export default function BlogPage() {
  const [f, ...rest] = posts;

  return (
    <>
      <PageHeader
        compact
        eyebrow="HYP3 Blog"
        title={[<>The Culture <em key="e" className="font-serif font-normal italic tracking-[-0.02em] text-accent">desk.</em></>]}
        meta={<p className="max-w-sm text-fg-muted">Guides, collector stories and set breakdowns from the HYP3 team.</p>}
      />

      {/* Featured */}
      <section className="frame py-12 md:py-16">
        <Reveal>
          <Link href={`/blog/${f.slug}`} className="group grid-12 items-end gap-y-8">
            <div className="media relative col-span-4 aspect-[16/10] rounded-lg border border-line md:col-span-8 lg:col-span-7">
              <Image src={f.image} alt="" fill priority sizes="(min-width:1024px) 55vw, 95vw" className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" aria-hidden />
              <div className="absolute left-4 top-4">
                <Tag tone="solid">Latest</Tag>
              </div>
            </div>
            <div className="col-span-4 md:col-span-8 lg:col-span-5">
              <Tag tone="accent">{f.category}</Tag>
              <h2 className="mt-5 text-[clamp(2rem,3.4vw,3.25rem)] font-bold leading-[1] tracking-[-0.04em] text-fg transition-colors duration-fast group-hover:text-accent">
                {f.title}
              </h2>
              <p className="mt-5 max-w-md leading-relaxed text-fg-muted">{f.excerpt}</p>
              <div className="mt-6 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.1em] text-fg-dim">
                <span>{f.date}</span>
                <span className="h-px w-4 bg-line-strong" />
                <span>{f.read}</span>
              </div>
              <span className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-fg">
                <span className="link-u">Read the post</span>
                <ArrowUpRight className="arrow-nudge h-4 w-4 text-accent" />
              </span>
            </div>
          </Link>
        </Reveal>
      </section>

      <section className="border-t border-line bg-ink-1 py-section">
        <div className="frame">
          <BlogGrid posts={rest} />
        </div>
      </section>
    </>
  );
}
