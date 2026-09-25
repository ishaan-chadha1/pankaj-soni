"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { money, type Product } from "@/lib/catalog";
import { useCart } from "../../CartProvider";

export default function Buy({ product }: { product: Product }) {
  const { add } = useCart();
  // Default to the 50 ml / mid size where there is one — the size a buyer
  // actually wants preselected, rather than the cheapest.
  // Preselect a mid size rather than the smallest — the one a buyer is most
  // likely to want, and the one that reads as the default in a size run.
  const initial =
    product.variants[Math.floor((product.variants.length - 1) / 2)]?.id ??
    product.variants[0].id;

  const [variantId, setVariantId] = useState(initial);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const variant = product.variants.find((v) => v.id === variantId)!;

  /*
   * On a phone the button scrolls away under the details and the notes, and
   * the page then has no way to buy until you scroll all the way back. A slim
   * bar takes over once the real button is off screen — and only then, so
   * the two are never on screen together.
   */
  const cta = useRef<HTMLDivElement | null>(null);
  const [barOn, setBarOn] = useState(false);
  // Portalled to <body>: this component sits inside reveal wrappers that
  // animate `transform`, and a transformed ancestor would pin a fixed bar to
  // itself instead of to the screen.
  const [host, setHost] = useState<HTMLElement | null>(null);
  // eslint-disable-next-line react-hooks/set-state-in-effect -- <body> only exists on the client
  useEffect(() => setHost(document.body), []);
  useEffect(() => {
    const el = cta.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      // Off screen ABOVE the fold only: before you have reached it, the bar
      // would be announcing a button that is about to arrive anyway.
      setBarOn(!e.isIntersecting && e.boundingClientRect.top < 0);
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const shades = product.variants.some((v) => v.swatch);

  /*
   * A capped run that has gone cannot be bought.
   *
   * The rail badges it and the campaign card disables its button, but the
   * product page itself was still handing a sold-out piece straight to the bag
   * — the one screen where someone actually decides to buy. Three surfaces read
   * the same flag now.
   */
  const onAdd = () => {
    if (product.soldOut) return;
    add(product.slug, variantId, qty);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div>
      <div className="flex items-baseline gap-4">
        <p className="ps-display text-[1.7rem]">
          {product.soldOut ? "Price on Request" : money(variant.price)}
        </p>
        {product.variants.length > 1 ? (
          <p className="ps-caps" style={{ fontSize: ".54rem", color: "var(--ps-faint)" }}>
            {variant.label}
            {variant.sub ? ` · ${variant.sub}` : ""}
          </p>
        ) : null}
      </div>

      {product.variants.length > 1 ? (
        <div className="mt-9">
          <p className="ps-caps mb-4" style={{ fontSize: ".56rem", color: "var(--ps-accent)" }}>
            {shades ? "Colour" : "Size"}
          </p>

          {shades ? (
            <div className="flex flex-wrap gap-3">
              {product.variants.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  aria-pressed={v.id === variantId}
                  aria-label={v.label}
                  onClick={() => setVariantId(v.id)}
                  className="group flex flex-col items-center gap-2"
                >
                  <span
                    className="block h-11 w-11 rounded-full transition-transform ps-t-base"
                    style={{
                      background: v.swatch,
                      outline: v.id === variantId ? "1px solid var(--ps-accent)" : "1px solid var(--ps-line)",
                      outlineOffset: 3,
                      transform: v.id === variantId ? "scale(1.06)" : undefined,
                    }}
                  />
                  <span
                    className="ps-caps"
                    style={{
                      fontSize: ".5rem",
                      color: v.id === variantId ? "var(--ps-text)" : "var(--ps-faint)",
                    }}
                  >
                    {v.label.split(" ")[0]}
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 sm:gap-2.5">
              {product.variants.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  aria-pressed={v.id === variantId}
                  onClick={() => setVariantId(v.id)}
                  className="ps-chip"
                >
                  {v.label}
                </button>
              ))}
            </div>
          )}

          {shades ? (
            <p className="mt-4 text-[.8rem] font-light" style={{ color: "var(--ps-muted)" }}>
              {variant.label} — {variant.sub}
            </p>
          ) : null}
        </div>
      ) : null}

      <div ref={cta} className="mt-10 flex items-stretch gap-3">
        <div className="flex items-center" style={{ border: "1px solid var(--ps-line-strong)" }}>
          <button
            type="button"
            aria-label="Decrease quantity"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="ps-qty px-4 py-3 leading-none transition-opacity hover:opacity-60"
          >
            −
          </button>
          <span className="min-w-[30px] text-center text-[.8rem]">{qty}</span>
          <button
            type="button"
            aria-label="Increase quantity"
            onClick={() => setQty((q) => Math.min(10, q + 1))}
            className="ps-qty px-4 py-3 leading-none transition-opacity hover:opacity-60"
          >
            +
          </button>
        </div>

        <button
          type="button"
          onClick={onAdd}
          disabled={product.soldOut}
          className="ps-btn ps-btn-solid flex-1"
        >
          <span>
            {product.soldOut ? "Sold Out" : added ? "Added to Bag" : "Add to Bag"}
          </span>
        </button>
      </div>

      {product.soldOut ? (
        <p className="mt-4 text-[.8rem] font-light leading-relaxed" style={{ color: "var(--ps-muted)" }}>
          This run is complete. The house cuts a capped number and does not
          repeat them — a consultant can tell you what is closest, or take a
          commission.
        </p>
      ) : (
        <button type="button" className="ps-btn mt-3 w-full">
          <span>Add Engraving — Complimentary</span>
        </button>
      )}

      {host
        ? createPortal(
            <div className="ps-buybar" data-on={barOn} aria-hidden={!barOn} inert={!barOn}>
              <div className="min-w-0 flex-1">
                <p className="ps-display truncate text-[1rem] leading-tight">{product.name}</p>
                <p className="mt-0.5 text-[.74rem]" style={{ color: "var(--ps-muted)" }}>
                  {product.soldOut ? "Price on Request" : money(variant.price)}
                  {product.variants.length > 1 ? ` · ${variant.label}` : ""}
                </p>
              </div>
              <button
                type="button"
                onClick={onAdd}
                disabled={product.soldOut}
                className="ps-btn ps-btn-solid shrink-0 !px-6 !py-3"
              >
                <span>{product.soldOut ? "Sold Out" : added ? "Added" : "Add to Bag"}</span>
              </button>
            </div>,
            host
          )
        : null}

      <ul className="mt-9 space-y-2.5 text-[.78rem] font-light" style={{ color: "var(--ps-muted)" }}>
        <li className="flex gap-3">
          <span style={{ color: "var(--ps-accent)" }}>—</span>
          Complimentary express delivery, dispatched within 24 hours
        </li>
        <li className="flex gap-3">
          <span style={{ color: "var(--ps-accent)" }}>—</span>
          Presented in signature lacquer with grosgrain ribbon
        </li>
        <li className="flex gap-3">
          <span style={{ color: "var(--ps-accent)" }}>—</span>
          Complimentary returns within 30 days
        </li>
      </ul>
    </div>
  );
}
