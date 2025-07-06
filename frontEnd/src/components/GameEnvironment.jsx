import { Canvas } from "@react-three/fiber";
import { LightWithHelper } from "../sceneElements/LightWithHelper";
import HomeEnvironment from "../scenes/Home";
import { Preload } from "@react-three/drei";
import React, { Suspense } from "react"
import { useNavigationContext } from '../hooks/AppContext';
import EndlessRunner from './EndlessRunner_simple';

export default function GameEnvironment() {
  const { navigation } = useNavigationContext();
  
  // If we're in a minigame, render the minigame instead of the Canvas
  if (navigation.activePage === "minigames" && navigation.activeSubPage === "endless_runner") {
    return <EndlessRunner />;
  }
  
  return (
    <Canvas 
      shadows 
      camera={{ position: [0, -20, 40], fov: 9.5 }} 
      gl={{ preserveDrawingBuffer: false, alpha: false }} 
      onCreated={({ gl }) => {gl.autoClear = false;}}
      style={{ pointerEvents: 'auto' }}
    >
      <color attach="background" args={['#000000']} />  
      <HomeEnvironment/>
      <ambientLight intensity={1.5} />
      <directionalLight intensity={2} position={[0, -10, 10]} castShadow/>
    </Canvas>
  );
}
