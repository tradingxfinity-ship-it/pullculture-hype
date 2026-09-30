import type { ReactNode } from "react";

// Headline whose lines slide up out of a mask. Wrap in <Reveal> (or add
// .is-in to an ancestor) to trigger the motion.
export default function SplitHeading({
  lines,
  as: Tag = "h2",
  className = "",
  stagger = 90,
}: {
  lines: ReactNode[];
  as?: "h1" | "h2" | "h3";
  className?: string;
  stagger?: number;
}) {
  return (
    <Tag className={className}>
      {lines.map((line, i) => (
        <span key={i} className="line-mask">
          <span style={{ "--line-delay": `${i * stagger}ms` } as React.CSSProperties}>{line}</span>
        </span>
      ))}
    </Tag>
  );
}
