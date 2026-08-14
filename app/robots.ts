import type { MetadataRoute } from "next";

const SITE = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://pankajsoni.example").replace(
  /\/$/,
  ""
);

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/bag", "/checkout"] }],
    sitemap: `${SITE}/sitemap.xml`,
  };
}
