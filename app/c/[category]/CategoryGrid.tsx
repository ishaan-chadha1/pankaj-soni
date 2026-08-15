"use client";

import { useMemo, useState } from "react";
import type { Product } from "@/lib/catalog";
import ProductCard from "../../components/ProductCard";
import { Reveal } from "../../components/Reveal";

type Sort = "featured" | "low" | "high" | "az";

const SORTS: { id: Sort; label: string }[] = [
  { id: "featured", label: "Featured" },
  { id: "low", label: "Price — Low" },
  { id: "high", label: "Price — High" },
  { id: "az", label: "A — Z" },
];

export default function CategoryGrid({ products }: { products: Product[] }) {
  const [sort, setSort] = useState<Sort>("featured");
  const [line, setLine] = useState<string>("all");
  const [dense, setDense] = useState(false);

  const lines = useMemo(
    () => ["all", ...Array.from(new Set(products.map((p) => p.line)))],
    [products]
  );

  const shown = useMemo(() => {
    const list = line === "all" ? products : products.filter((p) => p.line === line);
    const out = [...list];
    switch (sort) {
      case "low":
        return out.sort((a, b) => a.price - b.price);
      case "high":
        return out.sort((a, b) => b.price - a.price);
      case "az":
        return out.sort((a, b) => a.name.localeCompare(b.name));
      default:
        // Featured first, then original catalogue order.
        return out.sort((a, b) => Number(!!b.featured) - Number(!!a.featured));
    }
  }, [products, line, sort]);

  return (
    <>
      <div
        className="sticky top-[68px] z-30 -mx-5 mb-12 px-5 py-4 sm:-mx-8 sm:px-8"
        style={{
          background: "color-mix(in srgb, var(--ps-bg) 88%, transparent)",
          backdropFilter: "blur(14px)",
          borderBottom: "1px solid var(--ps-line)",
        }}
      >
        <div className="flex flex-wrap items-center justify-between gap-5">
          <div className="ps-norail flex items-center gap-6 overflow-x-auto">
            {lines.map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setLine(l)}
                className="ps-caps ps-link whitespace-nowrap"
                style={{
                  color: line === l ? "var(--ps-accent)" : "var(--ps-muted)",
                  transition: "color .45s var(--ease)",
                }}
              >
                {l === "all" ? "All" : l}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-5">
            <span className="ps-caps hidden sm:inline" style={{ fontSize: ".54rem", color: "var(--ps-faint)" }}>
              {shown.length} {shown.length === 1 ? "piece" : "pieces"}
            </span>

            <label className="flex items-center gap-2">
              <span className="sr-only">Sort by</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as Sort)}
                className="ps-caps cursor-pointer bg-transparent outline-none"
                style={{ color: "var(--ps-text)" }}
              >
                {SORTS.map((s) => (
                  <option key={s.id} value={s.id} style={{ background: "var(--ps-surface)", color: "var(--ps-text)" }}>
                    {s.label}
                  </option>
                ))}
              </select>
            </label>

            {/* grid density — the small luxury-retail affordance */}
            <div className="hidden items-center gap-1.5 lg:flex">
              <button
                type="button"
                aria-label="Comfortable grid"
                aria-pressed={!dense}
                onClick={() => setDense(false)}
                className="p-1"
                style={{ opacity: dense ? 0.4 : 1 }}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                  <rect width="6" height="6" /><rect x="8" width="6" height="6" />
                  <rect y="8" width="6" height="6" /><rect x="8" y="8" width="6" height="6" />
                </svg>
              </button>
              <button
                type="button"
                aria-label="Dense grid"
                aria-pressed={dense}
                onClick={() => setDense(true)}
                className="p-1"
                style={{ opacity: dense ? 1 : 0.4 }}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                  {[0, 5, 10].map((y) =>
                    [0, 5, 10].map((x) => <rect key={`${x}-${y}`} x={x} y={y} width="4" height="4" />)
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        className={`grid gap-x-5 gap-y-14 ${
          dense ? "grid-cols-2 lg:grid-cols-4 xl:grid-cols-5" : "grid-cols-2 lg:grid-cols-3"
        }`}
      >
        {shown.map((p, i) => (
          <Reveal key={p.slug} delay={(i % 6) * 70}>
            <ProductCard product={p} index={i} priority={i < 3} />
          </Reveal>
        ))}
      </div>

      {shown.length === 0 ? (
        <p className="py-24 text-center text-[.9rem]" style={{ color: "var(--ps-muted)" }}>
          Nothing in this line at present.
        </p>
      ) : null}
    </>
  );
}
