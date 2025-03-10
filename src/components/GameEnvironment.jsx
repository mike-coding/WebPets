import { Canvas } from "@react-three/fiber";
import TiledGround from "./TiledGround";
import Tree from "../models/tree";
import { LightWithHelper } from "../sceneElements/LightWithHelper";
import { OrbitControls } from "@react-three/drei";
import HomeEnvironment from "../scenes/Home";

export default function GameEnvironment() {
  return (
    <Canvas shadows camera={{ position: [0, -20, 20], fov: 20 }}>  
        <HomeEnvironment/>
        <ambientLight intensity={1.5} />
        <directionalLight intensity={2} position={[0, -10, 10]} castShadow/>
    </Canvas>
  );
}
