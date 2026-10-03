import type { Metadata } from "next";
import Link from "next/link";
import { MaskLines, Reveal } from "../components/Reveal";
import { Monogram } from "../components/Brand";
import { photo, photoSet } from "@/lib/photos";
import { stagger } from "@/lib/motion";

export const metadata: Metadata = {
  title: "About the House",
  description:
    "PANKAJ SONI — a maison founded in Mumbai in 1998, cutting occasionwear and tailoring in small numbers in India and Italy.",
  alternates: { canonical: "/about" },
};

/*
 * ABOUT, as an editorial: a centred headline over one wide plate, the story
 * beside a portrait, the vision set huge, three values, and the name and its
 * symbols around a quote.
 *
 * PLACEHOLDER COPY and pictures throughout — swap for the founder's words, the
 * real history and the founder's portrait before launch.
 */

const VALUES = [
  { n: "I", t: "Legacy", d: "Every piece is made to be kept — fitted, finished and pressed by hand, so it outlives the occasion it was made for.", plate: "nocturne-gown-02" },
  { n: "II", t: "Artistry", d: "Embroidery is drawn and set by the same hands, in the house. Nothing is outsourced, and nothing is rushed.", plate: "midnight-swirl-01" },
  { n: "III", t: "Celebration", d: "The house dresses the days people remember — weddings, first nights, the evenings that become stories.", plate: "vapour-gown-01" },
];

const SYMBOLS = [
  { n: "I", t: "The Name", d: "The house carries its founder’s name, because every collection still begins at his cutting table.", plate: "silver-seam-01" },
  { n: "II", t: "The Seal", d: "The circle of the mark is a tailor’s seal — pressed into the last fitting, the sign that a piece is finished.", plate: "noir-vine-02" },
  { n: "III", t: "The Thread", d: "Gold is the house’s one colour: the thread of the first embroidery, set by hand in a room in Mumbai.", plate: "midnight-swirl-detail" },
  { n: "IV", t: "The Room", d: "Five rooms, by appointment. The house keeps its rooms small so every client is fitted by the people who made the piece.", plate: "orbit-02" },
];

function Plate({ slug, sizes, className = "", focus }: { slug: string; sizes: string; className?: string; focus?: string }) {
  return (
    <div className={`ps-media ${className}`}>
      <img src={photo(slug)} srcSet={photoSet(slug)} sizes={sizes} alt="" loading="lazy" decoding="async" style={focus ? { objectPosition: focus } : undefined} />
    </div>
  );
}

function Symbol({ s }: { s: (typeof SYMBOLS)[number] }) {
  return (
    <div>
      <Plate slug={s.plate} sizes="(max-width: 767px) 46vw, 22vw" className="aspect-[4/5]" />
      <p className="ps-caps mt-5" style={{ fontSize: ".6rem", color: "var(--ps-muted)" }}>{s.n}.</p>
      <h3 className="ps-display mt-2 text-[1.35rem] uppercase leading-tight">{s.t}</h3>
      <p className="mt-3 text-[.85rem] font-light leading-relaxed" style={{ color: "var(--ps-muted)" }}>{s.d}</p>
    </div>
  );
}

