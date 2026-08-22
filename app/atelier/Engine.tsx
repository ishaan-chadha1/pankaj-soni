"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { bySlug, money } from "@/lib/catalog";
import { useCart } from "../CartProvider";
import type { FieldState } from "./Field";

// WebGL has no server-rendered equivalent, so the canvas is client-only.
const Field = dynamic(() => import("./Field"), { ssr: false });

type Material = {
  id: string;
  label: string;
  color: string;
  /** How restless the cloth is — how much the field moves. */
  drape: number;
  /** How much light the surface throws back. */
  sheen: number;
  word: string;
};

/* Cloth colours, not dyes. The shader tints a pale sheet, so these sit in the
   mid range — a near-black would punch a hole in the field rather than colour
   it. The swatch beside each name uses the same value. */
const FIBRE: Material[] = [
  { id: "merino", label: "Merino", color: "#c9bda6", drape: 0.9, sheen: 0.55, word: "Fine" },
  { id: "cashmere", label: "Cashmere", color: "#d8c9b4", drape: 0.55, sheen: 0.7, word: "Soft" },
  { id: "linen", label: "Linen", color: "#cfc7ae", drape: 1.3, sheen: 0.4, word: "Dry" },
  { id: "silk", label: "Silk", color: "#e2d6bb", drape: 1.1, sheen: 1.0, word: "Liquid" },
  { id: "cotton", label: "Cotton", color: "#ddd6c6", drape: 0.95, sheen: 0.5, word: "Plain" },
  { id: "mohair", label: "Mohair", color: "#c6b79b", drape: 1.2, sheen: 0.85, word: "Open" },
];

const WEAVE: Material[] = [
  { id: "twill", label: "Twill", color: "#b09a76", drape: 0.85, sheen: 0.6, word: "Twill" },
  { id: "poplin", label: "Poplin", color: "#cdc3ad", drape: 0.6, sheen: 0.55, word: "Poplin" },
  { id: "flannel", label: "Flannel", color: "#9aa0a4", drape: 0.5, sheen: 0.35, word: "Flannel" },
  { id: "grenadine", label: "Grenadine", color: "#8c7f95", drape: 1.0, sheen: 0.7, word: "Grenadine" },
  { id: "gabardine", label: "Gabardine", color: "#a89478", drape: 0.7, sheen: 0.65, word: "Gabardine" },
  { id: "satin", label: "Satin", color: "#dcc9a8", drape: 1.15, sheen: 1.0, word: "Satin" },
];

const FINISH: Material[] = [
  { id: "milled", label: "Milled", color: "#a4907a", drape: 0.5, sheen: 0.5, word: "Milled" },
  { id: "brushed", label: "Brushed", color: "#b3a894", drape: 0.45, sheen: 0.4, word: "Brushed" },
  { id: "washed", label: "Washed", color: "#b7b2a2", drape: 0.8, sheen: 0.35, word: "Washed" },
  { id: "calendered", label: "Calendered", color: "#cfc2a4", drape: 0.6, sheen: 0.95, word: "Calendered" },
  { id: "raw", label: "Raw", color: "#9d9583", drape: 1.0, sheen: 0.3, word: "Raw" },
  { id: "pressed", label: "Pressed", color: "#c5b697", drape: 0.55, sheen: 0.75, word: "Pressed" },
];

/** Which piece the house would actually cut a given finish into. */
const NEAREST: Record<string, string> = {
  milled: "double-face-overcoat",
  brushed: "cashmere-crewneck",
  washed: "poplin-shirt",
  calendered: "liquid-column-gown",
  raw: "shearling-blouson",
  pressed: "single-breasted-suit",
};

/** One column of selectable materials. Module scope: defining it inside Engine
 *  would remount the whole column on every state change. */
