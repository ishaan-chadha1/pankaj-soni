"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { DEFAULT_THEME, THEME_KEY, isThemeId, type ThemeId } from "@/lib/themes";

type Ctx = {
  theme: ThemeId;
  setTheme: (t: ThemeId) => void;
};

const ThemeCtx = createContext<Ctx | null>(null);

/**
 * Owns the active palette.
 *
 * STARTS AT THE DEFAULT ON BOTH SIDES, and adopts the real one after mount.
 *
 * This used to read `data-theme` off <html> in the state initialiser, on the
 * reasoning that ThemeScript had already put the stored palette there. It had —
 * which is exactly the problem. The server rendered Bone and the client's first
 * render produced Sage, so the picker's own label was a text mismatch: React
 * threw away the server HTML, re-rendered the whole document from scratch, and
 * `data-theme` went with it. Every palette but the default reverted to Bone on
 * reload, and the site lost its server rendering on the way.
 *
 * Nothing flashes. ThemeScript has already painted the page in the right
 * colours before React runs; this state only drives the picker's own chip and
 * checkmark, which correct themselves a frame later. Same trade CartProvider
 * makes to read the bag out of localStorage.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeId>(DEFAULT_THEME);

  useEffect(() => {
    const fromDom = document.documentElement.dataset.theme;
    if (!isThemeId(fromDom) || fromDom === DEFAULT_THEME) return;
    // Unavoidable setState-in-effect: the stored palette cannot be known during
    // render without disagreeing with the server, which is the bug above.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setThemeState(fromDom);
  }, []);

  const setTheme = useCallback((t: ThemeId) => {
    setThemeState(t);
    document.documentElement.dataset.theme = t;
    try {
      localStorage.setItem(THEME_KEY, t);
    } catch {
      /* private mode — the palette just won't persist */
    }
  }, []);

  const value = useMemo(() => ({ theme, setTheme }), [theme, setTheme]);

  return <ThemeCtx.Provider value={value}>{children}</ThemeCtx.Provider>;
}

export function useTheme() {
  const c = useContext(ThemeCtx);
  if (!c) throw new Error("useTheme must be used inside <ThemeProvider>");
  return c;
}
