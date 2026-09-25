/**
 * The PANKAJ SONI house — an invented luxury maison.
 *
 * An apparel house: tailoring, occasionwear, knitwear and eveningwear. Every
 * product, price and line of copy here is original to this project. `PANKAJ
 * SONI` is used the way any couture label uses a founder's name: as a wordmark
 * for a fictional house, with no connection to, or information about, any real
 * person of that name.
 */

export type Category = "women" | "men" | "occasion";

export type Variant = {
  id: string;
  label: string;
  sub?: string;
  price: number;
  /** Hex swatch, for colour-led lines. */
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
  /** The three-column panel on a product page: what it is made of, how it is
   *  cut, how it is finished. */
  spec?: { cloth: string[]; cut: string[]; finish: string[] };
  details: string[];
  composition?: string;
  badge?: "New" | "Exclusive" | "Limited" | "Icon";
  /** Dims the plate and shows a badge. The house cuts in small numbers, and a
   *  run that has gone stays on the site rather than quietly disappearing. */
  soldOut?: boolean;
  featured?: boolean;
};

export const CATEGORIES: {
  slug: Category;
  label: string;
  tagline: string;
  image: string;
}[] = [
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
    slug: "occasion",
    label: "Occasion",
    tagline: "Everything that is worked by hand.",
    image: "/img/campaign/orbit-02-810.webp",
  },
];

const ITALIAN = (price: number): Variant[] => [
  { id: "44", label: "IT 44", price },
  { id: "46", label: "IT 46", price },
  { id: "48", label: "IT 48", price },
  { id: "50", label: "IT 50", price },
  { id: "52", label: "IT 52", price },
];

const WOMENS = (price: number): Variant[] => [
  { id: "36", label: "IT 36", price },
  { id: "38", label: "IT 38", price },
  { id: "40", label: "IT 40", price },
  { id: "42", label: "IT 42", price },
];

