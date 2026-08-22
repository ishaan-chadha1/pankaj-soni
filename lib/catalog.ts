/**
 * The PANKAJ SONI house — an invented luxury maison.
 *
 * An apparel house: tailoring, outerwear, knitwear, eyewear and leather. Every
 * product, price and line of copy here is original to this project. `PANKAJ
 * SONI` is used the way any couture label uses a founder's name: as a wordmark
 * for a fictional house, with no connection to, or information about, any real
 * person of that name.
 */

export type Category =
  | "women"
  | "men"
  | "outerwear"
  | "eyewear"
  | "leather"
  | "gifts";

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
    slug: "outerwear",
    label: "Outerwear",
    tagline: "Weight where it is needed, nowhere else.",
    image: "/img/p-cat-outerwear.svg",
  },
  {
    slug: "eyewear",
    label: "Eyewear",
    tagline: "Architecture for the face.",
    image: "/img/p-cat-eyewear.svg",
  },
  {
    slug: "leather",
    label: "Leather Goods",
    tagline: "Box calf, brass, and nothing to prove.",
    image: "/img/p-cat-leather.svg",
  },
  {
    slug: "gifts",
    label: "Gifts",
    tagline: "Presented in lacquer and grosgrain.",
    image: "/img/p-cat-gifts.svg",
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
    image: "/img/p-cat-women.svg",
    hover: "/img/p-ed-03.svg",
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
    image: "/img/p-ed-03.svg",
    hover: "/img/p-cat-women.svg",
    badge: "Limited",
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
    featured: true,
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
    image: "/img/p-cat-men.svg",
    hover: "/img/p-ed-02.svg",
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
    image: "/img/look/look-02.jpg",
    hover: "/img/p-cat-men.svg",
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
    image: "/img/look/look-03.jpg",
    hover: "/img/p-cat-men.svg",
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
    image: "/img/look/look-02.jpg",
    hover: "/img/p-cat-men.svg",
    featured: true,
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
    image: "/img/look/look-01.jpg",
    hover: "/img/p-cat-men.svg",
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
    category: "outerwear",
    kicker: "Cashmere · Unlined",
    price: 4800,
    image: "/img/p-cat-outerwear.svg",
    hover: "/img/p-ed-01.svg",
    badge: "Exclusive",
    featured: true,
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
    slug: "belted-trench",
    name: "Belted Trench",
    line: "Outerwear",
    category: "outerwear",
    kicker: "Cotton gabardine · Storm flap",
    price: 3200,
    image: "/img/p-ed-02.svg",
    hover: "/img/p-cat-outerwear.svg",
    story:
      "Densely woven cotton gabardine that turns rain without a coating and softens with every year. Cut generous enough to go over tailoring without crushing the shoulder.",
    variants: ITALIAN(3200).slice(0, 4),
    spec: {
      cloth: ["Cotton gabardine", "Viscose lining"],
      cut: ["Double breasted", "Storm flap", "Deep back vent"],
      finish: ["Horn buckle", "Self belt", "Made in England"],
    },
    details: ["Cotton gabardine", "Double breasted, storm flap", "Made in England"],
  },
  {
    slug: "shearling-blouson",
    name: "Shearling Blouson",
    line: "Outerwear",
    category: "outerwear",
    kicker: "Spanish shearling · Short body",
    price: 5400,
    image: "/img/p-cat-outerwear.svg",
    hover: "/img/p-ed-03.svg",
    badge: "Limited",
    story:
      "Spanish shearling selected for its short even nap, cut to a blouson so the weight sits on the shoulder rather than dragging from the hem.",
    variants: ITALIAN(5400).slice(0, 4),
    spec: {
      cloth: ["Spanish entrefino shearling"],
      cut: ["Blouson body", "Ribbed hem and cuff", "Stand collar"],
      finish: ["Hand-cut panels", "Edges left raw", "Made in Spain"],
    },
    details: ["Spanish shearling", "Ribbed hem and cuff", "Made in Spain"],
  },
  {
    slug: "unstructured-topcoat",
    name: "Unstructured Topcoat",
    line: "Outerwear",
    category: "outerwear",
    kicker: "Wool flannel · No canvas",
    price: 2900,
    image: "/img/p-ed-01.svg",
    hover: "/img/p-cat-outerwear.svg",
    story:
      "No canvas, no padding, no structure at all — the cloth is heavy enough to do the work itself. It creases when you sit and forgets by the time you stand.",
    variants: ITALIAN(2900),
    spec: {
      cloth: ["Wool flannel, 480g", "Half lining"],
      cut: ["Unstructured shoulder", "Single breasted", "Mid-thigh"],
      finish: ["No canvas or padding", "Hand-set sleeve", "Made in Italy"],
    },
    details: ["Wool flannel, unstructured", "Half lined", "Made in Italy"],
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
    story: "A perfect circle in black acetate with a petrol-tinted lens. Unforgiving, and worth it.",
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

  /* ─────────────  LEATHER GOODS  ───────────── */
  {
    slug: "weekend-holdall",
    name: "Weekend Holdall",
    line: "Leather Goods",
    category: "leather",
    kicker: "Box calf · Brass hardware",
    price: 2400,
    image: "/img/look/look-03.jpg",
    hover: "/img/p-cat-leather.svg",
    badge: "New",
    featured: true,
    story:
      "Box calf over a soft frame, so it slumps when empty and squares up when full. Two nights, one suit, and nothing you would be embarrassed to set down in a good hotel.",
    variants: [
      { id: "black", label: "Black", price: 2400, swatch: "#141414" },
      { id: "chestnut", label: "Chestnut", price: 2400, swatch: "#6b4423" },
    ],
    details: [
      "Box calf leather over a soft frame",
      "Solid brass hardware, suede-lined interior",
      "Detachable shoulder strap",
      "Made in Italy",
    ],
  },
  {
    slug: "opera-clutch",
    name: "Opera Clutch",
    line: "Leather Goods",
    category: "leather",
    kicker: "Box calf · Brass clasp",
    price: 1850,
    image: "/img/p-cat-leather.svg",
    hover: "/img/p-ed-01.svg",
    story:
      "Box calf over a rigid frame, with a solid brass clasp that closes with an audible click. Holds exactly what an evening requires.",
    variants: [
      { id: "black", label: "Black", price: 1850, swatch: "#111111" },
      { id: "oxblood", label: "Oxblood", price: 1850, swatch: "#4d1220" },
    ],
    details: ["Box calf leather, rigid frame", "Solid brass clasp", "Suede-lined", "Made in Italy"],
  },
  {
    slug: "document-case",
    name: "Document Case",
    line: "Leather Goods",
    category: "leather",
    kicker: "Bridle leather · Single fold",
    price: 1650,
    image: "/img/p-ed-02.svg",
    hover: "/img/p-cat-leather.svg",
    story:
      "One piece of bridle leather folded once, stitched at two edges, and left to earn its colour. There is no lining because there is nothing a lining would improve.",
    variants: [
      { id: "chestnut", label: "Chestnut", price: 1650, swatch: "#6b4423" },
      { id: "black", label: "Black", price: 1650, swatch: "#141414" },
    ],
    details: ["English bridle leather", "Unlined, single fold", "Made in England"],
  },
  {
    slug: "woven-belt",
    name: "Woven Belt",
    line: "Leather Goods",
    category: "leather",
    kicker: "Braided calf · Brass pin",
    price: 340,
    image: "/img/look/look-01.jpg",
    hover: "/img/p-cat-leather.svg",
    story:
      "Braided calf with no punched holes — the pin goes wherever it needs to, which is the whole argument for a woven belt.",
    variants: [
      { id: "85", label: "85 cm", price: 340 },
      { id: "90", label: "90 cm", price: 340 },
      { id: "95", label: "95 cm", price: 340 },
    ],
    details: ["Braided calf leather", "Solid brass pin buckle", "Made in Italy"],
  },

  /* ─────────────  GIFTS  ───────────── */
  {
    slug: "cashmere-scarf",
    name: "Cashmere Scarf",
    line: "Gifting",
    category: "gifts",
    kicker: "Six-ply cashmere · Hand-fringed",
    price: 590,
    image: "/img/p-cat-gifts.svg",
    hover: "/img/p-ed-01.svg",
    featured: true,
    story:
      "Six-ply cashmere woven wide enough to wear as a wrap, with a fringe knotted by hand rather than cut by machine.",
    variants: [
      { id: "camel", label: "Camel", price: 590, swatch: "#a67c4e" },
      { id: "charcoal", label: "Charcoal", price: 590, swatch: "#3a3a3c" },
      { id: "bone", label: "Bone", price: 590, swatch: "#ddd5c4" },
    ],
    details: ["Six-ply cashmere", "Hand-knotted fringe", "Made in Scotland"],
  },
  {
    slug: "leather-gloves",
    name: "Cashmere-Lined Gloves",
    line: "Gifting",
    category: "gifts",
    kicker: "Nappa lamb · Cashmere lining",
    price: 480,
    image: "/img/p-ed-03.svg",
    hover: "/img/p-cat-gifts.svg",
    story:
      "Nappa lamb cut on the stretch and lined in cashmere, so they are warm without bulk and fit closer after a week.",
    variants: [
      { id: "8", label: "8", price: 480 },
      { id: "8h", label: "8½", price: 480 },
      { id: "9", label: "9", price: 480 },
    ],
    details: ["Nappa lambskin, cashmere lined", "Hand-cut", "Made in Italy"],
  },
  {
    slug: "silk-tie",
    name: "Grenadine Tie",
    line: "Gifting",
    category: "gifts",
    kicker: "Silk grenadine · Untipped",
    price: 260,
    image: "/img/p-cat-gifts.svg",
    hover: "/img/p-ed-02.svg",
    story:
      "Woven grenadine silk, untipped and self-lined, so the knot has texture and the blade keeps its weight without interfacing.",
    variants: [
      { id: "navy", label: "Navy", price: 260, swatch: "#1e2a3a" },
      { id: "oxblood", label: "Oxblood", price: 260, swatch: "#4d1220" },
      { id: "forest", label: "Forest", price: 260, swatch: "#22372a" },
    ],
    details: ["Silk grenadine", "Untipped, self-lined", "Made in Italy"],
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
