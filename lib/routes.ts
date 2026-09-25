import { bySlug, category } from "./catalog";

/** What the transition plate says it is taking you to. */
const FIXED: Record<string, string> = {
  "/": "Maison — Est. 1998",
  "/classic": "Maison — Est. 1998",
  "/about": "About the House",
  "/contact": "Contact the Maison",
  "/world": "The World",
  "/atelier": "The Cloth Room",
  "/bag": "Your Bag",
  "/checkout": "Checkout",
};

export function routeLabel(pathname: string): string {
  const path = pathname.replace(/\/+$/, "") || "/";
  if (FIXED[path]) return FIXED[path];

  const [, kind, slug] = path.split("/");
  if (kind === "c" && slug) return category(slug)?.label ?? "The Collection";
  if (kind === "p" && slug) return bySlug(slug)?.name ?? "The Collection";

  return "Maison — Est. 1998";
}
