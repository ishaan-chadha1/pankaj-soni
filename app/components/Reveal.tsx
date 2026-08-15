"use client";

import {
  createElement,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

/**
 * Scroll reveal. The animation lives in CSS (`.ps-rise` / `.ps-mask`); this only
 * flips `data-shown`, so a client without JS still gets readable content — the
 * elements simply start visible if the observer never runs.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  once = true,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  once?: boolean;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShown(true);
          if (once) io.disconnect();
        } else if (!once) {
          setShown(false);
        }
      },
      { rootMargin: "-8% 0px -8% 0px", threshold: 0.01 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [once]);

  return (
    <div
      ref={ref}
      data-shown={shown}
      className={`ps-rise ${className ?? ""}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}

/**
 * Line-by-line masked rise for display headlines. Each line needs its own
 * overflow-hidden box, so the caller passes an array rather than a string.
 *
 * `as` matters more than it looks: these carry nearly every headline on the
 * site, so defaulting to <div> left the whole store with no <h1> and a document
 * outline that started at <h3>. Pass the real level.
 */
export function MaskLines({
  lines,
  className,
  delay = 0,
  step = 90,
  as = "div",
}: {
  lines: ReactNode[];
  className?: string;
  delay?: number;
  step?: number;
  as?: "h1" | "h2" | "h3" | "div";
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { rootMargin: "-5% 0px", threshold: 0.01 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // createElement rather than a `Tag` variable: a union of intrinsic tags does
  // not narrow to a usable JSX component type, and casting to ElementType makes
  // TS resolve the props to `never`.
  return createElement(
    as,
    { ref, className },
    lines.map((l, i) => (
      <span key={i} className="ps-mask" data-shown={shown}>
        <span style={{ transitionDelay: `${delay + i * step}ms` }}>{l}</span>
      </span>
    ))
  );
}
