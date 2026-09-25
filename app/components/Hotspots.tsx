"use client";

import Link from "next/link";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { bySlug, money } from "@/lib/catalog";
import { useCart } from "../CartProvider";

/**
 * Shoppable markers — a dot on a garment that draws a leader, names the piece,
 * and opens its card with Add to Bag.
 *
 * COORDINATES ARE PERCENTAGES OF THE SOURCE IMAGE, placed against a 10% grid
 * laid over each plate (see LookRows). ShopFrame maps them through whatever
 * object-fit crop the frame applies — including an off-centre object-position
 * — so a dot stays on its garment at any aspect.
 */

export type Hotspot = {
  /** Product slug — every marker resolves to a real listing. */
  slug: string;
  label: string;
  /** % of source width / height. */
  x: number;
  y: number;
  /** Leader length as a % of frame width; shortened after layout if the
   *  label would fall outside the frame. */
  len?: number;
  /** Which way the leader runs. Defaults to away from the nearer edge of the
   *  PICTURE; set it when the picture sits near an edge of the SCREEN and the
   *  card needs the room on the other side. */
  dir?: "left" | "right";
};

/** One card open across the whole page. */
const OPEN_EVENT = "ps-shop-open";

/**
 * The marker layer for one picture. Sits over the picture (inside
 * SplitFrame's overlay, so it shares its settle) and is responsible for the
 * crop map, the draw-then-retract of the leaders, and which card is open.
 */
export function ShopFrame({
  id,
  hotspots,
  src = [810, 1080],
  focus = "50% 50%",
}: {
  id: string;
  hotspots: Hotspot[];
  /** Source pixel size. */
  src?: [number, number];
  /** The picture's object-position, so the map undoes the same crop. */
  focus?: string;
}) {
  const frame = useRef<HTMLDivElement | null>(null);
  const [box, setBox] = useState({ w: 0, h: 0 });
  const [open, setOpen] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [settled, setSettled] = useState(false);
  const [narrow, setNarrow] = useState(false);

  useLayoutEffect(() => {
    const el = frame.current;
    if (!el) return;
    const read = () => {
      setBox({ w: el.offsetWidth, h: el.offsetHeight });
      // A phone gets the card as a sheet; a narrow frame on a desktop does
      // not, because the layer is unclipped and the card can reach past it.
      setNarrow(window.innerWidth < 768);
    };
    read();
    const ro = new ResizeObserver(read);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Leaders draw once the picture is well into the window, hold, then retract
  // to dots so the photograph gets its frame back.
  useEffect(() => {
    const el = frame.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let settle: number | undefined;
    const check = () => {
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight * 0.7 && r.bottom > 0) {
        window.removeEventListener("scroll", check);
        setRevealed(true);
        if (!reduce) settle = window.setTimeout(() => setSettled(true), 2800);
      }
    };
    window.addEventListener("scroll", check, { passive: true });
    check();
    return () => {
      window.removeEventListener("scroll", check);
      if (settle) window.clearTimeout(settle);
    };
  }, []);

  useLayoutEffect(() => {
    const el = frame.current;
    if (!el) return;
    const run = () => clampArms(el);
    run();
    const ro = new ResizeObserver(run);
    ro.observe(el);
    document.fonts?.ready.then(run).catch(() => {});
    return () => ro.disconnect();
  }, []);

  // One card open across the page: opening here closes every other frame's.
  useEffect(() => {
    const onOther = (e: Event) => {
      if ((e as CustomEvent<string>).detail !== id) setOpen(null);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
    };
    const onDown = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (!t.closest(".ps-hot") && !t.closest(".ps-hot-card")) setOpen(null);
    };
    window.addEventListener(OPEN_EVENT, onOther);
    window.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onDown);
    return () => {
      window.removeEventListener(OPEN_EVENT, onOther);
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onDown);
    };
  }, [id]);

  const [fx, fy] = focus.split(" ").map((v) => parseFloat(v) / 100);
  const map = cropMap(box.w || 1, box.h || 1, src[0], src[1], fx, fy);

  return (
    <div
      ref={frame}
      className="ps-shoppable"
      data-reveal={revealed}
      data-settled={settled}
      data-focus={open !== null}
    >
      {hotspots.map((h, i) => {
        const key = `${id}:${h.slug}`;
        return (
          <Marker
            key={key}
            hot={h}
            index={i}
            pos={map(h.x, h.y)}
            frameW={box.w}
            narrow={narrow}
            open={open === key}
            onToggle={() => {
              const next = open === key ? null : key;
              setOpen(next);
              if (next) window.dispatchEvent(new CustomEvent(OPEN_EVENT, { detail: id }));
            }}
          />
        );
      })}
    </div>
  );
}

/**
 * Maps a point on the SOURCE image to a point on a frame that shows it with
 * `object-fit: cover` at object-position (fx, fy). Cover scales to the larger
 * ratio; the overflow is split by the object-position, not always centred.
 */
function cropMap(frameW: number, frameH: number, srcW: number, srcH: number, fx: number, fy: number) {
  const scale = Math.max(frameW / srcW, frameH / srcH);
  const renderedW = srcW * scale;
  const renderedH = srcH * scale;
  const offX = (renderedW - frameW) * fx;
  const offY = (renderedH - frameH) * fy;

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
  const toRight = hot.dir ? hot.dir === "right" : hot.x >= 50;
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
export function clampArms(frame: HTMLElement) {
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

export function Marker({
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
    if (!product || product.soldOut) return;
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
   * The nudge is a custom property on the CARD, in screen pixels, not a
   * translate appended to the anchor. The anchor is rotated, so anything added
   * to its transform is rotated with it — and for a leader pointing west that
   * is close to a 180deg flip, which turns "move down 40px" into "move up
   * 40px". The card sits in a net-unrotated frame (arm +N, anchor -N), so a
   * value set there means what it says. See `.ps-hot-anchor` in globals.css.
   */
  const anchorRef = useRef<HTMLSpanElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const anchorBase = `rotate(${-angle}deg)`;

  useLayoutEffect(() => {
    const anchor = anchorRef.current;
    const card = cardRef.current;
    if (!open || narrow || !anchor || !card) return;

    card.style.setProperty("--nudge-y", "0px");
    // Bounded by the window, not the frame: the marker layer is unclipped so a
    // card can reach past a narrow picture, and only the screen edge matters.
    // clientWidth, not innerWidth: the latter includes the scrollbar, and a
    // card measured against it ended 12px under the scrollbar. The margin is
    // generous because this runs while the card is still sliding in.
    const vw = document.documentElement.clientWidth;
    const fr = { left: 0, top: 0, right: vw, bottom: window.innerHeight };
    const c = card.getBoundingClientRect();
    const PAD = 28;

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
    if (dy) card.style.setProperty("--nudge-y", `${Math.round(dy)}px`);
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
            <span className="mt-auto pt-2 text-[.8rem]">
              {product.soldOut ? "Sold out" : money(product.price)}
            </span>
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
            disabled={product.soldOut}
            className={`ps-btn ps-btn-solid flex-1 !px-3 ${narrow ? "!py-4" : "!py-2.5"}`}
          >
            <span>
              {product.soldOut ? "Sold Out" : added ? "Added" : "Add to Bag"}
            </span>
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
