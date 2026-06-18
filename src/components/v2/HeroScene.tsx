'use client';

import { memo, useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';

/* ============================================================
   HeroScene — the living backdrop of the hero panel.
   Replaces the static terrain PNG with a real-time scene:
   • a GPU-displaced dot-matrix terrain that flows toward the
     camera (the brand's red "data landscape")
   • a procedural red nebula sky
   • drifting ember particles
   • subtle mouse-parallax + scroll dolly on the camera
   ============================================================ */

const NOISE_GLSL = /* glsl */ `
  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
               mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
  }
  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 4; i++) {
      v += a * noise(p);
      p *= 2.02;
      a *= 0.5;
    }
    return v;
  }
`;

/* ── Terrain: a plane of points displaced by flowing fbm noise.
      Flat valley down the middle, ridges rising at the edges —
      the same composition as the old PNG, but alive. ── */
function Terrain() {
  const matRef = useRef<THREE.ShaderMaterial>(null!);

  const { geometry, material } = useMemo(() => {
    const geometry = new THREE.PlaneGeometry(46, 28, 300, 185);
    const material = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: 1 },
      },
      vertexShader: /* glsl */ `
        uniform float uTime;
        uniform float uPixelRatio;
        varying float vElev;
        varying float vFade;
        ${NOISE_GLSL}
        void main() {
          vec3 pos = position;
          float drift = uTime * 0.45;
          vec2 p = vec2(pos.x * 0.22, (pos.y + drift) * 0.22);
          // valley: flat centre channel, mountains rising toward the edges
          float ridge = smoothstep(1.4, 10.5, abs(pos.x));
          float elev = fbm(p) * mix(0.22, 3.4, ridge);
          elev += fbm(p * 3.1) * 0.14;
          pos.z += elev;
          vElev = elev;

          vec4 mv = modelViewMatrix * vec4(pos, 1.0);
          float dist = -mv.z;
          // fade out toward the horizon, and melt the foreground into black
          // well before the grid gets close enough to read as sparse dots
          vFade = smoothstep(32.0, 10.0, dist) * smoothstep(2.6, 6.5, dist);
          gl_PointSize = min(uPixelRatio * (1.1 + vElev * 0.55) * (16.0 / dist), 3.2 * uPixelRatio);
          gl_Position = projectionMatrix * mv;
        }
      `,
      fragmentShader: /* glsl */ `
        varying float vElev;
        varying float vFade;
        void main() {
          vec2 c = gl_PointCoord - 0.5;
          if (dot(c, c) > 0.25) discard;
          vec3 deep = vec3(0.32, 0.015, 0.02);
          vec3 hot  = vec3(1.0, 0.16, 0.10);
          vec3 col = mix(deep, hot, clamp(vElev * 0.45, 0.0, 1.0));
          gl_FragColor = vec4(col, vFade * 0.85);
        }
      `,
    });
    return { geometry, material };
  }, []);

  useFrame((state, delta) => {
    matRef.current.uniforms.uTime.value += Math.min(delta, 1 / 30);
    matRef.current.uniforms.uPixelRatio.value = state.viewport.dpr;
  });

  return (
    <points
      geometry={geometry}
      rotation-x={-Math.PI / 2}
      position={[0, -1.45, -7]}
    >
      <primitive object={material} attach="material" ref={matRef} />
    </points>
  );
}

