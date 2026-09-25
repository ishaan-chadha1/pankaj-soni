"use client";

import Link from "next/link";
import { useState } from "react";
import { money, type Product } from "@/lib/catalog";
import { blurForImage, setForImage } from "@/lib/photos";
import { useCart } from "../CartProvider";

export default function ProductCard({
  product,
  priority = false,
  index = 0,
}: {
  product: Product;
  priority?: boolean;
  index?: number;
}) {
  const { add } = useCart();
  const [busy, setBusy] = useState(false);

  // Single-variant products can go straight into the bag; anything with a real
  // choice to make (size, shade) — or a run that has gone — has to go through
  // the product page.
  const oneVariant = product.variants.length === 1 && !product.soldOut;

  const quickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setBusy(true);
    add(product.slug, product.variants[0].id, 1);
    window.setTimeout(() => setBusy(false), 700);
  };

  return (
    <Link
      href={`/p/${product.slug}`}
      className="group block"
      style={{ transitionDelay: `${index * 40}ms` }}
    >
      <div
        className="ps-media ps-zoom ps-swap relative aspect-[3/4]"
        style={{ backgroundImage: blurForImage(product.image) }}
      >
        <img
          src={product.image}
          srcSet={setForImage(product.image)}
          sizes="(max-width: 1023px) 50vw, 33vw"
          alt={product.name}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          className="h-full w-full object-cover"
        />
        <img
          src={product.hover}
          srcSet={setForImage(product.hover)}
          sizes="(max-width: 1023px) 50vw, 33vw"
          alt=""
          aria-hidden
          loading="lazy"
          decoding="async"
          className="ps-swap-b h-full w-full object-cover"
        />

        {product.badge ? (
          <span
            className="ps-caps absolute left-4 top-4 z-[2] px-2.5 py-1"
            style={{
              background: "color-mix(in srgb, var(--ps-invert-bg) 78%, transparent)",
              backdropFilter: "blur(6px)",
              color: "var(--ps-accent)",
              fontSize: ".58rem",
            }}
          >
            {product.badge}
          </span>
        ) : null}

        {/* Quick-add slides up from the bottom edge of the plate. */}
        <div
          className="absolute inset-x-0 bottom-0 z-[2] translate-y-full opacity-0 transition-all ps-t-slow group-hover:translate-y-0 group-hover:opacity-100"
          style={{ transitionTimingFunction: "cubic-bezier(.16,1,.3,1)" }}
        >
          {oneVariant ? (
            <button
              type="button"
              onClick={quickAdd}
              className="ps-caps w-full py-4 text-center"
              style={{ background: "var(--ps-surface)", color: "var(--ps-text)" }}
            >
              {busy ? "Added" : "Add to Bag"}
            </button>
          ) : (
            <span
              className="ps-caps block w-full py-4 text-center"
              style={{ background: "var(--ps-surface)", color: "var(--ps-text)" }}
            >
              {product.soldOut ? "Sold Out" : "Select Options"}
            </span>
          )}
        </div>
      </div>

      <div className="pt-5">
        <p className="ps-caps" style={{ color: "var(--ps-faint)", fontSize: ".58rem" }}>
          {product.line}
        </p>
        <h3 className="ps-display mt-2 text-[1.35rem] leading-tight">{product.name}</h3>
        <p className="mt-1.5 text-[.78rem] font-light" style={{ color: "var(--ps-muted)" }}>
          {product.kicker}
        </p>
        <p className="mt-3 text-[.82rem] tracking-wide">{money(product.price)}</p>
      </div>
    </Link>
  );
}
