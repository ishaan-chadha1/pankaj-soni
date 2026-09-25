"use client";

import { Children, useEffect, useRef, useState, type ReactNode } from "react";

/**
 * The product's pictures.
 *
 * ON A PHONE, ONE SCREEN OF PICTURE, NOT THREE. The gallery used to stack a
 * 4:5 plate and two squares above the name, so the first thing a phone showed
 * was roughly 1,300px of photographs before the piece had a name or a price.
 * Below `lg` it is now a single full-bleed frame you swipe through — native
 * scroll-snap, no library — with a counter, and the name follows straight on.
 *
 * On a desk the frames simply stack, and the buy column pins beside them.
 */
export default function Gallery({ children }: { children: ReactNode }) {
  const track = useRef<HTMLDivElement | null>(null);
  const [index, setIndex] = useState(0);
  const count = Children.count(children);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const onScroll = () => {
      const i = Math.round(el.scrollLeft / Math.max(1, el.clientWidth));
      setIndex(Math.min(count - 1, Math.max(0, i)));
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [count]);

  const go = (i: number) => {
    const el = track.current;
    if (!el) return;
    el.scrollTo({ left: i * el.clientWidth, behavior: "smooth" });
  };

  return (
    <div className="ps-gallery">
      <div
        ref={track}
        className="ps-gallery-track"
        role="region"
        aria-roledescription="carousel"
        aria-label="Product images"
      >
        {Children.map(children, (child, i) => (
          <div
            className="ps-gallery-slide"
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${count}`}
          >
            {child}
          </div>
        ))}
      </div>

      {count > 1 ? (
        <div className="ps-gallery-nav" aria-hidden>
          <span className="ps-caps ps-gallery-count">
            {String(index + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
          </span>
          <span className="ps-gallery-bars">
            {Array.from({ length: count }, (_, i) => (
              <button
                key={i}
                type="button"
                tabIndex={-1}
                onClick={() => go(i)}
                data-on={i === index}
              />
            ))}
          </span>
        </div>
      ) : null}
    </div>
  );
}
