"use client";

import { Check as CheckIcon, ChevronDown, ImagePlus, Plus, Trash2, X } from "lucide-react";
import { Field, Input, Select } from "@/components/ui/Form";
import { usd } from "@/lib/data";

// Step 4 of Submit Cards: structured intake for each graded card.

export const GRADERS = ["PSA", "CGC", "BGS", "SGC"] as const;
export type Grader = (typeof GRADERS)[number];

const CATEGORIES = ["Football", "Basketball", "Baseball", "Pokémon", "Other"] as const;

const HALF = ["9.5", "9", "8.5", "8", "7.5", "7", "6.5", "6", "5.5", "5", "4.5", "4", "3.5", "3", "2.5", "2", "1.5", "1"];
export const GRADES: Record<Grader, string[]> = {
  PSA: ["10", "9", "8.5", "8", "7.5", "7", "6.5", "6", "5.5", "5", "4.5", "4", "3.5", "3", "2.5", "2", "1.5", "1", "Authentic"],
  BGS: ["10 Black Label", "10 Pristine", ...HALF, "Authentic"],
  CGC: ["10 Pristine", "10 Gem Mint", ...HALF, "Authentic"],
  SGC: ["10 Pristine", "10 Gem Mint", ...HALF, "Authentic"],
};

export type CardRow = {
  id: number;
  category: string;
  grader: Grader;
  grade: string;
  cert: string;
  year: string;
  subject: string;
  set: string;
  number: string;
  parallel: string;
  serial: string;
  value: string;
  auto: boolean;
  front?: string;
  back?: string;
};

let rowId = 1;
export const newCard = (): CardRow => ({
  id: rowId++,
  category: "",
  grader: "PSA",
  grade: "10",
  cert: "",
  year: "",
  subject: "",
  set: "",
  number: "",
  parallel: "",
  serial: "",
  value: "",
  auto: false,
});

const required: { key: keyof CardRow; label: string }[] = [
  { key: "front", label: "front photo" },
  { key: "back", label: "back photo" },
  { key: "category", label: "category" },
  { key: "cert", label: "cert number" },
  { key: "year", label: "year" },
  { key: "subject", label: "player / character" },
  { key: "set", label: "set / brand" },
  { key: "value", label: "declared value" },
];

const CERT_RE = /^[A-Za-z0-9-]{5,20}$/;
const YEAR_RE = /^(19|20)\d{2}(-\d{2})?$/;

/** Missing or invalid required fields for a card (empty array = complete). */
export function cardIssues(c: CardRow): (keyof CardRow)[] {
  const out = required.filter((r) => !String(c[r.key] ?? "").trim()).map((r) => r.key);
  if (c.cert && !CERT_RE.test(c.cert)) out.push("cert");
  if (c.year && !YEAR_RE.test(c.year)) out.push("year");
  if (c.value && !(Number(c.value) > 0)) out.push("value");
  return out;
}

/** One-line summary, e.g. "2024 Panini Prizm Victor Wembanyama #212 /10". */
// Photo previews are object URLs; the flow revokes them when cards are dropped or it closes.
export function revokePhotos(c: CardRow) {
  [c.front, c.back].forEach((u) => u && URL.revokeObjectURL(u));
}

export function cardTitle(c: CardRow) {
  return [c.year, c.set, c.subject, c.parallel, c.number && `#${c.number.replace(/^#/, "")}`, c.serial].filter(Boolean).join(" ") || "New card";
}

