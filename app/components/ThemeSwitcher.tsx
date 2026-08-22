"use client";

import { useEffect, useRef, useState } from "react";
import { THEMES } from "@/lib/themes";
import { useTheme } from "./ThemeProvider";

/**
 * Palette picker. Each option is a three-band chip — ground, ink, accent — so
 * the choice is legible without applying it first.
 */
export default function ThemeSwitcher({ compact = false }: { compact?: boolean }) {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const wrap = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!wrap.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const active = THEMES.find((t) => t.id === theme) ?? THEMES[0];

  // Inline on mobile: no popover, just the row of chips.
  if (compact) {
    return (
      <div>
        <p className="ps-caps mb-4" style={{ fontSize: ".55rem", color: "var(--ps-accent)" }}>
          Palette
        </p>
        <div className="flex flex-wrap gap-3">
          {THEMES.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTheme(t.id)}
              aria-label={`${t.name} palette`}
              aria-pressed={t.id === theme}
              title={t.name}
              className="flex h-9 w-9 overflow-hidden rounded-full transition-transform ps-t-base"
              style={{
                outline: t.id === theme ? "1px solid var(--ps-accent)" : "1px solid var(--ps-line)",
                outlineOffset: 3,
                transform: t.id === theme ? "scale(1.08)" : undefined,
              }}
            >
              {t.swatch.map((c, i) => (
                <span key={i} className="h-full flex-1" style={{ background: c }} />
              ))}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div ref={wrap} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="true"
        aria-label={`Palette: ${active.name}. Change palette`}
        className="flex items-center gap-2.5 transition-opacity ps-t-base hover:opacity-70"
      >
        <span
          className="flex h-[18px] w-[18px] overflow-hidden rounded-full"
          style={{ outline: "1px solid var(--ps-line-strong)", outlineOffset: 2 }}
        >
          {active.swatch.map((c, i) => (
            <span key={i} className="h-full flex-1" style={{ background: c }} />
          ))}
        </span>
        <span className="ps-caps hidden xl:inline" style={{ fontSize: ".56rem" }}>
          {active.name}
        </span>
      </button>

      <div
        className="absolute right-0 top-[calc(100%+18px)] w-[262px] origin-top-right p-2"
        style={{
          background: "var(--ps-surface)",
          border: "1px solid var(--ps-line)",
          boxShadow: "0 18px 50px -20px rgba(0,0,0,.22)",
          opacity: open ? 1 : 0,
          transform: open ? "translateY(0) scale(1)" : "translateY(-8px) scale(.98)",
          pointerEvents: open ? "auto" : "none",
          transition: "opacity .45s var(--ease), transform .45s var(--ease)",
        }}
      >
        <p
          className="ps-caps px-3 pb-2 pt-3"
          style={{ fontSize: ".52rem", color: "var(--ps-faint)" }}
        >
          Palette
        </p>
        {THEMES.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => {
              setTheme(t.id);
              setOpen(false);
            }}
            aria-pressed={t.id === theme}
            className="flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors ps-t-fast"
            style={{ background: t.id === theme ? "var(--ps-accent-soft)" : "transparent" }}
          >
            <span
              className="flex h-6 w-6 shrink-0 overflow-hidden rounded-full"
              style={{ outline: "1px solid var(--ps-line)", outlineOffset: 1 }}
            >
              {t.swatch.map((c, i) => (
                <span key={i} className="h-full flex-1" style={{ background: c }} />
              ))}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[.82rem]">{t.name}</span>
              <span className="block truncate text-[.66rem]" style={{ color: "var(--ps-faint)" }}>
                {t.note}
              </span>
            </span>
            {t.id === theme ? (
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--ps-accent)" strokeWidth="2">
                <path d="M4 12.5l5.5 5.5L20 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : null}
          </button>
        ))}
      </div>
    </div>
  );
}
