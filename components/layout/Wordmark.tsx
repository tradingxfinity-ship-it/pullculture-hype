"use client";

import { useEffect, useRef, useState } from "react";

// Oversized footer wordmark. The SVG viewBox is fitted to the rendered
// glyphs, so it spans the column exactly at any width. Outlines draw in
// when scrolled into view, a light runs around them on a loop, a glow
// follows the cursor and hovered letters fill faintly.

const LETTERS = ["H", "Y", "P", "3"];
const FONT = 100; // user units; everything else scales with the viewBox
const DASH = 900; // longer than any glyph outline, so draw-in ends complete

export default function Wordmark() {
  const svg = useRef<SVGSVGElement>(null);
  const text = useRef<SVGTextElement>(null);
  const spot = useRef<SVGRadialGradientElement>(null);
  const [box, setBox] = useState<{ x: number; y: number; w: number; h: number } | null>(null);
  const [unit, setUnit] = useState(0.2); // user units per CSS pixel
  const [inView, setInView] = useState(false);

  // Fit the viewBox to the glyphs once the font has loaded
  useEffect(() => {
    let off = false;
    const fit = () => {
      const t = text.current;
      if (!t || off) return;
      const b = t.getBBox();
      // getBBox height covers ascent/descent; crop to the cap height
      const ctx = document.createElement("canvas").getContext("2d");
      let cap = FONT * 0.72;
      if (ctx) {
        ctx.font = `900 ${FONT}px ${getComputedStyle(t).fontFamily}`;
        cap = ctx.measureText("H").actualBoundingBoxAscent || cap;
      }
      const pad = FONT * 0.02;
      setBox({ x: b.x - pad, y: -cap - pad, w: b.width + pad * 2, h: cap + pad * 2 });
    };
    document.fonts.ready.then(fit);
    return () => {
      off = true;
    };
  }, []);

  // Keep strokes about 1px whatever the rendered size
  useEffect(() => {
    const el = svg.current;
    if (!el || !box) return;
    const ro = new ResizeObserver(() => el.clientWidth && setUnit(box.w / el.clientWidth));
    ro.observe(el);
    return () => ro.disconnect();
  }, [box]);

  useEffect(() => {
    const el = svg.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && (setInView(true), io.disconnect()), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const move = (e: React.PointerEvent<SVGSVGElement>) => {
    const el = svg.current;
    const g = spot.current;
    const m = el?.getScreenCTM();
    if (!el || !g || !m) return;
    const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(m.inverse());
    g.setAttribute("cx", p.x.toFixed(1));
    g.setAttribute("cy", p.y.toFixed(1));
    el.style.setProperty("--spot", "1");
  };

  const glyphs = (cls: string) =>
    LETTERS.map((l, i) => (
      <tspan key={i} className={`${cls} ${i === LETTERS.length - 1 ? "is-accent" : ""}`} style={{ "--i": i } as React.CSSProperties}>
        {l}
      </tspan>
    ));
  const textProps = { x: 0, y: 0, fontSize: FONT, fontWeight: 900, letterSpacing: "-0.065em", fontFamily: "var(--font-sans)" } as const;

  return (
    <svg
      ref={svg}
      viewBox={box ? `${box.x} ${box.y} ${box.w} ${box.h}` : "0 -74 250 76"}
      className={`wordmark block w-full ${inView ? "is-in" : ""} ${box ? "" : "opacity-0"}`}
      style={{ "--dash": DASH } as React.CSSProperties}
      onPointerMove={move}
      onPointerLeave={() => svg.current?.style.setProperty("--spot", "0")}
      aria-hidden
    >
      <defs>
        <radialGradient ref={spot} id="wm-spot" gradientUnits="userSpaceOnUse" cx="0" cy="-36" r={FONT * 0.45}>
          <stop offset="0" stopColor="#75FBB5" stopOpacity="1" />
          <stop offset="1" stopColor="#75FBB5" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* base outline: draws in, hovered letters fill */}
      <text ref={text} {...textProps} strokeWidth={unit}>
        {glyphs("wm-base")}
      </text>
      {/* light running around the outlines */}
      <text {...textProps} strokeWidth={unit * 2} className="wm-layer">
        {glyphs("wm-comet")}
      </text>
      {/* cursor glow */}
      <text {...textProps} strokeWidth={unit * 1.5} stroke="url(#wm-spot)" fill="none" className="wm-layer wm-spot">
        {LETTERS.join("")}
      </text>
    </svg>
  );
}
