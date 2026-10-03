"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Check as CheckIcon, ChevronLeft, ChevronRight, Copy, Info, MapPin, Minus, Pencil, Plus, X } from "lucide-react";
import Button from "@/components/ui/Button";
import { Field, Input, Select } from "@/components/ui/Form";
import CardDetailsStep, { GRADERS, cardIssues, cardTitle, newCard, revokePhotos, type CardRow } from "./CardDetailsStep";
import { usd } from "@/lib/data";
import { useToast } from "@/components/ui/Toast";
import { useAccount } from "@/components/account/AccountProvider";

// "Submit Cards" flow, matching the six steps in the design: accepted graders,
// shipping address, how many cards, card details, return address, review.
// No submissions backend exists yet, so the final step says nothing was sent.


const INTAKE = ["HYP3 INTAKE", "1234 N. HYP3 Rd.", "STE 123", "San Antonio, TX", "78254"];

const US_STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "District of Columbia", "Florida", "Georgia",
  "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan",
  "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York",
  "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota",
  "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming",
];
const CA_PROVINCES = [
  "Alberta", "British Columbia", "Manitoba", "New Brunswick", "Newfoundland and Labrador", "Northwest Territories", "Nova Scotia",
  "Nunavut", "Ontario", "Prince Edward Island", "Quebec", "Saskatchewan", "Yukon",
];

const steps = [
  { title: "Accepted Grading Companies", body: "We are currently only accepting cards from the following grading companies:" },
  { title: "Shipping Your Cards", body: "Ship us your cards to sell to us directly, list in our marketplace or showcase in your collection!" },
  { title: "How Many Graded Cards Are You Submitting & Vaulting?", body: "We are currently only accepting cards from PSA, CGC, BGS & SGC." },
  { title: "Enter Information About Your Graded Cards Being Submitted", body: "Please provide as much information as possible." },
  { title: "Enter Your Return Address", body: "Please select a return address from your account below. We will use this if we need to return any graded cards we do not accept." },
  { title: "Review Order", body: "Please review your order below to verify everything is correct." },
];


