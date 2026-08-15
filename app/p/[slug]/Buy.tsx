"use client";

import { useState } from "react";
import { money, type Product } from "@/lib/catalog";
import { useCart } from "../../CartProvider";

export default function Buy({ product }: { product: Product }) {
  const { add } = useCart();
  // Default to the 50 ml / mid size where there is one — the size a buyer
  // actually wants preselected, rather than the cheapest.
  const initial =
    product.variants.find((v) => v.id === "50")?.id ?? product.variants[0].id;

  const [variantId, setVariantId] = useState(initial);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const variant = product.variants.find((v) => v.id === variantId)!;
  const shades = product.variants.some((v) => v.swatch);

  const onAdd = () => {
    add(product.slug, variantId, qty);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div>
      <div className="flex items-baseline gap-4">
        <p className="ps-display text-[1.7rem]">{money(variant.price)}</p>
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
            {shades ? "Shade" : product.category === "fragrance" ? "Size" : "Size"}
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
                    className="block h-11 w-11 rounded-full transition-transform duration-500"
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
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
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

      <div className="mt-10 flex items-stretch gap-3">
        <div className="flex items-center" style={{ border: "1px solid var(--ps-line-strong)" }}>
          <button
            type="button"
            aria-label="Decrease quantity"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="px-4 py-3 leading-none transition-opacity hover:opacity-60"
          >
            −
          </button>
          <span className="min-w-[30px] text-center text-[.8rem]">{qty}</span>
          <button
            type="button"
            aria-label="Increase quantity"
            onClick={() => setQty((q) => Math.min(10, q + 1))}
            className="px-4 py-3 leading-none transition-opacity hover:opacity-60"
          >
            +
          </button>
        </div>

        <button type="button" onClick={onAdd} className="ps-btn ps-btn-solid flex-1">
          <span>{added ? "Added to Bag" : "Add to Bag"}</span>
        </button>
      </div>

      <button type="button" className="ps-btn mt-3 w-full">
        <span>Add Engraving — Complimentary</span>
      </button>

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
