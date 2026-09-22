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
const SRC = join(ROOT, "media-in", "shoot-01");
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
  ["01259", "noir-vine-01", "Model in a black bandhgala with silver crystal vine embroidery across the shoulder and sleeve."],
  ["01271", "noir-vine-02", "Close study of the crystal vine embroidery on the shoulder of a black bandhgala."],

  /* Look B — black strapless column gown */
  ["01320", "nocturne-gown-01", "Model in a black strapless column gown with a crystal-set bodice and peplum hem."],
  ["01309", "nocturne-gown-02", "Black strapless gown with crystal beading at the bust and waist."],
  ["01311", "nocturne-gown-03", "Full-length black column gown with a crystal peplum."],
  ["01294", "nocturne-gown-04", "Detail of the crystal-set neckline on a black strapless gown."],

  /* Look C — black tuxedo, silver crystal panels */
  ["01374", "silver-seam-01", "Model in a black shawl-collar dinner jacket with crystal-encrusted front panels."],
  ["01367", "silver-seam-02", "Black dinner jacket with silver crystal panelling, worn open over a pintucked shirt."],
  ["01358", "silver-seam-detail", "Close detail of hand-set crystal panelling on a black shawl-collar dinner jacket."],

  /* Look D — circle-embroidered bandhgala */
  ["01418", "orbit-01", "Model in a black bandhgala scattered with embroidered circles in navy and crystal."],
  ["01417", "orbit-02", "Black bandhgala with circular embroidery across the chest and sleeve."],
  ["01415", "orbit-03", "Seated model in a black circle-embroidered bandhgala."],

  /* Look E — lilac satin gown */
  ["01428", "vapour-gown-01", "Model in a lilac satin slip gown with a sequinned hem."],
  ["01434", "vapour-gown-detail", "Detail of graduated sequin work on the bodice of a lilac satin gown."],

  /* Look F — navy crystal-swirl tuxedo */
  ["01446", "midnight-swirl-01", "Model in a navy dinner jacket with crystal swirl embroidery on the shoulders."],
  ["01451", "midnight-swirl-detail", "Close detail of crystal swirl embroidery on a navy dinner jacket."],

  /* Look G — navy scalloped sherwani */
  ["01476", "tidemark-detail", "Scalloped metallic embroidery along the hem and cuff of a long navy sherwani."],

  /* Couples */
  ["01244", "duet-01", "A couple in black eveningwear — an embroidered bandhgala and a crystal-set gown."],
  ["01392", "duet-02", "A couple — a man seated in a circle-embroidered bandhgala, a woman standing in a lilac satin gown."],
  ["01389", "duet-03", "A seated man in an embroidered bandhgala with a woman in a lilac satin gown behind him."],
];

const WIDTHS = [810, 400];

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
    from: "01259",
    slug: "pleated-trouser-crop",
    box: [13, 55, 45, 45],
    alt: "Black pleated trousers worn under an embroidered bandhgala.",
  },
];

mkdirSync(OUT, { recursive: true });

const available = readdirSync(SRC).filter((f) => /\.jpe?g$/i.test(f));
const find = (num) => available.find((f) => f.includes(num));

const manifest = [];
let bytes = 0;

for (const [num, slug, alt] of FRAMES) {
  const file = find(num);
  if (!file) {
    console.warn(`  ✗ ${slug} — no source matching ${num}`);
    continue;
  }

  const src = join(SRC, file);
  const { width, height } = await sharp(src).metadata();

  for (const w of WIDTHS) {
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
  const src = join(SRC, file);
  const meta = await sharp(src).metadata();
  const region = {
    left: Math.round((box[0] / 100) * meta.width),
    top: Math.round((box[1] / 100) * meta.height),
    width: Math.round((box[2] / 100) * meta.width),
    height: Math.round((box[3] / 100) * meta.height),
  };

  for (const w of WIDTHS) {
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
  \`\${photoSm(slug)} 400w, \${photo(slug)} 810w\`;

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

export const setForImage = (src: string) =>
  src.endsWith("-810.webp")
    ? \`\${src.replace("-810.webp", "-400.webp")} 400w, \${src} 810w\`
    : undefined;
`;

writeFileSync(join(ROOT, "lib", "photos.ts"), ts);

console.log(
  `\n  ${manifest.length} frames · ${WIDTHS.length} widths · ${(bytes / 1024 / 1024).toFixed(2)} MB total`
);
console.log("  → public/img/campaign/ + lib/photos.ts\n");
