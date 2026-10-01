"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowLeft, BadgeCheck, Check as CheckIcon, ImagePlus, Info, Mail, Pencil, Plus, RotateCcw, Store, Trash2, X } from "lucide-react";
import Button from "@/components/ui/Button";
import { Check, Field, Input, Select, Textarea, inlineLink } from "@/components/ui/Form";
import { categories, usd } from "@/lib/data";

// Step-by-step card submission. No submissions backend exists yet, so the
// final step says so instead of pretending to send. Replace `finish` with
// the real call.

const purposes = [
  { value: "sell", label: "Sell on the Marketplace", body: "List your cards for auction or at a fixed price.", icon: Store },
  { value: "grade", label: "Get it graded", body: "Send raw cards in for professional grading.", icon: BadgeCheck },
] as const;
type Purpose = (typeof purposes)[number]["value"];

const steps = [
  { title: "Choose a path", body: "Sell or get graded" },
  { title: "Add your cards", body: "Details and photos" },
  { title: "Your details", body: "How we reach you" },
  { title: "Review & submit", body: "Check everything" },
];

const graders = ["PSA", "BGS", "SGC", "CGC", "Other"];

type Side = "front" | "back";
type CardEntry = { id: number; condition: "graded" | "raw"; photos: Partial<Record<Side, string>> };

let nextId = 1;
const newCard = (): CardEntry => ({ id: nextId++, condition: "graded", photos: {} });

