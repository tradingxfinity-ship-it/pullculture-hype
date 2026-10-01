"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState, type InputHTMLAttributes, type ReactNode } from "react";
import { ChevronDown, Eye, EyeOff, Info, X } from "lucide-react";
import Button from "@/components/ui/Button";
import Logo from "@/components/ui/Logo";

export type AuthMode = "login" | "signup";

// No auth backend exists yet. Forms validate, then explain that instead of
// pretending to sign anyone in. Replace `submit` with the real call.
const NOT_CONNECTED = "Accounts aren’t connected yet — nothing was sent. This will work once sign-in launches.";

const GoogleLogo = () => (
  <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" aria-hidden>
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.31v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.09Z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z" />
    <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.07H2.18a11 11 0 0 0 0 9.86l3.66-2.84Z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15A10.96 10.96 0 0 0 12 1 11 11 0 0 0 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38Z" />
  </svg>
);

const AppleLogo = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-[18px] w-[18px]" aria-hidden>
    <path d="M16.37 1.43c0 1.14-.49 2.27-1.18 3.08-.74.9-1.99 1.57-2.99 1.57-.12 0-.23-.02-.3-.03-.01-.06-.04-.22-.04-.39 0-1.15.57-2.27 1.21-2.98.8-.94 2.14-1.64 3.25-1.68.03.13.05.28.05.43Zm4.56 15.71c-.03.07-.46 1.58-1.52 3.12-.94 1.34-1.94 2.71-3.43 2.71-1.52 0-1.9-.88-3.63-.88-1.7 0-2.3.91-3.67.91-1.38 0-2.33-1.26-3.43-2.8C4 18.38 2.96 15.57 2.96 12.92c0-4.28 2.8-6.55 5.55-6.55 1.45 0 2.68.95 3.6.95.87 0 2.22-1.01 3.9-1.01.61 0 2.89.06 4.38 2.19-.13.09-2.39 1.37-2.39 4.19 0 3.26 2.86 4.42 2.96 4.45Z" />
  </svg>
);

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.12em] text-fg-muted">{label}</span>
      {children}
    </label>
  );
}

const inputCls =
  "h-12 w-full rounded-sm border border-line-strong bg-ink-2 px-4 text-[15px] text-fg outline-none transition-colors placeholder:text-fg-dim hover:border-white/25 focus:border-accent";

function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={inputCls} {...props} />;
}

