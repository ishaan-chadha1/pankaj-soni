import Link from "next/link";
import { Parallax } from "./Parallax";
import { SplitFrame } from "./Motif";
import { Reveal } from "./Reveal";
import { PHOTOS, photo, photoSet } from "@/lib/photos";

/**
 * The looks, one room at a time — after the project rows on maisonauge.com.
 *
 * Each look is a row the height of a couple of windows. The left column is
 * pinned: the look's name, what it is, and a portrait cover, sat at the foot
 * of the window while the right column scrolls past it — one wide frame with
 * a line of copy, then a pair of portraits, the second set a step higher so
 * the pair never reads as a grid. Every frame splits open from its centre
 * line and drifts at its own speed.
 *
 * On a phone there is no room for a pinned column; the row stacks, cover
 * first.
 */

type Look = {
  name: string;
  tags: string;
  href: string;
  cover: string;
  wide: { slug: string; focus?: string };
  pair: [string, string];
  lines: [string, string];
};

const LOOKS: Look[] = [
  {
    name: "Nocturne",
    tags: "Women — Occasion",
    href: "/p/liquid-column-gown",
    cover: "nocturne-gown-01",
    wide: { slug: "nocturne-gown-04", focus: "50% 30%" },
    pair: ["nocturne-gown-02", "nocturne-gown-03"],
    lines: [
      "A column in black, cut to fall without a seam from the bust to the floor.",
      "The crystal is set by hand at the bodice and the peplum, and nowhere else.",
    ],
  },
  {
    name: "Orbit & Tidemark",
    tags: "Men — Occasion",
    href: "/c/occasion",
    cover: "orbit-01",
    wide: { slug: "tidemark-detail", focus: "50% 60%" },
    pair: ["orbit-02", "orbit-03"],
    lines: [
      "Two bandhgalas, both in midnight wool, both broken only where the eye should stop.",
      "Discs of wool laid over black and outlined in crystal, scattered to read as falling.",
    ],
  },
  {
    name: "Silver Seam",
    tags: "Men — Evening",
    href: "/p/shawl-collar-dinner-jacket",
    cover: "silver-seam-01",
    wide: { slug: "silver-seam-detail", focus: "50% 40%" },
    pair: ["silver-seam-02", "midnight-swirl-01"],
    lines: [
      "Evening tailoring drawn from one shoulder, with a single line of silver at the seam.",
      "Worn open, it is a dinner jacket. Closed, it is the whole of the look.",
    ],
  },
];

export default function LookRows() {
  return (
    <section aria-label="The looks" className="ps-rows">
      {LOOKS.map((l, i) => (
        <article key={l.name} className="ps-row">
          <div className="ps-row-pin">
            <Reveal>
              <h3 className="ps-row-name">{l.name}</h3>
            </Reveal>
            <Reveal delay={90}>
              <p className="ps-caps ps-row-tags">{l.tags}</p>
            </Reveal>
            <Link href={l.href} className="ps-row-cover" aria-label={`${l.name} — view the look`}>
              <SplitFrame className="aspect-[2/3]" zoom={0.18}>
                <img
                  src={photo(l.cover)}
                  srcSet={photoSet(l.cover)}
                  sizes="(max-width: 767px) 70vw, 17vw"
                  alt={PHOTOS[l.cover]?.alt ?? ""}
                  loading="lazy"
                  decoding="async"
                />
              </SplitFrame>
            </Link>
            <p className="ps-caps ps-row-index" aria-hidden>
              {String(i + 1).padStart(2, "0")} / {String(LOOKS.length).padStart(2, "0")}
            </p>
          </div>

          <div className="ps-row-media">
            <div className="ps-row-block">
              <Parallax speed={0.9}>
                <Link href={l.href} tabIndex={-1} aria-hidden>
                  <SplitFrame className="aspect-[1.65/1]" zoom={0.22}>
                    <img
                      src={photo(l.wide.slug)}
                      srcSet={photoSet(l.wide.slug)}
                      sizes="(max-width: 767px) 92vw, 58vw"
                      alt=""
                      loading="lazy"
                      decoding="async"
                      style={{ objectPosition: l.wide.focus }}
                    />
                  </SplitFrame>
                </Link>
              </Parallax>
              <Reveal>
                <p className="ps-row-line">{l.lines[0]}</p>
              </Reveal>
            </div>

            <div className="ps-row-block ps-row-block-pair">
              <div className="ps-row-pair">
                {l.pair.map((slug, j) => (
                  <Parallax key={slug} speed={j ? 1.4 : 0.7} className={j ? "ps-row-step" : undefined}>
                    <Link href={l.href} tabIndex={-1} aria-hidden>
                      <SplitFrame className="aspect-[0.77/1]" zoom={0.2} delay={j * 160}>
                        <img
                          src={photo(slug)}
                          srcSet={photoSet(slug)}
                          sizes="(max-width: 767px) 45vw, 25vw"
                          alt=""
                          loading="lazy"
                          decoding="async"
                        />
                      </SplitFrame>
                    </Link>
                  </Parallax>
                ))}
              </div>
              <Reveal>
                <p className="ps-row-line">{l.lines[1]}</p>
              </Reveal>
              <Reveal delay={120}>
                <Link href={l.href} className="ps-caps ps-link ps-link-on mt-8 inline-block">
                  View the look
                </Link>
              </Reveal>
            </div>
          </div>
        </article>
      ))}
    </section>
  );
}
