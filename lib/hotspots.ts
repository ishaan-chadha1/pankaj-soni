import type { Hotspot } from "@/app/components/Hotspots";

/**
 * Where the shoppable markers sit on the landing's pictures.
 *
 * Coordinates are % of the source frame, read against a 10% grid laid over
 * each plate, and each dot sits on the garment's embroidery — the part that
 * makes the piece what it is. Keyed by the picture, so the same plate carries
 * the same marker wherever it appears.
 */
export const PLATE_HOTS: Record<string, Hotspot[]> = {
  "/img/campaign/pinstripe-01-810.webp": [{ slug: "pinstripe-wrap-set", label: "Pinstripe", x: 50, y: 37, len: 18 }],
  "/img/campaign/swirl-shirt-01-810.webp": [{ slug: "swirl-shirt", label: "Swirl Shirt", x: 40, y: 37, len: 16, dir: "left" }],
  // Selected pieces — one marker on each product's own plate.
  "/img/campaign/vapour-gown-01-810.webp": [{ slug: "atelier-tuxedo-dress", label: "The Dress", x: 47, y: 38, len: 18 }],
  "/img/campaign/silver-seam-01-810.webp": [{ slug: "shawl-collar-dinner-jacket", label: "Silver Seam", x: 60, y: 45, len: 16, dir: "left" }],
  "/img/campaign/orbit-01-810.webp": [{ slug: "orbit-bandhgala", label: "Orbit", x: 45, y: 40, len: 16, dir: "left" }],
  "/img/campaign/noir-vine-01-810.webp": [{ slug: "noir-vine-bandhgala", label: "Noir Vine", x: 50, y: 86, len: 16, dir: "left" }],
};

/** The Work — keyed by the detail plate's slug. */
export const CRAFT_HOTS: Record<string, Hotspot[]> = {
  "silver-seam-detail": [{ slug: "shawl-collar-dinner-jacket", label: "Silver Seam", x: 40, y: 60, len: 18 }],
  "pinstripe-detail": [{ slug: "pinstripe-wrap-set", label: "Pinstripe", x: 62, y: 62, len: 18, dir: "left" }],
  "swirl-shirt-detail": [{ slug: "swirl-shirt", label: "Swirl Shirt", x: 34, y: 30, len: 18 }],
  "vapour-gown-detail": [{ slug: "atelier-tuxedo-dress", label: "The Dress", x: 50, y: 72, len: 18 }],
};
