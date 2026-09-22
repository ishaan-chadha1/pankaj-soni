"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { PHOTOS, photo, photoSet, blurOf } from "@/lib/photos";

/**
 * The campaign hero — three portraits, one lockup.
 *
 * WHY A TRIPTYCH AND NOT A FULL-BLEED FILM.
 *
 * The shoot arrives at 810x1080. A single frame stretched across a 1920px
 * viewport is a 2.4x upscale, and on a picture whose entire subject is hand-set
 * crystal that is the one thing you cannot afford — the bead work turns to
 * mush and the garment stops being the reason to look. Three panes side by
 * side span 2430px of source across the same viewport, so every stitch renders
 * at or above 1:1. The format is not a compromise around the resolution; it is
 * what the resolution is actually good at, and a row of full-length portraits
 * is how a couture house has always opened a collection.
 *
 * Swapping to a single frame later is a matter of the masters arriving: the
 * pipeline is by slug, so nothing downstream moves.
 *
 * The lockup sits at 62% rather than dead centre. All three frames are dark
 * there — his jacket, her skirt, the seated lap — so ivory type lands on cloth
 * instead of on a face, and the scrim underneath only has to insure the edges
 * rather than fog the picture.
 */

/** Left, centre, right. All three are 3/4-length, so the row reads as one
 *  shoot rather than three unrelated crops. */
const PANES = ["noir-vine-01", "duet-02", "nocturne-gown-03"] as const;

export default function CampaignHero({
  eyebrow,
  title,
  sub,
  href,
  cta,
}: {
  eyebrow: string;
  title: string;
  sub: string;
  href: string;
  cta: string;
}) {
  const [shown, setShown] = useState(false);

  /* Above the fold, so it opens on mount rather than on an observer. One frame
     of delay lets the plates paint first, so the clip-path animates over a
     picture instead of over the empty box it is about to become. */
  useEffect(() => {
    const t = window.setTimeout(() => setShown(true), 80);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <section className="ps-chero" data-shown={shown} aria-label={`${title} — ${eyebrow}`}>
      <div className="ps-chero-panes">
        {PANES.map((slug, i) => (
          <Pane key={slug} slug={slug} index={i} />
        ))}
      </div>

      {/* Insurance for the type, not a mood. Ten percent at the foot and
          nothing at all across the top two-thirds, so the picture is untouched
          everywhere the eye actually goes. */}
      <div className="ps-chero-veil" aria-hidden />

      <div className="ps-chero-lockup">
        <p className="ps-caps ps-chero-eyebrow">{eyebrow}</p>

        {/*
         * The <h1> is real type, not a graphic. The reference sets its drop
         * name as an image and pays for it in every search result; a didone at
         * this size with the tracking opened up gets the same authority and
         * stays selectable, translatable and indexed.
         */}
        <h1 className="ps-display ps-chero-title">{title}</h1>

        <p className="ps-chero-sub">{sub}</p>

        <Link href={href} className="ps-btn ps-btn-solid ps-chero-cta">
          <span>{cta}</span>
        </Link>
      </div>
    </section>
  );
}

function Pane({ slug, index }: { slug: string; index: number }) {
  const meta = PHOTOS[slug];
  const img = useRef<HTMLImageElement | null>(null);
  const [loaded, setLoaded] = useState(false);

  /* A cached plate can finish decoding before React attaches onLoad, which
     leaves the blur sitting over a picture that is already there. `complete`
     catches that case on mount. */
  useEffect(() => {
    if (img.current?.complete) setLoaded(true);
  }, []);

  return (
    <figure
      className="ps-chero-pane"
      style={{
        ["--i" as string]: index,
        // Holds the frame in roughly the right colours until the plate lands,
        // so the row resolves out of the photograph rather than out of grey.
        backgroundImage: `url("${blurOf(slug)}")`,
      }}
    >
      <img
        ref={img}
        src={photo(slug)}
        srcSet={photoSet(slug)}
        sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 34vw"
        width={meta?.width}
        height={meta?.height}
        alt={index === 1 ? (meta?.alt ?? "") : ""}
        /* The first pane is the LCP candidate on every viewport; the other two
           are beside it and decode in the same breath. None of them are lazy. */
        fetchPriority={index === 0 ? "high" : "auto"}
        decoding="async"
        data-loaded={loaded}
        onLoad={() => setLoaded(true)}
      />
    </figure>
  );
}
