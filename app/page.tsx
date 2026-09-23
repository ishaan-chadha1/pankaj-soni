import Link from "next/link";
import { CATEGORIES, EDITORIAL, bySlug, featured, money } from "@/lib/catalog";
import { MaskLines, Reveal } from "./components/Reveal";
import { Parallax } from "./components/Parallax";
import { Curtain, FillRule } from "./components/Motif";
import LookBook from "./components/LookBook";
import CampaignHero from "./components/CampaignHero";
import LegacyCampaignHero from "./components/LegacyCampaignHero";
import Craft from "./components/Craft";
import ProductRail from "./components/ProductRail";
import { photo, photoSet } from "@/lib/photos";
import { stagger } from "@/lib/motion";

const MARQUEE = [
  "Cut in small numbers",
  "Embroidered by hand",
  "Cut in India and Italy",
  "Cloth chosen first",
  "Fittings by appointment",
  "Editions capped at nine hundred",
];

/*
 * Client services, given plates.
 *
 * Numerals and a line of copy read as a footer; the same four with a picture
 * over them read as part of the collection, which is what they are — every one
 * of these is a thing the atelier does to a garment. The four frames chosen are
 * the ones working least hard elsewhere on the page, so the block does not
 * echo a plate the eye passed two screens ago.
 */
const SERVICES = [
  {
    t: "Complimentary Delivery",
    d: "Express worldwide on every order above $250, in signature lacquer.",
    plate: "nocturne-gown-02",
  },
  {
    t: "Alterations",
    d: "Complimentary for the life of any tailored piece bought from the maison.",
    plate: "silver-seam-02",
  },
  {
    t: "The Atelier Fitting",
    d: "Three fittings on every occasion piece, in the boutique or by video.",
    plate: "orbit-03",
  },
  {
    t: "Private Appointment",
    d: "An hour with a consultant, in the boutique or by video, at no charge.",
    plate: "nocturne-gown-04",
  },
];

/* The house triptych — the three rooms the campaign is actually in. */
const HOUSE = [
  { slug: "women", plate: "nocturne-gown-01" },
  { slug: "men", plate: "silver-seam-02" },
  { slug: "occasion", plate: "orbit-02" },
];

export default function PsHome() {
  return <HomePage />;
}

