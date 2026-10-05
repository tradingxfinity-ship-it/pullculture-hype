"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, type ReactNode } from "react";
import { ArrowUpRight, Camera, Check as CheckIcon, CreditCard, Eye, Info, KeyRound, Loader2, MapPin, Plus, RotateCcw, ShieldCheck, Smartphone, Trash2, TriangleAlert } from "lucide-react";
import { Instagram } from "lucide-react";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { Check, Field, Input, PasswordInput, Select, Textarea } from "@/components/ui/Form";
import { TikTokIcon, XIcon } from "@/components/ui/SocialIcons";
import { useToast } from "@/components/ui/Toast";
import { useAccount } from "./AccountProvider";
import { fitImage } from "@/lib/image";
import { usd } from "@/lib/data";
import type { NotificationPrefs, Socials } from "@/lib/account";

const tabs = [
  { key: "personal", label: "Personal Settings" },
  { key: "wallet", label: "Wallet" },
  { key: "security", label: "Security" },
  { key: "notifications", label: "Notifications" },
  { key: "public", label: "Public Profile" },
  { key: "demo", label: "Demo Data" },
] as const;
type Tab = (typeof tabs)[number]["key"];
// Older links (?tab=profile / addresses) land on Personal Settings
const tabFrom = (t: string | null): Tab => (tabs.some((x) => x.key === t) ? (t as Tab) : "personal");

const SHOWCASE_MAX = 4;

function Card({ title, body, action, children }: { title: string; body?: string; action?: ReactNode; children: ReactNode }) {
  return (
    <section className="rounded-md border border-line bg-ink-1 p-5 md:p-7">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-[-0.03em]">{title}</h2>
          {body && <p className="mt-1 text-sm text-fg-muted">{body}</p>}
        </div>
        {action}
      </div>
      <div className="mt-6">{children}</div>
    </section>
  );
}

function Toggle({ on, onChange, label, body }: { on: boolean; onChange: (v: boolean) => void; label: string; body?: string }) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-6 py-3.5">
      <span>
        <span className="block font-medium text-fg">{label}</span>
        {body && <span className="mt-0.5 block text-sm text-fg-muted">{body}</span>}
      </span>
      <span className="relative shrink-0">
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

