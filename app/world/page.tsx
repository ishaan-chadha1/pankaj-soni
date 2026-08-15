import type { Metadata } from "next";
import Link from "next/link";
import { EDITORIAL } from "@/lib/catalog";
import { MaskLines, Reveal } from "../components/Reveal";
import { HeroPlate, Parallax } from "../components/Parallax";

export const metadata: Metadata = {
  title: "The Maison",
  description:
    "Inside the house of PANKAJ SONI — the shoulder, the maturation room, and the case for making fewer things.",
  alternates: { canonical: "/world" },
};

const CHAPTERS = [
  {
    n: "I",
    title: "The Shoulder",
    body: [
      "Every jacket the house makes is drafted from one shoulder: extended by a centimetre, softly padded, and cut high in the armhole so the body of the jacket stays still while the arm moves.",
      "It is the least visible decision in the collection and the only one that is never up for discussion.",
    ],
    image: "/img/p-ed-02.svg",
  },
  {
    n: "II",
    title: "Eleven Weeks",
    body: [
      "A finished composition goes into steel and stays there for eleven weeks before a single flacon is filled. Nothing is added during that time. The materials simply stop arguing with each other.",
      "It is the reason a Private Atelier fragrance smells the same in the eighth hour as it does in the first.",
    ],
    image: "/img/p-ed-01.svg",
  },
  {
    n: "III",
    title: "Fewer Things",
    body: [
      "Editions are capped at nine hundred. Ready-to-wear is cut in a single run and not repeated. We are asked constantly to make more, and we have declined every time.",
      "Scarcity is not a marketing position here. It is what happens when the finishing is done by the same eleven people.",
    ],
    image: "/img/p-ed-03.svg",
  },
];

const SERVICES = [
  ["Private Appointment", "An hour with a consultant, in any boutique or by video, at no charge."],
  ["Engraving", "Up to sixteen characters, hand-set on any Private Atelier flacon."],
  ["The Refill Service", "Return a décanteur to a boutique and have it filled rather than replaced."],
  ["Alterations", "Complimentary for the life of any tailored piece bought from the maison."],
];

