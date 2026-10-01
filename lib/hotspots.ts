import type { Hotspot } from "@/app/components/Hotspots";

/**
 * Where the shoppable markers sit on the landing's pictures.
 *
 * Coordinates are % of the 810x1080 source, read against a 10% grid laid over
 * each plate, and each dot sits on the garment's embroidery — the part that
 * makes the piece what it is. Keyed by the picture, so the same plate carries
 * the same marker wherever it appears.
 */
export const PLATE_HOTS: Record<string, Hotspot[]> = {
  // Selected pieces — one marker on each product's own plate.
  "/img/campaign/vapour-gown-01-810.webp": [{ slug: "atelier-tuxedo-dress", label: "The Dress", x: 47, y: 40, len: 18 }],
  "/img/campaign/nocturne-gown-01-810.webp": [{ slug: "liquid-column-gown", label: "The Gown", x: 58, y: 30, len: 18 }],
  "/img/campaign/silver-seam-01-810.webp": [{ slug: "shawl-collar-dinner-jacket", label: "Silver Seam", x: 72, y: 42, len: 16, dir: "left" }],
  "/img/campaign/midnight-swirl-01-810.webp": [{ slug: "single-breasted-suit", label: "The Suit", x: 70, y: 38, len: 16, dir: "left" }],
  "/img/campaign/orbit-01-810.webp": [{ slug: "orbit-bandhgala", label: "Orbit", x: 72, y: 45, len: 16, dir: "left" }],
  "/img/campaign/noir-vine-01-810.webp": [{ slug: "noir-vine-bandhgala", label: "Noir Vine", x: 70, y: 38, len: 16, dir: "left" }],
};

/** The Work — keyed by the detail plate's slug. */
export const CRAFT_HOTS: Record<string, Hotspot[]> = {
  "silver-seam-detail": [{ slug: "shawl-collar-dinner-jacket", label: "Silver Seam", x: 62, y: 50, len: 18 }],
  "midnight-swirl-detail": [{ slug: "single-breasted-suit", label: "The Suit", x: 65, y: 35, len: 18 }],
  "tidemark-detail": [{ slug: "tidemark-sherwani", label: "Tidemark", x: 65, y: 50, len: 18 }],
  "vapour-gown-detail": [{ slug: "atelier-tuxedo-dress", label: "The Dress", x: 50, y: 72, len: 18 }],
};
