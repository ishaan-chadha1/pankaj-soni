import type { Metadata } from "next";
import Link from "next/link";
import { MaskLines, Reveal } from "../components/Reveal";
import { HeroPlate } from "../components/Parallax";
import { Monogram } from "../components/Brand";
import { photo, photoSet } from "@/lib/photos";
import { stagger } from "@/lib/motion";

export const metadata: Metadata = {
  title: "The Maison",
  description:
    "The house of PANKAJ SONI — its origins in Mumbai, its story since 1998, what it makes and the vision behind it.",
  alternates: { canonical: "/world" },
};

/*
 * THE MAISON, IN FOUR PARTS: Origins · Timeline · About the brand · Visionary.
 *
 * PLACEHOLDER COPY throughout, written in the house voice so the page reads
 * as finished. Replace with the real history, dates, principles and the
 * founder's own words and portrait before launch.
 */

const TIMELINE = [
  { year: "1998", line: "A single room on Colaba Causeway. Four tailors, one embroiderer and a book of appointments.", plate: "noir-vine-01" },
  { year: "2006", line: "The first occasion collection — twenty-two pieces, every one embroidered by hand in the house.", plate: "nocturne-gown-01" },
  { year: "2014", line: "Tailoring moves to an atelier in Italy, so the cloth and the cut sit in the same place.", plate: "silver-seam-01" },
  { year: "2021", line: "Editions capped at nine hundred. The house stops saying yes to more.", plate: "orbit-01" },
  { year: "Today", line: "Five rooms, by appointment — Mumbai, New Delhi, Paris, Milan and New York.", plate: "duet-01" },
];

const PRINCIPLES = [
  { t: "Cloth first", d: "Every collection begins at the mill, not the sketchbook. The cloth decides what it wants to become.", plate: "silver-seam-detail" },
  { t: "By hand", d: "Embroidery is set by the same hands that drew it. Nothing is outsourced, and nothing is rushed.", plate: "midnight-swirl-detail" },
  { t: "Fewer things", d: "Ready-to-wear is cut in a single run and never repeated. Scarcity is a consequence, not a strategy.", plate: "vapour-gown-detail" },
];

function Eyebrow({ n, children }: { n: string; children: string }) {
  return (
    <Reveal>
      <p className="ps-caps" style={{ color: "var(--ps-accent)" }}>
        {n} — {children}
      </p>
    </Reveal>
  );
}

