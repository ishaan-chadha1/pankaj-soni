"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { PRODUCTS, money } from "@/lib/catalog";
import { useCart } from "../CartProvider";
import ThemeSwitcher from "./ThemeSwitcher";

type MenuCol = { title: string; links: { label: string; href: string }[] };
type MenuDef = {
  label: string;
  href: string;
  cols: MenuCol[];
  feature?: { image: string; eyebrow: string; title: string; href: string };
};

const MENU: MenuDef[] = [
  {
    label: "Fragrance",
    href: "/c/fragrance",
    cols: [
      {
        title: "Private Atelier",
        links: [
          { label: "Noir Impérial", href: "/p/noir-imperial" },
          { label: "Oud Silence", href: "/p/oud-silence" },
          { label: "Velvet Saffron", href: "/p/velvet-saffron" },
          { label: "Rose Privé", href: "/p/rose-prive" },
          { label: "White Oud", href: "/p/white-oud" },
        ],
      },
      {
        title: "By Family",
        links: [
          { label: "Leather & Incense", href: "/c/fragrance" },
          { label: "Oud & Resins", href: "/c/fragrance" },
          { label: "Amber & Spice", href: "/c/fragrance" },
          { label: "Wood & Moss", href: "/c/fragrance" },
        ],
      },
      {
        title: "The Maison",
        links: [
          { label: "Discovery Coffret", href: "/p/private-atelier-coffret" },
          { label: "Candles", href: "/p/noir-candle" },
          { label: "Refill Service", href: "/world" },
          { label: "The Olfactory Engine", href: "/atelier" },
        ],
      },
    ],
    feature: {
      image: "/img/p-ed-01.svg",
      eyebrow: "New Composition",
      title: "Velvet Saffron",
      href: "/p/velvet-saffron",
    },
  },
  {
    label: "Beauty",
    href: "/c/beauty",
    cols: [
      {
        title: "Lip",
        links: [
          { label: "Rouge Couture", href: "/p/rouge-couture-noir" },
          { label: "All Lip", href: "/c/beauty" },
        ],
      },
      {
        title: "Eye & Cheek",
        links: [
          { label: "Noir Kohl", href: "/p/noir-kohl" },
          { label: "Velours Cheek", href: "/p/velours-cheek" },
        ],
      },
      {
        title: "Skin",
        links: [
          { label: "Peau Serum", href: "/p/peau-serum" },
          { label: "All Skin", href: "/c/beauty" },
        ],
      },
    ],
    feature: {
      image: "/img/p-ed-03.svg",
      eyebrow: "Colour Study",
      title: "Against the Neutral",
      href: "/world",
    },
  },
  {
    label: "Eyewear",
    href: "/c/eyewear",
    cols: [
      {
        title: "Silhouettes",
        links: [
          { label: "Monolith", href: "/p/monolith" },
          { label: "Meridian", href: "/p/meridian-aviator" },
          { label: "Oracle", href: "/p/oracle" },
          { label: "Vesper", href: "/p/vesper-cat" },
        ],
      },
      {
        title: "Shop",
        links: [
          { label: "All Eyewear", href: "/c/eyewear" },
          { label: "Optical", href: "/c/eyewear" },
        ],
      },
    ],
    feature: {
      image: "/img/p-cat-eyewear.svg",
      eyebrow: "Eyewear",
      title: "Architecture for the face",
      href: "/c/eyewear",
    },
  },
  {
    label: "Women",
    href: "/c/women",
    cols: [
      {
        title: "Ready-to-Wear",
        links: [
          { label: "Atelier Tuxedo Dress", href: "/p/atelier-tuxedo-dress" },
          { label: "Liquid Column Gown", href: "/p/liquid-column-gown" },
        ],
      },
      {
        title: "Leather Goods",
        links: [{ label: "Opera Clutch", href: "/p/opera-clutch" }],
      },
    ],
    feature: {
      image: "/img/p-cat-women.svg",
      eyebrow: "Ready-to-Wear",
      title: "An unbroken line",
      href: "/c/women",
    },
  },
  {
    label: "Men",
    href: "/c/men",
    cols: [
      {
        title: "Tailoring",
        links: [
          { label: "Shawl Collar Dinner Jacket", href: "/p/shawl-collar-dinner-jacket" },
          { label: "Pleated Evening Shirt", href: "/p/evening-shirt" },
        ],
      },
      {
        title: "Footwear",
        links: [{ label: "Noir Chelsea Boot", href: "/p/noir-chelsea-boot" }],
      },
    ],
    feature: {
      image: "/img/p-cat-men.svg",
      eyebrow: "Tailoring",
      title: "The Shoulder",
      href: "/world",
    },
  },
  {
    label: "Gifts",
    href: "/c/gifts",
    cols: [
      {
        title: "Gifting",
        links: [
          { label: "Private Atelier Coffret", href: "/p/private-atelier-coffret" },
          { label: "Noir Impérial Candle", href: "/p/noir-candle" },
        ],
      },
    ],
  },
];

