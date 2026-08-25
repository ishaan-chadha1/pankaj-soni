/**
 * The site's absolute origin — one declaration, imported everywhere.
 *
 * Canonical tags, OG image URLs, the sitemap and robots.txt all need this, and
 * it used to be redeclared in each of those four files. Four copies of a
 * default is four chances for a deploy to go out with three of them right.
 *
 * The default is the live Vercel origin, so a plain `npm run build` emits
 * correct absolute URLs with no environment set up at all. Override with
 * NEXT_PUBLIC_SITE_URL when the site moves to its own domain — it is read at
 * BUILD time, not runtime, so it has to be present when the bundle is made.
 */
export const SITE = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://pankaj-soni-beige.vercel.app"
).replace(/\/$/, "");

/** Absolute URL for a site-root-relative path. */
export const abs = (path: string) => `${SITE}${path.startsWith("/") ? path : `/${path}`}`;
