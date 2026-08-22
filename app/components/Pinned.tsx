"use client";

import { useEffect, useRef, useState } from "react";

export type Beat = {
  n: string;
  title: string;
  body: string;
  image: string;
};

/**
 * Scroll-pinned storytelling.
 *
 * The frame sticks for the height of the track while the beats advance against
 * it — the plate cross-fades, the copy swaps. Progress is derived from the
 * track's position rather than a scroll listener with magic numbers, so it
 * stays correct at any viewport height.
 *
 * Below `lg`, and for reduced-motion, every beat renders stacked and static.
 * A pinned section on a phone eats the whole screen and fights the scroll.
 */
export default function Pinned({ beats }: { beats: Beat[] }) {
  const track = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(0);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const mqDesktop = window.matchMedia("(min-width: 1024px)");
    const mqMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    let raf = 0;

    const sync = () => {
      const on = mqDesktop.matches && !mqMotion.matches;
      setEnabled(on);
      if (on) tick();
    };

    const tick = () => {
      raf = 0;
      const el = track.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const total = r.height - window.innerHeight;
      if (total <= 0) return;
      const p = Math.min(0.999, Math.max(0, -r.top / total));
      setActive(Math.floor(p * beats.length));
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };

    sync();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", sync);
    mqDesktop.addEventListener("change", sync);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", sync);
      mqDesktop.removeEventListener("change", sync);
    };
  }, [beats.length]);

  return (
    <div
      ref={track}
      className="ps-pin-track"
      style={enabled ? { height: `${beats.length * 100}svh` } : undefined}
    >
      <div className={enabled ? "ps-pin" : undefined}>
        <div className="mx-auto grid h-full max-w-[1560px] items-center gap-14 px-5 py-24 sm:px-8 lg:grid-cols-2 lg:gap-24 lg:py-0">
          {/* plates — stacked and cross-faded when pinned */}
          <div className={enabled ? "relative aspect-[4/5]" : "space-y-5"}>
            {beats.map((b, i) => (
              <div
                key={b.n}
                className={`ps-media ps-tint aspect-[4/5] ${enabled ? "absolute inset-0" : ""}`}
                style={
                  enabled
                    ? {
                        opacity: i === active ? 1 : 0,
                        transform: i === active ? "scale(1)" : "scale(1.04)",
                        transition: "opacity .8s var(--ease), transform 1.2s var(--ease)",
                      }
                    : undefined
                }
              >
                <img src={b.image} alt="" loading="lazy" decoding="async" />
              </div>
            ))}
          </div>

          {/* copy */}
          <div className={enabled ? "relative min-h-[340px]" : "space-y-16"}>
            {beats.map((b, i) => (
              <div
                key={b.n}
                data-active={enabled ? i === active : true}
                className={enabled ? "ps-beat absolute inset-0 flex flex-col justify-center" : ""}
              >
                <p className="ps-display text-[3rem] leading-none" style={{ color: "var(--ps-faint)" }}>
                  {b.n}
                </p>
                <h3 className="ps-display ps-h3 mt-5">{b.title}</h3>
                <p
                  className="mt-6 max-w-[52ch] text-[.95rem] font-light leading-relaxed"
                  style={{ color: "var(--ps-muted)" }}
                >
                  {b.body}
                </p>
              </div>
            ))}

            {/* progress ticks, only meaningful while pinned */}
            {enabled ? (
              <div className="absolute bottom-0 left-0 flex gap-2">
                {beats.map((b, i) => (
                  <span
                    key={b.n}
                    className="block h-px w-10 transition-colors ps-t-base"
                    style={{
                      background: i === active ? "var(--ps-accent)" : "var(--ps-line)",
                    }}
                  />
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
