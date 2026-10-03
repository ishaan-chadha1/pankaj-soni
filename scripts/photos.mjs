/**
 * Builds the campaign photography.
 *
 * The shoot arrives as camera exports — `72DPI AVI-01392.jpg` — at 810x1080 and
 * 1.2-2.4MB each. Thirty-three megabytes of JPEG is not a website. This renames
 * every frame to something the catalogue can reference without embarrassment,
 * emits two WebP widths, and writes a manifest carrying the dimensions and a
 * blur placeholder for each one.
 *
 *   npm run photos
 *
 * Sources live in `media-in/shoot-01/`, which is gitignored: the masters are
 * not the deliverable, `public/img/campaign/` is. When the 300DPI set lands,
 * drop it in the same folder under the same camera numbers and re-run — every
 * reference downstream is by slug, so nothing else has to change.
 *
 * TWO WIDTHS, deliberately. 810w is the native export and covers the hero
 * triptych (three panes across a 2430px span) and any full-bleed use. 400w
 * covers the rail plates, the grid cards and the thumbnails, which never render
 * above 480 CSS px. A third size in between buys nothing at these file weights
 * — the 810 is already 58KB.
 */
import { mkdirSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
/* shoot-01 is the 72DPI first cut; shoot-02 the 300DPI selects. Camera
   numbers never collide across them, so both are searched as one pool. */
/* shoot-01 (the 72DPI first cut) is no longer read: every slot is filled
   from the 300DPI selects, some with stand-in garments until the catalogue
   is re-shot against them — the slugs are kept so nothing downstream moves. */
const SRCS = ["shoot-02"].map((d) => join(ROOT, "media-in", d));
const OUT = join(ROOT, "public", "img", "campaign");

/**
 * Camera number → slug, grouped by garment.
 *
 * The camera numbers are the only stable identity the shoot has — the frames
 * arrived with no other ordering — so the mapping is pinned to them rather
 * than to filename order, which would silently re-shuffle if a frame is added.
 */
const FRAMES = [
  /* Look A — black crystal-vine bandhgala */
  ["01479", "noir-vine-01", "Model in a long navy sherwani with scalloped metallic embroidery at the hem and cuffs."],
  ["01487", "noir-vine-02", "Close detail of the scalloped metallic hem and cuff on a navy sherwani."],

  /* Look B — black strapless column gown */
  ["01515", "nocturne-gown-01", "Model in a navy strapless corset top and draped column skirt, a line of crystal across the bodice."],
  ["01527", "nocturne-gown-02", "Navy pleated strapless top with a diagonal crystal line, worn over a draped skirt."],
  ["01528", "nocturne-gown-03", "Model in a navy pleated strapless top with crystal trim."],
  ["01503", "nocturne-gown-04", "Model in a white pinstripe shirt with a navy claw-mark embroidery at the chest."],

  /* Look C — black tuxedo, silver crystal panels */
  ["01537", "silver-seam-01", "Model in a black zip jacket hand-painted with white brushstrokes."],
  ["01538", "silver-seam-02", "Full-length model in a black hand-painted zip jacket and black trousers."],
  ["01535", "silver-seam-detail", "Close detail of white brushstroke painting and a pleated collar on a black zip jacket."],

  /* Look D — circle-embroidered bandhgala */
  ["01565", "orbit-01", "Model in a black shirt with a woven black-and-white checkerboard panel."],
  ["01568", "orbit-02", "Model leaning against a wall in a black checkerboard-panel shirt."],
  ["01489", "orbit-03", "Model looking back over his shoulder in a white pinstripe shirt with a tiger embroidered on the back."],

  /* Look E — lilac satin gown */
  ["01428", "vapour-gown-01", "Model in a lilac satin slip gown with crystal scattered from the waist and a sequinned hem."],
  ["01434", "vapour-gown-detail", "Lilac satin slip gown with crystals scattered across the bodice."],

  /* Look F — navy crystal-swirl tuxedo */
  ["01446", "midnight-swirl-01", "Model in a charcoal shawl-collar dinner jacket with metallic swirl embroidery."],
  ["01451", "midnight-swirl-detail", "Close detail of metallic swirl embroidery on a charcoal dinner jacket."],

  /* Look G — navy scalloped sherwani */
  ["01476", "tidemark-detail", "Scalloped metallic embroidery along the hem and cuff of a long navy sherwani."],

  /* Couples */
  ["01454", "duet-01", "Model in a charcoal dinner jacket with metallic swirl embroidery, hand in pocket."],
  ["01488", "duet-02", "Back of a white pinstripe shirt embroidered with a tiger among blue clouds."],
  ["01501", "duet-03", "Close view of a white pinstripe shirt with navy claw-mark embroidery."],

  /* ── 300DPI selects (shoot-02) ── */

  /* Look H — navy pinstripe wrap shirt and split trouser */
  ["01700", "pinstripe-01", "Model standing in a navy pinstripe wrap shirt, sash belt and wide trousers split at the hem with gold buttons."],
  ["01686", "pinstripe-02", "Navy pinstripe wrap shirt with a wide sash belt and gold-buttoned cuffs."],
  ["01720", "pinstripe-03", "Seated model in a navy pinstripe wrap shirt and split trouser with gold buttons."],
  ["01725", "pinstripe-04", "Model seated on a white chair in a navy pinstripe set, the trouser split open to the knee."],
  ["01674", "pinstripe-detail", "Gold buttons running up the split hem of a navy pinstripe trouser, the sash tie hanging beside it."],

  /* Look I — navy shirt with white swirl appliqué */
  ["01620", "swirl-shirt-01", "Model in a navy shirt with white swirl appliqué at the shoulder and hem, worn open with a pearl strand."],
  ["01651", "swirl-shirt-02", "Navy shirt with raised white swirl appliqué at the collar and hem, worn over black trousers."],
  ["01656", "swirl-shirt-detail", "Close detail of white swirl appliqué and raw-edged cuffs on a navy shirt."],

  /* Look J — charcoal asymmetric zip jumpsuit */
  ["01600", "zip-jumpsuit-01", "Model in a sleeveless charcoal jumpsuit with a mandarin collar and an asymmetric zip."],
  ["01613", "zip-jumpsuit-02", "Charcoal jumpsuit with a silver zip curving from collar to hem."],

  /* Look K — checkerboard panel shirt (detail only so far) */
  ["01572", "checker-shirt-detail", "Black shirt with a woven black-and-white checkerboard panel across the chest."],
];

/* 1600 is cut only from frames at least that wide — the 300DPI set. The 72DPI
   frames stop at 810, and an upscaled 1600 would weigh more and add nothing. */
const WIDTHS = [1600, 810, 400];
const widthsFor = (w) => WIDTHS.filter((x) => x < 1600 || w >= 1600);

/**
 * Crops cut from a frame and published as plates of their own.
 *
 * A few garments are in the campaign without ever being its subject — the
 * trousers under the Noir Vine are perfectly well photographed, they are just
 * at the bottom of a frame about a shoulder. Shipping the whole frame as that
 * product's plate shows the wrong garment; shipping a generated wash shows no
 * garment at all. A crop shows the trouser.
 *
 * Box is [x, y, w, h] as PERCENTAGES of the source, so it survives the 300DPI
 * swap without being re-measured.
 */
const CROPS = [
  {
    from: "01538",
    slug: "pleated-trouser-crop",
    box: [25, 55, 50, 45],
    alt: "Black pleated trousers worn under an embroidered bandhgala.",
  },
];

mkdirSync(OUT, { recursive: true });

const available = SRCS.flatMap((d) =>
  readdirSync(d)
    .filter((f) => /\.jpe?g$/i.test(f))
    .map((f) => join(d, f))
);
const find = (num) => available.find((f) => f.includes(`AVI-${num}`));

const manifest = [];
let bytes = 0;

for (const [num, slug, alt] of FRAMES) {
  const file = find(num);
  if (!file) {
    console.warn(`  ✗ ${slug} — no source matching ${num}`);
    continue;
  }

  const src = file;
  const { width, height } = await sharp(src).metadata();

  for (const w of widthsFor(width)) {
    const buf = await sharp(src)
      .resize({ width: w, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toBuffer();
    writeFileSync(join(OUT, `${slug}-${w}.webp`), buf);
    bytes += buf.length;
  }

  /* A 20px WebP, inlined as a data URI and blown up under a blur. It stands in
     while the real plate decodes, so a rail of portraits resolves out of the
     right colours instead of flashing empty boxes. Cheap: ~300 bytes each. */
  const blur = await sharp(src)
    .resize({ width: 20 })
    .webp({ quality: 45 })
    .toBuffer();

  manifest.push({
    slug,
    alt,
    width,
    height,
    blur: `data:image/webp;base64,${blur.toString("base64")}`,
  });

  console.log(`  ✓ ${slug.padEnd(22)} ${width}x${height}`);
}

for (const { from, slug, box, alt } of CROPS) {
  const file = find(from);
  if (!file) {
    console.warn(`  ✗ ${slug} — no source matching ${from}`);
    continue;
  }
  const src = file;
  const meta = await sharp(src).metadata();
  const region = {
    left: Math.round((box[0] / 100) * meta.width),
    top: Math.round((box[1] / 100) * meta.height),
    width: Math.round((box[2] / 100) * meta.width),
    height: Math.round((box[3] / 100) * meta.height),
  };

  for (const w of widthsFor(region.width)) {
    const buf = await sharp(src)
      .extract(region)
      .resize({ width: w, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toBuffer();
    writeFileSync(join(OUT, `${slug}-${w}.webp`), buf);
    bytes += buf.length;
  }

  const blur = await sharp(src).extract(region).resize({ width: 20 }).webp({ quality: 45 }).toBuffer();

  manifest.push({
    slug,
    alt,
    width: region.width,
    height: region.height,
    blur: `data:image/webp;base64,${blur.toString("base64")}`,
  });

  console.log(`  ✂ ${slug.padEnd(22)} ${region.width}x${region.height}  from ${from}`);
}

/* The manifest is generated rather than hand-kept: intrinsic dimensions have to
   match the files exactly or every <img> reserves the wrong box and the page
   shifts as the pictures land. */
const ts = `/**
 * GENERATED by scripts/photos.mjs — do not edit.
 *
 * One record per campaign frame: the intrinsic size (so every <img> can reserve
 * its box and the page never shifts), an alt string written against what is
 * actually in the picture, and a 20px blur placeholder to hold the space in
 * the right colours while the full plate decodes.
 */

export type Photo = {
  slug: string;
  alt: string;
  width: number;
  height: number;
  /** Inlined 20px WebP, scaled up under a blur until the real plate arrives. */
  blur: string;
};

export const PHOTOS: Record<string, Photo> = ${JSON.stringify(
  Object.fromEntries(manifest.map((m) => [m.slug, m])),
  null,
  2
)};

/** Full-size plate, 810w. */
export const photo = (slug: string) => \`/img/campaign/\${slug}-810.webp\`;

/** Small plate, 400w — rail plates, grid cards, thumbnails. */
export const photoSm = (slug: string) => \`/img/campaign/\${slug}-400.webp\`;

/**
 * srcset for anything that renders between the two.
 *
 * Paired with a \`sizes\` that states the rendered width, this lets a 300px rail
 * plate take the 400 and a full-bleed hero pane take the 810, rather than every
 * surface paying for the largest.
 */
export const photoSet = (slug: string) =>
  \`\${photoSm(slug)} 400w, \${photo(slug)} 810w\` +
  ((PHOTOS[slug]?.width ?? 0) >= 1600 ? \`, /img/campaign/\${slug}-1600.webp 1600w\` : "");

export const blurOf = (slug: string) => PHOTOS[slug]?.blur;

/**
 * The same two helpers, keyed by a catalogue \`image\` PATH rather than a slug.
 *
 * The catalogue stores paths, and half of it is still on generated SVG — which
 * needs neither a placeholder nor a second size, being a couple of KB and
 * resolution-independent. Both return undefined for anything that is not a
 * campaign plate, so a caller hands the result straight to \`style\` or
 * \`srcSet\` without branching.
 */
export const blurForImage = (src: string) => {
  const m = /\\/img\\/campaign\\/(.+)-810\\.webp$/.exec(src);
  const b = m && PHOTOS[m[1]]?.blur;
  return b ? \`url("\${b}")\` : undefined;
};

/** True for a campaign photograph, false for a generated plate. */
export const isPhoto = (src: string) => src.startsWith("/img/campaign/");

export const setForImage = (src: string) => {
  const m = /\\/img\\/campaign\\/(.+)-810\\.webp$/.exec(src);
  return m ? photoSet(m[1]) : undefined;
};
`;

writeFileSync(join(ROOT, "lib", "photos.ts"), ts);

console.log(
  `\n  ${manifest.length} frames · ${WIDTHS.length} widths · ${(bytes / 1024 / 1024).toFixed(2)} MB total`
);
console.log("  → public/img/campaign/ + lib/photos.ts\n");
