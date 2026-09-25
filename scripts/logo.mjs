/**
 * Builds the house mark from the logo master.
 *
 *   npm run logo
 *
 * THE MASTER IS A RASTER. What arrived as `Logo.svg` is a 1600x3200 PNG
 * wrapped in an SVG tag (a Photoshop export) — no paths at all — and the PNG
 * is the same picture. Until a true vector export comes out of the CorelDRAW
 * file, this traces one: the alpha channel is the shape, so it is traced as
 * a silhouette with potrace and the gold is put back afterwards as a
 * gradient, using colours sampled from the master itself.
 *
 * Output:
 *   lib/brand.ts              path data + gold stops, for inline <svg> in React
 *   public/brand/monogram.svg the PS mark alone, gold
 *   public/brand/logo.svg     mark + name, gold
 *   app/icon.svg              favicon (the mark)
 *   app/apple-icon.png        home-screen icon, mark on ink
 *
 * When the real vector lands: point SRC at it and replace the trace with its
 * paths — nothing that consumes lib/brand.ts has to change.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import potrace from "potrace";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SRC = join(ROOT, "media-in", "logo", "Logo (2).png");
const BRAND = join(ROOT, "public", "brand");
mkdirSync(BRAND, { recursive: true });

/* Traced at twice the master's size: potrace fits curves to pixel edges, and
   a lanczos upscale of the alpha gives it smooth ramps to fit instead of
   stairs, which is most of the difference in the lettering. */
const SCALE = 2;

const trim = await sharp(SRC).trim({ threshold: 1 }).toBuffer({ resolveWithObject: true });
const W = trim.info.width;
const H = trim.info.height;

// Alpha as a single channel; row coverage tells mark from name.
const alpha = await sharp(trim.data).extractChannel(3).raw().toBuffer();
const rowFill = Array.from({ length: H }, (_, y) => {
  let n = 0;
  for (let x = 0; x < W; x++) if (alpha[y * W + x] > 96) n++;
  return n;
});

// The longest run of empty rows is the gap between the circle and the name.
let best = { start: 0, len: 0 };
for (let y = 0, run = 0; y < H; y++) {
  if (rowFill[y] === 0) {
    run++;
    if (run > best.len) best = { start: y - run + 1, len: run };
  } else run = 0;
}
const split = best.start + Math.floor(best.len / 2);
console.log(`  master ${W}x${H} · gap ${best.len}px at y=${best.start} → split at ${split}`);

/**
 * Crop the region to its ink, then trace its alpha (dark shape on white).
 *
 * The box is read from the ALPHA, not with sharp's trim: the master's
 * transparent pixels still carry stray RGB, which trim treats as content, so
 * the mark came back the full width of the lockup.
 */
async function traceRegion(top, height) {
  let x0 = W, x1 = -1, y0 = height, y1 = -1;
  for (let y = 0; y < height; y++)
    for (let x = 0; x < W; x++)
      if (alpha[(top + y) * W + x] > 24) {
        if (x < x0) x0 = x;
        if (x > x1) x1 = x;
        if (y < y0) y0 = y;
        if (y > y1) y1 = y;
      }
  const w = x1 - x0 + 1;
  const h = y1 - y0 + 1;
  const region = { data: await sharp(trim.data).extract({ left: x0, top: top + y0, width: w, height: h }).png().toBuffer() };
  const mask = await sharp(region.data)
    .extractChannel(3)
    .resize(w * SCALE, h * SCALE, { kernel: "lanczos3" })
    .negate()
    .png()
    .toBuffer();

  const d = await new Promise((resolve, reject) => {
    const p = new potrace.Potrace({ threshold: 128, turdSize: 6, optTolerance: 0.25, alphaMax: 1 });
    p.loadImage(mask, (err) => {
      if (err) return reject(err);
      const tag = p.getPathTag();
      resolve(tag.match(/ d="([^"]+)"/)[1]);
    });
  });
  return { d, w: w * SCALE, h: h * SCALE };
}

const mark = await traceRegion(0, split);
const name = await traceRegion(split, H - split);

/* The gold, sampled from the master: the opaque pixels sorted by luminance,
   read at the 8th, 50th and 92nd percentiles. Three stops is what the
   original's sweep actually is — a pale highlight, a body, a shadow. */
