"use client";

import { createElement, useCallback, useEffect, useRef, useState } from "react";

/**
 * Per-glyph rise for hero headlines.
 *
 * Words are kept whole in their own inline-block wrappers so the browser can
 * still break lines normally — splitting a heading into loose characters
 * destroys wrapping and reflows mid-word on narrow screens.
 *
 * The text stays intact for assistive tech: the split spans are aria-hidden and
 * the original string is exposed once via a visually-hidden node, so a screen
 * reader hears "Dressed for the hours that follow", not thirty letters.
 */
export default function SplitText({
  text,
  className,
  delay = 0,
  as = "div",
}: {
  text: string;
  className?: string;
  delay?: number;
  as?: "h1" | "h2" | "div";
}) {
  const ref = useRef<HTMLElement | null>(null);
  const setRef = useCallback((node: HTMLElement | null) => {
    ref.current = node;
  }, []);
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

  const words = text.split(" ");
  let i = 0;

  return createElement(
    as,
    // The rule treats a ref handed to any function call as a render-time read.
    // False positive: createElement is the element factory, and React invokes
    // the callback after commit rather than during render.
    // eslint-disable-next-line react-hooks/refs
    {
      ref: setRef,
      className: `ps-split ${className ?? ""}`,
      "data-shown": shown,
      style: { ["--d" as string]: `${delay}ms` },
    },
    <>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((w, wi) => (
          <span key={wi} style={{ display: "inline-block", whiteSpace: "nowrap" }}>
            {[...w].map((ch) => (
              <span key={i} data-ch style={{ ["--i" as string]: i++ }}>
                {ch}
              </span>
            ))}
            {wi < words.length - 1 ? (
              <span data-ch style={{ ["--i" as string]: i++ }}>
                {" "}
              </span>
            ) : null}
          </span>
        ))}
      </span>
    </>
  );
}
