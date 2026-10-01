import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";
import Reveal from "./Reveal";
import SplitHeading from "./SplitHeading";

type Props = {
  index?: string;
  label: string;
  title: ReactNode[];
  aside?: ReactNode;
  action?: { href: string; label?: string };
  className?: string;
};

// "01 — Label" eyebrow over an oversized, left-aligned headline, with an
// optional supporting note and "See all" action on the right.
export default function SectionHeader({ index, label, title, aside, action, className = "" }: Props) {
  return (
    <Reveal className={`grid-12 items-end gap-y-8 ${className}`}>
      <div className="col-span-4 md:col-span-8 lg:col-span-12">
        <div className="mb-6 flex items-center gap-3 md:mb-8">
          {index && <span className="font-mono text-[11px] tracking-[0.12em] text-accent">{index}</span>}
          <span className="h-px w-8 bg-accent/60" aria-hidden />
          <span className="eyebrow">{label}</span>
        </div>
      </div>
      <SplitHeading
        lines={title}
        className="col-span-4 text-display-md font-bold md:col-span-8 lg:col-span-8"
      />
      {(aside || action) && (
        <div className="col-span-4 flex flex-col items-start gap-6 md:col-span-8 lg:col-span-4 lg:items-end lg:text-right">
          {aside &&
            (typeof aside === "string" ? (
              <p className="max-w-sm text-[15px] leading-relaxed text-fg-muted">{aside}</p>
            ) : (
              <div>{aside}</div>
            ))}
          {action && (
            <Link href={action.href} className="group inline-flex items-center gap-2 text-sm font-medium text-fg">
              <span className="link-u">{action.label ?? "See all"}</span>
              <span className="grid h-8 w-8 place-items-center rounded-full border border-line-strong transition-colors duration-base group-hover:border-accent group-hover:bg-accent group-hover:text-accent-ink">
                <ArrowUpRight className="arrow-nudge h-3.5 w-3.5" />
              </span>
            </Link>
          )}
        </div>
      )}
    </Reveal>
  );
}
