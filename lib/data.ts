// Content model for the site. Copy and figures are carried over from the
// previous build; swap these for API calls when a backend is connected.

export type Category = "football" | "basketball" | "baseball" | "pokemon" | "multi-sport";
export type Tier = "Silver" | "Gold" | "Platinum";

export const categories: { slug: Category; label: string; blurb: string }[] = [
  { slug: "football", label: "Football", blurb: "Gridiron rookies, autos and slabbed Sunday legends." },
  { slug: "basketball", label: "Basketball", blurb: "Hardwood grails, patches and numbered parallels." },
  { slug: "baseball", label: "Baseball", blurb: "Diamond classics from vintage to modern chrome." },
  { slug: "pokemon", label: "Pokémon", blurb: "Graded holos, alt arts and first-edition chase." },
  { slug: "multi-sport", label: "Multi-Sport", blurb: "Every league in one rip. Maximum variance." },
];

export const tierPrice: Record<Tier, number> = { Silver: 25, Gold: 50, Platinum: 100 };

export type Pack = {
  name: string;
  slug: string;
  category: Category;
  categoryLabel: string;
  tier: Tier;
  price: number;
  image: string;
};

const imageKey: Record<Category, string> = {
  football: "Football",
  basketball: "Basketball",
  baseball: "Baseball",
  pokemon: "Pokemon",
  "multi-sport": "Multi-Sport",
};

export const packs: Pack[] = categories.flatMap(({ slug, label }) =>
  (["Silver", "Gold", "Platinum"] as Tier[]).map((tier) => {
    const name = `${label} ${tier} Pack`;
    return {
      name,
      slug: encodeURIComponent(name),
      category: slug,
      categoryLabel: label,
      tier,
      price: tierPrice[tier],
      image: `/assets/cards/${imageKey[slug]}-${tier}.webp`,
    };
  }),
);

// Home "Rip A Pack" order, as on the previous home page
export const featuredPackOrder = [
  "Basketball Silver Pack",
  "Baseball Platinum Pack",
  "Football Gold Pack",
  "Multi-Sport Gold Pack",
  "Football Platinum Pack",
  "Baseball Gold Pack",
  "Football Silver Pack",
  "Basketball Gold Pack",
  "Pokémon Platinum Pack",
  "Multi-Sport Silver Pack",
  "Baseball Silver Pack",
  "Pokémon Gold Pack",
  "Pokémon Silver Pack",
  "Multi-Sport Platinum Pack",
  "Basketball Platinum Pack",
];

export const trendingPacks = ["Basketball Silver Pack", "Football Silver Pack", "Baseball Silver Pack", "Pokémon Silver Pack"];

export const getPack = (name: string) => packs.find((p) => p.name === name);
export const packsIn = (c: Category) => packs.filter((p) => p.category === c);

export const packDescription = (p: Pack) =>
  `A limited-edition digital pack featuring exclusive ${p.categoryLabel.toLowerCase()}-themed collectibles. Each pack holds a chance to unlock rare cards, fiery designs, and coveted highlights that bring the energy of the ${
    p.category === "pokemon" ? "league" : p.category === "baseball" ? "diamond" : p.category === "football" ? "field" : "court"
  } to your collection.`;

export const pullTiers = [
  { name: "Grail", odds: "0.1%", cards: ["Pikachu"] },
  { name: "Chasers", odds: "0.5%", cards: ["Charizard", "Mewtwo", "Eevee", "Snorlax"] },
  {
    name: "Series",
    odds: "2%",
    cards: [
      "Bulbasaur", "Ivysaur", "Venusaur", "Charmander", "Squirtle", "Wartortle", "Blastoise",
      "Gengar", "Machamp", "Alakazam", "Lucario", "Garchomp", "Dragonite", "Jigglypuff",
      "Psyduck", "Gyarados", "Onix", "Lapras", "Ditto",
    ],
  },
];

/* ---------------------------------- Pulls & sales ---------------------------------- */

export type Pull = { id: number; pack: string; set: string; from: string; odds: string; ago: string; user: string; image: string };

