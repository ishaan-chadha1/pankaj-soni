"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { bySlug, money } from "@/lib/catalog";
import { useCart } from "../CartProvider";
import type { FieldState } from "./Field";

// WebGL has no server-rendered equivalent, so the canvas is client-only.
const Field = dynamic(() => import("./Field"), { ssr: false });

type Note = {
  id: string;
  label: string;
  color: string;
  /** How much this note agitates the field. */
  turb: number;
  /** How much light it pushes into the hot cores. */
  density: number;
  word: string;
};

/* Pigments, not inks. The shader tints a pale sheet, so these sit in the mid
   range — a near-black base note would punch a hole in the field rather than
   colour it. The swatch dots in the picker use the same values, which is why
   they read as a chalk palette. */
const TOP: Note[] = [
  { id: "bergamot", label: "Bergamot", color: "#b9c96f", turb: 0.9, density: 0.7, word: "Bright" },
  { id: "pepper", label: "Pink Pepper", color: "#d97f76", turb: 1.35, density: 0.9, word: "Sharp" },
  { id: "saffron", label: "Saffron", color: "#e0a94e", turb: 1.1, density: 1.0, word: "Gilded" },
  { id: "plum", label: "Black Plum", color: "#9c5a72", turb: 0.75, density: 0.8, word: "Dark" },
  { id: "salt", label: "Sea Salt", color: "#a6bcc6", turb: 1.2, density: 0.55, word: "Cold" },
  { id: "cardamom", label: "Cardamom", color: "#c0b184", turb: 1.0, density: 0.7, word: "Spiced" },
];

const HEART: Note[] = [
  { id: "rose", label: "Turkish Rose", color: "#cc6a80", turb: 0.85, density: 0.9, word: "Rose" },
  { id: "orris", label: "Orris Butter", color: "#e2d9cb", turb: 0.55, density: 0.6, word: "Powder" },
  { id: "jasmine", label: "Jasmine Sambac", color: "#ece5bc", turb: 0.9, density: 0.95, word: "Bloom" },
  { id: "suede", label: "Suede", color: "#b8906e", turb: 0.5, density: 0.5, word: "Velvet" },
  { id: "tobacco", label: "Tobacco Leaf", color: "#b07d4a", turb: 0.7, density: 0.65, word: "Vesper" },
  { id: "cedar", label: "Smoked Cedar", color: "#8a9a74", turb: 0.65, density: 0.5, word: "Cedar" },
];

const BASE: Note[] = [
  { id: "leather", label: "Tanned Leather", color: "#a17a5e", turb: 0.45, density: 0.55, word: "Impérial" },
  { id: "oud", label: "Laotian Oud", color: "#8e7058", turb: 0.35, density: 0.45, word: "Silence" },
  { id: "amber", label: "Amber", color: "#dcae62", turb: 0.6, density: 0.85, word: "Meridian" },
  { id: "vetiver", label: "Vetiver Root", color: "#8b9670", turb: 0.55, density: 0.5, word: "Absolute" },
  { id: "tonka", label: "Tonka Bean", color: "#bd9668", turb: 0.5, density: 0.75, word: "Privé" },
  { id: "ambergris", label: "Ambergris", color: "#c2b89b", turb: 0.4, density: 0.6, word: "Nocturne" },
];

