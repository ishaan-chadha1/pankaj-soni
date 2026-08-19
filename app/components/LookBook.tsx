"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { LOOKS, LOOK_ASPECT, type Hotspot } from "@/lib/looks";
import { bySlug, money } from "@/lib/catalog";

/**
 * The shoppable campaign.
 *
 * Each garment carries a marker; a hairline draws out from it into empty frame
 * — the same gesture the entry curtain makes — and opens a card that links
 * through to the listing.
 *
 * The frame keeps the source aspect ratio instead of cropping to fill. Hotspot
 * coordinates are percentages of the image, so an `object-cover` crop would
 * walk every marker off its garment as soon as the viewport changed shape.
 */
export default function LookBook() {
  const [look, setLook] = useState(0);
  const [open, setOpen] = useState<string | null>(null);
  const frame = useRef<HTMLDivElement | null>(null);

  const active = LOOKS[look];

  // Changing look must drop any open card — the marker it belonged to is gone.
  const chooseLook = useCallback((i: number) => {
    setLook(i);
    setOpen(null);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
    };
    const onDown = (e: MouseEvent) => {
      if (!frame.current?.contains(e.target as Node)) setOpen(null);
    };
    window.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onDown);
    };
  }, []);

  return (
    <section className="relative">
      <div className="mx-auto max-w-[1560px] px-5 pt-10 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="ps-caps" style={{ color: "var(--ps-accent)" }}>
              The Campaign — Autumn
            </p>
            <h2 className="ps-display ps-h2 mt-4">{active.title}</h2>
          </div>
          <p className="max-w-[34ch] text-[.84rem] font-light" style={{ color: "var(--ps-muted)" }}>
            Every piece in the frame is marked. Open one to see it.
          </p>
        </div>
      </div>

      {/* ── the frame ── */}
      <div className="mx-auto mt-8 max-w-[1560px] px-5 sm:px-8">
        <div
          ref={frame}
          className="ps-look relative w-full overflow-hidden"
          style={{ aspectRatio: LOOK_ASPECT, background: "var(--ps-bg-alt)" }}
        >
          {LOOKS.map((l, i) => (
            <img
              key={l.id}
              src={l.image}
              alt={i === look ? l.alt : ""}
              aria-hidden={i !== look}
              loading={i === 0 ? "eager" : "lazy"}
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover"
              style={{
                opacity: i === look ? 1 : 0,
                transition: "opacity 1.1s var(--ease)",
              }}
            />
          ))}

          {/* markers */}
          {active.hotspots.map((h, i) => (
            <Marker
              key={`${active.id}-${h.slug}`}
              hot={h}
              index={i}
              open={open === h.slug}
              onToggle={() => setOpen((cur) => (cur === h.slug ? null : h.slug))}
            />
          ))}
        </div>

        {/* ── look switcher ── */}
        <div className="mt-6 flex items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            {LOOKS.map((l, i) => (
              <button
                key={l.id}
                type="button"
                onClick={() => chooseLook(i)}
                aria-label={`${l.eyebrow} — ${l.title}`}
                aria-current={i === look}
                className="ps-tap group relative block h-[58px] w-[58px] overflow-hidden sm:h-[66px] sm:w-[66px]"
                style={{
                  outline: i === look ? "1px solid var(--ps-accent)" : "1px solid var(--ps-line)",
                  outlineOffset: 3,
                }}
              >
                <img
                  src={l.thumb}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover transition-opacity duration-500"
                  style={{ opacity: i === look ? 1 : 0.5 }}
                />
              </button>
            ))}
          </div>

          <p className="ps-caps" style={{ fontSize: ".54rem", color: "var(--ps-faint)" }}>
            {active.eyebrow} — {active.hotspots.length} pieces
          </p>
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────── */

function Marker({
  hot,
  index,
  open,
  onToggle,
}: {
  hot: Hotspot;
  index: number;
  open: boolean;
  onToggle: () => void;
}) {
  const product = bySlug(hot.slug);
  if (!product) return null;

  const len = hot.len ?? 150;
  // Cards open away from the body: markers on the right half open right.
  const flip = hot.x > 50;

  return (
    <div
      className="ps-hot"
      style={{
        left: `${hot.x}%`,
        top: `${hot.y}%`,
        // stagger the lines in so they draw one after another
        ["--hot-delay" as string]: `${600 + index * 130}ms`,
      }}
      data-open={open}
    >
      {/* leader line + end label, rotated together */}
      <span className="ps-hot-arm" style={{ transform: `rotate(${hot.angle}deg)` }}>
        <span className="ps-hot-line" style={{ width: len }} />
        <span
          className="ps-hot-label ps-caps"
          style={{
            left: len,
            transform: `rotate(${-hot.angle}deg) translate(${flip ? "0" : "-100%"}, -50%)`,
          }}
        >
          {hot.label}
        </span>
      </span>

      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-label={`${product.name}, ${money(product.price)} — open details`}
        className="ps-hot-dot"
      />

      {open ? (
        <div
          className="ps-hot-card"
          style={{
            left: flip ? "auto" : 28,
            right: flip ? 28 : "auto",
          }}
        >
          <Link href={`/p/${product.slug}`} className="flex gap-4">
            <span className="ps-media h-[96px] w-[74px] shrink-0">
              <img src={product.image} alt="" loading="lazy" decoding="async" />
            </span>
            <span className="flex min-w-0 flex-1 flex-col">
              <span className="ps-caps" style={{ fontSize: ".5rem", color: "var(--ps-accent)" }}>
                {product.line}
              </span>
              <span className="ps-display mt-1 block text-[1.05rem] leading-tight">
                {product.name}
              </span>
              <span className="mt-1 text-[.72rem]" style={{ color: "var(--ps-muted)" }}>
                {product.kicker}
              </span>
              <span className="mt-auto pt-2 text-[.8rem]">{money(product.price)}</span>
            </span>
          </Link>
          <Link
            href={`/p/${product.slug}`}
            className="ps-caps ps-link ps-link-on mt-3 inline-block"
            style={{ fontSize: ".54rem" }}
          >
            View product
          </Link>
        </div>
      ) : null}
    </div>
  );
}