export default function WorldPage() {
  return (
    <>
      <section className="relative flex min-h-[80svh] items-center justify-center overflow-hidden">
        <HeroPlate src="/img/p-hero-02.svg" />
        <div className="relative z-[2] mx-auto max-w-[960px] px-6 text-center">
          <Reveal>
            <p className="ps-caps" style={{ color: "var(--ps-accent)" }}>
              The Maison — Since 1998
            </p>
          </Reveal>
          <MaskLines
            as="h1"
            className="ps-display mt-8 text-[2.8rem] leading-[1] sm:text-[5rem]"
            delay={150}
            lines={["We make fewer", "things, and we", <span key="finish" className="ps-display-i">finish them.</span>]}
          />
        </div>
      </section>

      {/* manifesto */}
      <section className="ps-alt">
        <div className="mx-auto max-w-[880px] px-5 py-24 text-center sm:px-8 lg:py-32">
          <Reveal>
            <p
              className="ps-display text-[1.5rem] leading-[1.45] sm:text-[2.1rem]"
              style={{ letterSpacing: "-0.01em" }}
            >
              A house is not a logo applied to objects. It is a set of decisions taken
              early, defended quietly, and repeated until they look inevitable.
            </p>
          </Reveal>
          <Reveal delay={200}>
            <p className="ps-caps mt-10" style={{ color: "var(--ps-faint)" }}>
              The House Position
            </p>
          </Reveal>
        </div>
      </section>

      {/* chapters */}
      {CHAPTERS.map((c, i) => (
        <section
          key={c.n}
          style={{ background: i % 2 ? "var(--ps-bg-alt)" : "var(--ps-bg)", borderTop: "1px solid var(--ps-line)" }}
        >
          <div
            className={`mx-auto grid max-w-[1560px] items-center gap-14 px-5 py-24 sm:px-8 lg:grid-cols-2 lg:gap-24 lg:py-32 ${
              i % 2 ? "lg:[&>*:first-child]:order-2" : ""
            }`}
          >
            <Parallax speed={0.12}>
              <div className="ps-media ps-zoom aspect-[4/5]">
                <img src={c.image} alt="" loading="lazy" decoding="async" />
              </div>
            </Parallax>

            <div>
              <Reveal>
                <p className="ps-display text-[3rem] leading-none" style={{ color: "var(--ps-faint)" }}>
                  {c.n}
                </p>
              </Reveal>
              <MaskLines
            as="h2"
                className="ps-display mt-5 text-[2.4rem] leading-none sm:text-[3.4rem]"
                delay={80}
                lines={[c.title]}
              />
              <div className="mt-8 space-y-5">
                {c.body.map((p, j) => (
                  <Reveal key={j} delay={200 + j * 100}>
                    <p className="max-w-[54ch] text-[.95rem] font-light leading-relaxed" style={{ color: "var(--ps-muted)" }}>
                      {p}
                    </p>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* services */}
      <section style={{ borderTop: "1px solid var(--ps-line)" }}>
        <div className="mx-auto max-w-[1560px] px-5 py-24 sm:px-8">
          <MaskLines
            as="h2"
            className="ps-display ps-h2 mb-16"
            lines={["Client Services"]}
          />
          <div className="grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {SERVICES.map(([t, d], i) => (
              <Reveal key={t} delay={i * 90}>
                <div className="pt-5" style={{ borderTop: "1px solid var(--ps-line)" }}>
                  <h3 className="ps-caps-lg">{t}</h3>
                  <p className="mt-3 text-[.84rem] font-light leading-relaxed" style={{ color: "var(--ps-muted)" }}>
                    {d}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* journal */}
      <section style={{ borderTop: "1px solid var(--ps-line)" }}>
        <div className="mx-auto max-w-[1560px] px-5 py-24 sm:px-8">
          <MaskLines as="h2" className="ps-display ps-h2 mb-14" lines={["From the Journal"]} />
          <div className="grid gap-10 md:grid-cols-3">
            {EDITORIAL.map((e, i) => (
              <Reveal key={e.slug} delay={i * 110}>
                <article className="group">
                  <div className="ps-media ps-zoom aspect-[4/3]">
                    <img src={e.image} alt="" loading="lazy" decoding="async" />
                  </div>
                  <p className="ps-caps mt-5" style={{ fontSize: ".55rem", color: "var(--ps-accent)" }}>
                    {e.eyebrow}
                  </p>
                  <h3 className="ps-display mt-2.5 text-[1.6rem] leading-tight">{e.title}</h3>
                  <p className="mt-3 text-[.84rem] font-light leading-relaxed" style={{ color: "var(--ps-muted)" }}>
                    {e.excerpt}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* boutiques */}
      <section className="relative flex min-h-[70svh] items-center overflow-hidden">
        <Parallax speed={0.26} className="absolute inset-0 scale-110">
          <img src="/img/p-hero-01.svg" alt="" loading="lazy" decoding="async" className="h-full w-full object-cover" />
        </Parallax>
        <div className="absolute inset-0" style={{ background: "rgba(255,255,255,.48)" }} />
        <div className="relative z-[2] mx-auto w-full max-w-[1560px] px-5 sm:px-8">
          <Reveal>
            <p className="ps-caps" style={{ color: "var(--ps-accent)" }}>
              Boutiques
            </p>
          </Reveal>
          <MaskLines
            as="h2"
            className="ps-display mt-6 text-[2.4rem] leading-none sm:text-[3.8rem]"
            delay={100}
            lines={["Five rooms,", <span key="appt" className="ps-display-i">by appointment.</span>]}
          />
          <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
            {[
              ["Mumbai", "Colaba Causeway"],
              ["New Delhi", "Chanakyapuri"],
              ["Paris", "Rue Saint-Honoré"],
              ["Milan", "Via Montenapoleone"],
              ["New York", "Madison Avenue"],
            ].map(([city, street], i) => (
              <Reveal key={city} delay={i * 90}>
                <div className="pt-4" style={{ borderTop: "1px solid var(--ps-line-strong)" }}>
                  <p className="ps-display text-[1.5rem]">{city}</p>
                  <p className="mt-1.5 text-[.8rem] font-light" style={{ color: "var(--ps-muted)" }}>
                    {street}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={500}>
            <Link href="/atelier" className="ps-btn ps-btn-solid mt-14">
              <span>Enter the Olfactory Engine</span>
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
