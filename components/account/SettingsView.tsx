"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { Bell, Camera, Database, Info, MapPin, Plus, RotateCcw, Shield, Trash2, User } from "lucide-react";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { Check, Field, Input, PasswordInput, Select, Textarea } from "@/components/ui/Form";
import { useToast } from "@/components/ui/Toast";
import { useAccount } from "./AccountProvider";
import type { NotificationPrefs } from "@/lib/account";

const sections = [
  { key: "profile", label: "Profile", icon: User },
  { key: "addresses", label: "Addresses", icon: MapPin },
  { key: "security", label: "Security", icon: Shield },
  { key: "notifications", label: "Notifications", icon: Bell },
  { key: "demo", label: "Demo data", icon: Database },
] as const;
type Section = (typeof sections)[number]["key"];

function Card({ title, body, children }: { title: string; body?: string; children: ReactNode }) {
  return (
    <section className="rounded-md border border-line bg-ink-1 p-5 md:p-7">
      <h2 className="text-xl font-bold tracking-[-0.03em]">{title}</h2>
      {body && <p className="mt-1 text-sm text-fg-muted">{body}</p>}
      <div className="mt-6">{children}</div>
    </section>
  );
}

function Toggle({ on, onChange, label, body }: { on: boolean; onChange: (v: boolean) => void; label: string; body: string }) {
  return (
    <label className="flex cursor-pointer items-start justify-between gap-6 py-4">
      <span>
        <span className="block font-medium text-fg">{label}</span>
        <span className="mt-0.5 block text-sm text-fg-muted">{body}</span>
      </span>
      <span className="relative mt-1 shrink-0">
        <input type="checkbox" role="switch" checked={on} onChange={(e) => onChange(e.target.checked)} className="peer sr-only" />
        <span className="block h-6 w-11 rounded-full border border-line-strong bg-ink-3 transition-colors peer-checked:border-accent peer-checked:bg-accent peer-focus-visible:outline peer-focus-visible:outline-1 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent" />
        <span className="absolute left-[3px] top-[3px] h-[18px] w-[18px] rounded-full bg-fg-muted transition-all duration-base ease-out peer-checked:translate-x-5 peer-checked:bg-accent-ink" />
      </span>
    </label>
  );
}

function Note({ children }: { children: ReactNode }) {
  return (
    <p role="status" className="mt-4 flex gap-2.5 rounded-sm border border-accent/30 bg-accent/[0.06] p-3 text-[13px] leading-relaxed text-fg-2">
      <Info className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
      {children}
    </p>
  );
}

