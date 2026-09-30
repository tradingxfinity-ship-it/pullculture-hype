import PageHeader from "@/components/ui/PageHeader";
import type { LegalDoc } from "@/lib/legal";

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

// Long-form policy layout: sticky contents rail + readable measure.
export default function LegalPage({ doc }: { doc: LegalDoc }) {
  const [first, ...restWords] = doc.title.split(" ");

  return (
    <>
      <PageHeader
        eyebrow="Policies"
        title={[first, <span key="r" className="text-fg-dim">{restWords.join(" ")}</span>]}
        meta={<p className="font-mono text-[11px] uppercase tracking-[0.12em] text-fg-muted">Last updated · {doc.updated}</p>}
      />
      <div className="frame grid-12 gap-y-10 py-14 md:py-20">
        <aside className="col-span-4 md:col-span-8 lg:col-span-3">
          <nav aria-label="Contents" className="lg:sticky lg:top-[calc(var(--topbar-h)+32px)]">
            <p className="eyebrow mb-4">Contents</p>
            <ol className="no-scrollbar space-y-2 border-l border-line lg:max-h-[70vh] lg:overflow-y-auto">
              {doc.sections.map((s) => (
                <li key={s.heading}>
                  <a href={`#${slug(s.heading)}`} className="-ml-px block border-l border-transparent py-0.5 pl-4 text-[13px] leading-snug text-fg-muted transition-colors hover:border-accent hover:text-fg">
                    {s.heading}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </aside>
        <article className="col-span-4 max-w-[70ch] md:col-span-8 lg:col-span-8 lg:col-start-5">
          {doc.intro.map((p, i) => (
            <p key={i} className="mb-5 text-lg leading-relaxed text-fg-2">
              {p}
            </p>
          ))}
          {doc.sections.map((s) => (
            <section key={s.heading} id={slug(s.heading)} className="scroll-mt-28 border-t border-line py-10 first:border-t-0 first:pt-0">
              <h2 className="mb-5 text-2xl font-semibold tracking-[-0.03em]">{s.heading}</h2>
              <div className="space-y-4 text-[15px] leading-[1.75] text-fg-muted">
                {s.body.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </section>
          ))}
        </article>
      </div>
    </>
  );
}
