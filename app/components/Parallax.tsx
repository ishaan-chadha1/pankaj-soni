"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Translates its child against scroll. rAF-throttled and skipped entirely for
 * reduced-motion users and on narrow screens, where the effect mostly just
 * costs battery.
 */
export function Parallax({
  children,
  speed = 0.18,
  className,
}: {
  children: ReactNode;
  speed?: number;
  className?: string;
}) {
  const wrap = useRef<HTMLDivElement | null>(null);
  const inner = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || window.innerWidth < 768) return;

    let frame = 0;
    const tick = () => {
      frame = 0;
      const w = wrap.current;
      const el = inner.current;
      if (!w || !el) return;
      const r = w.getBoundingClientRect();
      if (r.bottom < 0 || r.top > window.innerHeight) return;
      // 0 when the block is centred, ±1 at the viewport edges.
      const mid = (r.top + r.height / 2 - window.innerHeight / 2) / window.innerHeight;
      el.style.transform = `translate3d(0, ${(mid * speed * 100).toFixed(2)}px, 0)`;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(tick);
    };

    tick();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [speed]);

  return (
    <div ref={wrap} className={className}>
      <div ref={inner} className="h-full w-full will-change-transform">
        {children}
      </div>
    </div>
  );
}

/**
 * Hero plate: a slow continuous push-in that starts on mount, plus a scrim so
 * display type stays legible over any part of the image.
 */
export function HeroPlate({ src, alt = "" }: { src: string; alt?: string }) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const t = window.setTimeout(() => setOn(true), 60);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      <img
        src={src}
        alt={alt}
        className="h-full w-full object-cover"
        style={{
          transform: on ? "scale(1.06)" : "scale(1.16)",
          transition: "transform 3.6s cubic-bezier(.16,1,.3,1)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(6,6,7,.62) 0%, rgba(6,6,7,.18) 34%, rgba(6,6,7,.34) 68%, rgba(6,6,7,.88) 100%)",
        }}
      />
    </div>
  );
}
