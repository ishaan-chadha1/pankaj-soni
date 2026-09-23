"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { PHOTOS, photo, photoSet, blurOf } from "@/lib/photos";

/** The pre-film campaign hero, retained for stakeholder comparison. */
const PANES = ["noir-vine-01", "duet-02", "nocturne-gown-03"] as const;

export default function LegacyCampaignHero({
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

  useEffect(() => {
    const timeout = window.setTimeout(() => setShown(true), 80);
    return () => window.clearTimeout(timeout);
  }, []);

  return (
    <section className="ps-chero" data-shown={shown} aria-label={`${title} — ${eyebrow}`}>
      <div className="ps-chero-panes">
        {PANES.map((slug, index) => (
          <Pane key={slug} slug={slug} index={index} />
        ))}
      </div>

      <div className="ps-chero-veil" aria-hidden />

      <div className="ps-chero-lockup">
        <p className="ps-caps ps-chero-eyebrow">{eyebrow}</p>
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
  const meta = PHOTOS[slug];
  const image = useRef<HTMLImageElement | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (image.current?.complete) setLoaded(true);
  }, []);

  return (
    <figure
      className="ps-chero-pane"
      style={{
        ["--i" as string]: index,
        backgroundImage: `url("${blurOf(slug)}")`,
      }}
    >
      <img
        ref={image}
        src={photo(slug)}
        srcSet={photoSet(slug)}
        sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 34vw"
        width={meta?.width}
        height={meta?.height}
        alt={index === 1 ? (meta?.alt ?? "") : ""}
        fetchPriority={index === 0 ? "high" : "auto"}
        decoding="async"
        data-loaded={loaded}
        onLoad={() => setLoaded(true)}
      />
    </figure>
  );
}
