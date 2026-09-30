import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import ArticleCard from "@/components/cards/ArticleCard";
import PageHeader from "@/components/ui/PageHeader";
import Reveal from "@/components/ui/Reveal";
import Tag from "@/components/ui/Tag";
import { articles, featuredArticle as f } from "@/lib/data";

export const metadata: Metadata = { title: "News" };

export default function NewsPage() {
  const [lead, ...rest] = articles;

  return (
    <>
      <PageHeader
        eyebrow="HYP3 News"
        title={["The", <>Culture <em key="e" className="font-serif font-normal italic tracking-[-0.02em] text-accent">desk.</em></>]}
        intro="Guides, collector stories and set breakdowns from the HYP3 team."
      />

      {/* Featured */}
      <section className="frame py-14 md:py-20">
        <p className="eyebrow mb-8">Featured News</p>
        <Reveal>
          <Link href="/news" className="group grid-12 items-end gap-y-8">
            <div className="media relative col-span-4 aspect-[16/10] rounded-lg border border-line md:col-span-8 lg:col-span-8">
              <Image src={f.image} alt="" fill priority sizes="(min-width:1024px) 60vw, 95vw" className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" aria-hidden />
              <div className="absolute left-4 top-4">
                <Tag tone="solid">Cover story</Tag>
              </div>
            </div>
            <div className="col-span-4 md:col-span-8 lg:col-span-4">
              <Tag tone="accent">{f.category}</Tag>
              <h2 className="mt-5 text-[clamp(2rem,3.4vw,3.25rem)] font-bold leading-[1] tracking-[-0.04em] text-fg transition-colors duration-fast group-hover:text-accent">
                {f.title}
              </h2>
              <div className="mt-6 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.1em] text-fg-dim">
                <span>{f.date}</span>
                <span className="h-px w-4 bg-line-strong" />
                <span>{f.read}</span>
              </div>
              <span className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-fg">
                <span className="link-u">Read the story</span>
                <ArrowUpRight className="arrow-nudge h-4 w-4 text-accent" />
              </span>
            </div>
          </Link>
        </Reveal>
      </section>

      {/* Recent */}
      <section className="border-t border-line bg-ink-1 py-section">
        <div className="frame">
          <Reveal className="mb-12 flex items-end justify-between">
            <h2 className="text-display-sm font-bold">Recent News</h2>
            <span className="eyebrow">{String(articles.length).padStart(2, "0")} stories</span>
          </Reveal>

          <div className="grid-12 gap-y-14">
            <Reveal className="col-span-4 md:col-span-8 lg:col-span-6">
              <ArticleCard article={lead} index={0} />
            </Reveal>
            <div className="col-span-4 grid grid-cols-1 gap-y-14 sm:grid-cols-2 sm:gap-x-6 md:col-span-8 lg:col-span-6">
              {rest.slice(0, 2).map((a, i) => (
                <Reveal key={a.title} delay={(i + 1) * 80}>
                  <ArticleCard article={a} index={i + 1} />
                </Reveal>
              ))}
            </div>
            {rest.slice(2).map((a, i) => (
              <Reveal key={a.title} delay={(i % 3) * 80} className="col-span-4 md:col-span-4 lg:col-span-4">
                <ArticleCard article={a} index={i + 3} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
