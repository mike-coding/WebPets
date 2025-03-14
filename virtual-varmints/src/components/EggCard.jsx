import { useNavigationContext, useUserDataContext } from "../hooks/AppContext";
import Tooltip from "./ToolTip";
import { useState } from "react";

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
        const updatedVarmints = [...userData.varmints, newEgg];
        updateUserData({
          completed_tutorial: true,
          varmints: updatedVarmints,
        });
      }
      navigateTo("main", "default");
    }
    return (
    <div 
    className="relative w-[25vh] h-[25vh] flex flex-row bg-gray-900/30 shadow-md rounded-sm justify-center items-center transform transition duration-200 hover:scale-110 hover:cursor-default hover:bg-gray-900/50 select-none active:scale-100"
    onClick={SelectEgg}
    onMouseEnter={() => setShowTooltip(true)}
    onMouseLeave={() => setShowTooltip(false)}
    >
        <img 
        src = {`../src/sprites/UI/egg_${id}.png`}
        className="w-[20vh] h-[20vh]"
        style={{ imageRendering: "pixelated" }}
        />
        {showTooltip && <Tooltip text={hoverTip} />}
    </div>
    );
}

export default EggCard