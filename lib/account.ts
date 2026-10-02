// Demo data for the signed-in user area. There is no account backend yet;
// AccountProvider seeds its state from here and persists changes in the
// browser so the demo feels live. Replace with API calls when auth exists.

import { me } from "./data";

export type VaultStatus = "vault" | "listed" | "shipping";

export type VaultItem = {
  id: string;
  name: string;
  set: string;
  grade: string; // e.g. "PSA 10" or "Raw"
  image: string;
  value: number; // estimated market value
  buyback: number; // instant buyback offer
  pack: string; // pack it was pulled from
  pulledAt: string; // ISO date
  status: VaultStatus;
  listPrice?: number;
};

export type TxType = "deposit" | "pack" | "buyback" | "sale" | "purchase" | "withdrawal";
export type Transaction = { id: string; date: string; type: TxType; label: string; amount: number };

export type OrderStatus = "processing" | "packed" | "shipped" | "delivered";
export type Order = {
  id: string;
  date: string;
  kind: "shipment" | "marketplace";
  items: { name: string; image: string }[];
  status: OrderStatus;
  carrier?: string;
  tracking?: string;
};

export type OfferStatus = "pending" | "accepted" | "declined" | "countered" | "cancelled";
export type Offer = {
  id: string;
  direction: "received" | "sent";
  card: string;
  set: string;
  image: string;
  ask: number;
  amount: number;
  counterparty: string;
  expiresAt: string; // ISO
  status: OfferStatus;
  counter?: number;
};

export type Address = { id: string; label: string; name: string; line1: string; city: string; region: string; postal: string; country: "US" | "CA"; isDefault: boolean };

export type NotificationPrefs = { drops: boolean; offers: boolean; shipping: boolean; newsletter: boolean };

export type AccountState = {
  version: number;
  user: { name: string; handle: string; email: string; avatar: string; joined: string; bio: string };
  balance: number;
  points: number;
  rank: number;
  pointsToday: number;
  vault: VaultItem[];
  transactions: Transaction[];
  orders: Order[];
  offers: Offer[];
  favorites: { packs: string[]; listings: string[] };
  addresses: Address[];
  notifications: NotificationPrefs;
  twoFactor: boolean;
};

const SLAB_POKEMON = "/assets/cards/Pack-02.webp";
const SLAB_LEBRON = "/assets/cards/Pack-03.webp";

const hoursFromNow = (h: number) => new Date(Date.now() + h * 3_600_000).toISOString();

