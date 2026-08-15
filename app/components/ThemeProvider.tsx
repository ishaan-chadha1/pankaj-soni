"use client";

import {
  createContext,
  useCallback,
  useContext,
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
 * ThemeScript has already written `data-theme` onto <html> before paint, so the
 * initial state is read back off the DOM rather than from localStorage — that
 * keeps this component's first render identical on server and client (both
 * produce DEFAULT_THEME) while the DOM already shows the right colours.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeId>(() => {
    if (typeof document === "undefined") return DEFAULT_THEME;
    const fromDom = document.documentElement.dataset.theme;
    return isThemeId(fromDom) ? fromDom : DEFAULT_THEME;
  });

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
