"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Vertical scroll drives horizontal movement.
 *
 * The wrapper is made tall; inside it a viewport-height frame sticks, and the
 * row translates on X in proportion to how far the wrapper has been scrolled.
 * Track height is derived from the row's actual overflow, so it scrolls exactly
 * as far as there is content — a hardcoded height either strands the last card
 * or leaves dead scroll at the end.
 *
 * Below `lg`, and for reduced-motion, this degrades to a normal swipeable rail.
 * Scroll-jacking a phone is worse than the effect is good.
 */
export default function HorizontalRail({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const wrap = useRef<HTMLDivElement | null>(null);
  const row = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mqDesktop = window.matchMedia("(min-width: 1024px)");
    const mqMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    let raf = 0;
    let distance = 0;
    let active = false;

    const measure = () => {
      const w = wrap.current;
      const r = row.current;
      if (!w || !r) return;

      active = mqDesktop.matches && !mqMotion.matches;

      if (!active) {
        w.style.height = "";
        r.style.transform = "";
        return;
      }

      distance = Math.max(0, r.scrollWidth - window.innerWidth + 64);
      // viewport for the pinned frame + however far the row must travel
      w.style.height = `${window.innerHeight + distance}px`;
      tick();
    };

    const tick = () => {
      raf = 0;
      const w = wrap.current;
      const r = row.current;
      if (!w || !r || !active) return;

      const top = w.getBoundingClientRect().top;
      const p = Math.min(1, Math.max(0, -top / distance || 0));
      r.style.transform = `translate3d(${-(p * distance).toFixed(2)}px,0,0)`;
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measure);
    mqDesktop.addEventListener("change", measure);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measure);
      mqDesktop.removeEventListener("change", measure);
    };
  }, []);

  return (
    <div ref={wrap} className={className}>
      <div className="lg:sticky lg:top-0 lg:flex lg:h-svh lg:items-center lg:overflow-hidden">
        {/* Below lg this is a plain swipeable overflow rail. */}
        <div className="ps-norail overflow-x-auto lg:overflow-visible">
          <div
            ref={row}
            className="flex gap-5 px-5 will-change-transform sm:px-8"
            style={{ width: "max-content" }}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
