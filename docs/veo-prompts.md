# Veo image-to-video prompts — the three campaign banners

Upload the matching still, paste the prompt, generate 8s.
`look-01.jpg` → Look I · `look-02.jpg` → Look II · `look-03.jpg` → Look III

Every prompt ends with the same LOCK block. Do not edit it — it is what keeps
the hotspot markers sitting on their garments.

---

## LOCK BLOCK (already appended to all three below)

> Locked-off tripod camera: no pan, no tilt, no zoom, no dolly, no handheld
> shake, no rack focus, no parallax. The subject does not change pose, shift
> weight, take a step, turn the head, raise or lower the hands, or rotate the
> shoulders. Feet, hips, waist, shoulders and head remain in exactly the
> position shown in the source image from the first frame to the last. Garment
> silhouettes and edges do not morph or redraw. No new people, objects, text,
> logos, captions or reflections enter frame. Framing, crop and composition stay
> identical to the source image throughout. Photoreal, shot on 35mm, no
> stylisation. The final frame must match the first frame so the clip loops
> seamlessly.

---

## Look I — "The Long Afternoon"

A still, held moment in a walnut-panelled room on a late summer afternoon. The
only movement is air. The cream linen shirt breathes: the sleeve creases relax
by a millimetre or two, the collar edge lifts faintly in a draught and settles.
One trouser pleat sways very slightly. A few strands of hair move. Warm
low-angle sunlight from a west-facing window rakes across the panelling and
slowly deepens, as if a thin cloud is crossing the sun, then recovers. Dust
motes drift lazily through the light. Everything is slow, quiet and expensive.

Locked-off tripod camera: no pan, no tilt, no zoom, no dolly, no handheld shake, no rack focus, no parallax. The subject does not change pose, shift weight, take a step, turn the head, raise or lower the hands, or rotate the shoulders. Feet, hips, waist, shoulders and head remain in exactly the position shown in the source image from the first frame to the last. Garment silhouettes and edges do not morph or redraw. No new people, objects, text, logos, captions or reflections enter frame. Framing, crop and composition stay identical to the source image throughout. Photoreal, shot on 35mm, no stylisation. The final frame must match the first frame so the clip loops seamlessly.

---

## Look II — "Hand in Pocket"

An interior, unhurried and self-contained. The quietest of the three. The linen
across the shoulder releases its tension a fraction and re-settles. The leather
belt catches a slow-travelling highlight as the ambient light blooms gently
warmer and fades back. The holdall's leather surface shifts its sheen with the
changing light. Almost imperceptible fabric drift at the hem. No wind — this is
still, warm, indoor air. The stillness is the point.

Locked-off tripod camera: no pan, no tilt, no zoom, no dolly, no handheld shake, no rack focus, no parallax. The subject does not change pose, shift weight, take a step, turn the head, raise or lower the hands, or rotate the shoulders. Feet, hips, waist, shoulders and head remain in exactly the position shown in the source image from the first frame to the last. Garment silhouettes and edges do not morph or redraw. No new people, objects, text, logos, captions or reflections enter frame. Framing, crop and composition stay identical to the source image throughout. Photoreal, shot on 35mm, no stylisation. The final frame must match the first frame so the clip loops seamlessly.

---

## Look III — "Before the Car"

The moment before leaving. A door has opened somewhere off-frame and a draught
crosses the room: the cream linen lifts and falls a little more freely than in
the other two frames, the shirt hem stirs, and the holdall's strap sways a few
degrees and comes to rest. The light cools very slightly as the outside air
enters, then warms again. A few strands of hair lift. The body stays completely
planted — only the air has changed.

Locked-off tripod camera: no pan, no tilt, no zoom, no dolly, no handheld shake, no rack focus, no parallax. The subject does not change pose, shift weight, take a step, turn the head, raise or lower the hands, or rotate the shoulders. Feet, hips, waist, shoulders and head remain in exactly the position shown in the source image from the first frame to the last. Garment silhouettes and edges do not morph or redraw. No new people, objects, text, logos, captions or reflections enter frame. Framing, crop and composition stay identical to the source image throughout. Photoreal, shot on 35mm, no stylisation. The final frame must match the first frame so the clip loops seamlessly.

---

## If a generation comes back wrong

- **Model stepped / turned / moved a hand** — regenerate. Do not keep it. Every
  marker is anchored to a body coordinate and will drift off its garment.
- **Camera pushed in or drifted** — regenerate. Scroll-linked Ken Burns already
  runs in CSS; a moving camera doubles it and fights the hotspots.
- **Loop visibly jumps** — usable. Tell me and I will cross-dissolve the seam.
- **Framing came back 16:9 instead of the wide source** — expected, and fine.
  Send it anyway; I re-derive the marker coordinates against the delivered
  frame rather than trusting the source numbers.

## What to send back

Three files, any of mp4/webm/mov, highest quality available. Do not crop,
trim, colour-grade or compress them first — I need the full frame to re-anchor
the markers, and I do the encoding so the three come out matched.
