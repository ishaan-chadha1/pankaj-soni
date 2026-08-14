"use client";

import { useEffect, useRef, useState } from "react";

const WORD = "PANKAJ SONI";

/**
 * First-visit curtain: the wordmark sets letter by letter over a hairline that
 * fills, then the whole plate lifts away.
 *
 * Shown once per tab (sessionStorage) — a luxury preloader on every navigation
 * stops reading as ceremony and starts reading as latency.
 */
export default function Preloader() {
  const [phase, setPhase] = useState<"hidden" | "in" | "out" | "done">("hidden");
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
    at(30, () => setPhase("in"));
    at(2050, () => setPhase("out"));
    at(3000, () => {
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
        background: "#08080a",
        transform: phase === "out" ? "translateY(-100%)" : "translateY(0)",
        transition: "transform 1s cubic-bezier(.76,0,.24,1)",
      }}
    >
      <div className="overflow-hidden px-6">
        <p className="ps-wordmark flex justify-center text-[1.1rem] sm:text-[1.9rem]">
          {WORD.split("").map((ch, i) => (
            <span
              key={i}
              style={{
                display: "inline-block",
                whiteSpace: "pre",
                transform: phase === "in" ? "translateY(0)" : "translateY(110%)",
                opacity: phase === "in" ? 1 : 0,
                transition: `transform .95s cubic-bezier(.16,1,.3,1) ${i * 55}ms,
                             opacity .95s ease ${i * 55}ms`,
              }}
            >
              {ch}
            </span>
          ))}
        </p>
      </div>

      <div className="mt-9 h-px w-[190px] sm:w-[260px]" style={{ background: "rgba(244,241,234,.16)" }}>
        <div
          className="h-px"
          style={{
            width: phase === "in" || phase === "out" ? "100%" : "0%",
            background: "var(--gold)",
            transition: "width 1.85s cubic-bezier(.4,0,.2,1) .35s",
          }}
        />
      </div>

      <p
        className="ps-caps mt-6"
        style={{
          fontSize: ".52rem",
          color: "var(--ps-faint)",
          opacity: phase === "in" ? 1 : 0,
          transition: "opacity .8s ease .7s",
        }}
      >
        Maison — Est. 1998
      </p>
    </div>
  );
}
