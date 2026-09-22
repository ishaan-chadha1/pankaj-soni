/**
 * Reads back what is actually under a lookbook hotspot.
 *
 * Markers in `lib/looks.ts` are percentages of the source image, and placing
 * them by eye does not work — an eyeballed pass on the previous campaign put
 * three of six markers on wood panelling and one in the gap between two shoes.
 * This samples an 11px patch at each coordinate and names what it finds, so a
 * marker is on measured cloth before it ships.
 *
 *   node scripts/probe-hotspots.mjs "72DPI AVI-01244.jpg" 15,46,shoulder 78,56,bodice
 *
 * Add `--sweep x0 x1 y0 y1` instead of points to print a coarse map of a
 * region, which is how you find the garment in the first place.
 *
 * The classifier is tuned to THIS shoot: a pale grey seamless above L=170,
 * warm skin, near-black cloth below L=62, lilac satin where blue leads red,
 * and neutral mid-tones which on these frames are hand-set crystal.
 */
import sharp from "sharp";

const SRC = "media-in/shoot-01";
const argv = process.argv.slice(2);
const file = argv[0];
if (!file) {
  console.error("usage: node scripts/probe-hotspots.mjs <file.jpg> x,y,label ...");
  process.exit(1);
}

const img = sharp(`${SRC}/${file}`);
const { width: W, height: H } = await img.metadata();
const raw = await img.raw().toBuffer();

const patch = (xPct, yPct, rad = 5) => {
  const cx = Math.round((xPct / 100) * W);
  const cy = Math.round((yPct / 100) * H);
  let r = 0, g = 0, b = 0, n = 0;
  for (let y = cy - rad; y <= cy + rad; y++) {
    for (let x = cx - rad; x <= cx + rad; x++) {
      if (x < 0 || y < 0 || x >= W || y >= H) continue;
      const i = (y * W + x) * 3;
      r += raw[i]; g += raw[i + 1]; b += raw[i + 2]; n++;
    }
  }
  return [r / n, g / n, b / n].map(Math.round);
};

const name = ([r, g, b]) => {
  const L = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  if (b > r + 12 && L > 60) return "LILAC SATIN";
  if (L > 170 && Math.abs(r - b) < 12) return "backdrop";
  if (L > 95 && r > b + 20) return "skin";
  if (L < 62) return "DARK CLOTH";
  if (L >= 110 && L <= 175 && Math.abs(r - b) < 12) return "CRYSTAL / silver";
  return "mid";
};

console.log(`\n${file}  ${W}x${H}`);

const sweepAt = argv.indexOf("--sweep");
if (sweepAt > -1) {
  const [x0, x1, y0, y1] = argv.slice(sweepAt + 1, sweepAt + 5).map(Number);
  const glyph = { "LILAC SATIN": " L ", backdrop: " . ", skin: " s ", "DARK CLOTH": " ██", "CRYSTAL / silver": " ✦ ", mid: " ~ " };
  process.stdout.write("     " + Array.from({ length: x1 - x0 + 1 }, (_, i) => String(x0 + i).padStart(3)).join("") + "\n");
  for (let y = y0; y <= y1; y += 2) {
    let row = String(y).padStart(4) + " ";
    for (let x = x0; x <= x1; x++) row += glyph[name(patch(x, y, 4))];
    console.log(row);
  }
} else {
  for (const p of argv.slice(1)) {
    const [x, y, label = ""] = p.split(",");
    const rgb = patch(+x, +y);
    console.log(`  ${label.padEnd(20)} ${String(x).padStart(5)},${String(y).padStart(5)}  rgb(${rgb.join(",").padEnd(11)})  ${name(rgb)}`);
  }
}
console.log("");
