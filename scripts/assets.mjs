/**
 * Generates every image the PANKAJ SONI store uses, as original SVG.
 *
 * Nothing here is scraped or traced from another brand — the flacons, lenses
 * and campaign plates are all drawn from primitives, which also means they stay
 * a few KB each and never 404. Deliberately text-free: SVGs loaded through
 * <img> can't reach a webfont, so all typography lives in the HTML on top.
 *
 *   node scripts/assets.mjs
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { deflateSync, crc32 as zlibCrc32 } from "node:zlib";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "public", "img");

const svg = (w, h, body) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" fill="none">${body}</svg>`;

/** Film grain + a soft bloom, reused by every plate. */
const grain = (id, amount = 0.55, freq = 0.8) => `
<filter id="${id}" x="-5%" y="-5%" width="110%" height="110%">
  <feTurbulence type="fractalNoise" baseFrequency="${freq}" numOctaves="4" seed="${
    (id.length * 7) % 97
  }" result="n"/>
  <feColorMatrix in="n" type="saturate" values="0" result="d"/>
  <feComponentTransfer in="d" result="g">
    <feFuncA type="linear" slope="${amount}"/>
  </feComponentTransfer>
  <feBlend in="SourceGraphic" in2="g" mode="overlay"/>
</filter>`;

const softLight = (id, blur) =>
  `<filter id="${id}" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="${blur}"/></filter>`;

/* ────────────────────────────  FLACONS  ──────────────────────────── */

/**
 * A rectangular couture flacon. `shape` swaps the silhouette so the eight
 * fragrances don't read as one bottle in eight colours.
 */
