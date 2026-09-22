/**
 * The shoppable campaign.
 *
 * One frame, marked. Every marker resolves to a real listing, and the
 * coordinates are percentages of the SOURCE image — `makeCropMap` in
 * LookBook.tsx converts them to the rendered frame, so a dot stays on its
 * garment whatever aspect the frame ends up.
 *
 * COORDINATES ARE MEASURED, NOT EYEBALLED. Each one was placed by sampling an
 * 11px patch of the source and reading it back: his bandhgala returns
 * rgb(43,48,52), her crystal bodice rgb(143,141,135) against a backdrop that
 * sits above 175 and skin that runs warm. An earlier campaign placed by eye put
 * three of six markers on panelling. `scripts/probe-hotspots.mjs` is the tool;
 * run it again if a frame is ever re-cropped or the masters land.
 *
 * ONE FRAME, NOT THREE. The previous campaign stacked three landscape plates.
 * This shoot is 3:4 portrait, and three stacked portraits at full width is
 * six thousand pixels of scrolling before the page says anything. One frame,
 * set beside its own copy, is the whole idea in a single screen.
 */

export type Hotspot = {
  /** Product slug — every marker resolves to a real listing. */
  slug: string;
  label: string;
  /** % of image width / height. */
  x: number;
  y: number;
  /** Leader length as a % of frame width. Resolved to px after layout, then
   *  shortened if the label would fall outside the frame. */
  len?: number;
};

export type Look = {
  id: string;
  image: string;
  /** A looping clip that replaces the still. The still becomes its poster. */
  video?: string;
  /** First frame of `video`, served until it can play and to reduced-motion. */
  poster?: string;
  /**
   * Source aspect for THIS look's plate, when it differs from LOOK_ASPECT.
   * The crop map reads this, so a mixed page keeps every marker on its
   * garment even where the sources disagree.
   */
  srcAspect?: string;
  /**
   * Measured horizontal sway of the SUBJECT, as [seconds, px, px] against the
   * clip's own frame width. Only meaningful for a look carrying `video` — a
   * still subject does not move, so the studio frames omit it entirely.
   */
  sway?: [number, number, number][];
  alt: string;
  eyebrow: string;
  title: string;
  /** Copy set beside the frame. */
  body: string;
  /** Frame aspect. Markers are remapped through whatever crop results. */
  aspect?: string;
  /** Ken-burns drift in px, signed. */
  drift?: number;
  hotspots: Hotspot[];
};

export const LOOKS: Look[] = [
  {
    id: "duet",
    image: "/img/campaign/duet-01-810.webp",
    alt: "A couple in black eveningwear — his bandhgala embroidered with a crystal vine across the shoulder, her gown set with crystal at the bust.",
    eyebrow: "The Campaign",
    title: "After Hours",
    body:
      "Two pieces from the same hand, cut for the same evening. Everything in the frame is made in the atelier and everything in the frame can be bought — select a marker.",
    // Native 3:4. The frame is set beside its copy rather than run full width,
    // so the source is never cropped and never upscaled.
    aspect: "810 / 1080",
    drift: -22,
    /*
     * Labels are SHORT on purpose. The leader for the marker at x:15 has only
     * the 97px between the dot and the frame edge to live in, and "Noir Vine
     * Bandhgala" set in small caps is wider than that on its own — `clampArms`
     * pulled the arm to its 56px floor and the label still hung out over the
     * gutter. The full name is in the card the marker opens; the tag on the
     * photograph only has to identify which piece is meant.
     */
    hotspots: [
      { slug: "noir-vine-bandhgala", label: "Noir Vine", x: 15, y: 46, len: 11 },
      { slug: "liquid-column-gown", label: "The Gown", x: 78, y: 56, len: 12 },
    ],
  },
  {
    id: "noir-vine",
    image: "/img/campaign/noir-vine-01-810.webp",
    alt: "A model in a black bandhgala, the shoulder and sleeve worked in a vine of silver crystal and bugle bead.",
    eyebrow: "The Piece",
    title: "Two Hundred Hours",
    body:
      "A vine of hand-set crystal and bugle bead running from the collar out along the shoulder, and the other side of the front left entirely plain. Both markers open the piece.",
    aspect: "810 / 1080",
    drift: 26,
    /*
     * Both leaders point into empty seamless — the shoulder sits at x:74 so its
     * line runs right, the trouser at x:42 so its line runs left. `leader()`
     * decides that from x alone, which happens to be correct here; a marker
     * placed the other side of centre would have its line drawn back across the
     * body.
     */
    hotspots: [
      { slug: "noir-vine-bandhgala", label: "Noir Vine", x: 74, y: 36, len: 12 },
      { slug: "pleated-trouser", label: "The Trouser", x: 42, y: 91, len: 11 },
    ],
  },
];

/** Source aspect, used so the hotspot layer always matches the rendered image. */
export const LOOK_ASPECT = "810 / 1080";

/**
 * How much of a clip's measured sway a marker at height `yPct` takes.
 *
 * Retained for any look that carries `video`: a standing subject pivots from
 * the feet, so the boots barely move while the head swings the full amount,
 * and a straight line between those two heights predicted every marker in
 * between to within 2px. The studio frames are stills, so nothing calls it
 * today — it costs nothing and the next film will want it.
 */
export function swayFactor(yPct: number) {
  const HEAD = 11.5;
  const FEET = 94;
  return Math.max(0, Math.min(1, (FEET - yPct) / (FEET - HEAD)));
}
