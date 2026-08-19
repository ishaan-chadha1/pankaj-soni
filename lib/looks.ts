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
  alt: string;
  eyebrow: string;
  title: string;
  hotspots: Hotspot[];
};

export const LOOKS: Look[] = [
  {
    id: "look-01",
    image: "/img/look/look-01.jpg",
    thumb: "/img/look/look-01-thumb.jpg",
    alt: "A model in a cream linen shirt and pleated trousers holding a black leather holdall, in a walnut-panelled room.",
    eyebrow: "Look I",
    title: "The Long Afternoon",
    hotspots: [
      { slug: "oracle", label: "Oracle", x: 49, y: 11.5, angle: -152, len: 11 },
      { slug: "evening-shirt", label: "The Shirt", x: 50, y: 30, angle: -16, len: 12 },
      { slug: "pleated-trouser", label: "Pleated Trouser", x: 53.5, y: 58, angle: 14, len: 12.5 },
      { slug: "weekend-holdall", label: "Weekend Holdall", x: 44.5, y: 68, angle: 188, len: 11.5 },
      { slug: "noir-chelsea-boot", label: "Noir Chelsea", x: 48.5, y: 94, angle: 186, len: 11 },
    ],
  },
  {
    id: "look-02",
    image: "/img/look/look-02.jpg",
    thumb: "/img/look/look-02-thumb.jpg",
    alt: "A model in a cream linen shirt, leather belt and pleated trousers holding a black holdall, in a walnut-panelled room.",
    eyebrow: "Look II",
    title: "Hand in Pocket",
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
