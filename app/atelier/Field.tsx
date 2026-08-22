"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

export type FieldState = {
  /** Warp yarn colour (runs with the length of the cloth). */
  warp: string;
  /** Weft yarn colour (runs across it). */
  weft: string;
  /** What shows through the gaps. */
  ground: string;
  /** 0 plain · 1 twill · 2 satin · 3 leno · 4 gabardine · 5 napped */
  weave: number;
  /** Threads visible across the frame. Lower = closer inspection. */
  threads: number;
  /** Raised fibre lying over the structure. */
  nap: number;
  /** How hard the surface throws light back. */
  sheen: number;
  /** Openness of the set — leno and loose weaves show ground between yarns. */
  openness: number;
};

const vertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

/**
 * A woven surface, built thread by thread.
 *
 * The previous version of this shader was domain-warped fbm — smoke. It was
 * written for a perfume and said nothing about cloth: changing the weave only
 * changed a colour. This builds the real thing. Every fragment works out which
 * yarn it is standing on, whether that yarn passes over or under at this
 * crossing, and shades it as a rounded tube lit from the upper left.
 *
 * The interlacing pattern IS the weave. Plain alternates every crossing; twill
 * steps one thread per row, which is what draws the diagonal; satin binds only
 * once every five, leaving long floats that catch light and give it its shine.
 */
const fragment = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform float uAspect;
  uniform float uWeave;
  uniform float uThreads;
  uniform float uNap;
  uniform float uSheen;
  uniform float uOpen;
  uniform vec2  uMouse;
  uniform vec3  uWarp;
  uniform vec3  uWeft;
  uniform vec3  uGround;

  varying vec2 vUv;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }

  float fbm(vec2 p) {
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 5; i++) { v += a * noise(p); p *= 2.03; a *= 0.5; }
    return v;
  }

  /* 1.0 where the warp passes over the weft at this crossing. */
  float interlace(vec2 cell, float w) {
    if (w < 0.5)  return mod(cell.x + cell.y, 2.0) < 1.0 ? 1.0 : 0.0;              // plain
    if (w < 1.5)  return mod(cell.x - cell.y, 4.0) < 2.0 ? 1.0 : 0.0;              // twill 2/2
    if (w < 2.5)  return mod(cell.x + 2.0 * cell.y, 5.0) < 1.0 ? 1.0 : 0.0;        // satin, long weft floats
    if (w < 3.5)  return mod(floor(cell.x * 0.5) + cell.y, 2.0) < 1.0 ? 1.0 : 0.0; // leno, paired warps
    if (w < 4.5)  return mod(cell.x - 2.0 * cell.y, 3.0) < 2.0 ? 1.0 : 0.0;        // gabardine, steep twill
    return mod(cell.x + cell.y, 2.0) < 1.0 ? 1.0 : 0.0;                            // napped, plain beneath
  }

  void main() {
    vec2 uv = vUv;
    vec2 mouse = uMouse;

    /* A hand pressing the cloth: the weave stretches around the cursor rather
       than the whole sheet sliding. */
    vec2 toM = (uv - mouse) * vec2(uAspect, 1.0);
    float md = length(toM);
    float press = exp(-md * 5.0) * 0.055;
    uv -= normalize(toM + 1e-6) * press;

    /* Cloth is never perfectly on-grain — a slow wander keeps it from reading
       as printed graph paper. */
    uv += (fbm(uv * 3.0 + uTime * 0.02) - 0.5) * 0.012;

    vec2 g = vec2(uv.x * uAspect, uv.y) * uThreads;
    vec2 cell = floor(g);
    vec2 f = fract(g);

    float warpOver = interlace(cell, uWeave);

    /* Each yarn is a rounded tube: brightest along its spine, falling away to
       the shadow where it passes under its neighbour. */
    float warpTube = sin(f.x * 3.14159);
    float weftTube = sin(f.y * 3.14159);

    /* Irregularity per thread — real yarn is not uniform. Kept very small:
       at 0.14 the random striping ran in BOTH directions at once, and random
       stripes crossed with random stripes is how you draw a check. It buried
       the weave under a plaid. */
    float warpVar = 0.97 + 0.03 * hash(vec2(cell.x, 7.0));
    float weftVar = 0.97 + 0.03 * hash(vec2(3.0, cell.y));

    float onWarp = warpOver;
    float tube = mix(weftTube * weftVar, warpTube * warpVar, onWarp);
    vec3 yarn = mix(uWeft, uWarp, onWarp);

    /* Openness: the set loosens and ground shows in the gaps between yarns. */
    float cover = smoothstep(0.0, 0.35 + uOpen * 0.45, mix(weftTube, warpTube, onWarp));
    vec3 col = mix(uGround, yarn, cover);

    /* The interlacing itself, drawn as tone.
     *
     * Shading each crossing as an isolated tube was not enough: a twill's
     * diagonal only exists because runs of floats LINE UP, and cells shaded in
     * isolation never merge into that line. Giving warp-over and weft-over
     * faces a different value draws the pattern directly — which is the
     * diagonal in a twill, the scattered binding points in a satin, and the
     * even alternation in a plain weave. */
    col *= mix(0.82, 1.14, warpOver);

    /* Light from the upper left, along the yarn that is on top. */
    float lift = pow(clamp(tube, 0.0, 1.0), 1.6);
    /* Deliberately gentle. Every crossing carries a tube highlight, so at full
       strength they tile into a regular grid that reads louder than the weave
       itself — the pattern has to win, not the individual thread. */
    col *= 0.88 + 0.20 * lift;

    /* Shadow in the trough where the lower yarn dives under. */
    float trough = 1.0 - pow(clamp(mix(warpTube, weftTube, onWarp), 0.0, 1.0), 2.0);
    col *= 1.0 - trough * 0.26;

    /* Sheen runs ALONG the float, which is why satin shines and poplin does
       not: the longer the float, the longer the unbroken highlight. */
    float along = mix(f.x, f.y, onWarp);
    float spec = pow(clamp(sin(along * 3.14159), 0.0, 1.0), 8.0);
    col += uSheen * spec * lift * 0.34;

    /* Raised fibre lying over the structure — brushing and milling. */
    float fuzz = fbm(vec2(uv.x * uAspect, uv.y) * uThreads * 1.6);
    col = mix(col, mix(col, vec3(1.0), 0.5) * (0.9 + 0.2 * fuzz), uNap * 0.75);

    /* The press lifts the cloth toward the light. */
    col = mix(col, vec3(1.0), exp(-md * 5.0) * 0.16);

    /* Settle the edges so the specimen reads as a piece of cloth on a table. */
    vec2 d = vUv - 0.5;
    col -= dot(d, d) * 0.12;

    col += (hash(vUv * 941.0 + fract(uTime) * 3.1) - 0.5) * 0.022;

    gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
  }