export default function SubmitFlow({ onClose, embedded }: { onClose?: () => void; embedded?: boolean }) {
  const { state, dispatch } = useAccount();
  const toast = useToast();
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState<1 | -1>(1);
  const [cards, setCards] = useState<CardRow[]>(() => [newCard()]);
  const [openCard, setOpenCard] = useState<number | null>(null);
  const [showErrors, setShowErrors] = useState(false);
  const [addressId, setAddressId] = useState<string | null>(null);
  const [addingAddress, setAddingAddress] = useState(false);
  const [country, setCountry] = useState<"US" | "CA">("US");
  const [done, setDone] = useState(false);
  const panel = useRef<HTMLDivElement>(null);

  // Photo previews outlive step 4 (review shows them), so free them only when the flow closes.
  const cardsRef = useRef(cards);
  cardsRef.current = cards;
  useEffect(() => () => cardsRef.current.forEach(revokePhotos), []);

  const addresses = state.addresses;
  const address = addresses.find((a) => a.id === (addressId ?? addresses.find((x) => x.isDefault)?.id ?? addresses[0]?.id));
  const last = steps.length - 1;

  // Without saved addresses, step 5 opens straight into the new-address form (5b).
  useEffect(() => {
    if (step === 4 && addresses.length === 0) setAddingAddress(true);
  }, [step, addresses.length]);

  const setCount = (n: number) => {
    const count = Math.max(1, Math.min(50, n));
    if (count < cards.length) cards.slice(count).forEach(revokePhotos);
    setCards((c) => (count > c.length ? [...c, ...Array.from({ length: count - c.length }, newCard)] : c.slice(0, count)));
  };

  // Validate the fields shown in the current step.
  const valid = () => {
    const fields = panel.current?.querySelectorAll<HTMLInputElement | HTMLSelectElement>("[data-step-field]") ?? [];
    for (const f of Array.from(fields)) {
      if (!f.checkValidity()) {
        f.reportValidity();
        return false;
      }
    }
    if (step === 3) {
      const bad = cards.find((c) => cardIssues(c).length > 0);
      if (bad) {
        setShowErrors(true);
        setOpenCard(bad.id);
        requestAnimationFrame(() => panel.current?.querySelector(`[data-card="${bad.id}"]`)?.scrollIntoView({ block: "nearest", behavior: "smooth" }));
        return false;
      }
    }
    if (step === 4 && !addingAddress && !address) {
      setAddingAddress(true);
      return false;
    }
    return true;
  };

  const go = (to: number) => {
    if (to < 0 || to > last || to === step) return;
    if (to > step && !valid()) return;
    setDir(to > step ? 1 : -1);
    setStep(to);
  };

  const saveAddress = (form: HTMLFormElement) => {
    const fd = new FormData(form);
    const g = (k: string) => String(fd.get(k) ?? "").trim();
    const id = `a${Date.now()}`;
    dispatch({
      type: "address/add",
      address: {
        id,
        label: "Return address",
        name: `${g("first")} ${g("last")}`.trim(),
        line1: [g("line1"), g("line2")].filter(Boolean).join(", "),
        city: g("city"),
        region: g("region"),
        postal: g("postal"),
        country,
        isDefault: addresses.length === 0,
      },
    });
    setAddressId(id);
    setAddingAddress(false);
    toast("Address saved to your account.");
    // "Save & Continue": move straight on to review.
    setDir(1);
    setStep(last);
  };

  const copyIntake = async () => {
    try {
      await navigator.clipboard.writeText(INTAKE.join("\n"));
      toast("Shipping address copied.", "info");
    } catch {
      toast("Couldn’t copy — select the address to copy it.", "info");
    }
  };

  const restart = () => {
    cards.forEach(revokePhotos);
    setCards([newCard()]);
    setOpenCard(null);
    setShowErrors(false);
    setAddressId(null);
    setAddingAddress(false);
    setDone(false);
    setDir(-1);
    setStep(0);
  };

  const primary = (() => {
    if (step === 0) return { label: "I Understand", run: () => go(1) };
    if (step === 4 && addingAddress) return { label: "Save & Continue", run: () => (document.getElementById("submit-address-form") as HTMLFormElement | null)?.requestSubmit() };
    if (step === last) return { label: "Submit Cards", run: () => setDone(true) };
    return { label: "Continue", run: () => go(step + 1) };
  })();

  return (
    <div
      className={`relative flex min-h-[min(640px,calc(100svh-24px))] w-full flex-col overflow-hidden rounded-lg border border-line bg-ink-1 ${
        embedded ? "" : "max-h-[calc(100svh-24px)] shadow-[0_40px_120px_-20px_rgba(0,0,0,0.9)]"
      }`}
    >
      <div className="glow pointer-events-none absolute -right-24 -top-32 h-72 w-[460px]" aria-hidden />

      {/* Header: mark, progress, close */}
      <div className="relative flex items-center justify-between gap-4 px-6 pt-6 sm:px-10 sm:pt-8">
        <Image src="/assets/logo/hyp3.svg" alt="HYP3" width={3000} height={819} className="h-6 w-auto" />
        {!embedded && onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close submit cards"
            className="grid h-9 w-9 place-items-center rounded-sm text-accent transition-colors hover:bg-accent/10"
          >
            <X className="h-5 w-5" strokeWidth={2.5} />
          </button>
        )}
      </div>

      <div className="relative min-h-0 flex-1 overflow-y-auto px-6 pb-6 sm:px-10">
        <h2 className="mt-8 inline-block font-black uppercase leading-none tracking-[-0.03em] text-accent [font-size:clamp(2rem,5vw,3.25rem)]">
          Submit Cards
          <span className="mt-2 block h-[3px] w-full origin-left rounded-full bg-accent" aria-hidden />
        </h2>

        {/* Progress */}
        {!done && (
          <div className="mt-7">
            <div className="flex gap-1.5" aria-hidden>
              {steps.map((_, i) => (
                <span key={i} className="h-1 flex-1 overflow-hidden rounded-full bg-line">
                  <span className={`block h-full origin-left rounded-full bg-accent transition-transform duration-slow ease-out ${i <= step ? "scale-x-100" : "scale-x-0"}`} />
                </span>
              ))}
            </div>
            <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.14em] text-fg-dim" aria-live="polite">
              Step {step + 1} of {steps.length}
            </p>
          </div>
        )}

        {done ? (
          <div className="step-in py-10" style={{ "--dir": 1 } as React.CSSProperties}>
            <div className="grid h-14 w-14 place-items-center rounded-full bg-accent text-accent-ink shadow-[0_0_0_8px_rgba(117,251,181,0.12)]">
              <CheckIcon className="h-7 w-7" strokeWidth={2.5} />
            </div>
            <h3 className="mt-6 text-2xl font-bold tracking-[-0.03em]">Submission ready</h3>
            <p className="mt-2 text-fg-muted">
              {cards.length} graded card{cards.length > 1 ? "s" : ""} · {usd(cards.reduce((n, c) => n + (Number(c.value) || 0), 0))} declared · returns to {address ? `${address.city}, ${address.region}` : "your address"}
            </p>
            <p role="status" className="mt-6 flex max-w-lg gap-2.5 rounded-sm border border-accent/30 bg-accent/[0.06] p-3 text-[13px] leading-relaxed text-fg-2">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
              Submissions aren’t connected yet — nothing was sent. Once they launch, you’ll ship your cards to HYP3 INTAKE and track them here.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button variant="secondary" size="md" onClick={restart}>
                Start another submission
              </Button>
              {!embedded && onClose && (
                <Button size="md" onClick={onClose}>
                  Close
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div ref={panel} key={step} className="step-in mt-8" style={{ "--dir": dir } as React.CSSProperties}>
            <h3 className="text-lg font-semibold tracking-[-0.02em] text-accent">
              {step + 1}. {steps[step].title}
            </h3>
            <p className="mt-1.5 max-w-xl text-[15px] leading-relaxed text-fg-2">{steps[step].body}</p>
            <div className="mt-5 h-px max-w-xl bg-accent/40" aria-hidden />

            <div className="mt-6">
              {/* 1 — Accepted graders */}
              {step === 0 && (
                <ul className="grid max-w-xl grid-cols-2 gap-3 sm:grid-cols-4">
                  {GRADERS.map((g) => (
                    <li key={g} className="flex flex-col items-center justify-center gap-1 rounded-md border border-line-strong bg-ink-2 py-5">
                      <span className="text-2xl font-black tracking-[-0.03em] text-fg">{g}</span>
                      <span className="flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.12em] text-accent">
                        <CheckIcon className="h-3 w-3" strokeWidth={3} /> Accepted
                      </span>
                    </li>
                  ))}
                </ul>
              )}

              {/* 2 — Ship to us */}
              {step === 1 && (
                <div className="max-w-xl">
                  <p className="text-sm text-fg-muted">Use this address when shipping your cards to us:</p>
                  <div className="mt-3 flex items-start justify-between gap-4 rounded-md border border-line-strong bg-ink-2 p-5">
                    <address className="select-all whitespace-pre-line text-lg font-semibold not-italic leading-snug text-fg">{INTAKE.join("\n")}</address>
                    <button
                      type="button"
                      onClick={copyIntake}
                      className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-sm border border-line-strong px-3 text-[13px] font-semibold text-fg transition-colors hover:border-accent hover:text-accent"
                    >
                      <Copy className="h-3.5 w-3.5" /> Copy
                    </button>
                  </div>
                </div>
              )}

              {/* 3 — How many */}
              {step === 2 && (
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setCount(cards.length - 1)}
                    disabled={cards.length <= 1}
                    aria-label="Fewer cards"
                    className="grid h-14 w-14 place-items-center rounded-sm bg-accent text-accent-ink transition-opacity disabled:opacity-30"
                  >
                    <Minus className="h-5 w-5" strokeWidth={2.5} />
                  </button>
                  <label className="sr-only" htmlFor="card-count">
                    Number of graded cards
                  </label>
                  <input
                    id="card-count"
                    data-step-field
                    type="number"
                    min={1}
                    max={50}
                    required
                    value={cards.length}
                    onChange={(e) => setCount(Number(e.target.value) || 1)}
                    className="h-14 w-28 rounded-sm border border-line-strong bg-white text-center font-mono text-2xl font-semibold text-black outline-none [appearance:textfield] focus:border-accent [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <button
                    type="button"
                    onClick={() => setCount(cards.length + 1)}
                    disabled={cards.length >= 50}
                    aria-label="More cards"
                    className="grid h-14 w-14 place-items-center rounded-sm bg-accent text-accent-ink transition-opacity disabled:opacity-30"
                  >
                    <Plus className="h-5 w-5" strokeWidth={2.5} />
                  </button>
                  <span className="ml-2 text-sm text-fg-muted">graded card{cards.length > 1 ? "s" : ""}</span>
                </div>
              )}

              {/* 4 — Card details */}
              {step === 3 && (
                <CardDetailsStep
                  cards={cards}
                  setCards={setCards}
                  openId={openCard ?? cards[0]?.id ?? null}
                  setOpenId={setOpenCard}
                  showErrors={showErrors}
                  addCard={() => {
                    const c = newCard();
                    setCards((cs) => [...cs, c]);
                    setOpenCard(c.id);
                  }}
                />
              )}

              {/* 5 — Return address (5b: new address form) */}
              {step === 4 &&
                (addingAddress ? (
                  <form
                    id="submit-address-form"
                    onSubmit={(e) => {
                      e.preventDefault();
                      saveAddress(e.currentTarget);
                    }}
                    className="grid max-w-2xl gap-4 sm:grid-cols-2"
                  >
                    <Field label="First Name *">
                      <Input name="first" required autoComplete="given-name" placeholder="First Name" />
                    </Field>
                    <Field label="Last Name *">
                      <Input name="last" required autoComplete="family-name" placeholder="Last Name" />
                    </Field>
                    <Field label="Address *">
                      <Input name="line1" required autoComplete="address-line1" placeholder="Address Line 1" />
                    </Field>
                    <Field label="Address 2">
                      <Input name="line2" autoComplete="address-line2" placeholder="Address Line 2" />
                    </Field>
                    <Field label="City *">
                      <Input name="city" required autoComplete="address-level2" placeholder="City" />
                    </Field>
                    <Field label={country === "US" ? "State *" : "Province *"}>
                      <Select name="region" key={country} required defaultValue={country === "US" ? "Alabama" : "Alberta"} autoComplete="address-level1">
                        {(country === "US" ? US_STATES : CA_PROVINCES).map((s) => (
                          <option key={s}>{s}</option>
                        ))}
                      </Select>
                    </Field>
                    <Field label={country === "US" ? "Zip Code *" : "Postal Code *"}>
                      <Input name="postal" required autoComplete="postal-code" placeholder={country === "US" ? "Zip Code" : "Postal Code"} />
                    </Field>
                    <Field label="Country/Region *">
                      <Select name="country" value={country} onChange={(e) => setCountry(e.target.value as "US" | "CA")} autoComplete="country">
                        <option value="US">United States</option>
                        <option value="CA">Canada</option>
                      </Select>
                    </Field>
                    {addresses.length > 0 && (
                      <button type="button" onClick={() => setAddingAddress(false)} className="justify-self-start text-[13px] text-fg-muted hover:text-fg sm:col-span-2">
                        ← Use a saved address
                      </button>
                    )}
                  </form>
                ) : (
                  <div className="max-w-xl space-y-3">
                    {addresses.map((a) => {
                      const on = address?.id === a.id;
                      return (
                        <label
                          key={a.id}
                          className={`flex cursor-pointer items-start gap-3 rounded-md border p-4 transition-colors ${on ? "border-accent bg-accent/[0.06]" : "border-line-strong hover:border-white/25"}`}
                        >
                          <input type="radio" name="return-address" className="sr-only" checked={on} onChange={() => setAddressId(a.id)} />
                          <span className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 ${on ? "border-accent bg-accent text-accent-ink" : "border-line-strong"}`}>
                            {on && <CheckIcon className="h-3 w-3" strokeWidth={3} />}
                          </span>
                          <span className="text-sm">
                            <span className="flex items-center gap-2 font-semibold text-fg">
                              <MapPin className="h-3.5 w-3.5 text-accent" /> {a.label}
                            </span>
                            <span className="mt-0.5 block text-fg-muted">
                              {a.name}, {a.line1}, {a.city}, {a.region} {a.postal}, {a.country}
                            </span>
                          </span>
                        </label>
                      );
                    })}
                    <button
                      type="button"
                      onClick={() => setAddingAddress(true)}
                      className="inline-flex h-10 items-center gap-2 rounded-sm border border-accent/60 px-4 text-[13px] font-semibold text-accent transition-colors hover:bg-accent/10"
                    >
                      <Plus className="h-4 w-4" /> Add New Address
                    </button>
                  </div>
                ))}

              {/* 6 — Review */}
              {step === 5 && (
                <div className="space-y-6">
                  <section>
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-accent">Order Details</h4>
                      <button type="button" onClick={() => go(3)} className="inline-flex items-center gap-1.5 text-[13px] font-medium text-accent hover:underline">
                        <Pencil className="h-3.5 w-3.5" /> Edit
                      </button>
                    </div>
                    <p className="mt-1 text-sm font-semibold text-fg">Vault Graded Cards (x{cards.length})</p>
                    <div className="mt-3 h-px bg-accent/40" aria-hidden />
                    <ol className="mt-3 divide-y divide-line">
                      {cards.map((c, i) => (
                        <li key={c.id} className="flex items-center gap-3 py-3 text-sm">
                          <span className="w-6 font-mono text-fg-dim">#{i + 1}</span>
                          {c.front ? (
                            // eslint-disable-next-line @next/next/no-img-element -- local object URL preview
                            <img src={c.front} alt="" className="h-12 w-9 shrink-0 rounded-[4px] object-cover ring-1 ring-line-strong" />
                          ) : (
                            <span className="h-12 w-9 shrink-0 rounded-[4px] bg-ink-3" />
                          )}
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-fg-2">{cardTitle(c)}</span>
                            <span className="block truncate font-mono text-[10px] uppercase tracking-[0.1em] text-fg-dim">
                              {c.grader} {c.grade} · cert {c.cert}
                              {c.auto && " · auto"} · {c.category}
                            </span>
                          </span>
                          <span className="shrink-0 font-mono tabular-nums text-fg">{usd(Number(c.value) || 0)}</span>
                        </li>
                      ))}
                    </ol>
                    <div className="mt-3 flex items-center justify-between border-t border-accent/40 pt-3 text-sm">
                      <span className="text-fg-muted">Total declared value</span>
                      <span className="font-mono tabular-nums text-accent">{usd(cards.reduce((n, c) => n + (Number(c.value) || 0), 0))}</span>
                    </div>
                  </section>
                  {address && (
                    <section>
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-accent">Return Address</h4>
                        <button type="button" onClick={() => go(4)} className="inline-flex items-center gap-1.5 text-[13px] font-medium text-accent hover:underline">
                          <Pencil className="h-3.5 w-3.5" /> Edit
                        </button>
                      </div>
                      <p className="mt-2 text-sm text-fg-2">
                        {address.name}, {address.line1}, {address.city}, {address.region} {address.postal}, {address.country}
                      </p>
                    </section>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer: primary action left, prev/next right */}
      {!done && (
        <div className="relative flex items-center justify-between gap-4 border-t border-line px-6 py-5 sm:px-10">
          <Button size="md" arrow={step === last} onClick={primary.run}>
            {primary.label}
          </Button>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => go(step - 1)}
              disabled={step === 0}
              aria-label="Previous step"
              className="grid h-10 w-10 place-items-center rounded-sm bg-accent text-accent-ink transition-opacity disabled:bg-transparent disabled:text-fg-dim disabled:ring-1 disabled:ring-inset disabled:ring-line-strong"
            >
              <ChevronLeft className="h-5 w-5" strokeWidth={2.5} />
            </button>
            <button
              type="button"
              onClick={() => (step === 4 && addingAddress ? primary.run() : go(step + 1))}
              disabled={step === last}
              aria-label="Next step"
              className="grid h-10 w-10 place-items-center rounded-sm border border-accent text-accent transition-colors hover:bg-accent hover:text-accent-ink disabled:border-line-strong disabled:text-fg-dim disabled:hover:bg-transparent"
            >
              <ChevronRight className="h-5 w-5" strokeWidth={2.5} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
