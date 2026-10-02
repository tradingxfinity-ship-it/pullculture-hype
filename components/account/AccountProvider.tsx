"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useState, type ReactNode } from "react";
import { seedAccount, type AccountState, type Address, type NotificationPrefs, type Order, type VaultItem } from "@/lib/account";

// Demo account state for the user area. Persists to localStorage so actions
// (selling back, ripping packs, offers…) carry across pages and reloads.
// Swap the reducer's effects for API calls once a backend exists.

const STORAGE_KEY = "hyp3:demo-account";

type Action =
  | { type: "load"; state: AccountState }
  | { type: "reset" }
  | { type: "sellBack"; ids: string[] }
  | { type: "list"; id: string; price: number }
  | { type: "unlist"; id: string }
  | { type: "ship"; ids: string[] }
  | { type: "rip"; pack: string; price: number; items: VaultItem[] }
  | { type: "offer"; id: string; status: "accepted" | "declined" | "cancelled" }
  | { type: "counter"; id: string; amount: number }
  | { type: "favorite"; kind: "packs" | "listings"; key: string }
  | { type: "profile"; user: Partial<AccountState["user"]> }
  | { type: "notify"; prefs: Partial<NotificationPrefs> }
  | { type: "twoFactor"; on: boolean }
  | { type: "address/add"; address: Address }
  | { type: "address/remove"; id: string }
  | { type: "address/default"; id: string };

const today = () => new Date().toISOString().slice(0, 10);
const uid = (p: string) => `${p}${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

function reducer(s: AccountState, a: Action): AccountState {
  switch (a.type) {
    case "load":
      return a.state;
    case "reset":
      return seedAccount();

    case "sellBack": {
      const sold = s.vault.filter((v) => a.ids.includes(v.id) && v.status !== "shipping");
      const total = sold.reduce((n, v) => n + v.buyback, 0);
      return {
        ...s,
        balance: s.balance + total,
        vault: s.vault.filter((v) => !sold.includes(v)),
        transactions: [
          { id: uid("t"), date: today(), type: "buyback", label: sold.length === 1 ? `Sold back · ${sold[0].name}` : `Sold back · ${sold.length} cards`, amount: total },
          ...s.transactions,
        ],
      };
    }
    case "list":
      return { ...s, vault: s.vault.map((v) => (v.id === a.id ? { ...v, status: "listed", listPrice: a.price } : v)) };
    case "unlist":
      return { ...s, vault: s.vault.map((v) => (v.id === a.id ? { ...v, status: "vault", listPrice: undefined } : v)) };

    case "ship": {
      const items = s.vault.filter((v) => a.ids.includes(v.id) && v.status === "vault");
      if (!items.length) return s;
      const order: Order = {
        id: `HYP-${10500 + s.orders.length}`,
        date: today(),
        kind: "shipment",
        items: items.map((v) => ({ name: `${v.name} ${v.grade}`, image: v.image })),
        status: "processing",
      };
      return {
        ...s,
        vault: s.vault.map((v) => (items.includes(v) ? { ...v, status: "shipping" } : v)),
        orders: [order, ...s.orders],
      };
    }

    case "rip":
      return {
        ...s,
        balance: s.balance - a.price,
        vault: [...a.items, ...s.vault],
        transactions: [{ id: uid("t"), date: today(), type: "pack", label: a.items.length > 1 ? `${a.pack} × ${a.items.length}` : a.pack, amount: -a.price }, ...s.transactions],
      };

    case "offer": {
      const o = s.offers.find((x) => x.id === a.id);
      if (!o) return s;
      let next: AccountState = { ...s, offers: s.offers.map((x) => (x.id === a.id ? { ...x, status: a.status } : x)) };
      // Accepting an offer on one of your listed cards sells it.
      if (a.status === "accepted" && o.direction === "received") {
        const listed = s.vault.find((v) => v.status === "listed" && v.name === o.card);
        next = {
          ...next,
          balance: next.balance + o.amount,
          vault: listed ? next.vault.filter((v) => v.id !== listed.id) : next.vault,
          // Other pending offers on the same card lapse once it's sold.
          offers: next.offers.map((x) => (x.id !== o.id && x.card === o.card && x.direction === "received" && x.status === "pending" ? { ...x, status: "declined" } : x)),
          transactions: [{ id: uid("t"), date: today(), type: "sale", label: `Offer accepted · ${o.card}`, amount: o.amount }, ...next.transactions],
        };
      }
      return next;
    }
    case "counter":
      return { ...s, offers: s.offers.map((x) => (x.id === a.id ? { ...x, status: "countered", counter: a.amount } : x)) };

    case "favorite": {
      const list = s.favorites[a.kind];
      const has = list.includes(a.key);
      return { ...s, favorites: { ...s.favorites, [a.kind]: has ? list.filter((k) => k !== a.key) : [a.key, ...list] } };
    }

    case "profile":
      return { ...s, user: { ...s.user, ...a.user } };
    case "notify":
      return { ...s, notifications: { ...s.notifications, ...a.prefs } };
    case "twoFactor":
      return { ...s, twoFactor: a.on };

    case "address/add": {
      const first = s.addresses.length === 0;
      return { ...s, addresses: [...s.addresses.map((x) => (a.address.isDefault ? { ...x, isDefault: false } : x)), { ...a.address, isDefault: a.address.isDefault || first }] };
    }
    case "address/remove": {
      const rest = s.addresses.filter((x) => x.id !== a.id);
      if (rest.length && !rest.some((x) => x.isDefault)) rest[0] = { ...rest[0], isDefault: true };
      return { ...s, addresses: rest };
    }
    case "address/default":
      return { ...s, addresses: s.addresses.map((x) => ({ ...x, isDefault: x.id === a.id })) };
  }
}

type Ctx = { state: AccountState; dispatch: (a: Action) => void; hydrated: boolean };
const AccountCtx = createContext<Ctx | null>(null);

export default function AccountProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, seedAccount);
  const [hydrated, setHydrated] = useState(false);

  // Load persisted demo state after mount (server render always uses the seed).
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as AccountState;
        if (saved?.version === seedAccount().version) dispatch({ type: "load", state: saved });
      }
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {}
  }, [state, hydrated]);

  const value = useMemo(() => ({ state, dispatch, hydrated }), [state, hydrated]);
  return <AccountCtx.Provider value={value}>{children}</AccountCtx.Provider>;
}

export function useAccount() {
  const ctx = useContext(AccountCtx);
  if (!ctx) throw new Error("useAccount must be used inside <AccountProvider>");
  return ctx;
}

// Convenience selectors
export function useAccountStats() {
  const { state } = useAccount();
  return useMemo(() => {
    const inVault = state.vault.filter((v) => v.status !== "shipping");
    return {
      vaultValue: inVault.reduce((n, v) => n + v.value, 0),
      vaultCount: inVault.length,
      listedCount: state.vault.filter((v) => v.status === "listed").length,
      pendingOffers: state.offers.filter((o) => o.direction === "received" && o.status === "pending").length,
      activeOrders: state.orders.filter((o) => o.status !== "delivered").length,
    };
  }, [state]);
}

export function useIsFavorite() {
  const { state, dispatch } = useAccount();
  const is = useCallback((kind: "packs" | "listings", key: string) => state.favorites[kind].includes(key), [state.favorites]);
  const toggle = useCallback((kind: "packs" | "listings", key: string) => dispatch({ type: "favorite", kind, key }), [dispatch]);
  return { is, toggle };
}
