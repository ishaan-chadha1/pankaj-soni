# PANKAJ SONI

A luxury maison storefront — fragrance, beauty, eyewear and tailoring — with an
interactive WebGL fragrance instrument.

**PANKAJ SONI is a fictional house.** The name is used the way any couture label
uses a founder's name: as a wordmark. Nothing here describes, depicts or relates
to any real person of that name. Every product, price, note and line of copy is
invented for this project.

Imagery is of two kinds, and neither is scraped, traced or borrowed from another
brand: the three campaign stills in `public/img/look/` were supplied for this
project, and everything else is generated from primitives by
`scripts/assets.mjs`.

---

## Run it

```bash
npm install
npm run dev
```

→ http://localhost:3000

## Build

```bash
npm run build          # standard Next build (Vercel, Node host, Docker)
npm run build:static   # fully static bundle in out/ — no server at all
```

The whole site prerenders: the catalogue is a TypeScript module and the bag lives
in `localStorage`, so the static path loses nothing. To preview the static bundle:

```bash
npm run serve:static
```

## Deploy

Set your real domain first so canonical, sitemap and OG URLs are absolute:

```bash
export NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

**Vercel** — zero config, detects Next automatically:

```bash
npx vercel deploy --prod
```

**Netlify** — from the static bundle:

```bash
npm run build:static && npx netlify deploy --prod --dir=out
```

**GitHub Pages / S3 / Cloudflare Pages / any static host** — build and upload
`out/`. It is plain HTML, CSS, JS and images with no runtime requirement:

```bash
npm run build:static
```

> First-time use of any of these CLIs will ask you to log in. That is yours to do —
> the deploy commands above are ready once you are authenticated.

---

## Layout

```
app/
  layout.tsx           root layout: fonts, metadata, chrome
  page.tsx             home
  c/[category]/        6 category listings, with filter + sort + density
  p/[slug]/            27 product pages
  bag/  checkout/      bag and a 4-step checkout
  world/               the maison story
  atelier/             the WebGL fragrance instrument
  components/          header, footer, cart drawer, cursor, preloader…
  CartProvider.tsx     cart state, persisted to localStorage
  globals.css          design tokens + component classes
lib/catalog.ts         the entire invented catalogue
lib/looks.ts           campaign looks + hotspot coordinates
scripts/assets.mjs     generates every image in public/img
```

## The campaign lookbook

The home page is built around three campaign stills. Every garment in frame
carries a marker; a hairline draws out from it and opens a card that links
through to the listing, or adds straight to the bag.

- **Hotspot coordinates are percentages of the image**, so the frame preserves
  the source 3168:1344 aspect rather than cropping to fill. An `object-cover`
  crop walks every marker off its garment the moment the viewport changes shape.
- They were placed by **sampling pixel luminance**, not by eye — an eyeballed
  pass put three of six markers on wood panelling and one in the gap between
  the two shoes. Cream cloth reads 145+, black leather under 40.
- **Leader length is measured, not authored.** `clampArms` in `LookBook.tsx`
  resolves each arm to px after layout and shortens it until the label sits
  inside the frame. Direction and tilt come from the marker's position, so a
  marker near an edge points inward automatically.
- Lines **draw on scroll-in, then retract** after a beat. Hover, focus or an
  open card brings an individual one back. Six permanent labels compete with
  the photograph; the settle gives the frame back.
- On phones the frame **crops to 4:5** — a 2.36:1 frame at 375px is 142px tall
  and the model ends up unreadable. Because the crop breaks marker alignment,
  the markers come off entirely there and the product row under each frame is
  the interface. That row is also the keyboard and screen-reader path on
  desktop, where an 11px dot is a poor target.

To move a marker, edit `lib/looks.ts` — `x`/`y` are percentages of the image,
`len` is a percentage of frame width.

## Palettes

Six of them, all light. The picker sits in the header (and at the foot of the
mobile menu); the choice persists to `localStorage`.

| | Ground | Accent |
|---|---|---|
| **Bone** — default | warm paper | antique gold |
| **Porcelain** | cool white | slate blue |
| **Blush** | pale rose | deep berry |
| **Sand** | desert linen | burnt clay |
| **Sage** | cool green | deep moss |
| **Alabaster** | near-white | none — pure editorial |

How it fits together:

- A palette is one `[data-theme="…"]` block in `globals.css` plus one row in
  `lib/themes.ts`. That is the whole surface area for adding a seventh.
- Components read only the semantic `--ps-*` tokens, never a raw hex. **A
  hardcoded colour in a component is a bug** — it is what breaks reskinning.
- `ThemeScript` writes `data-theme` onto `<html>` in a blocking inline script
  before first paint. Applying it in an effect instead would paint once in the
  default palette and then snap — the classic theme flash.
- Every palette clears WCAG AA (4.5:1) for body, muted and accent text. The
  accent carries the small-caps eyebrow labels, so it is held to the normal-text
  threshold rather than the large-text one.
- `.ps-invert` is the one exception: a single high-contrast band per page, the
  way print editorial uses one. It is a dark *block*, not a dark theme.

## The imagery

All 30 assets are generated. Rerun after editing the script:

```bash
npm run assets
```

Everything is composed on a luminous pale ground, so the product shots read as
catalogue photography on paper and one asset set works under all six palettes.
Plates are tied to the active accent in CSS with a `multiply` tint (`.ps-tint`)
rather than by generating six variants of every file.

- **Flacons** — SVG, drawn from primitives: layered glass gradients, a specular
  column, a hot edge, and a five-stop metal ramp for the cap. Four silhouettes so
  eight fragrances don't read as one bottle in eight colours. On a light ground
  glass reads by its *edges*, so the gradients are built around bright rims and a
  translucent core rather than a dark body.
- **Eyewear / cosmetics** — same approach, different geometry.
- **Campaign plates** — pale washes with `feTurbulence` grain and a soft key
  light, kept low-contrast so display type sits over them without a heavy scrim.
- **`og.png`** — encoded as a real PNG (raw scanlines → `zlib.deflate` → IHDR/IDAT/IEND),
  because social platforms ignore SVG cards. No image dependency.

Everything is text-free by design: an SVG loaded through `<img>` cannot reach a
webfont, so all typography lives in the HTML on top.

## The Olfactory Engine (`/atelier`)

Pick a top, a heart and a base; a fragment shader renders the composition live.
Colour comes from the materials, turbulence from their volatility, and the field
displaces under the cursor. It is domain-warped fbm with two warp passes — the
second bends the first, which is what produces long silk-like filaments instead
of uniform cloud. Uniforms are lerped in `useFrame`, so changing a note morphs
the field rather than cutting to it.

## Notes

- The checkout is deliberately inert. It collects no card details and contacts no
  payment processor; placing an order clears the bag and shows a confirmation.
- Promo codes `ATELIER10` and `MAISON` work on the bag page.
- Respects `prefers-reduced-motion` throughout; the custom cursor is pointer-only
  and the native cursor is only hidden once it has actually mounted.