/* ── Sky: a huge backdrop plane with slow-rolling red nebula clouds. ── */
function NebulaSky() {
  const matRef = useRef<THREE.ShaderMaterial>(null!);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        depthWrite: false,
        uniforms: { uTime: { value: 0 } },
        vertexShader: /* glsl */ `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: /* glsl */ `
          uniform float uTime;
          varying vec2 vUv;
          ${NOISE_GLSL}
          void main() {
            vec2 p = vUv * vec2(6.0, 2.6);
            float t = uTime * 0.03;
            float clouds = fbm(p + vec2(t, -t * 0.6) + fbm(p * 1.7 - t) * 0.9);
            // brighter toward the horizon (bottom of the plane)
            float horizon = pow(1.0 - vUv.y, 2.2);
            float glow = clouds * (0.25 + horizon * 1.1);
            vec3 col = mix(vec3(0.0), vec3(0.62, 0.03, 0.04), glow);
            col += vec3(0.9, 0.10, 0.06) * pow(horizon, 3.0) * clouds * 0.7;
            // fade ALL the plane's edges into the black backdrop so no hard
            // seam ever shows, whatever the viewport aspect ratio
            float edge = smoothstep(0.0, 0.18, vUv.x) * smoothstep(1.0, 0.82, vUv.x)
                       * smoothstep(1.0, 0.86, vUv.y) * smoothstep(0.0, 0.14, vUv.y);
            gl_FragColor = vec4(col * edge, 1.0);
          }
        `,
      }),
    []
  );

  useFrame((_, delta) => {
    matRef.current.uniforms.uTime.value += Math.min(delta, 1 / 30);
  });

  return (
    // oversized and pushed low so its edges sit outside the frustum even on
    // very wide or very tall viewports
    <mesh position={[0, 2.5, -30]}>
      <planeGeometry args={[130, 52]} />
      <primitive object={material} attach="material" ref={matRef} />
    </mesh>
  );
}

/* ── Embers: sparse red particles drifting in the air. ── */
function Embers() {
  const ref = useRef<THREE.Points>(null!);

  const geometry = useMemo(() => {
    const COUNT = 320;
    // mulberry32 — deterministic, so re-renders always produce the same field
    let seed = 1973;
    const rand = () => {
      seed |= 0;
      seed = (seed + 0x6d2b79f5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
    const positions = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      positions[i * 3 + 0] = (rand() - 0.5) * 26;
      positions[i * 3 + 1] = rand() * 7 - 1.2;
      positions[i * 3 + 2] = -rand() * 20 + 2;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geo;
  }, []);

  useFrame((state) => {
    ref.current.rotation.y = state.clock.elapsedTime * 0.012;
    ref.current.position.y = Math.sin(state.clock.elapsedTime * 0.18) * 0.25;
  });

  return (
    <points ref={ref} geometry={geometry}>
      <pointsMaterial
        size={0.045}
        color="#ff4a38"
        transparent
        opacity={0.5}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  );
}

/* ── Camera rig: mouse parallax + a slow dolly-in as the hero is scrolled. ── */
function CameraRig({ progressRef }: { progressRef: React.MutableRefObject<number> }) {
  useFrame((state, delta) => {
    const k = 1 - Math.exp(-3.2 * delta); // framerate-independent lerp
    const p = progressRef.current;
    const cam = state.camera;
    cam.position.x += (state.pointer.x * 0.55 - cam.position.x) * k;
    cam.position.y += (0.85 + state.pointer.y * 0.22 - cam.position.y) * k;
    cam.position.z += (6.2 - p * 0.9 - cam.position.z) * k;
    cam.lookAt(0, 0.15, -7);
  });
  return null;
}

function HeroSceneImpl({ progress, active }: { progress: number; active: boolean }) {
  // useFrame consumers read the latest progress through a ref so scroll
  // re-renders don't churn the three.js tree.
  const progressRef = useRef(progress);
  useEffect(() => {
    progressRef.current = progress;
  }, [progress]);

  return (
    <div aria-hidden style={{ position: 'absolute', inset: 0, background: '#000' }}>
      <Canvas
        frameloop={active ? 'always' : 'never'}
        gl={{ alpha: false, antialias: true }}
        camera={{ position: [0, 0.85, 6.2], fov: 50, near: 0.1, far: 80 }}
        style={{ width: '100%', height: '100%' }}
        dpr={[1, 1.75]}
      >
        <color attach="background" args={['#000000']} />
        <NebulaSky />
        <Terrain />
        <Embers />
        <CameraRig progressRef={progressRef} />
      </Canvas>
      {/* bottom fade so the terrain melts into the page's black base */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0) 30%, rgba(0,0,0,0) 68%, rgba(0,0,0,0.8) 100%)',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}

export const HeroScene = memo(HeroSceneImpl);
