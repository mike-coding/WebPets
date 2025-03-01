import { Canvas } from "@react-three/fiber";
import TiledGround from "./TiledGround";


export default function GameEnvironment() {
  return (
    <Canvas>
        <TiledGround/>
        <ambientLight intensity={2.5} />
    </Canvas>
  );
}