export const seedAccount = (): AccountState => ({
  version: 1,
  user: {
    name: "Steezy",
    handle: "steezy",
    email: "steezy@example.com",
    avatar: "/assets/users/user-01.webp",
    joined: "2025-03-14",
    bio: "Chasing grails since the Base Set days.",
  },
  balance: 1250,
  points: me.points,
  rank: me.rank,
  pointsToday: me.today,
  vault: [
    { id: "v1", name: "LeBron James #78", set: "2003 UD Exquisite Rookie Patch Auto /23", grade: "PSA 8.5", image: SLAB_LEBRON, value: 25215, buyback: 20170, pack: "Basketball Platinum Pack", pulledAt: "2026-09-28", status: "vault" },
    { id: "v2", name: "Gardevoir ex #233", set: "2024 Pokemon SV", grade: "PSA 10", image: SLAB_POKEMON, value: 355, buyback: 284, pack: "Pokémon Gold Pack", pulledAt: "2026-09-27", status: "vault" },
    { id: "v3", name: "Charizard", set: "Pokémon Ember Pack · Chaser", grade: "PSA 9", image: SLAB_POKEMON, value: 640, buyback: 512, pack: "Pokémon Platinum Pack", pulledAt: "2026-09-25", status: "listed", listPrice: 720 },
    { id: "v4", name: "Gym Heroes #59 1st Edition", set: "2000 Pokémon Gym Heroes", grade: "PSA 10", image: SLAB_POKEMON, value: 120, buyback: 96, pack: "Pokémon Silver Pack", pulledAt: "2026-09-22", status: "vault" },
    { id: "v5", name: "Mewtwo", set: "Pokémon Ember Pack · Chaser", grade: "PSA 9", image: SLAB_POKEMON, value: 210, buyback: 168, pack: "Pokémon Gold Pack", pulledAt: "2026-09-20", status: "shipping" },
    { id: "v6", name: "Gengar", set: "Pokémon Ember Pack · Series", grade: "Raw", image: SLAB_POKEMON, value: 38, buyback: 30, pack: "Pokémon Silver Pack", pulledAt: "2026-09-18", status: "vault" },
    { id: "v7", name: "Dragonite", set: "Pokémon Ember Pack · Series", grade: "PSA 8", image: SLAB_POKEMON, value: 64, buyback: 51, pack: "Multi-Sport Silver Pack", pulledAt: "2026-09-15", status: "vault" },
    { id: "v8", name: "Snorlax", set: "Pokémon Ember Pack · Chaser", grade: "PSA 10", image: SLAB_POKEMON, value: 180, buyback: 144, pack: "Pokémon Gold Pack", pulledAt: "2026-09-11", status: "vault" },
  ],
  transactions: [
    { id: "t1", date: "2026-09-28", type: "pack", label: "Basketball Platinum Pack", amount: -100 },
    { id: "t2", date: "2026-09-27", type: "pack", label: "Pokémon Gold Pack", amount: -50 },
    { id: "t3", date: "2026-09-26", type: "deposit", label: "Added funds", amount: 500 },
    { id: "t4", date: "2026-09-24", type: "buyback", label: "Sold back · Squirtle", amount: 22 },
    { id: "t5", date: "2026-09-21", type: "sale", label: "Marketplace sale · Lapras PSA 9", amount: 145 },
    { id: "t6", date: "2026-09-19", type: "purchase", label: "Marketplace · Gardevoir ex #233", amount: -355 },
    { id: "t7", date: "2026-09-15", type: "pack", label: "Multi-Sport Silver Pack", amount: -25 },
    { id: "t8", date: "2026-09-12", type: "deposit", label: "Added funds", amount: 1000 },
  ],
  orders: [
    { id: "HYP-10482", date: "2026-09-26", kind: "shipment", items: [{ name: "Mewtwo PSA 9", image: SLAB_POKEMON }], status: "packed" },
    { id: "HYP-10311", date: "2026-09-08", kind: "marketplace", items: [{ name: "Gardevoir ex #233 PSA 10", image: SLAB_POKEMON }], status: "shipped", carrier: "USPS", tracking: "9400 1000 0000 0000 0000 00" },
    { id: "HYP-09977", date: "2026-08-14", kind: "shipment", items: [{ name: "Blastoise PSA 9", image: SLAB_POKEMON }, { name: "Venusaur PSA 8", image: SLAB_POKEMON }], status: "delivered", carrier: "UPS", tracking: "1Z 999 AA1 01 2345 6784" },
  ],
  offers: [
    { id: "o1", direction: "received", card: "Charizard", set: "Pokémon Ember Pack · PSA 9", image: SLAB_POKEMON, ask: 720, amount: 650, counterparty: "@vaulthunter", expiresAt: hoursFromNow(20), status: "pending" },
    { id: "o2", direction: "received", card: "Charizard", set: "Pokémon Ember Pack · PSA 9", image: SLAB_POKEMON, ask: 720, amount: 600, counterparty: "@ripking", expiresAt: hoursFromNow(5), status: "pending" },
    { id: "o3", direction: "sent", card: "LeBron James #78", set: "2003 UD Exquisite · PSA 8.5", image: SLAB_LEBRON, ask: 25215, amount: 23500, counterparty: "@courtside", expiresAt: hoursFromNow(40), status: "pending" },
    { id: "o4", direction: "sent", card: "Gardevoir ex #233", set: "2024 Pokemon SV · PSA 10", image: SLAB_POKEMON, ask: 355, amount: 320, counterparty: "@pokevault", expiresAt: hoursFromNow(-30), status: "declined" },
  ],
  favorites: { packs: ["Pokémon Platinum Pack", "Basketball Gold Pack"], listings: ["gardevoir-0", "gardevoir-3"] },
  addresses: [{ id: "a1", label: "Home", name: "Steezy", line1: "123 Market St", city: "Austin", region: "TX", postal: "78701", country: "US", isDefault: true }],
  notifications: { drops: true, offers: true, shipping: true, newsletter: false },
  twoFactor: false,
});

export const orderSteps: { key: OrderStatus; label: string }[] = [
  { key: "processing", label: "Processing" },
  { key: "packed", label: "Packed" },
  { key: "shipped", label: "Shipped" },
  { key: "delivered", label: "Delivered" },
];

export const fmtDate = (iso: string) =>
  new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" }).format(new Date(iso));
