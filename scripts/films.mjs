/**
 * Builds the campaign films.
 *
 * The shoot arrives as social cuts — 1080x1920 vertical, 18 to 35 seconds,
 * 21 to 28MB each, every one ending on a gold monogram slate over black. None
 * of that is a website. This trims one segment out of each, strips the audio,
 * scales it, and emits one encode plus a poster.
 *
 *   npm run films
 *
 * Sources live in `media-in/films/`, gitignored for the same reason the photo
 * masters are: 97MB of QuickTime is not the deliverable, `public/video/` is.
 *
 * ONE ENCODE. See the note by the encoder for why VP9 did not earn its place.
 *
 * WHY THESE SEGMENTS. Cut detection put a boundary every 1.4 to 3.3 seconds —
 * these are fast social edits, and the longest unbroken shot in the whole set
 * is 3.2s. A single shot that short reads as a GIF, so each pick instead holds
 * ONE LOOK across two or three cuts, which is how a couture film behaves
 * anyway. In-points are nudged past the dissolve that opens each shot.
 *
 * VERTICAL IS THE POINT, not a problem to solve. 9:16 cropped into a landscape
 * hero would throw away three quarters of the frame and upscale what is left.
 * Dropped into the hero's portrait panes it renders very close to native.
 */
import { mkdirSync, readdirSync, writeFileSync, rmSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import ffmpeg from "ffmpeg-static";
import sharp from "sharp";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SRC = join(ROOT, "media-in", "films");
const OUT = join(ROOT, "public", "video");
const POSTERS = join(ROOT, "public", "img", "film");

/**
 * Camera file → slug, with the segment to lift out of it.
 *
 * `in`/`seconds` are in the SOURCE timeline. They are pinned to the cut list
 * rather than eyeballed: every in-point sits just after a shot boundary so the
 * segment never opens mid-dissolve, and every out-point lands well before the
 * monogram slate (S5 at 17.5s, S6 at 26.5s, S7 at 30.0s).
 */
const FILMS = [
  {
    match: "SNIPPET 6",
    prefer: "SUGGESTED",
    slug: "film-sash",
    in: 10.9,
    seconds: 5.0,
    alt: "A model in a cream shirt with a navy sash and denim-trimmed collar, in a plaster courtyard.",
  },
  {
    match: "SNIPPET 5",
    slug: "film-coral",
    in: 11.3,
    seconds: 5.1,
    alt: "A model in a black pinstripe shirt embroidered with a spray of coral-pink flowers, against a carved stone wall.",
  },
  {
    match: "SNIPPET 7",
    slug: "film-column",
    in: 8.35,
    seconds: 5.6,
    alt: "A model in a lilac satin column gown, then in a deep burgundy gown worked with velvet flowers.",
  },

  /*
   * One film per room, for the category heroes. Longer than the home panes —
   * each is shown alone, full height, so it can hold three cuts rather than
   * two. Cut points from scene detection on SNIPPET 7: 6.12, 8.08, 10.88,
   * 14.04 · 17.64, 18.56, 19.24, 19.92, 22.0 · 23.44, 24.44, 26.76, 28.6,
   * slate at 30.0. The 22.0 boundary is only a change of angle on the white
   * shirt — the jacket does not arrive until 23.44, checked frame by frame,
   * so the occasion film runs to it and the men's film starts there.
   */
  {
    match: "SNIPPET 7",
    slug: "film-women",
    in: 6.16,
    seconds: 7.8,
    alt: "A model in a burgundy gown worked with velvet flowers, then in a grey column gown with a crystal hem.",
  },
  {
    match: "SNIPPET 7",
    slug: "film-men",
    in: 23.48,
    seconds: 6.1,
    alt: "A model in a midnight dinner jacket embroidered with swirls of crystal, seated on a studio stool.",
  },
  {
    match: "SNIPPET 7",
    slug: "film-occasion",
    in: 17.68,
    seconds: 5.7,
    alt: "Hand-set black and red spiral embroidery on the collar of a white shirt, worn against a carved stone wall.",
  },
];

/* 720x1280 rather than the native 1080x1920. A hero pane renders about 490 CSS
   px on a desktop and the full 375 on a phone, so 720 covers a phone at 2x and
   a desktop comfortably at 1x. Video is temporally noisy and forgiving of a
   little upscale in a way a still of hand-set crystal is not — and the 1080
   encode was three times the weight for detail nobody can resolve at this size. */
const W = 720;
const H = 1280;

mkdirSync(OUT, { recursive: true });
mkdirSync(POSTERS, { recursive: true });

const run = (args) => execFileSync(ffmpeg, ["-hide_banner", "-loglevel", "error", ...args]);

const available = readdirSync(SRC).filter((f) => /\.(mov|mp4|m4v)$/i.test(f));
const kb = (n) => `${(n / 1024).toFixed(0)}KB`;

const manifest = [];
let bytes = 0;

for (const film of FILMS) {
  const file = available.find(
    (f) => f.includes(film.match) && (!film.prefer || f.includes(film.prefer))
  );
  if (!file) {
    console.warn(`  ✗ ${film.slug} — no source matching "${film.match}"`);
    continue;
  }

  const src = join(SRC, file);
  const trim = ["-ss", String(film.in), "-t", String(film.seconds)];
  /* `-an` is not an optimisation. A clip with an audio track cannot autoplay
     unless it is also muted, and a muted track is bytes nobody will ever hear. */
  const common = [...trim, "-i", src, "-an", "-vf", `scale=${W}:${H}:flags=lanczos`];

  const mp4 = join(OUT, `${film.slug}.mp4`);
  run([
    ...common,
    "-c:v", "libx264",
    "-crf", "27",
    "-preset", "slow",
    "-profile:v", "high",
    "-pix_fmt", "yuv420p",
    /* Moves the index to the front so the browser can start playing on the
       first bytes instead of waiting for the whole file. */
    "-movflags", "+faststart",
    "-y", mp4,
  ]);

  /*
   * H.264 ONLY, deliberately.
   *
   * The obvious move is VP9 alongside it — smaller file, every browser but
   * Safari takes it. Measured on this footage it went the other way: VP9 at
   * crf 34 saved 21KB on one clip, broke even on another, and cost 756KB on
   * the third, because the grain in the carved-stone wall is exactly what VP9
   * spends bits on. Net across the three it was worse, and it was a second
   * encode to keep correct forever. One universally-supported file it is.
   */

  /* The poster is the segment's own first frame, so the still the browser
     paints is the one the film starts on and there is no jump when it plays. */
  const rawPoster = join(POSTERS, `${film.slug}.png`);
  run([...trim, "-i", src, "-frames:v", "1", "-vf", `scale=${W}:${H}:flags=lanczos`, "-y", rawPoster]);

  const poster = join(POSTERS, `${film.slug}.webp`);
  await sharp(rawPoster).webp({ quality: 80 }).toFile(poster);
  const blur = await sharp(rawPoster).resize({ width: 20 }).webp({ quality: 45 }).toBuffer();
  rmSync(rawPoster);

  const { statSync } = await import("node:fs");
  const sizes = { mp4: statSync(mp4).size, poster: statSync(poster).size };
  bytes += sizes.mp4 + sizes.poster;

  manifest.push({
    slug: film.slug,
    alt: film.alt,
    width: W,
    height: H,
    seconds: film.seconds,
    blur: `data:image/webp;base64,${blur.toString("base64")}`,
  });

  console.log(
    `  ✓ ${film.slug.padEnd(12)} ${String(film.seconds).padStart(4)}s  ` +
      `mp4 ${kb(sizes.mp4).padStart(7)}  poster ${kb(sizes.poster).padStart(6)}`
  );
}

const ts = `/**
 * GENERATED by scripts/films.mjs — do not edit.
 *
 * One record per campaign film: the segment's length, its intrinsic size, an
 * alt string written against what is in the picture, and a blur placeholder
 * taken from the poster frame.
 */

export type Film = {
  slug: string;
  alt: string;
  width: number;
  height: number;
  /** Trimmed length, used to stagger the panes so they do not loop in unison. */
  seconds: number;
  blur: string;
};

export const FILMS: Record<string, Film> = ${JSON.stringify(
  Object.fromEntries(manifest.map((m) => [m.slug, m])),
  null,
  2
)};

/** One encode. See the note in scripts/films.mjs for why there is no VP9. */
export const filmMp4 = (slug: string) => \`/video/\${slug}.mp4\`;
export const filmPoster = (slug: string) => \`/img/film/\${slug}.webp\`;
export const filmBlur = (slug: string) => FILMS[slug]?.blur;
`;

writeFileSync(join(ROOT, "lib", "films.ts"), ts);

console.log(`\n  ${manifest.length} films · ${(bytes / 1024 / 1024).toFixed(2)} MB total`);
console.log("  → public/video/ + public/img/film/ + lib/films.ts\n");