export const recentPulls: Pull[] = Array.from({ length: 25 }, (_, i) => ({
  id: i,
  pack: "Baseball Ember Pack",
  set: "2016 Pokémon",
  from: "Pokémon Ember Pack",
  odds: "0.5% Hit Chance",
  ago: "3 minutes ago",
  user: "@Steezy",
  image: "/assets/cards/Pack-02.webp",
}));

export type Sale = { id: number; pack: string; set: string; detail: string; price: number; ago: string; buyer: string; image: string };

export const recentSales: Sale[] = Array.from({ length: 9 }, (_, i) => ({
  id: i,
  pack: "Baseball Ember Pack",
  set: "2000 Pokémon Gym Heroes",
  detail: "#59 · 1st Edition · PSA 10 GEM MINT",
  price: 120,
  ago: "3 minutes ago",
  buyer: "@Steezy",
  image: "/assets/cards/Pack-02.webp",
}));

export const stats = [
  { label: "Packs Pulled", value: 27102, icon: "package" },
  { label: "Cards Shipped", value: 27102, icon: "truck" },
  { label: "Users", value: 27102, icon: "users" },
] as const;

/* ---------------------------------- Marketplace ---------------------------------- */

export type Listing = {
  id: string;
  name: string;
  set: string;
  number: string;
  price: number;
  bids: number;
  endsIn: string;
  type: "auction" | "fixed";
  image: string;
  category: Category;
};

const gardevoir = (i: number, type: Listing["type"]): Listing => ({
  id: `gardevoir-${i}`,
  name: "Gardevoir ex",
  set: "2024 Pokemon SV",
  number: "#233",
  price: 355,
  bids: 13,
  endsIn: "2d 12h",
  type,
  image: "/assets/cards/Pack-02.webp",
  category: "pokemon",
});

export const listings: Listing[] = Array.from({ length: 16 }, (_, i) => gardevoir(i, i % 3 === 2 ? "fixed" : "auction"));

export const featuredListing = {
  href: "/marketplace/Gardevoir ex",
  player: "LeBron James",
  number: "#78",
  title: "2003 UD Exquisite Collection Rookie Patch Auto /23",
  grade: "PSA 8.5 Auto 10",
  price: 25215,
  bids: 15,
  ends: "Ends Oct. 6",
  image: "/assets/cards/Pack-03.webp",
};

export const cardDetail = {
  player: "LeBron James",
  number: "#78",
  title: "2003 UD Exquisite Collection",
  subtitle: "Rookie Patch Auto /23",
  grade: "PSA 8.5 Auto 10",
  owner: "Steezy",
  watchers: 12,
  image: "/assets/cards/Pack-03.webp",
  info: [
    ["Grader", "PSA"],
    ["Grade", "8.5"],
    ["Cert", "63140708"],
    ["Type", "Basketball"],
    ["Year", "2003"],
    ["Card #", "#78"],
    ["Player", "LeBron James"],
    ["Card Set", "UD Exquisite"],
    ["Language", "English"],
    ["Auto", "Yes"],
    ["#'D", "Yes"],
    ["Out of", "/23"],
    ["Parallel", "Exquisite Rookie Patch"],
  ] as [string, string][],
  auction: { price: 25215, bids: 15, ends: "Ends Oct. 6" },
  comps: [
    { d: "09/01", v: 138 },
    { d: "09/02", v: 142 },
    { d: "09/03", v: 147 },
    { d: "09/04", v: 139 },
    { d: "09/05", v: 152 },
    { d: "09/06", v: 158 },
  ],
};

/* ---------------------------------- Leaderboard ---------------------------------- */

export const podium = [
  { rank: 2, name: "Steezy", points: 23125, medal: "/assets/leaderboard/silver.png" },
  { rank: 1, name: "Steezy", points: 25125, medal: "/assets/leaderboard/gold.png" },
  { rank: 3, name: "Steezy", points: 21125, medal: "/assets/leaderboard/bronze.png" },
];
export const podiumPrize = "2017-18 Panini Prizm Patrick Mahomes Blue /49 PSA 10";