const socialFields: { key: keyof Socials; label: string; icon: (p: { className?: string }) => ReactNode }[] = [
  { key: "instagram", label: "Instagram", icon: (p) => <Instagram {...p} strokeWidth={1.75} /> },
  { key: "x", label: "X (Twitter)", icon: XIcon },
  { key: "tiktok", label: "TikTok", icon: TikTokIcon },
];
// Accept "@name", "name" or a pasted profile link
const cleanHandle = (v: string) =>
  v
    .trim()
    .replace(/^https?:\/\/(www\.)?[^/]+\/@?/i, "")
    .replace(/^@/, "")
    .replace(/[/?#].*$/, "");

/* ------------------------------------------------------------------ */
/* Cover, photo, socials and bio                                       */
/* ------------------------------------------------------------------ */

function ProfileEditor() {
  const { state, dispatch, hydrated } = useAccount();
  const toast = useToast();
  const [busy, setBusy] = useState<"cover" | "avatar" | null>(null);
  const { user } = state;

  const upload = async (kind: "cover" | "avatar", file?: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) return toast("Choose an image file (JPG, PNG or WebP).", "info");
    setBusy(kind);
    try {
      const url = kind === "cover" ? await fitImage(file, 1250, 350) : await fitImage(file, 320, 320);
      dispatch({ type: "profile", user: { [kind]: url } });
      toast(kind === "cover" ? "Cover updated." : "Profile photo updated.");
    } catch {
      toast("That image couldn't be read. Try a JPG or PNG.", "info");
    } finally {
      setBusy(null);
    }
  };

  return (
    <section className="overflow-hidden rounded-lg border border-line bg-ink-1">
      {/* Cover */}
      <label className="group relative block aspect-[1250/350] min-h-[140px] w-full cursor-pointer overflow-hidden bg-ink-2">
        <Image src={user.cover} alt="" fill priority sizes="(min-width:1024px) 1000px, 100vw" className="object-cover transition-transform duration-slow ease-out group-hover:scale-[1.02]" />
        <span className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30" aria-hidden />
        <span className="absolute inset-0 grid place-items-center">
          <span className="flex flex-col items-center gap-2 rounded-md border border-white/10 bg-black/55 px-5 py-4 text-fg backdrop-blur-md transition duration-base ease-out group-hover:scale-105 group-hover:border-accent/60">
            {busy === "cover" ? <Loader2 className="h-7 w-7 animate-spin text-accent" /> : <Camera className="h-7 w-7 text-accent" strokeWidth={1.75} />}
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-fg-2">Change cover · 1250 × 350px</span>
          </span>
        </span>
        <input type="file" accept="image/*" className="sr-only" aria-label="Upload cover image" onChange={(e) => (upload("cover", e.target.files?.[0]), (e.target.value = ""))} />
      </label>

      <div className="relative px-5 pb-6 md:px-7 md:pb-7">
        <div className="-mt-12 flex items-end justify-between gap-4 md:-mt-14">
          {/* Profile photo */}
          <label className="group relative block h-24 w-24 shrink-0 cursor-pointer overflow-hidden rounded-md border-2 border-accent bg-ink-2 shadow-[0_12px_30px_-8px_rgba(0,0,0,0.8)] md:h-28 md:w-28">
            <Image src={user.avatar} alt="" fill sizes="112px" className="object-cover" />
            <span className="absolute inset-0 grid place-items-center bg-black/55 opacity-0 transition-opacity duration-base group-hover:opacity-100 group-focus-within:opacity-100">
              {busy === "avatar" ? <Loader2 className="h-6 w-6 animate-spin text-accent" /> : <Camera className="h-6 w-6 text-accent" strokeWidth={1.75} />}
            </span>
            <span className="absolute bottom-1.5 right-1.5 grid h-7 w-7 place-items-center rounded-[6px] bg-accent text-accent-ink transition-opacity group-hover:opacity-0" aria-hidden>
              <Camera className="h-3.5 w-3.5" />
            </span>
            <input type="file" accept="image/*" className="sr-only" aria-label="Upload profile photo" onChange={(e) => (upload("avatar", e.target.files?.[0]), (e.target.value = ""))} />
          </label>
          <Button href={`/u/${user.handle}`} variant="secondary" size="sm">
            <Eye className="h-4 w-4" /> View public profile
          </Button>
        </div>

        <form
          // remount after load/save so fields show the stored (cleaned) values
          key={`${hydrated}-${JSON.stringify(user.socials)}-${user.bio}`}
          onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            const g = (k: string) => String(fd.get(k) ?? "");
            dispatch({
              type: "profile",
              user: {
                bio: g("bio").trim(),
                socials: { instagram: cleanHandle(g("instagram")), x: cleanHandle(g("x")), tiktok: cleanHandle(g("tiktok")) },
              },
            });
            toast("Profile saved.");
          }}
          className="mt-6 space-y-5"
        >
          <div>
            <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.12em] text-fg-muted">Socials</p>
            <div className="grid gap-3 sm:grid-cols-3">
              {socialFields.map(({ key, label, icon: I }) => (
                <label key={key} className="relative block">
                  <span className="sr-only">{label}</span>
                  <I className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-fg-muted" />
                  <Input name={key} defaultValue={user.socials[key] ? `@${user.socials[key]}` : ""} placeholder={`@${key === "x" ? "Twitter-X" : label}`} maxLength={60} className="pl-10" />
                </label>
              ))}
            </div>
          </div>
          <Field label="Your bio" hint={`${160} characters max`}>
            <Textarea name="bio" defaultValue={user.bio} maxLength={160} placeholder="Enter your bio here..." />
          </Field>
          <div className="flex justify-end">
            <Button type="submit" size="md">
              Save profile
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

