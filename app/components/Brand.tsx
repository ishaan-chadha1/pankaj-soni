import type { CSSProperties } from "react";
import { GOLD, LOCKUP_GAP, MARK, NAME } from "@/lib/brand";

/**
 * The house mark, drawn inline from the vector master.
 *
 * One flat gold — the master's own #cba542 — everywhere: no gradient, no
 * shading, no glint. That is the brand rule, and it reads the same on the
 * paper palettes and on ink.
 */

export function Monogram({
  className,
  style,
  title,
}: {
  className?: string;
  style?: CSSProperties;
  /** Accessible name; omit for a decorative mark. */
  title?: string;
}) {
  return (
    <svg
      viewBox={`0 0 ${MARK.w} ${MARK.h}`}
      className={className}
      style={style}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <path fill={GOLD.body} fillRule="evenodd" d={MARK.d} />
    </svg>
  );
}

/** The full lockup: the mark over the name, as the master sets them. */
export function Logo({
  className,
  style,
  title = "Pankaj Soni",
}: {
  className?: string;
  style?: CSSProperties;
  title?: string;
}) {
  const w = Math.max(MARK.w, NAME.w);
  const h = MARK.h + LOCKUP_GAP + NAME.h;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className={className} style={style} role="img" aria-label={title}>
      <path fill={GOLD.body} fillRule="evenodd" transform={`translate(${(w - MARK.w) / 2} 0)`} d={MARK.d} />
      <path
        fill={GOLD.body}
        fillRule="evenodd"
        transform={`translate(${(w - NAME.w) / 2} ${MARK.h + LOCKUP_GAP})`}
        d={NAME.d}
      />
    </svg>
  );
}
