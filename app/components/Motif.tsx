"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

/**
 * The two motions the entry curtain is built from, extracted so the rest of the
 * site can speak the same language instead of re-implementing them.
 *
 *   <FillRule/>  a hairline that draws left to right
 *   <Curtain/>   a panel that lifts to reveal what is beneath it
 *
 * Both are inert under prefers-reduced-motion: the rule renders full, the
 * curtain renders open. Neither ever hides content permanently.
 */

/** Shared one-shot visibility observer. */
function useInView<T extends HTMLElement>(rootMargin = "-8% 0px") {
  const ref = useRef<T | null>(null);
  const setRef = useCallback((node: T | null) => {
    ref.current = node;
  }, []);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { rootMargin, threshold: 0.01 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin]);

  return { setRef, seen };
}

/**
 * A hairline that draws itself.
 *
 * Uncontrolled it fills once on scroll-in. Pass `progress` (0–1) to drive it
 * from state instead — that is how the checkout stepper and the bag's delivery
 * threshold use it, so a progress bar and a section divider are the same object.
 */
export function FillRule({
  className,
  delay = 0,
  duration = 1400,
  progress,
  accent = true,
}: {
  className?: string;
  delay?: number;
  duration?: number;
  progress?: number;
  accent?: boolean;
}) {
  const controlled = typeof progress === "number";
  const { setRef, seen } = useInView<HTMLDivElement>();

  const width = controlled
    ? `${Math.min(100, Math.max(0, progress * 100))}%`
    : seen
      ? "100%"
      : "0%";

  return (
    <div
      ref={controlled ? undefined : setRef}
      className={`ps-fill ${className ?? ""}`}
      aria-hidden={!controlled}
    >
      <span
        className="ps-fill-bar"
        style={{
          width,
          transitionDuration: `${duration}ms`,
          transitionDelay: `${delay}ms`,
          background: accent ? "var(--ps-accent)" : "var(--ps-text)",
        }}
      />
    </div>
  );
}

/**
 * Reveals its children by lifting a panel off them.
 *
 * The panel is a sibling overlay rather than a clip on the content, so the
 * child is always in the DOM at full size — layout never depends on the
 * animation having run, and text underneath stays selectable and readable to
 * assistive tech the whole time.
 */
export function Curtain({
  children,
  className,
  delay = 0,
  duration = 1100,
  style,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  style?: CSSProperties;
}) {
  const { setRef, seen } = useInView<HTMLDivElement>("-4% 0px");

  return (
    <div ref={setRef} className={`ps-curtain ${className ?? ""}`} style={style}>
      {children}
      <span
        aria-hidden
        className="ps-curtain-panel"
        data-open={seen}
        style={{ transitionDuration: `${duration}ms`, transitionDelay: `${delay}ms` }}
      />
    </div>
  );
}

/**
 * The wordmark assembling letter by letter — the entry curtain's signature,
 * reused wherever the house name is set large.
 */
export function RisingWord({
  text,
  className,
  delay = 0,
  step = 55,
  style,
}: {
  text: string;
  className?: string;
  delay?: number;
  step?: number;
  style?: CSSProperties;
}) {
  const { setRef, seen } = useInView<HTMLSpanElement>("-6% 0px");

  return (
    <span ref={setRef} className={`ps-rising ${className ?? ""}`} data-shown={seen} style={style}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {[...text].map((ch, i) => (
          <span key={i} style={{ transitionDelay: `${delay + i * step}ms` }}>
            {ch === " " ? " " : ch}
          </span>
        ))}
      </span>
    </span>
  );
}
