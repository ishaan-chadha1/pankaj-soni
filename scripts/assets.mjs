/**
 * Generates every image the PANKAJ SONI store uses, as original SVG.
 *
 * Nothing here is scraped or traced from another brand — the lenses and
 * campaign plates are all drawn from primitives, which also means they stay
 * a few KB each and never 404. Deliberately text-free: SVGs loaded through
 * <img> can't reach a webfont, so all typography lives in the HTML on top.
 *
 * Everything is composed on a LUMINOUS PALE GROUND, so the product shots read
 * like catalogue photography on paper and the campaign plates stay airy. One
 * asset set therefore sits correctly under all six light themes — the theme
 * accent is applied in CSS with a multiply tint rather than by generating six
 * variants of every file.
 *
 *   npm run assets
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { deflateSync, crc32 as zlibCrc32 } from "node:zlib";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "public", "img");

const svg = (w, h, body) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" fill="none">${body}</svg>`;

/** Fine paper grain. Soft-light keeps it from muddying a pale ground. */
const grain = (id, amount = 0.32, freq = 0.9) => `
<filter id="${id}" x="-5%" y="-5%" width="110%" height="110%">
  <feTurbulence type="fractalNoise" baseFrequency="${freq}" numOctaves="4" seed="${
    (id.length * 13) % 91
  }" result="n"/>
  <feColorMatrix in="n" type="saturate" values="0" result="d"/>
  <feComponentTransfer in="d" result="g">
    <feFuncA type="linear" slope="${amount}"/>
  </feComponentTransfer>
  <feBlend in="SourceGraphic" in2="g" mode="soft-light"/>
</filter>`;

const blur = (id, sd) =>
  `<filter id="${id}" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="${sd}"/></filter>`;

/* Paper grounds — never pure white, always a warm or cool tint. */
const PAPER = {
  warm: ["#fdfbf7", "#f2ece1"],
  cool: ["#fbfcfd", "#e9edf1"],
  blush: ["#fdf9f8", "#f4e6e4"],
  sand: ["#fdfaf5", "#efe4d5"],
  sage: ["#fafcfa", "#e6ede6"],
};

/** The pale ground every object sits on, plus a soft key light behind it. */
const ground = (tone = "warm", glow = "#c9a961") => {
  const [a, b] = PAPER[tone] ?? PAPER.warm;
  return `
  <linearGradient id="pg" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="${a}"/>
    <stop offset="1" stop-color="${b}"/>
  </linearGradient>
  <radialGradient id="key" cx=".5" cy=".38" r=".6">
    <stop offset="0" stop-color="#ffffff" stop-opacity=".95"/>
    <stop offset=".6" stop-color="${glow}" stop-opacity=".10"/>
    <stop offset="1" stop-color="${glow}" stop-opacity="0"/>
  </radialGradient>`;
};

/* ────────────────────────────  EYEWEAR  ──────────────────────────── */

