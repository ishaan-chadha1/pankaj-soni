"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { money, type Product } from "@/lib/catalog";
import { blurForImage, setForImage } from "@/lib/photos";

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
 *
 * IT LOOPS, and it keeps all of that.
 *
 * The set is rendered three times and the rail parks on the middle copy. When
 * a scroll carries you past the copy you started in, `scrollLeft` is moved by
 * exactly one set width — you are put back where you were relative to the
 * plates, so the row appears to have no end. The jump is a hard assignment, not
 * an animation, and it lands on an identical pixel, so there is nothing to see.
 *
 * Doing it this way rather than with a transform keeps momentum: a kinetic
 * flick that crosses the seam carries its velocity through, because the
 * browser is still the one scrolling.
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
  const [saved, setSaved] = useState<Set<string>>(new Set());

  /* Three copies. Two is enough to loop in one direction but leaves nothing to
     scroll back into; three means the middle copy always has a full set either
     side of it, so the seam is never within a viewport of where you are. */
  const COPIES = 3;

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

  /**
   * Width of ONE copy of the set, measured rather than computed.
   *
   * The plate width is a `clamp()` that resolves differently at every
   * breakpoint and the gap is a CSS value, so the only reliable number is the
   * distance between a plate and its own duplicate one set later.
   */
  const setWidth = useCallback(() => {
    const el = rail.current;
    if (!el) return 0;
    const plates = el.querySelectorAll<HTMLElement>(".ps-plate");
    if (plates.length < items.length + 1) return 0;
    return plates[items.length].offsetLeft - plates[0].offsetLeft;
  }, [items.length]);

  /* Park on the middle copy so there is a full set to scroll back into. */
  useEffect(() => {
    const el = rail.current;
    if (!el) return;
    const park = () => {
      const w = setWidth();
      if (w) el.scrollLeft = w;
    };
    park();
    // Plate width depends on decoded images and on the breakpoint, so the
    // first measurement can be taken before either has settled.
    const ro = new ResizeObserver(park);
    ro.observe(el);
    return () => ro.disconnect();
    // Parking again on every resize is deliberate: the set width changes with
    // the breakpoint, so a stale offset would land mid-plate.
  }, [setWidth]);

  /**
   * Keep the scroll inside the middle copy.
   *
   * `scroll-snap-type` is switched off around the assignment. With mandatory
   * snapping left on, the browser re-snaps to whatever is nearest AFTER the
   * jump, which on a fast flick cancelled the momentum and stopped the rail
   * dead at the seam.
   */
  const wrap = useCallback(() => {
    const el = rail.current;
    if (!el) return;
    const w = setWidth();
    if (!w) return;
    const x = el.scrollLeft;
    if (x >= w * 0.5 && x < w * 1.5) return;

    const snap = el.style.scrollSnapType;
    el.style.scrollSnapType = "none";
    el.scrollLeft = x < w * 0.5 ? x + w : x - w;
    // Restored on the next frame: setting it back synchronously re-snaps
    // against the value we just wrote.
    requestAnimationFrame(() => {
      el.style.scrollSnapType = snap;
    });
  }, [setWidth]);

  // One plate per press. The wrap handles running off either end.
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
        <div ref={rail} onScroll={wrap} className="ps-rail ps-norail">
          {Array.from({ length: COPIES }, (_, copy) =>
            items.map((p) => {
            const on = saved.has(p.slug);
            /* Only the middle copy is real to assistive tech and to the tab
               order. The other two are the same nine products again, and a
               screen reader reading the collection three times is worse than
               not looping at all. */
            const clone = copy !== 1;
            return (
              <article
                key={`${copy}-${p.slug}`}
                className="ps-plate"
                data-sold={p.soldOut ? "true" : undefined}
                aria-hidden={clone || undefined}
                inert={clone || undefined}
              >
                <Link
                  href={`/p/${p.slug}`}
                  className="ps-plate-media"
                  aria-label={p.name}
                  /* Holds the plate in roughly the right colours while it
                     decodes, so a rail of portraits resolves out of the
                     photograph instead of flashing nine empty boxes. */
                  style={{ backgroundImage: blurForImage(p.image) }}
                >
                  <img
                    src={p.image}
                    srcSet={setForImage(p.image)}
                    sizes="(max-width: 699px) 74vw, (max-width: 1199px) 34vw, 25vw"
                    alt={p.name}
                    loading="lazy"
                    decoding="async"
                  />
                </Link>

                {/* A capped run that has gone stays on the rail. Saying so is
                    more convincing than quietly removing the plate. */}
                {p.soldOut ? <span className="ps-plate-sold ps-caps">Sold Out</span> : null}

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
                  {p.soldOut ? "Price on Request" : money(p.price)}
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
            })
          )}
        </div>

        <button
          type="button"
          className="ps-rail-arrow ps-rail-prev"
          onClick={() => nudge(-1)}
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