const Ico = {
  search: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
      <circle cx="10.5" cy="10.5" r="7" />
      <path d="M16 16l5 5" strokeLinecap="round" />
    </svg>
  ),
  bag: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
      <path d="M4 7h16l-1.2 14H5.2L4 7z" />
      <path d="M8.5 7V5.5a3.5 3.5 0 017 0V7" />
    </svg>
  ),
  user: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7" />
    </svg>
  ),
  close: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
      <path d="M5 5l14 14M19 5L5 19" strokeLinecap="round" />
    </svg>
  ),
};

export default function Header() {
  const pathname = usePathname();
  const { count, setOpen: setBag, ready } = useCart();

  const [solid, setSolid] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobile, setMobile] = useState(false);
  const [search, setSearch] = useState(false);
  const [q, setQ] = useState("");
  const hoverTimer = useRef<number | null>(null);

  // The home and atelier heroes are full-bleed, so the bar floats transparent
  // over them and goes solid everywhere else (and once you scroll).
  const overHero = pathname === "/" || pathname === "/atelier";

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Dismiss every panel on navigation. Adjusting during render rather than in
  // an effect avoids a frame where the new page shows with the old menu open.
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpenMenu(null);
    setMobile(false);
    setSearch(false);
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpenMenu(null);
      setMobile(false);
      setSearch(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Small delay on close so diagonal travel into the panel doesn't dismiss it.
  const enter = (label: string) => {
    if (hoverTimer.current) window.clearTimeout(hoverTimer.current);
    setOpenMenu(label);
  };
  const leave = () => {
    if (hoverTimer.current) window.clearTimeout(hoverTimer.current);
    hoverTimer.current = window.setTimeout(() => setOpenMenu(null), 160);
  };

  const opaque = solid || !overHero || !!openMenu;

  const results = q.trim()
    ? PRODUCTS.filter((p) =>
        `${p.name} ${p.line} ${p.kicker} ${p.category}`.toLowerCase().includes(q.trim().toLowerCase())
      ).slice(0, 6)
    : [];

  return (
    <>
      {/* announcement */}
      <div
        className="ps-caps relative z-[60] flex items-center justify-center overflow-hidden py-2.5 text-center"
        style={{
          background: "var(--ps-invert-bg)",
          color: "var(--ps-invert-text)",
          fontSize: ".56rem",
        }}
      >
        <span>Complimentary shipping and returns — engraving on all flacons</span>
      </div>

      <header
        className="sticky top-0 z-50 transition-all ps-t-slow"
        style={{
          background: opaque ? "color-mix(in srgb, var(--ps-bg) 88%, transparent)" : "transparent",
          backdropFilter: opaque ? "blur(16px) saturate(140%)" : "none",
          borderBottom: `1px solid ${opaque ? "var(--ps-line)" : "transparent"}`,
          transitionTimingFunction: "cubic-bezier(.16,1,.3,1)",
        }}
        onMouseLeave={leave}
      >
        <div className="mx-auto grid max-w-[1560px] grid-cols-[1fr_auto_1fr] items-center gap-4 px-5 py-4 sm:px-8 lg:py-5">
          {/* left */}
          <nav className="hidden items-center gap-7 lg:flex">
            {MENU.map((m) => (
              <Link
                key={m.label}
                href={m.href}
                onMouseEnter={() => enter(m.label)}
                onFocus={() => enter(m.label)}
                className="ps-caps ps-link"
                style={{
                  color: openMenu === m.label ? "var(--ps-accent)" : "var(--ps-text)",
                  transition: "color .5s var(--ease)",
                }}
              >
                {m.label}
              </Link>
            ))}
          </nav>

          <button
            type="button"
            aria-label="Open menu"
            onClick={() => setMobile(true)}
            className="ps-tap flex flex-col gap-[5px] lg:hidden"
          >
            <span className="block h-px w-6" style={{ background: "currentColor" }} />
            <span className="block h-px w-6" style={{ background: "currentColor" }} />
          </button>

          {/* wordmark */}
          <Link href="/" aria-label="Pankaj Soni — home" className="justify-self-center">
            <span className="ps-wordmark block text-[.82rem] sm:text-[1.02rem] lg:text-[1.18rem]">
              Pankaj Soni
            </span>
          </Link>

          {/* right */}
          <div className="flex items-center justify-end gap-5 sm:gap-6">
            <div className="hidden lg:block">
              <ThemeSwitcher />
            </div>
            <button
              type="button"
              aria-label="Search"
              onClick={() => setSearch(true)}
              className="ps-tap opacity-80 transition-opacity ps-t-base hover:opacity-100"
            >
              {Ico.search}
            </button>
            <Link
              href="/world"
              aria-label="Account"
              className="ps-tap hidden opacity-80 transition-opacity ps-t-base hover:opacity-100 sm:block"
            >
              {Ico.user}
            </Link>
            <button
              type="button"
              aria-label={`Bag, ${count} items`}
              onClick={() => setBag(true)}
              className="ps-tap relative opacity-80 transition-opacity ps-t-base hover:opacity-100"
            >
              {Ico.bag}
              {ready && count > 0 ? (
                <span
                  className="absolute -right-2 -top-1.5 flex h-[15px] min-w-[15px] items-center justify-center rounded-full px-1 text-[9px] font-normal"
                  style={{ background: "var(--ps-accent)", color: "var(--ps-bg)" }}
                >
                  {count}
                </span>
              ) : null}
            </button>
          </div>
        </div>

        {/* mega menu */}
        <div
          className="absolute inset-x-0 top-full hidden overflow-hidden lg:block"
          style={{
            maxHeight: openMenu ? 520 : 0,
            transition: "max-height .8s cubic-bezier(.16,1,.3,1)",
          }}
          onMouseEnter={() => openMenu && enter(openMenu)}
        >
          {MENU.filter((m) => m.label === openMenu).map((m) => (
            <div
              key={m.label}
              style={{
                background: "var(--ps-surface)",
                backdropFilter: "blur(20px)",
                borderBottom: "1px solid var(--ps-line)",
              }}
            >
              <div className="mx-auto flex max-w-[1560px] gap-16 px-8 py-14">
                {m.cols.map((c) => (
                  <div key={c.title} className="min-w-[190px]">
                    <p className="ps-caps mb-5" style={{ color: "var(--ps-accent)", fontSize: ".56rem" }}>
                      {c.title}
                    </p>
                    <ul className="space-y-3">
                      {c.links.map((l) => (
                        <li key={l.label + l.href}>
                          <Link
                            href={l.href}
                            className="ps-link text-[.86rem] font-light"
                            style={{ color: "var(--ps-muted)" }}
                          >
                            {l.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}

                {m.feature ? (
                  <Link href={m.feature.href} className="group ml-auto block w-[300px]">
                    <div className="ps-media ps-zoom aspect-[4/3]">
                      <img src={m.feature.image} alt="" loading="lazy" decoding="async" />
                    </div>
                    <p className="ps-caps mt-4" style={{ color: "var(--ps-accent)", fontSize: ".56rem" }}>
                      {m.feature.eyebrow}
                    </p>
                    <p className="ps-display mt-1.5 text-[1.2rem]">{m.feature.title}</p>
                  </Link>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </header>

      {/* search overlay */}
      <div
        className="fixed inset-0 z-[70] transition-opacity ps-t-slow"
        style={{
          background: "var(--ps-surface)",
          backdropFilter: "blur(18px)",
          opacity: search ? 1 : 0,
          pointerEvents: search ? "auto" : "none",
        }}
      >
        <div className="mx-auto max-w-[880px] px-6 pt-[16vh]">
          <div className="flex items-center justify-between">
            <p className="ps-caps" style={{ color: "var(--ps-accent)" }}>
              Search the maison
            </p>
            <button type="button" aria-label="Close search" onClick={() => setSearch(false)}>
              {Ico.close}
            </button>
          </div>
          <input
            className="ps-field ps-display mt-8 text-[2rem] sm:text-[2.8rem]"
            placeholder="Fragrance, tailoring, eyewear…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            autoComplete="off"
          />
          <div className="mt-10 space-y-1">
            {results.map((p) => (
              <Link
                key={p.slug}
                href={`/p/${p.slug}`}
                onClick={() => setSearch(false)}
                className="group flex items-center gap-5 py-3 transition-colors ps-t-base"
                style={{ borderBottom: "1px solid var(--ps-line)" }}
              >
                <span className="ps-media h-16 w-14 shrink-0">
                  <img src={p.image} alt="" loading="lazy" decoding="async" />
                </span>
                <span className="flex-1">
                  <span className="ps-display block text-[1.1rem]">{p.name}</span>
                  <span className="text-[.72rem]" style={{ color: "var(--ps-muted)" }}>
                    {p.kicker}
                  </span>
                </span>
                <span className="text-[.8rem]">{money(p.price)}</span>
              </Link>
            ))}
            {q.trim() && results.length === 0 ? (
              <p className="text-[.86rem]" style={{ color: "var(--ps-muted)" }}>
                Nothing in the archive matches “{q}”.
              </p>
            ) : null}
          </div>
        </div>
      </div>

      {/* mobile nav */}
      <div
        className="fixed inset-0 z-[70] lg:hidden"
        style={{
          background: "var(--ps-bg)",
          backdropFilter: "blur(18px)",
          transform: mobile ? "translateX(0)" : "translateX(-100%)",
          transition: "transform .8s cubic-bezier(.16,1,.3,1)",
        }}
      >
        <div className="flex items-center justify-between px-5 py-5">
          <span className="ps-wordmark text-[.82rem]">Pankaj Soni</span>
          <button type="button" aria-label="Close menu" onClick={() => setMobile(false)}>
            {Ico.close}
          </button>
        </div>
        <nav className="mt-6 px-5">
          {MENU.map((m, i) => (
            <Link
              key={m.label}
              href={m.href}
              className="ps-display block py-4 text-[2rem]"
              style={{ borderBottom: "1px solid var(--ps-line)", transitionDelay: `${i * 40}ms` }}
            >
              {m.label}
            </Link>
          ))}
          <Link href="/atelier" className="ps-display block py-4 text-[2rem]" style={{ color: "var(--ps-accent)" }}>
            The Olfactory Engine
          </Link>
          <Link href="/world" className="ps-caps mt-6 block py-2" style={{ color: "var(--ps-muted)" }}>
            The Maison
          </Link>

          <div className="mt-10 pt-8" style={{ borderTop: "1px solid var(--ps-line)" }}>
            <ThemeSwitcher compact />
          </div>
        </nav>
      </div>
    </>
  );
}
