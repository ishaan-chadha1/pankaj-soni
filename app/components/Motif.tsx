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

/**
 * A frame that opens with the scroll — the home hero's cut, for any picture.
 *
 * The picture enters as an inset box with its contents pushed in slightly,
 * and as it travels up the window the box widens to its full edges while the
 * picture settles back to scale. Tied to scroll position rather than played
 * once, so it reads as the page being cut open by the reader's own hand.
 *
 * `inset` is the closed box as [vertical %, horizontal %]. Progress runs from
 * the frame's top edge meeting the bottom of the window (closed) to it
 * reaching `end` of the way down (open). Under reduced motion it renders open.
 */
export function ScrollFrame({
  children,
  className,
  style,
  inset = [10, 14],
  zoom = 0.14,
  end = 0.2,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  inset?: [number, number];
  zoom?: number;
  end?: number;
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.style.setProperty("--f", "1");
      return;
    }

    const write = () => {
      const vh = window.innerHeight;
      const top = el.getBoundingClientRect().top;
      const p = Math.min(1, Math.max(0, (vh - top) / (vh * (1 - end))));
      // Ease out: most of the opening happens early, then it settles.
      el.style.setProperty("--f", (1 - Math.pow(1 - p, 3)).toFixed(4));
    };

    // One rect read per scroll per frame on the page — cheap enough that
    // gating it behind an observer only added a way for it to miss a frame.
    window.addEventListener("scroll", write, { passive: true });
    window.addEventListener("resize", write);
    write();

    return () => {
      window.removeEventListener("scroll", write);
      window.removeEventListener("resize", write);
    };
  }, [end]);

  return (
    <div
      ref={ref}
      className={`ps-sframe ${className ?? ""}`}
      style={
        {
          ...style,
          "--fy": `${inset[0]}%`,
          "--fx": `${inset[1]}%`,
          "--z": zoom,
        } as CSSProperties
      }
    >
      <div className="ps-sframe-in">{children}</div>
    </div>
  );
}

/**
 * A picture that splits open from its centre line — maisonauge.com's reveal.
 *
 * Two motions on different clocks, which is what makes it read as a cut and
 * not a fade:
 *   - the CLIP plays once: the frame arrives as a vertical hairline and opens
 *     outward to both edges when it is well into the window
 *   - the PICTURE is tied to the scroll: it starts pushed in and settles to
 *     scale as the frame travels up, so it keeps moving after the cut
 *
 * `delay` staggers the cut in a row of frames. Under reduced motion or
 * without scripting it renders open and at scale.
 */
export function SplitFrame({
  children,
  overlay,
  className,
  style,
  zoom = 0.2,
  delay = 0,
  at = 0.85,
}: {
  children: ReactNode;
  /**
   * Drawn over the picture, carrying the same settle, but OUTSIDE the clip —
   * for markers whose cards have to be free to reach past the frame's edge.
   */
  overlay?: ReactNode;
  className?: string;
  style?: CSSProperties;
  zoom?: number;
  delay?: number;
  /** How far down the window the frame's top must rise before it opens. */
  at?: number;
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.setAttribute("data-open", "");
      el.style.setProperty("--s", "1");
      return;
    }

    const write = () => {
      const vh = window.innerHeight;
      const r = el.getBoundingClientRect();
      if (r.top < vh * at && r.bottom > 0) el.setAttribute("data-open", "");
      const p = Math.min(1, Math.max(0, (vh - r.top) / (vh * 0.75)));
      el.style.setProperty("--s", p.toFixed(4));
    };

    window.addEventListener("scroll", write, { passive: true });
    window.addEventListener("resize", write);
    write();
    return () => {
      window.removeEventListener("scroll", write);
      window.removeEventListener("resize", write);
    };
  }, [at]);

  return (
    <div
      ref={ref}
      className={`ps-splitwrap ${className ?? ""}`}
      style={{ ...style, "--z": zoom, "--split-delay": `${delay}ms` } as CSSProperties}
    >
      <div className="ps-split">
        <div className="ps-split-in">{children}</div>
      </div>
      {overlay ? <div className="ps-split-over">{overlay}</div> : null}
    </div>
  );
}
