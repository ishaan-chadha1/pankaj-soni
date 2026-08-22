"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

export type FieldState = {
  a: string;
  b: string;
  c: string;
  turbulence: number;
  density: number;
};

const vertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

/**
 * Domain-warped fbm. Two warp passes is what separates "smoke" from "noise" —
 * the second pass bends the first, which is what produces the long silk-like
 * filaments rather than uniform cloud.
 */
const fragment = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform float uTurb;
  uniform float uDensity;
  uniform float uAspect;
  uniform vec2  uMouse;
  uniform vec3  uA;
  uniform vec3  uB;
  uniform vec3  uC;

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
    float v = 0.0;
    float a = 0.5;
    mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
    for (int i = 0; i < 6; i++) {
      v += a * noise(p);
      p = m * p;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 uv = vUv;
    uv.x *= uAspect;

    vec2 mouse = uMouse;
    mouse.x *= uAspect;

    float t = uTime * 0.055;

    // first warp
    vec2 q = vec2(
      fbm(uv * 1.6 + t),
      fbm(uv * 1.6 + vec2(5.2, 1.3) - t)
    );

    // second warp, bent by the first
    vec2 r = vec2(
      fbm(uv * 1.9 + uTurb * q + vec2(1.7, 9.2) + t * 1.35),
      fbm(uv * 1.9 + uTurb * q + vec2(8.3, 2.8) - t * 1.05)
    );

    float f = fbm(uv * 1.45 + uTurb * r);

    // the cursor displaces the field like a hand across cloth
    float md = length(uv - mouse);
    f += 0.15 * exp(-md * 2.7) * sin(uTime * 0.75 - md * 7.0);

    // Light-first composition: rather than painting smoke onto black, this
    // TINTS paper. Each material pulls the sheet a limited distance from white,
    // which is what keeps the field luminous instead of muddy.
    vec3 paper = vec3(0.980, 0.969, 0.949);

    vec3 col = paper;
    col = mix(col, uA, clamp(f * f * 1.9, 0.0, 1.0) * 0.62);
    col = mix(col, uB, clamp(length(r) * 0.62, 0.0, 1.0) * 0.44);
    col = mix(col, uC, clamp(pow(f, 2.4), 0.0, 1.0) * 0.38);

    // where density peaks the sheet bleaches back toward white
    col = mix(col, vec3(1.0), clamp(pow(f, 4.0) * uDensity, 0.0, 1.0) * 0.55);

    // a single darker filament along one iso-band, so the field has a drawn
    // line in it — on a pale ground this has to subtract, not glow
    float fil = smoothstep(0.60, 0.69, f) - smoothstep(0.69, 0.79, f);
    col -= vec3(0.16, 0.15, 0.12) * fil * 0.5;

    // the cursor lifts the sheet rather than lighting it
    col = mix(col, vec3(1.0), exp(-md * 4.2) * 0.22);

    // inverse vignette: edges settle, centre stays open
    vec2 d = vUv - 0.5;
    col -= dot(d, d) * 0.14;

    // grain, so flat regions never band on wide-gamut panels
    col += (hash(vUv * 937.0 + fract(uTime) * 3.1) - 0.5) * 0.028;

    gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
  }
`;

function Plane({ state }: { state: FieldState }) {
  const { viewport, size } = useThree();
  const mat = useRef<THREE.ShaderMaterial>(null);

  // The frame loop reads the newest props from here. Writing it in an effect
  // rather than during render keeps render pure — the values are only ever
  // consumed inside useFrame, which runs after commit.
  const latest = useRef(state);
  useEffect(() => {
    latest.current = state;
  }, [state]);

  // Scratch instances so the loop never allocates. Mutated only in useFrame.
  const scratch = useMemo(
    () => ({
      color: new THREE.Color(),
      mouse: new THREE.Vector2(0.5, 0.5),
    }),
    []
  );

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uTurb: { value: state.turbulence },
      uDensity: { value: state.density },
      uAspect: { value: 1 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uA: { value: new THREE.Color(state.a) },
      uB: { value: new THREE.Color(state.b) },
      uC: { value: new THREE.Color(state.c) },
    }),
    // Built once; every later change is lerped in useFrame.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useFrame((st, dt) => {
    const u = mat.current?.uniforms;
    if (!u) return;
    const s = latest.current;
    // Frame-rate independent approach, so the morph reads the same at 60 and 120fps.
    const k = Math.min(1, dt * 1.6);

    u.uTime.value += dt;
    u.uAspect.value = size.width / Math.max(1, size.height);

    (u.uA.value as THREE.Color).lerp(scratch.color.set(s.a), k);
    (u.uB.value as THREE.Color).lerp(scratch.color.set(s.b), k);
    (u.uC.value as THREE.Color).lerp(scratch.color.set(s.c), k);
    u.uTurb.value += (s.turbulence - u.uTurb.value) * k;
    u.uDensity.value += (s.density - u.uDensity.value) * k;

    // pointer is in NDC; the shader wants 0..1
    scratch.mouse.set(st.pointer.x * 0.5 + 0.5, st.pointer.y * 0.5 + 0.5);
    (u.uMouse.value as THREE.Vector2).lerp(scratch.mouse, Math.min(1, dt * 2.4));
  });

  return (
    <mesh scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        ref={mat}
        vertexShader={vertex}
        fragmentShader={fragment}
        uniforms={uniforms}
      />
    </mesh>
  );
}

export default function Field({ state }: { state: FieldState }) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      gl={{ antialias: false, alpha: false, powerPreference: "high-performance" }}
      camera={{ position: [0, 0, 1], fov: 50 }}
      style={{ position: "absolute", inset: 0 }}
    >
      <Plane state={state} />
    </Canvas>
  );
}
