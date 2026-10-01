"use client";

import { useState, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from "react";
import { ChevronDown, Eye, EyeOff } from "lucide-react";

// Shared form primitives (auth modal, submit cards).

export const inputCls =
  "h-12 w-full rounded-sm border border-line-strong bg-ink-2 px-4 text-[15px] text-fg outline-none transition-colors placeholder:text-fg-dim hover:border-white/25 focus:border-accent";

export const inlineLink = "font-medium text-accent underline-offset-4 hover:underline";

export function Field({ label, hint, children, className = "" }: { label: string; hint?: string; children: ReactNode; className?: string }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 flex items-baseline justify-between gap-3 font-mono text-[10px] uppercase tracking-[0.12em] text-fg-muted">
        {label}
        {hint && <span className="normal-case tracking-normal text-fg-dim">{hint}</span>}
      </span>
      {children}
    </label>
  );
}

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={inputCls} {...props} />;
}

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={`${inputCls} h-auto min-h-[112px] resize-y py-3 leading-relaxed`} {...props} />;
}

export function Select({ children, className = "", ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className={`relative ${className}`}>
      <select className={`${inputCls} appearance-none pr-10`} {...props}>
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-accent" />
    </div>
  );
}

export function PasswordInput(props: InputHTMLAttributes<HTMLInputElement>) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input className={`${inputCls} pr-12`} type={show ? "text" : "password"} {...props} />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        aria-label={show ? "Hide password" : "Show password"}
        className="absolute inset-y-0 right-0 grid w-12 place-items-center text-fg-dim transition-colors hover:text-fg"
      >
        {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );
}

export function Check({ children, required, name }: { children: ReactNode; required?: boolean; name: string }) {
  return (
    <label className="relative flex cursor-pointer items-start gap-3 text-sm text-fg-muted">
      <input
        type="checkbox"
        name={name}
        required={required}
        className="peer mt-0.5 h-[18px] w-[18px] shrink-0 cursor-pointer appearance-none rounded-[5px] border border-line-strong bg-ink-2 transition-colors checked:border-accent checked:bg-accent focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-accent"
      />
      <svg
        viewBox="0 0 16 16"
        className="pointer-events-none absolute left-px top-[3px] h-4 w-4 text-accent-ink opacity-0 peer-checked:opacity-100"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        aria-hidden
      >
        <path d="m4 8.5 2.5 2.5L12 5.5" />
      </svg>
      <span>{children}</span>
    </label>
  );
}
