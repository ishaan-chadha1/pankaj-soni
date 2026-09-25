import type { Metadata } from "next";
import Link from "next/link";
import { MaskLines, Reveal } from "../components/Reveal";
import { HeroPlate, Parallax } from "../components/Parallax";
import { Curtain, FillRule } from "../components/Motif";
import { photo, photoSet } from "@/lib/photos";
import { stagger } from "@/lib/motion";

export const metadata: Metadata = {
  title: "About the House",
  description:
    "PANKAJ SONI — a maison founded in Mumbai in 1998, cutting occasionwear and tailoring in small numbers in India and Italy.",
  alternates: { canonical: "/about" },
};

/*
 * SCAFFOLD. Structure and rhythm are final; the copy is placeholder written in
 * the house voice and should be replaced with the real history before launch.
 */

const TIMELINE = [
  ["1998", "A single room on Colaba Causeway. Four tailors, one embroiderer, and a book of appointments."],
  ["2006", "The first occasion collection — twenty-two pieces, every one embroidered by hand in the house."],
  ["2014", "Tailoring moves to a second atelier in Italy, so the cloth and the cut finally sit in the same place."],
  ["2021", "Editions capped at nine hundred. The house stops saying yes to more."],
  ["Today", "Five rooms, by appointment — Mumbai, New Delhi, Paris, Milan and New York."],
];

const FIGURES = [
  ["1998", "Founded in Mumbai"],
  ["11", "Hands on every finish"],
  ["900", "Most pieces in any edition"],
  ["3", "Fittings on every occasion piece"],
];

const PRINCIPLES = [
  {
    t: "Cloth first",
    d: "Every collection begins at the mill, not the sketchbook. The cloth decides what it wants to become.",
    plate: "silver-seam-detail",
  },
  {
    t: "By hand",
    d: "Embroidery is set by the same hands that drew it. Nothing is outsourced, and nothing is rushed.",
    plate: "midnight-swirl-detail",
  },
  {
    t: "Fewer things",
    d: "Ready-to-wear is cut in a single run and never repeated. Scarcity is a consequence, not a strategy.",
    plate: "vapour-gown-detail",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* hero */}
      <section className="relative flex min-h-[80svh] items-center justify-center overflow-hidden">
        <HeroPlate src={photo("duet-01")} />
        <div className="absolute inset-0" style={{ background: "rgba(0,0,0,.28)" }} />
        <div className="relative z-[2] mx-auto max-w-[960px] px-6 text-center" style={{ color: "#faf7f1" }}>
          <Reveal>
            <p className="ps-caps">About the House — Since 1998</p>
          </Reveal>
          <MaskLines
            as="h1"
            className="ps-display mt-8 text-[2.8rem] leading-[1] sm:text-[5rem]"
            delay={150}
            lines={["A house built", "on the hand,", <span key="i" className="ps-display-i">not the logo.</span>]}
          />
        </div>
      </section>

      {/* statement */}
      <section className="ps-alt">
        <div className="mx-auto max-w-[880px] px-5 py-24 text-center sm:px-8 lg:py-32">
          <Reveal>
            <p className="ps-display text-[1.5rem] leading-[1.45] sm:text-[2.1rem]" style={{ letterSpacing: "-0.01em" }}>
              Pankaj Soni opened the house with one conviction: that a garment should be finished by the
              people who began it. Twenty-seven years later, it still is.
            </p>
          </Reveal>
          <Reveal delay={200}>
            <p className="ps-caps mt-10" style={{ color: "var(--ps-faint)" }}>
              The Founder
            </p>
          </Reveal>
        </div>
      </section>

      {/* timeline */}
      <section style={{ borderTop: "1px solid var(--ps-line)" }}>
        <div className="mx-auto grid max-w-[1560px] gap-14 px-5 py-24 sm:px-8 lg:grid-cols-[1fr_1.3fr] lg:gap-24 lg:py-32">
          <Parallax speed={0.12}>
            <Curtain className="ps-media ps-zoom ps-tint aspect-[4/5]">
              <img src={photo("nocturne-gown-03")} srcSet={photoSet("nocturne-gown-03")} alt="" loading="lazy" decoding="async" />
            </Curtain>
          </Parallax>

          <div>
            <MaskLines as="h2" className="ps-display ps-h2" lines={["The story"]} />
            <ol className="mt-12">
              {TIMELINE.map(([year, text], i) => (
                <Reveal key={year} delay={stagger(i)}>
                  <li
                    className="grid grid-cols-[5.5rem_1fr] gap-6 py-6 sm:grid-cols-[7rem_1fr]"
                    style={{ borderTop: "1px solid var(--ps-line)" }}
                  >
                    <span className="ps-display text-[1.6rem] leading-none" style={{ color: "var(--ps-accent)" }}>
                      {year}
                    </span>
                    <p className="text-[.92rem] font-light leading-relaxed" style={{ color: "var(--ps-muted)" }}>
                      {text}
                    </p>
                  </li>
                </Reveal>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* figures */}
      <section className="ps-alt">
        <FillRule accent={false} duration={1600} />
        <div className="mx-auto grid max-w-[1560px] grid-cols-2 gap-x-8 gap-y-14 px-5 py-20 sm:px-8 lg:grid-cols-4">
          {FIGURES.map(([n, l], i) => (
            <Reveal key={l} delay={stagger(i)}>
              <p className="ps-display text-[3rem] leading-none sm:text-[4rem]">{n}</p>
              <p className="ps-caps mt-4" style={{ fontSize: ".58rem", color: "var(--ps-muted)" }}>
                {l}
              </p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* principles */}
      <section style={{ borderTop: "1px solid var(--ps-line)" }}>
        <div className="mx-auto max-w-[1560px] px-5 py-24 sm:px-8 lg:py-32">
          <MaskLines as="h2" className="ps-display ps-h2 mb-16" lines={["What we hold to"]} />
          <div className="grid gap-12 md:grid-cols-3">
            {PRINCIPLES.map((p, i) => (
              <Reveal key={p.t} delay={stagger(i)}>
                <article>
                  <Curtain className="ps-media ps-zoom aspect-[4/5]">
                    <img src={photo(p.plate)} srcSet={photoSet(p.plate)} alt="" loading="lazy" decoding="async" />
                  </Curtain>
                  <h3 className="ps-display mt-6 text-[1.8rem] leading-tight">{p.t}</h3>
                  <p className="mt-3 max-w-[42ch] text-[.88rem] font-light leading-relaxed" style={{ color: "var(--ps-muted)" }}>
                    {p.d}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* onward */}
      <section className="ps-alt" style={{ borderTop: "1px solid var(--ps-line)" }}>
        <div className="mx-auto max-w-[880px] px-5 py-24 text-center sm:px-8">
          <MaskLines
            as="h2"
            className="ps-display text-[2.2rem] leading-[1.05] sm:text-[3.2rem]"
            lines={["See it for", <span key="i" className="ps-display-i">yourself.</span>]}
          />
          <Reveal delay={200}>
            <div className="mt-12 flex flex-wrap justify-center gap-4">
              <Link href="/contact" className="ps-btn ps-btn-solid">
                <span>Book an Appointment</span>
              </Link>
              <Link href="/atelier" className="ps-btn">
                <span>Enter the Cloth Room</span>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