export const PRODUCTS: Product[] = [
  /* ─────────────  WOMEN  ───────────── */
  {
    slug: "atelier-tuxedo-dress",
    name: "Atelier Tuxedo Dress",
    line: "Ready-to-Wear",
    category: "women",
    kicker: "Wool grain de poudre · Silk lapel",
    price: 3900,
    image: "/img/campaign/vapour-gown-01-810.webp",
    hover: "/img/campaign/vapour-gown-detail-810.webp",
    badge: "Icon",
    featured: true,
    story:
      "A tuxedo taken apart and rebuilt as a dress. Grain de poudre wool, a silk-faced lapel, and one unbroken seam from shoulder to hem. It is the piece the house is asked to repeat every season and never has.",
    variants: WOMENS(3900),
    spec: {
      cloth: ["Wool grain de poudre", "Silk crêpe de chine lining", "Silk-faced lapel"],
      cut: ["Peak lapel", "Single unbroken side seam", "Concealed back zip"],
      finish: ["Hand-rolled lapel edge", "Hand-finished hem", "Made in Italy"],
    },
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
    image: "/img/campaign/nocturne-gown-01-810.webp",
    hover: "/img/campaign/nocturne-gown-02-810.webp",
    badge: "Limited",
    featured: true,
    story:
      "Cut on the bias from a single width of silk satin, so it falls without one horizontal break anywhere in its length. It moves before you do.",
    variants: WOMENS(4600).slice(0, 3),
    spec: {
      cloth: ["Silk satin, 22 momme", "Cut from a single width"],
      cut: ["True bias", "Self-tie shoulder", "Floor-sweeping"],
      finish: ["French seams throughout", "Hand-rolled hem", "Made in Italy"],
    },
    details: ["100% silk satin, bias cut", "Self-tie shoulder", "Made in Italy"],
  },
  {
    slug: "cashmere-wrap-cardigan",
    name: "Wrap Cardigan",
    line: "Knitwear",
    category: "women",
    kicker: "Mongolian cashmere · Belted",
    price: 1290,
    image: "/img/p-ed-01.svg",
    hover: "/img/p-cat-women.svg",
    story:
      "Six-ply cashmere with no buttons and no fastening but its own belt, so it holds whatever shape you put it in. Heavy enough to wear as a jacket in a warm month.",
    variants: [
      { id: "xs", label: "XS", price: 1290 },
      { id: "s", label: "S", price: 1290 },
      { id: "m", label: "M", price: 1290 },
      { id: "l", label: "L", price: 1290 },
    ],
    spec: {
      cloth: ["Six-ply Mongolian cashmere", "Self belt"],
      cut: ["Shawl collar", "Dropped shoulder", "Mid-thigh"],
      finish: ["Fully fashioned", "Hand-linked seams", "Made in Scotland"],
    },
    details: ["Six-ply Mongolian cashmere", "Self belt, no closure", "Made in Scotland"],
  },
  {
    slug: "poplin-shirt",
    name: "The Poplin Shirt",
    line: "Shirting",
    category: "women",
    kicker: "Swiss cotton · Cut long",
    price: 620,
    image: "/img/p-cat-women.svg",
    hover: "/img/p-ed-02.svg",
    story:
      "Cut long enough to wear with nothing under it and clean enough to wear under a jacket. Swiss poplin with a collar that stands without help.",
    variants: [
      { id: "36", label: "IT 36", price: 620 },
      { id: "38", label: "IT 38", price: 620 },
      { id: "40", label: "IT 40", price: 620 },
      { id: "42", label: "IT 42", price: 620 },
    ],
    spec: {
      cloth: ["Swiss cotton poplin, 120s", "Mother-of-pearl buttons"],
      cut: ["Standing collar", "Dropped shoulder", "Long body"],
      finish: ["Split yoke", "Single-needle side seams", "Made in Italy"],
    },
    details: ["Swiss cotton poplin", "Mother-of-pearl buttons", "Made in Italy"],
  },
  {
    slug: "wide-leg-trouser",
    name: "Wide-Leg Trouser",
    line: "Tailoring",
    category: "women",
    kicker: "Wool crêpe · High rise",
    price: 980,
    image: "/img/p-ed-02.svg",
    hover: "/img/p-cat-women.svg",
    story:
      "A high waist and a leg that falls straight from the hip without touching anything on the way down. Wool crêpe, because it holds the line and forgives the day.",
    variants: WOMENS(980),
    spec: {
      cloth: ["Wool crêpe", "Bemberg pocketing"],
      cut: ["High rise", "Flat front", "Full straight leg"],
      finish: ["Side adjusters", "Unfinished hem, tailored in boutique", "Made in Italy"],
    },
    details: ["Wool crêpe, high rise", "Side adjusters", "Unfinished hem", "Made in Italy"],
  },
  {
    slug: "silk-slip-skirt",
    name: "Bias Slip Skirt",
    line: "Ready-to-Wear",
    category: "women",
    kicker: "Silk satin · Bias cut",
    price: 1150,
    image: "/img/p-ed-03.svg",
    hover: "/img/p-cat-women.svg",
    story:
      "The gown's cut, at half its length. Bias silk that swings a beat behind the step and settles instantly.",
    variants: WOMENS(1150),
    spec: {
      cloth: ["Silk satin, 19 momme"],
      cut: ["True bias", "Concealed side zip", "Below the knee"],
      finish: ["French seams", "Hand-rolled hem", "Made in Italy"],
    },
    details: ["100% silk satin, bias cut", "Concealed side zip", "Made in Italy"],
  },
  {
    slug: "merino-roll-neck",
    name: "Fine Roll Neck",
    line: "Knitwear",
    category: "women",
    kicker: "Extra-fine merino",
    price: 740,
    image: "/img/p-cat-women.svg",
    hover: "/img/p-ed-01.svg",
    story:
      "Knitted fine enough to disappear under tailoring and dense enough to wear alone. The collar holds its height for the life of the piece.",
    variants: [
      { id: "xs", label: "XS", price: 740 },
      { id: "s", label: "S", price: 740 },
      { id: "m", label: "M", price: 740 },
      { id: "l", label: "L", price: 740 },
    ],
    spec: {
      cloth: ["Extra-fine merino, 18.5 micron"],
      cut: ["Close body", "Set-in sleeve", "Double-thickness collar"],
      finish: ["Fully fashioned", "Hand-linked", "Made in Scotland"],
    },
    details: ["Extra-fine merino", "Double-thickness collar", "Made in Scotland"],
  },

  /* ─────────────  MEN  ───────────── */
  {
    slug: "shawl-collar-dinner-jacket",
    name: "Shawl Collar Dinner Jacket",
    line: "Tailoring",
    category: "men",
    kicker: "Wool mohair · Silk shawl",
    price: 4200,
    image: "/img/campaign/silver-seam-01-810.webp",
    hover: "/img/campaign/silver-seam-02-810.webp",
    featured: true,
    badge: "Icon",
    story:
      "The house shoulder — extended, softly padded, cut with a high armhole so the jacket stays put when the arm moves. Silk shawl collar, one button, and nothing else to argue about.",
    variants: ITALIAN(4200),
    spec: {
      cloth: ["Wool-mohair blend", "Silk shawl collar", "Cupro lining"],
      cut: ["Extended shoulder", "High armhole", "Single button, double vent"],
      finish: ["Half-canvassed", "Hand-padded lapel", "Made in Italy"],
    },
    details: [
      "Wool-mohair blend with silk shawl collar",
      "Half-canvassed, high armhole, extended shoulder",
      "Single button, double vent",
      "Made in Italy",
    ],
  },
  {
    slug: "single-breasted-suit",
    name: "Single-Breasted Suit",
    line: "Tailoring",
    category: "men",
    kicker: "Fresco wool · Two piece",
    price: 3600,
    image: "/img/campaign/midnight-swirl-01-810.webp",
    hover: "/img/campaign/midnight-swirl-detail-810.webp",
    featured: true,
    story:
      "Open-weave fresco wool that breathes in August and holds a crease in October. Cut from the same shoulder as the dinner jacket, because there is only one.",
    variants: ITALIAN(3600),
    spec: {
      cloth: ["Fresco wool, open weave", "Bemberg lining"],
      cut: ["Extended shoulder", "High armhole", "Two button, side vents"],
      finish: ["Half-canvassed", "Working cuffs", "Made in Italy"],
    },
    details: ["Fresco wool, two piece", "Half-canvassed", "Working cuffs", "Made in Italy"],
  },
  {
    slug: "evening-shirt",
    name: "Pleated Evening Shirt",
    line: "Shirting",
    category: "men",
    kicker: "Cotton poplin · Bib front",
    price: 690,
    image: "/img/campaign/silver-seam-02-810.webp",
    hover: "/img/campaign/silver-seam-detail-810.webp",
    story:
      "Swiss cotton poplin with a narrow pleated bib and a covered placket. Cut close through the body without pulling at the button.",
    variants: [
      { id: "39", label: "39", price: 690 },
      { id: "41", label: "41", price: 690 },
      { id: "43", label: "43", price: 690 },
    ],
    spec: {
      cloth: ["Swiss cotton poplin", "Mother-of-pearl buttons"],
      cut: ["Narrow pleated bib", "Covered placket", "Close body"],
      finish: ["Split yoke", "Single-needle seams", "Made in Italy"],
    },
    details: ["Swiss cotton poplin", "Pleated bib, covered placket", "Made in Italy"],
  },
  {
    slug: "oxford-shirt",
    name: "Oxford Shirt",
    line: "Shirting",
    category: "men",
    kicker: "Cotton oxford · Button-down",
    price: 480,
    image: "/img/p-ed-02.svg",
    hover: "/img/p-cat-men.svg",
    story:
      "A heavy cotton oxford with a collar rolled by hand rather than fused, so it breaks the way a collar should and keeps doing it after washing.",
    variants: [
      { id: "39", label: "39", price: 480 },
      { id: "41", label: "41", price: 480 },
      { id: "43", label: "43", price: 480 },
    ],
    spec: {
      cloth: ["Cotton oxford, 140gsm"],
      cut: ["Button-down collar", "Box pleat", "Regular body"],
      finish: ["Unfused hand-rolled collar", "Made in Portugal"],
    },
    details: ["Cotton oxford", "Unfused hand-rolled collar", "Made in Portugal"],
  },
  {
    slug: "pleated-trouser",
    name: "Pleated Trouser",
    line: "Tailoring",
    category: "men",
    kicker: "Wool-linen · Double pleat",
    price: 890,
    image: "/img/campaign/pleated-trouser-crop-810.webp",
    hover: "/img/campaign/noir-vine-01-810.webp",
    story:
      "A double-pleated trouser in a wool-linen cloth heavy enough to hold its line and open enough to wear in August. Cut high on the waist and left long over the shoe.",
    variants: ITALIAN(890),
    spec: {
      cloth: ["Wool-linen", "Bemberg pocketing"],
      cut: ["Double pleat", "High rise", "Full leg"],
      finish: ["Side adjusters", "Unfinished hem", "Made in Italy"],
    },
    details: [
      "Wool-linen, double pleat, high rise",
      "Side adjusters — made to be worn without a belt",
      "Unfinished hem, tailored in boutique",
      "Made in Italy",
    ],
  },
  {
    slug: "cashmere-crewneck",
    name: "Cashmere Crewneck",
    line: "Knitwear",
    category: "men",
    kicker: "Four-ply cashmere",
    price: 890,
    image: "/img/p-ed-01.svg",
    hover: "/img/p-cat-men.svg",
    story:
      "Four-ply, knitted at a tension most houses will not pay for, because a loose gauge is what makes cashmere pill. It will outlast the jacket you wear it under.",
    variants: [
      { id: "s", label: "S", price: 890 },
      { id: "m", label: "M", price: 890 },
      { id: "l", label: "L", price: 890 },
      { id: "xl", label: "XL", price: 890 },
    ],
    spec: {
      cloth: ["Four-ply Mongolian cashmere"],
      cut: ["Crew neck", "Set-in sleeve", "Regular body"],
      finish: ["Fully fashioned", "Hand-linked", "Made in Scotland"],
    },
    details: ["Four-ply Mongolian cashmere", "Fully fashioned", "Made in Scotland"],
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
    spec: {
      cloth: ["Polished box calf", "Leather lining"],
      cut: ["Narrow last", "Elastic gusset", "Matching pull tab"],
      finish: ["Blake stitched", "Leather sole", "Made in Italy"],
    },
    details: ["Polished calf leather", "Blake-stitched leather sole", "Made in Italy"],
  },

  /* ─────────────  OUTERWEAR  ───────────── */
  {
    slug: "double-face-overcoat",
    name: "Double-Face Overcoat",
    line: "Outerwear",
    category: "men",
    kicker: "Cashmere · Unlined",
    price: 4800,
    image: "/img/p-cat-outerwear.svg",
    hover: "/img/p-ed-01.svg",
    badge: "Exclusive",
    story:
      "Two faces of cashmere joined by hand, so the coat needs no lining and weighs almost nothing for its warmth. Every edge is closed with a stitch you can see if you look, and are meant to.",
    variants: ITALIAN(4800).slice(0, 4),
    spec: {
      cloth: ["Double-face cashmere", "No lining"],
      cut: ["Raglan sleeve", "Below the knee", "Concealed placket"],
      finish: ["Hand-joined edges", "Hand-sewn throughout", "Made in Italy"],
    },
    details: [
      "Double-face cashmere, unlined",
      "Edges joined by hand — roughly forty hours a coat",
      "Raglan sleeve, concealed placket",
      "Made in Italy",
    ],
  },
  {
    slug: "orbit-bandhgala",
    name: "Orbit Bandhgala",
    line: "Occasion",
    category: "occasion",
    kicker: "Wool crêpe · Appliqué discs",
    price: 4400,
    image: "/img/campaign/orbit-01-810.webp",
    hover: "/img/campaign/orbit-03-810.webp",
    badge: "New",
    featured: true,
    story:
      "Discs of midnight wool laid over black and outlined in crystal, scattered so the eye reads them as falling rather than placed. Each one is cut, turned and set by hand, and no two sit at the same angle. Closed high at the collar, so the front reads clean until it does not.",
    variants: ITALIAN(4400),
    spec: {
      cloth: ["Wool crêpe", "Midnight wool appliqué", "Crystal and antique bead"],
      cut: ["Mandarin collar", "Concealed placket", "Side vents"],
      finish: ["Discs cut and turned by hand", "Outlined on the frame", "Made in India"],
    },
    details: [
      "Wool crêpe with appliquéd wool discs and crystal outline",
      "Mandarin collar, concealed placket, side vents",
      "No two discs set at the same angle",
      "Made in India — specialist dry clean only",
    ],
  },
  {
    slug: "noir-vine-bandhgala",
    name: "Noir Vine Bandhgala",
    line: "Occasion",
    category: "occasion",
    kicker: "Wool crêpe · Hand-set crystal",
    price: 5400,
    image: "/img/campaign/noir-vine-01-810.webp",
    hover: "/img/campaign/noir-vine-02-810.webp",
    badge: "Limited",
    soldOut: true,
    featured: true,
    story:
      "A bandhgala cut close to the body and broken open down the front, with a vine of hand-set crystal and bugle bead running from the collar out along the shoulder. Two hundred hours on the sleeve alone. Everything around it is left plain, because embroidery only reads if something near it stays quiet.",
    variants: ITALIAN(5400),
    spec: {
      cloth: ["Wool crêpe", "Silk organza foundation", "Crystal, bugle and cut bead"],
      cut: ["Mandarin collar", "Open front", "Close through the body"],
      finish: ["Embroidered on the frame, panel by panel", "Hand-finished facings", "Made in India"],
    },
    details: [
      "Wool crêpe with hand-set crystal, bead and bugle work",
      "Mandarin collar, open front, close through the body",
      "Approximately 200 hours of hand embroidery",
      "Made in India — specialist dry clean only",
    ],
  },
  {
    slug: "tidemark-sherwani",
    name: "Tidemark Sherwani",
    line: "Occasion",
    category: "occasion",
    kicker: "Midnight wool · Scalloped hem",
    price: 4900,
    image: "/img/campaign/tidemark-detail-810.webp",
    hover: "/img/campaign/orbit-02-810.webp",
    badge: "Exclusive",
    featured: true,
    story:
      "A long sherwani in midnight wool, held plain through the body and then broken at the hem by a scalloped tide of sequin, bugle and dulled silver. The shoulders carry a fine scatter of crystal that only shows when you turn. Nothing at all in between — that is the whole idea.",
    variants: ITALIAN(4900),
    spec: {
      cloth: ["Midnight wool", "Sequin, bugle and dulled silver thread"],
      cut: ["Mandarin collar", "Knee length", "Centre-front placket"],
      finish: ["Scalloped hem worked by hand", "Matching cuff", "Made in India"],
    },
    details: [
      "Midnight wool with hand-worked scalloped hem and cuff",
      "Mandarin collar, knee length",
      "Crystal scatter across the shoulder",
      "Made in India — specialist dry clean only",
    ],
  },
];

