import Link from "next/link";
import { Parallax } from "./Parallax";
import { SplitFrame, type RevealKind } from "./Motif";
import { Reveal } from "./Reveal";
import { ShopFrame, type Hotspot } from "./Hotspots";
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
 * THE FRAMES ARE THE SHOP. Every garment in them carries a marker that opens
 * its card with Add to Bag. Coordinates are % of the 810x1080 source, read
 * against a 10% grid laid over each plate — the wide frames are cropped hard
 * (1.65:1 out of 3:4), so each wide marker sits inside the band its `focus`
 * leaves visible.
 *
 * On a phone there is no room for a pinned column; the row stacks, cover
 * first.
 */

type Look = {
  name: string;
  tags: string;
  href: string;
  cover: string;
  wide: { slug: string; focus?: string; hots: Hotspot[] };
  pair: [{ slug: string; hots: Hotspot[] }, { slug: string; hots: Hotspot[] }];
  lines: [string, string];
};

const LOOKS: Look[] = [
  {
    name: "Nocturne",
    tags: "Women — Occasion",
    href: "/p/liquid-column-gown",
    cover: "nocturne-gown-01",
    wide: {
      slug: "nocturne-gown-04",
      focus: "50% 30%",
      hots: [{ slug: "liquid-column-gown", label: "The Gown", x: 70, y: 50, len: 12, dir: "left" }],
    },
    pair: [
      { slug: "nocturne-gown-02", hots: [{ slug: "liquid-column-gown", label: "The Gown", x: 58, y: 45, len: 14 }] },
      { slug: "nocturne-gown-03", hots: [] },
    ],
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
    wide: {
      slug: "tidemark-detail",
      focus: "50% 60%",
      hots: [{ slug: "tidemark-sherwani", label: "Tidemark", x: 68, y: 50, len: 12, dir: "left" }],
    },
    pair: [
      { slug: "orbit-02", hots: [{ slug: "orbit-bandhgala", label: "Orbit", x: 68, y: 32, len: 14 }] },
      { slug: "orbit-03", hots: [] },
    ],
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
    wide: {
      slug: "silver-seam-detail",
      focus: "50% 40%",
      hots: [{ slug: "shawl-collar-dinner-jacket", label: "Silver Seam", x: 78, y: 45, len: 12, dir: "left" }],
    },
    pair: [
      {
        slug: "silver-seam-02",
        hots: [
          { slug: "evening-shirt", label: "The Shirt", x: 64, y: 44, len: 16 },
          { slug: "shawl-collar-dinner-jacket", label: "Jacket", x: 43, y: 50, len: 14 },
        ],
      },
      { slug: "midnight-swirl-01", hots: [{ slug: "single-breasted-suit", label: "The Suit", x: 33, y: 50, len: 14 }] },
    ],
    lines: [
      "Evening tailoring drawn from one shoulder, with a single line of silver at the seam.",
      "Worn open, it is a dinner jacket. Closed, it is the whole of the look.",
    ],
  },
];

/* Each row's wide frame arrives differently, so three rows do not read as the
   same row printed three times. */
const WIDE_REVEAL: RevealKind[] = ["split", "wipe", "wipe-r"];

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
              <SplitFrame className="aspect-[2/3]" zoom={0.18} variant="rise">
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
                <SplitFrame
                  className="aspect-[1.65/1]"
                  zoom={0.22}
                  variant={WIDE_REVEAL[i % WIDE_REVEAL.length]}
                  overlay={<ShopFrame id={`${l.name}-wide`} hotspots={l.wide.hots} focus={l.wide.focus} />}
                >
                  <Link href={l.href} tabIndex={-1} aria-hidden className="block h-full w-full">
                    <img
                      src={photo(l.wide.slug)}
                      srcSet={photoSet(l.wide.slug)}
                      sizes="(max-width: 767px) 92vw, 58vw"
                      alt=""
                      loading="lazy"
                      decoding="async"
                      style={{ objectPosition: l.wide.focus }}
                      className="h-full w-full object-cover"
                    />
                  </Link>
                </SplitFrame>
              </Parallax>
              <Reveal>
                <p className="ps-row-line">{l.lines[0]}</p>
              </Reveal>
            </div>

            <div className="ps-row-block ps-row-block-pair">
              <div className="ps-row-pair">
                {l.pair.map(({ slug, hots }, j) => (
                  <Parallax key={slug} speed={j ? 1.4 : 0.7} className={j ? "ps-row-step" : undefined}>
                    <SplitFrame
                      className="aspect-[0.77/1]"
                      zoom={0.2}
                      variant="slide"
                      delay={j * 220}
                      overlay={hots.length ? <ShopFrame id={`${l.name}-${slug}`} hotspots={hots} /> : undefined}
                    >
                      <Link href={l.href} tabIndex={-1} aria-hidden className="block h-full w-full">
                        <img
                          src={photo(slug)}
                          srcSet={photoSet(slug)}
                          sizes="(max-width: 767px) 45vw, 25vw"
                          alt=""
                          loading="lazy"
                          decoding="async"
                          className="h-full w-full object-cover"
                        />
                      </Link>
                    </SplitFrame>
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
