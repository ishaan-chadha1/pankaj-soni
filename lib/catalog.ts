/**
 * The PANKAJ SONI house — an invented luxury maison.
 *
 * Every product, note, price and line of copy here is original to this project.
 * `PANKAJ SONI` is used the way any couture label uses a founder's name: as a
 * wordmark for a fictional house, with no connection to, or information about,
 * any real person of that name.
 */

export type Category =
  | "fragrance"
  | "beauty"
  | "eyewear"
  | "women"
  | "men"
  | "gifts";

export type Variant = {
  id: string;
  label: string;
  sub?: string;
  price: number;
  /** Hex swatch, for shade- and finish-based lines. */
  swatch?: string;
};

export type Product = {
  slug: string;
  name: string;
  line: string;
  category: Category;
  /** Short descriptor under the name in grids. */
  kicker: string;
  price: number;
  image: string;
  /** Secondary plate revealed on hover in the grid. */
  hover: string;
  story: string;
  variants: Variant[];
  notes?: { head: string[]; heart: string[]; base: string[] };
  details: string[];
  composition?: string;
  badge?: "New" | "Exclusive" | "Limited" | "Icon";
  featured?: boolean;
};

export const CATEGORIES: {
  slug: Category;
  label: string;
  tagline: string;
  image: string;
}[] = [
  {
    slug: "fragrance",
    label: "Fragrance",
    tagline: "Private compositions, bottled without compromise.",
    image: "/img/p-cat-fragrance.svg",
  },
  {
    slug: "beauty",
    label: "Beauty",
    tagline: "Pigment with the weight of couture.",
    image: "/img/p-cat-beauty.svg",
  },
  {
    slug: "eyewear",
    label: "Eyewear",
    tagline: "Architecture for the face.",
    image: "/img/p-cat-eyewear.svg",
  },
  {
    slug: "women",
    label: "Women",
    tagline: "Tailoring with an unbroken line.",
    image: "/img/p-cat-women.svg",
  },
  {
    slug: "men",
    label: "Men",
    tagline: "Evening dress, rebuilt from the shoulder.",
    image: "/img/p-cat-men.svg",
  },
  {
    slug: "gifts",
    label: "Gifts",
    tagline: "Presented in lacquer and grosgrain.",
    image: "/img/p-cat-gifts.svg",
  },
];

const ml = (price50: number): Variant[] => [
  { id: "30", label: "30 ml", sub: "Eau de Parfum", price: Math.round(price50 * 0.62) },
  { id: "50", label: "50 ml", sub: "Eau de Parfum", price: price50 },
  { id: "100", label: "100 ml", sub: "Eau de Parfum", price: Math.round(price50 * 1.62) },
  { id: "250", label: "250 ml", sub: "Décanteur", price: Math.round(price50 * 4.4) },
];

