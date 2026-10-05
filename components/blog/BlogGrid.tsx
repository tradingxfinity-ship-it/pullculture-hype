"use client";

import { useState } from "react";
import PostCard from "./PostCard";
import Reveal from "@/components/ui/Reveal";
import { blogCategories, type Post } from "@/lib/blog";

// Post list with category filter chips.
export default function BlogGrid({ posts }: { posts: Post[] }) {
  const [cat, setCat] = useState<(typeof blogCategories)[number]>("All");
  const shown = cat === "All" ? posts : posts.filter((p) => p.category === cat);

  return (
    <>
      <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <h2 className="text-display-sm font-bold">Latest posts</h2>
        <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 md:mx-0 md:px-0" role="group" aria-label="Filter by category">
          {blogCategories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCat(c)}
              aria-pressed={cat === c}
              className={`h-9 shrink-0 rounded-sm border px-4 font-mono text-[11px] uppercase tracking-[0.12em] transition-colors duration-fast ${
                cat === c ? "border-accent bg-accent text-accent-ink" : "border-line-strong text-fg-muted hover:border-white/30 hover:text-fg"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div key={cat} className="grid grid-cols-1 gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((p, i) => (
          <Reveal key={p.slug} delay={(i % 3) * 80}>
            <PostCard post={p} index={i} />
          </Reveal>
        ))}
      </div>
    </>
  );
}