/** Which flacon the maison would actually pour a given base into. */
const NEAREST: Record<string, string> = {
  leather: "noir-imperial",
  oud: "oud-silence",
  amber: "amber-meridian",
  vetiver: "cedar-absolute",
  tonka: "tobacco-vesper",
  ambergris: "white-oud",
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
  notes: Note[];
  value: Note;
  onChange: (n: Note) => void;
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
  const [top, setTop] = useState(TOP[2]);
  const [heart, setHeart] = useState(HEART[3]);
  const [base, setBase] = useState(BASE[0]);
  const [intensity, setIntensity] = useState(0.62);

  const field: FieldState = useMemo(
    () => ({
      a: base.color,
      b: heart.color,
      c: top.color,
      turbulence: (top.turb + heart.turb + base.turb) / 3 + intensity * 1.6,
      density: ((top.density + heart.density + base.density) / 3) * (0.55 + intensity),
    }),
    [top, heart, base, intensity]
  );

  const name = `${heart.word} ${base.word}`;
  const nearest = bySlug(NEAREST[base.id] ?? "noir-imperial")!;
  const strength = Math.round(18 + intensity * 14);

  const commission = () => {
    const v = nearest.variants.find((x) => x.id === "50") ?? nearest.variants[0];
    add(nearest.slug, v.id, 1);
  };

  return (
    <section className="relative min-h-[100svh] w-full overflow-hidden">
      {/* CSS ground: also the fallback if WebGL is unavailable */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(120% 90% at 62% 34%, ${top.color}30, transparent 60%),
                       radial-gradient(90% 80% at 30% 70%, ${heart.color}38, transparent 62%),
                       linear-gradient(160deg, ${base.color}44, var(--ps-bg) 74%)`,
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
            The Olfactory Engine — Beta
          </p>
          <h1 className="ps-display mt-6 text-[2.6rem] leading-[0.98] sm:text-[4.2rem]">
            Build the thing you
            <br />
            <span className="ps-display-i">cannot describe.</span>
          </h1>
          <p className="mt-6 max-w-[50ch] text-[.92rem] font-light leading-relaxed" style={{ color: "var(--ps-muted)" }}>
            Three choices — a top, a heart, a base. The field above is the composition
            rendered in real time: colour from the materials, movement from their
            volatility. Move your cursor through it.
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
            <Column title="Top" notes={TOP} value={top} onChange={setTop} />
            <Column title="Heart" notes={HEART} value={heart} onChange={setHeart} />
            <Column title="Base" notes={BASE} value={base} onChange={setBase} />

            {/* readout */}
            <div className="lg:border-l lg:pl-12" style={{ borderColor: "var(--ps-line)" }}>
              <p className="ps-caps mb-4" style={{ fontSize: ".55rem", color: "var(--ps-accent)" }}>
                Your Composition
              </p>

              <p className="ps-display text-[2.1rem] leading-none">{name}</p>
              <p className="mt-3 text-[.8rem] font-light" style={{ color: "var(--ps-muted)" }}>
                {top.label} · {heart.label} · {base.label}
              </p>

              <div className="mt-7">
                <div className="flex items-center justify-between">
                  <label htmlFor="intensity" className="ps-caps" style={{ fontSize: ".54rem" }}>
                    Concentration
                  </label>
                  <span className="ps-caps" style={{ fontSize: ".54rem", color: "var(--ps-accent)" }}>
                    {strength}%
                  </span>
                </div>
                <input
                  id="intensity"
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={intensity}
                  onChange={(e) => setIntensity(Number(e.target.value))}
                  className="mt-3 w-full accent-[var(--ps-accent)]"
                />
                <p className="mt-2 text-[.68rem]" style={{ color: "var(--ps-faint)" }}>
                  {strength < 24 ? "Eau de Parfum" : strength < 29 ? "Extrait léger" : "Extrait de Parfum"}
                </p>
              </div>

              <div className="mt-8 pt-6" style={{ borderTop: "1px solid var(--ps-line)" }}>
                <p className="text-[.74rem] font-light" style={{ color: "var(--ps-muted)" }}>
                  Closest in the Private Atelier
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
                  <span>Add 50 ml to Bag</span>
                </button>
              </div>
            </div>
          </div>

          <p className="ps-caps mt-5 text-center" style={{ fontSize: ".52rem", color: "var(--ps-faint)" }}>
            Rendered live in WebGL — colour and turbulence are driven by the materials you select
          </p>
        </div>
      </div>
    </section>
  );
}