function eyewear({ lens, lensDeep, frame = "#2a2a2c", shape = "aviator", tone = "cool" }) {
  const W = 900;
  const H = 620;
  const cy = 300;

  const lensPath = {
    aviator: (x) =>
      `M${x - 132} ${cy - 74} h264 a26 26 0 0 1 25 30 l-14 74 a132 132 0 0 1 -258 0 l-14 -74 a26 26 0 0 1 25 -30 z`,
    square: (x) =>
      `M${x - 138} ${cy - 86} h276 a18 18 0 0 1 18 18 v128 a18 18 0 0 1 -18 18 h-276 a18 18 0 0 1 -18 -18 v-128 a18 18 0 0 1 18 -18 z`,
    round: (x) => `M${x} ${cy - 96} a96 96 0 1 1 -0.1 0 z`,
    cat: (x) =>
      `M${x - 140} ${cy - 58} q40 -46 148 -40 q120 6 132 44 q10 84 -70 116 q-84 30 -160 -14 q-58 -34 -50 -106 z`,
  }[shape];

  const L = 262;
  const R = 638;

  return svg(
    W,
    H,
    `
<defs>
  ${ground(tone, lens)}
  ${grain("eg", 0.22, 1.1)}
  ${blur("eb", 8)}
  ${blur("es", 16)}
  <linearGradient id="lens" x1="0" y1="0" x2=".7" y2="1">
    <stop offset="0"   stop-color="#ffffff" stop-opacity=".72"/>
    <stop offset=".3"  stop-color="${lens}" stop-opacity=".72"/>
    <stop offset=".8"  stop-color="${lensDeep}" stop-opacity=".82"/>
    <stop offset="1"   stop-color="${lensDeep}" stop-opacity=".92"/>
  </linearGradient>
  <linearGradient id="fr" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="${frame}" stop-opacity=".82"/>
    <stop offset=".5" stop-color="${frame}"/>
    <stop offset="1" stop-color="${frame}" stop-opacity=".9"/>
  </linearGradient>
</defs>

<rect width="${W}" height="${H}" fill="url(#pg)"/>
<rect width="${W}" height="${H}" fill="url(#key)"/>
<ellipse cx="458" cy="${cy + 172}" rx="250" ry="20" fill="#6d6250" opacity=".22" filter="url(#es)"/>

<g filter="url(#eg)">
  <path d="M${L - 150} ${cy - 46} q-90 6 -128 58" stroke="url(#fr)" stroke-width="13" stroke-linecap="round"/>
  <path d="M${R + 150} ${cy - 46} q90 6 128 58" stroke="url(#fr)" stroke-width="13" stroke-linecap="round"/>
  <path d="M${L + 132} ${cy - 52} q68 -30 ${R - L - 264} 0" stroke="url(#fr)" stroke-width="12" stroke-linecap="round"/>

  <path d="${lensPath(L)}" fill="url(#lens)" stroke="url(#fr)" stroke-width="11"/>
  <path d="${lensPath(R)}" fill="url(#lens)" stroke="url(#fr)" stroke-width="11"/>

  <path d="M${L - 96} ${cy + 34} l104 -104" stroke="#fff" stroke-width="18" opacity=".5" stroke-linecap="round" filter="url(#eb)"/>
  <path d="M${L - 50} ${cy + 54} l104 -104" stroke="#fff" stroke-width="7"  opacity=".38" stroke-linecap="round" filter="url(#eb)"/>
  <path d="M${R - 96} ${cy + 34} l104 -104" stroke="#fff" stroke-width="18" opacity=".5" stroke-linecap="round" filter="url(#eb)"/>
  <path d="M${R - 50} ${cy + 54} l104 -104" stroke="#fff" stroke-width="7"  opacity=".38" stroke-linecap="round" filter="url(#eb)"/>
</g>
`
  );
}

/* ────────────────────────────  CAMPAIGN PLATES  ──────────────────────────── */

/**
 * Airy editorial washes — light through linen. Kept pale and low-contrast so
 * display type sits over them without a heavy scrim, and so one plate works
 * under every theme.
 */
function plate({ w, h, a, b, hi, seed = 3, mode = "drape" }) {
  const forms =
    mode === "drape"
      ? `
    <path d="M${-w * 0.1} ${h * 0.95} C ${w * 0.18} ${h * 0.52}, ${w * 0.3} ${h * 0.88}, ${
          w * 0.52
        } ${h * 0.46} S ${w * 0.86} ${h * 0.2}, ${w * 1.1} ${h * 0.58} L ${w * 1.1} ${h * 1.1} L ${
          -w * 0.1
        } ${h * 1.1} Z" fill="${b}" opacity=".55"/>
    <path d="M${-w * 0.1} ${h * 1.02} C ${w * 0.24} ${h * 0.7}, ${w * 0.44} ${h * 1.0}, ${
          w * 0.66
        } ${h * 0.66} S ${w * 0.94} ${h * 0.46}, ${w * 1.1} ${h * 0.78} L ${w * 1.1} ${h * 1.12} L ${
          -w * 0.1
        } ${h * 1.12} Z" fill="#ffffff" opacity=".45"/>`
      : mode === "shaft"
        ? `
    <g>
      <path d="M${w * 0.1} ${-h * 0.1} L ${w * 0.46} ${-h * 0.1} L ${w * 0.2} ${h * 1.1} L ${
        -w * 0.06
      } ${h * 1.1} Z" fill="#ffffff" opacity=".55"/>
      <path d="M${w * 0.52} ${-h * 0.1} L ${w * 0.7} ${-h * 0.1} L ${w * 0.5} ${h * 1.1} L ${
        w * 0.34
      } ${h * 1.1} Z" fill="${hi}" opacity=".16"/>
      <path d="M${w * 0.82} ${-h * 0.1} L ${w * 1.02} ${-h * 0.1} L ${w * 0.86} ${h * 1.1} L ${
        w * 0.68
      } ${h * 1.1} Z" fill="#ffffff" opacity=".38"/>
    </g>`
        : `
    <ellipse cx="${w * 0.62}" cy="${h * 0.42}" rx="${w * 0.36}" ry="${h * 0.44}" fill="#ffffff" opacity=".5"/>
    <ellipse cx="${w * 0.3}" cy="${h * 0.68}" rx="${w * 0.32}" ry="${h * 0.32}" fill="${b}" opacity=".42"/>`;

  return svg(
    w,
    h,
    `
<defs>
  ${grain(`pg${seed}`, 0.4, 0.8)}
  ${blur(`pb${seed}`, Math.round(w * 0.055))}
  <linearGradient id="bg${seed}" x1="0" y1="0" x2=".55" y2="1">
    <stop offset="0" stop-color="${a}"/>
    <stop offset="1" stop-color="${b}"/>
  </linearGradient>
  <radialGradient id="key${seed}" cx=".6" cy=".28" r=".72">
    <stop offset="0" stop-color="#ffffff" stop-opacity=".92"/>
    <stop offset=".5" stop-color="#ffffff" stop-opacity=".24"/>
    <stop offset="1" stop-color="${hi}" stop-opacity=".1"/>
  </radialGradient>
  <!-- a whisper of edge shading, so the plate has a body rather than reading flat -->
  <radialGradient id="vig${seed}" cx=".5" cy=".48" r=".76">
    <stop offset=".5" stop-color="#8a7f6b" stop-opacity="0"/>
    <stop offset="1" stop-color="#8a7f6b" stop-opacity=".2"/>
  </radialGradient>
</defs>

<g filter="url(#pg${seed})">
  <rect width="${w}" height="${h}" fill="url(#bg${seed})"/>
  <g filter="url(#pb${seed})">${forms}</g>
  <rect width="${w}" height="${h}" fill="url(#key${seed})"/>
</g>
<rect width="${w}" height="${h}" fill="url(#vig${seed})"/>
`
  );
}

