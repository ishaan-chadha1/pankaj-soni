"use client";

import { FillRule } from "./Motif";
import { Monogram } from "./Brand";

const WORD = "PANKAJ SONI";

/**
 * The house plate — the wordmark rising letter by letter over a hairline, with
 * a caption beneath.
 *
 * ONE OBJECT, TWO TEMPOS. The first-visit Preloader plays it slowly as a piece
 * of ceremony; the PageTransition plays the same plate fast between routes.
 * Only the timings differ, so the curtain a visitor meets on arrival is
 * recognisably the one that carries them from page to page.
 *
 * Purely presentational: the parent owns the clock and the surface the plate
 * sits on (the Preloader lifts it, the transition wipes it). This only knows
 * whether the letters are up and whether the rule is drawn.
 */
export default function MaisonPlate({
  shown,
  filling,
  caption,
  step,
  letterMs,
  fillMs,
  captionDelay,
}: {
  /** Letters risen and caption visible. */
  shown: boolean;
  /** Hairline drawn. */
  filling: boolean;
  caption: string;
  /** Stagger between letters. */
  step: number;
  /** How long each letter takes to rise. */
  letterMs: number;
  fillMs: number;
  captionDelay: number;
}) {
  return (
    <>
      {/* The mark arrives first and a glint crosses it; the name rises under
          it. Same timing scale as the letters, so both tempos keep it. */}
      <div
        className="mb-8 sm:mb-10"
        style={{
          opacity: shown ? 1 : 0,
          transform: shown ? "none" : "translateY(14px) scale(.94)",
          transition: `opacity ${letterMs}ms ease, transform ${Math.round(letterMs * 1.2)}ms cubic-bezier(.16,1,.3,1)`,
        }}
      >
        {shown ? (
          <Monogram className="h-16 w-auto sm:h-24" sheen />
        ) : (
          <Monogram className="h-16 w-auto sm:h-24" />
        )}
      </div>

      <div className="overflow-hidden px-6 pb-[0.14em]">
        <p className="ps-wordmark flex justify-center text-[1.1rem] sm:text-[1.9rem]">
          {WORD.split("").map((ch, i) => (
            <span
              key={i}
              style={{
                display: "inline-block",
                whiteSpace: "pre",
                transform: shown ? "translateY(0)" : "translateY(110%)",
                opacity: shown ? 1 : 0,
                transition: `transform ${letterMs}ms cubic-bezier(.16,1,.3,1) ${i * step}ms,
                             opacity ${letterMs}ms ease ${i * step}ms`,
              }}
            >
              {ch}
            </span>
          ))}
        </p>
      </div>

      {/* Same object the section dividers and the checkout stepper use. */}
      <div className="mt-9 w-[190px] sm:w-[260px]">
        <FillRule progress={filling ? 1 : 0} duration={fillMs} />
      </div>

      <p
        className="ps-caps mt-6"
        style={{
          fontSize: ".52rem",
          color: "var(--ps-faint)",
          opacity: shown ? 1 : 0,
          transition: `opacity ${Math.round(letterMs * 0.9)}ms ease ${captionDelay}ms`,
        }}
      >
        {caption}
      </p>
    </>
  );
}