/* ─────────────────────────  ACCESS HELPERS  ───────────────────────── */

export const bySlug = (slug: string) => PRODUCTS.find((p) => p.slug === slug);

export const byCategory = (c: Category) => PRODUCTS.filter((p) => p.category === c);

export const featured = () => PRODUCTS.filter((p) => p.featured);

export const category = (slug: string) => CATEGORIES.find((c) => c.slug === slug);

/** Deterministic "you may also like" — never returns the product itself. */
export const related = (p: Product, n = 4) =>
  [
    ...PRODUCTS.filter((x) => x.category === p.category && x.slug !== p.slug),
    ...PRODUCTS.filter((x) => x.category !== p.category),
  ].slice(0, n);

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
    slug: "forty-hours-a-coat",
    eyebrow: "Construction",
    title: "Forty Hours a Coat",
    excerpt:
      "Why the overcoat has no lining, what it takes to join two faces of cashmere by hand, and what that patience actually buys.",
    image: "/img/p-ed-01.svg",
  },
  {
    slug: "against-the-neutral",
    eyebrow: "Colour",
    title: "Against the Neutral",
    excerpt:
      "A study in oxblood, forest and true navy — and the case for a wardrobe that is not trying to be flattering.",
    image: "/img/p-ed-03.svg",
  },
];
