// Blog posts. Body blocks stay plain data so posts can later come from a CMS
// without touching the page components.

export type Block = { h: string } | { p: string } | { list: string[] } | { quote: string };

export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  category: "Pokémon" | "Sports" | "Guides" | "Trading Cards" | "HYP3";
  date: string;
  read: string;
  image: string;
  body: Block[];
};

export const posts: Post[] = [
  {
    slug: "pikachu-cards-every-collector-should-know",
    title: "The Pikachu Cards Every Collector Should Know",
    excerpt: "From a contest promo that became the hobby's holy grail to modern chase cards, here's what makes the most wanted Pikachu cards special.",
    category: "Pokémon",
    date: "September 29, 2026",
    read: "7 min read",
    image: "/assets/news/news-01.webp",
    body: [
      { p: "Pikachu has been on more cards than almost any other Pokémon, which makes it one of the most fun characters to collect and one of the hardest to collect well. A handful of cards stand above the rest, and they're worth knowing even if you never plan to own one." },
      { h: "Pikachu Illustrator" },
      { p: "Awarded to winners of an illustration contest run through CoroCoro Comic in the late 1990s, Illustrator is the rarest Pikachu card and is widely treated as the most valuable Pokémon card ever made. Very few copies exist, and the high-grade ones rarely change hands." },
      { h: "Base Set Pikachu" },
      { p: "The original 1999 Base Set Pikachu is where most collectors' stories start. First Edition copies, especially the early red-cheeks variant, carry a premium, and centering and edge wear make a huge difference to the grade." },
      { h: "Modern chase cards" },
      { p: "Modern sets bring full-art and alternate-art Pikachu cards that are printed in tiny numbers relative to the rest of the set. Rainbow, gold and special illustration rares tend to hold the most attention, along with special promos like the Pikachu with Grey Felt Hat card from the Van Gogh Museum collaboration." },
      { h: "What to check before you buy" },
      { list: ["Centering: hold the card up and compare the borders left-to-right and top-to-bottom.", "Surface: tilt it under a light to catch scratches, print lines and whitening.", "The slab: confirm the certification number on the grader's website before paying for a graded copy."] },
      { quote: "Buy the card you'd be happy to keep even if prices never moved." },
      { p: "Whether you chase the grails or just love the yellow mouse, Pikachu is one of the few characters where every era of the game has something worth hunting." },
    ],
  },
  {
    slug: "building-the-ultimate-collection",
    title: "Secrets to Building the Ultimate Collection",
    excerpt: "Big collections aren't built by accident. A focus, a budget and a few habits matter more than any single pull.",
    category: "Sports",
    date: "September 22, 2026",
    read: "6 min read",
    image: "/assets/news/news-03.webp",
    body: [
      { p: "Every great collection has a point of view. Some follow one player across their whole career, others chase every rookie from a single draft class, and some only collect one set. Picking a lane is the single best thing you can do for your collection and your wallet." },
      { h: "Pick a focus" },
      { p: "A focus turns random buying into a mission. It also makes you an expert faster: once you know a player's or set's cards inside out, you'll spot good deals and fakes that other collectors miss." },
      { h: "Set a budget, then protect it" },
      { list: ["Decide on a monthly number before you open the app.", "Separate money for packs (the thrill) from money for singles (the plan).", "Sell back or trade duplicates to fund the cards you actually want."] },
      { h: "Grade what matters" },
      { p: "Not every card needs a slab. Grade the cards where condition really changes the value, like rookies, low-numbered parallels and autographs, and keep the rest in sleeves and top-loaders." },
      { quote: "The best collections tell a story. Each card should earn its place in it." },
      { h: "Keep records" },
      { p: "Track what you paid, when, and the certification number of every graded card. It makes insurance, selling and simply enjoying your collection much easier." },
    ],
  },
  {
    slug: "star-wars-trading-card-sets",
    title: "Star Wars Trading Card Sets Worth Knowing",
    excerpt: "Star Wars cards have been around since the first film. These are the sets that shaped the hobby and the ones collectors keep coming back to.",
    category: "Trading Cards",
    date: "September 15, 2026",
    read: "5 min read",
    image: "/assets/news/news-04.webp",
    body: [
      { p: "Star Wars cards arrived alongside the original 1977 film, and they've never really gone away. For collectors, the appeal is a mix of nostalgia, iconic artwork and modern parallels that feel right at home next to sports cards." },
      { h: "The 1977 originals" },
      { p: "Topps released the first Star Wars series in 1977, followed by several more color-coded series. Well-centered, sharp copies are hard to find because these cards were opened and handled by kids, not stored in sleeves." },
      { h: "Chrome and modern parallels" },
      { p: "Modern chrome sets bring refractors, numbered parallels and autographs from the cast. Low-numbered parallels of main characters are the cards most collectors chase." },
      { h: "Collecting tips" },
      { list: ["Pick a trilogy or a character to keep your collection focused.", "Check autograph authentication on the slab or certificate.", "For vintage, prioritize centering. It's the hardest thing to find."] },
    ],
  },
  {
    slug: "grading-companies-explained",
    title: "PSA, BGS, CGC and SGC: Grading Explained",
    excerpt: "What each grading company is known for, how their scales differ, and how to choose one for your next submission.",
    category: "Guides",
    date: "September 8, 2026",
    read: "8 min read",
    image: "/assets/news/news-02.webp",
    body: [
      { p: "Grading puts a card in a tamper-evident slab with a condition score and a certification number. That number lets anyone verify the card on the grader's website, which is why graded cards are easier to buy, sell and trust." },
      { h: "PSA" },
      { p: "PSA is the most widely recognized grader, especially for sports cards and vintage. It uses a 1–10 scale, and a PSA 10 Gem Mint is the grade most collectors chase." },
      { h: "BGS (Beckett)" },
      { p: "Beckett gives subgrades for centering, corners, edges and surface alongside the overall grade. Its top labels, Pristine 10 and the rare Black Label, are highly valued on modern cards." },
      { h: "CGC" },
      { p: "CGC built its reputation in comics and has become a major name for Pokémon and other trading card games, with a clear slab and a Pristine 10 above Gem Mint 10." },
      { h: "SGC" },
      { p: "SGC is known for its black tuxedo-style label, which many collectors love for vintage cards, and for quick turnaround times." },
      { h: "How to choose" },
      { list: ["Check which grader the market prefers for that card. It can change resale value.", "Compare turnaround times and fees for your declared value.", "Stay consistent within a set or player collection if you can."] },
    ],
  },
  {
    slug: "raw-vs-graded",
    title: "Raw vs Graded: When Is Grading Worth It?",
    excerpt: "Grading costs money and takes time. A quick way to decide which cards deserve a slab and which belong in a binder.",
    category: "Guides",
    date: "August 31, 2026",
    read: "4 min read",
    image: "/assets/news/news-03.webp",
    body: [
      { p: "Grading can multiply a card's value, but it can also cost more than the card is worth. The math is simple once you know what to look for." },
      { h: "Grade it if…" },
      { list: ["The card is a key rookie, a low-numbered parallel or an autograph.", "It looks clean under a light: sharp corners, even borders, no surface marks.", "The value gap between raw and a high grade is bigger than the grading fee plus shipping."] },
      { h: "Keep it raw if…" },
      { list: ["It's a base card from a modern set with huge print runs.", "There's visible wear that will cap the grade.", "You're keeping it for the binder, not for resale."] },
      { p: "When you're ready, HYP3's Submit Cards flow walks you through the details graders need, including photos, cert numbers and declared value." },
    ],
  },
  {
    slug: "how-hyp3-packs-work",
    title: "How HYP3 Packs Work",
    excerpt: "Tiers, odds, instant buyback and shipping: everything that happens between tapping Rip and holding your card.",
    category: "HYP3",
    date: "August 24, 2026",
    read: "3 min read",
    image: "/assets/news/news-01.webp",
    body: [
      { p: "Every HYP3 pack is built from real, graded cards. When you rip, you pull one of them, and it's yours to keep, sell back or ship." },
      { h: "Tiers and odds" },
      { p: "Packs come in Silver, Gold and Platinum tiers, and every pack page lists its pull odds across Grail, Chaser and Series hits. Check the Hit List on any pack to see the cards inside." },
      { h: "After the rip" },
      { list: ["Keep it: the card lands in your vault.", "Sell it back: get an instant buyback offer.", "Ship it: we send the slab to your door."] },
      { p: "New to packs? The How It Works page has the full walkthrough." },
    ],
  },
  {
    slug: "storing-and-shipping-slabs",
    title: "How to Store and Ship Graded Slabs Safely",
    excerpt: "Slabs are tough, but not indestructible. Simple habits that keep your cards and their labels in grail condition.",
    category: "Guides",
    date: "August 17, 2026",
    read: "4 min read",
    image: "/assets/news/news-04.webp",
    body: [
      { p: "A slab protects the card, but scratches, cracked cases and sun-faded labels still hurt value. A little care goes a long way." },
      { h: "Storage" },
      { list: ["Keep slabs upright in a storage box or graded-card case.", "Avoid direct sunlight, since it fades labels and card colors.", "Use slab sleeves to stop scratches from stacking."] },
      { h: "Shipping" },
      { list: ["Wrap each slab in bubble wrap and pack it snugly in a box. No rattling.", "Add tracking and insure the declared value.", "Photograph the slab, front and back, before it leaves your hands."] },
    ],
  },
];

export const getPost = (slug: string) => posts.find((p) => p.slug === slug);
export const blogCategories = ["All", ...Array.from(new Set(posts.map((p) => p.category)))] as const;
