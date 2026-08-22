"use client";

import Link from "next/link";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { LOOKS, LOOK_ASPECT, type Hotspot, type Look } from "@/lib/looks";
import { bySlug, money } from "@/lib/catalog";
import { useCart } from "../CartProvider";

/**
 * The shoppable campaign — three looks stacked, every garment marked.
 *
 * On scroll-in the leader lines draw once, then retract to quiet dots a couple
 * of seconds later. The point is to teach where the markers are without leaving
 * six labels permanently competing with the photograph; hovering or focusing a
 * dot brings its line back.
 *
 * The frame keeps the source aspect rather than cropping to fill: hotspots are
 * percentages of the image, so an object-cover crop would walk every marker off
 * its garment the moment the viewport changed shape.
 */
export default function LookBook() {
  // One card open across the whole page, keyed `${lookId}:${slug}`.
  const [open, setOpen] = useState<string | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  /*
   * Ken-burns, driven continuously rather than triggered.
   *
   * One rAF loop writes a --p per frame (-1 above the fold, +1 below), and CSS
   * multiplies it by that look's drift. A single shared loop rather than one
   * per frame: three independent scroll listeners on the same page is three
   * layout reads a frame for no benefit.
   */
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const tick = () => {
      raf = 0;
      const vh = window.innerHeight;
      document.querySelectorAll<HTMLElement>(".ps-look").forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.bottom < -200 || r.top > vh + 200) return;
        const p = (r.top + r.height / 2 - vh / 2) / vh;
        el.style.setProperty("--p", Math.max(-1.2, Math.min(1.2, p)).toFixed(3));
      });
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };
    tick();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <section aria-label="Autumn campaign — shop the looks">
      {LOOKS.map((look, i) => (
        <LookFrame key={look.id} look={look} index={i} open={open} setOpen={setOpen} />
      ))}
    </section>
  );
}


/**
 * Maps a point on the SOURCE image to a point on the rendered frame.
 *
 * The frame uses `object-fit: cover`, and on phones it crops to a portrait
 * aspect so the model is actually legible. Cover scales the image to the larger
 * of the two ratios and centres the overflow, so a raw percentage stops
 * pointing at the garment the moment the frame's aspect differs from the
 * source's. This undoes that: it is what lets the markers survive any crop
 * instead of having to be switched off.
 */
function makeCropMap(frameW: number, frameH: number, srcW: number, srcH: number) {
  const scale = Math.max(frameW / srcW, frameH / srcH);
  const renderedW = srcW * scale;
  const renderedH = srcH * scale;
  const offX = (renderedW - frameW) / 2;
  const offY = (renderedH - frameH) / 2;

  return (xPct: number, yPct: number) => {
    const px = (xPct / 100) * renderedW - offX;
    const py = (yPct / 100) * renderedH - offY;
    return {
      left: (px / frameW) * 100,
      top: (py / frameH) * 100,
      // A marker cropped out of view must not be left floating at the edge.
      visible: px >= 0 && px <= frameW && py >= 0 && py <= frameH,
    };
  };
}

const [SRC_W, SRC_H] = LOOK_ASPECT.split("/").map((n) => Number(n.trim()));

/* ────────────────────────────────────────────────────────────── */

