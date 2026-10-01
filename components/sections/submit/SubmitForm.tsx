"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { BadgeCheck, ImagePlus, Info, Plus, Store, Trash2, X } from "lucide-react";
import Button from "@/components/ui/Button";
import { Check, Field, Input, Select, Textarea, inlineLink } from "@/components/ui/Form";
import { categories, usd } from "@/lib/data";

// No submissions backend exists yet. The form validates, then says so
// instead of pretending to send. Replace `onSubmit` with the real call.
const NOT_CONNECTED = "Submissions aren’t connected yet — nothing was sent and your photos never left this browser. This will work once card submissions launch.";

const purposes = [
  { value: "sell", label: "Sell on the Marketplace", body: "List your cards for auction or at a fixed price.", icon: Store },
  { value: "grade", label: "Get it graded", body: "Send raw cards in for professional grading.", icon: BadgeCheck },
] as const;

const graders = ["PSA", "BGS", "SGC", "CGC", "Other"];

type Side = "front" | "back";
type CardEntry = { id: number; condition: "graded" | "raw"; photos: Partial<Record<Side, string>> };

let nextId = 1;
const newCard = (): CardEntry => ({ id: nextId++, condition: "graded", photos: {} });

function SectionLabel({ n, children }: { n: string; children: React.ReactNode }) {
  return (
    <div className="mb-5 flex items-center gap-3">
      <span className="font-mono text-[11px] tracking-[0.12em] text-accent">{n}</span>
      <span className="h-px w-8 bg-accent/60" aria-hidden />
      <span className="eyebrow">{children}</span>
    </div>
  );
}

function PhotoDrop({ side, url, onPick, onClear }: { side: Side; url?: string; onPick: (f: File) => void; onClear: () => void }) {
  return (
    <div className="relative">
      <label className="group/photo relative flex aspect-[3/4] cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-sm border border-dashed border-line-strong bg-ink-2 text-fg-dim transition-colors hover:border-accent hover:text-accent">
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

export default function SubmitForm() {
  const [purpose, setPurpose] = useState<(typeof purposes)[number]["value"]>("sell");
  const [cards, setCards] = useState<CardEntry[]>(() => [newCard()]);
  const [estimate, setEstimate] = useState(0);
  const [note, setNote] = useState<string | null>(null);
  const urls = useRef(new Set<string>());
  const formRef = useRef<HTMLFormElement>(null);

  // Release photo previews on unmount.
  useEffect(() => {
    const set = urls.current;
    return () => set.forEach((u) => URL.revokeObjectURL(u));
  }, []);

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

  // Running total of the estimated values typed in.
  const recalc = () => {
    const inputs = formRef.current?.querySelectorAll<HTMLInputElement>('input[name$="[value]"]') ?? [];
    setEstimate(Array.from(inputs).reduce((n, i) => n + (Number(i.value) || 0), 0));
  };
  useEffect(recalc, [cards]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setNote(NOT_CONNECTED);
      }}
      ref={formRef}
      onInput={recalc}
      className="space-y-14"
    >
      {/* 01 Purpose */}
      <fieldset>
        <legend className="sr-only">What would you like to do?</legend>
        <SectionLabel n="01">What would you like to do?</SectionLabel>
        <div className="grid gap-3 sm:grid-cols-2">
          {purposes.map((p) => {
            const on = purpose === p.value;
            const I = p.icon;
            return (
              <label
                key={p.value}
                className={`relative flex cursor-pointer gap-4 rounded-md border p-5 transition-colors ${
                  on ? "border-accent bg-accent/[0.06]" : "border-line-strong bg-ink-2 hover:border-white/25"
                }`}
              >
                <input type="radio" name="purpose" value={p.value} checked={on} onChange={() => setPurpose(p.value)} className="sr-only" />
                <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-sm ${on ? "bg-accent text-accent-ink" : "bg-white/5 text-fg-muted"}`}>
                  <I className="h-5 w-5" strokeWidth={1.75} />
                </span>
                <span>
                  <span className="block font-semibold text-fg">{p.label}</span>
                  <span className="mt-1 block text-sm text-fg-muted">{p.body}</span>
                </span>
                <span
                  className={`absolute right-4 top-4 h-4 w-4 rounded-full border-2 ${on ? "border-accent bg-accent shadow-[inset_0_0_0_3px_#0a0a0a]" : "border-line-strong"}`}
                  aria-hidden
                />
              </label>
            );
          })}
        </div>
      </fieldset>

      {/* 02 Cards */}
      <section>
        <SectionLabel n="02">Your cards</SectionLabel>
        <ol className="space-y-4">
          {cards.map((c, i) => {
            const f = (k: string) => `cards[${i}][${k}]`;
            return (
              <li key={c.id} className="rounded-md border border-line bg-ink-1 p-5 md:p-6">
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

                <div className="grid gap-6 md:grid-cols-[1fr_200px]">
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
                    <Field label="Card # ">
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
                    <p className="mt-2 text-xs leading-relaxed text-fg-dim">Clear, well-lit shots of both sides help us review faster.</p>
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
      </section>

      {/* 03 Contact */}
      <section>
        <SectionLabel n="03">Your details</SectionLabel>
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
      </section>

      {/* Submit */}
      <section className="rounded-md border border-line bg-ink-1 p-5 md:p-6">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <dl className="flex gap-10">
            <div>
              <dt className="eyebrow !text-[10px]">Cards</dt>
              <dd className="mt-1 font-mono text-2xl tabular-nums text-fg">{String(cards.length).padStart(2, "0")}</dd>
            </div>
            <div>
              <dt className="eyebrow !text-[10px]">Est. value</dt>
              <dd className="mt-1 font-mono text-2xl tabular-nums text-accent">{usd(estimate)}</dd>
            </div>
          </dl>
          <div className="w-full space-y-4 sm:w-auto sm:min-w-[300px]">
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
            <Button type="submit" size="lg" full arrow magnetic>
              Submit {cards.length > 1 ? `${cards.length} cards` : "card"}
            </Button>
          </div>
        </div>
        {note && (
          <p role="status" className="mt-5 flex gap-2.5 rounded-sm border border-accent/30 bg-accent/[0.06] p-3 text-[13px] leading-relaxed text-fg-2">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
            {note}
          </p>
        )}
      </section>
    </form>
  );
}
