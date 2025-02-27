import { Canvas } from "@react-three/fiber";
import MainMenu from './MainMenu';
import './App.css'


export default function App() {
  return (
    <div className="relative h-screen w-screen">
      <Canvas className="absolute top-0 left-0 w-full h-full">
        <mesh>
          <boxGeometry args={[2, 2, 2]} />
          <meshPhongMaterial />
        </mesh>
        <ambientLight intensity={0.1} />
        <directionalLight position={[0, 0, 5]} color="gray" />
      </Canvas>
      <div className="absolute inset-0 z-10 flex items-center justify-center">
        <MainMenu />
      </div>
    </div>
  );
}