`;

function Plane({ state }: { state: FieldState }) {
  const { viewport, size } = useThree();
  const mat = useRef<THREE.ShaderMaterial>(null);

  // The frame loop reads the newest props from here, so render stays pure.
  const latest = useRef(state);
  useEffect(() => {
    latest.current = state;
  }, [state]);

  const scratch = useMemo(
    () => ({ color: new THREE.Color(), mouse: new THREE.Vector2(0.5, 0.5) }),
    []
  );

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uAspect: { value: 1 },
      uWeave: { value: state.weave },
      uThreads: { value: state.threads },
      uNap: { value: state.nap },
      uSheen: { value: state.sheen },
      uOpen: { value: state.openness },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uWarp: { value: new THREE.Color(state.warp) },
      uWeft: { value: new THREE.Color(state.weft) },
      uGround: { value: new THREE.Color(state.ground) },
    }),
    // Built once; everything after is lerped in useFrame.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useFrame((st, dt) => {
    const u = mat.current?.uniforms;
    if (!u) return;
    const s = latest.current;
    const k = Math.min(1, dt * 2.2);

    u.uTime.value += dt;
    u.uAspect.value = size.width / Math.max(1, size.height);

    (u.uWarp.value as THREE.Color).lerp(scratch.color.set(s.warp), k);
    (u.uWeft.value as THREE.Color).lerp(scratch.color.set(s.weft), k);
    (u.uGround.value as THREE.Color).lerp(scratch.color.set(s.ground), k);

    // Thread count eases so magnification feels like moving a lens, not a cut.
    u.uThreads.value += (s.threads - u.uThreads.value) * Math.min(1, dt * 3.2);
    u.uNap.value += (s.nap - u.uNap.value) * k;
    u.uSheen.value += (s.sheen - u.uSheen.value) * k;
    u.uOpen.value += (s.openness - u.uOpen.value) * k;
    // The interlacing pattern is discrete — crossfading it would render a weave
    // that does not exist, so it switches outright.
    u.uWeave.value = s.weave;

    scratch.mouse.set(st.pointer.x * 0.5 + 0.5, st.pointer.y * 0.5 + 0.5);
    (u.uMouse.value as THREE.Vector2).lerp(scratch.mouse, Math.min(1, dt * 3));
  });

  return (
    <mesh scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial ref={mat} vertexShader={vertex} fragmentShader={fragment} uniforms={uniforms} />
    </mesh>
  );
}

export default function Field({ state }: { state: FieldState }) {
  /*
   * Nudge R3F to re-measure once the frame has settled.
   *
   * R3F sizes the drawing buffer from a container measurement taken on mount.
   * That measurement races layout here — the wrapper is an aspect-ratio box
   * inside a grid — and when it loses, the canvas keeps its default 300x150
   * buffer and renders a blurred, upscaled specimen. A resize event makes it
   * measure again, which is verifiably enough to correct it.
   */
  useEffect(() => {
    const nudge = () => window.dispatchEvent(new Event("resize"));
    const raf = requestAnimationFrame(nudge);
    // and once more after webfonts and images have settled the layout
    const t = window.setTimeout(nudge, 400);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(t);
    };
  }, []);

  return (
    <Canvas
      dpr={[1, 2]}
      gl={{ antialias: false, alpha: false, powerPreference: "high-performance" }}
      camera={{ position: [0, 0, 1], fov: 50 }}
      /* This style lands on R3F's wrapper div, not the canvas — the canvas is
         pinned by `.ps-loom canvas` in globals.css. See the note there. */
      style={{ position: "absolute", inset: 0 }}
      resize={{ debounce: 0 }}
    >
      <Plane state={state} />
    </Canvas>
  );
}
