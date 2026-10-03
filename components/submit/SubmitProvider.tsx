"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import SubmitFlow from "./SubmitFlow";

const Ctx = createContext<{ open: () => void } | null>(null);

// Hosts the Submit Cards popup so any "Submit Cards" button can open it.
export default function SubmitProvider({ children }: { children: ReactNode }) {
  const [isOpen, setOpen] = useState(false);
  const [session, setSession] = useState(0); // fresh flow on every open
  const panel = useRef<HTMLDivElement>(null);

  const open = useCallback(() => {
    setSession((s) => s + 1);
    setOpen(true);
  }, []);
  const close = useCallback(() => setOpen(false), []);
  const value = useMemo(() => ({ open }), [open]);

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.activeElement as HTMLElement | null;
    document.documentElement.style.overflow = "hidden";
    const t = setTimeout(() => panel.current?.querySelector<HTMLElement>("button, input")?.focus(), 60);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "Tab" && panel.current) {
        const f = panel.current.querySelectorAll<HTMLElement>("a[href], button:not([disabled]), input, select, textarea");
        if (!f.length) return;
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t);
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      prev?.focus?.();
    };
  }, [isOpen, close]);

  return (
    <Ctx.Provider value={value}>
      {children}
      {isOpen && (
        <div className="fixed inset-0 z-[62]">
          <div onClick={close} className="modal-fade absolute inset-0 bg-black/80 backdrop-blur-md" />
          <div className="absolute inset-0 flex items-center justify-center p-3 sm:p-6" onClick={(e) => e.target === e.currentTarget && close()}>
            <div ref={panel} role="dialog" aria-modal="true" aria-label="Submit cards" className="modal-pop flex w-full max-w-[780px]">
              <SubmitFlow key={session} onClose={close} />
            </div>
          </div>
        </div>
      )}
    </Ctx.Provider>
  );
}

export function useSubmitCards() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useSubmitCards must be used inside <SubmitProvider>");
  return ctx;
}
