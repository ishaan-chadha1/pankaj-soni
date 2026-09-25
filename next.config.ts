import type { NextConfig } from "next";

/**
 * `npm run build`        → a normal Next build (deploy to Vercel, a Node host, Docker…)
 * `npm run build:static` → emits a fully static `out/` with no server at all,
 *                          which drops onto Netlify, GitHub Pages, S3, Cloudflare,
 *                          or any static host.
 *
 * The whole site is prerenderable — the catalogue is a TypeScript module and the
 * bag lives in localStorage — so nothing is lost in the static path. `images.unoptimized`
 * is required there because the optimiser needs a server; every image on the site
 * is a hand-generated SVG served through a plain <img>, so it costs nothing.
 */
const isStatic = process.env.STATIC_EXPORT === "1";

const nextConfig: NextConfig = {
  ...(isStatic ? { output: "export" as const, images: { unoptimized: true } } : {}),
  trailingSlash: isStatic,
  /*
   * No `experimental.viewTransition`. It used to morph a product plate from the
   * grid into the product page, but the PageTransition curtain now covers every
   * navigation, so the morph played unseen underneath it — and the browser's
   * snapshots of the page, taken while the curtain and the new page were both
   * moving, could stick on a phone: the old page drawn over the new one, or a
   * snapshot of the page before it had painted.
   */
};

export default nextConfig;
