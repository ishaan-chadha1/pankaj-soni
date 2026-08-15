/**
 * The palette roster.
 *
 * `id` must match a `[data-theme="…"]` block in globals.css. The swatch colours
 * here are only for the picker UI — the real palette lives in CSS, so a theme is
 * added by writing one CSS block and one row in this array.
 */

export type ThemeId =
  | "bone"
  | "porcelain"
  | "blush"
  | "sand"
  | "sage"
  | "alabaster";

export type Theme = {
  id: ThemeId;
  name: string;
  note: string;
  /** [ground, ink, accent] — drawn as a three-band chip in the picker. */
  swatch: [string, string, string];
};

export const THEMES: Theme[] = [
  {
    id: "bone",
    name: "Bone",
    note: "Warm paper, antique gold",
    swatch: ["#faf7f1", "#1a1713", "#856a28"],
  },
  {
    id: "porcelain",
    name: "Porcelain",
    note: "Cool white, slate blue",
    swatch: ["#f7f9fb", "#14181c", "#4d7288"],
  },
  {
    id: "blush",
    name: "Blush",
    note: "Pale rose, deep berry",
    swatch: ["#fbf4f2", "#26161b", "#a5495f"],
  },
  {
    id: "sand",
    name: "Sand",
    note: "Desert linen, burnt clay",
    swatch: ["#f8f1e5", "#241d14", "#9c552a"],
  },
  {
    id: "sage",
    name: "Sage",
    note: "Cool green, deep moss",
    swatch: ["#f3f6f1", "#18211a", "#4e7048"],
  },
  {
    id: "alabaster",
    name: "Alabaster",
    note: "Pure editorial, no colour",
    swatch: ["#fcfcfa", "#111111", "#111111"],
  },
];

export const DEFAULT_THEME: ThemeId = "bone";
export const THEME_KEY = "ps-theme";

export const isThemeId = (v: unknown): v is ThemeId =>
  typeof v === "string" && THEMES.some((t) => t.id === v);
