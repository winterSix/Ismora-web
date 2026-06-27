'use client';

import { memo, useRef, useState, Suspense } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Lightformer } from '@react-three/drei';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js';
import type { Mesh } from 'three';
import { usePerfTier } from './perf';

export type Shape3D = 'diamond' | 'gem' | 'cube' | 'orb' | 'structure' | 'swirl' | 'logo';

/* The brand mark itself, extruded into 3D from the real logo paths. */
const LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1080" viewBox="0 0 1080 1080"><g transform="translate(0,1080) scale(1,-1)"><path d="M 710 331.061 C 706.975 331.535, 678.644 335.108, 647.043 339.002 C 615.441 342.895, 589.367 346.300, 589.099 346.568 C 588.831 346.836, 588.461 371.680, 588.278 401.778 C 588.094 431.875, 587.522 514.767, 587.005 585.983 C 586.489 657.199, 586.389 715.780, 586.783 716.164 C 587.177 716.548, 599.650 715.350, 614.500 713.502 C 629.350 711.654, 658.600 708.039, 679.500 705.469 C 700.400 702.899, 717.583 700.721, 717.685 700.629 C 717.787 700.538, 718.194 669.358, 718.590 631.342 L 719.310 562.221 714.905 559.456 C 712.482 557.936, 697 548.136, 680.500 537.679 C 664 527.222, 641.275 512.824, 630 505.684 C 595.330 483.727, 591 480.834, 591 479.626 C 591 478.845, 599.879 477.371, 617.750 475.184 C 701.848 464.893, 718.563 462.745, 719.161 462.154 C 719.525 461.794, 719.975 432.025, 720.161 396 L 720.500 330.500 718 330.350 C 716.625 330.268, 713.025 330.588, 710 331.061 M 543.500 352.024 C 527 354.124, 498.432 357.708, 480.016 359.989 C 461.600 362.269, 446.399 364.268, 446.236 364.430 C 445.418 365.249, 443.209 731.542, 444.017 732.350 C 444.287 732.621, 456.656 731.334, 471.504 729.492 C 486.352 727.650, 515.600 724.039, 536.500 721.469 C 557.400 718.899, 574.725 716.579, 575 716.315 C 575.275 716.050, 575.500 684.270, 575.500 645.693 L 575.500 575.553 556.500 563.435 C 539.895 552.844, 492.999 523.109, 463.778 504.644 C 458.431 501.265, 454.044 497.973, 454.028 497.329 C 453.992 495.814, 455.594 495.519, 480 492.560 C 549.550 484.126, 575.573 480.774, 576.122 480.177 C 576.465 479.804, 577.021 449.913, 577.358 413.750 L 577.971 348 575.736 348.103 C 574.506 348.160, 560 349.925, 543.500 352.024 M 399 369.487 C 380.575 371.823, 351.775 375.409, 335 377.456 C 318.225 379.504, 304.132 381.530, 303.682 381.958 C 303.231 382.386, 302.462 448.384, 301.972 528.618 C 301.482 608.853, 300.893 691.270, 300.663 711.767 C 300.432 732.402, 300.634 749.274, 301.117 749.572 C 301.596 749.869, 305.479 749.626, 309.744 749.034 C 314.010 748.441, 343.125 744.804, 374.444 740.951 C 405.763 737.098, 431.638 733.695, 431.944 733.390 C 432.250 733.084, 432.660 702.342, 432.856 665.075 L 433.212 597.317 413.356 584.782 C 391.494 570.982, 383.246 565.755, 337.250 536.557 C 320.063 525.647, 306 516.116, 306 515.379 C 306 513.661, 307.195 513.414, 327 511.037 C 364.284 506.561, 433.408 497.922, 433.564 497.719 C 433.656 497.598, 433.905 467.839, 434.116 431.586 C 434.369 388.141, 434.159 365.598, 433.500 365.456 C 432.950 365.337, 417.425 367.151, 399 369.487" fill="#E8201C" fill-rule="evenodd"/></g></svg>`;

let logoGeometryCache: THREE.ExtrudeGeometry | null = null;

