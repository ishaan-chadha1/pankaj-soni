"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { CATEGORIES, PRODUCTS, money } from "@/lib/catalog";
import { useCart } from "../CartProvider";
import ThemeSwitcher from "./ThemeSwitcher";

type MenuCol = { title: string; links: { label: string; href: string }[] };
type MenuDef = {
  label: string;
  href: string;
  cols: MenuCol[];
  /** The two frames the Shop panel shows while this category is hovered. */
  plates: [string, string];
};

const MENU: MenuDef[] = [
  {
    label: "Women",
    href: "/c/women",
    cols: [
      {
        title: "Ready-to-Wear",
        links: [
          { label: "Atelier Tuxedo Dress", href: "/p/atelier-tuxedo-dress" },
          { label: "Liquid Column Gown", href: "/p/liquid-column-gown" },
          { label: "Bias Slip Skirt", href: "/p/silk-slip-skirt" },
          { label: "The Poplin Shirt", href: "/p/poplin-shirt" },
        ],
      },
      {
        title: "Tailoring & Knitwear",
        links: [
          { label: "Wide-Leg Trouser", href: "/p/wide-leg-trouser" },
          { label: "Wrap Cardigan", href: "/p/cashmere-wrap-cardigan" },
          { label: "Fine Roll Neck", href: "/p/merino-roll-neck" },
          { label: "All Women", href: "/c/women" },
        ],
      },
    ],
    plates: ["/img/campaign/nocturne-gown-02-810.webp", "/img/campaign/vapour-gown-01-810.webp"],
  },
  {
    label: "Men",
    href: "/c/men",
    cols: [
      {
        title: "Tailoring",
        links: [
          { label: "Shawl Collar Dinner Jacket", href: "/p/shawl-collar-dinner-jacket" },
          { label: "Single-Breasted Suit", href: "/p/single-breasted-suit" },
          { label: "Pleated Trouser", href: "/p/pleated-trouser" },
          { label: "Double-Face Overcoat", href: "/p/double-face-overcoat" },
        ],
      },
      {
        title: "Shirting & Knitwear",
        links: [
          { label: "Pleated Evening Shirt", href: "/p/evening-shirt" },
          { label: "Oxford Shirt", href: "/p/oxford-shirt" },
          { label: "Cashmere Crewneck", href: "/p/cashmere-crewneck" },
          { label: "Noir Chelsea Boot", href: "/p/noir-chelsea-boot" },
        ],
      },
    ],
    plates: ["/img/campaign/silver-seam-01-810.webp", "/img/campaign/noir-vine-02-810.webp"],
  },
  {
    label: "Occasion",
    href: "/c/occasion",
    cols: [
      {
        title: "The Collection",
        links: [
          { label: "Noir Vine Bandhgala", href: "/p/noir-vine-bandhgala" },
          { label: "Orbit Bandhgala", href: "/p/orbit-bandhgala" },
          { label: "Tidemark Sherwani", href: "/p/tidemark-sherwani" },
        ],
      },
      {
        title: "Shop",
        links: [
          { label: "All Occasion", href: "/c/occasion" },
          { label: "Double-Face Overcoat", href: "/p/double-face-overcoat" },
          { label: "The Cloth Room", href: "/atelier" },
        ],
      },
    ],
    plates: ["/img/campaign/tidemark-detail-810.webp", "/img/campaign/orbit-02-810.webp"],
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
  const [shopOpen, setShopOpen] = useState(false);
  /** Which category the Shop panel is showing. Survives close, so it reopens where you left it. */
  const [active, setActive] = useState(MENU[0].label);
  const [mobile, setMobile] = useState(false);
  const [search, setSearch] = useState(false);
  const [q, setQ] = useState("");
  const hoverTimer = useRef<number | null>(null);
  const bar = useRef<HTMLDivElement | null>(null);
  const shell = useRef<HTMLElement | null>(null);
  const mobilePanel = useRef<HTMLDivElement | null>(null);
  const searchPanel = useRef<HTMLDivElement | null>(null);
  const returnFocus = useRef<HTMLElement | null>(null);

  // The home and atelier heroes are full-bleed, so the bar floats transparent
  // over them and goes solid everywhere else (and once you scroll).
  const overHero = pathname === "/" || pathname === "/atelier";
  /*
   * The home page opens on its own name at the size of the window, so the bar
   * gets out of the way: it floats over the page instead of sitting above it,
   * and slides away while the hero's frame is still opening (see `.ps-header`
   * in globals.css). The
   * announcement is dropped there for the same reason — two names and a
   * banner above the fold is what made the first cut read as busy.
   */
  const home = pathname === "/";

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /*
   * Publish the chrome's height so a full-height hero can subtract it.
   *
   * The announcement bar and the header sit ABOVE the hero in flow — the bar
   * is static and the header is sticky, which only overlays once you have
   * scrolled. So a hero at 90svh is 90svh PLUS whatever the chrome is, and it
   * overran the fold by 37px on a 768px viewport: the scroll cue sat below the
   * bottom of the window and the section it was inviting you to was two
   * hundred pixels further down again.
   *
   * It cannot be a constant. The announcement wraps to two lines under about
   * 560px and the header's own padding steps at `lg`, so the total runs from
   * roughly 100 to 130px. Measuring is four lines and is always right.
   */
  useEffect(() => {
    const write = () => {
      const head = shell.current?.offsetHeight ?? 0;
      const h = (bar.current?.offsetHeight ?? 0) + head;
      if (h) document.documentElement.style.setProperty("--ps-chrome", `${h}px`);
      /* The header ALONE, which is what anything sticking below it needs: the
         announcement scrolls away, so a bar offset by the full chrome floats
         thirty pixels clear of the header with page showing through the gap. */
      if (head) document.documentElement.style.setProperty("--ps-header", `${head}px`);
    };
    write();
    const ro = new ResizeObserver(write);
    if (bar.current) ro.observe(bar.current);
    if (shell.current) ro.observe(shell.current);
    return () => ro.disconnect();
  }, []);

  // Dismiss every panel on navigation. Adjusting during render rather than in
  // an effect avoids a frame where the new page shows with the old menu open.
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setShopOpen(false);
    setMobile(false);
    setSearch(false);
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setShopOpen(false);
      setMobile(false);
      setSearch(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  /*
   * A full-screen panel takes the page with it.
   *
   * Both panels are always in the DOM — one translated off-screen, one at
   * opacity 0 — which is what makes them animate. Left alone that also meant
   * fifteen menu links and the search field stayed in the tab order and the
   * accessibility tree while invisible, and with the menu open the page behind
   * it still scrolled. `inert` on the closed panel takes it out of both trees;
   * the lock, the focus move and the wrap below make the open one behave like
   * the modal it looks like.
   */
  const panel = mobile ? mobilePanel : search ? searchPanel : null;
  const panelOpen = mobile || search;

  useEffect(() => {
    if (!panelOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [panelOpen]);

  useEffect(() => {
    const el = mobile ? mobilePanel.current : search ? searchPanel.current : null;
    if (el) {
      returnFocus.current = document.activeElement as HTMLElement;
      // The search field is the point of the search panel; the menu opens on
      // its close button, which is the first thing in it either way.
      (el.querySelector<HTMLElement>("input") ?? el.querySelector<HTMLElement>("button, a"))?.focus();
    } else if (returnFocus.current) {
      returnFocus.current.focus?.();
      returnFocus.current = null;
    }
  }, [mobile, search]);

  useEffect(() => {
    const el = panel?.current;
    if (!el) return;
    const onTab = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const focusable = [...el.querySelectorAll<HTMLElement>("a[href], button:not([disabled]), input, select")]
        .filter((n) => n.offsetParent !== null || n === document.activeElement);
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      // Without this, Tab walks out of an open panel into the page underneath
      // it and focuses things nobody can see.
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onTab);
    return () => document.removeEventListener("keydown", onTab);
  }, [panel]);

  // Small delay on close so diagonal travel into the panel doesn't dismiss it.
  const openedAt = useRef(0);
  const enter = () => {
    if (hoverTimer.current) window.clearTimeout(hoverTimer.current);
    if (!shopOpen) openedAt.current = performance.now();
    setShopOpen(true);
  };
  /* A pointer reaches Shop before it clicks it, so hover has already opened the
     panel by then — a plain toggle would shut it again on the click that was
     meant to open it. A click that lands just after the hover opened it keeps
     it open; any other click (keyboard, touch, a second click) toggles. */
  const clickShop = () => {
    if (performance.now() - openedAt.current < 600) return;
    setShopOpen((o) => !o);
  };
  const leave = () => {
    if (hoverTimer.current) window.clearTimeout(hoverTimer.current);
    hoverTimer.current = window.setTimeout(() => setShopOpen(false), 160);
  };

  const opaque = solid || !overHero || shopOpen;
  const shown = MENU.find((m) => m.label === active) ?? MENU[0];
  const tagline = CATEGORIES.find((c) => `/c/${c.slug}` === shown.href)?.tagline;
  const picks = shown.cols.flatMap((c) => c.links).filter((l) => !l.href.startsWith("/c/")).slice(0, 4);

  const results = q.trim()
    ? PRODUCTS.filter((p) =>
        `${p.name} ${p.line} ${p.kicker} ${p.category}`.toLowerCase().includes(q.trim().toLowerCase())
      ).slice(0, 6)
    : [];

  return (
    <>
      {/* announcement */}
      <div
        ref={bar}
        className="ps-caps relative z-[60] flex items-center justify-center overflow-hidden py-2.5 text-center"
        style={{
          background: "var(--ps-invert-bg)",
          color: "var(--ps-invert-text)",
          fontSize: ".56rem",
          // Hidden rather than unmounted, so the chrome measurement below keeps
          // observing it and picks it back up on the next page.
          display: home ? "none" : undefined,
        }}
      >
        <span>Complimentary shipping and returns — alterations for the life of the piece</span>
      </div>

      {/* Dims the page under an open Shop panel. Never takes the pointer, so
          leaving the header still closes it. */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-40 hidden lg:block"
        style={{
          background: "rgba(10,10,10,.38)",
          opacity: shopOpen ? 1 : 0,
          transition: "opacity .6s cubic-bezier(.16,1,.3,1)",
        }}
      />

      <header
        ref={shell}
        className={`ps-header ${home ? "fixed inset-x-0 top-0" : "sticky top-0"} z-50 transition-all ps-t-slow`}
        style={{
          background: opaque ? "color-mix(in srgb, var(--ps-bg) 88%, transparent)" : "transparent",
          backdropFilter: opaque ? "blur(16px) saturate(140%)" : "none",
          borderBottom: `1px solid ${opaque ? "var(--ps-line)" : "transparent"}`,
          transitionTimingFunction: "cubic-bezier(.16,1,.3,1)",
        }}
        onMouseLeave={leave}
      >
        {/*
         * ONE ROW, EVEN RHYTHM. Every item sits in an equal column, three either
         * side of the wordmark, so the bar reads as a ruled line rather than a
         * cluster of links. The six categories live behind Shop instead of
         * crowding the row.
         */}
        <div className="mx-auto grid max-w-[1560px] grid-cols-[1fr_auto_1fr] items-center gap-6 px-5 py-4 sm:px-8 lg:py-[1.45rem]">
          {/* left */}
          <nav aria-label="Primary" className="ps-nav hidden grid-cols-3 items-center lg:grid">
            <button
              type="button"
              aria-expanded={shopOpen}
              aria-controls="ps-shop-panel"
              onMouseEnter={enter}
              onFocus={enter}
              onClick={clickShop}
              className="ps-nav-item flex items-center gap-2 justify-self-start"
              style={{ color: shopOpen ? "var(--ps-accent)" : undefined }}
            >
              Shop
              <svg
                width="8"
                height="8"
                viewBox="0 0 10 10"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.2"
                aria-hidden
                style={{ transform: shopOpen ? "rotate(180deg)" : "none", transition: "transform .5s var(--ease)" }}
              >
                <path d="M1.5 3.5L5 7l3.5-3.5" />
              </svg>
            </button>
            <Link href="/world" className="ps-nav-item ps-link justify-self-start" aria-current={pathname === "/world" ? "page" : undefined}>
              The Maison
            </Link>
            <Link href="/about" className="ps-nav-item ps-link justify-self-start" aria-current={pathname === "/about" ? "page" : undefined}>
              About
            </Link>
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
          <div className="ps-nav flex items-center justify-end lg:grid lg:grid-cols-3">
            {/* Wrapped: `.ps-link` sets display, which would beat a `hidden` on the link itself. */}
            <div className="hidden items-center justify-self-start lg:flex">
              <Link href="/atelier" className="ps-nav-item ps-link" aria-current={pathname === "/atelier" ? "page" : undefined}>
                {/* The article goes below xl, where the column is too narrow to hold it. */}
                <span className="hidden xl:inline">The </span>Cloth Room
              </Link>
            </div>
            <div className="hidden items-center justify-self-start lg:flex">
              <Link href="/contact" className="ps-nav-item ps-link" aria-current={pathname === "/contact" ? "page" : undefined}>
                Contact
              </Link>
            </div>

            <div className="flex items-center justify-end gap-5 lg:justify-self-end lg:gap-6">
              <button
                type="button"
                aria-label="Search"
                onClick={() => setSearch(true)}
                className="ps-tap ps-nav-item flex items-center gap-2 opacity-80 transition-opacity ps-t-base hover:opacity-100"
              >
                <span className="hidden xl:inline">Search</span>
                {Ico.search}
              </button>
              <div className="hidden lg:block">
                <ThemeSwitcher />
              </div>
              <Link
                href="/world"
                aria-label="Account"
                className="ps-tap hidden opacity-80 transition-opacity ps-t-base hover:opacity-100 sm:block lg:hidden xl:block"
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
        </div>

        {/*
         * THE SHOP PANEL. A plain list of the rooms on the left; whichever one
         * the pointer is on fills the middle with its line and a few pieces, and
         * the right with two frames. Nothing to read until you point at it.
         */}
        <div
          id="ps-shop-panel"
          inert={!shopOpen}
          className="absolute inset-x-0 top-full hidden overflow-hidden lg:block"
          style={{
            maxHeight: shopOpen ? 560 : 0,
            transition: "max-height .8s cubic-bezier(.16,1,.3,1)",
          }}
          onMouseEnter={enter}
        >
          <div style={{ background: "var(--ps-surface)", borderBottom: "1px solid var(--ps-line)" }}>
            <div className="mx-auto grid max-w-[1560px] grid-cols-[minmax(170px,1fr)_minmax(240px,1.2fr)_2.2fr] gap-12 px-8 py-12">
              <ul className="space-y-[1.05rem]">
                {MENU.map((m) => {
                  const on = m.label === active;
                  return (
                    <li key={m.label}>
                      <Link
                        href={m.href}
                        onMouseEnter={() => setActive(m.label)}
                        onFocus={() => setActive(m.label)}
                        className="ps-nav-item flex items-center gap-3"
                        style={{ color: on ? "var(--ps-text)" : "var(--ps-muted)", transition: "color .4s var(--ease)" }}
                      >
                        <span
                          aria-hidden
                          className="inline-block h-px"
                          style={{
                            width: on ? 18 : 0,
                            background: "var(--ps-accent)",
                            transition: "width .5s cubic-bezier(.16,1,.3,1)",
                          }}
                        />
                        {m.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>

              <div key={shown.label} className="ps-menu-in">
                <p className="ps-caps-lg">{shown.label}</p>
                {tagline ? (
                  <p className="ps-display mt-4 text-[1.35rem] leading-snug" style={{ color: "var(--ps-muted)" }}>
                    {tagline}
                  </p>
                ) : null}
                <ul className="mt-7 space-y-2.5">
                  {picks.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="ps-link text-[.84rem] font-light" style={{ color: "var(--ps-muted)" }}>
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link href={shown.href} className="ps-nav-item ps-link mt-8 inline-block" style={{ color: "var(--ps-accent)" }}>
                  Shop all {shown.label}
                </Link>
              </div>

              <Link key={`p-${shown.label}`} href={shown.href} className="ps-menu-in grid grid-cols-2 gap-3" tabIndex={-1} aria-hidden>
                {shown.plates.map((src) => (
                  <span key={src} className="ps-media ps-zoom aspect-[4/5]">
                    <img src={src} alt="" loading="lazy" decoding="async" />
                  </span>
                ))}
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* search overlay */}
      <div
        ref={searchPanel}
        inert={!search}
        aria-hidden={!search}
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
            <button type="button" aria-label="Close search" className="ps-tap" onClick={() => setSearch(false)}>
              {Ico.close}
            </button>
          </div>
          <input
            className="ps-field ps-display mt-8 text-[2rem] sm:text-[2.8rem]"
            placeholder="Tailoring, occasion, eyewear…"
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
        ref={mobilePanel}
        inert={!mobile}
        aria-hidden={!mobile}
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
          <button type="button" aria-label="Close menu" className="ps-tap" onClick={() => setMobile(false)}>
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
            The Cloth Room
          </Link>
          <Link href="/world" className="ps-caps mt-6 block py-2" style={{ color: "var(--ps-muted)" }}>
            The Maison
          </Link>
          <Link href="/about" className="ps-caps block py-2" style={{ color: "var(--ps-muted)" }}>
            About
          </Link>
          <Link href="/contact" className="ps-caps block py-2" style={{ color: "var(--ps-muted)" }}>
            Contact
          </Link>

          <div className="mt-10 pt-8" style={{ borderTop: "1px solid var(--ps-line)" }}>
            <ThemeSwitcher compact />
          </div>
        </nav>
      </div>
    </>
  );
}