export default function MaisonPage() {
  return (
    <>
      {/* hero */}
      <section className="relative flex min-h-[78svh] items-end overflow-hidden">
        <HeroPlate src={photo("duet-02")} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(0,0,0,.05) 30%, rgba(0,0,0,.5) 100%)" }} />
        <div className="relative z-[2] mx-auto w-full max-w-[1560px] px-5 pb-16 sm:px-8 lg:pb-24" style={{ color: "#faf7f1" }}>
          <Reveal>
            <p className="ps-caps">Since 1998</p>
          </Reveal>
          <MaskLines as="h1" className="ps-display mt-6 text-[3.4rem] leading-none sm:text-[6rem]" delay={120} lines={["The Maison"]} />
        </div>
      </section>

      {/* 01 — origins */}
      <section className="ps-band-l">
        <div className="mx-auto grid max-w-[1560px] items-center gap-12 px-5 sm:px-8 lg:grid-cols-[1.1fr_1fr] lg:gap-24">
          <div>
            <Eyebrow n="01">Origins</Eyebrow>
            <Reveal delay={120}>
              <p className="ps-display mt-8 text-[1.7rem] leading-[1.35] sm:text-[2.4rem]">
                It began in 1998, in one room in Mumbai, with a conviction that a garment should be finished
                by the people who began it.
              </p>
            </Reveal>
            <Reveal delay={240}>
              <p className="mt-8 max-w-[56ch] text-[.95rem] font-light leading-relaxed" style={{ color: "var(--ps-muted)" }}>
                Four tailors and one embroiderer worked from a book of appointments, and every piece that left
                the room had been fitted, finished and pressed by hand. The room has grown; the conviction has
                not moved.
              </p>
            </Reveal>
          </div>
          <Reveal delay={160}>
            <div className="ps-media aspect-[4/5]">
              <img src={photo("noir-vine-02")} srcSet={photoSet("noir-vine-02")} sizes="(max-width: 1023px) 92vw, 44vw" alt="" loading="lazy" decoding="async" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* 02 — timeline / storyline */}
      <section className="ps-alt ps-band-l">
        <div className="mx-auto max-w-[1560px] px-5 sm:px-8">
          <Eyebrow n="02">Timeline</Eyebrow>
          <MaskLines as="h2" className="ps-display ps-h2 mt-5" lines={["The story so far"]} />
          <ol className="ps-timeline mt-12">
            {TIMELINE.map((t, i) => (
              <li key={t.year}>
                <Reveal delay={stagger(i)}>
                  <div className="ps-media aspect-[4/5]">
                    <img src={photo(t.plate)} srcSet={photoSet(t.plate)} sizes="(max-width: 767px) 78vw, 26vw" alt="" loading="lazy" decoding="async" />
                  </div>
                  <p className="ps-display mt-5 text-[2.2rem] leading-none" style={{ color: "var(--ps-accent)" }}>
                    {t.year}
                  </p>
                  <p className="mt-3 max-w-[34ch] text-[.88rem] font-light leading-relaxed" style={{ color: "var(--ps-muted)" }}>
                    {t.line}
                  </p>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 03 — about the brand */}
      <section className="ps-band-l">
        <div className="mx-auto max-w-[1560px] px-5 sm:px-8">
          <Eyebrow n="03">About the brand</Eyebrow>
          <MaskLines
            as="h2"
            className="ps-display ps-h2 mt-5 max-w-[18ch]"
            lines={["Occasionwear and tailoring,", <span key="i" className="ps-display-i">made slowly.</span>]}
          />
          <div className="mt-14 grid gap-12 md:grid-cols-3">
            {PRINCIPLES.map((p, i) => (
              <Reveal key={p.t} delay={stagger(i)}>
                <div className="ps-media aspect-[4/5]">
                  <img src={photo(p.plate)} srcSet={photoSet(p.plate)} sizes="(max-width: 767px) 92vw, 31vw" alt="" loading="lazy" decoding="async" />
                </div>
                <h3 className="ps-display mt-6 text-[1.7rem] leading-tight">{p.t}</h3>
                <p className="mt-3 max-w-[42ch] text-[.88rem] font-light leading-relaxed" style={{ color: "var(--ps-muted)" }}>
                  {p.d}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 04 — visionary */}
      <section className="ps-invert ps-band-l">
        <div className="mx-auto grid max-w-[1560px] items-center gap-12 px-5 sm:px-8 lg:grid-cols-[1fr_1.15fr] lg:gap-24">
          {/* PLACEHOLDER portrait — swap for the founder's photograph. */}
          <Reveal>
            <div
              className="flex aspect-[4/5] flex-col items-center justify-center gap-6"
              style={{ background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.12)" }}
            >
              <Monogram className="h-24 w-auto opacity-80" />
              <p className="ps-caps" style={{ fontSize: ".55rem", color: "rgba(246,242,234,.5)" }}>
                Portrait to come
              </p>
            </div>
          </Reveal>
          <div>
            <Eyebrow n="04">Visionary</Eyebrow>
            <Reveal delay={120}>
              <blockquote className="ps-display mt-8 text-[1.8rem] leading-[1.3] sm:text-[2.6rem]">
                &ldquo;I would rather make one thing that is finished than a hundred that are almost.&rdquo;
              </blockquote>
            </Reveal>
            <Reveal delay={220}>
              <p className="ps-caps mt-8" style={{ color: "var(--ps-accent)" }}>
                Pankaj Soni — Founder &amp; Creative Director
              </p>
            </Reveal>
            <Reveal delay={300}>
              <p className="mt-8 max-w-[56ch] text-[.95rem] font-light leading-relaxed" style={{ opacity: 0.72 }}>
                Trained as a tailor before he ever drew a collection, he still begins every season at the cutting
                table. The house&rsquo;s silhouettes, its embroidery and its refusal to make more than it can finish
                by hand all start with him.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* close */}
      <section className="ps-band">
        <div className="mx-auto max-w-[880px] px-5 text-center sm:px-8">
          <MaskLines
            as="h2"
            className="ps-display text-[2.2rem] leading-[1.05] sm:text-[3.2rem]"
            lines={["See it for", <span key="i" className="ps-display-i">yourself.</span>]}
          />
          <Reveal delay={200} className="mt-12">
            <Link href="/contact" className="ps-btn ps-btn-solid">
              <span>Book an Appointment</span>
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
