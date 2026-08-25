/**
 * The campaign lookbook.
 *
 * Three looks shot on one set. Hotspot coordinates are percentages of the
 * IMAGE box, not the viewport — which is why the frame below preserves the
 * source aspect ratio rather than cropping to fill. `object-cover` would shift
 * every marker off its garment the moment the viewport changed shape.
 *
 * `angle` is the direction the leader line draws out from the dot, in degrees,
 * clockwise from east. Lines point into empty frame, never across the body.
 */

export type Hotspot = {
  /** Product slug — every marker resolves to a real listing. */
  slug: string;
  label: string;
  /** % of image width / height. */
  x: number;
  y: number;
  angle: number;
  /** Leader length as a % of frame width. Resolved to px after layout, then
   *  shortened if the label would fall outside the frame. */
  len?: number;
};

export type Look = {
  id: string;
  image: string;
  thumb: string;
  /** A looping clip that replaces the still. The still becomes its poster. */
  video?: string;
  /** First frame of `video`, served until it can play and to reduced-motion. */
  poster?: string;
  /**
   * Source aspect for THIS look's plate, when it differs from LOOK_ASPECT.
   * Veo returns 16:9; the stills are 2.36:1. The crop map reads this, so a
   * mixed page keeps every marker on its garment.
   */
  srcAspect?: string;
  /**
   * Measured horizontal sway of the SUBJECT, as [seconds, px, px] against the
   * clip's own frame width, sampled every 0.5s by template-matching the head.
   *
   * Veo would not hold the model still — he leans and returns, pivoting from
   * the feet, so displacement scales with height up the body. Rather than
   * re-roll a frame that is otherwise good, the markers ride the same curve:
   * this table drives them, and each marker takes the share of it that its own
   * height implies. See `swayFactor`.
   */
  sway?: [number, number, number][];
  alt: string;
  eyebrow: string;
  title: string;
  /** Frame aspect. Varied per look so three stacked landscapes do not read as
   *  three identical bands. Markers are remapped through whatever crop results. */
  aspect?: string;
  /** Ken-burns drift in px, signed. Alternated so the three do not move as one. */
  drift?: number;
  hotspots: Hotspot[];
};

export const LOOKS: Look[] = [
  {
    id: "look-01",
    image: "/img/look/look-01-poster.jpg",
    thumb: "/img/look/look-01-thumb.jpg",
    video: "/video/look-01.mp4",
    poster: "/img/look/look-01-poster.jpg",
    // The clip is 16:9; the plate it was generated from is 2.36:1.
    srcAspect: "1280 / 720",
    alt: "A model in a cream linen shirt and pleated trousers holding a black leather holdall, in a walnut-panelled room.",
    eyebrow: "Look I",
    title: "The Long Afternoon",
    aspect: "16 / 9",
    drift: -38,
    /* Peak +30px at t=3.0-3.5s, decaying to +3px by the loop point. */
    sway: [
      [0.0, 0, 0], [0.5, 1, 0], [1.0, 2, 0], [1.5, 2, 0], [2.0, 10, -2],
      [2.5, 22, -4], [3.0, 30, -4], [3.5, 30, -4], [4.0, 24, -4], [4.5, 19, -4],
      [5.0, 16, -4], [5.5, 14, -4], [6.0, 13, -4], [6.5, 12, -4], [7.0, 9, -3],
      [7.5, 6, 0], [8.0, 7, 0], [8.5, 5, 0], [9.0, 5, 0], [9.5, 3, 0],
    ],
    /* Re-derived against the 16:9 clip: the reframe cropped 12.3% off each
       side, so every x moved. Verified by sampling the pixel under each dot —
       cloth still reads ~150-166, leather still reads ~20-35. */
    hotspots: [
      { slug: "oracle", label: "Oracle", x: 48.7, y: 11.5, angle: -152, len: 11 },
      { slug: "evening-shirt", label: "The Shirt", x: 50, y: 30, angle: -16, len: 12 },
      { slug: "pleated-trouser", label: "Pleated Trouser", x: 54.6, y: 58, angle: 14, len: 12.5 },
      { slug: "weekend-holdall", label: "Weekend Holdall", x: 42.7, y: 68, angle: 188, len: 11.5 },
      { slug: "noir-chelsea-boot", label: "Noir Chelsea", x: 48, y: 94, angle: 186, len: 11 },
    ],
  },
  {
    id: "look-02",
    image: "/img/look/look-02.jpg",
    thumb: "/img/look/look-02-thumb.jpg",
    alt: "A model in a cream linen shirt, leather belt and pleated trousers holding a black holdall, in a walnut-panelled room.",
    eyebrow: "Look II",
    title: "Hand in Pocket",
    // Tighter, so the middle band breaks the rhythm of the other two.
    aspect: "2 / 1",
    drift: 30,
    hotspots: [
      { slug: "monolith", label: "Monolith", x: 49, y: 11, angle: -152, len: 11 },
      { slug: "evening-shirt", label: "The Shirt", x: 50, y: 30, angle: -16, len: 12 },
      { slug: "woven-belt", label: "Woven Belt", x: 51, y: 43, angle: 187, len: 11 },
      { slug: "pleated-trouser", label: "Pleated Trouser", x: 54, y: 58, angle: 13, len: 12.5 },
      { slug: "weekend-holdall", label: "Weekend Holdall", x: 44.5, y: 68, angle: 188, len: 11.5 },
      { slug: "noir-chelsea-boot", label: "Noir Chelsea", x: 48.5, y: 94, angle: 186, len: 11 },
    ],
  },
  {
    id: "look-03",
    image: "/img/look/look-03.jpg",
    thumb: "/img/look/look-03-thumb.jpg",
    alt: "A model in a cream shirt and pleated trousers with a black holdall, standing in a walnut-panelled room.",
    eyebrow: "Look III",
    title: "Before the Car",
    aspect: "3168 / 1344",
    drift: -34,
    hotspots: [
      { slug: "monolith", label: "Monolith", x: 48, y: 11, angle: -152, len: 11 },
      { slug: "evening-shirt", label: "The Shirt", x: 50, y: 30, angle: -16, len: 12 },
      { slug: "woven-belt", label: "Woven Belt", x: 53, y: 43, angle: 12, len: 11.5 },
      { slug: "pleated-trouser", label: "Pleated Trouser", x: 54, y: 58, angle: 13, len: 12.5 },
      { slug: "weekend-holdall", label: "Weekend Holdall", x: 46.5, y: 68, angle: 189, len: 11 },
      { slug: "noir-chelsea-boot", label: "Noir Chelsea", x: 49, y: 94, angle: 186, len: 11 },
    ],
  },
];

/** Source aspect, used so the hotspot layer always matches the rendered image. */
export const LOOK_ASPECT = "3168 / 1344";

/**
 * How much of the measured sway a marker at height `yPct` takes.
 *
 * The model pivots from the feet, so the boots barely move (1px measured) while
 * the head swings the full amount (30px). A straight line between those two
 * heights predicted the rest to within 2px — shirt 23 vs 22 measured, hand 13
 * vs 14 — so a line is all this needs to be. The holdall is the one outlier
 * (9.5 predicted, 14 measured) because the bag swings on its own.
 */
export function swayFactor(yPct: number) {
  const HEAD = 11.5;
  const FEET = 94;
  return Math.max(0, Math.min(1, (FEET - yPct) / (FEET - HEAD)));
}