/** Extrudes the Ismora logo SVG into a centred, unit-scaled 3D geometry. */
function getLogoGeometry(): THREE.ExtrudeGeometry {
  if (logoGeometryCache) return logoGeometryCache;
  const { paths } = new SVGLoader().parse(LOGO_SVG);
  const shapes = paths.flatMap((p) => SVGLoader.createShapes(p));
  const geometry = new THREE.ExtrudeGeometry(shapes, {
    depth: 80,
    bevelEnabled: true,
    bevelThickness: 10,
    bevelSize: 8,
    bevelSegments: 3,
    curveSegments: 8,
  });
  geometry.center();
  geometry.computeBoundingBox();
  const box = geometry.boundingBox!;
  const maxDim = Math.max(box.max.x - box.min.x, box.max.y - box.min.y);
  const s = 2.15 / maxDim;
  geometry.scale(s, s, s);
  logoGeometryCache = geometry;
  return geometry;
}

/* ── The brand mark: deep ruby glass with an inner red glow. Held perfectly
      still — once it appears it never sways or drifts, on any panel. A small
      fixed yaw/tilt keeps it reading as a 3D mark and catching the key light. ── */
function LogoMesh() {
  return (
    <group rotation={[-0.05, 0.2, 0]}>
      <mesh geometry={getLogoGeometry()}>
        <meshPhysicalMaterial
          color="#c4060f"
          metalness={0.1}
          roughness={0.12}
          transmission={0.4}
          thickness={1.1}
          ior={1.5}
          attenuationColor="#ff3b2e"
          attenuationDistance={1.1}
          clearcoat={1}
          clearcoatRoughness={0.06}
          emissive="#e8201c"
          emissiveIntensity={0.38}
        />
      </mesh>
      {/* ember core lighting the glass from inside */}
      <pointLight position={[0, 0, 1]} intensity={3} distance={4} color="#ff3b2e" />
    </group>
  );
}

function SpinningMesh({
  shape,
  speed,
  crystal,
  color,
  emissive,
}: {
  shape: Shape3D;
  speed: number;
  crystal: boolean;
  color: string;
  emissive: string;
}) {
  const ref = useRef<Mesh>(null!);

  useFrame((_, delta) => {
    // Clamp delta: when a paused (frameloop="never") canvas resumes, R3F can
    // hand us the whole paused interval at once — without this the object snaps
    // to a new rotation. Capping keeps the resume smooth.
    const d = Math.min(delta, 1 / 30);
    ref.current.rotation.y += d * speed;
    // Chunky solids tumble on a second axis for livelier, jewel-like glints.
    if (shape === 'gem' || shape === 'cube' || shape === 'structure') {
      ref.current.rotation.x += d * speed * 0.35;
    }
  });

  return (
    <mesh ref={ref}>
      {/* diamond → 8-face octahedron = classic gem shape */}
      {shape === 'diamond' && <octahedronGeometry args={[1, 0]} />}
      {/* gem → 12-face dodecahedron = rich, faceted showpiece crystal */}
      {shape === 'gem' && <dodecahedronGeometry args={[1, 0]} />}
      {/* cube → beveled box = solid, engineered form */}
      {shape === 'cube' && <boxGeometry args={[1.35, 1.35, 1.35]} />}
      {/* orb → smooth sphere */}
      {shape === 'orb' && <sphereGeometry args={[1, 64, 64]} />}
      {/* structure → 20-face icosahedron = multifaceted tech shape */}
      {shape === 'structure' && <icosahedronGeometry args={[1, 0]} />}
      {/* swirl → torus knot = continuous looping form */}
      {shape === 'swirl' && <torusKnotGeometry args={[0.65, 0.25, 128, 16, 2, 3]} />}

      {crystal ? (
        /* Ruby crystal — red-tinted facets with a glassy clearcoat and a warm
           iridescent shimmer, matching the brand's red/black world. */
        <meshPhysicalMaterial
          color={color}
          metalness={0.25}
          roughness={0.05}
          reflectivity={1}
          clearcoat={1}
          clearcoatRoughness={0.04}
          iridescence={0.55}
          iridescenceIOR={1.6}
          iridescenceThicknessRange={[160, 620]}
          emissive={emissive}
          emissiveIntensity={0.55}
        />
      ) : (
        /* Obsidian — near-black glass that catches red glints (per the Figma
           reference renders: glossy black objects lit from within by red). */
        <meshPhysicalMaterial
          color={color}
          metalness={0.6}
          roughness={0.16}
          clearcoat={1}
          clearcoatRoughness={0.1}
          emissive={emissive}
          emissiveIntensity={0.5}
        />
      )}
    </mesh>
  );
}

/* Procedural studio environment — bright strips above, red walls left/right —
   gives the glass and obsidian materials something real to reflect. */
