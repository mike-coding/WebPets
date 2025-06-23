import { useNavigationContext, useUserDataContext } from "../hooks/AppContext";
import Tooltip from "./ToolTip";
import { useState } from "react";

// Import all egg images using Vite's import.meta.glob
const eggModules = import.meta.glob('/src/sprites/UI/egg_*.png', { eager: true });
const eggUrlMap = Object.fromEntries(
  Object.entries(eggModules).map(([path, mod]) => {
    // Extract the egg number from the filename
    const match = path.match(/egg_(\d+)\.png$/);
    return match ? [match[1], mod.default] : [null, null];
  })
);

function EggCard({ id, hoverTip }) {
    const { navigation, navigateTo } = useNavigationContext();
    const { userData, setUserData, updateUserData } = useUserDataContext();
    const [showTooltip, setShowTooltip] = useState(false);

    function SelectEgg() {
      const newEgg = {
        evolution_id: [0, id],
        name: "Egg",
        level: 1,
        xp: 0,
        hunger: 1.0,
        happiness: 2,
        abilities: []
      };

      if (userData) {
        const updatedPets = [...userData.pets, newEgg];
        updateUserData({
          completed_tutorial: true,
          pets: updatedPets,
        });
      }
      navigateTo("main", "default");
    }

    // Use the imported URL for the egg image
    const eggImgUrl = eggUrlMap[id];    return (
      <div 
        className="relative w-[200px] h-[200px] sm:w-[25vh] sm:h-[25vh] flex flex-row bg-gray-900/30 shadow-md rounded-sm justify-center items-center transform transition duration-200 hover:scale-110 hover:cursor-default hover:bg-gray-900/50 select-none active:scale-100"
        onClick={SelectEgg}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <img 
          src={eggImgUrl}
          className="w-[160px] h-[160px] sm:w-[20vh] sm:h-[20vh]"
          style={{ imageRendering: "pixelated" }}
          alt={`Egg ${id}`}
        />
        {showTooltip && <Tooltip text={hoverTip} />}
      </div>
    );
}

export default EggCard;