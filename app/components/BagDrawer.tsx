"use client";

import Link from "next/link";
import { money } from "@/lib/catalog";
import { useCart } from "../CartProvider";

export default function BagDrawer() {
  const { lines, subtotal, count, setQty, remove, open, setOpen } = useCart();

  const FREE_SHIP = 250;
  const toFree = Math.max(0, FREE_SHIP - subtotal);
  const pct = Math.min(100, (subtotal / FREE_SHIP) * 100);

  return (
    <>
      <div
        aria-hidden
        onClick={() => setOpen(false)}
        className="fixed inset-0 z-[80] transition-opacity duration-700"
        style={{
          background: "rgba(4,4,5,.62)",
          backdropFilter: "blur(3px)",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
        }}
      />

      <aside
        aria-label="Shopping bag"
        aria-hidden={!open}
        className="fixed right-0 top-0 z-[90] flex h-full w-full max-w-[460px] flex-col"
        style={{
          background: "#0d0d0f",
          borderLeft: "1px solid var(--ps-line)",
          transform: open ? "translateX(0)" : "translateX(100%)",
          transition: "transform .85s cubic-bezier(.16,1,.3,1)",
        }}
      >
        <div
          className="flex items-center justify-between px-7 py-6"
          style={{ borderBottom: "1px solid var(--ps-line)" }}
        >
          <p className="ps-caps">
            Your Bag <span style={{ color: "var(--ps-faint)" }}>({count})</span>
          </p>
          <button type="button" aria-label="Close bag" onClick={() => setOpen(false)}>
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
              <path d="M5 5l14 14M19 5L5 19" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {lines.length > 0 ? (
          <div className="px-7 pt-5">
            <p className="ps-caps mb-2.5" style={{ fontSize: ".55rem", color: "var(--ps-muted)" }}>
              {toFree > 0 ? `${money(toFree)} from complimentary express` : "Complimentary express unlocked"}
            </p>
            <div className="h-px w-full" style={{ background: "var(--ps-line)" }}>
              <div
                className="h-px transition-all duration-1000"
                style={{ width: `${pct}%`, background: "var(--gold)" }}
              />
            </div>
          </div>
        ) : null}

        <div className="flex-1 overflow-y-auto px-7 py-7">
          {lines.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <p className="ps-display text-[1.7rem]">Your bag is empty</p>
              <p className="mt-3 max-w-[26ch] text-[.84rem]" style={{ color: "var(--ps-muted)" }}>
                Begin with the Private Atelier — eight compositions, one signature.
              </p>
              <Link href="/c/fragrance" onClick={() => setOpen(false)} className="ps-btn mt-8">
                <span>Discover Fragrance</span>
              </Link>
            </div>
          ) : (
            <ul className="space-y-7">
              {lines.map((l) => (
                <li key={`${l.slug}-${l.variantId}`} className="flex gap-5">
                  <Link
                    href={`/p/${l.slug}`}
                    onClick={() => setOpen(false)}
                    className="ps-media h-[124px] w-[94px] shrink-0"
                  >
                    <img src={l.product.image} alt={l.product.name} loading="lazy" decoding="async" />
                  </Link>

                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="ps-caps" style={{ fontSize: ".54rem", color: "var(--ps-faint)" }}>
                          {l.product.line}
                        </p>
                        <Link
                          href={`/p/${l.slug}`}
                          onClick={() => setOpen(false)}
                          className="ps-display mt-1 block text-[1.05rem] leading-tight"
                        >
                          {l.product.name}
                        </Link>
                        <p className="mt-1 text-[.72rem]" style={{ color: "var(--ps-muted)" }}>
                          {l.variant.label}
                          {l.variant.sub ? ` · ${l.variant.sub}` : ""}
                        </p>
                      </div>
                      <p className="shrink-0 text-[.8rem]">{money(l.variant.price * l.qty)}</p>
                    </div>

                    <div className="mt-auto flex items-center justify-between pt-4">
                      <div
                        className="flex items-center"
                        style={{ border: "1px solid var(--ps-line-strong)" }}
                      >
                        <button
                          type="button"
                          aria-label="Decrease quantity"
                          onClick={() => setQty(l.slug, l.variantId, l.qty - 1)}
                          className="px-3 py-1.5 text-[.9rem] leading-none transition-opacity hover:opacity-60"
                        >
                          −
                        </button>
                        <span className="min-w-[26px] text-center text-[.76rem]">{l.qty}</span>
                        <button
                          type="button"
                          aria-label="Increase quantity"
                          onClick={() => setQty(l.slug, l.variantId, l.qty + 1)}
                          className="px-3 py-1.5 text-[.9rem] leading-none transition-opacity hover:opacity-60"
                        >
                          +
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => remove(l.slug, l.variantId)}
                        className="ps-caps ps-link"
                        style={{ fontSize: ".54rem", color: "var(--ps-faint)" }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {lines.length > 0 ? (
          <div className="px-7 pb-8 pt-6" style={{ borderTop: "1px solid var(--ps-line)" }}>
            <div className="flex items-baseline justify-between">
              <p className="ps-caps">Subtotal</p>
              <p className="ps-display text-[1.5rem]">{money(subtotal)}</p>
            </div>
            <p className="mt-2 text-[.7rem]" style={{ color: "var(--ps-faint)" }}>
              Duties and taxes calculated at checkout. Complimentary returns within 30 days.
            </p>
            <Link href="/bag" onClick={() => setOpen(false)} className="ps-btn ps-btn-solid mt-6 w-full">
              <span>Proceed to Checkout</span>
            </Link>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="ps-caps ps-link mx-auto mt-5 block"
              style={{ fontSize: ".56rem", color: "var(--ps-muted)" }}
            >
              Continue Shopping
            </button>
          </div>
        ) : null}
      </aside>
    </>
  );
}
