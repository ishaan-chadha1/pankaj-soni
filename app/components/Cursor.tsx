"use client";

import { useEffect, useRef } from "react";

/**
 * A trailing ring that widens over anything clickable.
 *
 * Position is written straight to the node in the listener — routing pointer
 * moves through React state would re-render the tree on every mouse event.
 * Pointer devices only; touch and reduced-motion get nothing.
 */
export default function Cursor() {
  const ring = useRef<HTMLDivElement | null>(null);
  const dot = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;

    const r = ring.current;
    const d = dot.current;
    if (!r || !d) return;

    document.documentElement.classList.add("ps-has-cursor");

    let rx = window.innerWidth / 2;
    let ry = window.innerHeight / 2;
    let mx = rx;
    let my = ry;
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      mx = e.clientX;
      my = e.clientY;
      d.style.transform = `translate3d(${mx}px, ${my}px, 0) translate(-50%, -50%)`;

      // Widen over anything that responds to a click.
      const el = e.target as HTMLElement | null;
      const active = !!el?.closest('a, button, input, select, textarea, summary, [role="button"]');
      r.dataset.active = active ? "true" : "false";
    };

    // The ring eases toward the pointer; the dot tracks it exactly.
    const tick = () => {
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      r.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%)`;
      raf = requestAnimationFrame(tick);
    };

    const onLeave = () => {
      r.style.opacity = "0";
      d.style.opacity = "0";
    };
    const onEnter = () => {
      r.style.opacity = "1";
      d.style.opacity = "1";
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    document.addEventListener("pointerenter", onEnter);
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("pointerenter", onEnter);
      document.documentElement.classList.remove("ps-has-cursor");
    };
  }, []);

  return (
    <>
      <div ref={ring} className="ps-cursor-ring" aria-hidden />
      <div ref={dot} className="ps-cursor-dot" aria-hidden />
    </>
  );
}
