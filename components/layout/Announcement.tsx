"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import Marquee from "@/components/ui/Marquee";
import { announcements } from "@/lib/data";

// Slim ticker above the top bar. Dismissal is remembered for the session.
export default function Announcement() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem("hyp3:ticker") === "off") setHidden(true);
    } catch {}
  }, []);

  if (hidden) return null;

  return (
    <div className="relative z-30 flex h-9 items-center border-b border-line bg-ink-0 text-fg-muted">
      <Marquee duration={45} className="flex-1 [mask-image:linear-gradient(to_right,transparent,#000_6%,#000_94%,transparent)]">
        {announcements.map((a) => (
          <span key={a} className="flex items-center font-mono text-[11px] uppercase tracking-[0.14em]">
            <span className="px-6">{a}</span>
            <span className="text-accent" aria-hidden>
              ✦
            </span>
          </span>
        ))}
      </Marquee>
      <button
        type="button"
        aria-label="Dismiss announcements"
        onClick={() => {
          setHidden(true);
          try {
            sessionStorage.setItem("hyp3:ticker", "off");
          } catch {}
        }}
        className="grid h-9 w-10 shrink-0 place-items-center border-l border-line transition-colors hover:text-fg"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
