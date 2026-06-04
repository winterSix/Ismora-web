'use client';

import { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import type { Mesh } from 'three';

export type Shape3D = 'diamond' | 'orb' | 'structure' | 'swirl';

function SpinningMesh({ shape, speed }: { shape: Shape3D; speed: number }) {
  const ref = useRef<Mesh>(null!);

  useFrame((_, delta) => {
    ref.current.rotation.y += delta * speed;
  });

  return (
    <mesh ref={ref}>
      {/* diamond → 8-face octahedron = classic gem shape */}
      {shape === 'diamond' && <octahedronGeometry args={[1, 0]} />}
      {/* orb → smooth sphere */}
      {shape === 'orb' && <sphereGeometry args={[1, 64, 64]} />}
      {/* structure → 20-face icosahedron = multifaceted tech shape */}
      {shape === 'structure' && <icosahedronGeometry args={[1, 0]} />}
      {/* swirl → torus knot = continuous looping form */}
      {shape === 'swirl' && <torusKnotGeometry args={[0.65, 0.25, 128, 16, 2, 3]} />}

      {shape === 'diamond' ? (
        /* Iridescent crystal gem — facets shimmer through the spectrum as it
           spins, with a glassy clearcoat for a polished-diamond finish. */
        <meshPhysicalMaterial
          color="#a9deff"
          metalness={0.2}
          roughness={0.02}
          reflectivity={1}
          clearcoat={1}
          clearcoatRoughness={0.03}
          iridescence={1}
          iridescenceIOR={2.0}
          iridescenceThicknessRange={[120, 880]}
          emissive="#0f2a4a"
          emissiveIntensity={0.35}
        />
      ) : (
        <meshStandardMaterial
          color="#cc000e"
          metalness={0.75}
          roughness={0.12}
          emissive="#3a0005"
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
}: {
  shape: Shape3D;
  size?: number;
  speed?: number;
}) {
  return (
    <div style={{ width: size, height: size }}>
      <Canvas
        gl={{ alpha: true, antialias: true }}
        camera={{ position: [0, 0.8, 3.2], fov: 44 }}
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
          color={shape === 'diamond' ? '#7aa8ff' : '#ff2200'}
        />
        {/* Rim light — below, for depth */}
        <pointLight
          position={[0, -3, 1]}
          intensity={0.5}
          color={shape === 'diamond' ? '#aaaaff' : '#ff0000'}
        />
        {/* Diamond-only sparkle lights — coloured glints sweep the facets */}
        {shape === 'diamond' && (
          <>
            <pointLight position={[-3, 2, 2]} intensity={1.1} color="#ff4fd8" />
            <pointLight position={[3, -1.5, 2]} intensity={1.0} color="#4fe8ff" />
          </>
        )}
        <Suspense fallback={null}>
          <SpinningMesh shape={shape} speed={speed} />
        </Suspense>
      </Canvas>
    </div>
  );
}
