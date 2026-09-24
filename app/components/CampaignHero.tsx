"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { FILMS, filmMp4, filmPoster, filmBlur } from "@/lib/films";

/**
 * The campaign hero — three films, one lockup.
 *
 * WHY A TRIPTYCH, AND WHY IT SUITS FILM EVEN BETTER THAN STILLS.
 *
 * The footage is 1080x1920 vertical. Cropped into a full-bleed landscape hero
 * that throws away roughly three quarters of the frame and upscales what is
 * left; dropped into a portrait pane it renders close to native. The format
 * the clips were shot in is the format the hero already wanted.
 *
 * ORDER IS DECIDED BY THE TYPE, not by the garments. The lockup sits at 68%
 * of the hero's height, dead centre, so whatever is in the middle pane is what
 * ivory type has to survive. `film-coral` is black pinstripe on a dark carved
 * wall — the only one of the three that is reliably dark under the lockup —
 * so it takes the middle, and the two pale ones flank it. The phone shows the
 * middle pane alone, which means the phone also gets the legible one.
 *
 * PANES DO NOT LOOP IN UNISON. Three clips of nearly the same length, started
 * together, hit their cut at the same instant and the whole hero blinks. Each
 * one starts at its own offset into its own timeline instead, so the loop
 * points scatter and the row never resets as a block.
 */

/** Left, centre, right. See the note above on why the dark one is in the middle. */
const PANES = ["film-sash", "film-coral", "film-column"] as const;