export function HomePage({ legacyHero = false }: { legacyHero?: boolean }) {
  const hero = bySlug("noir-vine-bandhgala")!;
  const rail = featured();
  const triptych = HOUSE.map((h) => ({
    ...CATEGORIES.find((c) => c.slug === h.slug)!,
    plate: h.plate,
  }));

  return (
    <>
      {/*
        * Three portraits and a name. No product, no price, no navigation —
        * the opening frame of a collection is not a merchandising surface, and
        * everything below it is one.
        */}
      {legacyHero ? (
        <LegacyCampaignHero
          eyebrow="Autumn Campaign — Occasion"
          title="After Hours"
          sub="Dressed for the hours that follow."
          href="/c/occasion"
          cta="Shop the Campaign"
        />
      ) : (
        <CampaignHero
          eyebrow="Autumn Campaign — Occasion"
          title="After Hours"
          sub="Dressed for the hours that follow."
          href="/c/occasion"
          cta="Shop the Campaign"
        />
      )}

      {/* Straight into the clothes. Nothing between the campaign and the
          garments — the rail is the first thing the scroll reaches. */}
      <ProductRail
        items={rail}
        eyebrow="Autumn"
        title="Selected by the maison"
        href="/c/occasion"
      />

      {/* The shoppable frame — every garment in it links to its listing. */}
      <LookBook />

      {/* ───────────────────────── MARQUEE ───────────────────────── */}
      <div className="overflow-hidden py-5" style={{ borderTop: "1px solid var(--ps-line)", borderBottom: "1px solid var(--ps-line)" }}>
        <div className="ps-marquee">
          {[0, 1].map((dup) => (
            <div key={dup} className="flex shrink-0" aria-hidden={dup === 1}>
              {MARQUEE.map((m) => (
                <span key={m} className="ps-caps flex items-center whitespace-nowrap px-9">
                  <span style={{ color: "var(--ps-accent)" }} className="mr-9">
                    ✦
                  </span>
                  {m}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ───────────────────── THE WORK (the page's one dark band) ───────── */}
      <Craft />

      {/* ───────────────────────── SIGNATURE ───────────────────────── */}
      <section className="relative overflow-hidden">
        <div className="ps-band-l mx-auto grid max-w-[1560px] items-center gap-14 px-5 sm:px-8 lg:grid-cols-2 lg:gap-24">
          <Parallax speed={0.14} className="relative">
            <div className="ps-media aspect-[3/4]">
              <img
                src={photo("noir-vine-02")}
                alt="Close study of the crystal vine embroidery on the shoulder of a black bandhgala."
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover"
              />
            </div>
          </Parallax>

          <div>
            <Reveal>
              <p className="ps-caps" style={{ color: "var(--ps-accent)" }}>
                The Signature — {hero.line}
              </p>
            </Reveal>

            <MaskLines
              as="h2"
              className="ps-display mt-6 text-[2.8rem] leading-[0.98] sm:text-[4.2rem]"
              delay={80}
              lines={["Noir", <span key="vine" className="ps-display-i">Vine</span>]}
            />

            <Reveal delay={220}>
              <p className="mt-8 max-w-[52ch] text-[.95rem] font-light leading-relaxed" style={{ color: "var(--ps-muted)" }}>
                {hero.story}
              </p>
            </Reveal>

            {hero.spec ? (
              <Reveal delay={320}>
                <dl className="mt-12 grid gap-8 sm:grid-cols-3">
                  {(["cloth", "cut", "finish"] as const).map((k) => (
                    <div key={k} style={{ borderTop: "1px solid var(--ps-line)" }} className="pt-4">
                      <dt className="ps-caps mb-3" style={{ fontSize: ".55rem", color: "var(--ps-accent)" }}>
                        {k === "cloth" ? "Cloth" : k === "cut" ? "Cut" : "Finish"}
                      </dt>
                      <dd className="space-y-1.5 text-[.8rem] font-light" style={{ color: "var(--ps-muted)" }}>
                        {hero.spec![k].map((n: string) => (
                          <p key={n}>{n}</p>
                        ))}
                      </dd>
                    </div>
                  ))}
                </dl>
              </Reveal>
            ) : null}

            <Reveal delay={420} className="mt-12 flex flex-wrap items-center gap-7">
              <Link href={`/p/${hero.slug}`} className="ps-btn ps-btn-solid">
                <span>{hero.soldOut ? "View the Piece" : `From ${money(hero.variants[0].price)}`}</span>
              </Link>
              <Link href="/atelier" className="ps-caps ps-link ps-link-on">
                Compose Your Own
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ───────────────────────── TRIPTYCH ───────────────────────── */}
      <section className="ps-alt ps-band-l">
        <div className="mx-auto max-w-[1560px] px-5 sm:px-8">
          <div className="mb-16 flex flex-wrap items-end justify-between gap-6">
            <MaskLines as="h2" className="ps-display ps-h2" lines={["The House"]} />
            <Reveal delay={120}>
              <Link href="/c/women" className="ps-caps ps-link ps-link-on">
                View Everything
              </Link>
            </Reveal>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {triptych.map((c, i) => (
              <Reveal key={c.slug} delay={stagger(i)}>
                <Link href={`/c/${c.slug}`} className="group block">
                  <Curtain className="ps-media ps-zoom aspect-[3/4.1]" delay={stagger(i)}>
                    <img src={photo(c.plate)} alt="" loading="lazy" decoding="async" />
                    <div
                      className="absolute inset-x-0 bottom-0 p-7"
                      style={{
                        background:
                          "linear-gradient(0deg, rgba(10,10,10,.82) 6%, rgba(10,10,10,.42) 48%, transparent 86%)",
                      }}
                    >
                      <h3 className="ps-display text-[2rem] leading-none" style={{ color: "#f5f1e9" }}>
                        {c.label}
                      </h3>
                      <p className="mt-2.5 max-w-[30ch] text-[.8rem] font-light" style={{ color: "rgba(245,241,233,.74)" }}>
                        {c.tagline}
                      </p>
                      <span className="ps-caps mt-5 inline-block" style={{ color: "#f5f1e9" }}>
                        Discover
                      </span>
                    </div>
                  </Curtain>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────────────── CAMPAIGN ───────────────────────── */}
      <section className="ps-closer relative flex items-center overflow-hidden">
        <Parallax speed={0.22} className="absolute inset-0">
          <img
            src={photo("duet-03")}
            alt=""
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover"
            style={{ objectPosition: "60% 22%" }}
          />
        </Parallax>
        {/* Reads from the left, where the frame is empty seamless, and clears
            before it reaches the figures on the right. */}
        <div className="ps-closer-veil absolute inset-0" />

        <div className="relative z-[2] mx-auto w-full max-w-[1560px] px-5 sm:px-8">
          <div className="max-w-[640px]">
            <Reveal>
              <p className="ps-caps" style={{ color: "var(--ps-accent)" }}>
                Campaign — Autumn
              </p>
            </Reveal>
            <MaskLines
              as="h2"
              className="ps-display ps-h2 mt-7"
              delay={120}
              lines={[
                "Elegance is what",
                <span key="survives">
                  <span className="ps-display-i">survives</span> the room.
                </span>,
              ]}
            />
            <Reveal delay={420}>
              <Link href="/c/women" className="ps-btn ps-btn-solid mt-12">
                <span>View the Collection</span>
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ───────────────────────── JOURNAL ───────────────────────── */}
      <section className="ps-band-top pb-[var(--band-m)]">
        <div className="mx-auto max-w-[1560px] px-5 sm:px-8">
          <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
            <MaskLines as="h2" className="ps-display ps-h2" lines={["Journal"]} />
            <Reveal delay={120}>
              <Link href="/world" className="ps-caps ps-link ps-link-on">
                All Stories
              </Link>
            </Reveal>
          </div>

          {/*
            * Set as type, not as plates.
            *
            * Every frame from the shoot is already working somewhere above
            * this, and the generated washes that used to sit here read as
            * three empty boxes. Three journal entries do not need pictures to
            * be worth reading — and after a hero, a rail, a dark band of
            * detail and a shoppable frame, a page of nothing but photographs
            * is the thing that starts to feel cheap.
            */}
          <div className="grid gap-x-10 gap-y-12 md:grid-cols-3">
            {EDITORIAL.map((e, i) => (
              <Reveal key={e.slug} delay={stagger(i)}>
                <Link
                  href="/world"
                  className="ps-journal group block pt-6"
                  style={{ borderTop: "1px solid var(--ps-line-strong)" }}
                >
                  <p className="ps-caps" style={{ fontSize: ".55rem", color: "var(--ps-accent)" }}>
                    {e.eyebrow}
                  </p>
                  <h3 className="ps-display mt-4 text-[1.9rem] leading-[1.1]">{e.title}</h3>
                  <p className="mt-4 max-w-[38ch] text-[.86rem] font-light leading-relaxed" style={{ color: "var(--ps-muted)" }}>
                    {e.excerpt}
                  </p>
                  <span className="ps-caps ps-link ps-link-on mt-7 inline-block" style={{ fontSize: ".55rem" }}>
                    Read
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────────────── SERVICES ───────────────────────── */}
      <section>
        {/* the divider draws itself as it comes into view */}
        <FillRule accent={false} duration={1600} />
        <div className="ps-band mx-auto grid max-w-[1560px] gap-x-5 gap-y-12 px-5 sm:grid-cols-2 sm:px-8 lg:grid-cols-4">
          {SERVICES.map((s, i) => (
            <Reveal key={s.t} delay={stagger(i)}>
              <Curtain className="ps-media ps-zoom aspect-[4/5]" delay={stagger(i)}>
                <img
                  src={photo(s.plate)}
                  srcSet={photoSet(s.plate)}
                  sizes="(max-width: 639px) 92vw, (max-width: 1023px) 46vw, 23vw"
                  alt=""
                  loading="lazy"
                  decoding="async"
                />
              </Curtain>
              <p className="ps-display mt-5 text-[1.15rem]" style={{ color: "var(--ps-accent)" }}>
                0{i + 1}
              </p>
              <h3 className="ps-caps-lg mt-2.5">{s.t}</h3>
              <p className="mt-3 max-w-[34ch] text-[.82rem] font-light leading-relaxed" style={{ color: "var(--ps-muted)" }}>
                {s.d}
              </p>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
