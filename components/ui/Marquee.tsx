import type { ReactNode } from "react";

// Seamless infinite marquee. Content is duplicated once; the track slides
// by exactly half its width. Pauses on hover.
export default function Marquee({
  children,
  duration = 40,
  reverse,
  className = "",
}: {
  children: ReactNode;
  duration?: number;
  reverse?: boolean;
  className?: string;
}) {
  return (
    <div className={`group/mq relative flex overflow-hidden ${className}`}>
      <div
        className="flex w-max shrink-0 animate-marquee group-hover/mq:[animation-play-state:paused]"
        style={{ "--marquee-dur": `${duration}s`, animationDirection: reverse ? "reverse" : "normal" } as React.CSSProperties}
      >
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
}
