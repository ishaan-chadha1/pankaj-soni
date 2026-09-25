"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { PHOTOS, photo, photoSet, blurOf } from "@/lib/photos";
import { MaskLines, Reveal } from "./Reveal";
import { stagger } from "@/lib/motion";

/**
 * The work, shown rather than described.
 *
 * Four frames from the shoot carry no face at all — they are pure cloth and
 * hand-work, shot close. On a product grid that makes them weak, because there
 * is nothing to buy in them; given their own band it makes them the strongest
 * argument the page has. The garment pages can claim two hundred hours. This
 * is the only place the site can prove it.
 *
 * Set on the inverted ground because every one of these is a dark garment on
 * pale grey: on paper they read as four grey rectangles, and against ink the
 * crystal is the only thing in the room. It is the page's single dark chapter,
 * the way print editorial spends one spread on black.
 */

type Work = {
  slug: string;
  piece: string;
  note: string;
  href: string;
  /** Magnify inside the plate, for a frame shot looser than the rest. */
  zoom?: number;
  /** Which part of the frame to hold while magnifying. */
  focus?: string;
};

const WORK: Work[] = [
  {
    slug: "silver-seam-detail",
    piece: "Silver Seam",
    note: "Crystal set by hand, panel by panel, before the jacket is made up.",
    href: "/p/shawl-collar-dinner-jacket",
  },
  {
    slug: "midnight-swirl-detail",
    piece: "Midnight Swirl",
    note: "The swirl is drawn on the frame first; the cloth is cut to it after.",
    href: "/p/single-breasted-suit",
  },
  {
    slug: "tidemark-detail",
    piece: "Tidemark",
    note: "A scalloped hem in sequin, bugle and dulled silver. Nothing above it.",
    href: "/p/tidemark-sherwani",
  },
  {
    slug: "vapour-gown-detail",
    piece: "Vapour",
    note: "Sequins graded from dense at the waist to nothing at the shoulder.",
    href: "/p/atelier-tuxedo-dress",
    /* The other three frames are cloth and nothing else. This one was shot
       looser and arrives with a face in it, which put a portrait in a row of
       details. Pushing in on the sequin work brings it back into the set —
       the source is 3:4 in a 3:4 box, so there is no crop to play with
       without magnifying. */
    zoom: 1.5,
    focus: "52% 78%",
  },
];

export default function Craft() {
  return (
    <section className="ps-invert ps-craft" aria-labelledby="craft-h">
      <div className="mx-auto max-w-[1560px] px-5 sm:px-8">
        <div className="ps-craft-head">
          <Reveal>
            <p className="ps-caps" style={{ color: "var(--ps-accent)" }}>
              The Work
            </p>
          </Reveal>
          <MaskLines
            as="h2"
            id="craft-h"
            className="ps-display ps-craft-title"
            delay={80}
            lines={["Counted in hours,", <span key="np" className="ps-display-i">not in pieces.</span>]}
          />
          <Reveal delay={260}>
            <p className="ps-craft-lede">
              Every surface here was worked flat on a frame before a single seam
              was closed. It is slow, it does not scale, and it is the only
              reason any of it looks like this.
            </p>
          </Reveal>
        </div>

        <ul className="ps-craft-grid">
          {WORK.map((w, i) => (
            <li key={w.slug}>
              <Reveal delay={stagger(i, 90)}>
                <Plate {...w} />
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Plate({ slug, piece, note, href, zoom, focus }: Work) {
  const meta = PHOTOS[slug];
  const img = useRef<HTMLImageElement | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (img.current?.complete) setLoaded(true);
  }, []);

  return (
    <Link href={href} className="ps-craft-plate group">
      <span
        className="ps-craft-media"
        style={{
          backgroundImage: `url("${blurOf(slug)}")`,
          ["--craft-zoom" as string]: zoom,
          ["--craft-pos" as string]: focus,
        }}
      >
        <img
          ref={img}
          src={photo(slug)}
          srcSet={photoSet(slug)}
          sizes="(max-width: 639px) 82vw, (max-width: 1023px) 44vw, 23vw"
          width={meta?.width}
          height={meta?.height}
          alt={meta?.alt ?? ""}
          loading="lazy"
          decoding="async"
          data-loaded={loaded}
          onLoad={() => setLoaded(true)}
        />
      </span>
      <span className="ps-craft-piece ps-display">{piece}</span>
      <span className="ps-craft-note">{note}</span>
    </Link>
  );
}
