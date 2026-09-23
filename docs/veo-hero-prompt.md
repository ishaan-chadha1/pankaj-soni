# Veo prompt — the home page hero film

Text-to-video, no source image. Generating from `look-01/02/03.jpg` would hand
back the same composition that is already on the page; the point of this clip is
that it is NOT one of the three banners.

Generate 16:9. Longer is better than shorter — 8s minimum.

---

## THE CROP RULE (this is the one that matters)

The hero is `object-fit: cover`. Desktop sees the whole 16:9 frame. A phone
scales it to fill a tall box and shows **only the middle ~34% of the width**.

So: **everything that matters lives in the central third.** Both prompts below
say so explicitly — do not trim that line. A beautiful frame with the subject
placed left will be a picture of a wall on mobile.

---

## Option A — the figure (recommended)

> A slow, unhurried shot inside a walnut-panelled room in the late afternoon. A
> man in a cream linen shirt and softly pleated trousers stands squarely in the
> CENTRE of the frame and stays there. Warm, low, west-facing light rakes across
> the panelling behind him. He breathes, shifts his weight once, and turns his
> head slowly toward the light — unhurried, self-possessed, never posing for the
> camera. The linen moves with him. Dust drifts through the light. The camera
> makes one very slow push in, no more than a few percent, and holds.
>
> COMPOSITION IS CRITICAL: the figure must sit in the CENTRAL THIRD of the frame
> at all times, with clear headroom, and must never drift toward either side.
> The outer left and right thirds carry only wall, light and shadow — nothing
> the eye needs. Frame him from the knees up so the composition survives a tall
> vertical crop.
>
> Photoreal, shot on 35mm, shallow depth of field, warm and quiet. Editorial
> fashion film, not an advertisement. No text, no captions, no logos, no
> graphics, no on-screen titles. No cuts — one continuous take. The final frame
> should return to the opening framing so the clip loops without a visible jump.

## Option B — the detail (safest crop, most abstract)

> Extreme close, slow motion: cream linen and dark wool moving in warm low light.
> The weave of the cloth, the edge of a lapel, the fall of a sleeve, a hand
> settling a cuff. Everything is fabric, light and shadow — no face, no full
> figure. Warm afternoon light rakes across the surface and slowly deepens as if
> a cloud were crossing the sun, then recovers.
>
> COMPOSITION IS CRITICAL: keep the subject in the CENTRAL THIRD of the frame
> throughout; the outer thirds should hold only soft shadow and out-of-focus
> ground, so the shot reads identically whether it is cropped wide or tall.
>
> Photoreal macro, 35mm, shallow depth of field, no stylisation. No text, no
> captions, no logos, no graphics. One continuous take, no cuts. The final frame
> should match the first so it loops seamlessly.

---

## What to send back

The mp4, uncropped and ungraded, highest quality Veo offers. I will strip the
audio, cut a poster from the first frame, and wire it in — the hero reads its
source from one line in `app/page.tsx`, so the swap is a one-line change.

## What makes one unusable

- **Anything important outside the central third.** It will not exist on a phone.
- **A cut.** The hero loops; a cut inside it reads as a glitch every 8 seconds.
- **On-screen text or a title card.** There is no headline over this section by
  design, and burned-in type cannot be removed or translated.
- **A hard camera move** — a whip, a crane, a rack. It loops, so it comes back
  to the start every few seconds and a big move makes that obvious.

A visible loop seam is fine. Tell me and I will cross-dissolve it.
