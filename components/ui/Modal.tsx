"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import { X } from "lucide-react";

// Accessible dialog: Esc / backdrop close, focus trap, scroll lock,
// focus returned to the trigger on close.
export default function Modal({
  open,
  onClose,
  title,
  description,
  children,
  size = "md",
}: {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  size?: "md" | "lg";
}) {
  const panel = useRef<HTMLDivElement>(null);
  const titleId = useId();

  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    document.documentElement.style.overflow = "hidden";
    const t = setTimeout(() => panel.current?.querySelector<HTMLElement>("input, select, textarea, button:not([data-close])")?.focus(), 50);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
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
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[65]">
      <div onClick={onClose} className="modal-fade absolute inset-0 bg-black/75 backdrop-blur-md" />
      <div className="absolute inset-0 overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-3 sm:items-center sm:p-6" onClick={(e) => e.target === e.currentTarget && onClose()}>
          <div
            ref={panel}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className={`modal-pop relative w-full overflow-hidden rounded-lg border border-line bg-ink-1 shadow-[0_40px_120px_-20px_rgba(0,0,0,0.9)] ${size === "lg" ? "max-w-[640px]" : "max-w-[460px]"}`}
          >
            <div className="glow absolute -top-32 left-1/2 h-56 w-[420px] -translate-x-1/2" aria-hidden />
            <div className="relative p-6 sm:p-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 id={titleId} className="text-2xl font-bold tracking-[-0.035em]">
                    {title}
                  </h2>
                  {description && <p className="mt-1.5 text-sm text-fg-muted">{description}</p>}
                </div>
                <button
                  type="button"
                  data-close
                  onClick={onClose}
                  aria-label="Close"
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-sm border border-line-strong text-fg transition-colors hover:border-accent hover:text-accent"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-6">{children}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
