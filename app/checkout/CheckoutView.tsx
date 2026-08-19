"use client";

import Link from "next/link";
import { useState } from "react";
import { money } from "@/lib/catalog";
import { useCart } from "../CartProvider";
import { FillRule } from "../components/Motif";

type Step = 0 | 1 | 2 | 3;

const STEPS = ["Contact", "Delivery", "Review", "Confirmed"];

const DELIVERY = [
  { id: "express", label: "Signature Express", note: "1–2 business days, signature required", price: 0 },
  { id: "standard", label: "Standard", note: "3–5 business days", price: 0 },
  { id: "boutique", label: "Collect in Boutique", note: "Ready within 24 hours", price: 0 },
];

export default function CheckoutView() {
  const { lines, subtotal, count, clear, ready } = useCart();
  const [step, setStep] = useState<Step>(0);
  const [ship, setShip] = useState("express");
  const [form, setForm] = useState({
    email: "",
    first: "",
    last: "",
    address: "",
    city: "",
    postcode: "",
    country: "India",
    gift: false,
    note: "",
  });

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({
      ...f,
      [k]: e.target instanceof HTMLInputElement && e.target.type === "checkbox" ? e.target.checked : e.target.value,
    }));

  const tax = Math.round(subtotal * 0.08);
  const total = subtotal + tax;
  const orderNo = "PS-" + String(Math.abs(subtotal * 7919 + count * 104729) % 900000 + 100000);

  if (!ready) return <div className="min-h-[60svh]" />;

  if (lines.length === 0 && step !== 3) {
    return (
      <div className="flex min-h-[60svh] flex-col items-center justify-center px-6 text-center">
        <h1 className="ps-display text-[2.6rem] sm:text-[3.4rem]">Your bag is empty</h1>
        <p className="mt-4 max-w-[36ch] text-[.92rem] font-light" style={{ color: "var(--ps-muted)" }}>
          There is nothing to check out just yet.
        </p>
        <Link href="/c/fragrance" className="ps-btn ps-btn-solid mt-9">
          <span>Discover Fragrance</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1300px] px-5 pb-28 pt-12 sm:px-8">
      <h1 className="ps-display text-[2.4rem] sm:text-[3.2rem]">Checkout</h1>

      {/* step rail */}
      <ol className="mt-9 flex flex-wrap gap-x-8 gap-y-3">
        {STEPS.map((s, i) => (
          <li key={s} className="flex items-center gap-2.5">
            <span
              className="flex h-6 w-6 items-center justify-center rounded-full text-[.6rem]"
              style={{
                border: `1px solid ${i <= step ? "var(--ps-accent)" : "var(--ps-line-strong)"}`,
                color: i <= step ? "var(--ps-accent)" : "var(--ps-faint)",
                background: i < step ? "var(--ps-accent)" : "transparent",
              }}
            >
              {i < step ? <span style={{ color: "var(--ps-bg)" }}>✓</span> : i + 1}
            </span>
            <span
              className="ps-caps"
              style={{ fontSize: ".55rem", color: i <= step ? "var(--ps-text)" : "var(--ps-faint)" }}
            >
              {s}
            </span>
          </li>
        ))}
      </ol>

      {/* Same hairline the entry curtain draws, tracking progress through the
          four steps rather than a load. */}
      <div className="mt-5">
        <FillRule progress={step / (STEPS.length - 1)} duration={900} />
      </div>

      <div className="mt-12 grid gap-14 lg:grid-cols-[1.4fr_1fr] lg:gap-20">
        <div>
          {step === 0 ? (
            <section>
              <h2 className="ps-display text-[1.7rem]">Contact</h2>
              <div className="mt-7 grid gap-6 sm:grid-cols-2">
                <label className="sm:col-span-2">
                  <span className="sr-only">Email address</span>
                  <input className="ps-field" placeholder="Email address" type="email" value={form.email} onChange={set("email")} />
                </label>
                <label>
                  <span className="sr-only">First name</span>
                  <input className="ps-field" placeholder="First name" value={form.first} onChange={set("first")} />
                </label>
                <label>
                  <span className="sr-only">Last name</span>
                  <input className="ps-field" placeholder="Last name" value={form.last} onChange={set("last")} />
                </label>
              </div>
              <button type="button" onClick={() => setStep(1)} className="ps-btn ps-btn-solid mt-10">
                <span>Continue to Delivery</span>
              </button>
            </section>
          ) : null}

          {step === 1 ? (
            <section>
              <h2 className="ps-display text-[1.7rem]">Delivery</h2>
              <div className="mt-7 grid gap-6 sm:grid-cols-2">
                <label className="sm:col-span-2">
                  <span className="sr-only">Address</span>
                  <input className="ps-field" placeholder="Address" value={form.address} onChange={set("address")} />
                </label>
                <label>
                  <span className="sr-only">City</span>
                  <input className="ps-field" placeholder="City" value={form.city} onChange={set("city")} />
                </label>
                <label>
                  <span className="sr-only">Postcode</span>
                  <input className="ps-field" placeholder="Postcode" value={form.postcode} onChange={set("postcode")} />
                </label>
                <label className="sm:col-span-2">
                  <span className="sr-only">Country</span>
                  <select className="ps-field cursor-pointer" value={form.country} onChange={set("country")}>
                    {["India", "France", "Italy", "United Kingdom", "United States", "Japan"].map((c) => (
                      <option key={c} value={c} style={{ background: "var(--ps-surface)", color: "var(--ps-text)" }}>
                        {c}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <h3 className="ps-caps mt-12" style={{ color: "var(--ps-accent)" }}>
                Method
              </h3>
              <div className="mt-5 space-y-2.5">
                {DELIVERY.map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => setShip(d.id)}
                    aria-pressed={ship === d.id}
                    className="flex w-full items-center justify-between p-5 text-left transition-colors duration-500"
                    style={{
                      border: `1px solid ${ship === d.id ? "var(--ps-accent)" : "var(--ps-line)"}`,
                      background: ship === d.id ? "rgba(201,169,97,.06)" : "transparent",
                    }}
                  >
                    <span>
                      <span className="block text-[.9rem]">{d.label}</span>
                      <span className="block text-[.75rem]" style={{ color: "var(--ps-muted)" }}>
                        {d.note}
                      </span>
                    </span>
                    <span className="ps-caps" style={{ fontSize: ".55rem", color: "var(--ps-accent)" }}>
                      Complimentary
                    </span>
                  </button>
                ))}
              </div>

              <div className="mt-10 flex flex-wrap gap-4">
                <button type="button" onClick={() => setStep(2)} className="ps-btn ps-btn-solid">
                  <span>Review Order</span>
                </button>
                <button type="button" onClick={() => setStep(0)} className="ps-btn">
                  <span>Back</span>
                </button>
              </div>
            </section>
          ) : null}

          {step === 2 ? (
            <section>
              <h2 className="ps-display text-[1.7rem]">Review</h2>

              <dl className="mt-7 space-y-4 text-[.86rem] font-light">
                <div className="flex justify-between gap-6 pb-4" style={{ borderBottom: "1px solid var(--ps-line)" }}>
                  <dt style={{ color: "var(--ps-muted)" }}>Contact</dt>
                  <dd className="text-right">
                    {form.first || form.last ? `${form.first} ${form.last}`.trim() : "—"}
                    <br />
                    {form.email || "—"}
                  </dd>
                </div>
                <div className="flex justify-between gap-6 pb-4" style={{ borderBottom: "1px solid var(--ps-line)" }}>
                  <dt style={{ color: "var(--ps-muted)" }}>Ship to</dt>
                  <dd className="text-right">
                    {form.address || "—"}
                    <br />
                    {[form.city, form.postcode].filter(Boolean).join(" ")} {form.country}
                  </dd>
                </div>
                <div className="flex justify-between gap-6 pb-4" style={{ borderBottom: "1px solid var(--ps-line)" }}>
                  <dt style={{ color: "var(--ps-muted)" }}>Method</dt>
                  <dd>{DELIVERY.find((d) => d.id === ship)?.label}</dd>
                </div>
              </dl>

              {/* Deliberately inert. This is a demonstration storefront, so it
                  collects no card details and contacts no payment processor. */}
              <div className="mt-10 p-6" style={{ border: "1px dashed var(--ps-line-strong)" }}>
                <p className="ps-caps" style={{ color: "var(--ps-accent)" }}>
                  Payment
                </p>
                <p className="mt-3 text-[.85rem] font-light leading-relaxed" style={{ color: "var(--ps-muted)" }}>
                  This is a demonstration storefront. No card details are collected, no
                  payment is processed, and no order is placed. Placing the order below
                  simply clears your bag and shows the confirmation screen.
                </p>
              </div>

              <div className="mt-10 flex flex-wrap gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setStep(3);
                    clear();
                  }}
                  className="ps-btn ps-btn-solid"
                >
                  <span>Place Order — {money(total)}</span>
                </button>
                <button type="button" onClick={() => setStep(1)} className="ps-btn">
                  <span>Back</span>
                </button>
              </div>
            </section>
          ) : null}

          {step === 3 ? (
            <section className="py-6">
              <p className="ps-caps" style={{ color: "var(--ps-accent)" }}>
                Order {orderNo}
              </p>
              <h2 className="ps-display mt-6 text-[2.4rem] leading-[1] sm:text-[3.2rem]">
                Thank you.
                <br />
                <span className="ps-display-i">It is being wrapped.</span>
              </h2>
              <p className="mt-6 max-w-[48ch] text-[.92rem] font-light leading-relaxed" style={{ color: "var(--ps-muted)" }}>
                A confirmation would ordinarily reach {form.email || "your inbox"} within a
                few minutes. Since this is a demonstration, nothing was charged and nothing
                was sent.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link href="/" className="ps-btn ps-btn-solid">
                  <span>Return to the Maison</span>
                </Link>
                <Link href="/atelier" className="ps-btn">
                  <span>The Olfactory Engine</span>
                </Link>
              </div>
            </section>
          ) : null}
        </div>

        {/* summary */}
        {step !== 3 ? (
          <aside className="lg:sticky lg:top-[110px] lg:h-fit">
            <div className="p-7" style={{ border: "1px solid var(--ps-line)", background: "var(--ps-surface)" }}>
              <p className="ps-caps" style={{ color: "var(--ps-accent)" }}>
                {count} {count === 1 ? "piece" : "pieces"}
              </p>

              <ul className="mt-6 space-y-5">
                {lines.map((l) => (
                  <li key={`${l.slug}-${l.variantId}`} className="flex gap-4">
                    <span className="ps-media h-[86px] w-[66px] shrink-0">
                      <img src={l.product.image} alt="" loading="lazy" decoding="async" />
                    </span>
                    <span className="flex-1">
                      <span className="ps-display block text-[.98rem]">{l.product.name}</span>
                      <span className="block text-[.7rem]" style={{ color: "var(--ps-faint)" }}>
                        {l.variant.label} · Qty {l.qty}
                      </span>
                    </span>
                    <span className="text-[.78rem]">{money(l.variant.price * l.qty)}</span>
                  </li>
                ))}
              </ul>

              <dl className="mt-7 space-y-3 pt-6 text-[.84rem] font-light" style={{ borderTop: "1px solid var(--ps-line)" }}>
                <div className="flex justify-between">
                  <dt style={{ color: "var(--ps-muted)" }}>Subtotal</dt>
                  <dd>{money(subtotal)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt style={{ color: "var(--ps-muted)" }}>Delivery</dt>
                  <dd>Complimentary</dd>
                </div>
                <div className="flex justify-between">
                  <dt style={{ color: "var(--ps-muted)" }}>Estimated tax</dt>
                  <dd>{money(tax)}</dd>
                </div>
              </dl>

              <div className="mt-6 flex items-baseline justify-between pt-5" style={{ borderTop: "1px solid var(--ps-line)" }}>
                <p className="ps-caps">Total</p>
                <p className="ps-display text-[1.6rem]">{money(total)}</p>
              </div>
            </div>

            <Link href="/bag" className="ps-caps ps-link mt-6 inline-block" style={{ fontSize: ".55rem", color: "var(--ps-muted)" }}>
              Edit Bag
            </Link>
          </aside>
        ) : null}
      </div>
    </div>
  );
}