function BrandEnvironment() {
  return (
    <Environment resolution={64}>
      <Lightformer intensity={2.2} position={[0, 4, 2]} scale={[8, 2, 1]} color="#ffffff" />
      <Lightformer intensity={1.4} position={[-4, 0, 1]} rotation-y={Math.PI / 2} scale={[6, 2, 1]} color="#ff2418" />
      <Lightformer intensity={1.1} position={[4, -1, 1]} rotation-y={-Math.PI / 2} scale={[6, 2, 1]} color="#ff5a3a" />
      <Lightformer intensity={0.6} position={[0, -4, 0]} rotation-x={Math.PI / 2} scale={[8, 4, 1]} color="#2a0508" />
    </Environment>
  );
}

function Object3DViewerImpl({
  shape,
  size = 140,
  speed = 0.55,
  crystal,
  color,
  emissive,
  active = true,
}: {
  shape: Shape3D;
  size?: number;
  speed?: number;
  /** Force the glassy ruby crystal material (default: on for diamond/gem). */
  crystal?: boolean;
  /** Base tint. Defaults to ruby for crystals, obsidian black otherwise. */
  color?: string;
  /** Emissive glow tint. */
  emissive?: string;
  /**
   * Whether this viewer's panel is on screen. When false the render loop is
   * paused (`frameloop="never"`) so off-screen canvases don't burn the GPU —
   * the last frame stays visible, and motion resumes when it becomes active.
   */
  active?: boolean;
}) {
  const useCrystal = crystal ?? (shape === 'diamond' || shape === 'gem');
  const baseColor = color ?? (useCrystal ? '#ff8a80' : '#16161a');
  const emissiveColor = emissive ?? (useCrystal ? '#7a0a10' : '#c4000a');

  const tier = usePerfTier();

  // Lazy mount: each <Canvas> is its own WebGL context (env map, materials and
  // framebuffers resident in VRAM). Building all of them up front is what makes
  // the page lurch on weak GPUs and risks the browser's context limit. Instead
  // we don't create the context until the panel is first reached, then keep it
  // (re-creating on every scroll-back would cost an env-map rebuild). Until
  // then the slot is just an empty, correctly-sized box. Latching during render
  // mounts the canvas in the same paint the panel becomes active.
  const [mounted, setMounted] = useState(active);
  if (active && !mounted) setMounted(true);

  if (!mounted) return <div style={{ width: size, height: size }} aria-hidden />;

  const dpr: [number, number] = tier.level === 'low' ? [1, 1.25] : [1, 1.6];

  return (
    <div style={{ width: size, height: size }}>
      <Canvas
        frameloop={active ? 'always' : 'never'}
        gl={{ alpha: true, antialias: tier.antialias }}
        /* Camera dead-on so the object renders CENTRED in the canvas — this is
           what keeps each 3D vertically aligned with its panel text. The
           x-axis tumble in SpinningMesh supplies the lively 3/4 facet view. */
        camera={{ position: [0, 0, 3.4], fov: 44 }}
        style={{ width: '100%', height: '100%' }}
        dpr={dpr}
      >
        <ambientLight intensity={0.35} />
        {/* Key light — front-top-right, crisp white speculars */}
        <directionalLight position={[3, 4, 3]} intensity={2.2} color="#ffffff" />
        {/* Fill light — back-bottom-left, brand red */}
        <directionalLight position={[-2.5, -2, -2]} intensity={1.0} color="#ff2200" />
        {/* Rim light — below, red depth glow */}
        <pointLight position={[0, -3, 1]} intensity={0.6} color="#ff0000" />
        {/* Sparkle glints sweeping the facets — warm red/amber family */}
        <pointLight position={[-3, 2, 2]} intensity={1.0} color="#ff3b5c" />
        <pointLight position={[3, -1.5, 2]} intensity={0.9} color="#ffb13b" />
        <Suspense fallback={null}>
          <BrandEnvironment />
          {shape === 'logo' ? (
            <LogoMesh />
          ) : (
            <SpinningMesh
              shape={shape}
              speed={speed}
              crystal={useCrystal}
              color={baseColor}
              emissive={emissiveColor}
            />
          )}
        </Suspense>
      </Canvas>
    </div>
  );
}

/**
 * Memoised so the per-frame scroll re-renders of the parent panels don't rebuild
 * the WebGL canvas — it only re-renders when its own props actually change.
 */
export const Object3DViewer = memo(Object3DViewerImpl);
