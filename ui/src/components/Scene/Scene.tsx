import * as THREE from "three";
import {  useRef, useState } from "react";
import { Canvas, useFrame, ThreeEvent } from "@react-three/fiber";
import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

// export function Box(props: ThreeElements['mesh']) {
export function Box(props: THREE.Mesh) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);
  useFrame((state, delta) => (meshRef.current.rotation.x += delta));

  return (
    <mesh
      {...props}
      ref={meshRef}
      scale={active ? 1.5 : 1}
      onClick={() => setActive(!active)}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? "hotpink" : "#2f74c0"} />
    </mesh>
  );
}

function Model({ autoRotate, url='/src/components/Scene/loading.glb' }: { autoRotate: boolean, url?: string }) {
  const gltf = useLoader(
    GLTFLoader,
    url ? url : '/src/components/Scene/loading.glb',
    undefined,
    (error) => {
      console.error("An error occurred loading the GLTF model:", error);
    }
  ) as unknown as { scene: THREE.Group };

  const modelRef = useRef<THREE.Group>(null!);
  const [isDragging, setIsDragging] = useState(false);
  const [previousMousePosition, setPreviousMousePosition] = useState({
    x: 0,
    y: 0,
  });

  useFrame((state, delta) => {
    // Only auto-rotate when enabled and not being dragged
    if (autoRotate && !isDragging) {
      modelRef.current.rotation.y += delta * 0.5;
    }
  });

  const handlePointerDown = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    setIsDragging(true);
    setPreviousMousePosition({
      x: event.clientX,
      y: event.clientY,
    });
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  const handlePointerMove = (event: ThreeEvent<PointerEvent>) => {
    if (isDragging) {
      const deltaMove = {
        x: event.clientX - previousMousePosition.x,
        y: event.clientY - previousMousePosition.y,
      };

      modelRef.current.rotation.y += deltaMove.x * 0.01;
      modelRef.current.rotation.x += deltaMove.y * 0.01;

      setPreviousMousePosition({
        x: event.clientX,
        y: event.clientY,
      });
    }
  };

  return (
    <primitive
      ref={modelRef}
      object={gltf.scene}
      position={[0, 0, 0]}
      scale={[2, 2, 2]}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerUp}
    />
  );
}

const Scene = ({sceneUrl}: {sceneUrl?: string}) => {
  const [autoRotate, setAutoRotate] = useState(true);





  return (
    <>
      <button
        onClick={() => setAutoRotate(!autoRotate)}
        style={{
          position: "fixed",
          top: "20px",
          right: "20px",
          zIndex: 1,
          padding: "6px 12px",
          backgroundColor: "white",
          color: "rgb(75, 85, 99)",
          border: "1px solid",
          borderRadius: "9999px",
          cursor: "pointer",
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          fontSize: "18px",
          transition: "background-color 200ms",
          boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        }}
        onMouseOver={(e) =>
          (e.currentTarget.style.backgroundColor = "rgb(243, 244, 246)")
        }
        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "white")}
      >
        {autoRotate ? "Stop Rotation" : "Start Rotation"}
      </button>
      <div
        style={{
          position: "fixed",
          top: 0,
          bottom: 0,
          left: 0,
          width: "100%",
          height: "100vh",
          zIndex: 0,
          touchAction: "none",
        }}
      >
        <Canvas
          style={{ touchAction: "none" }}
          camera={{ position: [0, 0, 5], fov: 75 }}
        >
          <ambientLight intensity={Math.PI / 2} />
          <spotLight
            position={[10, 10, 10]}
            angle={0.15}
            penumbra={1}
            decay={0}
            intensity={Math.PI}
          />
          <pointLight
            position={[-10, -10, -10]}
            decay={0}
            intensity={Math.PI}
          />
          <Model autoRotate={autoRotate} url={sceneUrl} />
        </Canvas>
      </div>
    </>
  );
};

export default Scene;
