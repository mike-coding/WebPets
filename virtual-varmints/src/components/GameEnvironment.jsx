import { Canvas } from "@react-three/fiber";
import { LightWithHelper } from "../sceneElements/LightWithHelper";
import HomeEnvironment from "../scenes/Home";

export default function GameEnvironment() {
  return (
    <Canvas shadows camera={{ position: [0, -20, 20], fov: 20 }} gl={{ preserveDrawingBuffer: false, alpha: false }} onCreated={({ gl }) => {gl.autoClear = false;}}>
        <color attach="background" args={['#000000']} />  
        <HomeEnvironment/>
        <ambientLight intensity={1.5} />
        <directionalLight intensity={2} position={[0, -10, 10]} castShadow/>
    </Canvas>
  );
}
