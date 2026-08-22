"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useCallback, useMemo, useState } from "react";
import { bySlug, money } from "@/lib/catalog";
import { useCart } from "../CartProvider";
import type { FieldState } from "./Field";

// WebGL has no server-rendered equivalent, so the canvas is client-only.
const Field = dynamic(() => import("./Field"), { ssr: false });

type Fibre = {
  id: string;
  label: string;
  note: string;
  /** Yarn colour, and the slightly different tone the weft is dyed to. */
  warp: string;
  weft: string;
  sheen: number;
  nap: number;
  word: string;
};

type Weave = {
  id: string;
  label: string;
  note: string;
  /** Index into the shader's interlacing patterns. */
  pattern: number;
  openness: number;
  sheen: number;
  word: string;
};

type Finish = {
  id: string;
  label: string;
  note: string;
  nap: number;
  sheen: number;
  openness: number;
  word: string;
};

/* Warp and weft sit only a hair apart in tone. An earlier pass dyed them
   further apart and the specimen read as a CHECK — colour drew the grid, and
   the weave's own character disappeared under it. Cloth of one colour shows its
   structure through light and shadow, so the shading has to carry it and the
   dye has to get out of the way. */
const FIBRES: Fibre[] = [
  { id: "merino", label: "Merino", note: "Fine, springy, holds a crease", warp: "#bdb097", weft: "#b8ab92", sheen: 0.35, nap: 0.25, word: "Fine" },
  { id: "cashmere", label: "Cashmere", note: "Soft hand, low lustre", warp: "#cdbda6", weft: "#c8b8a1", sheen: 0.28, nap: 0.55, word: "Soft" },
  { id: "linen", label: "Linen", note: "Dry, slubbed, creases proudly", warp: "#c9c0a5", weft: "#c3ba9f", sheen: 0.2, nap: 0.08, word: "Dry" },
  { id: "silk", label: "Silk", note: "Long filament, high lustre", warp: "#dacdae", weft: "#d4c7a8", sheen: 1.0, nap: 0.03, word: "Liquid" },
  { id: "cotton", label: "Cotton", note: "Even, matte, hard-wearing", warp: "#d3ccbc", weft: "#cec7b7", sheen: 0.24, nap: 0.14, word: "Plain" },
  { id: "mohair", label: "Mohair", note: "Wiry, open, catches light", warp: "#c2b090", weft: "#bcaa8b", sheen: 0.72, nap: 0.3, word: "Open" },
];

const WEAVES: Weave[] = [
  { id: "poplin", label: "Poplin", note: "Plain weave — over one, under one", pattern: 0, openness: 0.1, sheen: 0.3, word: "Poplin" },
  { id: "twill", label: "Twill", note: "Steps one thread a row — the diagonal", pattern: 1, openness: 0.14, sheen: 0.5, word: "Twill" },
  { id: "satin", label: "Satin", note: "Binds once in five — long floats", pattern: 2, openness: 0.08, sheen: 1.0, word: "Satin" },
  { id: "grenadine", label: "Grenadine", note: "Leno — paired warps, open set", pattern: 3, openness: 0.62, sheen: 0.4, word: "Grenadine" },
  { id: "gabardine", label: "Gabardine", note: "Steep twill, tightly set", pattern: 4, openness: 0.05, sheen: 0.62, word: "Gabardine" },
  { id: "flannel", label: "Flannel", note: "Plain ground, raised and napped", pattern: 5, openness: 0.12, sheen: 0.18, word: "Flannel" },
];

const FINISHES: Finish[] = [
  { id: "milled", label: "Milled", note: "Shrunk in warm water, closed up", nap: 0.4, sheen: 0.3, openness: -0.06, word: "Milled" },
  { id: "brushed", label: "Brushed", note: "Teasels lift the fibre", nap: 0.95, sheen: 0.15, openness: 0.0, word: "Brushed" },
  { id: "washed", label: "Washed", note: "Softened, the hand relaxed", nap: 0.35, sheen: 0.2, openness: 0.06, word: "Washed" },
  { id: "calendered", label: "Calendered", note: "Pressed under heated rollers", nap: 0.02, sheen: 0.95, openness: -0.04, word: "Calendered" },
  { id: "raw", label: "Raw", note: "Off the loom, nothing done", nap: 0.12, sheen: 0.1, openness: 0.1, word: "Raw" },
  { id: "pressed", label: "Pressed", note: "Flat, even, quietly lustrous", nap: 0.06, sheen: 0.6, openness: -0.02, word: "Pressed" },
];

/** Which piece the house would cut a given weave into. */
const NEAREST: Record<string, string> = {
  poplin: "poplin-shirt",
  twill: "single-breasted-suit",
  satin: "liquid-column-gown",
  grenadine: "silk-tie",
  gabardine: "belted-trench",
  flannel: "unstructured-topcoat",
};

/* Magnification. Thread counts are what the shader draws across the frame, so a
   lower number is a closer lens. */