function Column({
  title,
  notes,
  value,
  onChange,
}: {
  title: string;
  notes: Material[];
  value: Material;
  onChange: (n: Material) => void;
}) {
  return (
    <div>
      <p className="ps-caps mb-4" style={{ fontSize: ".55rem", color: "var(--ps-accent)" }}>
        {title}
      </p>
      <div className="space-y-1.5">
        {notes.map((n) => {
          const on = n.id === value.id;
          return (
            <button
              key={n.id}
              type="button"
              onClick={() => onChange(n)}
              aria-pressed={on}
              className="group flex w-full items-center gap-3 py-1.5 text-left transition-opacity ps-t-base"
              style={{ opacity: on ? 1 : 0.5 }}
            >
              <span
                className="block h-2.5 w-2.5 shrink-0 rounded-full transition-transform ps-t-base"
                style={{
                  background: n.color,
                  transform: on ? "scale(1.5)" : "scale(1)",
                  boxShadow: on ? `0 0 14px ${n.color}` : "none",
                }}
              />
              <span className="text-[.84rem] font-light">{n.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function Engine() {
  const { add } = useCart();
  const [fibre, setFibre] = useState(FIBRE[1]);
  const [weave, setWeave] = useState(WEAVE[0]);
  const [finish, setFinish] = useState(FINISH[0]);
  const [weight, setWeight] = useState(0.55);

  const field: FieldState = useMemo(
    () => ({
      a: finish.color,
      b: weave.color,
      c: fibre.color,
      // A heavier cloth moves less and throws back more light.
      turbulence: (fibre.drape + weave.drape + finish.drape) / 3 + (1 - weight) * 1.4,
      density: ((fibre.sheen + weave.sheen + finish.sheen) / 3) * (0.55 + weight),
    }),
    [fibre, weave, finish, weight]
  );

  const name = `${finish.word} ${weave.word}`;
  const nearest = bySlug(NEAREST[finish.id] ?? "double-face-overcoat")!;
  // Cloth is sold by weight; 280–560g covers shirting through overcoating.
  const grams = Math.round(280 + weight * 280);

  const commission = () => {
    const v = nearest.variants[Math.floor((nearest.variants.length - 1) / 2)] ?? nearest.variants[0];
    add(nearest.slug, v.id, 1);
  };

  return (
    <section className="relative min-h-[100svh] w-full overflow-hidden">
      {/* CSS ground: also the fallback if WebGL is unavailable */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(120% 90% at 62% 34%, ${fibre.color}30, transparent 60%),
                       radial-gradient(90% 80% at 30% 70%, ${weave.color}38, transparent 62%),
                       linear-gradient(160deg, ${finish.color}44, var(--ps-bg) 74%)`,
          transition: "background 1.2s cubic-bezier(.16,1,.3,1)",
        }}
      />

      <Field state={field} />

      {/* readability scrim */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,.55) 0%, rgba(255,255,255,.14) 30%, rgba(255,255,255,.42) 62%, var(--ps-bg) 100%)",
        }}
      />

      <div className="relative z-[2] mx-auto flex min-h-[100svh] max-w-[1560px] flex-col px-5 pb-14 pt-16 sm:px-8">
        {/* heading */}
        <div className="max-w-[700px]">
          <p className="ps-caps" style={{ color: "var(--ps-accent)" }}>
            The Cloth Room — Beta
          </p>
          <h1 className="ps-display mt-6 text-[2.6rem] leading-[0.98] sm:text-[4.2rem]">
            Build the thing you
            <br />
            <span className="ps-display-i">cannot describe.</span>
          </h1>
          <p className="mt-6 max-w-[50ch] text-[.92rem] font-light leading-relaxed" style={{ color: "var(--ps-muted)" }}>
            Three choices — a fibre, a weave, a finish. The field above is the cloth
            rendered in real time: colour from the fibre, movement from how it
            drapes, light from how it is finished. Move your cursor through it.
          </p>
        </div>

        {/* console */}
        <div className="mt-auto pt-16">
          <div
            className="grid gap-10 p-7 sm:p-9 lg:grid-cols-[1fr_1fr_1fr_1.15fr] lg:gap-12"
            style={{
              background: "rgba(255,255,255,.72)",
              backdropFilter: "blur(22px) saturate(130%)",
              border: "1px solid var(--ps-line)",
            }}
          >
            <Column title="Fibre" notes={FIBRE} value={fibre} onChange={setFibre} />
            <Column title="Weave" notes={WEAVE} value={weave} onChange={setWeave} />
            <Column title="Finish" notes={FINISH} value={finish} onChange={setFinish} />

            {/* readout */}
            <div className="lg:border-l lg:pl-12" style={{ borderColor: "var(--ps-line)" }}>
              <p className="ps-caps mb-4" style={{ fontSize: ".55rem", color: "var(--ps-accent)" }}>
                Your Cloth
              </p>

              <p className="ps-display text-[2.1rem] leading-none">{name}</p>
              <p className="mt-3 text-[.8rem] font-light" style={{ color: "var(--ps-muted)" }}>
                {fibre.label} · {weave.label} · {finish.label}
              </p>

              <div className="mt-7">
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
                <p className="mt-2 text-[.68rem]" style={{ color: "var(--ps-faint)" }}>
                  {grams < 340 ? "Shirting" : grams < 440 ? "Suiting" : "Overcoating"}
                </p>
              </div>

              <div className="mt-8 pt-6" style={{ borderTop: "1px solid var(--ps-line)" }}>
                <p className="text-[.74rem] font-light" style={{ color: "var(--ps-muted)" }}>
                  Closest in the collection
                </p>
                <div className="mt-3 flex items-center gap-4">
                  <Link href={`/p/${nearest.slug}`} className="ps-media h-16 w-14 shrink-0">
                    <img src={nearest.image} alt={nearest.name} loading="lazy" decoding="async" />
                  </Link>
                  <div className="flex-1">
                    <Link href={`/p/${nearest.slug}`} className="ps-display block text-[1.05rem]">
                      {nearest.name}
                    </Link>
                    <p className="text-[.72rem]" style={{ color: "var(--ps-faint)" }}>
                      From {money(nearest.variants[0].price)}
                    </p>
                  </div>
                </div>

                <button type="button" onClick={commission} className="ps-btn ps-btn-solid mt-5 w-full !py-3">
                  <span>Add to Bag</span>
                </button>
              </div>
            </div>
          </div>

          <p className="ps-caps mt-5 text-center" style={{ fontSize: ".52rem", color: "var(--ps-faint)" }}>
            Rendered live in WebGL — drape and light are driven by the cloth you specify
          </p>
        </div>
      </div>
    </section>
  );
}
