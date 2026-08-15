import type { Product } from "./catalog";

/** Absolute origin. Set NEXT_PUBLIC_SITE_URL at build time for the real domain. */
export const SITE = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://pankajsoni.example"
).replace(/\/$/, "");

export const abs = (path: string) => `${SITE}${path.startsWith("/") ? path : `/${path}`}`;

/**
 * JSON-LD builders.
 *
 * These are what turn a listing into a rich result — price, availability and
 * breadcrumb trail in the SERP rather than a plain blue link. Emitted as a
 * <script type="application/ld+json"> in the page body.
 *
 * `priceValidUntil` is required by Google for offers or the product is dropped
 * from rich results; a year out is the usual convention for non-sale pricing.
 */

const priceValidUntil = () => {
  const d = new Date();
  d.setFullYear(d.getFullYear() + 1);
  return d.toISOString().slice(0, 10);
};

export function organizationLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "PANKAJ SONI",
    url: SITE,
    logo: abs("/img/og.png"),
    description:
      "A maison of Private Atelier fragrance, colour, eyewear and evening tailoring.",
  };
}

export function websiteLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "PANKAJ SONI",
    url: SITE,
  };
}

export function productLd(p: Product) {
  const prices = p.variants.map((v) => v.price);
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    description: p.story,
    image: [abs(p.image)],
    sku: p.slug,
    brand: { "@type": "Brand", name: "PANKAJ SONI" },
    category: p.category,
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "USD",
      lowPrice: Math.min(...prices),
      highPrice: Math.max(...prices),
      offerCount: p.variants.length,
      availability: "https://schema.org/InStock",
      priceValidUntil: priceValidUntil(),
      url: abs(`/p/${p.slug}`),
      seller: { "@type": "Organization", name: "PANKAJ SONI" },
    },
  };
}

export function breadcrumbLd(trail: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((t, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: t.name,
      item: abs(t.path),
    })),
  };
}

export function itemListLd(products: Product[], path: string) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    url: abs(path),
    numberOfItems: products.length,
    itemListElement: products.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: abs(`/p/${p.slug}`),
      name: p.name,
    })),
  };
}

/** Renders one or more JSON-LD blocks. */
export function JsonLd({ data }: { data: object | object[] }) {
  const blocks = Array.isArray(data) ? data : [data];
  return (
    <>
      {blocks.map((d, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(d) }}
        />
      ))}
    </>
  );
}