export default function SettingsView() {
  const { state, dispatch, hydrated } = useAccount();
  const toast = useToast();
  const router = useRouter();
  const params = useSearchParams();
  const [tab, setTab] = useState<Tab>(tabFrom(params.get("tab")));
  const [adding, setAdding] = useState(false);
  const [modal, setModal] = useState<null | "password" | "twoFactor" | "delete" | "reset">(null);
  const [pwNote, setPwNote] = useState(false);
  const [payNote, setPayNote] = useState(false);
  const [deleteText, setDeleteText] = useState("");
  const [prefs, setPrefs] = useState<NotificationPrefs | null>(null);
  const draft = prefs ?? state.notifications;

  const go = (t: Tab) => {
    setTab(t);
    router.replace(t === "personal" ? "/account/settings" : `/account/settings?tab=${t}`, { scroll: false });
  };

  const notifyCols: { key: keyof NotificationPrefs; label: string; body: string }[][] = [
    [
      { key: "packDrops", label: "Pack drop alerts", body: "New packs and restocks." },
      { key: "newFeatures", label: "New features added", body: "When we ship something new." },
      { key: "marketplace", label: "Marketplace", body: "Offers and sales on your listings." },
      { key: "productUpdates", label: "Product updates", body: "Occasional news from the team." },
    ],
    [
      { key: "newAuction", label: "New auction", body: "Auctions for cards you follow." },
      { key: "auctionLost", label: "Auction lost", body: "When an auction ends without you." },
      { key: "extendedBidding", label: "Extended bidding live", body: "Late bids pushed the clock back." },
      { key: "outbid", label: "Outbid", body: "Someone beat your bid." },
    ],
  ];

  const showcaseable = state.vault.filter((v) => v.status !== "shipping");
  const toggleShowcase = (id: string) => {
    const list = state.profile.showcase;
    if (list.includes(id)) return dispatch({ type: "publicProfile", profile: { showcase: list.filter((x) => x !== id) } });
    if (list.length >= SHOWCASE_MAX) return toast(`Your showcase holds ${SHOWCASE_MAX} cards. Remove one first.`, "info");
    dispatch({ type: "publicProfile", profile: { showcase: [...list, id] } });
  };

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <ProfileEditor />

      {/* Tabs */}
      <nav aria-label="Settings" className="no-scrollbar -mx-gutter overflow-x-auto border-b border-line px-gutter md:mx-0 md:px-0">
        <ul className="flex w-max gap-1">
          {tabs.map((t) => {
            const on = tab === t.key;
            return (
              <li key={t.key}>
                <button
                  type="button"
                  onClick={() => go(t.key)}
                  aria-current={on ? "page" : undefined}
                  className={`relative flex h-11 items-center whitespace-nowrap px-3.5 text-sm font-medium transition-colors ${on ? "text-accent" : "text-fg-muted hover:text-fg"}`}
                >
                  {t.label}
                  <span className={`absolute inset-x-3 -bottom-px h-[2px] origin-left bg-accent transition-transform duration-base ease-out ${on ? "scale-x-100" : "scale-x-0"}`} aria-hidden />
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div key={tab} className="step-in min-w-0 space-y-6" style={{ "--dir": 1 } as React.CSSProperties}>
        {tab === "personal" && (
          <>
            <Card title="Personal settings" body="Private to you. Only your display name and username appear publicly.">
              <form
                key={hydrated ? "h" : "s"}
                onSubmit={(e) => {
                  e.preventDefault();
                  const fd = new FormData(e.currentTarget);
                  const g = (k: string) => String(fd.get(k) ?? "").trim();
                  dispatch({
                    type: "profile",
                    user: { name: g("name"), handle: g("handle").replace(/^@/, ""), email: g("email"), firstName: g("firstName"), lastName: g("lastName"), phone: g("phone") },
                  });
                  toast("Personal settings saved.");
                }}
                className="grid gap-4 sm:grid-cols-2"
              >
                <Field label="Display name">
                  <Input name="name" required maxLength={32} defaultValue={state.user.name} />
                </Field>
                <Field label="Username" hint="Your profile link">
                  <Input name="handle" required defaultValue={`@${state.user.handle}`} pattern="@?[A-Za-z0-9_.]{3,20}" title="3–20 letters, numbers, dots or underscores" />
                </Field>
                <Field label="Email">
                  <Input name="email" type="email" required autoComplete="email" defaultValue={state.user.email} placeholder="you@email.com" />
                </Field>
                <Field label="Phone number" hint="Optional">
                  <Input name="phone" type="tel" autoComplete="tel" defaultValue={state.user.phone} placeholder="Enter phone number here" pattern={String.raw`[0-9 \(\)\.\+\-]{7,20}`} title="Digits, spaces and + ( ) . - only" />
                </Field>
                <Field label="First name">
                  <Input name="firstName" autoComplete="given-name" defaultValue={state.user.firstName} placeholder="First name here" />
                </Field>
                <Field label="Last name">
                  <Input name="lastName" autoComplete="family-name" defaultValue={state.user.lastName} placeholder="Last name here" />
                </Field>
                <div className="flex justify-end sm:col-span-2">
                  <Button type="submit" size="md">
                    Save changes
                  </Button>
                </div>
              </form>
            </Card>

            <Card
              title="Saved addresses"
              body="We currently ship to the U.S. and Canada."
              action={
                <Button variant="secondary" size="sm" onClick={() => setAdding(true)}>
                  <Plus className="h-4 w-4" /> Add new address
                </Button>
              }
            >
              {state.addresses.length === 0 ? (
                <p className="text-sm text-fg-dim">No addresses currently added.</p>
              ) : (
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
              )}
            </Card>
          </>
        )}

        {tab === "wallet" && (
          <>
            <Card
              title="Saved payment methods"
              body="Cards and bank accounts for adding funds and checkout."
              action={
                <Button variant="secondary" size="sm" onClick={() => setPayNote(true)}>
                  <Plus className="h-4 w-4" /> Add payment method
                </Button>
              }
            >
              <div className="grid place-items-center rounded-md border border-dashed border-line-strong px-6 py-10 text-center">
                <CreditCard className="h-7 w-7 text-fg-dim" strokeWidth={1.5} />
                <p className="mt-3 text-sm text-fg-muted">No payment methods currently added.</p>
              </div>
              {payNote && <Note>Payment methods will be added through our payment processor (Stripe) once checkout launches. Nothing is stored here.</Note>}
            </Card>
            <Link href="/account/wallet" className="group flex items-center justify-between rounded-md border border-line bg-ink-1 p-5 transition-colors hover:border-line-strong">
              <span>
                <span className="eyebrow !text-[10px]">Wallet balance</span>
                <span className="mt-1 block font-mono text-2xl tabular-nums text-accent">{usd(state.balance, true)}</span>
              </span>
              <span className="inline-flex items-center gap-1.5 text-sm font-medium text-fg">
                Manage wallet <ArrowUpRight className="h-4 w-4 text-accent transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </span>
            </Link>
          </>
        )}

        {tab === "security" && (
          <div className="grid gap-6 md:grid-cols-2">
            <Card title="Two-factor authentication (2FA)" body="Add a one-time code from an authenticator app on top of your password.">
              {state.twoFactor ? (
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="inline-flex items-center gap-2 text-sm font-medium text-accent">
                    <ShieldCheck className="h-4 w-4" /> Authenticator app on
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      dispatch({ type: "twoFactor", on: false });
                      toast("Two-factor turned off.", "info");
                    }}
                  >
                    Turn off
                  </Button>
                </div>
              ) : (
                <Button variant="secondary" size="md" onClick={() => setModal("twoFactor")}>
                  <Smartphone className="h-4 w-4" /> Use authenticator app
                </Button>
              )}
            </Card>
            <Card title="Account security" body="Change your password or close your account.">
              <div className="flex flex-wrap gap-3">
                <Button variant="secondary" size="md" onClick={() => (setPwNote(false), setModal("password"))}>
                  <KeyRound className="h-4 w-4" /> Change password
                </Button>
                <button
                  type="button"
                  onClick={() => (setDeleteText(""), setModal("delete"))}
                  className="inline-flex h-11 items-center gap-2 rounded-sm border border-red-400/50 px-4 text-sm font-semibold text-red-400 transition-colors hover:bg-red-400/10"
                >
                  <Trash2 className="h-4 w-4" /> Delete account
                </button>
              </div>
            </Card>
          </div>
        )}

        {tab === "notifications" && (
          <Card title="Email notifications" body="Choose what lands in your inbox.">
            <div className="grid gap-x-10 md:grid-cols-2">
              {notifyCols.map((col, i) => (
                <div key={i} className="divide-y divide-line">
                  {col.map((r) => (
                    <Toggle key={r.key} on={draft[r.key]} onChange={(v) => setPrefs({ ...draft, [r.key]: v })} label={r.label} body={r.body} />
                  ))}
                </div>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap gap-3 border-t border-line pt-6">
              <Button
                size="md"
                onClick={() => {
                  dispatch({ type: "notify", prefs: draft });
                  setPrefs(null);
                  toast("Notification preferences saved.");
                }}
              >
                Save
              </Button>
              <Button
                variant="secondary"
                size="md"
                onClick={() => {
                  const off = Object.fromEntries(Object.keys(draft).map((k) => [k, false])) as NotificationPrefs;
                  dispatch({ type: "notify", prefs: off });
                  setPrefs(null);
                  toast("Unsubscribed from all emails.", "info");
                }}
              >
                Unsubscribe from all
              </Button>
            </div>
          </Card>
        )}

        {tab === "public" && (
          <>
            <Card
              title="Public profile"
              body="Choose what other collectors see on your profile."
              action={
                <Button href={`/u/${state.user.handle}`} variant="secondary" size="sm">
                  <Eye className="h-4 w-4" /> View
                </Button>
              }
            >
              <div className="divide-y divide-line">
                <Toggle on={state.profile.showCollection} onChange={(v) => dispatch({ type: "publicProfile", profile: { showCollection: v } })} label="Show my collection" body="Cards in your vault appear on your profile." />
                <Toggle on={state.profile.showValue} onChange={(v) => dispatch({ type: "publicProfile", profile: { showValue: v } })} label="Show card values" body="Display estimated values and your collection total." />
              </div>
            </Card>
            <Card title="Showcase" body={`Pin up to ${SHOWCASE_MAX} cards to the top of your profile. ${state.profile.showcase.length}/${SHOWCASE_MAX} pinned.`}>
              {showcaseable.length === 0 ? (
                <p className="text-sm text-fg-dim">Your vault is empty. Rip a pack to start a showcase.</p>
              ) : (
                <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                  {showcaseable.map((v) => {
                    const pos = state.profile.showcase.indexOf(v.id);
                    const on = pos >= 0;
                    return (
                      <li key={v.id}>
                        <button
                          type="button"
                          onClick={() => toggleShowcase(v.id)}
                          aria-pressed={on}
                          className={`group relative flex w-full items-center gap-3 rounded-md border p-2.5 text-left transition-colors ${on ? "border-accent bg-accent/[0.06]" : "border-line hover:border-line-strong"}`}
                        >
                          <span className="relative h-16 w-10 shrink-0">
                            <Image src={v.image} alt="" fill sizes="40px" className="object-contain" />
                          </span>
                          <span className="min-w-0">
                            <span className="block truncate text-sm font-semibold text-fg">{v.name}</span>
                            <span className="block font-mono text-[10px] uppercase tracking-[0.1em] text-fg-dim">{v.grade}</span>
                          </span>
                          <span className={`absolute right-2 top-2 grid h-5 w-5 place-items-center rounded-full font-mono text-[10px] font-semibold ${on ? "bg-accent text-accent-ink" : "border border-line-strong text-transparent group-hover:text-fg-dim"}`}>
                            {on ? pos + 1 : <CheckIcon className="h-3 w-3" />}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </Card>
          </>
        )}

        {tab === "demo" && (
          <Card title="Demo data" body="There’s no account system yet. This area runs on sample data saved in your browser, so you can try every flow.">
            <p className="text-sm text-fg-muted">Resetting restores the original vault, balance, offers, orders, favorites, profile and settings.</p>
            <Button variant="secondary" size="md" className="mt-5" onClick={() => setModal("reset")}>
              <RotateCcw className="h-4 w-4" /> Reset demo data
            </Button>
          </Card>
        )}
      </div>

      {/* ---------------- Modals ---------------- */}

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

      <Modal open={modal === "password"} onClose={() => setModal(null)} title="Change password" description="Use at least 8 characters.">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            const next = e.currentTarget.elements.namedItem("confirm") as HTMLInputElement;
            if (fd.get("next") !== fd.get("confirm")) {
              next.setCustomValidity("Passwords don’t match");
              next.reportValidity();
              return;
            }
            setPwNote(true);
          }}
          className="space-y-4"
        >
          <Field label="Current password">
            <PasswordInput name="current" required autoComplete="current-password" />
          </Field>
          <Field label="New password">
            <PasswordInput name="next" required minLength={8} autoComplete="new-password" />
          </Field>
          <Field label="Confirm new password">
            <PasswordInput name="confirm" required minLength={8} autoComplete="new-password" onInput={(e) => e.currentTarget.setCustomValidity("")} />
          </Field>
          {pwNote && <Note>Accounts aren’t connected yet, so your password wasn’t changed. This will work once sign-in launches.</Note>}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <Button type="button" variant="secondary" size="md" onClick={() => setModal(null)}>
              Close
            </Button>
            <Button type="submit" size="md">
              Update password
            </Button>
          </div>
        </form>
      </Modal>

      <Modal open={modal === "twoFactor"} onClose={() => setModal(null)} title="Use an authenticator app" description="Works with Google Authenticator, 1Password, Authy and similar apps.">
        <ol className="space-y-4 text-sm text-fg-2">
          {["Install an authenticator app on your phone.", "Scan the QR code we show you at your next sign-in.", "Enter the 6-digit code from the app to confirm."].map((s, i) => (
            <li key={s} className="flex gap-3">
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-accent/50 font-mono text-[11px] text-accent">{i + 1}</span>
              <span className="pt-0.5">{s}</span>
            </li>
          ))}
        </ol>
        <Note>Sign-in isn’t live yet, so there’s no code to scan today. Turning this on saves your preference, and we’ll walk you through setup when accounts launch.</Note>
        <div className="mt-6 grid grid-cols-2 gap-3">
          <Button variant="secondary" size="md" onClick={() => setModal(null)}>
            Cancel
          </Button>
          <Button
            size="md"
            onClick={() => {
              dispatch({ type: "twoFactor", on: true });
              setModal(null);
              toast("Two-factor preference saved.");
            }}
          >
            Turn on
          </Button>
        </div>
      </Modal>

      <Modal open={modal === "delete"} onClose={() => setModal(null)} title="Delete account?" description="This permanently removes your vault, balance, listings and history.">
        <p className="flex gap-2.5 rounded-sm border border-red-400/30 bg-red-400/[0.06] p-3 text-[13px] leading-relaxed text-fg-2">
          <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
          In this demo there’s no real account, so deleting resets the sample data in your browser.
        </p>
        <Field label='Type "DELETE" to confirm' className="mt-5">
          <Input value={deleteText} onChange={(e) => setDeleteText(e.target.value)} autoComplete="off" />
        </Field>
        <div className="mt-6 grid grid-cols-2 gap-3">
          <Button variant="secondary" size="md" onClick={() => setModal(null)}>
            Cancel
          </Button>
          <button
            type="button"
            disabled={deleteText.trim().toUpperCase() !== "DELETE"}
            onClick={() => {
              dispatch({ type: "reset" });
              setModal(null);
              toast("Demo account deleted. Sample data restored.", "info");
            }}
            className="h-11 rounded-sm bg-red-500 text-sm font-semibold text-white transition-opacity hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Delete account
          </button>
        </div>
      </Modal>

      <Modal open={modal === "reset"} onClose={() => setModal(null)} title="Reset demo data?" description="Everything you’ve done in the account area will go back to the starting sample.">
        <div className="grid grid-cols-2 gap-3">
          <Button variant="secondary" size="md" onClick={() => setModal(null)}>
            Cancel
          </Button>
          <Button
            size="md"
            onClick={() => {
              dispatch({ type: "reset" });
              setModal(null);
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