function flacon({ liquid, liquidDeep, shape = "slab", metal = "gold" }) {
  const W = 900;
  const H = 1200;

  const metals = {
    gold: ["#5c421a", "#c9a961", "#f6e9c6", "#b8964e", "#6b4f1d"],
    silver: ["#4a4d52", "#b9bec6", "#f2f4f7", "#9aa0a8", "#55585d"],
    onyx: ["#131313", "#3d3d3d", "#6f6f6f", "#2a2a2a", "#0c0c0c"],
  };
  const m = metals[metal] ?? metals.gold;

  // Silhouette control points: [bodyTop, bodyW, shoulder, capW, capH, radius]
  const S = {
    slab: { top: 330, bw: 470, capW: 210, capH: 132, r: 10, neck: 66 },
    tower: { top: 250, bw: 360, capW: 176, capH: 178, r: 6, neck: 82 },
    orb: { top: 380, bw: 520, capW: 190, capH: 118, r: 190, neck: 58 },
    facet: { top: 300, bw: 440, capW: 232, capH: 120, r: 4, neck: 72 },
  }[shape];

  const cx = W / 2;
  const bodyX = cx - S.bw / 2;
  const bodyH = H - 150 - S.top;
  const capX = cx - S.capW / 2;
  const neckY = S.top - S.neck;

  return svg(
    W,
    H,
    `
<defs>
  ${grain("fg", 0.4, 0.9)}
  ${softLight("blurA", 38)}
  ${softLight("blurB", 14)}

  <linearGradient id="glass" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0"    stop-color="#ffffff" stop-opacity=".50"/>
    <stop offset=".10"  stop-color="${liquid}" stop-opacity=".92"/>
    <stop offset=".42"  stop-color="${liquidDeep}"/>
    <stop offset=".72"  stop-color="${liquid}"/>
    <stop offset=".93"  stop-color="#ffffff" stop-opacity=".38"/>
    <stop offset="1"    stop-color="${liquidDeep}" stop-opacity=".8"/>
  </linearGradient>

  <linearGradient id="depth" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0"   stop-color="#ffffff" stop-opacity=".22"/>
    <stop offset=".35" stop-color="#ffffff" stop-opacity="0"/>
    <stop offset=".82" stop-color="#000000" stop-opacity=".30"/>
    <stop offset="1"   stop-color="#000000" stop-opacity=".52"/>
  </linearGradient>

  <linearGradient id="metal" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0"   stop-color="${m[0]}"/>
    <stop offset=".22" stop-color="${m[1]}"/>
    <stop offset=".44" stop-color="${m[2]}"/>
    <stop offset=".68" stop-color="${m[3]}"/>
    <stop offset="1"   stop-color="${m[4]}"/>
  </linearGradient>

  <radialGradient id="floor" cx=".5" cy=".5" r=".5">
    <stop offset="0" stop-color="#000" stop-opacity=".55"/>
    <stop offset="1" stop-color="#000" stop-opacity="0"/>
  </radialGradient>

  <radialGradient id="amb" cx=".5" cy=".38" r=".62">
    <stop offset="0" stop-color="${liquid}" stop-opacity=".26"/>
    <stop offset="1" stop-color="${liquid}" stop-opacity="0"/>
  </radialGradient>
</defs>

<!-- ambient halo so the bottle sits in light rather than on a flat field -->
<rect width="${W}" height="${H}" fill="url(#amb)"/>

<!-- contact shadow -->
<ellipse cx="${cx}" cy="${H - 132}" rx="${S.bw * 0.62}" ry="34" fill="url(#floor)"/>

<g filter="url(#fg)">
  <!-- neck -->
  <rect x="${cx - S.capW * 0.30}" y="${neckY}" width="${S.capW * 0.60}" height="${
      S.neck + 24
    }" fill="url(#glass)" opacity=".9"/>

  <!-- body -->
  <rect x="${bodyX}" y="${S.top}" width="${S.bw}" height="${bodyH}" rx="${S.r}" fill="url(#glass)"/>
  <rect x="${bodyX}" y="${S.top}" width="${S.bw}" height="${bodyH}" rx="${S.r}" fill="url(#depth)"/>

  <!-- liquid meniscus: a brighter band where the fill line sits -->
  <rect x="${bodyX + 10}" y="${S.top + bodyH * 0.20}" width="${S.bw - 20}" height="3"
        fill="#ffffff" opacity=".20"/>

  <!-- left specular column -->
  <rect x="${bodyX + S.bw * 0.075}" y="${S.top + 34}" width="${S.bw * 0.075}" height="${
      bodyH - 96
    }" rx="${S.bw * 0.037}" fill="#fff" opacity=".30" filter="url(#blurB)"/>
  <!-- narrow hot edge on the right -->
  <rect x="${bodyX + S.bw * 0.895}" y="${S.top + 52}" width="${S.bw * 0.022}" height="${
      bodyH - 132
    }" rx="4" fill="#fff" opacity=".55" filter="url(#blurB)"/>

  <!-- engraved plaque (kept blank; the name is set in HTML) -->
  <rect x="${cx - S.bw * 0.30}" y="${S.top + bodyH * 0.52}" width="${S.bw * 0.60}" height="${
      bodyH * 0.20
    }" rx="2" fill="#000" opacity=".14"/>
  <rect x="${cx - S.bw * 0.30}" y="${S.top + bodyH * 0.52}" width="${S.bw * 0.60}" height="1"
        fill="#fff" opacity=".22"/>

  <!-- collar -->
  <rect x="${cx - S.capW * 0.34}" y="${neckY - 16}" width="${S.capW * 0.68}" height="22" rx="3" fill="url(#metal)"/>

  <!-- cap -->
  <rect x="${capX}" y="${neckY - 16 - S.capH}" width="${S.capW}" height="${
      S.capH
    }" rx="${shape === "orb" ? 14 : 3}" fill="url(#metal)"/>
  <rect x="${capX}" y="${neckY - 16 - S.capH}" width="${S.capW}" height="${S.capH * 0.16}" fill="#fff" opacity=".16"/>
  <rect x="${capX}" y="${neckY - 24}" width="${S.capW}" height="8" fill="#000" opacity=".22"/>
</g>

<!-- glow lifted off the shoulders -->
<ellipse cx="${cx}" cy="${S.top + 40}" rx="${S.bw * 0.5}" ry="60" fill="#fff" opacity=".07" filter="url(#blurA)"/>
`
  );
}