/* ────────────────────────────  WRITE SVG  ──────────────────────────── */

mkdirSync(OUT, { recursive: true });
const write = (name, content) => {
  writeFileSync(join(OUT, name), content);
  return name;
};

const glasses = [
  ["monolith", { lens: "#5c5c62", lensDeep: "#2c2c30", shape: "square", frame: "#2a2a2c", tone: "cool" }],
  ["meridian", { lens: "#a07c46", lensDeep: "#5e4522", shape: "aviator", frame: "#a4884e", tone: "warm" }],
  ["oracle", { lens: "#5a7480", lensDeep: "#2b3d46", shape: "round", frame: "#2e2e30", tone: "cool" }],
  ["vesper", { lens: "#8a5a68", lensDeep: "#4a2632", shape: "cat", frame: "#2a2224", tone: "blush" }],
];
for (const [slug, cfg] of glasses) write(`e-${slug}.svg`, eyewear(cfg));

/* Pale washes. Wide ones are heroes, tall ones editorial columns. */
const plates = [
  ["hero-01", { w: 2000, h: 1125, a: "#fdfaf4", b: "#e8dcc6", hi: "#c9a961", seed: 1, mode: "shaft" }],
  ["hero-02", { w: 2000, h: 1125, a: "#fbfcfd", b: "#dde5ea", hi: "#8fa6b4", seed: 2, mode: "drape" }],
  ["hero-03", { w: 2000, h: 1125, a: "#fdf8f7", b: "#f0dcd9", hi: "#c58592", seed: 3, mode: "drape" }],
  ["ed-01", { w: 1200, h: 1600, a: "#fdfaf4", b: "#ece0ca", hi: "#c9a961", seed: 4, mode: "drape" }],
  ["ed-02", { w: 1200, h: 1600, a: "#fbfcfd", b: "#e0e7ec", hi: "#94a8b6", seed: 5, mode: "shaft" }],
  ["ed-03", { w: 1200, h: 1600, a: "#fdf8f8", b: "#f2dfdc", hi: "#c08b96", seed: 6, mode: "orbit" }],
  ["cat-outerwear", { w: 1600, h: 900, a: "#fdfaf4", b: "#e6ddcc", hi: "#a8926e", seed: 7, mode: "drape" }],
  ["cat-leather", { w: 1600, h: 900, a: "#fdf9f4", b: "#e8d9c4", hi: "#a67c4e", seed: 8, mode: "orbit" }],
  ["cat-eyewear", { w: 1600, h: 900, a: "#fbfcfd", b: "#dfe6eb", hi: "#94a5b2", seed: 9, mode: "shaft" }],
  ["cat-women", { w: 1600, h: 900, a: "#fdf9f8", b: "#eddfe4", hi: "#b894a4", seed: 10, mode: "drape" }],
  ["cat-men", { w: 1600, h: 900, a: "#fbfbfc", b: "#dfe1e6", hi: "#9298a6", seed: 11, mode: "shaft" }],
  ["cat-gifts", { w: 1600, h: 900, a: "#fdfaf5", b: "#f0e2cc", hi: "#cbb078", seed: 12, mode: "orbit" }],
];
for (const [slug, cfg] of plates) write(`p-${slug}.svg`, plate(cfg));

