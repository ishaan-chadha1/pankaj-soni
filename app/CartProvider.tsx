"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { PRODUCTS, bySlug, type Product, type Variant } from "@/lib/catalog";

export type CartItem = { slug: string; variantId: string; qty: number };

export type CartLine = CartItem & { product: Product; variant: Variant };

type CartCtx = {
  items: CartItem[];
  lines: CartLine[];
  count: number;
  subtotal: number;
  add: (slug: string, variantId: string, qty?: number) => void;
  setQty: (slug: string, variantId: string, qty: number) => void;
  remove: (slug: string, variantId: string) => void;
  clear: () => void;
  open: boolean;
  setOpen: (v: boolean) => void;
  /** True once localStorage has been read, so the badge doesn't flash. */
  ready: boolean;
};

const Ctx = createContext<CartCtx | null>(null);
const KEY = "ps-bag-v1";

const isItem = (v: unknown): v is CartItem => {
  if (typeof v !== "object" || v === null) return false;
  const o = v as Record<string, unknown>;
  return (
    typeof o.slug === "string" &&
    typeof o.variantId === "string" &&
    typeof o.qty === "number" &&
    o.qty > 0
  );
};

/** `items` and `ready` are one atom so hydration is a single state write. */
type Bag = { items: CartItem[]; ready: boolean };

export function CartProvider({ children }: { children: ReactNode }) {
  const [bag, setBag] = useState<Bag>({ items: [], ready: false });
  const [open, setOpen] = useState(false);
  const { items, ready } = bag;

  // Adopt the stored bag after mount. localStorage does not exist on the
  // server, so this cannot move into a state initialiser without breaking SSR.
  useEffect(() => {
    let restored: CartItem[] = [];
    try {
      const raw = localStorage.getItem(KEY);
      const parsed: unknown = raw ? JSON.parse(raw) : [];
      if (Array.isArray(parsed)) {
        // Drop anything whose product or variant no longer exists, or the whole
        // bag breaks when the catalogue changes under a stale session.
        restored = parsed.filter(isItem).filter((i) => {
          const p = PRODUCTS.find((x) => x.slug === i.slug);
          return !!p?.variants.some((v) => v.id === i.variantId);
        });
      }
    } catch {
      /* corrupt payload — start empty rather than throwing at mount */
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setBag({ items: restored, ready: true });
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(items));
    } catch {
      /* private mode / quota — the bag just won't persist */
    }
  }, [items, ready]);

  // Lock the page while the drawer is up.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const add = useCallback((slug: string, variantId: string, qty = 1) => {
    setBag((prev) => {
      const at = prev.items.findIndex((i) => i.slug === slug && i.variantId === variantId);
      if (at === -1) return { ...prev, items: [...prev.items, { slug, variantId, qty }] };
      const next = [...prev.items];
      next[at] = { ...next[at], qty: next[at].qty + qty };
      return { ...prev, items: next };
    });
    setOpen(true);
  }, []);

  const setQty = useCallback((slug: string, variantId: string, qty: number) => {
    setBag((prev) => ({
      ...prev,
      items:
        qty <= 0
          ? prev.items.filter((i) => !(i.slug === slug && i.variantId === variantId))
          : prev.items.map((i) =>
              i.slug === slug && i.variantId === variantId ? { ...i, qty } : i
            ),
    }));
  }, []);

  const remove = useCallback((slug: string, variantId: string) => {
    setBag((prev) => ({
      ...prev,
      items: prev.items.filter((i) => !(i.slug === slug && i.variantId === variantId)),
    }));
  }, []);

  const clear = useCallback(() => setBag((prev) => ({ ...prev, items: [] })), []);

  const lines = useMemo(
    () =>
      items.flatMap<CartLine>((i) => {
        const product = bySlug(i.slug);
        const variant = product?.variants.find((v) => v.id === i.variantId);
        return product && variant ? [{ ...i, product, variant }] : [];
      }),
    [items]
  );

  const subtotal = useMemo(
    () => lines.reduce((s, l) => s + l.variant.price * l.qty, 0),
    [lines]
  );
  const count = useMemo(() => lines.reduce((s, l) => s + l.qty, 0), [lines]);

  const value = useMemo(
    () => ({ items, lines, count, subtotal, add, setQty, remove, clear, open, setOpen, ready }),
    [items, lines, count, subtotal, add, setQty, remove, clear, open, ready]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart must be used inside <CartProvider>");
  return c;
}
