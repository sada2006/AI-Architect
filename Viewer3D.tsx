"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Center, useTexture } from "@react-three/drei";
import { Suspense } from "react";

// Inner mesh component to handle dynamic texture compilation hooks safely
function ArchitecturalMesh({ imageUrl }: { imageUrl: string | null }) {
  // If a Clipdrop asset exists, map it; otherwise load the fallback system asset
  const texture = useTexture(
    imageUrl || "https://images.stockcake.com/public/9/d/2/9d20acfd-772f-4273-8d0a-f37c179e526d_large/skyscraper-design-blueprint-stockcake.jpg"
  );

  return (
    <mesh castShadow receiveShadow>
      {/* Structural panel dimensions for clean architectural preview massing */}
      <boxGeometry args={[3.2, 2.2, 0.1]} /> 
      <meshStandardMaterial 
        map={texture}
        roughness={0.3}
        metalness={0.2}
      />
    </mesh>
  );
}

export default function Viewer3D({ imageUrl }: { imageUrl: string | null }) {
  return (
    <div className="w-full h-full bg-slate-900 rounded-xl relative overflow-hidden">
      <Canvas camera={{ position: [0, 0, 4], fov: 50 }}>
        {/* Crisp Studio Presentation Lighting */}
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 5, 5]} intensity={1.2} />
        <directionalLight position={[-5, -5, -5]} intensity={0.4} />
        <pointLight position={[0, 3, 0]} intensity={0.6} />

        <Suspense fallback={
          <mesh>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#0ea5e9" wireframe />
          </mesh>
        }>
          <Center>
            <ArchitecturalMesh imageUrl={imageUrl} />
          </Center>
        </Suspense>

        {/* 360-Degree Interactive Rotation Orbit controls */}
        <OrbitControls 
          enablePan={true} 
          enableZoom={true} 
          minDistance={1.5} 
          maxDistance={10} 
        />
      </Canvas>
      <div className="absolute bottom-4 left-4 bg-black/60 text-white text-[11px] px-3 py-1.5 rounded-md backdrop-blur-sm pointer-events-none">
        🖱️ Left Click + Drag to spin 360° | Scroll to Zoom
      </div>
    </div>
  );
}