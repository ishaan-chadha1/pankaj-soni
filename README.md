# PANKAJ SONI

A luxury apparel maison — hand-embroidered occasionwear, tailoring, knitwear,
eyewear and leather — with an interactive WebGL cloth instrument.

**PANKAJ SONI is a fictional house.** The name is used the way any couture label
uses a founder's name: as a wordmark. Nothing here describes, depicts or relates
to any real person of that name. Every product, price, note and line of copy is
invented for this project.

Imagery is of two kinds, and neither is scraped, traced or borrowed from another
brand: the twenty campaign frames in `public/img/campaign/` were shot for this
project and are processed by `scripts/photos.mjs`, and everything else is
generated from primitives by `scripts/assets.mjs`.

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

Live at **https://pankaj-soni-beige.vercel.app** — that origin is the built-in
default in `lib/site.ts`, so canonical tags, OG image URLs, `sitemap.xml` and
`robots.txt` all come out absolute and correct with no environment set up.

Override it only when the site moves to its own domain. It is read at BUILD
time, so it has to be set before the bundle is made, not after:

```bash
export NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

`vercel.json` sets a week of caching on `/img/*`. Vercel's default for files in
`public/` is `max-age=0, must-revalidate`, which made the campaign revalidate on
every single page load. `stale-while-revalidate` means a replaced asset still
reaches people within a day without anyone ever waiting on a fresh fetch.

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
  c/[category]/        Women, Men, Occasion, Eyewear, Leather, Gifts
  p/[slug]/            29 product pages
  bag/  checkout/      bag and a 4-step checkout
  world/               the maison story
  atelier/             the WebGL cloth instrument
  components/          header, footer, cart drawer, cursor, preloader…
  CartProvider.tsx     cart state, persisted to localStorage
  globals.css          design tokens + component classes
lib/catalog.ts         the entire invented catalogue
lib/looks.ts           the shoppable frame + hotspot coordinates
lib/photos.ts          GENERATED — campaign manifest, sizes and blur placeholders
scripts/assets.mjs     generates every drawn image in public/img
scripts/photos.mjs     builds public/img/campaign from media-in/shoot-01
scripts/probe-hotspots.mjs  reads back what is under a hotspot coordinate
```

## The campaign

The home page opens on **After Hours** — twenty frames shot on one grey seamless,
processed by `scripts/photos.mjs`.

### The hero is a triptych, not a film

The shoot arrives at 810×1080. A single frame stretched across a 1920px viewport
is a 2.4× upscale, and on a picture whose entire subject is hand-set crystal
that is the one thing you cannot afford — the bead work turns to mush and the
garment stops being the reason to look. Three panes side by side span 2430px of
source across the same viewport, so every stitch renders at or above 1:1. The
format is not a compromise around the resolution; it is what the resolution is
good at.

- Two panes at tablet, one at phone — three portraits in a 768px window are
  250px wide and every face in them is a thumbnail.
- The lockup sits at **68%**, not dead centre: all three frames are dark cloth
  there, so ivory type lands on garment rather than on a face, and the scrim
  only has to insure the descenders.
- The hero is `calc(100svh - var(--ps-chrome) - 74px)`. The announcement bar and
  header sit **above** it in flow, so a hero at `90svh` was 90svh *plus* the
  chrome — it overran the fold by 37px and pushed its own scroll cue off the
  bottom of the window. `--ps-chrome` is measured by `Header` and written onto
  `<html>`; it cannot be a constant, because the announcement wraps to two lines
  under 560px and the header's padding steps at `lg`.

### The work

Four frames carry no face at all — pure cloth and hand-work, shot close. On a
product grid that makes them weak, because there is nothing in them to buy;
given their own band it makes them the strongest argument the page has. Set on
the **inverted ground**, because every one is a dark garment on pale grey: on
paper they read as four grey rectangles, and against ink the crystal is the only
thing in the room.

### The rail loops

The set is rendered three times and the rail parks on the middle copy. When a
scroll carries you past the copy you started in, `scrollLeft` moves by exactly
one set width — you land on an identical pixel, so there is nothing to see and
the row appears to have no end.

- `scroll-snap-type` is switched **off around the assignment**. With mandatory
  snapping left on, the browser re-snaps to whatever is nearest after the jump,
  which on a fast flick cancelled the momentum and stopped the rail dead at the
  seam. It is restored on the next frame, not synchronously, or it snaps against
  the value just written.
- Doing it with `scrollLeft` rather than a transform is what keeps momentum: a
  kinetic flick that crosses the seam carries its velocity through, because the
  browser is still the one scrolling.
- The set width is **measured** — the distance from a plate to its own duplicate
  one set later. Plate width is a `clamp()` and the gap is a CSS value, so
  nothing else is reliable. It is re-measured on resize, because a stale offset
  lands mid-plate at the next breakpoint.
- Only the middle copy is in the tab order or the accessibility tree; the other
  two are `aria-hidden` and `inert`. A screen reader reading the collection
  three times is worse than not looping at all.
- The arrows are never disabled, because there is no end to be at.

### The shoppable frames

Two spreads, each set beside its own copy, the second mirrored — `order` rather
than a reversed column list, so the source stays copy-then-frame and a screen
reader hears the heading before the picture on both. Every other band is a row of portraits; this
is the one place the eye gets a different shape, and it lets a 3:4 source render
at about 700px rather than being stretched across the full measure.

- **Hotspot coordinates are percentages of the source image**, converted to the
  rendered frame by `makeCropMap`, so a dot stays on its garment at any aspect.
- They are **measured, not eyeballed**. Each was placed by sampling an 11px
  patch and reading it back: the bandhgala returns `rgb(43,48,52)`, the crystal
  bodice `rgb(143,141,135)`, against a seamless above L=170 and skin that runs
  warm. An earlier campaign placed by eye put three of six markers on panelling.
  `npm run probe` is the tool.
- **`narrow` is a width test, not an aspect test.** It was `w/h < 1.4`, written
  when every frame was a landscape band. On a 3:4 portrait that ratio is 0.75 at
  any size, so a 700px frame with room to spare was permanently classed as a
  phone. It is now `w < 520`.
- **The anchor is a zero-size point.** It used to be the card's own box,
  counter-rotating with `rotate(-Ndeg) translate(0,-50%)`. Fine while the leader
  points east — but the two markers on a portrait frame point in opposite
  directions, and at N=187° the counter-rotation is nearly a 180° flip, which
  mirrors the −50% meant to centre the card. It landed a full card-height
  (176px) above the line, while its twin at N=7° sat correctly. Same code,
  opposite sign. With no size, the rotation is a pure spin about the leader's
  endpoint and the card centres itself in a net-unrotated frame.
- The vertical rescue nudge rides on the **card** as `--nudge-y`, in screen
  pixels, for the same reason: anything appended to the anchor's transform is
  rotated with it, which turns "down 40px" into "up 40px".
- Lines **draw on scroll-in, then retract** after a beat; hover, focus or an
  open card brings one back. Permanent labels compete with the photograph.
- Labels are **screen-reader only**. Set on the photograph they landed wherever
  the leader happened to end, and a row of pale chips reads as a diagram rather
  than a campaign. They are kept short anyway, because `clampArms` measures
  their box to decide whether the leader still fits inside the frame.
- The marker is a **frosted lens**: a bright pinprick, a translucent dark disc
  the photograph shows through blurred, and a ring that is ivory on its inside
  edge and ink on its outside. It replaced a 19px ivory hairline ring, which had
  been drawn for warm walnut and cream cloth — laid over hand-set silver crystal
  on black crepe it was indistinguishable from the beadwork and simply vanished.
  Whichever way the picture goes, one of the two ring edges is in contrast with
  it. The leader carries the same two-edge treatment, for the same reason: it
  crosses from cloth onto seamless and has to survive the handover.
- On a narrow frame the leaders go and the mark grows to 28px, with a `::before`
  carrying a 52px touch target.
- The card becomes a sheet pinned to the viewport, **portalled to `<body>`**:
  `position: fixed` resolves against the nearest transformed ancestor, and
  `<main>` carries a transform from the page-entry animation.
- The list beside the frame is the keyboard and screen-reader path, and the
  whole interface on a phone where an 11px dot is not a target.

To move a marker, edit `lib/looks.ts` — `x`/`y` are percentages of the image,
`len` is a percentage of frame width. Verify it with `npm run probe` before you
trust it.

### The photo pipeline

```bash
npm run photos    # media-in/shoot-01 → public/img/campaign + lib/photos.ts
```

Two widths per frame: **810w** for the hero triptych and any full-bleed use,
**400w** for rail plates, grid cards and thumbnails, which never render above
480 CSS px. A third size in between buys nothing at these weights — the 810 is
58KB. Each frame also gets a 20px WebP inlined as a blur placeholder, so a rail
of portraits resolves out of the photograph instead of flashing empty boxes.

`CROPS` publishes a region of a frame as a plate of its own. A few garments are
in the campaign without ever being its subject — the trousers under the Noir
Vine are well photographed, they are just at the bottom of a frame about a
shoulder. The whole frame shows the wrong garment and a generated wash shows no
garment; a crop shows the trouser. Boxes are percentages of the source, so they
survive the 300DPI swap without being re-measured.

The whole set is **1.46MB**, down from 33MB of camera JPEG.

`media-in/` is gitignored: the masters are not the deliverable,
`public/img/campaign/` is. When the 300DPI set lands, drop it in under the same
camera numbers and re-run — every reference downstream is by slug, so nothing
else has to change, and a single full-bleed hero becomes available.

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

## The drawn imagery

The pieces that were never photographed run on generated SVG — a second visual
register, deliberately abstract, so a catalogue plate never pretends to be a
photograph of a garment that does not exist. Rerun after editing the script:

```bash
npm run assets
```

Everything is composed on a luminous pale ground, so the product shots read as
catalogue photography on paper and one asset set works under all six palettes.
Plates are tied to the active accent in CSS with a `multiply` tint (`.ps-tint`)
rather than by generating six variants of every file.

- **Eyewear** — SVG, drawn from primitives: layered lens gradients, a frame ramp
  and specular streaks across the glass. On a light ground glass reads by its
  *edges*, so the gradients are built around bright rims and a translucent core.
- **Category and editorial plates** — pale washes with `feTurbulence` grain and
  a soft key light, kept low-contrast so display type sits over them without a
  heavy scrim.
- **`og.png`** — encoded as a real PNG (raw scanlines → `zlib.deflate` → IHDR/IDAT/IEND),
  because social platforms ignore SVG cards. No image dependency.

Everything is text-free by design: an SVG loaded through `<img>` cannot reach a
webfont, so all typography lives in the HTML on top.

## The Cloth Room (`/atelier`)

Pick a fibre, a weave and a finish; a fragment shader renders the cloth live.
Colour comes from the fibre, movement from how it drapes, light from how it is
finished, and the field displaces under the cursor. A heavier cloth moves less
and throws back more light. It is domain-warped fbm with two warp passes — the
second bends the first, which is what produces long silk-like filaments instead
of uniform cloud. Uniforms are lerped in `useFrame`, so changing a note morphs
the field rather than cutting to it.

## Notes

- The checkout is deliberately inert. It collects no card details and contacts no
  payment processor; placing an order clears the bag and shows a confirmation.
- Promo codes `ATELIER10` and `MAISON` work on the bag page.
- One piece is marked `soldOut`. A capped run that has gone stays on the rail
  rather than quietly disappearing — it dims the plate, badges it, swaps the
  price for "Price on Request" and disables every add-to-bag path.
- Respects `prefers-reduced-motion` throughout; the custom cursor is pointer-only
  and the native cursor is only hidden once it has actually mounted.