export default function SettingsView() {
  const { state, dispatch } = useAccount();
  const toast = useToast();
  const router = useRouter();
  const params = useSearchParams();
  const initial = (params.get("tab") as Section) || "profile";
  const [section, setSection] = useState<Section>(sections.some((s) => s.key === initial) ? initial : "profile");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [pwNote, setPwNote] = useState(false);
  const [adding, setAdding] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  useEffect(() => () => void (avatarPreview && URL.revokeObjectURL(avatarPreview)), [avatarPreview]);

  const go = (s: Section) => {
    setSection(s);
    router.replace(s === "profile" ? "/account/settings" : `/account/settings?tab=${s}`, { scroll: false });
  };

  const notifyRows: { key: keyof NotificationPrefs; label: string; body: string }[] = [
    { key: "drops", label: "New drops", body: "New packs and restocks, every Friday." },
    { key: "offers", label: "Offers & bids", body: "When someone makes an offer or outbids you." },
    { key: "shipping", label: "Shipping updates", body: "When your order is packed, shipped or delivered." },
    { key: "newsletter", label: "Newsletter", body: "Members-only offers and collector stories." },
  ];

  return (
    <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
      {/* Section nav */}
      <nav aria-label="Settings" className="no-scrollbar -mx-gutter overflow-x-auto px-gutter lg:mx-0 lg:overflow-visible lg:px-0">
        <ul className="flex w-max gap-1 lg:sticky lg:top-[calc(var(--topbar-h)+72px)] lg:w-full lg:flex-col">
          {sections.map((s) => {
            const I = s.icon;
            const on = section === s.key;
            return (
              <li key={s.key}>
                <button
                  type="button"
                  onClick={() => go(s.key)}
                  aria-current={on ? "page" : undefined}
                  className={`flex h-10 w-full items-center gap-3 whitespace-nowrap rounded-sm px-3 text-sm font-medium transition-colors ${
                    on ? "bg-white/[0.05] text-fg" : "text-fg-muted hover:bg-white/[0.02] hover:text-fg"
                  }`}
                >
                  <I className={`h-4 w-4 ${on ? "text-accent" : ""}`} strokeWidth={1.75} />
                  {s.label}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div key={section} className="step-in min-w-0 space-y-6" style={{ "--dir": 1 } as React.CSSProperties}>
        {section === "profile" && (
          <Card title="Profile" body="How you appear on leaderboards, pulls and the Marketplace.">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const fd = new FormData(e.currentTarget);
                dispatch({
                  type: "profile",
                  user: {
                    name: String(fd.get("name")).trim(),
                    handle: String(fd.get("handle")).trim().replace(/^@/, ""),
                    email: String(fd.get("email")).trim(),
                    bio: String(fd.get("bio")).trim(),
                  },
                });
                toast("Profile saved.");
              }}
              className="space-y-5"
            >
              <div className="flex items-center gap-5">
                <div className="relative h-20 w-20 overflow-hidden rounded-md ring-1 ring-line-strong">
                  {avatarPreview ? (
                    // eslint-disable-next-line @next/next/no-img-element -- local object URL preview
                    <img src={avatarPreview} alt="New avatar preview" className="h-full w-full object-cover" />
                  ) : (
                    <Image src={state.user.avatar} alt="" fill sizes="80px" className="object-cover" />
                  )}
                </div>
                <label className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-sm border border-line-strong px-4 text-sm font-semibold text-fg transition-colors hover:border-accent hover:text-accent">
                  <Camera className="h-4 w-4" /> Change photo
                  <input
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (!f) return;
                      setAvatarPreview(URL.createObjectURL(f));
                      toast("Photo previewed. Uploads will save once accounts launch.", "info");
                    }}
                  />
                </label>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Display name">
                  <Input name="name" required defaultValue={state.user.name} />
                </Field>
                <Field label="Username">
                  <Input name="handle" required defaultValue={`@${state.user.handle}`} pattern="@?[A-Za-z0-9_.]{3,20}" />
                </Field>
                <Field label="Email" className="sm:col-span-2">
                  <Input name="email" type="email" required defaultValue={state.user.email} />
                </Field>
                <Field label="Bio" hint="Optional" className="sm:col-span-2">
                  <Textarea name="bio" defaultValue={state.user.bio} maxLength={160} />
                </Field>
              </div>
              <div className="flex justify-end">
                <Button type="submit" size="md">
                  Save profile
                </Button>
              </div>
            </form>
          </Card>
        )}

        {section === "addresses" && (
          <Card title="Shipping addresses" body="We currently ship to the U.S. and Canada.">
            <ul className="space-y-3">
              {state.addresses.map((a) => (
                <li key={a.id} className={`flex flex-col gap-3 rounded-md border p-4 sm:flex-row sm:items-center sm:justify-between ${a.isDefault ? "border-accent/40" : "border-line"}`}>
                  <div className="flex items-start gap-3">
                    <MapPin className={`mt-0.5 h-4 w-4 shrink-0 ${a.isDefault ? "text-accent" : "text-fg-dim"}`} />
                    <div className="text-sm">
                      <p className="flex items-center gap-2 font-semibold text-fg">
                        {a.label}
                        {a.isDefault && <span className="rounded-[4px] bg-accent px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.12em] text-accent-ink">Default</span>}
                      </p>
                      <p className="text-fg-muted">
                        {a.name}, {a.line1}, {a.city}, {a.region} {a.postal}, {a.country}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {!a.isDefault && (
                      <Button variant="ghost" size="sm" onClick={() => dispatch({ type: "address/default", id: a.id })}>
                        Make default
                      </Button>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        dispatch({ type: "address/remove", id: a.id });
                        toast(`Removed ${a.label}.`, "info");
                      }}
                      aria-label={`Remove ${a.label}`}
                      className="grid h-9 w-9 place-items-center rounded-sm border border-line-strong text-fg-dim transition-colors hover:border-red-400/60 hover:text-red-400"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => setAdding(true)}
              className="mt-3 flex h-12 w-full items-center justify-center gap-2 rounded-md border border-dashed border-line-strong text-sm font-semibold text-fg-muted transition-colors hover:border-accent hover:text-accent"
            >
              <Plus className="h-4 w-4" /> Add address
            </button>
          </Card>
        )}

        {section === "security" && (
          <>
            <Card title="Password" body="Use at least 8 characters.">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setPwNote(true);
                }}
                className="space-y-4"
              >
                <Field label="Current password">
                  <PasswordInput name="current" required autoComplete="current-password" />
                </Field>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="New password">
                    <PasswordInput name="next" required minLength={8} autoComplete="new-password" />
                  </Field>
                  <Field label="Confirm new password">
                    <PasswordInput name="confirm" required minLength={8} autoComplete="new-password" />
                  </Field>
                </div>
                {pwNote && <Note>Accounts aren’t connected yet — your password wasn’t changed. This will work once sign-in launches.</Note>}
                <div className="flex justify-end">
                  <Button type="submit" size="md">
                    Update password
                  </Button>
                </div>
              </form>
            </Card>
            <Card title="Two-factor authentication">
              <Toggle
                on={state.twoFactor}
                onChange={(v) => {
                  dispatch({ type: "twoFactor", on: v });
                  toast(v ? "Two-factor preference saved for when sign-in launches." : "Two-factor turned off.", "info");
                }}
                label="Require a code at sign-in"
                body="Adds a one-time code from an authenticator app on top of your password."
              />
            </Card>
          </>
        )}

        {section === "notifications" && (
          <Card title="Email notifications" body="Choose what lands in your inbox.">
            <div className="divide-y divide-line">
              {notifyRows.map((r) => (
                <Toggle
                  key={r.key}
                  on={state.notifications[r.key]}
                  onChange={(v) => {
                    dispatch({ type: "notify", prefs: { [r.key]: v } });
                    toast("Preferences saved.");
                  }}
                  label={r.label}
                  body={r.body}
                />
              ))}
            </div>
          </Card>
        )}

        {section === "demo" && (
          <Card title="Demo data" body="There’s no account system yet. This area runs on sample data saved in your browser, so you can try every flow.">
            <p className="text-sm text-fg-muted">Resetting restores the original vault, balance, offers, orders, favorites and settings.</p>
            <Button variant="secondary" size="md" className="mt-5" onClick={() => setConfirmReset(true)}>
              <RotateCcw className="h-4 w-4" /> Reset demo data
            </Button>
          </Card>
        )}
      </div>

      <Modal open={adding} onClose={() => setAdding(false)} title="Add address" size="lg">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            const g = (k: string) => String(fd.get(k) ?? "").trim();
            dispatch({
              type: "address/add",
              address: {
                id: `a${Date.now()}`,
                label: g("label") || "Address",
                name: g("name"),
                line1: g("line1"),
                city: g("city"),
                region: g("region"),
                postal: g("postal"),
                country: g("country") === "CA" ? "CA" : "US",
                isDefault: fd.get("default") === "on",
              },
            });
            toast("Address added.");
            setAdding(false);
          }}
          className="grid gap-4 sm:grid-cols-2"
        >
          <Field label="Label">
            <Input name="label" placeholder="Home, Work…" />
          </Field>
          <Field label="Full name *">
            <Input name="name" required autoComplete="name" />
          </Field>
          <Field label="Street address *" className="sm:col-span-2">
            <Input name="line1" required autoComplete="address-line1" />
          </Field>
          <Field label="City *">
            <Input name="city" required autoComplete="address-level2" />
          </Field>
          <Field label="State / Province *">
            <Input name="region" required autoComplete="address-level1" />
          </Field>
          <Field label="ZIP / Postal code *">
            <Input name="postal" required autoComplete="postal-code" />
          </Field>
          <Field label="Country *">
            <Select name="country" defaultValue="US">
              <option value="US">United States</option>
              <option value="CA">Canada</option>
            </Select>
          </Field>
          <div className="sm:col-span-2">
            <Check name="default">Make this my default address</Check>
          </div>
          <div className="mt-2 grid grid-cols-2 gap-3 sm:col-span-2">
            <Button type="button" variant="secondary" size="md" onClick={() => setAdding(false)}>
              Cancel
            </Button>
            <Button type="submit" size="md">
              Save address
            </Button>
          </div>
        </form>
      </Modal>

      <Modal open={confirmReset} onClose={() => setConfirmReset(false)} title="Reset demo data?" description="Everything you’ve done in the account area will go back to the starting sample.">
        <div className="grid grid-cols-2 gap-3">
          <Button variant="secondary" size="md" onClick={() => setConfirmReset(false)}>
            Cancel
          </Button>
          <Button
            size="md"
            onClick={() => {
              dispatch({ type: "reset" });
              setConfirmReset(false);
              toast("Demo data reset.");
            }}
          >
            Reset
          </Button>
        </div>
      </Modal>
    </div>
  );
}
