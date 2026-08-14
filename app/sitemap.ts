import type { MetadataRoute } from "next";
import { CATEGORIES, PRODUCTS } from "@/lib/catalog";

const SITE = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://pankajsoni.example").replace(
  /\/$/,
  ""
);

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    { url: `${SITE}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE}/world`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE}/atelier`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    ...CATEGORIES.map((c) => ({
      url: `${SITE}/c/${c.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    })),
    ...PRODUCTS.map((p) => ({
      url: `${SITE}/p/${p.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