export const ranking = [
  10204, 10672, 3079, 11212, 7566, 19079, 13936, 3626, 2247, 16050, 14500, 14165, 10978, 16173, 10773, 1287, 11152,
].map((points, i) => ({
  rank: i + 4,
  name: "Username Here",
  points,
  prize: i + 4 <= 10 ? "Premium Pack" : "Bonus Tokens",
}));

export const me = { points: 12425, rank: 1401, today: 2510 };

/* ---------------------------------- News ---------------------------------- */

export type Article = { title: string; category: string; date: string; read: string; image: string };

export const featuredArticle: Article = {
  title: "10 Best Pikachu Pokémon Cards You Need to Collect",
  category: "Pokémon",
  date: "October 10, 2025",
  read: "10 min Read",
  image: "/assets/news/news-01.webp",
};

const rows: [string, string, string][] = [
  ["11 Best Pikachu Pokémon Cards You Need to Collect", "Pokémon", "/assets/news/news-02.webp"],
  ["The King of Collectibles Shares the Secrets to Building the Ultimate Collection", "Sports", "/assets/news/news-03.webp"],
  ["Best Star Wars Trading Card Sets to Celebrate Lucasfilm's 50th Anniversary", "Trading Cards", "/assets/news/news-04.webp"],
  ["12 Best Pikachu Pokémon Cards You Need to Collect", "Pokémon", "/assets/news/news-02.webp"],
  ["The Queen of Collectibles Shares the Secrets to Building the Ultimate Collection", "Sports", "/assets/news/news-03.webp"],
  ["Best of Star Wars Trading Card Sets to Celebrate Lucasfilm's 50th Anniversary", "Trading Cards", "/assets/news/news-04.webp"],
  ["16 Best Pikachu Pokémon Cards You Need to Collect", "Pokémon", "/assets/news/news-02.webp"],
  ["The Kings of Collectibles Shares the Secrets to Building the Ultimate Collection", "Sports", "/assets/news/news-03.webp"],
  ["Best Star Wars Trading Cards Sets to Celebrate Lucasfilm's 50th Anniversary", "Trading Cards", "/assets/news/news-04.webp"],
];
export const articles: Article[] = rows.map(([title, category, image]) => ({
  title,
  category,
  image,
  date: "October 10, 2025",
  read: "10 min Read",
}));

/* ---------------------------------- How it works ---------------------------------- */

export const steps = [
  { title: "Pick a Pack", body: "Pick a curated pack from our different tiers and different categories!", icon: "package" },
  { title: "Open Pack", body: "Open your pack to see what card you have received!", icon: "sparkles" },
  { title: "Sell or Ship", body: "Choose to instantly sell your card back to HYP3, sell on our market or get your cards shipped to you!", icon: "truck" },
  { title: "Get HYP3", body: "Every card ships safely in a tracked, protective bubble mailer — handled with care from our vault to your door!", icon: "gift" },
] as const;

export const faqs = [
  {
    group: "General Questions",
    items: [
      {
        q: "How does the Marketplace work?",
        a: "You can trade existing cards in your inventory for anything listed in the marketplace! Typical processing times for marketplace transactions is between 3-10 business days!",
      },
    ],
  },
  {
    group: "Shipping Questions",
    items: [
      {
        q: "How long does shipping take?",
        a: "Shipping and delivery of cards takes about 2-4 weeks from withdrawal, and we’re constantly working to improve ship times and processes. Orders with high demand items can take up to 5 weeks to ship. All cards come double sleeved, in a top loader, inside a bubble mailer. Marketplace orders are processed differently and ship within 3-10 business days. Check out our shipping page for full information on our shipping & refund policies and current shipping times.",
      },
    ],
  },
];

export const announcements = [
  "Free shipping on orders above $100",
  "Flash Sale: Up to 50% off today only",
  "Secure payments with Stripe — shop confidently",
  "New arrivals drop every Friday — stay tuned",
];

export const usd = (n: number, cents = false) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: cents ? 2 : 0,
    maximumFractionDigits: cents ? 2 : 0,
  }).format(n);

export const num = (n: number) => new Intl.NumberFormat("en-US").format(n);
