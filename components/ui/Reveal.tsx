"use client";

import { createElement, useEffect, useRef, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  as?: keyof React.JSX.IntrinsicElements;
  delay?: number;
  className?: string;
  id?: string;
};

// Fades + lifts its children in once they enter the viewport.
export default function Reveal({ children, as = "div", delay = 0, className = "", id }: Props) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.dataset.reveal = "in";
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.05 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return createElement(
    as,
    { ref, id, className, "data-reveal": "", style: { "--reveal-delay": `${delay}ms` } as React.CSSProperties },
    children,
  );
}