function Photo({
  side,
  url,
  invalid,
  onPick,
  onClear,
}: {
  side: "front" | "back";
  url?: string;
  invalid: boolean;
  onPick: (f: File) => void;
  onClear: () => void;
}) {
  return (
    <div className="relative">
      <label
        className={`relative flex aspect-[3/4] cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-sm border border-dashed bg-ink-2 transition-colors ${
          invalid ? "border-red-400/70 text-red-300" : "border-line-strong text-fg-dim hover:border-accent hover:text-accent"
        }`}
      >
        {url ? (
          // eslint-disable-next-line @next/next/no-img-element -- local object URL preview
          <img src={url} alt={`${side} of card`} className="absolute inset-0 h-full w-full object-cover" />
        ) : (
          <>
            <ImagePlus className="h-6 w-6" strokeWidth={1.5} />
            <span className="font-mono text-[10px] uppercase tracking-[0.12em]">{side} *</span>
          </>
        )}
        <input
          type="file"
          accept="image/*"
          className="sr-only"
          aria-label={`${side} photo (required)`}
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) onPick(f);
            e.target.value = "";
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

export default function CardDetailsStep({
  cards,
  setCards,
  openId,
  setOpenId,
  showErrors,
  addCard,
}: {
  cards: CardRow[];
  setCards: React.Dispatch<React.SetStateAction<CardRow[]>>;
  openId: number | null;
  setOpenId: (id: number | null) => void;
  showErrors: boolean;
  addCard: () => void;
}) {
  const update = (id: number, patch: Partial<CardRow>) => setCards((cs) => cs.map((c) => (c.id === id ? { ...c, ...patch } : c)));

  const setPhoto = (c: CardRow, side: "front" | "back", file?: File) => {
    const old = c[side];
    if (old) URL.revokeObjectURL(old);
    const url = file ? URL.createObjectURL(file) : undefined;
    update(c.id, { [side]: url });
  };

  const remove = (c: CardRow) => {
    revokePhotos(c);
    setCards((cs) => cs.filter((x) => x.id !== c.id));
  };

  return (
    <div className="space-y-3">
      {cards.map((c, i) => {
        const open = openId === c.id || cards.length === 1;
        const issues = cardIssues(c);
        const bad = (k: keyof CardRow) => showErrors && issues.includes(k);
        const done = issues.length === 0;
        return (
          <div key={c.id} data-card={c.id} className={`rounded-md border transition-colors ${open ? "border-line-strong bg-ink-2/60" : showErrors && !done ? "border-red-400/50" : "border-line"}`}>
            {/* Header */}
            <div className="flex items-center gap-3 p-3 pl-4">
              <button type="button" onClick={() => setOpenId(open && cards.length > 1 ? null : c.id)} aria-expanded={open} className="flex min-w-0 flex-1 items-center gap-3 text-left">
                <span
                  className={`grid h-6 w-6 shrink-0 place-items-center rounded-full font-mono text-[10px] ${
                    done ? "bg-accent text-accent-ink" : "border border-line-strong text-fg-muted"
                  }`}
                >
                  {done ? <CheckIcon className="h-3.5 w-3.5" strokeWidth={3} /> : i + 1}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold text-fg">
                    Card {i + 1}
                    <span className="font-normal text-fg-muted"> · {cardTitle(c)}</span>
                  </span>
                  {!open && (
                    <span className="block truncate font-mono text-[10px] uppercase tracking-[0.1em] text-fg-dim">
                      {c.grader} {c.grade}
                      {c.cert && ` · cert ${c.cert}`}
                      {c.value && ` · ${usd(Number(c.value) || 0)}`}
                      {showErrors && !done && <span className="text-red-300"> · missing {issues.length}</span>}
                    </span>
                  )}
                </span>
              </button>
              {cards.length > 1 && (
                <>
                  <button type="button" onClick={() => remove(c)} aria-label={`Remove card ${i + 1}`} className="grid h-8 w-8 place-items-center rounded-sm text-fg-dim transition-colors hover:text-red-400">
                    <Trash2 className="h-4 w-4" />
                  </button>
                  <ChevronDown className={`h-4 w-4 shrink-0 text-fg-dim transition-transform duration-base ${open ? "rotate-180" : ""}`} aria-hidden />
                </>
              )}
            </div>

            {/* Body */}
            {open && (
              <div className="grid gap-5 border-t border-line p-4 md:grid-cols-[180px_1fr]">
                <div>
                  <p className="mb-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-fg-muted">Photos *</p>
                  <div className="grid grid-cols-2 gap-2">
                    <Photo side="front" url={c.front} invalid={bad("front")} onPick={(f) => setPhoto(c, "front", f)} onClear={() => setPhoto(c, "front")} />
                    <Photo side="back" url={c.back} invalid={bad("back")} onPick={(f) => setPhoto(c, "back", f)} onClear={() => setPhoto(c, "back")} />
                  </div>
                  <p className={`mt-2 text-[11px] leading-relaxed ${bad("front") || bad("back") ? "text-red-300" : "text-fg-dim"}`}>
                    Clear shots of the full slab, label visible.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Field label="Category *">
                    <Select value={c.category} onChange={(e) => update(c.id, { category: e.target.value })} aria-invalid={bad("category")} className={bad("category") ? "[&>select]:border-red-400/70" : ""}>
                      <option value="" disabled>
                        Choose…
                      </option>
                      {CATEGORIES.map((k) => (
                        <option key={k}>{k}</option>
                      ))}
                    </Select>
                  </Field>
                  <Field label="Grading company *">
                    <Select
                      value={c.grader}
                      onChange={(e) => {
                        const g = e.target.value as Grader;
                        update(c.id, { grader: g, grade: GRADES[g].includes(c.grade) ? c.grade : GRADES[g][0] });
                      }}
                    >
                      {GRADERS.map((g) => (
                        <option key={g}>{g}</option>
                      ))}
                    </Select>
                  </Field>
                  <Field label="Cert number *" hint={bad("cert") ? "5–20 letters/numbers" : undefined}>
                    <Input
                      value={c.cert}
                      onChange={(e) => update(c.id, { cert: e.target.value.trim() })}
                      placeholder="e.g. 63140708"
                      inputMode="text"
                      aria-invalid={bad("cert")}
                      className={`${bad("cert") ? "!border-red-400/70" : ""}`}
                    />
                  </Field>
                  <Field label="Grade *">
                    <Select value={c.grade} onChange={(e) => update(c.id, { grade: e.target.value })}>
                      {GRADES[c.grader].map((g) => (
                        <option key={g}>{g}</option>
                      ))}
                    </Select>
                  </Field>
                  <Field label="Year *" hint={bad("year") ? "e.g. 2024 or 2024-25" : undefined}>
                    <Input value={c.year} onChange={(e) => update(c.id, { year: e.target.value.trim() })} placeholder="2024" inputMode="numeric" aria-invalid={bad("year")} className={bad("year") ? "!border-red-400/70" : ""} />
                  </Field>
                  <Field label="Card number">
                    <Input value={c.number} onChange={(e) => update(c.id, { number: e.target.value })} placeholder="#212" />
                  </Field>
                  <Field label="Player / character *" className="col-span-2">
                    <Input value={c.subject} onChange={(e) => update(c.id, { subject: e.target.value })} placeholder="e.g. Victor Wembanyama, Charizard" aria-invalid={bad("subject")} className={bad("subject") ? "!border-red-400/70" : ""} />
                  </Field>
                  <Field label="Set / brand *" className="col-span-2">
                    <Input value={c.set} onChange={(e) => update(c.id, { set: e.target.value })} placeholder="e.g. Panini Prizm, Pokémon Base Set" aria-invalid={bad("set")} className={bad("set") ? "!border-red-400/70" : ""} />
                  </Field>
                  <Field label="Parallel / variant">
                    <Input value={c.parallel} onChange={(e) => update(c.id, { parallel: e.target.value })} placeholder="e.g. Gold, Holo, Refractor" />
                  </Field>
                  <Field label="Serial #">
                    <Input value={c.serial} onChange={(e) => update(c.id, { serial: e.target.value })} placeholder="e.g. /10" />
                  </Field>
                  <Field label="Declared value *" hint="USD">
                    <div className="relative">
                      <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 font-mono text-fg-dim">$</span>
                      <Input
                        type="number"
                        min={1}
                        step={1}
                        inputMode="numeric"
                        value={c.value}
                        onChange={(e) => update(c.id, { value: e.target.value })}
                        placeholder="0"
                        aria-invalid={bad("value")}
                        className={bad("value") ? "!border-red-400/70" : ""}
                        style={{ paddingLeft: "2rem" }}
                      />
                    </div>
                  </Field>
                  <div className="flex items-end pb-3">
                    <label className="flex cursor-pointer items-center gap-2.5 text-sm text-fg-2">
                      <input
                        type="checkbox"
                        checked={c.auto}
                        onChange={(e) => update(c.id, { auto: e.target.checked })}
                        className="h-4 w-4 cursor-pointer accent-[#75FBB5]"
                      />
                      Autographed
                    </label>
                  </div>
                  {showErrors && issues.length > 0 && (
                    <p role="alert" className="col-span-2 text-[12px] text-red-300">
                      Still needed: {required.filter((r) => issues.includes(r.key)).map((r) => r.label).join(", ")}
                      {issues.some((k) => !required.some((r) => r.key === k)) && " (check the format)"}.
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}

      <button
        type="button"
        onClick={addCard}
        className="inline-flex h-10 items-center gap-2 rounded-sm border border-accent/60 px-4 text-[13px] font-semibold text-accent transition-colors hover:bg-accent/10"
      >
        <Plus className="h-4 w-4" /> Add A Card
      </button>
    </div>
  );
}