function PhotoDrop({ side, url, onPick, onClear }: { side: Side; url?: string; onPick: (f: File) => void; onClear: () => void }) {
  return (
    <div className="relative">
      <label className="relative flex aspect-[3/4] cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-sm border border-dashed border-line-strong bg-ink-2 text-fg-dim transition-colors hover:border-accent hover:text-accent">
        {url ? (
          // eslint-disable-next-line @next/next/no-img-element -- local object URL preview
          <img src={url} alt={`${side} preview`} className="absolute inset-0 h-full w-full object-cover" />
        ) : (
          <>
            <ImagePlus className="h-6 w-6" strokeWidth={1.5} />
            <span className="font-mono text-[10px] uppercase tracking-[0.12em]">{side}</span>
          </>
        )}
        <input
          type="file"
          accept="image/*"
          className="sr-only"
          aria-label={`${side} photo`}
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) onPick(f);
          }}
        />
      </label>
      {url && (
        <button
          type="button"
          onClick={onClear}
          aria-label={`Remove ${side} photo`}
          className="absolute right-1.5 top-1.5 grid h-7 w-7 place-items-center rounded-full bg-black/70 text-fg backdrop-blur transition-colors hover:text-accent"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}

function StepHeading({ n, title, body }: { n: number; title: ReactNode; body: string }) {
  return (
    <div className="mb-8">
      <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-accent">
        Step {n} of {steps.length}
      </p>
      <h2 className="mt-3 text-[clamp(1.75rem,3vw,2.5rem)] font-bold leading-[1] tracking-[-0.04em]">{title}</h2>
      <p className="mt-2 text-fg-muted">{body}</p>
    </div>
  );
}

type Summary = {
  cards: { name: string; set: string; category: string; number: string; condition: string; grader: string; grade: string; value: number; photos: number }[];
  fullName: string;
  email: string;
  phone: string;
  username: string;
  notes: string;
};

export default function SubmitForm() {
  const [step, setStep] = useState(0);
  const [reached, setReached] = useState(0); // furthest step unlocked
  const [dir, setDir] = useState<1 | -1>(1);
  const [done, setDone] = useState(false);
  const [purpose, setPurpose] = useState<Purpose>("sell");
  const [cards, setCards] = useState<CardEntry[]>(() => [newCard()]);
  const [estimate, setEstimate] = useState(0);
  const [summary, setSummary] = useState<Summary | null>(null);
  const urls = useRef(new Set<string>());
  const formRef = useRef<HTMLFormElement>(null);
  const stepRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const set = urls.current;
    return () => set.forEach((u) => URL.revokeObjectURL(u));
  }, []);

  /* ---------------- cards ---------------- */

  const update = (id: number, fn: (c: CardEntry) => CardEntry) => setCards((cs) => cs.map((c) => (c.id === id ? fn(c) : c)));

  const setPhoto = (id: number, side: Side, file?: File) =>
    update(id, (c) => {
      const old = c.photos[side];
      if (old) {
        URL.revokeObjectURL(old);
        urls.current.delete(old);
      }
      const url = file ? URL.createObjectURL(file) : undefined;
      if (url) urls.current.add(url);
      return { ...c, photos: { ...c.photos, [side]: url } };
    });

  const removeCard = (id: number) => {
    Object.values(cards.find((c) => c.id === id)?.photos ?? {}).forEach((u) => {
      if (!u) return;
      URL.revokeObjectURL(u);
      urls.current.delete(u);
    });
    setCards((cs) => cs.filter((c) => c.id !== id));
  };

  const recalc = () => {
    const inputs = formRef.current?.querySelectorAll<HTMLInputElement>('input[name$="[value]"]') ?? [];
    setEstimate(Array.from(inputs).reduce((n, i) => n + (Number(i.value) || 0), 0));
  };
  useEffect(recalc, [cards]);

  /* ---------------- navigation ---------------- */

  // Validate only the fields in the current step.
  const stepValid = () => {
    const panel = stepRefs.current[step];
    if (!panel) return true;
    const fields = panel.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>("input, select, textarea");
    for (const f of Array.from(fields)) {
      if (!f.checkValidity()) {
        f.reportValidity();
        return false;
      }
    }
    return true;
  };

  const readSummary = (): Summary => {
    const fd = new FormData(formRef.current!);
    const get = (k: string) => String(fd.get(k) ?? "").trim();
    return {
      cards: cards.map((c, i) => {
        const k = (x: string) => get(`cards[${i}][${x}]`);
        return {
          name: k("name"),
          set: k("set"),
          category: categories.find((cat) => cat.slug === k("category"))?.label ?? "",
          number: k("number"),
          condition: c.condition,
          grader: k("grader"),
          grade: k("grade"),
          value: Number(k("value")) || 0,
          photos: Object.values(c.photos).filter(Boolean).length,
        };
      }),
      fullName: get("fullName"),
      email: get("email"),
      phone: get("phone"),
      username: get("username"),
      notes: get("notes"),
    };
  };

  const go = (to: number) => {
    if (to === step) return;
    if (to > step && !stepValid()) return;
    if (to === steps.length - 1) setSummary(readSummary());
    setDir(to > step ? 1 : -1);
    setStep(to);
    setReached((r) => Math.max(r, to));
    requestAnimationFrame(() => {
      const top = formRef.current?.getBoundingClientRect().top ?? 0;
      if (top < 80) window.scrollBy({ top: top - 120, behavior: "smooth" });
    });
  };

  const finish = () => {
    if (!stepValid()) return;
    setDone(true);
  };

  const restart = () => {
    urls.current.forEach((u) => URL.revokeObjectURL(u));
    urls.current.clear();
    formRef.current?.reset();
    setCards([newCard()]);
    setPurpose("sell");
    setSummary(null);
    setDone(false);
    setReached(0);
    setDir(-1);
    setStep(0);
  };

  const progress = done ? 100 : (step / (steps.length - 1)) * 100;
  const purposeLabel = purposes.find((p) => p.value === purpose)!.label;

  /* ---------------- render ---------------- */

  return (
    <div className="grid-12 gap-y-8">
      {/* Progress rail */}
      <aside className="col-span-4 md:col-span-8 lg:col-span-4">
        <div className="lg:sticky lg:top-[calc(var(--topbar-h)+32px)]">
          {/* Mobile / tablet: compact bar */}
          <div className="lg:hidden">
            <div className="flex items-baseline justify-between font-mono text-[11px] uppercase tracking-[0.12em]">
              <span className="text-accent">{done ? "Complete" : `Step ${step + 1} of ${steps.length}`}</span>
              <span className="text-fg-muted">{done ? "Ready" : steps[step].title}</span>
            </div>
            <div className="mt-3 h-1 overflow-hidden rounded-full bg-line">
              <div className="h-full rounded-full bg-accent transition-[width] duration-slow ease-out" style={{ width: `${Math.max(progress, 6)}%` }} />
            </div>
          </div>

          {/* Desktop: vertical stepper */}
          <ol className="relative hidden lg:block">
            <span className="absolute bottom-6 left-[15px] top-6 w-px bg-line" aria-hidden />
            <span
              className="absolute left-[15px] top-6 w-px bg-accent transition-[height] duration-slow ease-out"
              style={{ height: `calc((100% - 48px) * ${progress / 100})` }}
              aria-hidden
            />
            {steps.map((s, i) => {
              const state = done || i < step ? "done" : i === step ? "current" : "upcoming";
              const clickable = !done && i <= reached && i !== step;
              return (
                <li key={s.title}>
                  <button
                    type="button"
                    disabled={!clickable}
                    onClick={() => go(i)}
                    aria-current={state === "current" ? "step" : undefined}
                    className="group relative flex w-full items-start gap-4 py-3 text-left disabled:cursor-default"
                  >
                    <span
                      className={`relative z-[1] grid h-8 w-8 shrink-0 place-items-center rounded-full border font-mono text-[11px] transition-all duration-base ${
                        state === "done"
                          ? "border-accent bg-accent text-accent-ink"
                          : state === "current"
                            ? "border-accent bg-ink-0 text-accent shadow-[0_0_0_4px_rgba(117,251,181,0.15)]"
                            : "border-line-strong bg-ink-0 text-fg-dim"
                      }`}
                    >
                      {state === "done" ? <CheckIcon className="h-4 w-4" strokeWidth={2.5} /> : `0${i + 1}`}
                    </span>
                    <span className="pt-1">
                      <span
                        className={`block font-semibold tracking-[-0.02em] transition-colors ${
                          state === "upcoming" ? "text-fg-dim" : "text-fg"
                        } ${clickable ? "group-hover:text-accent" : ""}`}
                      >
                        {s.title}
                      </span>
                      <span className="block text-sm text-fg-dim">{s.body}</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>

          <a
            href="mailto:support@hyp3.gg"
            className="mt-8 hidden items-center gap-3 rounded-md border border-line p-4 text-sm text-fg-muted transition-colors hover:border-accent lg:flex"
          >
            <Mail className="h-4 w-4 text-accent" />
            <span>
              Questions? <span className="link-u text-fg">support@hyp3.gg</span>
            </span>
          </a>
        </div>
      </aside>

      {/* Step panel */}
      <div className="col-span-4 md:col-span-8 lg:col-span-8">
        <form
          ref={formRef}
          noValidate
          onInput={recalc}
          onSubmit={(e) => {
            e.preventDefault();
            if (step < steps.length - 1) go(step + 1);
            else finish();
          }}
          className="relative rounded-lg border border-line bg-ink-1 p-5 sm:p-8"
        >
          {done && summary && (
            <div className="step-in py-6 text-center" style={{ "--dir": 1 } as React.CSSProperties}>
                <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-accent text-accent-ink shadow-[0_0_0_8px_rgba(117,251,181,0.12)]">
                  <CheckIcon className="h-8 w-8" strokeWidth={2.5} />
                </div>
                <h2 className="mt-6 text-[clamp(1.75rem,3vw,2.5rem)] font-bold tracking-[-0.04em]">
                  Submission <em className="font-serif font-normal italic tracking-[-0.02em] text-accent">ready.</em>
                </h2>
                <p className="mt-2 text-fg-muted">
                  {summary.cards.length} card{summary.cards.length > 1 ? "s" : ""} · {usd(summary.cards.reduce((n, c) => n + c.value, 0))} estimated · {purposeLabel}
                </p>
                <p role="status" className="mx-auto mt-6 flex max-w-md gap-2.5 rounded-sm border border-accent/30 bg-accent/[0.06] p-3 text-left text-[13px] leading-relaxed text-fg-2">
                  <Info className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                  Submissions aren’t connected yet — nothing was sent and your photos never left this browser. This will work once card submissions
                  launch.
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-3">
                  <Button type="button" variant="secondary" size="md" onClick={restart}>
                    <RotateCcw className="h-4 w-4" /> Start a new submission
                  </Button>
                  <Button href="/marketplace" size="md" arrow>
                    Browse Marketplace
                  </Button>
                </div>
            </div>
          )}

          {/* Every step stays mounted so typed values persist; only the active one is shown
              (and its slide-in animation replays each time it's unhidden). */}
          <div hidden={done}>
            {/* Step 1 — path */}
            <fieldset hidden={step !== 0} ref={(el) => void (stepRefs.current[0] = el)} className="step-in" style={{ "--dir": dir } as React.CSSProperties}>
              <legend className="sr-only">What would you like to do?</legend>
              <StepHeading n={1} title="What would you like to do?" body="Pick how you want us to handle your cards." />
              <div className="grid gap-3 sm:grid-cols-2">
                {purposes.map((p) => {
                  const on = purpose === p.value;
                  const I = p.icon;
                  return (
                    <label
                      key={p.value}
                      className={`relative flex cursor-pointer flex-col gap-4 rounded-md border p-5 transition-all duration-base ${
                        on ? "border-accent bg-accent/[0.06] shadow-[0_0_0_1px_rgba(117,251,181,0.4)]" : "border-line-strong bg-ink-2 hover:-translate-y-0.5 hover:border-white/25"
                      }`}
                    >
                      <input type="radio" name="purpose" value={p.value} checked={on} onChange={() => setPurpose(p.value)} className="sr-only" />
                      <span className={`grid h-12 w-12 place-items-center rounded-sm transition-colors ${on ? "bg-accent text-accent-ink" : "bg-white/5 text-fg-muted"}`}>
                        <I className="h-6 w-6" strokeWidth={1.75} />
                      </span>
                      <span>
                        <span className="block text-lg font-semibold tracking-[-0.02em] text-fg">{p.label}</span>
                        <span className="mt-1 block text-sm text-fg-muted">{p.body}</span>
                      </span>
                      <span
                        className={`absolute right-4 top-4 grid h-5 w-5 place-items-center rounded-full border-2 transition-colors ${on ? "border-accent bg-accent text-accent-ink" : "border-line-strong"}`}
                        aria-hidden
                      >
                        {on && <CheckIcon className="h-3 w-3" strokeWidth={3} />}
                      </span>
                    </label>
                  );
                })}
              </div>
            </fieldset>

            {/* Step 2 — cards */}
            <div hidden={step !== 1} ref={(el) => void (stepRefs.current[1] = el)} className="step-in" style={{ "--dir": dir } as React.CSSProperties}>
              <StepHeading n={2} title="Add your cards" body="One block per card. Photos of both sides help us review faster." />
              <ol className="space-y-4">
                {cards.map((c, i) => {
                  const f = (k: string) => `cards[${i}][${k}]`;
                  return (
                    <li key={c.id} className="rounded-md border border-line bg-ink-0/40 p-4 sm:p-5">
                      <div className="mb-5 flex items-center justify-between">
                        <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-fg-muted">
                          Card <span className="text-accent">{String(i + 1).padStart(2, "0")}</span>
                        </p>
                        {cards.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeCard(c.id)}
                            className="inline-flex items-center gap-1.5 text-[13px] text-fg-dim transition-colors hover:text-red-400"
                          >
                            <Trash2 className="h-3.5 w-3.5" /> Remove
                          </button>
                        )}
                      </div>

                      <div className="grid gap-6 md:grid-cols-[1fr_190px]">
                        <div className="grid grid-cols-2 gap-4">
                          <Field label="Category *">
                            <Select name={f("category")} required defaultValue="">
                              <option value="" disabled>
                                Choose…
                              </option>
                              {categories.map((cat) => (
                                <option key={cat.slug} value={cat.slug}>
                                  {cat.label}
                                </option>
                              ))}
                            </Select>
                          </Field>
                          <Field label="Card #">
                            <Input name={f("number")} placeholder="#233" />
                          </Field>
                          <Field label="Player / card name *" className="col-span-2">
                            <Input name={f("name")} required placeholder="e.g. LeBron James, Charizard" />
                          </Field>
                          <Field label="Set & year *" className="col-span-2">
                            <Input name={f("set")} required placeholder="e.g. 2003 UD Exquisite Collection" />
                          </Field>

                          <div className="col-span-2">
                            <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.12em] text-fg-muted">Condition *</span>
                            <div className="grid grid-cols-2 rounded-sm border border-line-strong p-1" role="radiogroup" aria-label="Condition">
                              {(["graded", "raw"] as const).map((cond) => (
                                <label
                                  key={cond}
                                  className={`flex h-10 cursor-pointer items-center justify-center rounded-[6px] text-[13px] font-semibold capitalize transition-colors ${
                                    c.condition === cond ? "bg-accent text-accent-ink" : "text-fg-muted hover:text-fg"
                                  }`}
                                >
                                  <input
                                    type="radio"
                                    name={f("condition")}
                                    value={cond}
                                    checked={c.condition === cond}
                                    onChange={() => update(c.id, (x) => ({ ...x, condition: cond }))}
                                    className="sr-only"
                                  />
                                  {cond}
                                </label>
                              ))}
                            </div>
                          </div>

                          {c.condition === "graded" && (
                            <>
                              <Field label="Grader *">
                                <Select name={f("grader")} required defaultValue="PSA">
                                  {graders.map((g) => (
                                    <option key={g}>{g}</option>
                                  ))}
                                </Select>
                              </Field>
                              <Field label="Grade *">
                                <Input name={f("grade")} required inputMode="decimal" type="number" min={1} max={10} step={0.5} placeholder="10" />
                              </Field>
                            </>
                          )}

                          <Field label="Estimated value" hint="USD" className="col-span-2">
                            <Input name={f("value")} type="number" min={0} step={1} inputMode="numeric" placeholder="0" />
                          </Field>
                        </div>

                        <div>
                          <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.12em] text-fg-muted">Photos</span>
                          <div className="grid grid-cols-2 gap-3">
                            {(["front", "back"] as const).map((side) => (
                              <PhotoDrop
                                key={side}
                                side={side}
                                url={c.photos[side]}
                                onPick={(file) => setPhoto(c.id, side, file)}
                                onClear={() => setPhoto(c.id, side)}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ol>
              <button
                type="button"
                onClick={() => setCards((cs) => [...cs, newCard()])}
                className="mt-4 flex h-14 w-full items-center justify-center gap-2 rounded-md border border-dashed border-line-strong text-sm font-semibold text-fg-muted transition-colors hover:border-accent hover:text-accent"
              >
                <Plus className="h-4 w-4" /> Add another card
              </button>
              <p className="mt-4 text-right font-mono text-[11px] uppercase tracking-[0.12em] text-fg-dim">
                {cards.length} card{cards.length > 1 ? "s" : ""} · <span className="text-accent">{usd(estimate)}</span> est.
              </p>
            </div>

            {/* Step 3 — details */}
            <div hidden={step !== 2} ref={(el) => void (stepRefs.current[2] = el)} className="step-in" style={{ "--dir": dir } as React.CSSProperties}>
              <StepHeading n={3} title="Your details" body="We’ll use these to follow up about your submission." />
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Full name *">
                  <Input name="fullName" required autoComplete="name" placeholder="Your name" />
                </Field>
                <Field label="Email *">
                  <Input name="email" type="email" required autoComplete="email" placeholder="you@email.com" />
                </Field>
                <Field label="Phone" hint="Optional">
                  <Input name="phone" type="tel" autoComplete="tel" placeholder="(555) 000-0000" />
                </Field>
                <Field label="Username" hint="Optional">
                  <Input name="username" autoComplete="username" placeholder="@handle" />
                </Field>
                <Field label="Notes" hint="Optional" className="sm:col-span-2">
                  <Textarea name="notes" placeholder="Anything we should know — condition details, flaws, history…" />
                </Field>
              </div>
            </div>

            {/* Step 4 — review */}
            <div hidden={step !== 3} ref={(el) => void (stepRefs.current[3] = el)} className="step-in" style={{ "--dir": dir } as React.CSSProperties}>
              <StepHeading n={4} title="Review & submit" body="Check everything looks right before you send it." />
              {summary && (
                <div className="space-y-4">
                  <ReviewBlock title="Path" onEdit={() => go(0)}>
                    <p className="font-semibold text-fg">{purposeLabel}</p>
                  </ReviewBlock>

                  <ReviewBlock title={`Cards · ${summary.cards.length}`} onEdit={() => go(1)}>
                    <ul className="divide-y divide-line">
                      {summary.cards.map((c, i) => (
                        <li key={i} className="flex items-start justify-between gap-4 py-3 first:pt-0 last:pb-0">
                          <div className="min-w-0">
                            <p className="truncate font-semibold text-fg">{c.name}</p>
                            <p className="truncate text-sm text-fg-muted">
                              {[c.set, c.number, c.category].filter(Boolean).join(" · ")}
                            </p>
                            <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.1em] text-fg-dim">
                              {c.condition === "graded" ? `${c.grader} ${c.grade}` : "Raw"} · {c.photos} photo{c.photos === 1 ? "" : "s"}
                            </p>
                          </div>
                          <p className="shrink-0 font-mono tabular-nums text-fg">{c.value ? usd(c.value) : "—"}</p>
                        </li>
                      ))}
                    </ul>
                  </ReviewBlock>

                  <ReviewBlock title="Your details" onEdit={() => go(2)}>
                    <dl className="grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
                      {(
                        [
                          ["Name", summary.fullName],
                          ["Email", summary.email],
                          ["Phone", summary.phone],
                          ["Username", summary.username],
                        ] as const
                      )
                        .filter(([, v]) => v)
                        .map(([k, v]) => (
                          <div key={k} className="flex gap-2">
                            <dt className="text-fg-dim">{k}</dt>
                            <dd className="truncate text-fg">{v}</dd>
                          </div>
                        ))}
                    </dl>
                    {summary.notes && <p className="mt-3 border-t border-line pt-3 text-sm text-fg-muted">{summary.notes}</p>}
                  </ReviewBlock>

                  <div className="flex flex-wrap items-center justify-between gap-4 rounded-md border border-accent/30 bg-accent/[0.05] p-4">
                    <span className="eyebrow">Estimated total</span>
                    <span className="font-mono text-2xl tabular-nums text-accent">{usd(summary.cards.reduce((n, c) => n + c.value, 0))}</span>
                  </div>

                  <div className="pt-2">
                    <Check name="terms" required>
                      I agree to the{" "}
                      <Link href="/terms-of-service" className={inlineLink}>
                        Terms
                      </Link>{" "}
                      &amp;{" "}
                      <Link href="/privacy-policy" className={inlineLink}>
                        Privacy Policy
                      </Link>
                    </Check>
                  </div>
                </div>
              )}
            </div>

            {/* Nav */}
            <div className="mt-10 flex items-center justify-between gap-4 border-t border-line pt-6">
              {step > 0 ? (
                <Button type="button" variant="ghost" size="md" onClick={() => go(step - 1)}>
                  <ArrowLeft className="h-4 w-4" /> Back
                </Button>
              ) : (
                <span />
              )}
              <Button type="submit" size="lg" arrow magnetic>
                {step < steps.length - 1 ? "Continue" : `Submit ${cards.length > 1 ? `${cards.length} cards` : "card"}`}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

function ReviewBlock({ title, onEdit, children }: { title: string; onEdit: () => void; children: ReactNode }) {
  return (
    <section className="rounded-md border border-line bg-ink-0/40 p-4 sm:p-5">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="eyebrow">{title}</h3>
        <button type="button" onClick={onEdit} className="inline-flex items-center gap-1.5 text-[13px] font-medium text-accent hover:underline">
          <Pencil className="h-3.5 w-3.5" /> Edit
        </button>
      </div>
      {children}
    </section>
  );
}
