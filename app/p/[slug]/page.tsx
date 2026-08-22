import type { Metadata } from "next";
import Link from "next/link";
import { ViewTransition } from "react";
import { notFound } from "next/navigation";
import { PRODUCTS, bySlug, category, related } from "@/lib/catalog";
import { MaskLines, Reveal } from "../../components/Reveal";
import ProductCard from "../../components/ProductCard";
import { JsonLd, breadcrumbLd, productLd } from "@/lib/seo";
import SplitText from "../../components/SplitText";
import Buy from "./Buy";
import { stagger } from "@/lib/motion";

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(
  props: PageProps<"/p/[slug]">
): Promise<Metadata> {
  const { slug } = await props.params;
  const p = bySlug(slug);
  if (!p) return { title: "Not found" };
  return {
    title: p.name,
    description: `${p.kicker} — ${p.line} by PANKAJ SONI.`,
    alternates: { canonical: `/p/${p.slug}` },
    openGraph: {
      title: `${p.name} | PANKAJ SONI`,
      description: p.kicker,
      url: `/p/${p.slug}`,
      images: [{ url: p.image, alt: p.name }],
    },
  };
}

export default async function ProductPage(props: PageProps<"/p/[slug]">) {
  const { slug } = await props.params;
  const product = bySlug(slug);
  if (!product) notFound();

  const cat = category(product.category);
  const alsoLike = related(product, 4);

  const accordions = [
    { title: "Details", body: product.details },
    ...(product.composition
      ? [{ title: "Composition", body: [product.composition] }]
      : []),
    {
      title: "Delivery & Returns",
      body: [
        "Complimentary express delivery worldwide on orders above $250.",
        "Dispatched within 24 hours, Monday to Friday.",
        "Complimentary returns within 30 days, unworn and in original packaging.",
      ],
    },
    {
      title: "The Maison",
      body: [
        "Made in small numbers and finished by hand.",
        "Book a private appointment with a consultant in any boutique or by video.",
      ],
    },
  ];

  return (
    <>
      <JsonLd
        data={[
          productLd(product),
          breadcrumbLd([
            { name: "Maison", path: "/" },
            { name: cat?.label ?? product.category, path: `/c/${product.category}` },
            { name: product.name, path: `/p/${product.slug}` },
          ]),
        ]}
      />

      <div className="mx-auto max-w-[1560px] px-5 pt-8 sm:px-8">
        <nav className="ps-caps flex flex-wrap items-center gap-2" style={{ fontSize: ".54rem", color: "var(--ps-faint)" }}>
          <Link href="/" className="ps-link">
            Maison
          </Link>
          <span>/</span>
          <Link href={`/c/${product.category}`} className="ps-link">
            {cat?.label}
          </Link>
          <span>/</span>
          <span style={{ color: "var(--ps-accent)" }}>{product.name}</span>
        </nav>
      </div>

      {/* ── main ── */}
      <section className="mx-auto grid max-w-[1560px] gap-12 px-5 py-10 sm:px-8 lg:grid-cols-[1.15fr_1fr] lg:gap-20 lg:py-14">
        {/* gallery */}
        <div className="space-y-5">
          <div className="ps-media relative aspect-[4/5]">
            {/* Matches the name on the grid card, so the plate morphs in from
                wherever it was clicked instead of the page hard-cutting. */}
            <ViewTransition name={`plate-${product.slug}`} share="morph">
              <img
                src={product.image}
                alt={product.name}
                className="h-full w-full object-contain p-8 sm:p-16"
              />
            </ViewTransition>
            <div
              className="pointer-events-none absolute inset-0 -z-10"
              style={{ background: "radial-gradient(circle at 50% 42%, rgba(201,169,97,.14), transparent 65%)" }}
            />
            {product.badge ? (
              <span
                className="ps-caps absolute left-5 top-5 px-3 py-1.5"
                style={{ background: "color-mix(in srgb, var(--ps-invert-bg) 78%, transparent)", color: "var(--ps-invert-text)", fontSize: ".54rem" }}
              >
                {product.badge}
              </span>
            ) : null}
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div className="ps-media ps-zoom aspect-square">
              <img src={product.hover} alt="" loading="lazy" decoding="async" />
            </div>
            <div className="ps-media ps-zoom aspect-square">
              <img src={cat?.image ?? "/img/p-ed-01.svg"} alt="" loading="lazy" decoding="async" />
            </div>
          </div>
        </div>

        {/* buy column */}
        <div className="lg:sticky lg:top-[110px] lg:h-fit lg:pt-4">
          <Reveal>
            <p className="ps-caps" style={{ color: "var(--ps-accent)" }}>
              {product.line}
            </p>
          </Reveal>

          <SplitText
            as="h1"
            text={product.name}
            delay={60}
            className="ps-display mt-4 text-[2.6rem] leading-[1] sm:text-[3.4rem]"
          />

          <Reveal delay={180}>
            <p className="mt-3 text-[.86rem] font-light" style={{ color: "var(--ps-muted)" }}>
              {product.kicker}
            </p>
          </Reveal>

          <Reveal delay={240}>
            <p className="mt-8 max-w-[54ch] text-[.92rem] font-light leading-relaxed" style={{ color: "var(--ps-muted)" }}>
              {product.story}
            </p>
          </Reveal>

          <Reveal delay={320}>
            <div className="mt-10">
              <Buy product={product} />
            </div>
          </Reveal>

          {/* accordions — details/summary keeps this interactive with zero JS */}
          <div className="mt-12">
            {accordions.map((a) => (
              <details key={a.title} className="group" style={{ borderTop: "1px solid var(--ps-line)" }}>
                <summary className="ps-caps flex cursor-pointer list-none items-center justify-between py-5">
                  {a.title}
                  <span
                    className="text-[1rem] transition-transform ps-t-base group-open:rotate-45"
                    style={{ color: "var(--ps-accent)" }}
                  >
                    +
                  </span>
                </summary>
                <ul className="space-y-2.5 pb-6 text-[.82rem] font-light leading-relaxed" style={{ color: "var(--ps-muted)" }}>
                  {a.body.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              </details>
            ))}
            <div style={{ borderTop: "1px solid var(--ps-line)" }} />
          </div>
        </div>
      </section>

      {/* ── notes pyramid ── */}
      {product.spec ? (
        <section style={{ background: "var(--ps-bg-alt)", borderTop: "1px solid var(--ps-line)" }}>
          <div className="mx-auto max-w-[1560px] px-5 py-24 sm:px-8">
            <div className="mb-14 text-center">
              <Reveal>
                <p className="ps-caps" style={{ color: "var(--ps-accent)" }}>
                  How it is made
                </p>
              </Reveal>
              <MaskLines
            as="h2"
                className="ps-display mt-5 text-[2.2rem] sm:text-[3rem]"
                delay={80}
                lines={["Cloth, cut and finish"]}
              />
            </div>

            <div className="mx-auto grid max-w-[1100px] gap-10 md:grid-cols-3">
              {(["cloth", "cut", "finish"] as const).map((k, i) => (
                <Reveal key={k} delay={stagger(i)}>
                  <div className="text-center">
                    <p className="ps-display text-[2.6rem] leading-none" style={{ color: "var(--ps-faint)" }}>
                      0{i + 1}
                    </p>
                    <p className="ps-caps mt-4" style={{ color: "var(--ps-accent)" }}>
                      {k === "cloth" ? "Cloth" : k === "cut" ? "Cut" : "Finish"}
                    </p>
                    <hr className="ps-rule mx-auto my-6 w-16" />
                    <ul className="space-y-2 text-[.9rem] font-light" style={{ color: "var(--ps-muted)" }}>
                      {product.spec![k].map((n: string) => (
                        <li key={n}>{n}</li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal delay={400} className="mt-16 text-center">
              <Link href="/atelier" className="ps-btn">
                <span>Compose Your Own</span>
              </Link>
            </Reveal>
          </div>
        </section>
      ) : null}

      {/* ── related ── */}
      <section className="mx-auto max-w-[1560px] px-5 py-24 sm:px-8">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-5">
          <MaskLines as="h2" className="ps-display text-[2rem] sm:text-[2.8rem]" lines={["You may also like"]} />
          <Reveal delay={100}>
            <Link href={`/c/${product.category}`} className="ps-caps ps-link ps-link-on">
              All {cat?.label}
            </Link>
          </Reveal>
        </div>

        <div className="grid grid-cols-2 gap-x-5 gap-y-12 lg:grid-cols-4">
          {alsoLike.map((p, i) => (
            <Reveal key={p.slug} delay={stagger(i)}>
              <ProductCard product={p} index={i} />
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
