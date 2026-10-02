"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { CheckCircle2, Info, X } from "lucide-react";

type Toast = { id: number; message: string; tone: "success" | "info" };
const Ctx = createContext<((message: string, tone?: Toast["tone"]) => void) | null>(null);

// Small confirmation toasts, bottom-right, auto-dismiss after 4s. Sit above the
// 72px sticky bottom bars (buy bar, vault bulk actions) so they never cover them.
export default function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const dismiss = (id: number) => setToasts((t) => t.filter((x) => x.id !== id));
  const toast = useCallback((message: string, tone: Toast["tone"] = "success") => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t.slice(-2), { id, message, tone }]);
    setTimeout(() => dismiss(id), 4000);
  }, []);

  return (
    <Ctx.Provider value={toast}>
      {children}
      <div className="pointer-events-none fixed bottom-[88px] right-4 z-[70] flex w-[min(380px,calc(100vw-32px))] flex-col gap-2" aria-live="polite">
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className="toast-in pointer-events-auto flex items-start gap-3 rounded-md border border-line-strong bg-ink-3/95 p-4 text-sm text-fg-2 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.9)] backdrop-blur-xl"
          >
            {t.tone === "success" ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" /> : <Info className="mt-0.5 h-4 w-4 shrink-0 text-accent" />}
            <span className="flex-1 leading-relaxed">{t.message}</span>
            <button type="button" onClick={() => dismiss(t.id)} aria-label="Dismiss" className="text-fg-dim hover:text-fg">
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </Ctx.Provider>
  );
}

export function useToast() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
}
