import type { ReactNode } from "react";
import Reveal from "./Reveal";
import SplitHeading from "./SplitHeading";

// Opening block for inner pages: eyebrow, oversized title, optional intro
// and a right-hand metadata slot. Sits on a subtle glow + grid backdrop.
export default function PageHeader({
  eyebrow,
  title,
  intro,
  meta,
  children,
}: {
  eyebrow: string;
  title: ReactNode[];
  intro?: ReactNode;
  meta?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <header className="relative overflow-hidden border-b border-line">
      <div className="grid-bg absolute inset-0 opacity-50" aria-hidden />
      <div className="glow absolute -right-20 -top-40 h-[420px] w-[620px]" aria-hidden />
      <div className="frame relative pb-12 pt-14 md:pb-16 md:pt-20">
        <Reveal className="grid-12 items-end gap-y-8">
          <div className="col-span-4 md:col-span-8 lg:col-span-8">
            <div className="mb-6 flex items-center gap-3">
              <span className="h-px w-8 bg-accent/60" aria-hidden />
              <span className="eyebrow text-accent">{eyebrow}</span>
            </div>
            <SplitHeading as="h1" lines={title} className="text-display-lg font-bold" />
          </div>
          {(intro || meta) && (
            <div className="col-span-4 md:col-span-8 lg:col-span-4 lg:pb-2">
              {meta && <div className="mb-5">{meta}</div>}
              {intro && <p className="max-w-md text-[15px] leading-relaxed text-fg-muted">{intro}</p>}
            </div>
          )}
        </Reveal>
        {children}
      </div>
    </header>
  );
}
