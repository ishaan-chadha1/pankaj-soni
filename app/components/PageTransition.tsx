"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import MaisonPlate from "./MaisonPlate";
import { routeLabel } from "@/lib/routes";

/*
 * ~1.8s, in three beats:
 *   0      the plate wipes up from the bottom edge and covers the page
 *   650    covered — only now does the route change, so the old page is never
 *          seen coming apart underneath
 *   1100   earliest the plate may leave; it waits longer if the new page has
 *          not rendered yet, which is what makes it a loader and not a veil
 *   +700   lifts away upward, exactly as the entry Preloader does
 */
const T = { covered: 650, holdMin: 1100, lift: 700, letters: 180, fill: 300, stuck: 6000 };

type Phase = "idle" | "cover" | "lift";

/**
 * Route transitions, built from the entry curtain.
 *
 * WHY INTERCEPT CLICKS RATHER THAN WRAP <Link>. Every internal link on the site
 * is a plain next/link, in dozens of places. A capture-phase listener on the
 * document sees them all before Link does; calling preventDefault there makes
 * Link stand down (it checks `defaultPrevented`), and this pushes the route
 * itself once the plate is closed. Nothing else in the codebase has to know.
 *
 * LEFT ALONE, so the browser behaves as it always has:
 *   - modifier clicks and middle clicks (new tab / new window)
 *   - target="_blank", download, other origins, mailto:, tel:
 *   - links to the page already open (hash jumps, query changes)
 *   - anything marked data-no-transition
 *   - everyone with reduced motion
 *
 * BACK AND FORWARD get the second half only. The browser has already changed
 * the page by the time anything here hears about it, so wiping over a page that
 * is already gone would be theatre; the plate appears closed and lifts.
 */
export default function PageTransition() {
  const router = useRouter();
  const pathname = usePathname();

  const [phase, setPhase] = useState<Phase>("idle");
  const [shown, setShown] = useState(false);
  const [filling, setFilling] = useState(false);
  const [caption, setCaption] = useState("");
  /** Skip the wipe in — the back/forward case. */
  const [snap, setSnap] = useState(false);

  const busy = useRef(false);
  const target = useRef<string | null>(null);
  const arrived = useRef(false);
  const heldLongEnough = useRef(false);
  const timers = useRef<number[]>([]);

  const at = useCallback((ms: number, fn: () => void) => {
    timers.current.push(window.setTimeout(fn, ms));
  }, []);

  const reset = useCallback(() => {
    timers.current.forEach(window.clearTimeout);
    timers.current = [];
    busy.current = false;
    target.current = null;
    setPhase("idle");
    setShown(false);
    setFilling(false);
    setSnap(false);
  }, []);

  const lift = useCallback(() => {
    // Two frames so the new page has actually painted under the plate.
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        setPhase("lift");
        at(T.lift + 40, reset);
      })
    );
  }, [at, reset]);

  const maybeLift = useCallback(() => {
    if (!busy.current || !arrived.current || !heldLongEnough.current) return;
    heldLongEnough.current = false; // once
    lift();
  }, [lift]);

  const go = useCallback(
    (href: string, path: string) => {
      busy.current = true;
      arrived.current = false;
      heldLongEnough.current = false;
      target.current = path;
      setCaption(routeLabel(path));
      setSnap(false);
      setPhase("cover");
      router.prefetch(href);

      at(T.letters, () => setShown(true));
      at(T.fill, () => setFilling(true));
      at(T.covered, () => router.push(href));
      at(T.holdMin, () => {
        heldLongEnough.current = true;
        maybeLift();
      });
      // A route that never resolves must not leave the site behind a curtain.
      at(T.stuck, () => {
        arrived.current = true;
        heldLongEnough.current = true;
        maybeLift();
      });
    },
    [at, maybeLift, router]
  );

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      const a = (e.target as Element | null)?.closest?.("a[href]");
      if (!(a instanceof HTMLAnchorElement)) return;
      if (a.target && a.target !== "_self") return;
      if (a.hasAttribute("download") || "noTransition" in a.dataset) return;

      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin) return;
      if (url.pathname === location.pathname) return;
      if (reduce.matches) return;

      e.preventDefault();
      if (busy.current) return; // already on its way somewhere
      go(url.pathname + url.search + url.hash, url.pathname);
    };

    const onPop = () => {
      if (reduce.matches || busy.current) return;
      busy.current = true;
      setCaption(routeLabel(location.pathname));
      setSnap(true);
      setShown(true);
      setFilling(true);
      setPhase("cover");
      at(160, lift);
    };

    document.addEventListener("click", onClick, true);
    window.addEventListener("popstate", onPop);
    const t = timers;
    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("popstate", onPop);
      t.current.forEach(window.clearTimeout);
    };
  }, [at, go, lift]);

  useEffect(() => {
    if (target.current && pathname === target.current) {
      arrived.current = true;
      maybeLift();
    }
  }, [pathname, maybeLift]);

  const idle = phase === "idle";

  return (
    <div
      aria-hidden
      className="fixed inset-0 z-[190] flex flex-col items-center justify-center"
      style={{
        background: "var(--ps-bg-alt)",
        visibility: idle ? "hidden" : "visible",
        pointerEvents: idle ? "none" : "auto",
        clipPath: idle ? "inset(100% 0 0 0)" : "inset(0 0 0 0)",
        transform: phase === "lift" ? "translateY(-100%)" : "translateY(0)",
        transition: idle
          ? "none"
          : phase === "lift"
            ? `transform ${T.lift}ms cubic-bezier(.76,0,.24,1)`
            : snap
              ? "none"
              : `clip-path ${T.covered}ms cubic-bezier(.76,0,.24,1)`,
      }}
    >
      <MaisonPlate
        shown={shown}
        filling={filling}
        caption={caption}
        step={30}
        letterMs={650}
        fillMs={800}
        captionDelay={250}
      />
    </div>
  );
}
