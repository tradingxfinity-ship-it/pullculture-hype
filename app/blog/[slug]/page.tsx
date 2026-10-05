import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import PostCard from "@/components/blog/PostCard";
import Logo from "@/components/ui/Logo";
import Reveal from "@/components/ui/Reveal";
import Tag from "@/components/ui/Tag";
import { getPost, posts, type Block } from "@/lib/blog";

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const post = getPost((await params).slug);
  return post ? { title: post.title, description: post.excerpt } : { title: "Blog" };
}

function BlockView({ b }: { b: Block }) {
  if ("h" in b) return <h2 className="mt-12 text-2xl font-bold tracking-[-0.03em] text-fg md:text-[28px]">{b.h}</h2>;
  if ("list" in b)
    return (
      <ul className="mt-5 space-y-3">
        {b.list.map((li) => (
          <li key={li} className="flex gap-3 text-fg-2">
            <span className="mt-[11px] h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
            <span>{li}</span>
          </li>
        ))}
      </ul>
    );
  if ("quote" in b)
    return (
      <blockquote className="my-10 border-l-2 border-accent pl-6 font-serif text-[clamp(1.6rem,3vw,2.25rem)] italic leading-[1.15] tracking-[-0.01em] text-fg">
        {b.quote}
      </blockquote>
    );
  return <p className="mt-5 text-fg-2">{b.p}</p>;
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const post = getPost((await params).slug);
  if (!post) notFound();
  const more = [...posts.filter((p) => p.slug !== post.slug && p.category === post.category), ...posts.filter((p) => p.slug !== post.slug && p.category !== post.category)].slice(0, 3);

  return (
    <>
      <article>
        <header className="relative overflow-hidden border-b border-line">
          <div className="grid-bg absolute inset-0 opacity-50" aria-hidden />
          <div className="glow absolute -right-20 -top-40 h-[420px] w-[620px]" aria-hidden />
          <div className="frame relative py-10 md:py-14">
            <Link href="/blog" className="group inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.12em] text-fg-muted hover:text-fg">
              <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" /> Blog
            </Link>
            <Reveal className="mt-8 max-w-4xl">
              <Tag tone="accent">{post.category}</Tag>
              <h1 className="mt-5 text-[clamp(2.25rem,5.5vw,4.5rem)] font-bold leading-[0.95] tracking-[-0.05em]">{post.title}</h1>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-fg-muted">{post.excerpt}</p>
              <div className="mt-8 flex flex-wrap items-center gap-3 font-mono text-[11px] uppercase tracking-[0.1em] text-fg-dim">
                <span className="inline-flex items-center gap-2 text-fg-2">
                  <span className="grid h-7 w-7 place-items-center rounded-full border border-line-strong bg-ink-2">
                    <Logo link={false} className="h-2.5 w-auto" />
                  </span>
                  HYP3 Team
                </span>
                <span className="h-px w-4 bg-line-strong" />
                <span>{post.date}</span>
                <span className="h-px w-4 bg-line-strong" />
                <span>{post.read}</span>
              </div>
            </Reveal>
          </div>
        </header>

        <div className="frame py-12 md:py-16">
          <Reveal className="media relative mx-auto aspect-[16/8] max-w-5xl overflow-hidden rounded-lg border border-line">
            <Image src={post.image} alt="" fill priority sizes="(min-width:1024px) 960px, 95vw" className="object-cover" />
          </Reveal>
          <div className="mx-auto mt-12 max-w-[680px] text-[17px] leading-[1.75]">
            {post.body.map((b, i) => (
              <BlockView key={i} b={b} />
            ))}
          </div>
        </div>
      </article>

      <section className="border-t border-line bg-ink-1 py-section">
        <div className="frame">
          <div className="mb-12 flex items-end justify-between gap-6">
            <h2 className="text-display-sm font-bold">Keep reading</h2>
            <Link href="/blog" className="link-u text-sm font-medium text-fg">
              All posts
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {more.map((p) => (
              <PostCard key={p.slug} post={p} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
