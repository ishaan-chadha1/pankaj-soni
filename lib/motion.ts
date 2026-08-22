/**
 * Shared choreography.
 *
 * Timings live in CSS as tokens (`--t-*`, `--e-*`); this is the JS side of the
 * same system, for delays that have to be computed per item.
 */

/** Matches the CSS scale, for the rare delay that must be set from JS. */
export const T = {
  fast: 240,
  base: 480,
  slow: 800,
  slower: 1200,
} as const;

/**
 * Eased stagger.
 *
 * A flat `i * 90` is a metronome: every item lands the same distance apart and a
 * row arrives as a list. Easing the stagger shrinks each successive increment,
 * so the group lands as a phrase — the first few in quick succession, the tail
 * settling in. Capped so a long grid never trails off for seconds.
 */
export function stagger(i: number, base = 110, cap = 8) {
  const t = Math.min(i, cap) / cap;
  return Math.round(((base * cap) / 2) * (1 - Math.pow(1 - t, 2)));
}

/** Stagger for a group that should feel tighter — rails, chips, swatches. */
export const staggerTight = (i: number) => stagger(i, 70, 6);
