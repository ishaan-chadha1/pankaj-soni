"use client";

import { useId, type CSSProperties } from "react";
import { GOLD, LOCKUP_GAP, MARK, NAME } from "@/lib/brand";

/**
 * The house mark, drawn inline so it can be coloured and animated.
 *
 * TWO GOLDS. The master's gold is bright — a pale #ffe46f highlight — which
 * is right on ink and all but disappears on the paper every palette here is
 * built on. `deep` (the default) is the same sweep taken down into the
 * master's own shadow tones so the mark holds on cream; `bright` is the
 * master as drawn, for the dark surfaces.
 *
 * SHEEN. With `sheen`, a band of light crosses the mark — the gradient
 * itself is moved, so it needs no second copy of the paths and no mask.
 * `sheen="loop"` repeats it for the plates that hold on screen. SMIL times
 * run from when the <svg> is inserted, so a sheen plays on mount: remount
 * the mark (a new key) to play it again.
 */

type Tone = "deep" | "bright";

const STOPS: Record<Tone, [string, string, string]> = {
  deep: ["#a27a37", "#7d5a24", "#c9a052"],
  bright: [GOLD.light, GOLD.shadow, GOLD.body],
};

function Gold({ id, tone, sheen }: { id: string; tone: Tone; sheen?: boolean | "loop" }) {
  const [a, b, c] = STOPS[tone];
  return (
    <linearGradient id={id} x1="0" y1="0" x2="1" y2="1" gradientUnits="objectBoundingBox">
      <stop offset="0" stopColor={a} />
      <stop offset="0.42" stopColor={b} />
      {/* The glint — a narrow pale band the sheen carries across. */}
      <stop offset="0.5" stopColor={sheen ? GOLD.light : b} />
      <stop offset="0.58" stopColor={b} />
      <stop offset="1" stopColor={c} />
      {sheen ? (
        <animateTransform
          attributeName="gradientTransform"
          type="translate"
          from="-1 -1"
          to="1 1"
          dur={sheen === "loop" ? "3.2s" : "1.8s"}
          begin="0.25s"
          repeatCount={sheen === "loop" ? "indefinite" : "1"}
          /* Back to rest afterwards: frozen at the end of its travel the
             gradient sits wholly off the shape and the mark goes flat. */
          fill="remove"
        />
      ) : null}
    </linearGradient>
  );
}

export function Monogram({
  className,
  style,
  tone = "deep",
  sheen,
  title,
}: {
  className?: string;
  style?: CSSProperties;
  tone?: Tone;
  sheen?: boolean | "loop";
  /** Accessible name; omit for a decorative mark. */
  title?: string;
}) {
  const id = useId().replace(/:/g, "");
  return (
    <svg
      viewBox={`0 0 ${MARK.w} ${MARK.h}`}
      className={className}
      style={style}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <defs>
        <Gold id={`g${id}`} tone={tone} sheen={sheen} />
      </defs>
      <path fill={`url(#g${id})`} fillRule="evenodd" d={MARK.d} />
    </svg>
  );
}

/** The full lockup: the mark over the name, as the master sets them. */
export function Logo({
  className,
  style,
  tone = "deep",
  sheen,
  title = "Pankaj Soni",
}: {
  className?: string;
  style?: CSSProperties;
  tone?: Tone;
  sheen?: boolean | "loop";
  title?: string;
}) {
  const id = useId().replace(/:/g, "");
  const w = Math.max(MARK.w, NAME.w);
  const h = MARK.h + LOCKUP_GAP + NAME.h;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className={className} style={style} role="img" aria-label={title}>
      <defs>
        <Gold id={`g${id}`} tone={tone} sheen={sheen} />
      </defs>
      <path fill={`url(#g${id})`} fillRule="evenodd" transform={`translate(${(w - MARK.w) / 2} 0)`} d={MARK.d} />
      <path
        fill={`url(#g${id})`}
        fillRule="evenodd"
        transform={`translate(${(w - NAME.w) / 2} ${MARK.h + LOCKUP_GAP})`}
        d={NAME.d}
      />
    </svg>
  );
}