/* ────────────────────────────  EYEWEAR  ──────────────────────────── */

function eyewear({ lens, lensDeep, frame = "#141414", shape = "aviator" }) {
  const W = 900;
  const H = 620;
  const cy = 300;

  const lensPath = {
    aviator: (x) =>
      `M${x - 132} ${cy - 74} h264 a26 26 0 0 1 25 30 l-14 74 a132 132 0 0 1 -258 0 l-14 -74 a26 26 0 0 1 25 -30 z`,
    square: (x) => `M${x - 138} ${cy - 86} h276 a18 18 0 0 1 18 18 v128 a18 18 0 0 1 -18 18 h-276 a18 18 0 0 1 -18 -18 v-128 a18 18 0 0 1 18 -18 z`,
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
  ${grain("eg", 0.32, 1.1)}
  ${softLight("eb", 10)}
  <linearGradient id="lens" x1="0" y1="0" x2=".7" y2="1">
    <stop offset="0"   stop-color="#ffffff" stop-opacity=".55"/>
    <stop offset=".28" stop-color="${lens}"/>
    <stop offset=".78" stop-color="${lensDeep}"/>
    <stop offset="1"   stop-color="#000" stop-opacity=".65"/>
  </linearGradient>
  <linearGradient id="fr" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="${frame}" stop-opacity=".75"/>
    <stop offset=".5" stop-color="${frame}"/>
    <stop offset="1" stop-color="#000"/>
  </linearGradient>
  <radialGradient id="eamb" cx=".5" cy=".5" r=".6">
    <stop offset="0" stop-color="${lens}" stop-opacity=".18"/>
    <stop offset="1" stop-color="${lens}" stop-opacity="0"/>
  </radialGradient>
</defs>

<rect width="${W}" height="${H}" fill="url(#eamb)"/>
<ellipse cx="450" cy="${cy + 178}" rx="270" ry="26" fill="#000" opacity=".26" filter="url(#eb)"/>

<g filter="url(#eg)">
  <!-- temples -->
  <path d="M${L - 150} ${cy - 46} q-90 6 -128 58" stroke="url(#fr)" stroke-width="13" stroke-linecap="round"/>
  <path d="M${R + 150} ${cy - 46} q90 6 128 58" stroke="url(#fr)" stroke-width="13" stroke-linecap="round"/>

  <!-- bridge -->
  <path d="M${L + 132} ${cy - 52} q68 -30 ${R - L - 264} 0" stroke="url(#fr)" stroke-width="12" stroke-linecap="round"/>

  <!-- lenses -->
  <path d="${lensPath(L)}" fill="url(#lens)" stroke="url(#fr)" stroke-width="11"/>
  <path d="${lensPath(R)}" fill="url(#lens)" stroke="url(#fr)" stroke-width="11"/>

  <!-- specular streaks across the glass -->
  <path d="M${L - 96} ${cy + 34} l104 -104" stroke="#fff" stroke-width="16" opacity=".26" stroke-linecap="round" filter="url(#eb)"/>
  <path d="M${L - 56} ${cy + 52} l104 -104" stroke="#fff" stroke-width="7"  opacity=".20" stroke-linecap="round" filter="url(#eb)"/>
  <path d="M${R - 96} ${cy + 34} l104 -104" stroke="#fff" stroke-width="16" opacity=".26" stroke-linecap="round" filter="url(#eb)"/>
  <path d="M${R - 56} ${cy + 52} l104 -104" stroke="#fff" stroke-width="7"  opacity=".20" stroke-linecap="round" filter="url(#eb)"/>
</g>
`
  );
}

/* ────────────────────────────  COSMETICS  ──────────────────────────── */

function lipstick({ bullet, bulletDeep, metal = "#c9a961" }) {
  const W = 900;
  const H = 1200;
  const cx = W / 2;
  return svg(
    W,
    H,
    `
<defs>
  ${grain("lg", 0.36, 0.95)}
  ${softLight("lb", 16)}
  <linearGradient id="case" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="#3a2c12"/>
    <stop offset=".2" stop-color="${metal}"/>
    <stop offset=".44" stop-color="#f7ecd0"/>
    <stop offset=".7" stop-color="${metal}"/>
    <stop offset="1" stop-color="#3a2c12"/>
  </linearGradient>
  <linearGradient id="blt" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="${bulletDeep}"/>
    <stop offset=".3" stop-color="${bullet}"/>
    <stop offset=".55" stop-color="#fff" stop-opacity=".45"/>
    <stop offset=".8" stop-color="${bullet}"/>
    <stop offset="1" stop-color="${bulletDeep}"/>
  </linearGradient>
  <radialGradient id="lamb" cx=".5" cy=".42" r=".6">
    <stop offset="0" stop-color="${bullet}" stop-opacity=".22"/>
    <stop offset="1" stop-color="${bullet}" stop-opacity="0"/>
  </radialGradient>
</defs>

<rect width="${W}" height="${H}" fill="url(#lamb)"/>
<ellipse cx="${cx}" cy="${H - 150}" rx="190" ry="30" fill="#000" opacity=".42" filter="url(#lb)"/>

<g filter="url(#lg)">
  <!-- angled bullet -->
  <path d="M${cx - 92} 470 h184 v-118 l-184 -96 z" fill="url(#blt)"/>
  <path d="M${cx - 92} 352 l184 96" stroke="#fff" stroke-width="3" opacity=".35"/>

  <!-- case -->
  <rect x="${cx - 104}" y="470" width="208" height="470" rx="5" fill="url(#case)"/>
  <rect x="${cx - 104}" y="470" width="208" height="26" fill="#000" opacity=".26"/>
  <rect x="${cx - 104}" y="690" width="208" height="16" fill="#000" opacity=".30"/>
  <rect x="${cx - 104}" y="706" width="208" height="4" fill="#fff" opacity=".26"/>
  <rect x="${cx - 70}" y="512" width="14" height="392" fill="#fff" opacity=".30" filter="url(#lb)"/>
</g>
`
  );
}

/* ────────────────────────────  CAMPAIGN PLATES  ──────────────────────────── */

/**
 * Abstract editorial plates — light through fabric. Two-tone by design: the
 * duotone is what makes a page of them read as one campaign.
 */
function plate({ w, h, a, b, hi, seed = 3, mode = "drape" }) {
  const forms =
    mode === "drape"
      ? `
    <path d="M${-w * 0.1} ${h * 0.95} C ${w * 0.18} ${h * 0.52}, ${w * 0.3} ${h * 0.88}, ${
          w * 0.52
        } ${h * 0.46} S ${w * 0.86} ${h * 0.2}, ${w * 1.1} ${h * 0.58} L ${w * 1.1} ${h * 1.1} L ${
          -w * 0.1
        } ${h * 1.1} Z" fill="${b}" opacity=".62"/>
    <path d="M${-w * 0.1} ${h * 1.02} C ${w * 0.24} ${h * 0.7}, ${w * 0.44} ${h * 1.0}, ${
          w * 0.66
        } ${h * 0.66} S ${w * 0.94} ${h * 0.46}, ${w * 1.1} ${h * 0.78} L ${w * 1.1} ${h * 1.12} L ${
          -w * 0.1
        } ${h * 1.12} Z" fill="${hi}" opacity=".22"/>`
      : mode === "shaft"
        ? `
    <g opacity=".5">
      <path d="M${w * 0.1} ${-h * 0.1} L ${w * 0.46} ${-h * 0.1} L ${w * 0.2} ${h * 1.1} L ${
        -w * 0.06
      } ${h * 1.1} Z" fill="${hi}" opacity=".22"/>
      <path d="M${w * 0.52} ${-h * 0.1} L ${w * 0.7} ${-h * 0.1} L ${w * 0.5} ${h * 1.1} L ${
        w * 0.34
      } ${h * 1.1} Z" fill="${hi}" opacity=".14"/>
      <path d="M${w * 0.82} ${-h * 0.1} L ${w * 1.02} ${-h * 0.1} L ${w * 0.86} ${h * 1.1} L ${
        w * 0.68
      } ${h * 1.1} Z" fill="${hi}" opacity=".10"/>
    </g>`
        : `
    <ellipse cx="${w * 0.62}" cy="${h * 0.44}" rx="${w * 0.34}" ry="${h * 0.42}" fill="${hi}" opacity=".16"/>
    <ellipse cx="${w * 0.3}" cy="${h * 0.66}" rx="${w * 0.3}" ry="${h * 0.3}" fill="${b}" opacity=".5"/>`;

  return svg(
    w,
    h,
    `
<defs>
  ${grain(`pg${seed}`, 0.7, 0.75)}
  ${softLight(`pb${seed}`, Math.round(w * 0.06))}
  <linearGradient id="bg${seed}" x1="0" y1="0" x2=".6" y2="1">
    <stop offset="0" stop-color="${a}"/>
    <stop offset="1" stop-color="${b}"/>
  </linearGradient>
  <radialGradient id="key${seed}" cx=".64" cy=".3" r=".7">
    <stop offset="0" stop-color="${hi}" stop-opacity=".40"/>
    <stop offset=".55" stop-color="${hi}" stop-opacity=".08"/>
    <stop offset="1" stop-color="${hi}" stop-opacity="0"/>
  </radialGradient>
  <radialGradient id="vig${seed}" cx=".5" cy=".5" r=".78">
    <stop offset=".45" stop-color="#000" stop-opacity="0"/>
    <stop offset="1" stop-color="#000" stop-opacity=".62"/>
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

/* ────────────────────────────  WRITE  ──────────────────────────── */

mkdirSync(OUT, { recursive: true });
const write = (name, content) => {
  writeFileSync(join(OUT, name), content);
  return name;
};

const NOIR = "#0b0b0c";

const fragrances = [
  ["noir-imperial", { liquid: "#2a1c12", liquidDeep: "#0d0806", shape: "slab", metal: "gold" }],
  ["oud-silence", { liquid: "#3b2417", liquidDeep: "#150b06", shape: "tower", metal: "onyx" }],
  ["velvet-saffron", { liquid: "#b4622a", liquidDeep: "#5a2a0e", shape: "slab", metal: "gold" }],
  ["amber-meridian", { liquid: "#c98f37", liquidDeep: "#6b4413", shape: "orb", metal: "gold" }],
  ["tobacco-vesper", { liquid: "#7a4a1e", liquidDeep: "#2e1908", shape: "facet", metal: "gold" }],
  ["white-oud", { liquid: "#e8e2d4", liquidDeep: "#a89f8b", shape: "tower", metal: "silver" }],
  ["rose-prive", { liquid: "#a8324c", liquidDeep: "#4d1220", shape: "orb", metal: "gold" }],
  ["cedar-absolute", { liquid: "#4a5a3c", liquidDeep: "#1b2416", shape: "facet", metal: "silver" }],
];
for (const [slug, cfg] of fragrances) write(`f-${slug}.svg`, flacon(cfg));

const glasses = [
  ["monolith", { lens: "#2a2a2c", lensDeep: "#0a0a0b", shape: "square", frame: "#141414" }],
  ["meridian", { lens: "#4a3a22", lensDeep: "#161009", shape: "aviator", frame: "#8a6f3c" }],
  ["oracle", { lens: "#1e2a30", lensDeep: "#070c0f", shape: "round", frame: "#1a1a1a" }],
  ["vesper", { lens: "#3a2028", lensDeep: "#120609", shape: "cat", frame: "#101010" }],
];
for (const [slug, cfg] of glasses) write(`e-${slug}.svg`, eyewear(cfg));

const lips = [
  ["noir-rouge", { bullet: "#8e1f2f", bulletDeep: "#3d0a12" }],
  ["bare-oud", { bullet: "#b4756a", bulletDeep: "#5e3129" }],
  ["oxblood", { bullet: "#5e1420", bulletDeep: "#25060b" }],
  ["gilt-plum", { bullet: "#6d2848", bulletDeep: "#2b0d1c" }],
];
for (const [slug, cfg] of lips) write(`b-${slug}.svg`, lipstick(cfg));

// Campaign plates. Wide ones are heroes, tall ones are editorial columns.
const plates = [
  ["hero-01", { w: 2000, h: 1125, a: "#0a0a0b", b: "#1c1512", hi: "#c9a961", seed: 1, mode: "shaft" }],
  ["hero-02", { w: 2000, h: 1125, a: "#08090b", b: "#141a1c", hi: "#9fb3bd", seed: 2, mode: "drape" }],
  ["hero-03", { w: 2000, h: 1125, a: "#0c0708", b: "#2a1218", hi: "#c07a86", seed: 3, mode: "drape" }],
  ["ed-01", { w: 1200, h: 1600, a: "#0a0a0b", b: "#211a13", hi: "#c9a961", seed: 4, mode: "drape" }],
  ["ed-02", { w: 1200, h: 1600, a: "#070809", b: "#16191c", hi: "#aab6bd", seed: 5, mode: "shaft" }],
  ["ed-03", { w: 1200, h: 1600, a: "#0b0709", b: "#26141a", hi: "#bf8390", seed: 6, mode: "orbit" }],
  ["cat-fragrance", { w: 1600, h: 900, a: "#0a0908", b: "#241a10", hi: "#c9a961", seed: 7, mode: "drape" }],
  ["cat-beauty", { w: 1600, h: 900, a: "#0c0708", b: "#2b1219", hi: "#c58592", seed: 8, mode: "orbit" }],
  ["cat-eyewear", { w: 1600, h: 900, a: "#08090a", b: "#181d20", hi: "#a5b2ba", seed: 9, mode: "shaft" }],
  ["cat-women", { w: 1600, h: 900, a: "#0a0809", b: "#221820", hi: "#bfa6b4", seed: 10, mode: "drape" }],
  ["cat-men", { w: 1600, h: 900, a: "#08080a", b: "#15161c", hi: "#9aa0b2", seed: 11, mode: "shaft" }],
  ["cat-gifts", { w: 1600, h: 900, a: "#0a0808", b: "#231a12", hi: "#d0b378", seed: 12, mode: "orbit" }],
];
for (const [slug, cfg] of plates) write(`p-${slug}.svg`, plate(cfg));

// Flat ground used behind the WebGL fallback.
write(
  "noir.svg",
  svg(64, 64, `<rect width="64" height="64" fill="${NOIR}"/>`)
);

console.log(
  `wrote ${fragrances.length + glasses.length + lips.length + plates.length + 1} assets to public/img/`
);

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
  png(1200, 630, (u, v, x, y) => {
    // base: noir drifting to a warm brown across the diagonal
    const d = (u * 0.7 + v * 0.3);
    let r = 10 + d * 18;
    let g = 10 + d * 11;
    let b = 11 + d * 7;

    // key light, upper right
    const kd = Math.hypot(u - 0.66, v - 0.32);
    const key = Math.exp(-kd * 2.6) * 0.85;
    r += key * 150;
    g += key * 124;
    b += key * 70;

    // three shafts raking across the frame
    for (const [c, w, i] of [[0.22, 0.1, 0.5], [0.52, 0.07, 0.32], [0.83, 0.05, 0.22]]) {
      const sx = u + (v - 0.5) * 0.26;
      const band = 1 - smooth(0, w, Math.abs(sx - c));
      const fall = 1 - v * 0.45;
      r += band * i * fall * 120;
      g += band * i * fall * 100;
      b += band * i * fall * 62;
    }

    // vignette
    const vg = 1 - Math.hypot(u - 0.5, v - 0.5) * 0.95;
    r *= vg;
    g *= vg;
    b *= vg;

    // No grain here: at card size it is invisible, and per-pixel noise costs
    // roughly a megabyte of PNG because nothing downstream can compress it.
    return [r, g, b];
  })
);

console.log("wrote og.png (1200x630)");