const LENSES = [
  { id: "1", label: "×1", note: "As worn", threads: 92 },
  { id: "4", label: "×4", note: "In the hand", threads: 32 },
  { id: "12", label: "×12", note: "Under the glass", threads: 11 },
];

export default function Engine() {
  const { add } = useCart();
  const [fibre, setFibre] = useState(FIBRES[1]);
  const [weave, setWeave] = useState(WEAVES[1]);
  const [finish, setFinish] = useState(FINISHES[0]);
  const [weight, setWeight] = useState(0.55);
  const [lens, setLens] = useState(LENSES[1]);
  const [added, setAdded] = useState(false);

  const field: FieldState = useMemo(
    () => ({
      warp: fibre.warp,
      weft: fibre.weft,
      ground: "#efe9dd",
      weave: weave.pattern,
      threads: lens.threads,
      // Napping is the finish's job; the fibre only decides how much there is
      // to raise in the first place.
      nap: Math.min(1, finish.nap * (0.5 + fibre.nap)),
      // Sheen is the product of all three — a matte fibre cannot be made to
      // shine by pressing it.
      sheen: Math.min(1.2, fibre.sheen * weave.sheen * (0.5 + finish.sheen) * 2.1),
      // A heavier cloth is set tighter, so it closes up.
      openness: Math.max(0, weave.openness + finish.openness - weight * 0.08),
    }),
    [fibre, weave, finish, weight, lens]
  );

  const name = `${finish.word} ${weave.word}`;
  const nearest = bySlug(NEAREST[weave.id] ?? "single-breasted-suit")!;
  // Cloth is sold by weight; 260–580g covers shirting through overcoating.
  const grams = Math.round(260 + weight * 320);
  const useCase = grams < 330 ? "Shirting" : grams < 450 ? "Suiting" : "Overcoating";

  const commission = useCallback(() => {
    const v = nearest.variants[Math.floor((nearest.variants.length - 1) / 2)] ?? nearest.variants[0];
    add(nearest.slug, v.id, 1);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1800);
  }, [add, nearest]);

  return (
    <section className="mx-auto max-w-[1560px] px-5 pb-[var(--band-l)] pt-[var(--band-m)] sm:px-8">
      <div className="max-w-[640px]">
        <p className="ps-caps" style={{ color: "var(--ps-accent)" }}>
          The Cloth Room
        </p>
        <h1 className="ps-display ps-h2 mt-5">
          Specify the cloth
          <br />
          <span className="ps-display-i">before the cut.</span>
        </h1>
        <p
          className="mt-5 max-w-[54ch] text-[.92rem] font-light leading-relaxed"
          style={{ color: "var(--ps-muted)" }}
        >
          A fibre, a weave and a finish. The specimen is woven live — thread by
          thread, not a picture of cloth — so the diagonal in a twill and the
          floats in a satin are really there. Put it under the glass and look.
        </p>
      </div>

      {/* console left, specimen right */}
      <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,380px)_minmax(0,1fr)] lg:gap-8">
        {/* ── the specimen ── */}
        <div className="order-1 lg:order-2">
          <div
            className="ps-loom relative w-full overflow-hidden"
            style={{ aspectRatio: "4 / 3", border: "1px solid var(--ps-line)" }}
          >
            {/* Flat ground, and the fallback if WebGL is unavailable. */}
            <div className="absolute inset-0" style={{ background: fibre.warp }} />
            <Field state={field} />

            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5"
              style={{
                background: "linear-gradient(0deg, rgba(255,255,255,.82), transparent)",
              }}
            >
              <div>
                <p className="ps-caps" style={{ fontSize: ".52rem", color: "var(--ps-muted)" }}>
                  Specimen — {lens.note}
                </p>
                <p className="ps-display mt-1 text-[1.5rem] leading-none">{name}</p>
              </div>
              <p className="ps-caps" style={{ fontSize: ".52rem", color: "var(--ps-muted)" }}>
                {grams} g · {useCase}
              </p>
            </div>
          </div>

          {/* magnification */}
          <div className="mt-3 flex items-center gap-2">
            <p className="ps-caps mr-1" style={{ fontSize: ".52rem", color: "var(--ps-faint)" }}>
              Lens
            </p>
            {LENSES.map((l) => (
              <button
                key={l.id}
                type="button"
                onClick={() => setLens(l)}
                aria-pressed={l.id === lens.id}
                className="ps-chip !px-3 !py-1.5"
                style={{ fontSize: ".58rem" }}
              >
                {l.label}
              </button>
            ))}
            <p className="ps-caps ml-auto" style={{ fontSize: ".52rem", color: "var(--ps-faint)" }}>
              Drag across the cloth
            </p>
          </div>

          {/* the specification, read back */}
          <div
            className="mt-6 grid gap-x-8 gap-y-4 p-6 sm:grid-cols-2"
            style={{ border: "1px solid var(--ps-line)", background: "var(--ps-surface)" }}
          >
            <Row k="Fibre" v={fibre.label} note={fibre.note} />
            <Row k="Weave" v={weave.label} note={weave.note} />
            <Row k="Finish" v={finish.label} note={finish.note} />
            <Row k="Weight" v={`${grams} g / m²`} note={`Suited to ${useCase.toLowerCase()}`} />
          </div>

          {/* what the house would cut it into */}
          <div
            className="mt-3 flex flex-wrap items-center gap-5 p-5"
            style={{ border: "1px solid var(--ps-line)" }}
          >
            <Link href={`/p/${nearest.slug}`} className="ps-media h-[92px] w-[72px] shrink-0">
              <img src={nearest.image} alt="" loading="lazy" decoding="async" />
            </Link>
            <div className="min-w-0 flex-1">
              <p className="ps-caps" style={{ fontSize: ".52rem", color: "var(--ps-accent)" }}>
                Cut into
              </p>
              <Link href={`/p/${nearest.slug}`} className="ps-display mt-1 block text-[1.15rem]">
                {nearest.name}
              </Link>
              <p className="mt-1 text-[.74rem]" style={{ color: "var(--ps-muted)" }}>
                {nearest.kicker} · {money(nearest.price)}
              </p>
            </div>
            <button type="button" onClick={commission} className="ps-btn ps-btn-solid shrink-0 !px-6 !py-3">
              <span>{added ? "Added" : "Add to Bag"}</span>
            </button>
          </div>
        </div>

        {/* ── the console ── */}
        <div className="order-2 lg:order-1">
          <div className="p-6" style={{ border: "1px solid var(--ps-line)", background: "var(--ps-surface)" }}>
            <Bank title="Fibre" items={FIBRES} value={fibre.id} onPick={setFibre} swatch={(f) => f.warp} />
            <Bank title="Weave" items={WEAVES} value={weave.id} onPick={setWeave} className="mt-7" />
            <Bank title="Finish" items={FINISHES} value={finish.id} onPick={setFinish} className="mt-7" />

            <div className="mt-8 pt-6" style={{ borderTop: "1px solid var(--ps-line)" }}>
              <div className="flex items-center justify-between">
                <label htmlFor="weight" className="ps-caps" style={{ fontSize: ".54rem" }}>
                  Weight
                </label>
                <span className="ps-caps" style={{ fontSize: ".54rem", color: "var(--ps-accent)" }}>
                  {grams} g
                </span>
              </div>
              <input
                id="weight"
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                className="mt-3 w-full accent-[var(--ps-accent)]"
              />
              <div className="mt-1.5 flex justify-between">
                {["Shirting", "Suiting", "Overcoating"].map((t) => (
                  <span
                    key={t}
                    className="ps-caps"
                    style={{
                      fontSize: ".5rem",
                      color: t === useCase ? "var(--ps-accent)" : "var(--ps-faint)",
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────── */

function Row({ k, v, note }: { k: string; v: string; note: string }) {
  return (
    <div style={{ borderTop: "1px solid var(--ps-line)" }} className="pt-3">
      <p className="ps-caps" style={{ fontSize: ".5rem", color: "var(--ps-faint)" }}>
        {k}
      </p>
      <p className="ps-display mt-1 text-[1.1rem] leading-none">{v}</p>
      <p className="mt-1.5 text-[.72rem] font-light" style={{ color: "var(--ps-muted)" }}>
        {note}
      </p>
    </div>
  );
}

/**
 * One bank of the console. Module scope, not nested in Engine — defined inside
 * it would remount every tile on each keystroke of the weight slider.
 */
function Bank<T extends { id: string; label: string; note: string }>({
  title,
  items,
  value,
  onPick,
  swatch,
  className,
}: {
  title: string;
  items: T[];
  value: string;
  onPick: (t: T) => void;
  swatch?: (t: T) => string;
  className?: string;
}) {
  return (
    <div className={className}>
      <p className="ps-caps mb-3" style={{ fontSize: ".54rem", color: "var(--ps-accent)" }}>
        {title}
      </p>
      <div className="grid grid-cols-2 gap-1.5">
        {items.map((t) => {
          const on = t.id === value;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => onPick(t)}
              aria-pressed={on}
              title={t.note}
              className="ps-t-fast flex items-center gap-2 px-2.5 py-2 text-left"
              style={{
                border: `1px solid ${on ? "var(--ps-text)" : "var(--ps-line)"}`,
                background: on ? "var(--ps-text)" : "transparent",
                color: on ? "var(--ps-bg)" : "var(--ps-text)",
              }}
            >
              {swatch ? (
                <span
                  className="block h-3.5 w-3.5 shrink-0"
                  style={{ background: swatch(t), outline: "1px solid rgba(0,0,0,.12)" }}
                />
              ) : null}
              <span className="truncate text-[.74rem]">{t.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
