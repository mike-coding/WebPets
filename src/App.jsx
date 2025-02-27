import { Canvas } from "@react-three/fiber";
import MainMenu from './MainMenu';
import './App.css'
import TiledGround from "./TiledGround";


export default function App() {
  return (
    <div className="relative h-screen w-screen">
      <Canvas className="GAME CONTENT____ absolute top-0 left-0 w-full h-full">
        <TiledGround/>
        <ambientLight intensity={2.5} />
      </Canvas>
      <div className="UI OVERLAY___ absolute inset-0 z-10 flex items-center justify-center">
        <MainMenu />
      </div>
    </div>
  );
}
