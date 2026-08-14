import Link from "next/link";
import { CATEGORIES, EDITORIAL, PRODUCTS, bySlug, featured, money } from "@/lib/catalog";
import { MaskLines, Reveal } from "./components/Reveal";
import { HeroPlate, Parallax } from "./components/Parallax";
import ProductCard from "./components/ProductCard";

const MARQUEE = [
  "Private Atelier",
  "Made in small numbers",
  "Composed in Grasse",
  "Refillable flacons",
  "Engraving on request",
  "Appointment only",
];

const SERVICES = [
  { t: "Complimentary Delivery", d: "Express worldwide on every order above $250, in signature lacquer." },
  { t: "Engraving", d: "Up to sixteen characters, hand-set on any flacon in the Private Atelier." },
  { t: "The Refill Service", d: "Return any décanteur to a boutique and have it filled, not replaced." },
  { t: "Private Appointment", d: "An hour with a consultant, in the boutique or by video, at no charge." },
];

export default function PsHome() {
  const hero = bySlug("noir-imperial")!;
  const rail = featured();
  const triptych = CATEGORIES.filter((c) =>
    ["fragrance", "women", "eyewear"].includes(c.slug)
  );

  return (
    <>
      {/* ───────────────────────── HERO ───────────────────────── */}
      <section className="relative flex min-h-[94svh] items-end overflow-hidden">
        <HeroPlate src="/img/p-hero-01.svg" alt="" />

        <div className="relative z-[2] mx-auto w-full max-w-[1560px] px-5 pb-20 sm:px-8 lg:pb-28">
          <Reveal>
            <p className="ps-caps" style={{ color: "var(--gold)" }}>
              Autumn Collection — Private Atelier
            </p>
          </Reveal>

          <MaskLines
            className="ps-display mt-7 text-[3rem] leading-[0.95] sm:text-[5.4rem] lg:text-[7.4rem]"
            delay={180}
            lines={[
              "Dressed for",
              <span key="hours">
                the <span className="ps-display-i" style={{ color: "var(--gold)" }}>hours</span> that
              </span>,
              "follow.",
            ]}
          />

          <div className="mt-10 flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
            <Reveal delay={520}>
              <p className="max-w-[42ch] text-[.95rem] font-light" style={{ color: "rgba(244,241,234,.74)" }}>
                Eight compositions built on leather, oud and incense — matured eleven
                weeks before a single flacon is filled.
              </p>
            </Reveal>

            <Reveal delay={640} className="flex flex-wrap gap-4">
              <Link href="/c/fragrance" className="ps-btn ps-btn-solid">
                <span>Shop Fragrance</span>
              </Link>
              <Link href="/atelier" className="ps-btn">
                <span>The Olfactory Engine</span>
              </Link>
            </Reveal>
          </div>
        </div>

        <div
          className="absolute bottom-0 left-1/2 z-[2] hidden h-16 w-px -translate-x-1/2 lg:block"
          style={{ background: "linear-gradient(180deg, transparent, rgba(244,241,234,.5))" }}
        />
      </section>

      {/* ───────────────────────── MARQUEE ───────────────────────── */}
      <div className="overflow-hidden py-5" style={{ borderBottom: "1px solid var(--ps-line)" }}>
        <div className="ps-marquee">
          {[0, 1].map((dup) => (
            <div key={dup} className="flex shrink-0" aria-hidden={dup === 1}>
              {MARQUEE.map((m) => (
                <span key={m} className="ps-caps flex items-center whitespace-nowrap px-9">
                  <span style={{ color: "var(--gold)" }} className="mr-9">
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
      <section className="mx-auto max-w-[1560px] px-5 py-24 sm:px-8 lg:py-32">
        <div className="mb-16 flex flex-wrap items-end justify-between gap-6">
          <MaskLines
            className="ps-display text-[2.4rem] leading-none sm:text-[3.4rem]"
            lines={["The House"]}
          />
          <Reveal delay={120}>
            <Link href="/c/fragrance" className="ps-caps ps-link ps-link-on">
              View Everything
            </Link>
          </Reveal>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {triptych.map((c, i) => (
            <Reveal key={c.slug} delay={i * 130}>
              <Link href={`/c/${c.slug}`} className="group block">
                <div className="ps-media ps-zoom aspect-[3/4.1]">
                  <img src={c.image} alt="" loading="lazy" decoding="async" />
                  <div
                    className="absolute inset-x-0 bottom-0 p-7"
                    style={{
                      background: "linear-gradient(0deg, rgba(6,6,7,.86), transparent)",
                    }}
                  >
                    <h3 className="ps-display text-[2rem] leading-none">{c.label}</h3>
                    <p className="mt-2.5 max-w-[30ch] text-[.8rem] font-light" style={{ color: "rgba(244,241,234,.72)" }}>
                      {c.tagline}
                    </p>
                    <span className="ps-caps ps-link ps-link-on mt-5 inline-block" style={{ color: "var(--gold)" }}>
                      Discover
                    </span>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ───────────────────────── SIGNATURE ───────────────────────── */}
      <section className="relative overflow-hidden" style={{ background: "#0e0d0c" }}>
        <div className="mx-auto grid max-w-[1560px] items-center gap-14 px-5 py-24 sm:px-8 lg:grid-cols-2 lg:gap-24 lg:py-36">
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
              <p className="ps-caps" style={{ color: "var(--gold)" }}>
                The Signature — {hero.line}
              </p>
            </Reveal>

            <MaskLines
              className="ps-display mt-6 text-[2.8rem] leading-[0.98] sm:text-[4.2rem]"
              delay={80}
              lines={["Noir", <span key="imperial" className="ps-display-i">Impérial</span>]}
            />

            <Reveal delay={220}>
              <p className="mt-8 max-w-[52ch] text-[.95rem] font-light leading-relaxed" style={{ color: "var(--ps-muted)" }}>
                {hero.story}
              </p>
            </Reveal>

            {hero.notes ? (
              <Reveal delay={320}>
                <dl className="mt-12 grid gap-8 sm:grid-cols-3">
                  {(["head", "heart", "base"] as const).map((k) => (
                    <div key={k} style={{ borderTop: "1px solid var(--ps-line)" }} className="pt-4">
                      <dt className="ps-caps mb-3" style={{ fontSize: ".55rem", color: "var(--gold)" }}>
                        {k === "head" ? "Top" : k === "heart" ? "Heart" : "Base"}
                      </dt>
                      <dd className="space-y-1.5 text-[.8rem] font-light" style={{ color: "var(--ps-muted)" }}>
                        {hero.notes![k].map((n) => (
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

      {/* ───────────────────────── RAIL ───────────────────────── */}
      <section className="py-24 lg:py-32">
        <div className="mx-auto mb-14 flex max-w-[1560px] flex-wrap items-end justify-between gap-6 px-5 sm:px-8">
          <MaskLines
            className="ps-display text-[2.4rem] leading-none sm:text-[3.4rem]"
            lines={["Selected by the maison"]}
          />
          <Reveal delay={120}>
            <p className="max-w-[34ch] text-[.85rem] font-light" style={{ color: "var(--ps-muted)" }}>
              The pieces our consultants reach for first.
            </p>
          </Reveal>
        </div>

        <div className="ps-norail overflow-x-auto pb-2">
          <div className="flex gap-5 px-5 sm:px-8" style={{ width: "max-content" }}>
            {rail.map((p, i) => (
              <Reveal key={p.slug} delay={i * 70} className="w-[74vw] sm:w-[38vw] lg:w-[23vw] xl:w-[19vw]">
                <ProductCard product={p} index={i} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────────────── LIGHT EDITORIAL ───────────────────────── */}
      <section className="ps-light">
        <div className="mx-auto grid max-w-[1560px] items-center gap-14 px-5 py-24 sm:px-8 lg:grid-cols-[1.05fr_1fr] lg:gap-24 lg:py-36">
          <Reveal>
            <div className="ps-media ps-zoom aspect-[4/5]">
              <img src="/img/p-ed-02.svg" alt="" loading="lazy" decoding="async" />
            </div>
          </Reveal>

          <div>
            <Reveal>
              <p className="ps-caps" style={{ color: "var(--gold-dim)" }}>
                The Atelier
              </p>
            </Reveal>
            <MaskLines
              className="ps-display mt-6 text-[2.6rem] leading-[1] sm:text-[3.8rem]"
              delay={80}
              lines={[
                "Nothing leaves",
                "the atelier",
                <span key="unfinished" className="ps-display-i">
                  unfinished.
                </span>,
              ]}
            />
            <Reveal delay={280}>
              <p className="mt-8 max-w-[54ch] text-[.95rem] font-light leading-relaxed" style={{ color: "var(--ps-muted)" }}>
                Every jacket is drafted from one shoulder — extended, softly padded,
                high in the armhole. Every flacon is polished by hand and matured
                before filling. We make fewer pieces than we could sell, and we have
                never once regretted it.
              </p>
            </Reveal>
            <Reveal delay={380}>
              <div className="mt-12 grid grid-cols-3 gap-8">
                {[
                  ["1998", "Maison founded"],
                  ["11", "Weeks of maturation"],
                  ["900", "Flacons per edition"],
                ].map(([n, l]) => (
                  <div key={l} style={{ borderTop: "1px solid var(--ps-line)" }} className="pt-4">
                    <p className="ps-display text-[2.2rem] leading-none">{n}</p>
                    <p className="ps-caps mt-2" style={{ fontSize: ".54rem", color: "var(--ps-faint)" }}>
                      {l}
                    </p>
                  </div>
                ))}
              </div>
            </Reveal>
            <Reveal delay={460}>
              <Link href="/world" className="ps-btn mt-12">
                <span>Inside the Maison</span>
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ───────────────────────── CAMPAIGN ───────────────────────── */}
      <section className="relative flex min-h-[86svh] items-center justify-center overflow-hidden">
        <Parallax speed={0.3} className="absolute inset-0 scale-110">
          <img src="/img/p-hero-03.svg" alt="" loading="lazy" decoding="async" className="h-full w-full object-cover" />
        </Parallax>
        <div className="absolute inset-0" style={{ background: "rgba(6,6,7,.5)" }} />

        <div className="relative z-[2] mx-auto max-w-[900px] px-6 text-center">
          <Reveal>
            <p className="ps-caps" style={{ color: "var(--gold)" }}>
              Campaign — Autumn
            </p>
          </Reveal>
          <MaskLines
            className="ps-display mt-7 text-[2.6rem] leading-[1] sm:text-[4.6rem]"
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
      <section className="mx-auto max-w-[1560px] px-5 py-24 sm:px-8 lg:py-32">
        <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
          <MaskLines className="ps-display text-[2.4rem] leading-none sm:text-[3.4rem]" lines={["Journal"]} />
          <Reveal delay={120}>
            <Link href="/world" className="ps-caps ps-link ps-link-on">
              All Stories
            </Link>
          </Reveal>
        </div>

        <div className="grid gap-10 md:grid-cols-3">
          {EDITORIAL.map((e, i) => (
            <Reveal key={e.slug} delay={i * 120}>
              <Link href="/world" className="group block">
                <div className="ps-media ps-zoom aspect-[4/3]">
                  <img src={e.image} alt="" loading="lazy" decoding="async" />
                </div>
                <p className="ps-caps mt-5" style={{ fontSize: ".55rem", color: "var(--gold)" }}>
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
      </section>

      {/* ───────────────────────── SERVICES ───────────────────────── */}
      <section style={{ borderTop: "1px solid var(--ps-line)" }}>
        <div className="mx-auto grid max-w-[1560px] gap-y-12 px-5 py-20 sm:grid-cols-2 sm:px-8 lg:grid-cols-4 lg:gap-x-10">
          {SERVICES.map((s, i) => (
            <Reveal key={s.t} delay={i * 90} className="lg:px-2">
              <p className="ps-display text-[1.15rem]" style={{ color: "var(--gold)" }}>
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