export default function AboutPage() {
  return (
    <>
      {/* hero — centred headline over one wide plate */}
      <section className="pt-20 sm:pt-28">
        <div className="mx-auto max-w-[1560px] px-5 text-center sm:px-8">
          <Reveal>
            <p className="ps-caps" style={{ color: "var(--ps-muted)" }}>About Pankaj Soni</p>
          </Reveal>
          <MaskLines
            as="h1"
            className="ps-display mt-8 text-[2.15rem] uppercase leading-[1.02] sm:text-[5.6rem]"
            delay={120}
            lines={[
              <span key="a"><span className="ps-display-i normal-case">where</span> Craftsmanship</span>,
              <span key="b"><span className="ps-display-i normal-case">meets</span> Ceremony.</span>,
            ]}
          />
        </div>
        <Reveal delay={200} className="mx-auto mt-14 max-w-[1560px] px-5 sm:mt-20 sm:px-8">
          <Plate slug="pinstripe-03" sizes="96vw" className="aspect-[4/5] sm:aspect-[16/8]" focus="50% 4%" />
        </Reveal>
      </section>

      {/* 1. the story */}
      <section className="ps-band-l">
        <div className="mx-auto max-w-[1560px] px-5 sm:px-8">
          <div className="text-center">
            <Reveal>
              <p className="ps-caps" style={{ color: "var(--ps-muted)" }}>1.</p>
            </Reveal>
            <MaskLines
              as="h2"
              className="ps-display mt-6 text-[2.6rem] leading-[1.02] sm:text-[4.6rem]"
              lines={[
                <span key="a"><span className="ps-display-i">The</span> STORY</span>,
                <span key="b"><span className="ps-display-i">behind</span> PANKAJ SONI.</span>,
              ]}
            />
          </div>
          <div className="mt-16 grid items-center gap-10 lg:mt-24 lg:grid-cols-[1.5fr_1fr] lg:gap-20">
            <Reveal>
              <Plate slug="swirl-shirt-02" sizes="(max-width: 1023px) 92vw, 58vw" className="aspect-[4/5] lg:aspect-[5/4]" focus="50% 30%" />
            </Reveal>
            <Reveal delay={150}>
              <h3 className="ps-display text-[1.8rem] leading-tight sm:text-[2.2rem]">A garment should be finished by the people who began it.</h3>
              <p className="mt-6 max-w-[52ch] text-[.95rem] font-light leading-relaxed" style={{ color: "var(--ps-muted)" }}>
                &ldquo;I trained as a tailor long before I drew a collection. In 1998 I opened one room in Mumbai with
                four tailors and one embroiderer, and we made a promise to every client who came through the door:
                the hands that cut your piece would be the hands that finished it. The room has grown. The promise
                has not moved.&rdquo;
              </p>
              <div className="mt-10 flex items-center gap-4">
                <Monogram className="h-10 w-auto" />
                <p className="ps-caps leading-relaxed" style={{ fontSize: ".6rem" }}>
                  Pankaj Soni,
                  <br />
                  <span className="ps-display-i normal-case tracking-normal" style={{ fontSize: ".85rem", color: "var(--ps-muted)" }}>founder of the house</span>
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* vision — set huge */}
      <section className="ps-band-l">
        <div className="mx-auto max-w-[1560px] px-5 text-center sm:px-8">
          <Reveal>
            <p className="ps-caps" style={{ color: "var(--ps-muted)" }}>
              <span className="ps-display-i normal-case tracking-normal" style={{ fontSize: "1rem" }}>Our</span> Vision:
            </p>
          </Reveal>
          <MaskLines
            as="div"
            className="ps-display mt-8 text-[2.3rem] uppercase leading-[1.04] sm:text-[5.4rem]"
            lines={[
              <span key="a">A house where <span className="ps-display-i normal-case">every</span></span>,
              "occasion is worn,",
              "not just attended —",
              <span key="d">made <span className="ps-display-i normal-case">by hand.</span></span>,
            ]}
          />
        </div>
      </section>

      {/* values */}
      <section className="ps-band-l pt-0">
        <div className="mx-auto max-w-[1560px] px-5 sm:px-8">
          <MaskLines
            as="h2"
            className="ps-display text-center text-[2.6rem] uppercase leading-none sm:text-[4.6rem]"
            lines={[<span key="a"><span className="ps-display-i normal-case">our</span> Values</span>]}
          />
          <div className="mt-14 grid gap-12 md:grid-cols-3 md:gap-6 lg:mt-20">
            {VALUES.map((v, i) => (
              <Reveal key={v.t} delay={stagger(i)} className="text-center">
                <Plate slug={v.plate} sizes="(max-width: 767px) 92vw, 32vw" className="aspect-[4/5]" />
                <p className="ps-caps mt-6" style={{ fontSize: ".6rem", color: "var(--ps-muted)" }}>{v.n}.</p>
                <h3 className="ps-display mt-2 text-[1.9rem] leading-tight">{v.t}</h3>
                <p className="mx-auto mt-3 max-w-[36ch] text-[.88rem] font-light leading-relaxed" style={{ color: "var(--ps-muted)" }}>
                  {v.d}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* the name & symbolism */}
      <section className="ps-alt ps-band-l">
        <div className="mx-auto max-w-[1560px] px-5 sm:px-8">
          <MaskLines
            as="h2"
            className="ps-display text-center text-[2.4rem] leading-[1.02] sm:text-[4.6rem]"
            lines={[
              <span key="a"><span className="ps-display-i">The</span> STORY <span className="ps-display-i">of the</span> NAME</span>,
              "& SYMBOLISM.",
            ]}
          />
          <div className="mt-14 grid gap-8 lg:mt-20 lg:grid-cols-2 lg:gap-6">
            <div className="lg:sticky lg:top-24 lg:self-start">
              <Reveal>
                <Plate slug="nocturne-gown-01" sizes="(max-width: 1023px) 92vw, 48vw" className="aspect-[4/5] lg:aspect-[4/5.4]" />
              </Reveal>
            </div>
            <div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6">
                {SYMBOLS.slice(0, 2).map((s, i) => (
                  <Reveal key={s.t} delay={stagger(i)}><Symbol s={s} /></Reveal>
                ))}
              </div>
              <Reveal className="py-16 text-center sm:py-24">
                <blockquote className="ps-display mx-auto max-w-[22ch] text-[1.6rem] leading-[1.3] sm:text-[2rem]">
                  &ldquo;Make one thing that is finished, rather than a hundred that are almost.&rdquo;
                </blockquote>
                <p className="ps-caps mt-6" style={{ fontSize: ".6rem", color: "var(--ps-muted)" }}>
                  Pankaj Soni, founder of the house
                </p>
                <Link href="/contact" className="ps-btn mt-8 inline-flex">
                  <span>Book an Appointment</span>
                </Link>
              </Reveal>
              <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6">
                {SYMBOLS.slice(2).map((s, i) => (
                  <Reveal key={s.t} delay={stagger(i)}><Symbol s={s} /></Reveal>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* close */}
      <section className="ps-band">
        <div className="mx-auto max-w-[880px] px-5 text-center sm:px-8">
          <MaskLines
            as="h2"
            className="ps-display text-[2.2rem] leading-[1.05] sm:text-[3.2rem]"
            lines={["Your occasion deserves", <span key="i" className="ps-display-i">to be made by hand.</span>]}
          />
          <Reveal delay={150}>
            <p className="mt-6 text-[.95rem] font-light" style={{ color: "var(--ps-muted)" }}>
              We would be honoured to make it with you.
            </p>
          </Reveal>
          <Reveal delay={250} className="mt-10">
            <Link href="/contact" className="ps-btn ps-btn-solid">
              <span>Book an Appointment</span>
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
