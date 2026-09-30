"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { faqs } from "@/lib/data";

export default function Faq() {
  const [open, setOpen] = useState<string | null>(faqs[0].items[0].q);

  return (
    <div className="space-y-14">
      {faqs.map((g) => (
        <div key={g.group}>
          <p className="eyebrow mb-4">{g.group}</p>
          <ul className="border-t border-line">
            {g.items.map((item) => {
              const on = open === item.q;
              const id = item.q.replace(/\W+/g, "-").toLowerCase();
              return (
                <li key={item.q} className="border-b border-line">
                  <button
                    type="button"
                    aria-expanded={on}
                    aria-controls={id}
                    onClick={() => setOpen(on ? null : item.q)}
                    className="group flex w-full items-center justify-between gap-6 py-6 text-left"
                  >
                    <span className={`text-xl font-semibold tracking-[-0.025em] transition-colors md:text-2xl ${on ? "text-accent" : "text-fg group-hover:text-accent"}`}>
                      {item.q}
                    </span>
                    <span
                      className={`grid h-10 w-10 shrink-0 place-items-center rounded-full border transition-all duration-base ease-out ${
                        on ? "rotate-45 border-accent bg-accent text-accent-ink" : "border-line-strong text-fg"
                      }`}
                    >
                      <Plus className="h-4 w-4" />
                    </span>
                  </button>
                  <div id={id} className={`grid transition-[grid-template-rows] duration-base ease-out ${on ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                    <div className="overflow-hidden">
                      <p className="max-w-2xl pb-8 text-[15px] leading-relaxed text-fg-muted">{item.a}</p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}
