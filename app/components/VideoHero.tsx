"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

/**
 * A full-bleed film, and nothing else.
 *
 * No headline sits over it. That is the point of the format: a garment moving
 * in real light says more in two seconds than a line of type does, and copy
 * laid over it only asks the eye to do two things at once. The house name is
 * already in the header, so the frame is free to be a frame.
 *
 * The page still needs an <h1> — without one the document outline starts at
 * <h3> and a screen reader is handed a store with no title — so it ships
 * visually hidden. This is the one case where sr-only is the correct answer
 * rather than a shortcut: the information is genuinely carried by the picture.
 */
export default function VideoHero({
  src,
  poster,
  title,
  eyebrow,
  alt,
}: {
  src: string;
  poster: string;
  title: string;
  eyebrow: string;
  alt: string;
}) {
  const video = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const v = video.current;
    if (!v) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // The property, not the attribute — browsers gate autoplay on the property,
    // and React only writes the attribute.
    v.muted = true;
    // Above the fold, so it plays on mount; it still pauses when scrolled past
    // rather than decoding a 1080p frame every 16ms for a screen nobody is on.
    const io = new IntersectionObserver(
      ([e]) => (e.isIntersecting ? v.play().catch(() => {}) : v.pause()),
      { threshold: 0.05 }
    );
    io.observe(v);
    return () => {
      io.disconnect();
      v.pause();
    };
  }, []);

  return (
    <section className="ps-vhero relative w-full overflow-hidden" aria-label={eyebrow}>
      <video
        ref={video}
        src={src}
        poster={poster}
        loop
        muted
        playsInline
        preload="auto"
        aria-label={alt}
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Carries the outline without touching the picture. */}
      <h1 className="sr-only">{title}</h1>

      {/*
       * A whisper of gradient at the foot of the frame.
       *
       * Not decoration: the header floats over this section, and on a light
       * frame the wordmark was landing on near-white. Twelve percent of black
       * across the bottom eighth is enough to keep the scroll cue legible
       * without reading as a scrim.
       */}
      <div className="ps-vhero-foot pointer-events-none absolute inset-x-0 bottom-0" />

      <Link
        href="#rail"
        className="ps-vhero-cue absolute bottom-6 left-1/2 z-[2] -translate-x-1/2"
        aria-label="Skip to the collection"
      >
        <span className="ps-caps">Scroll</span>
        <span className="ps-vhero-line" aria-hidden="true" />
      </Link>
    </section>
  );
}