write("paper.svg", svg(64, 64, `<rect width="64" height="64" fill="#faf7f1"/>`));

/* ────────────────────────────  OPEN GRAPH PLATE  ──────────────────────────── */

/**
 * Social cards must be raster — Twitter, Slack and iMessage all ignore SVG. So
 * the OG plate is encoded as a real PNG here, by hand, with no image
 * dependency: raw RGB scanlines, deflated, wrapped in IHDR/IDAT/IEND.
 *
 * It carries no text; the headline and description travel in the meta tags,
 * and a wordmark baked into a bitmap would need a font this script cannot load.
 */
function png(width, height, shade) {
  // Each scanline is prefixed with a filter byte (0 = None).
  const raw = Buffer.alloc(height * (width * 3 + 1));
  let o = 0;
  for (let y = 0; y < height; y++) {
    raw[o++] = 0;
    for (let x = 0; x < width; x++) {
      const [r, g, b] = shade(x / width, y / height, x, y);
      raw[o++] = Math.max(0, Math.min(255, r | 0));
      raw[o++] = Math.max(0, Math.min(255, g | 0));
      raw[o++] = Math.max(0, Math.min(255, b | 0));
    }
  }

  const chunk = (type, data) => {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length);
    const body = Buffer.concat([Buffer.from(type, "ascii"), data]);
    const crc = Buffer.alloc(4);
    crc.writeUInt32BE(zlibCrc32(body) >>> 0);
    return Buffer.concat([len, body, crc]);
  };

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 2; // colour type 2 = truecolour RGB
  ihdr[10] = 0; // deflate
  ihdr[11] = 0; // adaptive filtering
  ihdr[12] = 0; // no interlace

  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

const smooth = (e0, e1, v) => {
  const t = Math.max(0, Math.min(1, (v - e0) / (e1 - e0)));
  return t * t * (3 - 2 * t);
};

writeFileSync(
  join(OUT, "og.png"),
  png(1200, 630, (u, v) => {
    // warm paper, drifting very slightly deeper across the diagonal
    const d = u * 0.7 + v * 0.3;
    let r = 253 - d * 16;
    let g = 250 - d * 22;
    let b = 244 - d * 34;

    // key light, upper right
    const kd = Math.hypot(u - 0.66, v - 0.3);
    const key = Math.exp(-kd * 2.4) * 0.5;
    r += key * 6;
    g += key * 4;
    b -= key * 6;

    // three pale shafts raking across the frame
    for (const [c, w, i] of [
      [0.22, 0.1, 0.5],
      [0.52, 0.07, 0.32],
      [0.83, 0.05, 0.22],
    ]) {
      const sx = u + (v - 0.5) * 0.26;
      const band = 1 - smooth(0, w, Math.abs(sx - c));
      const fall = 1 - v * 0.4;
      r += band * i * fall * 10;
      g += band * i * fall * 8;
      b += band * i * fall * 2;
    }

    // gentle edge shading so the card is not a flat rectangle
    const vg = 1 - Math.hypot(u - 0.5, v - 0.5) * 0.14;
    r *= vg;
    g *= vg;
    b *= vg;

    // a hairline gold rule, echoing the frame on the site
    const inset = u > 0.055 && u < 0.945 && v > 0.1 && v < 0.9;
    const edge =
      Math.abs(u - 0.055) < 0.0016 ||
      Math.abs(u - 0.945) < 0.0016 ||
      Math.abs(v - 0.1) < 0.003 ||
      Math.abs(v - 0.9) < 0.003;
    if (inset && edge) {
      r = 201;
      g = 169;
      b = 97;
    }

    // No grain: at card size it is invisible, and per-pixel noise costs roughly
    // a megabyte of PNG because nothing downstream can compress it.
    return [r, g, b];
  })
);

console.log(
  `wrote ${glasses.length + plates.length + 1} light SVG assets + og.png to public/img/`
);