const { data: px } = await sharp(trim.data).raw().toBuffer({ resolveWithObject: true });
const golds = [];
for (let i = 0; i < W * H; i += 7) {
  if (px[i * 4 + 3] < 250) continue;
  const [r, g, b] = [px[i * 4], px[i * 4 + 1], px[i * 4 + 2]];
  golds.push({ r, g, b, l: 0.2126 * r + 0.7152 * g + 0.0722 * b });
}
golds.sort((a, b) => a.l - b.l);
const at = (q) => {
  const c = golds[Math.floor(q * (golds.length - 1))];
  return `#${[c.r, c.g, c.b].map((v) => v.toString(16).padStart(2, "0")).join("")}`;
};
const GOLD = { shadow: at(0.08), body: at(0.5), light: at(0.92) };
console.log(`  gold ${GOLD.shadow} · ${GOLD.body} · ${GOLD.light}`);

const gradient = (id) =>
  `<linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1">` +
  `<stop offset="0" stop-color="${GOLD.light}"/>` +
  `<stop offset=".45" stop-color="${GOLD.body}"/>` +
  `<stop offset=".62" stop-color="${GOLD.shadow}"/>` +
  `<stop offset="1" stop-color="${GOLD.light}"/>` +
  `</linearGradient>`;

// Full lockup: the mark centred over the name, with the master's own spacing.
const gapPx = best.len * SCALE;
const lockW = Math.max(mark.w, name.w);
const lockH = mark.h + gapPx + name.h;
const markX = (lockW - mark.w) / 2;
const nameX = (lockW - name.w) / 2;

const monoSvg =
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${mark.w} ${mark.h}"><defs>${gradient("g")}</defs>` +
  `<path fill="url(#g)" fill-rule="evenodd" d="${mark.d}"/></svg>`;
const logoSvg =
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${lockW} ${lockH}"><defs>${gradient("g")}</defs>` +
  `<path fill="url(#g)" fill-rule="evenodd" transform="translate(${markX} 0)" d="${mark.d}"/>` +
  `<path fill="url(#g)" fill-rule="evenodd" transform="translate(${nameX} ${mark.h + gapPx})" d="${name.d}"/></svg>`;

writeFileSync(join(BRAND, "monogram.svg"), monoSvg);
writeFileSync(join(BRAND, "logo.svg"), logoSvg);

/* Favicon: the mark alone, padded so the circle is not cropped by the tab's
   rounding. SVG favicons scale to every density from one file. */
const pad = Math.round(mark.w * 0.06);
writeFileSync(
  join(ROOT, "app", "icon.svg"),
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${-pad} ${-pad} ${mark.w + pad * 2} ${mark.h + pad * 2}"><defs>${gradient("g")}</defs>` +
    `<path fill="url(#g)" fill-rule="evenodd" d="${mark.d}"/></svg>`
);

// Home-screen icon: iOS will not take an SVG, and wants an opaque square.
const tile = 180;
const inner = Math.round(tile * 0.62);
const markPng = await sharp(Buffer.from(monoSvg)).resize(inner, inner, { fit: "inside" }).png().toBuffer();
await sharp({ create: { width: tile, height: tile, channels: 4, background: "#14120f" } })
  .composite([{ input: markPng, gravity: "center" }])
  .png()
  .toFile(join(ROOT, "app", "apple-icon.png"));

writeFileSync(
  join(ROOT, "lib", "brand.ts"),
  `/**
 * GENERATED by scripts/logo.mjs — do not edit.
 *
 * The house mark as path data, traced from the logo master, and the three
 * golds sampled from it. Consumed by <Monogram/> and <Logo/> so the mark can
 * be drawn inline, coloured by gradient, and animated.
 *
 * Draw with fill-rule="evenodd": potrace emits counters (the bowl of the P,
 * the O) as inner subpaths, and the default nonzero rule fills them solid.
 */

export const GOLD = ${JSON.stringify(GOLD)} as const;

export const MARK = ${JSON.stringify({ w: mark.w, h: mark.h, d: mark.d })} as const;

export const NAME = ${JSON.stringify({ w: name.w, h: name.h, d: name.d })} as const;

/** Gap between the mark and the name in the lockup, in the same units. */
export const LOCKUP_GAP = ${gapPx};
`
);

const kb = (s) => `${(Buffer.byteLength(s) / 1024).toFixed(1)}KB`;
console.log(`  mark ${mark.w}x${mark.h} (${kb(mark.d)}) · name ${name.w}x${name.h} (${kb(name.d)})`);
console.log("  → lib/brand.ts, public/brand/{monogram,logo}.svg, app/icon.svg, app/apple-icon.png\n");