function LookFrame({
  look,
  index,
  open,
  setOpen,
}: {
  look: Look;
  index: number;
  open: string | null;
  setOpen: (v: string | null) => void;
}) {
  const frame = useRef<HTMLDivElement | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [settled, setSettled] = useState(false);
  const [box, setBox] = useState({ w: 0, h: 0 });

  // Remeasure on every resize: the crop, and therefore every marker position,
  // depends on the frame's current aspect.
  useLayoutEffect(() => {
    const el = frame.current;
    if (!el) return;
    const read = () => {
      const r = el.getBoundingClientRect();
      setBox({ w: r.width, h: r.height });
    };
    read();
    const ro = new ResizeObserver(read);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const map = makeCropMap(box.w || 1, box.h || 1, SRC_W, SRC_H);
  // Below this the frame is portrait and there is no room for leader lines.
  const narrow = box.w > 0 && box.w / box.h < 1.4;

  useEffect(() => {
    const el = frame.current;
    if (!el) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let settle: number | undefined;

    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        setRevealed(true);
        // Draw, hold, then retract — the photograph gets its frame back.
        if (!reduce) settle = window.setTimeout(() => setSettled(true), 2600);
      },
      { rootMargin: "-12% 0px", threshold: 0.01 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      if (settle) window.clearTimeout(settle);
    };
  }, []);

  // Clamp after layout, and again whenever the frame is resized: arm lengths
  // are relative to frame width, so every breakpoint needs a fresh pass.
  useLayoutEffect(() => {
    const el = frame.current;
    if (!el) return;
    const run = () => clampArms(el);
    run();
    const ro = new ResizeObserver(run);
    ro.observe(el);
    // Webfonts change label width after first paint.
    document.fonts?.ready.then(run).catch(() => {});
    return () => ro.disconnect();
  }, []);

  // Clicking outside any marker in this frame closes its card.
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (!frame.current?.contains(e.target as Node)) return;
      if (!(e.target as HTMLElement).closest(".ps-hot")) setOpen(null);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [setOpen]);

  const products = look.hotspots
    .map((h) => bySlug(h.slug))
    .filter((p): p is NonNullable<typeof p> => !!p);

  return (
    <article className="mx-auto mt-14 max-w-[1560px] px-5 first:mt-8 sm:px-8">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="ps-caps" style={{ color: "var(--ps-accent)" }}>
            {look.eyebrow}
          </p>
          <h3 className="ps-display mt-2.5 text-[1.9rem] leading-none sm:text-[2.6rem]">
            {look.title}
          </h3>
        </div>
        {index === 0 ? (
          <p className="ps-caps" style={{ fontSize: ".54rem", color: "var(--ps-faint)" }}>
            Select a marker to shop the piece
          </p>
        ) : null}
      </div>

      <div
        ref={frame}
        className="ps-look relative w-full"
        data-reveal={revealed}
        data-settled={settled}
        // Lets the other markers stand down while one card is open.
        data-focus={look.hotspots.some((h) => open === `${look.id}:${h.slug}`)}
        // The aspect travels as a custom property, not an inline aspect-ratio:
        // an inline value outranks the media query that crops to portrait on
        // phones, and the frame stayed 142px tall.
        style={{
          ["--look-aspect" as string]: look.aspect ?? LOOK_ASPECT,
          ["--drift" as string]: `${look.drift ?? -34}px`,
          background: "var(--ps-bg-alt)",
        }}
      >
        <img
          src={look.image}
          alt={look.alt}
          loading={index === 0 ? "eager" : "lazy"}
          fetchPriority={index === 0 ? "high" : "auto"}
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
        />

        {look.hotspots.map((h, i) => {
          const key = `${look.id}:${h.slug}`;
          return (
            <Marker
              key={key}
              hot={h}
              index={i}
              pos={map(h.x, h.y)}
              frameW={box.w}
              narrow={narrow}
              open={open === key}
              onToggle={() => setOpen(open === key ? null : key)}
            />
          );
        })}
      </div>

      {/* The dots are an enhancement; this row is the real, reachable content —
          it is the keyboard and screen-reader path, and the whole interface on
          a phone where an 11px target is not a target. */}
      <ul className="ps-norail mt-5 flex gap-3 overflow-x-auto pb-1">
        {products.map((p) => (
          <li key={p.slug} className="shrink-0">
            <Link
              href={`/p/${p.slug}`}
              className="group flex w-[210px] items-center gap-3 p-2 transition-colors duration-500"
              style={{ border: "1px solid var(--ps-line)" }}
            >
              <span className="ps-media h-[54px] w-[42px] shrink-0">
                <img src={p.image} alt="" loading="lazy" decoding="async" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="ps-display block truncate text-[.94rem] leading-tight">
                  {p.name}
                </span>
                <span className="mt-1 block text-[.72rem]" style={{ color: "var(--ps-muted)" }}>
                  {money(p.price)}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </article>
  );
}

/* ────────────────────────────────────────────────────────────── */

/**
 * Leader direction and tilt. Length is NOT decided here.
 *
 * An earlier version estimated label width from character count and clamped the
 * line arithmetically. It was wrong by a consistent ~27% of frame width — the
 * rotation and the label's own translate compound in a way a character estimate
 * does not model — and eight of seventeen labels still hung outside the frame.
 * `clampArms` below measures the rendered label instead.
 */
function leader(hot: Hotspot) {
  const toRight = hot.x >= 50;
  // Near the top or bottom the line has to tilt back toward the middle.
  const tilt = hot.y < 22 ? 11 : hot.y > 82 ? -11 : hot.y < 50 ? -7 : 7;
  return { angle: toRight ? tilt : 180 - tilt, toRight };
}

/**
 * Shortens every leader until its label sits inside the frame.
 *
 * Runs after layout and on resize. The label travels along the arm, so pulling
 * the arm in by the overflow (projected onto the arm's own axis) removes it;
 * a second pass catches the rare case where shortening changes which edge is
 * closest.
 */
function clampArms(frame: HTMLElement) {
  const fr = frame.getBoundingClientRect();
  if (!fr.width) return;
  const PAD = 8;

  // Seed every arm from the measured frame width. An earlier version expressed
  // this in `cqw`; the unit did not resolve here, `width` fell back to auto and
  // the leaders grew to nearly half the frame.
  frame.querySelectorAll<HTMLElement>(".ps-hot").forEach((hot) => {
    const pct = Number(hot.dataset.len ?? 13);
    hot.style.setProperty("--arm", `${Math.round((fr.width * pct) / 100)}px`);
  });

  for (let pass = 0; pass < 2; pass++) {
    let settled = true;

    frame.querySelectorAll<HTMLElement>(".ps-hot").forEach((hot) => {
      const line = hot.querySelector<HTMLElement>(".ps-hot-line");
      const label = hot.querySelector<HTMLElement>(".ps-hot-label");
      if (!line || !label) return;

      const lb = label.getBoundingClientRect();
      const over = Math.max(
        fr.left + PAD - lb.left,
        lb.right - (fr.right - PAD),
        fr.top + PAD - lb.top,
        lb.bottom - (fr.bottom - PAD),
        0
      );
      if (over <= 0.5) return;

      const angle = Number(hot.dataset.angle ?? 0);
      // Project the overflow back onto the arm axis; guard the near-vertical case.
      const axis = Math.max(0.25, Math.abs(Math.cos((angle * Math.PI) / 180)));
      // offsetWidth, not getBoundingClientRect: the line rests at scaleX(0)
      // until it is revealed, and the rect reports the transformed box — which
      // reads 0 and collapses every arm to the floor.
      const current = line.offsetWidth;
      const next = Math.max(56, current - over / axis);

      hot.style.setProperty("--arm", `${next}px`);
      settled = false;
    });

    if (settled) break;
  }
}

function Marker({
  hot,
  index,
  pos,
  frameW,
  narrow,
  open,
  onToggle,
}: {
  hot: Hotspot;
  index: number;
  pos: { left: number; top: number; visible: boolean };
  frameW: number;
  narrow: boolean;
  open: boolean;
  onToggle: () => void;
}) {
  const product = bySlug(hot.slug);
  const { add } = useCart();
  const [added, setAdded] = useState(false);
  const onAdd = useCallback(() => {
    if (!product) return;
    add(product.slug, product.variants[0].id, 1);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1600);
  }, [add, product]);

  const { angle, toRight } = leader(hot);
  // Base length as a % of frame width; clampArms resolves it to px after layout
  // and pulls it in if the label would land outside.
  const basePct = hot.len ?? 13;

  /*
   * Which side of the line's end the card opens on.
   *
   * Decided from the MEASURED leader, not the authored length: clampArms
   * shortens arms after layout, so a render-time estimate put cards where the
   * line did not actually finish. Flipped rather than shifted when it will not
   * fit — sliding the card sideways to rescue it left the connector pip 200px
   * from the leader, pointing at nothing.
   */
  const [flip, setFlip] = useState(false);

  // A fresh open re-decides the side. Adjusted during render rather than in an
  // effect, which would cost a second pass every time a card is dismissed.
  const [lastOpen, setLastOpen] = useState(open);
  if (lastOpen !== open) {
    setLastOpen(open);
    if (!open) setFlip(false);
  }

  const cardOpensRight = flip ? !toRight : toRight;

  /*
   * Nudge the opened card back inside the frame.
   *
   * The nudge goes on the ANCHOR's transform, not a margin on the card. The
   * anchor places itself with translate(-100%, -50%) — percentages of its own
   * box — so a margin on the card resized that box and moved the goalposts with
   * every correction. A translate appended after the counter-rotation cancels
   * out against the arm's rotation, which makes it plain screen-space pixels.
   */
  const anchorRef = useRef<HTMLSpanElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const anchorBase = `rotate(${-angle}deg) translate(${cardOpensRight ? "0" : "-100%"}, -50%)`;

  useLayoutEffect(() => {
    const anchor = anchorRef.current;
    const card = cardRef.current;
    if (!open || narrow || !anchor || !card) return;

    anchor.style.transform = anchorBase;
    const frame = anchor.closest<HTMLElement>(".ps-look");
    if (!frame) return;
    const fr = frame.getBoundingClientRect();
    const c = card.getBoundingClientRect();
    const PAD = 12;

    // Horizontal: flip to the other side of the line's end, keeping the pip on it.
    const overflowsX = c.left < fr.left + PAD || c.right > fr.right - PAD;
    if (overflowsX && !flip) {
      setFlip(true);
      return;
    }

    // Vertical: a straight nudge. There is no other side to flip to.
    const dy =
      c.top < fr.top + PAD
        ? fr.top + PAD - c.top
        : c.bottom > fr.bottom - PAD
          ? fr.bottom - PAD - c.bottom
          : 0;
    if (dy) anchor.style.transform = `${anchorBase} translate(0px, ${Math.round(dy)}px)`;
  }, [open, narrow, frameW, anchorBase, flip]);

  // Every hook above runs unconditionally; only now is it safe to bail.
  if (!product || !pos.visible) return null;


  const cardBody = (
      <div
        ref={cardRef}
        className="ps-hot-card"
        // The flag rides on the card, not the marker: once portalled the card
        // is no longer a descendant of .ps-hot, so a descendant selector would
        // never match.
        data-narrow={narrow}
        // Grow out of whichever edge meets the leader, and put the connecting
        // pip on that same edge.
        data-side={cardOpensRight ? "right" : "left"}
        style={
          narrow
            ? undefined
            : {
                ["--card-origin" as string]: cardOpensRight ? "left center" : "right center",
                ["--unfurl-from" as string]: cardOpensRight ? "-12px" : "12px",
              }
        }
      >
        <Link href={`/p/${product.slug}`} className="flex gap-4">
          <span className="ps-media h-[96px] w-[74px] shrink-0">
            <img src={product.image} alt="" loading="lazy" decoding="async" />
          </span>
          <span className="flex min-w-0 flex-1 flex-col">
            <span className="ps-caps" style={{ fontSize: ".5rem", color: "var(--ps-accent)" }}>
              {product.line}
            </span>
            <span className="ps-display mt-1 block text-[1.05rem] leading-tight">
              {product.name}
            </span>
            <span className="mt-1 text-[.72rem]" style={{ color: "var(--ps-muted)" }}>
              {product.kicker}
            </span>
            <span className="mt-auto pt-2 text-[.8rem]">{money(product.price)}</span>
          </span>
        </Link>

        <div className="mt-3 flex items-center gap-3">
          {/* Straight into the bag: a campaign that needs a page change to buy
              from is a lookbook, not a storefront. */}
          {/* Taller on the sheet: 44px is the floor for a thumb, and the compact
              desktop padding came in at 39. Set here rather than in CSS because
              the utility class carries !important. */}
          <button
            type="button"
            onClick={onAdd}
            className={`ps-btn ps-btn-solid flex-1 !px-3 ${narrow ? "!py-4" : "!py-2.5"}`}
          >
            <span>{added ? "Added" : "Add to Bag"}</span>
          </button>
          <Link
            href={`/p/${product.slug}`}
            className="ps-caps ps-link ps-link-on shrink-0"
            style={{ fontSize: ".54rem" }}
          >
            Details
          </Link>
        </div>
      </div>
  );

  /*
   * Narrow frames pin the card to the viewport and portal it to <body>:
   * `position: fixed` resolves against the nearest transformed ancestor, and
   * <main> carries a transform from the page-entry animation, which threw the
   * sheet thousands of pixels down the document.
   */
  const sheet =
    narrow && typeof document !== "undefined"
      ? createPortal(cardBody, document.body)
      : null;

  return (
    <div
      className="ps-hot"
      style={{
        left: `${pos.left}%`,
        top: `${pos.top}%`,
        ["--hot-delay" as string]: `${420 + index * 120}ms`,
        ["--arm" as string]: "0px",
      }}
      data-open={open}
      data-angle={angle}
      data-len={basePct}
      data-narrow={narrow}
    >
      <span className="ps-hot-arm" style={{ transform: `rotate(${angle}deg)` }}>
        <span className="ps-hot-line" />
        <span
          className="ps-hot-label ps-caps"
          style={{
            left: "var(--arm)",
            transform: `rotate(${-angle}deg) translate(${toRight ? "0" : "-100%"}, -50%)`,
          }}
        >
          {hot.label}
        </span>

        {/* Sits at the line's end and counter-rotates so the card itself stays
            upright. Inside the arm is what keeps it pinned to the end however
            long clampArms decides the leader should be. */}
        {open && !narrow ? (
          <span
            ref={anchorRef}
            className="ps-hot-anchor"
            style={{ left: "var(--arm)", transform: anchorBase }}
          >
            {cardBody}
          </span>
        ) : null}
      </span>

      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-label={`${product.name}, ${money(product.price)} — open details`}
        className="ps-hot-dot"
      />

      {open ? sheet : null}
    </div>
  );
}
