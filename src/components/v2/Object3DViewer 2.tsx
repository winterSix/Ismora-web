'use client';

import { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import type { Mesh } from 'three';

export type Shape3D = 'diamond' | 'gem' | 'cube' | 'orb' | 'structure' | 'swirl';

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
    ref.current.rotation.y += delta * speed;
    // Chunky solids tumble on a second axis for livelier, jewel-like glints.
    if (shape === 'gem' || shape === 'cube' || shape === 'structure') {
      ref.current.rotation.x += delta * speed * 0.35;
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
        /* Iridescent crystal — facets shimmer through the spectrum as it spins,
           with a glassy clearcoat for a polished, precious finish. */
        <meshPhysicalMaterial
          color={color}
          metalness={0.2}
          roughness={0.02}
          reflectivity={1}
          clearcoat={1}
          clearcoatRoughness={0.03}
          iridescence={1}
          iridescenceIOR={2.0}
          iridescenceThicknessRange={[120, 880]}
          emissive={emissive}
          emissiveIntensity={0.6}
        />
      ) : (
        <meshStandardMaterial
          color={color}
          metalness={0.75}
          roughness={0.12}
          emissive={emissive}
          emissiveIntensity={0.5}
        />
      )}
    </mesh>
  );
}

export function Object3DViewer({
  shape,
  size = 140,
  speed = 0.55,
  crystal,
  color,
  emissive,
}: {
  shape: Shape3D;
  size?: number;
  speed?: number;
  /** Force the glassy iridescent crystal material (default: on for diamond/gem). */
  crystal?: boolean;
  /** Base tint. Defaults to icy blue for crystals, brand red otherwise. */
  color?: string;
  /** Emissive glow tint. */
  emissive?: string;
}) {
  const useCrystal = crystal ?? (shape === 'diamond' || shape === 'gem');
  const baseColor = color ?? (useCrystal ? '#a9deff' : '#cc000e');
  const emissiveColor = emissive ?? (useCrystal ? '#1d4e8a' : '#3a0005');

  return (
    <div style={{ width: size, height: size }}>
      <Canvas
        gl={{ alpha: true, antialias: true }}
        /* Camera dead-on so the object renders CENTRED in the canvas — this is
           what keeps each 3D vertically aligned with its panel text. The
           x-axis tumble in SpinningMesh supplies the lively 3/4 facet view. */
        camera={{ position: [0, 0, 3.4], fov: 44 }}
        style={{ width: '100%', height: '100%' }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={0.45} />
        {/* Key light — front-top-right */}
        <directionalLight position={[3, 4, 3]} intensity={2.4} color="#ffffff" />
        {/* Fill light — back-bottom-left, tinted for material */}
        <directionalLight
          position={[-2.5, -2, -2]}
          intensity={0.9}
          color={useCrystal ? '#7aa8ff' : '#ff2200'}
        />
        {/* Rim light — below, for depth */}
        <pointLight
          position={[0, -3, 1]}
          intensity={0.5}
          color={useCrystal ? '#aaaaff' : '#ff0000'}
        />
        {/* Crystal-only sparkle lights — coloured glints sweep the facets */}
        {useCrystal && (
          <>
            <pointLight position={[-3, 2, 2]} intensity={1.1} color="#ff4fd8" />
            <pointLight position={[3, -1.5, 2]} intensity={1.0} color="#4fe8ff" />
          </>
        )}
        <Suspense fallback={null}>
          <SpinningMesh
            shape={shape}
            speed={speed}
            crystal={useCrystal}
            color={baseColor}
            emissive={emissiveColor}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
