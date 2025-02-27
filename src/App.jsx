import MainMenu from './MainMenu';
import './App.css'
import GameEnvironment from "./GameEnvironment";


export default function App() {
  return (
    <div className="relative h-screen w-screen">
      <GameEnvironment className="GAME CONTENT____ absolute top-0 left-0 w-full h-full"/>
      <div className="UI OVERLAY___ absolute inset-0 z-10 flex items-center justify-center">
        <MainMenu />
      </div>
    </div>
  );
}
