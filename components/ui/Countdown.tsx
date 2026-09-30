"use client";

import { useEffect, useState } from "react";

const pad = (n: number) => String(n).padStart(2, "0");

// Ticks down from a fixed duration (seconds) measured from first render.
export function useCountdown(seconds: number) {
  const [left, setLeft] = useState(seconds);
  useEffect(() => {
    const end = Date.now() + seconds * 1000;
    const t = setInterval(() => setLeft(Math.max(0, Math.round((end - Date.now()) / 1000))), 1000);
    return () => clearInterval(t);
  }, [seconds]);
  return {
    d: Math.floor(left / 86400),
    h: Math.floor((left % 86400) / 3600),
    m: Math.floor((left % 3600) / 60),
    s: left % 60,
  };
}

export default function Countdown({ seconds, className = "" }: { seconds: number; className?: string }) {
  const { d, h, m, s } = useCountdown(seconds);
  const parts: [string, number][] = [
    ["Days", d],
    ["Hours", h],
    ["Min", m],
    ["Sec", s],
  ];
  return (
    <div className={`flex items-start gap-3 sm:gap-5 ${className}`} role="timer">
      {parts.map(([label, v], i) => (
        <div key={label} className="flex items-start gap-3 sm:gap-5">
          <div className="text-center">
            <div className="font-mono text-2xl tabular-nums text-fg sm:text-3xl">{pad(v)}</div>
            <div className="eyebrow mt-1 !text-[10px]">{label}</div>
          </div>
          {i < parts.length - 1 && <span className="font-mono text-2xl text-fg-dim sm:text-3xl">:</span>}
        </div>
      ))}
    </div>
  );
}
