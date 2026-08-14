# PANKAJ SONI

A luxury maison storefront — fragrance, beauty, eyewear and tailoring — with an
interactive WebGL fragrance instrument.

**PANKAJ SONI is a fictional house.** The name is used the way any couture label
uses a founder's name: as a wordmark. Nothing here describes, depicts or relates
to any real person of that name. Every product, price, note and line of copy is
invented for this project, and every image is generated from primitives by
`scripts/assets.mjs` — nothing is scraped, traced or borrowed from another brand.

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
  p/[slug]/            24 product pages
  bag/  checkout/      bag and a 4-step checkout
  world/               the maison story
  atelier/             the WebGL fragrance instrument
  components/          header, footer, cart drawer, cursor, preloader…
  CartProvider.tsx     cart state, persisted to localStorage
  globals.css          design tokens + component classes
lib/catalog.ts         the entire invented catalogue
scripts/assets.mjs     generates every image in public/img
```

## The imagery

All 30 assets are generated. Rerun after editing the script:

```bash
npm run assets
```

- **Flacons** — SVG, drawn from primitives: layered glass gradients, a specular
  column, a hot edge, and a five-stop metal ramp for the cap. Four silhouettes so
  eight fragrances don't read as one bottle in eight colours.
- **Eyewear / cosmetics** — same approach, different geometry.
- **Campaign plates** — duotone fields with `feTurbulence` grain and a soft key
  light. The shared duotone is what makes a page of them read as one campaign.
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
