import Link from "next/link";
import { CATEGORIES, EDITORIAL, PRODUCTS, bySlug, featured, money } from "@/lib/catalog";
import { MaskLines, Reveal } from "./components/Reveal";
import { Parallax } from "./components/Parallax";
import ProductCard from "./components/ProductCard";
import { Curtain, FillRule } from "./components/Motif";
import LookBook from "./components/LookBook";
import VideoHero from "./components/VideoHero";
import ProductRail from "./components/ProductRail";
import { stagger } from "@/lib/motion";

const MARQUEE = [
  "Cut in small numbers",
  "Made in small numbers",
  "Cut in Italy and Scotland",
  "Cloth chosen first",
  "Engraving on request",
  "Appointment only",
];


const SERVICES = [
  { t: "Complimentary Delivery", d: "Express worldwide on every order above $250, in signature lacquer." },
  { t: "Alterations", d: "Complimentary for the life of any tailored piece bought from the maison." },
  { t: "The Refill Service", d: "Return any décanteur to a boutique and have it filled, not replaced." },
  { t: "Private Appointment", d: "An hour with a consultant, in the boutique or by video, at no charge." },
];

export default function PsHome() {
  const hero = bySlug("double-face-overcoat")!;
  const rail = featured();
  const triptych = CATEGORIES.filter((c) =>
    ["women", "men", "outerwear"].includes(c.slug)
  );

  return (
    <>
      {/*
        * The film is the hero. No headline over it — a garment moving in real
        * light outruns a line of type, and copy on top asks the eye to do two
        * things at once. The <h1> ships inside it, visually hidden, so the
        * document still has a title.
        */}
      <VideoHero
        src="/video/look-01.mp4"
        poster="/img/look/look-01-poster.jpg"
        eyebrow="Autumn Collection — Private Atelier"
        title="Dressed for the hours that follow"
        alt="A model in a cream linen shirt and pleated trousers, in a walnut-panelled room."
      />

      {/* Straight into the clothes. Nothing between the film and the garments —
          the rail is the first thing the scroll reaches. */}
      <ProductRail
        items={rail}
        eyebrow="Autumn"
        title="Selected by the maison"
        href="/c/men"
      />

      {/* The shoppable campaign — every garment in frame links to its listing. */}
      <LookBook />

      {/* ───────────────────────── MARQUEE ───────────────────────── */}
      <div className="overflow-hidden py-5" style={{ borderBottom: "1px solid var(--ps-line)" }}>
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

      {/* ───────────────────────── TRIPTYCH ───────────────────────── */}
      <section className="ps-alt ps-band-l">
        <div className="mx-auto max-w-[1560px] px-5 sm:px-8">
          <div className="mb-16 flex flex-wrap items-end justify-between gap-6">
          <MaskLines
            as="h2"
            className="ps-display ps-h2"
            lines={["The House"]}
          />
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
                <Curtain
                  className="ps-media ps-zoom ps-tint aspect-[3/4.1]"
                  delay={stagger(i)}
                >
                  <img src={c.image} alt="" loading="lazy" decoding="async" />
                  <div
                    className="absolute inset-x-0 bottom-0 p-7"
                    style={{
                      background: "linear-gradient(0deg, var(--ps-bg) 4%, rgba(255,255,255,.72) 42%, transparent 82%)",
                    }}
                  >
                    <h3 className="ps-display text-[2rem] leading-none">{c.label}</h3>
                    <p className="mt-2.5 max-w-[30ch] text-[.8rem] font-light" style={{ color: "var(--ps-muted)" }}>
                      {c.tagline}
                    </p>
                    <span className="ps-caps ps-link ps-link-on mt-5 inline-block" style={{ color: "var(--ps-accent)" }}>
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

      {/* ───────────────────────── SIGNATURE ───────────────────────── */}
      <section className="relative overflow-hidden">
        <div className="ps-band-l mx-auto grid max-w-[1560px] items-center gap-14 px-5 sm:px-8 lg:grid-cols-2 lg:gap-24">
          <Parallax speed={0.14} className="relative">
            <div className="ps-media aspect-[4/5]">
              <img src={hero.image} alt={hero.name} loading="lazy" decoding="async" className="object-contain p-10" />
            </div>
            <div
              className="pointer-events-none absolute inset-0 -z-10 blur-3xl"
              style={{ background: "radial-gradient(circle at 50% 45%, rgba(201,169,97,.20), transparent 62%)" }}
            />
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
              lines={["Noir", <span key="imperial" className="ps-display-i">Impérial</span>]}
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
                <span>From {money(hero.variants[0].price)}</span>
              </Link>
              <Link href="/atelier" className="ps-caps ps-link ps-link-on">
                Compose Your Own
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ───────────────────────── CAMPAIGN ───────────────────────── */}
      <section className="ps-invert relative flex min-h-[86svh] items-center justify-center overflow-hidden">
        <Parallax speed={0.3} className="absolute inset-0 scale-110">
          <img src="/img/p-hero-03.svg" alt="" loading="lazy" decoding="async" className="h-full w-full object-cover" />
        </Parallax>
        {/* This is the one inverted band on the page, so the veil has to darken
            rather than lighten — the type above it is paper-coloured. */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, color-mix(in srgb, var(--ps-invert-bg) 82%, transparent), color-mix(in srgb, var(--ps-invert-bg) 68%, transparent))",
          }}
        />

        <div className="relative z-[2] mx-auto max-w-[900px] px-6 text-center">
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
      </section>

      {/* ───────────────────────── JOURNAL ───────────────────────── */}
      <section className="ps-alt ps-band-l">
        <div className="mx-auto max-w-[1560px] px-5 sm:px-8">
        <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
          <MaskLines as="h2" className="ps-display ps-h2" lines={["Journal"]} />
          <Reveal delay={120}>
            <Link href="/world" className="ps-caps ps-link ps-link-on">
              All Stories
            </Link>
          </Reveal>
        </div>

        <div className="grid gap-10 md:grid-cols-3">
          {EDITORIAL.map((e, i) => (
            <Reveal key={e.slug} delay={stagger(i)}>
              <Link href="/world" className="group block">
                <div className="ps-media ps-zoom ps-tint aspect-[4/3]">
                  <img src={e.image} alt="" loading="lazy" decoding="async" />
                </div>
                <p className="ps-caps mt-5" style={{ fontSize: ".55rem", color: "var(--ps-accent)" }}>
                  {e.eyebrow}
                </p>
                <h3 className="ps-display mt-2.5 text-[1.6rem] leading-tight">{e.title}</h3>
                <p className="mt-3 text-[.84rem] font-light leading-relaxed" style={{ color: "var(--ps-muted)" }}>
                  {e.excerpt}
                </p>
                <span className="ps-caps ps-link mt-5 inline-block" style={{ fontSize: ".55rem" }}>
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
        <div className="ps-band-l mx-auto grid max-w-[1560px] gap-y-12 px-5 sm:grid-cols-2 sm:px-8 lg:grid-cols-4 lg:gap-x-10">
          {SERVICES.map((s, i) => (
            <Reveal key={s.t} delay={stagger(i)} className="lg:px-2">
              <p className="ps-display text-[1.15rem]" style={{ color: "var(--ps-accent)" }}>
                0{i + 1}
              </p>
              <h3 className="ps-caps-lg mt-4">{s.t}</h3>
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
