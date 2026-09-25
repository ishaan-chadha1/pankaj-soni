"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { FILMS, filmMp4, filmPoster } from "@/lib/films";

/**
 * A room's opening: its name set across the window, its film held in a
 * portrait box over the middle of it, and the box drawn out to the full
 * height of the window as you scroll — the home hero's gesture, turned
 * upright for footage that was shot upright.
 *
 * WHY PORTRAIT AND NOT FULL BLEED. The films are 9:16. Opened to a landscape
 * window they would lose three quarters of the frame and upscale what was
 * left; opened to the window's HEIGHT they stay whole and close to native.
 * On a phone the window is portrait anyway, so there the box does go edge
 * to edge.
 *
 * As the box opens the letters of the name part outward from the middle, so
 * the name makes room for the film rather than simply being covered by it.
 *
 * Native scrolling throughout: the section is taller than the window and its
 * stage is sticky; this only writes --e (0 closed -> 1 open) from how far
 * through the section you are.
 */
export default function CategoryHero({
  label,
  tagline,
  film,
  count,
  fill = false,
}: {
  label: string;
  tagline: string;
  film: string;
  count: number;
  /**
   * Open to the full banner — edge to edge — instead of to a full-height
   * portrait. Trades the whole 9:16 frame for a landscape crop of it, upscaled
   * on a wide window. On trial on Men only, pending a decision.
   */
  fill?: boolean;
}) {
  const section = useRef<HTMLElement | null>(null);
  const stage = useRef<HTMLDivElement | null>(null);
  const name = useRef<HTMLHeadingElement | null>(null);
  const video = useRef<HTMLVideoElement | null>(null);
  const [shown, setShown] = useState(false);
  const letters = [...label.toUpperCase()];
  const mid = (letters.length - 1) / 2;

  // One frame of delay so the poster paints before the intro moves it.
  useEffect(() => {
    const t = window.setTimeout(() => setShown(true), 60);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    const el = section.current;
    const st = stage.current;
    if (!el || !st) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.style.setProperty("--e", "1");
      return;
    }
    const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
    const write = () => {
      // Measured from where the stage sticks (under the header), not from the
      // top of the window — see the note in CampaignHero.
      const stick = parseFloat(getComputedStyle(st).top) || 0;
      const track = el.offsetHeight - st.offsetHeight;
      const p = track > 0 ? Math.min(1, Math.max(0, (stick - el.getBoundingClientRect().top) / track)) : 1;
      el.style.setProperty("--e", ease(Math.min(1, p / 0.85)).toFixed(4));
    };
    write();
    window.addEventListener("scroll", write, { passive: true });
    window.addEventListener("resize", write);
    return () => {
      window.removeEventListener("scroll", write);
      window.removeEventListener("resize", write);
    };
  }, []);

  /*
   * FIT THE NAME TO THE WINDOW, SPREAD INCLUDED.
   *
   * An average letter width does not survive a didone — W, M and O run near a
   * full em while I is a third of one — and the letters also part as the film
   * opens, so a word that fit at rest ran off both edges once open ("OCCASION"
   * lost its O and N). This measures the word as set, adds the parting it will
   * travel, and sizes the type so the OPEN state fits.
   */
  useEffect(() => {
    const el = section.current;
    const h = name.current;
    if (!el || !h) return;
    const fit = () => {
      h.style.setProperty("--probe", "1");
      const px = parseFloat(getComputedStyle(h).fontSize) || 1;
      // First letter to last, not the heading's box: the heading spans the
      // stage, so its own width says nothing about the word's.
      const first = h.firstElementChild?.getBoundingClientRect();
      const last = h.lastElementChild?.getBoundingClientRect();
      if (!first || !last) return;
      const restEm = (last.right - first.left) / px;
      h.style.removeProperty("--probe");
      const spread = parseFloat(getComputedStyle(el).getPropertyValue("--spread")) || 0;
      const openEm = restEm + (letters.length - 1) * spread;
      const room = document.documentElement.clientWidth * 0.94;
      const cap = window.innerHeight * 0.42;
      el.style.setProperty("--fs", `${Math.min(cap, room / openEm).toFixed(1)}px`);
    };
    fit();
    document.fonts?.ready.then(fit).catch(() => {});
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, [letters.length]);

  /* Plays only while on screen and never under reduced motion; the poster is
     the film's own first frame, so either way the picture is right. */
  useEffect(() => {
    const v = video.current;
    if (!v) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // The PROPERTY, not the attribute — browsers gate autoplay on it.
    v.muted = true;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.intersectionRatio > 0) v.play().catch(() => {});
        else v.pause();
      },
      { threshold: [0, 0.01] }
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={section}
      className="ps-cathero"
      data-shown={shown}
      data-fill={fill || undefined}
      aria-label={`${label} — ${tagline}`}
    >
      <div ref={stage} className="ps-cathero-stage">
        <nav
          className="ps-caps ps-cathero-crumbs"
          aria-label="Breadcrumb"
        >
          <Link href="/" className="ps-link">
            Maison
          </Link>
          <span aria-hidden>/</span>
          <span style={{ color: "var(--ps-accent)" }}>{label}</span>
        </nav>

        <h1
          ref={name}
          className="ps-cathero-name"
          aria-label={label}
          style={{ "--n": letters.length } as CSSProperties}
        >
          {letters.map((ch, i) => (
            <span
              key={i}
              aria-hidden
              style={{ "--o": (i - mid).toFixed(2), "--i": i } as CSSProperties}
            >
              {ch}
            </span>
          ))}
        </h1>

        <div className="ps-cathero-frame">
          <div className="ps-cathero-intro">
            <video
              ref={video}
              src={filmMp4(film)}
              poster={filmPoster(film)}
              muted
              loop
              playsInline
              preload="metadata"
              width={FILMS[film]?.width}
              height={FILMS[film]?.height}
              aria-label={FILMS[film]?.alt}
            />
          </div>
        </div>

        <div className="ps-caps ps-cathero-foot">
          <p className="ps-cathero-tag">{tagline}</p>
          <span aria-hidden className="ps-cue">
            Scroll
          </span>
          <span className="ps-cathero-count">
            {count} {count === 1 ? "piece" : "pieces"}
          </span>
        </div>
      </div>
    </section>
  );
}