export const PRODUCTS: Product[] = [
  /* ─────────────  FRAGRANCE — PRIVATE ATELIER  ───────────── */
  {
    slug: "noir-imperial",
    name: "Noir Impérial",
    line: "Private Atelier",
    category: "fragrance",
    kicker: "Leather · Black Plum · Incense",
    price: 340,
    image: "/img/f-noir-imperial.svg",
    hover: "/img/p-ed-01.svg",
    badge: "Icon",
    featured: true,
    story:
      "The house signature. Black plum is pressed against tanned leather until the fruit gives way, then held there by incense that refuses to lift. Built to be worn after dark, at close range, by someone who does not explain themselves.",
    variants: ml(340),
    notes: {
      head: ["Black Plum", "Pink Pepper", "Bergamot Zest"],
      heart: ["Bulgarian Rose", "Orris Butter", "Saffron Thread"],
      base: ["Tanned Leather", "Olibanum", "Vetiver Root", "Tonka"],
    },
    details: [
      "Eau de Parfum, 22% concentration",
      "Composed in Grasse, matured eleven weeks before filling",
      "Hand-polished glass flacon with weighted gold collar",
      "Refillable — the décanteur returns to any boutique",
    ],
    composition: "Alcohol Denat., Parfum (Fragrance), Aqua, Limonene, Linalool, Coumarin.",
  },
  {
    slug: "oud-silence",
    name: "Oud Silence",
    line: "Private Atelier",
    category: "fragrance",
    kicker: "Oud · Smoked Cedar · Ambergris",
    price: 480,
    image: "/img/f-oud-silence.svg",
    hover: "/img/p-ed-02.svg",
    badge: "Exclusive",
    featured: true,
    story:
      "Laotian oud, aged six years, given nothing to compete with. Smoked cedar widens the room and ambergris keeps it warm. The quietest thing the house makes, and the one people notice first.",
    variants: ml(480),
    notes: {
      head: ["Cardamom", "Bitter Orange"],
      heart: ["Laotian Oud", "Smoked Cedar", "Papyrus"],
      base: ["Ambergris", "Sandalwood", "Benzoin"],
    },
    details: [
      "Extrait de Parfum, 28% concentration",
      "Limited to 900 flacons each year",
      "Onyx-lacquered cap, numbered underside",
      "Presented in a grosgrain-lined lacquer case",
    ],
    composition: "Alcohol Denat., Parfum (Fragrance), Aqua, Linalool, Eugenol.",
  },
  {
    slug: "velvet-saffron",
    name: "Velvet Saffron",
    line: "Private Atelier",
    category: "fragrance",
    kicker: "Saffron · Suede · Honeyed Amber",
    price: 365,
    image: "/img/f-velvet-saffron.svg",
    hover: "/img/p-ed-03.svg",
    badge: "New",
    featured: true,
    story:
      "Saffron threads bloomed in warm honey, then dropped onto suede. It reads gold in the first hour and skin-close for the next eight.",
    variants: ml(365),
    notes: {
      head: ["Saffron", "Candied Ginger", "Mandarin"],
      heart: ["Suede Accord", "Jasmine Sambac", "Immortelle"],
      base: ["Honeyed Amber", "Labdanum", "Cashmeran"],
    },
    details: [
      "Eau de Parfum, 24% concentration",
      "Saffron sourced from a single Kashmiri harvest",
      "Hand-polished glass, brushed gold cap",
    ],
    composition: "Alcohol Denat., Parfum (Fragrance), Aqua, Limonene, Coumarin, Linalool.",
  },
  {
    slug: "amber-meridian",
    name: "Amber Meridian",
    line: "Private Atelier",
    category: "fragrance",
    kicker: "Amber · Fig Leaf · Salt",
    price: 310,
    image: "/img/f-amber-meridian.svg",
    hover: "/img/p-ed-01.svg",
    story:
      "Amber opened up with fig leaf and a line of salt, so the warmth reads like late light on stone rather than resin in a jar.",
    variants: ml(310),
    notes: {
      head: ["Fig Leaf", "Sea Salt", "Neroli"],
      heart: ["Amber Accord", "Fig Milk", "Iris"],
      base: ["Sandalwood", "White Musk", "Driftwood"],
    },
    details: ["Eau de Parfum, 20% concentration", "Hand-polished orb flacon", "Refillable"],
    composition: "Alcohol Denat., Parfum (Fragrance), Aqua, Limonene, Linalool.",
  },
  {
    slug: "tobacco-vesper",
    name: "Tobacco Vesper",
    line: "Private Atelier",
    category: "fragrance",
    kicker: "Tobacco Leaf · Cocoa · Rum",
    price: 355,
    image: "/img/f-tobacco-vesper.svg",
    hover: "/img/p-ed-02.svg",
    story:
      "Cured tobacco leaf over bitter cocoa, loosened with dark rum. A winter fragrance for rooms with low ceilings and good chairs.",
    variants: ml(355),
    notes: {
      head: ["Dark Rum", "Clove", "Bergamot"],
      heart: ["Cured Tobacco Leaf", "Bitter Cocoa", "Hay"],
      base: ["Tonka Bean", "Patchouli", "Vanilla Absolute"],
    },
    details: ["Eau de Parfum, 24% concentration", "Faceted flacon", "Refillable"],
    composition: "Alcohol Denat., Parfum (Fragrance), Aqua, Coumarin, Eugenol.",
  },
  {
    slug: "white-oud",
    name: "White Oud",
    line: "Private Atelier",
    category: "fragrance",
    kicker: "Bleached Oud · Orris · Cold Musk",
    price: 420,
    image: "/img/f-white-oud.svg",
    hover: "/img/p-ed-02.svg",
    story:
      "Oud stripped of its smoke and rebuilt in white — orris, cold musk, a trace of almond skin. Nearly transparent, and completely unmistakable.",
    variants: ml(420),
    notes: {
      head: ["Almond Skin", "Aldehydes"],
      heart: ["Bleached Oud", "Orris Butter", "White Iris"],
      base: ["Cold Musk", "Blonde Woods", "Ambrette"],
    },
    details: ["Extrait de Parfum, 26% concentration", "Silver collar and cap", "Refillable"],
    composition: "Alcohol Denat., Parfum (Fragrance), Aqua, Linalool, Benzyl Salicylate.",
  },
  {
    slug: "rose-prive",
    name: "Rose Privé",
    line: "Private Atelier",
    category: "fragrance",
    kicker: "Turkish Rose · Raspberry · Oud",
    price: 395,
    image: "/img/f-rose-prive.svg",
    hover: "/img/p-ed-03.svg",
    badge: "Limited",
    story:
      "Turkish rose taken somewhere darker — crushed raspberry at the top, a thread of oud underneath. Romantic in the way a closed door is romantic.",
    variants: ml(395),
    notes: {
      head: ["Crushed Raspberry", "Pink Pepper", "Litchi"],
      heart: ["Turkish Rose Absolute", "Peony", "Violet Leaf"],
      base: ["Oud", "Patchouli", "Musk"],
    },
    details: ["Eau de Parfum, 24% concentration", "Limited to 1,200 flacons", "Orb flacon in gold"],
    composition: "Alcohol Denat., Parfum (Fragrance), Aqua, Citronellol, Geraniol, Linalool.",
  },
  {
    slug: "cedar-absolute",
    name: "Cedar Absolute",
    line: "Private Atelier",
    category: "fragrance",
    kicker: "Cedar · Green Fig · Moss",
    price: 295,
    image: "/img/f-cedar-absolute.svg",
    hover: "/img/p-ed-01.svg",
    story:
      "Virginian cedar cut with green fig and damp moss. The house's daylight fragrance — clean, dry, and faintly cold.",
    variants: ml(295),
    notes: {
      head: ["Green Fig", "Grapefruit Peel", "Juniper"],
      heart: ["Virginian Cedar", "Cypress", "Geranium"],
      base: ["Oakmoss", "Grey Amber", "Musk"],
    },
    details: ["Eau de Parfum, 20% concentration", "Faceted flacon, silver cap", "Refillable"],
    composition: "Alcohol Denat., Parfum (Fragrance), Aqua, Limonene, Linalool.",
  },

  /* ─────────────  BEAUTY  ───────────── */
  {
    slug: "rouge-couture-noir",
    name: "Rouge Couture",
    line: "Lip",
    category: "beauty",
    kicker: "Satin lipstick · Refillable case",
    price: 78,
    image: "/img/b-noir-rouge.svg",
    hover: "/img/p-cat-beauty.svg",
    badge: "Icon",
    featured: true,
    story:
      "A satin bullet with the opacity of a matte and none of the drag. Six hours of wear, one pass. The case is solid brass and meant to be refilled, not replaced.",
    variants: [
      { id: "noir-rouge", label: "01 Noir Rouge", sub: "True blue-red", price: 78, swatch: "#8e1f2f" },
      { id: "oxblood", label: "02 Oxblood", sub: "Deep wine", price: 78, swatch: "#5e1420" },
      { id: "bare-oud", label: "03 Bare Oud", sub: "Warm nude", price: 78, swatch: "#b4756a" },
      { id: "gilt-plum", label: "04 Gilt Plum", sub: "Smoked plum", price: 78, swatch: "#6d2848" },
    ],
    details: [
      "Satin finish, six-hour wear",
      "Brass case, refillable",
      "Formulated without parabens or mineral oil",
    ],
    composition: "Ricinus Communis Seed Oil, Cera Alba, Candelilla Wax, Tocopherol, [+/- CI 15850].",
  },
  {
    slug: "velours-cheek",
    name: "Velours Cheek",
    line: "Complexion",
    category: "beauty",
    kicker: "Cream blush · Buildable",
    price: 68,
    image: "/img/b-gilt-plum.svg",
    hover: "/img/p-cat-beauty.svg",
    story:
      "A cream-to-skin blush that sits in the skin rather than on it. Warmed between two fingers, it disappears at the edges.",
    variants: [
      { id: "flush", label: "01 Flush", sub: "Cool rose", price: 68, swatch: "#b8586a" },
      { id: "ember", label: "02 Ember", sub: "Burnt apricot", price: 68, swatch: "#c26a45" },
      { id: "plum", label: "03 Plum Smoke", sub: "Muted berry", price: 68, swatch: "#8a4257" },
    ],
    details: ["Cream finish, buildable", "Brass compact, refillable", "Dermatologist tested"],
    composition: "Caprylic/Capric Triglyceride, Cera Alba, Squalane, Tocopherol, [+/- CI 77491].",
  },
  {
    slug: "noir-kohl",
    name: "Noir Kohl",
    line: "Eye",
    category: "beauty",
    kicker: "Gel liner · Twelve-hour hold",
    price: 62,
    image: "/img/b-oxblood.svg",
    hover: "/img/p-cat-beauty.svg",
    badge: "New",
    story:
      "Pigment dense enough to draw a single clean line, soft enough to smudge for the first ninety seconds. After that it does not move.",
    variants: [
      { id: "true-noir", label: "01 True Noir", sub: "Dense black", price: 62, swatch: "#0c0c0c" },
      { id: "espresso", label: "02 Espresso", sub: "Warm brown", price: 62, swatch: "#3b2418" },
    ],
    details: ["Gel formula, twelve-hour hold", "Waterproof", "Retractable brass barrel"],
    composition: "Cyclopentasiloxane, Trimethylsiloxysilicate, Cera Microcristallina, [+/- CI 77499].",
  },
  {
    slug: "peau-serum",
    name: "Peau Serum",
    line: "Skin",
    category: "beauty",
    kicker: "Concentrate · 30 ml",
    price: 195,
    image: "/img/b-bare-oud.svg",
    hover: "/img/p-ed-03.svg",
    story:
      "A weightless concentrate of squalane and niacinamide. Worn under everything the house makes, and on its own when nothing else is wanted.",
    variants: [{ id: "30", label: "30 ml", sub: "Concentrate", price: 195 }],
    details: ["30 ml amber glass with brass dropper", "Fragrance-free", "Suitable for sensitive skin"],
    composition: "Aqua, Squalane, Niacinamide, Glycerin, Sodium Hyaluronate, Panthenol.",
  },

  /* ─────────────  EYEWEAR  ───────────── */
  {
    slug: "monolith",
    name: "Monolith",
    line: "Eyewear",
    category: "eyewear",
    kicker: "Squared acetate · Grey gradient",
    price: 490,
    image: "/img/e-monolith.svg",
    hover: "/img/p-cat-eyewear.svg",
    featured: true,
    story:
      "A squared frame cut from a single block of Italian acetate, then tumbled for nine days. Heavy in the hand, weightless on the face.",
    variants: [
      { id: "black-grey", label: "Black / Grey Gradient", price: 490, swatch: "#141414" },
      { id: "havana", label: "Havana / Bronze", price: 490, swatch: "#5b3a1e" },
    ],
    details: [
      "Hand-cut Italian acetate, nine-day tumble",
      "Category 3 lenses, 100% UVA/UVB",
      "Titanium core wire, adjustable temples",
      "Supplied with lacquered case and grosgrain cloth",
    ],
  },
  {
    slug: "meridian-aviator",
    name: "Meridian",
    line: "Eyewear",
    category: "eyewear",
    kicker: "Metal aviator · Gold bronze",
    price: 545,
    image: "/img/e-meridian.svg",
    hover: "/img/p-cat-eyewear.svg",
    badge: "New",
    story:
      "A double-bridge aviator in brushed gold with a bronze gradient. The classic silhouette, cut narrower through the temple.",
    variants: [
      { id: "gold-bronze", label: "Gold / Bronze", price: 545, swatch: "#8a6f3c" },
      { id: "gunmetal", label: "Gunmetal / Grey", price: 545, swatch: "#4a4d52" },
    ],
    details: ["Brushed metal frame", "Category 3 lenses, 100% UVA/UVB", "Adjustable nose pads"],
  },
  {
    slug: "oracle",
    name: "Oracle",
    line: "Eyewear",
    category: "eyewear",
    kicker: "Round acetate · Petrol lens",
    price: 465,
    image: "/img/e-oracle.svg",
    hover: "/img/p-cat-eyewear.svg",
    story: "A perfect circle in black acetate with a petrol-tinted lens. Unforgiving and worth it.",
    variants: [{ id: "black-petrol", label: "Black / Petrol", price: 465, swatch: "#1a1a1a" }],
    details: ["Hand-cut acetate", "Category 3 lenses, 100% UVA/UVB", "Lacquered case included"],
  },
  {
    slug: "vesper-cat",
    name: "Vesper",
    line: "Eyewear",
    category: "eyewear",
    kicker: "Cat-eye acetate · Rosewood",
    price: 510,
    image: "/img/e-vesper.svg",
    hover: "/img/p-cat-women.svg",
    badge: "Exclusive",
    story:
      "An exaggerated cat-eye, weighted at the outer corner so it lifts the whole face. Rosewood lens, black frame.",
    variants: [{ id: "black-rose", label: "Black / Rosewood", price: 510, swatch: "#101010" }],
    details: ["Hand-cut Italian acetate", "Category 3 lenses, 100% UVA/UVB", "Titanium core wire"],
  },

  /* ─────────────  WOMEN  ───────────── */
  {
    slug: "atelier-tuxedo-dress",
    name: "Atelier Tuxedo Dress",
    line: "Ready-to-Wear",
    category: "women",
    kicker: "Wool grain de poudre · Silk lapel",
    price: 3900,
    image: "/img/p-cat-women.svg",
    hover: "/img/p-ed-03.svg",
    featured: true,
    story:
      "A tuxedo taken apart and rebuilt as a dress. Grain de poudre wool, silk-faced lapel, and one unbroken seam from shoulder to hem.",
    variants: [
      { id: "36", label: "IT 36", price: 3900 },
      { id: "38", label: "IT 38", price: 3900 },
      { id: "40", label: "IT 40", price: 3900 },
      { id: "42", label: "IT 42", price: 3900 },
    ],
    details: [
      "100% wool grain de poudre, silk-faced peak lapel",
      "Fully lined in silk crêpe de chine",
      "Concealed back zip, hand-finished hem",
      "Made in Italy — specialist dry clean only",
    ],
  },
  {
    slug: "liquid-column-gown",
    name: "Liquid Column Gown",
    line: "Ready-to-Wear",
    category: "women",
    kicker: "Bias-cut silk satin",
    price: 4600,
    image: "/img/p-ed-03.svg",
    hover: "/img/p-cat-women.svg",
    badge: "Limited",
    story:
      "Cut on the bias from a single width of silk satin so it falls without a single horizontal break. It moves before you do.",
    variants: [
      { id: "36", label: "IT 36", price: 4600 },
      { id: "38", label: "IT 38", price: 4600 },
      { id: "40", label: "IT 40", price: 4600 },
    ],
    details: ["100% silk satin, bias cut", "Self-tie shoulder", "Made in Italy"],
  },
  {
    slug: "opera-clutch",
    name: "Opera Clutch",
    line: "Leather Goods",
    category: "women",
    kicker: "Box calf · Brass clasp",
    price: 1850,
    image: "/img/p-cat-gifts.svg",
    hover: "/img/p-ed-01.svg",
    story:
      "Box calf over a rigid frame, with a solid brass clasp that closes with an audible click. Holds exactly what an evening requires.",
    variants: [
      { id: "black", label: "Black", price: 1850, swatch: "#111111" },
      { id: "oxblood", label: "Oxblood", price: 1850, swatch: "#4d1220" },
    ],
    details: ["Box calf leather, rigid frame", "Solid brass clasp", "Suede-lined interior", "Made in Italy"],
  },

  /* ─────────────  MEN  ───────────── */
  {
    slug: "shawl-collar-dinner-jacket",
    name: "Shawl Collar Dinner Jacket",
    line: "Tailoring",
    category: "men",
    kicker: "Wool mohair · Silk shawl",
    price: 4200,
    image: "/img/p-cat-men.svg",
    hover: "/img/p-ed-02.svg",
    featured: true,
    story:
      "The house shoulder — extended, softly padded, and cut with a high armhole so the jacket stays put when the arm moves. Silk shawl collar, single button.",
    variants: [
      { id: "46", label: "IT 46", price: 4200 },
      { id: "48", label: "IT 48", price: 4200 },
      { id: "50", label: "IT 50", price: 4200 },
      { id: "52", label: "IT 52", price: 4200 },
    ],
    details: [
      "Wool-mohair blend with silk shawl collar",
      "Half-canvassed, high armhole, extended shoulder",
      "Single button, double vent",
      "Made in Italy",
    ],
  },
  {
    slug: "evening-shirt",
    name: "Pleated Evening Shirt",
    line: "Tailoring",
    category: "men",
    kicker: "Cotton poplin · Bib front",
    price: 690,
    image: "/img/p-ed-02.svg",
    hover: "/img/p-cat-men.svg",
    story:
      "Swiss cotton poplin with a narrow pleated bib and covered placket. Cut close through the body without pulling at the button.",
    variants: [
      { id: "39", label: "39", price: 690 },
      { id: "41", label: "41", price: 690 },
      { id: "43", label: "43", price: 690 },
    ],
    details: ["Swiss cotton poplin", "Pleated bib, covered placket", "Mother-of-pearl buttons", "Made in Italy"],
  },
  {
    slug: "noir-chelsea-boot",
    name: "Noir Chelsea Boot",
    line: "Footwear",
    category: "men",
    kicker: "Polished calf · Leather sole",
    price: 1490,
    image: "/img/p-cat-men.svg",
    hover: "/img/p-ed-01.svg",
    story:
      "A Chelsea boot on a narrow last with a Blake-stitched leather sole. Polished calf, elastic gusset, pull tab in matching leather.",
    variants: [
      { id: "41", label: "EU 41", price: 1490 },
      { id: "42", label: "EU 42", price: 1490 },
      { id: "43", label: "EU 43", price: 1490 },
      { id: "44", label: "EU 44", price: 1490 },
    ],
    details: ["Polished calf leather", "Blake-stitched leather sole", "Made in Italy"],
  },

  /* ─────────────  GIFTS  ───────────── */
  {
    slug: "private-atelier-coffret",
    name: "Private Atelier Coffret",
    line: "Gifting",
    category: "gifts",
    kicker: "Eight × 10 ml discovery set",
    price: 320,
    image: "/img/p-cat-gifts.svg",
    hover: "/img/p-ed-01.svg",
    badge: "Exclusive",
    featured: true,
    story:
      "The full Private Atelier in miniature — eight compositions at 10 ml, in a lacquered case lined with grosgrain. The considered way to choose a signature.",
    variants: [{ id: "set", label: "Coffret of Eight", sub: "8 × 10 ml", price: 320 }],
    details: [
      "Eight 10 ml flacons, one of each Private Atelier composition",
      "Lacquered case with grosgrain lining",
      "Redeemable against any 50 ml flacon",
    ],
  },
  {
    slug: "noir-candle",
    name: "Noir Impérial Candle",
    line: "Maison",
    category: "gifts",
    kicker: "Black wax · 60-hour burn",
    price: 145,
    image: "/img/f-noir-imperial.svg",
    hover: "/img/p-cat-gifts.svg",
    story:
      "The house signature rebuilt for a room rather than a wrist. Black wax in hand-blown smoked glass, sixty hours.",
    variants: [
      { id: "200", label: "200 g", price: 145 },
      { id: "600", label: "600 g", sub: "Three wicks", price: 320 },
    ],
    details: ["Hand-blown smoked glass", "Sixty-hour burn", "Cotton wick, vegetable wax blend"],
  },
];

