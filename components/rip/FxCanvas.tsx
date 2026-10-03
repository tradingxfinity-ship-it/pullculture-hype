"use client";

import { useCallback, useEffect, useImperativeHandle, useRef, type Ref } from "react";

// Lightweight particle layer for the pack opening: foil shards that tumble
// and glint, and additive sparks with short trails. Draws only while
// particles are alive and does nothing for reduced-motion users.

export type BurstOpts = {
  count: number;
  colors: string[];
  kind?: "shard" | "spark";
  /** Direction in radians (0 = right, -PI/2 = up) and the spread around it */
  angle?: number;
  spread?: number;
  speed?: [number, number];
  gravity?: number;
  size?: [number, number];
  life?: [number, number];
  /** Spawn along a horizontal span (px) instead of a single point */
  width?: number;
};

export type FxHandle = {
  /** Burst from a point given as fractions of an element's box */
  burstAt: (el: Element | null, fx: number, fy: number, o: BurstOpts) => void;
};

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rot: number;
  vr: number;
  flip: number;
  vf: number;
  size: number;
  color: string;
  age: number;
  life: number;
  kind: "shard" | "spark";
  g: number;
};

const rand = (a: number, b: number) => a + Math.random() * (b - a);

export default function FxCanvas({ ref }: { ref?: Ref<FxHandle> }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const parts = useRef<Particle[]>([]);
  const raf = useRef(0);
  const last = useRef(0);

  const tick = useCallback((t: number) => {
    const c = canvas.current;
    const ctx = c?.getContext("2d");
    if (!c || !ctx) return;
    const dt = Math.min(0.04, (t - (last.current || t)) / 1000) || 0.016;
    last.current = t;
    const dpr = c.width / c.clientWidth || 1;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, c.clientWidth, c.clientHeight);

    const alive: Particle[] = [];
    for (const p of parts.current) {
      p.age += dt;
      if (p.age >= p.life) continue;
      alive.push(p);
      const drag = p.kind === "shard" ? 0.985 : 0.97;
      p.vx *= drag;
      p.vy = p.vy * drag + p.g * dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.rot += p.vr * dt;
      p.flip += p.vf * dt;
      const k = p.age / p.life;
      const alpha = 1 - k * k;

      if (p.kind === "shard") {
        const face = Math.cos(p.flip);
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.scale(1, Math.max(0.08, Math.abs(face)));
        ctx.globalAlpha = alpha;
        // catch the light when the shard faces the viewer
        ctx.fillStyle = Math.abs(face) > 0.94 ? "#ffffff" : p.color;
        ctx.fillRect(-p.size / 2, -p.size * 0.32, p.size, p.size * 0.64);
        ctx.restore();
      } else {
        ctx.globalCompositeOperation = "lighter";
        ctx.globalAlpha = alpha;
        ctx.strokeStyle = p.color;
        ctx.lineWidth = p.size;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x - p.vx * 0.035, p.y - p.vy * 0.035);
        ctx.stroke();
        ctx.globalCompositeOperation = "source-over";
      }
    }
    ctx.globalAlpha = 1;
    parts.current = alive;
    if (alive.length) raf.current = requestAnimationFrame(tick);
    else {
      raf.current = 0;
      last.current = 0;
    }
  }, []);

  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  useImperativeHandle(
    ref,
    () => ({
      burstAt(el, fx, fy, o) {
        const c = canvas.current;
        if (!c || !el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        const dpr = Math.min(2, window.devicePixelRatio || 1);
        if (c.width !== Math.round(c.clientWidth * dpr)) c.width = Math.round(c.clientWidth * dpr);
        if (c.height !== Math.round(c.clientHeight * dpr)) c.height = Math.round(c.clientHeight * dpr);

        const box = c.getBoundingClientRect();
        const r = el.getBoundingClientRect();
        const ox = r.left - box.left + r.width * fx;
        const oy = r.top - box.top + r.height * fy;
        const { count, colors, kind = "shard", angle = -Math.PI / 2, spread = Math.PI, speed = [200, 600], gravity = 900, size = [5, 11], life = [0.9, 1.8], width = 0 } = o;

        for (let i = 0; i < count; i++) {
          const a = angle + rand(-spread / 2, spread / 2);
          const v = rand(speed[0], speed[1]);
          parts.current.push({
            x: ox + (width ? rand(-width / 2, width / 2) : 0),
            y: oy,
            vx: Math.cos(a) * v,
            vy: Math.sin(a) * v,
            rot: rand(0, Math.PI * 2),
            vr: rand(-9, 9),
            flip: rand(0, Math.PI * 2),
            vf: rand(6, 16),
            size: rand(size[0], size[1]),
            color: colors[i % colors.length],
            age: 0,
            life: rand(life[0], life[1]),
            kind,
            g: gravity,
          });
        }
        if (!raf.current) raf.current = requestAnimationFrame(tick);
      },
    }),
    [tick],
  );

  return <canvas ref={canvas} className="pointer-events-none absolute inset-0 z-30 h-full w-full" aria-hidden />;
}