export default function CampaignHero({
  eyebrow,
  title,
  sub,
  href,
  cta,
}: {
  eyebrow: string;
  title: string;
  sub: string;
  href: string;
  cta: string;
}) {
  const [shown, setShown] = useState(false);

  /* Above the fold, so it opens on mount rather than on an observer. One frame
     of delay lets the posters paint first, so the clip-path animates over a
     picture instead of over the empty box it is about to become. */
  useEffect(() => {
    const t = window.setTimeout(() => setShown(true), 80);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <section className="ps-chero" data-shown={shown} aria-label={`${title} — ${eyebrow}`}>
      <div className="ps-chero-panes">
        {PANES.map((slug, i) => (
          <Pane key={slug} slug={slug} index={i} />
        ))}
      </div>

      {/* Insurance for the type, not a mood. Nothing across the top two-thirds,
          where the eye actually goes. */}
      <div className="ps-chero-veil" aria-hidden />

      <div className="ps-chero-lockup">
        <p className="ps-caps ps-chero-eyebrow">{eyebrow}</p>

        {/*
         * The <h1> is real type, not a graphic. The reference sets its drop
         * name as an image and pays for it in every search result; a didone at
         * this size with the tracking opened up gets the same authority and
         * stays selectable, translatable and indexed.
         */}
        <h1 className="ps-display ps-chero-title">{title}</h1>

        <p className="ps-chero-sub">{sub}</p>

        <Link href={href} className="ps-btn ps-btn-solid ps-chero-cta">
          <span>{cta}</span>
        </Link>
      </div>
    </section>
  );
}

function Pane({ slug, index }: { slug: string; index: number }) {
  const meta = FILMS[slug];
  const video = useRef<HTMLVideoElement | null>(null);
  /** The stagger offset is a one-time nudge, not a loop point. */
  const seeded = useRef(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const v = video.current;
    if (!v) return;

    /* Reduced motion keeps the poster and never fetches the clip at all. The
       poster is the segment's own first frame, so what you get is exactly the
       composition the film opens on rather than an unrelated still. */
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    /* The PROPERTY, not the attribute. React renders `muted` as an attribute
       and browsers gate autoplay on the property — a clip that is muted in the
       markup but not in the DOM is refused permission to play. */
    v.muted = true;

    /* Scatter the loop points. Without this the three panes cut in unison and
       the hero blinks every five seconds. */
    const offset = (meta?.seconds ?? 5) * (index / PANES.length);

    /*
     * ONE IDEMPOTENT ATTEMPT, CALLED FROM EVERY TRIGGER.
     *
     * Starting a clip is not one event, it is a race between several: the
     * source attaching, the data arriving, the observer reporting, and — in
     * development — the effect being torn down and re-run between any two of
     * them. Hanging playback off a single `canplay` listener meant the teardown
     * removed that listener before it fired, and nothing ever started: three
     * panes at readyState 4 with autoplay permitted, all silent. Calling this
     * from everywhere costs nothing, because play() on a playing video is a
     * no-op.
     *
     * PLAY FIRST, THEN SEEK. Doing both in one tick loses — the seek aborts the
     * play request, the promise rejects, and the catch swallows it. Seeking a
     * video that is already playing does not stop it, so this order has no race.
     *
     * THE OFFSET IS APPLIED ONCE, and `seeded` is what makes it once. Guarding
     * on `currentTime` instead looked equivalent and was not: `loop` returns
     * the clip to 0, which satisfies that test, so every lap jumped forward to
     * the offset again and the pane played only the tail of its own film. The
     * one with a 3.73s offset was showing 1.9 seconds of a 5.6 second clip.
     */
    const tryPlay = () => {
      if (!v.src || v.offsetParent === null) return;
      v.play()
        .then(() => {
          setPlaying(true);
          if (offset > 0 && !seeded.current) {
            seeded.current = true;
            v.currentTime = offset;
          }
        })
        .catch(() => {});
    };

    /*
     * THE SRC IS ATTACHED HERE, NOT IN THE MARKUP.
     *
     * A phone shows one pane; the outer two are `display: none`. With a `src`
     * in the markup the browser fetched all three anyway — measured, both
     * hidden clips came down in full, 888KB of video for panes nobody can see.
     * Hidden elements are not exempt from media loading, and there is no
     * `media` attribute on <source> that works any more.
     *
     * Attaching on visibility fixes it and costs nothing: the `poster` paints
     * with no `src` at all, so the hero still shows its three stills on the
     * server render and through the first frames on the client.
     */
    const attach = () => {
      if (v.offsetParent === null) return;
      if (!v.src) {
        v.src = filmMp4(slug);
        v.load();
      }
      tryPlay();
    };
    attach();

    // Every one of these can be the moment it becomes possible to play, and
    // which one wins depends on the cache, the network and the breakpoint.
    v.addEventListener("loadeddata", tryPlay);
    v.addEventListener("canplay", tryPlay);
    // A rotate or a resize past the breakpoint reveals a pane that never got
    // a src; this is what gives it one.
    window.addEventListener("resize", attach);

    /*
     * Above the fold on load, but it still stops once scrolled past rather than
     * decoding a 720p frame every 16ms for a hero nobody is looking at.
     *
     * DELIBERATELY RELUCTANT TO PAUSE. This used to pause on
     * `!entry.isIntersecting` at a 0.05 threshold, which is a single boolean
     * derived from one measurement — and a pane was observed going
     * play -> playing -> pause immediately on load and then sitting dead for
     * the life of the page while its neighbours ran. A hero pane frozen on its
     * first frame is far worse than a few wasted decodes, so the test is now
     * "genuinely nothing on screen", with 200px of slack either side.
     */
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.intersectionRatio > 0) tryPlay();
        else if (v.src) v.pause();
      },
      { threshold: [0, 0.01], rootMargin: "200px 0px" }
    );
    io.observe(v);

    /*
     * A pause nobody asked for is a bug; resume it.
     *
     * Only the observer above is entitled to stop a pane, and it only does so
     * when the pane is off screen. If a `pause` arrives while the element is
     * still in the viewport it came from somewhere else — a decoder being
     * reclaimed, a power-saving heuristic, a background throttle — and the
     * pane would otherwise stay frozen forever. Capped, so a browser that is
     * determined to keep it paused is allowed to win rather than being fought
     * in a loop.
     *
     * CHECKED LATE, NOT ON THE EVENT. Every lap of a `loop` clip can emit
     * seeking -> waiting -> pause -> play as it wraps to 0, and the browser
     * resumes it by itself a few milliseconds later. Reviving on the event
     * itself spent the whole budget on those blips within the first three
     * laps, so by the time a real stall came there was nothing left to answer
     * it. Only a pane that is still paused after a beat has actually stalled.
     */
    let revivals = 0;
    let recheck: ReturnType<typeof setTimeout> | undefined;
    const onPause = () => {
      clearTimeout(recheck);
      recheck = setTimeout(() => {
        if (revivals >= 3 || !v.src || !v.paused || document.hidden) return;
        const r = v.getBoundingClientRect();
        if (r.bottom <= 0 || r.top >= window.innerHeight) return;
        revivals += 1;
        tryPlay();
      }, 400);
    };
    v.addEventListener("pause", onPause);

    return () => {
      io.disconnect();
      window.removeEventListener("resize", attach);
      v.removeEventListener("loadeddata", tryPlay);
      v.removeEventListener("canplay", tryPlay);
      v.removeEventListener("pause", onPause);
      clearTimeout(recheck);
      /* Deliberately NOT pausing here. The observer already stops a clip that
         scrolls out of view, and pausing on teardown meant a development
         re-render killed playback between the two runs of this effect. */
    };
  }, [index, slug, meta?.seconds]);

  return (
    <figure
      className="ps-chero-pane"
      style={{
        ["--i" as string]: index,
        // Holds the frame in roughly the right colours for the moment before
        // the poster itself decodes.
        backgroundImage: `url("${filmBlur(slug)}")`,
      }}
    >
      <video
        ref={video}
        /* No `src` — the effect attaches one only to a pane that is actually
           visible at this breakpoint. See the note there. */
        poster={filmPoster(slug)}
        muted
        loop
        playsInline
        preload="none"
        width={meta?.width}
        height={meta?.height}
        aria-label={index === 1 ? (meta?.alt ?? "") : undefined}
        aria-hidden={index === 1 ? undefined : true}
        data-loaded={playing}
      />
    </figure>
  );
}
