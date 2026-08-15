import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CATEGORIES, byCategory, category, type Category } from "@/lib/catalog";
import { MaskLines, Reveal } from "../../components/Reveal";
import CategoryGrid from "./CategoryGrid";

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ category: c.slug }));
}

export async function generateMetadata(
  props: PageProps<"/c/[category]">
): Promise<Metadata> {
  const { category: slug } = await props.params;
  const c = category(slug);
  return c
    ? { title: c.label, description: c.tagline }
    : { title: "Not found" };
}

export default async function CategoryPage(props: PageProps<"/c/[category]">) {
  const { category: slug } = await props.params;
  const c = category(slug);
  if (!c) notFound();

  const products = byCategory(c.slug as Category);

  return (
    <>
      {/* banner */}
      <section className="relative flex min-h-[52svh] items-end overflow-hidden">
        <div className="absolute inset-0">
          <img src={c.image} alt="" className="h-full w-full object-cover" />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(255,255,255,.34) 0%, rgba(255,255,255,.08) 38%, var(--ps-bg) 100%)",
            }}
          />
        </div>

        <div className="relative z-[2] mx-auto w-full max-w-[1560px] px-5 pb-14 sm:px-8">
          <Reveal>
            <nav className="ps-caps flex items-center gap-2" style={{ fontSize: ".54rem", color: "var(--ps-faint)" }}>
              <Link href="/" className="ps-link">
                Maison
              </Link>
              <span>/</span>
              <span style={{ color: "var(--ps-accent)" }}>{c.label}</span>
            </nav>
          </Reveal>

          <MaskLines
            className="ps-display ps-h1 mt-6"
            delay={100}
            lines={[c.label]}
          />

          <Reveal delay={300}>
            <p className="mt-5 max-w-[46ch] text-[.95rem] font-light" style={{ color: "var(--ps-muted)" }}>
              {c.tagline}
            </p>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-[1560px] px-5 pb-28 pt-8 sm:px-8">
        <CategoryGrid products={products} />
      </section>

      {/* other categories */}
      <section style={{ borderTop: "1px solid var(--ps-line)" }}>
        <div className="mx-auto max-w-[1560px] px-5 py-20 sm:px-8">
          <p className="ps-caps mb-9" style={{ color: "var(--ps-accent)" }}>
            Continue in the house
          </p>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {CATEGORIES.filter((x) => x.slug !== c.slug).map((x, i) => (
              <Reveal key={x.slug} delay={i * 80}>
                <Link href={`/c/${x.slug}`} className="group block">
                  <div className="ps-media ps-zoom aspect-[4/3]">
                    <img src={x.image} alt="" loading="lazy" decoding="async" />
                  </div>
                  <p className="ps-display mt-4 text-[1.25rem]">{x.label}</p>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
