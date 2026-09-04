"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { money, type Product } from "@/lib/catalog";

const SAVED_KEY = "ps:saved";

/**
 * The collection rail: full-bleed, portrait plates, one flick per garment.
 *
 * Deliberately runs edge to edge rather than sitting inside the 1560px measure
 * the rest of the page uses. A rail that stops short of the viewport looks
 * finished, and a finished row does not invite a swipe — letting the plates
 * bleed off both sides is what says there is more of it.
 *
 * Scrolling is native: `scroll-snap` and `overflow-x`, not a transform driven
 * by JS. That is what gives momentum on a trackpad, kinetic flick on a phone,
 * shift+wheel on a mouse, and arrow keys with focus, none of which a hand-
 * rolled carousel gets without writing all four.
 */
export default function ProductRail({
  items,
  eyebrow,
  title,
  href,
}: {
  items: Product[];
  eyebrow: string;
  title: string;
  href: string;
}) {
  const rail = useRef<HTMLDivElement | null>(null);
  const [ends, setEnds] = useState({ start: true, end: false });
  const [saved, setSaved] = useState<Set<string>>(new Set());

  // Read once on mount. Rendering from localStorage during the first paint
  // would disagree with the server markup and take the whole tree down.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(SAVED_KEY);
      // Same trade the cart makes: localStorage cannot be read during render
      // without the server markup and the client tree disagreeing, so the
      // adoption has to happen in an effect. One write, on mount only.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (raw) setSaved(new Set(JSON.parse(raw) as string[]));
    } catch {
      /* private mode, or a corrupt value — an empty wishlist is a fine fallback */
    }
  }, []);

  const toggleSave = useCallback((slug: string) => {
    setSaved((prev) => {
      const next = new Set(prev);
      if (!next.delete(slug)) next.add(slug);
      try {
        localStorage.setItem(SAVED_KEY, JSON.stringify([...next]));
      } catch {
        /* not worth failing the interaction over */
      }
      return next;
    });
  }, []);

  const readEnds = useCallback(() => {
    const el = rail.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setEnds({ start: el.scrollLeft < 8, end: el.scrollLeft > max - 8 });
  }, []);

  useEffect(() => {
    readEnds();
    const el = rail.current;
    if (!el) return;
    const ro = new ResizeObserver(readEnds);
    ro.observe(el);
    return () => ro.disconnect();
  }, [readEnds]);

  // One plate per press. Measured rather than assumed: the plate width is a
  // clamp() that resolves differently at every breakpoint.
  const nudge = (dir: 1 | -1) => {
    const el = rail.current;
    if (!el) return;
    const plate = el.querySelector<HTMLElement>(".ps-plate");
    const step = plate ? plate.offsetWidth + 22 : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  return (
    <section id="rail" className="ps-railsec relative" aria-label={title}>
      <div className="mx-auto mb-7 flex max-w-[1560px] flex-wrap items-end justify-between gap-4 px-5 sm:px-8">
        <div>
          <p className="ps-caps" style={{ color: "var(--ps-accent)" }}>
            {eyebrow}
          </p>
          <h2 className="ps-display mt-2.5 text-[1.9rem] leading-none sm:text-[2.6rem]">{title}</h2>
        </div>
        <Link href={href} className="ps-caps ps-link ps-link-on">
          View All
        </Link>
      </div>

      <div className="relative">
        <div ref={rail} onScroll={readEnds} className="ps-rail ps-norail">
          {items.map((p) => {
            const on = saved.has(p.slug);
            return (
              <article key={p.slug} className="ps-plate">
                <Link href={`/p/${p.slug}`} className="ps-plate-media" aria-label={p.name}>
                  <img src={p.image} alt={p.name} loading="lazy" decoding="async" />
                </Link>

                <button
                  type="button"
                  className="ps-plate-save"
                  onClick={() => toggleSave(p.slug)}
                  aria-pressed={on}
                  aria-label={on ? `Remove ${p.name} from saved` : `Save ${p.name}`}
                >
                  <svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true">
                    <path
                      d="M12 20.3 4.6 13a4.6 4.6 0 1 1 6.5-6.5l.9.9.9-.9A4.6 4.6 0 1 1 19.4 13Z"
                      fill={on ? "currentColor" : "none"}
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>

                {/* The plate is the product; the bar is the only type on it. */}
                <Link href={`/p/${p.slug}`} className="ps-plate-bar ps-caps">
                  {money(p.price)}
                </Link>

                {/* Reachable name, off-picture. The bar carries the price alone
                    because a plate this size does not need to be labelled — but
                    a link that reads only "$1,450" is useless in a screen
                    reader's link list. */}
                <h3 className="ps-plate-name ps-display">
                  <Link href={`/p/${p.slug}`}>{p.name}</Link>
                </h3>
              </article>
            );
          })}
        </div>

        <button
          type="button"
          className="ps-rail-arrow ps-rail-prev"
          onClick={() => nudge(-1)}
          disabled={ends.start}
          aria-label="Previous"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <path d="M15 4 7 12l8 8" fill="none" stroke="currentColor" strokeWidth="1.4" />
          </svg>
        </button>
        <button
          type="button"
          className="ps-rail-arrow ps-rail-next"
          onClick={() => nudge(1)}
          disabled={ends.end}
          aria-label="Next"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <path d="M9 4l8 8-8 8" fill="none" stroke="currentColor" strokeWidth="1.4" />
          </svg>
        </button>
      </div>
    </section>
  );
}
