"use client";

import Link from "next/link";
import { useState } from "react";
import { money } from "@/lib/catalog";
import { useCart } from "../CartProvider";

const PROMOS: Record<string, number> = { ATELIER10: 0.1, MAISON: 0.15 };

export default function BagView() {
  const { lines, subtotal, count, setQty, remove, ready } = useCart();
  const [code, setCode] = useState("");
  const [applied, setApplied] = useState<{ code: string; rate: number } | null>(null);
  const [err, setErr] = useState("");
  const [gift, setGift] = useState(false);

  const discount = applied ? Math.round(subtotal * applied.rate) : 0;
  const shipping = subtotal > 250 || subtotal === 0 ? 0 : 25;
  const giftFee = gift ? 20 : 0;
  const tax = Math.round((subtotal - discount) * 0.08);
  const total = subtotal - discount + shipping + giftFee + tax;

  const applyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const key = code.trim().toUpperCase();
    if (PROMOS[key]) {
      setApplied({ code: key, rate: PROMOS[key] });
      setErr("");
    } else {
      setApplied(null);
      setErr("That code is not recognised.");
    }
  };

  // Nothing renders from localStorage until it has been read, or SSR and the
  // client disagree about an empty bag. The heading still ships, so the page is
  // never served with an empty document outline.
  if (!ready) {
    return (
      <div className="mx-auto min-h-[52svh] max-w-[1560px] px-5 pt-12 sm:px-8">
        <h1 className="ps-display text-[2.6rem] sm:text-[3.6rem]">Your Bag</h1>
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="flex min-h-[52svh] flex-col items-center justify-center px-6 text-center">
        <p className="ps-caps" style={{ color: "var(--ps-accent)" }}>
          Your Bag
        </p>
        <h1 className="ps-display mt-6 text-[2.6rem] sm:text-[3.6rem]">Nothing here yet</h1>
        <p className="mt-4 max-w-[38ch] text-[.92rem] font-light" style={{ color: "var(--ps-muted)" }}>
          The overcoat is where most clients begin — forty hours of hand-joining,
          and the piece the house is best known for.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link href="/p/double-face-overcoat" className="ps-btn ps-btn-solid">
            <span>The Overcoat</span>
          </Link>
          <Link href="/c/outerwear" className="ps-btn">
            <span>All Outerwear</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1560px] px-5 pb-28 pt-12 sm:px-8">
      <div className="flex flex-wrap items-baseline justify-between gap-4">
        <h1 className="ps-display text-[2.6rem] sm:text-[3.6rem]">Your Bag</h1>
        <p className="ps-caps" style={{ color: "var(--ps-faint)" }}>
          {count} {count === 1 ? "piece" : "pieces"}
        </p>
      </div>

      <div className="mt-12 grid gap-16 lg:grid-cols-[1.5fr_1fr] lg:gap-24">
        {/* lines */}
        <div>
          <ul>
            {lines.map((l) => (
              <li
                key={`${l.slug}-${l.variantId}`}
                className="flex gap-6 py-8 sm:gap-8"
                style={{ borderTop: "1px solid var(--ps-line)" }}
              >
                <Link href={`/p/${l.slug}`} className="ps-media ps-zoom h-[170px] w-[130px] shrink-0 sm:h-[210px] sm:w-[160px]">
                  <img src={l.product.image} alt={l.product.name} loading="lazy" decoding="async" />
                </Link>

                <div className="flex flex-1 flex-col">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="ps-caps" style={{ fontSize: ".54rem", color: "var(--ps-accent)" }}>
                        {l.product.line}
                      </p>
                      <Link href={`/p/${l.slug}`} className="ps-display mt-2 block text-[1.5rem] leading-tight">
                        {l.product.name}
                      </Link>
                      <p className="mt-2 text-[.8rem] font-light" style={{ color: "var(--ps-muted)" }}>
                        {l.variant.label}
                        {l.variant.sub ? ` · ${l.variant.sub}` : ""}
                      </p>
                      <p className="mt-1 text-[.75rem]" style={{ color: "var(--ps-faint)" }}>
                        {money(l.variant.price)} each
                      </p>
                    </div>
                    <p className="ps-display text-[1.3rem]">{money(l.variant.price * l.qty)}</p>
                  </div>

                  <div className="mt-auto flex items-center justify-between gap-4 pt-6">
                    <div className="flex items-center" style={{ border: "1px solid var(--ps-line-strong)" }}>
                      <button
                        type="button"
                        aria-label="Decrease quantity"
                        onClick={() => setQty(l.slug, l.variantId, l.qty - 1)}
                        className="px-3.5 py-2 leading-none transition-opacity hover:opacity-60"
                      >
                        −
                      </button>
                      <span className="min-w-[28px] text-center text-[.78rem]">{l.qty}</span>
                      <button
                        type="button"
                        aria-label="Increase quantity"
                        onClick={() => setQty(l.slug, l.variantId, l.qty + 1)}
                        className="px-3.5 py-2 leading-none transition-opacity hover:opacity-60"
                      >
                        +
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => remove(l.slug, l.variantId)}
                      className="ps-tap ps-caps ps-link"
                      style={{ fontSize: ".54rem", color: "var(--ps-faint)" }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <div style={{ borderTop: "1px solid var(--ps-line)" }} className="pt-8">
            <Link href="/c/women" className="ps-caps ps-link ps-link-on">
              Continue Shopping
            </Link>
          </div>
        </div>

        {/* summary */}
        <aside className="lg:sticky lg:top-[110px] lg:h-fit">
          <div className="p-8" style={{ border: "1px solid var(--ps-line)", background: "var(--ps-surface)" }}>
            <p className="ps-caps" style={{ color: "var(--ps-accent)" }}>
              Order Summary
            </p>

            <dl className="mt-8 space-y-3.5 text-[.85rem] font-light">
              <div className="flex justify-between">
                <dt style={{ color: "var(--ps-muted)" }}>Subtotal</dt>
                <dd>{money(subtotal)}</dd>
              </div>
              {applied ? (
                <div className="flex justify-between" style={{ color: "var(--ps-accent)" }}>
                  <dt>Discount — {applied.code}</dt>
                  <dd>−{money(discount)}</dd>
                </div>
              ) : null}
              <div className="flex justify-between">
                <dt style={{ color: "var(--ps-muted)" }}>Delivery</dt>
                <dd>{shipping === 0 ? "Complimentary" : money(shipping)}</dd>
              </div>
              {gift ? (
                <div className="flex justify-between">
                  <dt style={{ color: "var(--ps-muted)" }}>Gift presentation</dt>
                  <dd>{money(giftFee)}</dd>
                </div>
              ) : null}
              <div className="flex justify-between">
                <dt style={{ color: "var(--ps-muted)" }}>Estimated tax</dt>
                <dd>{money(tax)}</dd>
              </div>
            </dl>

            <div className="mt-7 flex items-baseline justify-between pt-6" style={{ borderTop: "1px solid var(--ps-line)" }}>
              <p className="ps-caps">Total</p>
              <p className="ps-display text-[1.8rem]">{money(total)}</p>
            </div>

            <label className="mt-7 flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={gift}
                onChange={(e) => setGift(e.target.checked)}
                className="mt-1 accent-[var(--ps-accent)]"
              />
              <span className="text-[.8rem] font-light" style={{ color: "var(--ps-muted)" }}>
                Gift presentation — lacquer box, grosgrain ribbon and a hand-written card ({money(20)})
              </span>
            </label>

            <form onSubmit={applyPromo} className="mt-7">
              <div className="flex items-end gap-3">
                <input
                  className="ps-field flex-1"
                  placeholder="Promotion code"
                  aria-label="Promotion code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                />
                <button type="submit" className="ps-btn shrink-0 !px-6 !py-2.5">
                  <span>Apply</span>
                </button>
              </div>
              {err ? (
                <p className="mt-2 text-[.72rem]" style={{ color: "#c47b7b" }}>
                  {err}
                </p>
              ) : null}
              {applied ? (
                <p className="mt-2 text-[.72rem]" style={{ color: "var(--ps-accent)" }}>
                  {applied.code} applied — {Math.round(applied.rate * 100)}% off.
                </p>
              ) : (
                <p className="mt-2 text-[.68rem]" style={{ color: "var(--ps-faint)" }}>
                  Try ATELIER10 or MAISON.
                </p>
              )}
            </form>

            <Link href="/checkout" className="ps-btn ps-btn-solid mt-8 w-full">
              <span>Checkout</span>
            </Link>

            <p className="mt-5 text-center text-[.68rem]" style={{ color: "var(--ps-faint)" }}>
              This is a demonstration storefront — no payment is taken and no order is placed.
            </p>
          </div>

          <div className="mt-6 space-y-3 px-2 text-[.76rem] font-light" style={{ color: "var(--ps-muted)" }}>
            <p>— Complimentary express delivery above {money(250)}</p>
            <p>— Complimentary returns within 30 days</p>
            <p>— Complimentary alterations for the life of the piece</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
