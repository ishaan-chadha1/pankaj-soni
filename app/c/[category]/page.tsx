import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CATEGORIES, byCategory, category, type Category } from "@/lib/catalog";
import { Reveal } from "../../components/Reveal";
import { JsonLd, breadcrumbLd, itemListLd } from "@/lib/seo";
import { Curtain } from "../../components/Motif";
import CategoryGrid from "./CategoryGrid";
import CategoryHero from "./CategoryHero";
import { stagger } from "@/lib/motion";

/* Every room opens on a film of its own. */
const FILM: Record<Category, string> = {
  women: "film-women",
  men: "film-men",
  occasion: "film-occasion",
};

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ category: c.slug }));
}

export async function generateMetadata(
  props: PageProps<"/c/[category]">
): Promise<Metadata> {
  const { category: slug } = await props.params;
  const c = category(slug);
  if (!c) return { title: "Not found" };
  return {
    title: c.label,
    description: c.tagline,
    alternates: { canonical: `/c/${c.slug}` },
    openGraph: {
      title: `${c.label} | PANKAJ SONI`,
      description: c.tagline,
      url: `/c/${c.slug}`,
      images: [{ url: c.image, alt: c.label }],
    },
  };
}

export default async function CategoryPage(props: PageProps<"/c/[category]">) {
  const { category: slug } = await props.params;
  const c = category(slug);
  if (!c) notFound();

  const products = byCategory(c.slug as Category);

  return (
    <>
      <JsonLd
        data={[
          itemListLd(products, `/c/${c.slug}`),
          breadcrumbLd([
            { name: "Maison", path: "/" },
            { name: c.label, path: `/c/${c.slug}` },
          ]),
        ]}
      />

      <CategoryHero
        label={c.label}
        tagline={c.tagline}
        film={FILM[c.slug as Category]}
        count={products.length}
        fill={c.slug === "men"}
      />

      <section className="mx-auto max-w-[1560px] px-5 pb-28 pt-8 sm:px-8">
        <CategoryGrid products={products} />
      </section>

      {/* other categories */}
      <section style={{ borderTop: "1px solid var(--ps-line)" }}>
        <div className="mx-auto max-w-[1560px] px-5 py-20 sm:px-8">
          <p className="ps-caps mb-9" style={{ color: "var(--ps-accent)" }}>
            Continue in the house
          </p>
          <div className="grid gap-5 sm:grid-cols-2">
            {CATEGORIES.filter((x) => x.slug !== c.slug).map((x, i) => (
              <Reveal key={x.slug} delay={stagger(i)}>
                <Link href={`/c/${x.slug}`} className="group block">
                  <Curtain className="ps-media ps-zoom ps-tint aspect-[4/3]" delay={stagger(i)}>
                    <img src={x.image} alt="" loading="lazy" decoding="async" />
                  </Curtain>
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
