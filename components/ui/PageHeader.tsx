import type { ReactNode } from "react";
import Reveal from "./Reveal";
import SplitHeading from "./SplitHeading";

// Opening block for inner pages: eyebrow, oversized title, optional intro
// and a right-hand metadata slot. Sits on a subtle glow + grid backdrop.
// `compact` sets the title on a single line with tighter spacing, and lets
// `meta` fill the remaining width beside it.
export default function PageHeader({
  eyebrow,
  title,
  intro,
  meta,
  children,
  compact,
}: {
  eyebrow: string;
  title: ReactNode[];
  intro?: ReactNode;
  meta?: ReactNode;
  children?: ReactNode;
  compact?: boolean;
}) {
  return (
    <header className="relative overflow-hidden border-b border-line">
      <div className="grid-bg absolute inset-0 opacity-50" aria-hidden />
      <div className="glow absolute -right-20 -top-40 h-[420px] w-[620px]" aria-hidden />
      <div className={`frame relative ${compact ? "py-8 md:py-10" : "pb-12 pt-14 md:pb-16 md:pt-20"}`}>
        <Reveal className={compact ? "flex flex-col gap-6 lg:flex-row lg:items-end lg:gap-12" : "grid-12 items-end gap-y-8"}>
          <div className={compact ? "shrink-0" : "col-span-4 md:col-span-8 lg:col-span-8"}>
            <div className={`flex items-center gap-3 ${compact ? "mb-4" : "mb-6"}`}>
              <span className="h-px w-8 bg-accent/60" aria-hidden />
              <span className="eyebrow text-accent">{eyebrow}</span>
            </div>
            <SplitHeading
              as="h1"
              lines={title}
              className={
                compact
                  ? "text-[clamp(2.75rem,7vw,7rem)] font-bold leading-[0.9] tracking-[-0.055em] sm:whitespace-nowrap"
                  : "text-display-lg font-bold"
              }
            />
          </div>
          {(intro || meta) && (
            <div className={compact ? "min-w-0 flex-1" : "col-span-4 md:col-span-8 lg:col-span-4 lg:pb-2"}>
              {meta && <div className={intro ? "mb-5" : undefined}>{meta}</div>}
              {intro && <p className="max-w-md text-[15px] leading-relaxed text-fg-muted">{intro}</p>}
            </div>
          )}
        </Reveal>
        {children}
      </div>
    </header>
  );
}