/* ─────────────────────────  ACCESS HELPERS  ───────────────────────── */

export const bySlug = (slug: string) => PRODUCTS.find((p) => p.slug === slug);

export const byCategory = (c: Category) => PRODUCTS.filter((p) => p.category === c);

export const featured = () => PRODUCTS.filter((p) => p.featured);

export const category = (slug: string) => CATEGORIES.find((c) => c.slug === slug);

/** Deterministic "you may also like" — never returns the product itself. */
export const related = (p: Product, n = 4) =>
  [...PRODUCTS.filter((x) => x.category === p.category && x.slug !== p.slug), ...PRODUCTS.filter((x) => x.category !== p.category)]
    .slice(0, n);

export const money = (n: number) =>
  `$${n.toLocaleString("en-US", { minimumFractionDigits: 0 })}`;

export const EDITORIAL = [
  {
    slug: "the-shoulder",
    eyebrow: "Atelier",
    title: "The Shoulder",
    excerpt:
      "Every jacket the house makes is drafted from the same shoulder — extended, softly padded, high in the armhole. Everything else is negotiable.",
    image: "/img/p-ed-02.svg",
  },
  {
    slug: "six-years-of-oud",
    eyebrow: "Composition",
    title: "Six Years of Oud",
    excerpt:
      "Why the wood in Oud Silence is aged longer than most fragrances are in production, and what that patience actually buys.",
    image: "/img/p-ed-01.svg",
  },
  {
    slug: "against-the-neutral",
    eyebrow: "Colour",
    title: "Against the Neutral",
    excerpt:
      "A study in oxblood, plum smoke and true blue-red — and the case for a lip that is not trying to be flattering.",
    image: "/img/p-ed-03.svg",
  },
];
