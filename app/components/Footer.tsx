import Link from "next/link";
import { RisingWord } from "./Motif";

const COLS = [
  {
    title: "The Maison",
    links: [
      { label: "Our Story", href: "/world" },
      { label: "The Atelier", href: "/world" },
      { label: "The Olfactory Engine", href: "/atelier" },
      { label: "Sustainability", href: "/world" },
      { label: "Careers", href: "/world" },
    ],
  },
  {
    title: "Shop",
    links: [
      { label: "Fragrance", href: "/c/fragrance" },
      { label: "Beauty", href: "/c/beauty" },
      { label: "Eyewear", href: "/c/eyewear" },
      { label: "Women", href: "/c/women" },
      { label: "Men", href: "/c/men" },
      { label: "Gifts", href: "/c/gifts" },
    ],
  },
  {
    title: "Client Services",
    links: [
      { label: "Contact the Maison", href: "/world" },
      { label: "Shipping & Returns", href: "/world" },
      { label: "Engraving", href: "/world" },
      { label: "Refill Service", href: "/world" },
      { label: "Book an Appointment", href: "/world" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Terms of Sale", href: "/world" },
      { label: "Privacy Policy", href: "/world" },
      { label: "Cookie Preferences", href: "/world" },
      { label: "Accessibility", href: "/world" },
    ],
  },
];

export default function Footer() {
  return (
    <footer style={{ borderTop: "1px solid var(--ps-line)", background: "var(--ps-bg-alt)" }}>
      {/* newsletter */}
      <div className="mx-auto max-w-[1560px] px-5 py-20 sm:px-8 lg:py-28">
        <div className="grid gap-14 lg:grid-cols-[1fr_1fr] lg:gap-24">
          <div>
            <p className="ps-caps" style={{ color: "var(--ps-accent)" }}>
              Correspondence
            </p>
            <h2 className="ps-display mt-6 text-[2.4rem] leading-[1.02] sm:text-[3.2rem]">
              Private views,
              <br />
              <span className="ps-display-i">before anyone else.</span>
            </h2>
          </div>

          <div className="lg:pt-14">
            <p className="max-w-[46ch] text-[.9rem] font-light" style={{ color: "var(--ps-muted)" }}>
              New compositions, limited flacons and appointment-only evenings — sent
              rarely, and never to a list we did not build ourselves.
            </p>
            <form className="mt-8 flex items-end gap-4">
              <input
                type="email"
                required
                placeholder="Email address"
                aria-label="Email address"
                className="ps-field flex-1"
              />
              <button type="submit" className="ps-btn shrink-0 !px-8 !py-3">
                <span>Sign Up</span>
              </button>
            </form>
            <p className="mt-4 text-[.68rem]" style={{ color: "var(--ps-faint)" }}>
              By subscribing you agree to the Privacy Policy of the maison.
            </p>
          </div>
        </div>
      </div>

      <hr className="ps-rule" />

      {/* link columns */}
      <div className="mx-auto max-w-[1560px] px-5 py-16 sm:px-8">
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-4 lg:grid-cols-5">
          {COLS.map((c) => (
            <div key={c.title}>
              <p className="ps-caps mb-5" style={{ fontSize: ".56rem", color: "var(--ps-accent)" }}>
                {c.title}
              </p>
              <ul className="space-y-2.5">
                {c.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="ps-link text-[.82rem] font-light"
                      style={{ color: "var(--ps-muted)" }}
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="col-span-2 sm:col-span-4 lg:col-span-1">
            <p className="ps-caps mb-5" style={{ fontSize: ".56rem", color: "var(--ps-accent)" }}>
              Boutiques
            </p>
            <ul className="space-y-2.5 text-[.82rem] font-light" style={{ color: "var(--ps-muted)" }}>
              <li>Mumbai — Colaba</li>
              <li>New Delhi — Chanakyapuri</li>
              <li>Paris — Rue Saint-Honoré</li>
              <li>Milan — Via Montenapoleone</li>
              <li>New York — Madison Avenue</li>
            </ul>
          </div>
        </div>
      </div>

      <hr className="ps-rule" />

      {/* oversized wordmark */}
      <div className="overflow-hidden px-5 pt-14 sm:px-8">
        <p
          className="ps-wordmark w-full text-center leading-none"
          style={{
            fontSize: "clamp(2.2rem, 11.2vw, 11rem)",
            color: "transparent",
            WebkitTextStroke: "1px var(--ps-line-strong)",
            letterSpacing: "0.14em",
            textIndent: "0.14em",
          }}
        >
          <RisingWord text="Pankaj Soni" step={70} />
        </p>
      </div>

      <div className="mx-auto flex max-w-[1560px] flex-col items-center justify-between gap-4 px-5 py-10 sm:flex-row sm:px-8">
        <p className="ps-caps" style={{ fontSize: ".54rem", color: "var(--ps-faint)" }}>
          © {new Date().getFullYear()} Pankaj Soni — a fictional maison
        </p>
        <div className="flex gap-6">
          {["Instagram", "Pinterest", "YouTube", "WeChat"].map((s) => (
            <span
              key={s}
              className="ps-caps"
              style={{ fontSize: ".54rem", color: "var(--ps-faint)" }}
            >
              {s}
            </span>
          ))}
        </div>
        <p className="ps-caps" style={{ fontSize: ".54rem", color: "var(--ps-faint)" }}>
          Ships worldwide · INR / USD / EUR
        </p>
      </div>
    </footer>
  );
}
