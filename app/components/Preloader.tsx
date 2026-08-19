"use client";

import { useEffect, useRef, useState } from "react";
import { FillRule } from "./Motif";

const WORD = "PANKAJ SONI";

/* Four beats, ~4.6s total:
 *   0.03s  letters begin rising, 85ms apart, so the wordmark assembles
 *   0.90s  the hairline starts drawing beneath it
 *   2.80s  everything sits at rest — the beat the old 3s version skipped,
 *          and the one that makes it read as composed rather than rushed
 *   3.60s  the plate lifts away
 */
const T = { in: 30, fill: 900, out: 3600, done: 4600 };
const STEP = 85;

/**
 * First-visit curtain.
 *
 * Shown once per tab (sessionStorage). At 4.6s this is a real hold, and
 * replaying it on every navigation would read as latency rather than ceremony.
 */
export default function Preloader() {
  const [phase, setPhase] = useState<"hidden" | "in" | "out" | "done">("hidden");
  const [filling, setFilling] = useState(false);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let seen = false;
    try {
      seen = sessionStorage.getItem("ps-entered") === "1";
    } catch {
      /* private mode — treat as first visit */
    }

    if (seen || reduce) {
      // Unavoidable setState-in-effect: sessionStorage does not exist on the
      // server, so "has this tab already seen the curtain" can only be answered
      // after mount. Deciding in a state initialiser would break SSR; deferring
      // it to a timeout would flash the curtain for a frame on every repeat
      // visit, which is the exact thing this branch exists to prevent.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPhase("done");
      return;
    }

    try {
      sessionStorage.setItem("ps-entered", "1");
    } catch {
      /* ignore */
    }

    // Scheduled rather than set synchronously, so the plate paints before it moves.
    const at = (ms: number, fn: () => void) => timers.current.push(window.setTimeout(fn, ms));

    document.body.style.overflow = "hidden";
    at(T.in, () => setPhase("in"));
    at(T.fill, () => setFilling(true));
    at(T.out, () => setPhase("out"));
    at(T.done, () => {
      setPhase("done");
      document.body.style.overflow = "";
    });

    const t = timers.current;
    return () => {
      t.forEach(window.clearTimeout);
      document.body.style.overflow = "";
    };
  }, []);

  if (phase === "done") return null;

  return (
    <div
      aria-hidden
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center"
      style={{
        background: "var(--ps-bg-alt)",
        transform: phase === "out" ? "translateY(-100%)" : "translateY(0)",
        transition: "transform 1s cubic-bezier(.76,0,.24,1)",
      }}
    >
      <div className="overflow-hidden px-6 pb-[0.14em]">
        <p className="ps-wordmark flex justify-center text-[1.1rem] sm:text-[1.9rem]">
          {WORD.split("").map((ch, i) => (
            <span
              key={i}
              style={{
                display: "inline-block",
                whiteSpace: "pre",
                transform: phase === "in" || phase === "out" ? "translateY(0)" : "translateY(110%)",
                opacity: phase === "in" || phase === "out" ? 1 : 0,
                transition: `transform 1s cubic-bezier(.16,1,.3,1) ${i * STEP}ms,
                             opacity 1s ease ${i * STEP}ms`,
              }}
            >
              {ch}
            </span>
          ))}
        </p>
      </div>

      {/* Same object the section dividers and the checkout stepper use. */}
      <div className="mt-9 w-[190px] sm:w-[260px]">
        <FillRule progress={filling ? 1 : 0} duration={1900} />
      </div>

      <p
        className="ps-caps mt-6"
        style={{
          fontSize: ".52rem",
          color: "var(--ps-faint)",
          opacity: phase === "in" || phase === "out" ? 1 : 0,
          transition: "opacity .9s ease 1.1s",
        }}
      >
        Maison — Est. 1998
      </p>
    </div>
  );
}
