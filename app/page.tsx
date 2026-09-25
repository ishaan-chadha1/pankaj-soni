import Link from "next/link";
import { CATEGORIES, featured } from "@/lib/catalog";
import { MaskLines, Reveal } from "./components/Reveal";
import { FillRule } from "./components/Motif";
import CampaignHero from "./components/CampaignHero";
import LegacyCampaignHero from "./components/LegacyCampaignHero";
import Craft from "./components/Craft";
import ProductRail from "./components/ProductRail";
import { photo, photoSet } from "@/lib/photos";
import { stagger } from "@/lib/motion";

/*
 * THE LANDING, IN FIVE BEATS.
 *
 *   1. The films            who the house is
 *   2. The rooms            where to go — Women, Men, Occasion
 *   3. Selected pieces      what to buy
 *   4. The work             why it costs what it costs
 *   5. An appointment       what to do next
 *
 * Everything else — the signature piece, the looks and their markers, the
 * journal — lives on the Maison page, where exploring is the point. One
 * reveal here (the quiet rise) so the page reads as calm, not as a demo.
 */

/* The three rooms, each on the frame that says it best. */
const ROOMS = [
  { slug: "women", plate: "nocturne-gown-01" },
  { slug: "men", plate: "silver-seam-02" },
  { slug: "occasion", plate: "orbit-02" },
];

const SERVICES = [
  ["Private Appointment", "An hour with a consultant, in the boutique or by video."],
  ["The Atelier Fitting", "Three fittings on every occasion piece."],
  ["Alterations", "Complimentary for the life of the piece."],
  ["Delivery", "Express worldwide, in signature lacquer."],
];

export default function PsHome() {
  return <HomePage />;
}

export function HomePage({ legacyHero = false }: { legacyHero?: boolean }) {
  const rooms = ROOMS.map((r) => ({ ...CATEGORIES.find((c) => c.slug === r.slug)!, plate: r.plate }));
  const Hero = legacyHero ? LegacyCampaignHero : CampaignHero;

  return (
    <>
      {/* 1 — the films. */}
      <Hero eyebrow="Autumn Campaign — Occasion" title="After Hours" href="/c/occasion" cta="Shop the Campaign" />

      {/* 2 — the rooms. The first thing below the films is where to go. */}
      <section className="ps-band-l">
        <div className="mx-auto max-w-[1560px] px-5 sm:px-8">
          <div className="mb-12 flex flex-wrap items-end justify-between gap-6 lg:mb-16">
            <MaskLines as="h2" className="ps-display ps-h2" lines={["The House"]} />
            <Reveal delay={120}>
              <Link href="/world" className="ps-caps ps-link ps-link-on">
                The Maison
              </Link>
            </Reveal>
          </div>

          <div className="ps-rooms">
            {rooms.map((c, i) => (
              <Reveal key={c.slug} delay={stagger(i)}>
                <Link href={`/c/${c.slug}`} className="group block">
                  <div className="ps-media ps-zoom aspect-[3/4.1]">
                    <img
                      src={photo(c.plate)}
                      srcSet={photoSet(c.plate)}
                      sizes="(max-width: 767px) 92vw, 31vw"
                      alt=""
                      loading="lazy"
                      decoding="async"
                    />
                    <div
                      className="absolute inset-x-0 bottom-0 p-7"
                      style={{
                        background:
                          "linear-gradient(0deg, rgba(10,10,10,.78) 6%, rgba(10,10,10,.36) 48%, transparent 86%)",
                      }}
                    >
                      <h3 className="ps-display text-[2rem] leading-none" style={{ color: "#f5f1e9" }}>
                        {c.label}
                      </h3>
                      <p className="mt-2.5 max-w-[30ch] text-[.8rem] font-light" style={{ color: "rgba(245,241,233,.74)" }}>
                        {c.tagline}
                      </p>
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 3 — selected pieces: one row, six. */}
      <ProductRail items={featured().slice(0, 6)} eyebrow="Autumn" title="Selected pieces" href="/c/women" />

      {/* 4 — the work: the page's one dark band. */}
      <Craft />

      {/* 5 — what to do next. Four lines and one invitation. */}
      <section>
        <FillRule accent={false} duration={1600} />
        <div className="ps-band mx-auto max-w-[1560px] px-5 sm:px-8">
          <div className="grid gap-x-10 gap-y-9 sm:grid-cols-2 lg:grid-cols-4">
            {SERVICES.map(([t, d], i) => (
              <Reveal key={t} delay={stagger(i)}>
                <h3 className="ps-caps-lg">{t}</h3>
                <p className="mt-2.5 max-w-[34ch] text-[.84rem] font-light leading-relaxed" style={{ color: "var(--ps-muted)" }}>
                  {d}
                </p>
              </Reveal>
            ))}
          </div>
          <Reveal delay={300} className="mt-14 text-center">
            <Link href="/contact" className="ps-btn ps-btn-solid">
              <span>Book an Appointment</span>
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