function PasswordInput(props: InputHTMLAttributes<HTMLInputElement>) {
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

function Check({ children, required, name }: { children: ReactNode; required?: boolean; name: string }) {
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

const inlineLink = "font-medium text-accent underline-offset-4 hover:underline";

export default function AuthModal({ mode, onMode, onClose }: { mode: AuthMode | null; onMode: (m: AuthMode) => void; onClose: () => void }) {
  const open = mode !== null;
  const [shown, setShown] = useState<AuthMode>("login");
  const [note, setNote] = useState<string | null>(null);
  const panel = useRef<HTMLDivElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const titleId = useId();

  // Keep the last mode rendered while the modal animates closed.
  useEffect(() => {
    if (mode) {
      setShown(mode);
      setNote(null);
    }
  }, [mode]);

  useEffect(() => {
    if (!open) return;
    returnFocus.current = document.activeElement as HTMLElement;
    document.documentElement.style.overflow = "hidden";
    const t = setTimeout(() => panel.current?.querySelector<HTMLInputElement>("input")?.focus(), 60);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      // Keep Tab focus inside the dialog.
      if (e.key === "Tab" && panel.current) {
        const f = panel.current.querySelectorAll<HTMLElement>("a[href], button:not([disabled]), input, select");
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
      returnFocus.current?.focus?.();
    };
  }, [open, onClose]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setNote(NOT_CONNECTED);
  };

  const login = shown === "login";

  return (
    <div className={`fixed inset-0 z-[60] ${open ? "visible" : "invisible"}`}>
      <div onClick={onClose} className={`absolute inset-0 bg-black/75 backdrop-blur-md transition-opacity duration-base ${open ? "opacity-100" : "opacity-0"}`} />

      <div className="absolute inset-0 overflow-y-auto">
        <div className="flex min-h-full items-start justify-center p-3 sm:items-center sm:p-6" onClick={(e) => e.target === e.currentTarget && onClose()}>
          <div
            ref={panel}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className={`relative w-full max-w-[460px] overflow-hidden rounded-lg border border-line bg-ink-1 shadow-[0_40px_120px_-20px_rgba(0,0,0,0.9)] transition-[opacity,transform] duration-slow ease-out ${
              open ? "translate-y-0 scale-100 opacity-100" : "translate-y-4 scale-[0.97] opacity-0"
            }`}
          >
            <div className="glow absolute -top-32 left-1/2 h-64 w-[420px] -translate-x-1/2" aria-hidden />

            <div className="relative p-6 sm:p-8">
              {/* Header */}
              <div className="flex items-center justify-between">
                <Logo link={false} className="h-7 w-auto" />
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close"
                  className="grid h-9 w-9 place-items-center rounded-sm border border-line-strong text-fg transition-colors hover:border-accent hover:text-accent"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Mode switch */}
              <div className="mt-7 grid grid-cols-2 rounded-sm border border-line-strong p-1" role="tablist" aria-label="Account">
                {(
                  [
                    ["login", "Log in"],
                    ["signup", "Sign up"],
                  ] as const
                ).map(([m, label]) => (
                  <button
                    key={m}
                    type="button"
                    role="tab"
                    aria-selected={shown === m}
                    onClick={() => onMode(m)}
                    className={`h-9 rounded-[6px] text-[13px] font-semibold transition-colors duration-fast ${
                      shown === m ? "bg-accent text-accent-ink" : "text-fg-muted hover:text-fg"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <h2 id={titleId} className="mt-7 text-[2.25rem] font-bold leading-[0.95] tracking-[-0.045em]">
                {login ? (
                  <>
                    Welcome <em className="font-serif font-normal italic tracking-[-0.02em] text-accent">back.</em>
                  </>
                ) : (
                  <>
                    Join the <em className="font-serif font-normal italic tracking-[-0.02em] text-accent">chase.</em>
                  </>
                )}
              </h2>
              <p className="mt-3 text-sm text-fg-muted">
                {login ? "Not registered? " : "Already registered? "}
                <button type="button" onClick={() => onMode(login ? "signup" : "login")} className={inlineLink}>
                  {login ? "Sign Up" : "Log In"}
                </button>
              </p>

              {/* Social */}
              <div className="mt-6 grid grid-cols-2 gap-3">
                {(
                  [
                    ["Google", <GoogleLogo key="g" />],
                    ["Apple", <AppleLogo key="a" />],
                  ] as const
                ).map(([name, logo]) => (
                  <button
                    key={name}
                    type="button"
                    onClick={() => setNote(NOT_CONNECTED)}
                    className="flex h-12 items-center justify-center gap-2.5 rounded-sm border border-line-strong bg-white/[0.03] text-sm font-semibold text-fg transition-colors hover:border-fg/50 hover:bg-white/[0.06]"
                  >
                    {logo}
                    {name}
                  </button>
                ))}
              </div>

              <div className="my-6 flex items-center gap-4">
                <span className="h-px flex-1 bg-line" />
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-fg-dim">or with email</span>
                <span className="h-px flex-1 bg-line" />
              </div>

              {/* Forms */}
              {login ? (
                <form key="login" onSubmit={submit} className="space-y-4">
                  <Field label="Email">
                    <Input type="email" name="email" required autoComplete="email" placeholder="you@email.com" />
                  </Field>
                  <Field label="Password">
                    <PasswordInput name="password" required autoComplete="current-password" placeholder="Password" />
                  </Field>
                  <div className="flex justify-end">
                    <button type="button" onClick={() => setNote(NOT_CONNECTED)} className={`text-sm ${inlineLink}`}>
                      Forgot Password?
                    </button>
                  </div>
                  <Button type="submit" size="lg" full arrow>
                    Log in
                  </Button>
                </form>
              ) : (
                <form key="signup" onSubmit={submit} className="space-y-4">
                  <Field label="Email *">
                    <Input type="email" name="email" required autoComplete="email" placeholder="you@email.com" />
                  </Field>
                  <Field label="Password *">
                    <PasswordInput name="password" required minLength={8} autoComplete="new-password" placeholder="At least 8 characters" />
                  </Field>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="First name *">
                      <Input name="firstName" required autoComplete="given-name" placeholder="First" />
                    </Field>
                    <Field label="Last name *">
                      <Input name="lastName" required autoComplete="family-name" placeholder="Last" />
                    </Field>
                  </div>
                  <Field label="Username *">
                    <Input name="username" required autoComplete="username" placeholder="@handle" pattern="@?[A-Za-z0-9_.]{3,20}" title="3–20 letters, numbers, dots or underscores" />
                  </Field>
                  <Field label="Phone number *">
                    <div className="flex gap-3">
                      <div className="relative">
                        <select
                          name="country"
                          aria-label="Country code"
                          defaultValue="US"
                          className="h-12 appearance-none rounded-sm border border-line-strong bg-ink-2 pl-4 pr-9 text-[15px] text-fg outline-none transition-colors hover:border-white/25 focus:border-accent"
                        >
                          <option value="US">US +1</option>
                          <option value="CA">CA +1</option>
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-accent" />
                      </div>
                      <Input type="tel" name="phone" required autoComplete="tel-national" placeholder="(555) 000-0000" />
                    </div>
                  </Field>
                  <div className="space-y-3 pt-1">
                    <Check name="terms" required>
                      I agree to the{" "}
                      <Link href="/terms-of-service" onClick={onClose} className={inlineLink}>
                        Terms
                      </Link>{" "}
                      &amp;{" "}
                      <Link href="/privacy-policy" onClick={onClose} className={inlineLink}>
                        Privacy Policy
                      </Link>
                    </Check>
                    <Check name="updates">Sign me up for email updates!</Check>
                  </div>
                  <Button type="submit" size="lg" full arrow>
                    Sign Up
                  </Button>
                </form>
              )}

              {note && (
                <p role="status" className="mt-5 flex gap-2.5 rounded-sm border border-accent/30 bg-accent/[0.06] p-3 text-[13px] leading-relaxed text-fg-2">
                  <Info className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                  {note}
                </p>
              )}

              {login && (
                <p className="mt-6 border-t border-line pt-5 text-center text-[13px] text-fg-muted">
                  By logging in I agree to the{" "}
                  <Link href="/terms-of-service" onClick={onClose} className={inlineLink}>
                    Terms
                  </Link>{" "}
                  &amp;{" "}
                  <Link href="/privacy-policy" onClick={onClose} className={inlineLink}>
                    Privacy Policy
                  </Link>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
