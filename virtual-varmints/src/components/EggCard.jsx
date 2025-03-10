import { useNavigationContext, useUserDataContext } from "../hooks/AppContext";
import Tooltip from "./ToolTip";
import { useState } from "react";

function EggCard({ id, hoverTip }) {
    const { navigation, navigateTo } = useNavigationContext();
    const { userData, setUserData } = useUserDataContext();
    const [showTooltip, setShowTooltip] = useState(false);
    function SelectEgg(){
        const newEgg = {
            evolution_id: [0, id],
            name: "Egg", // You could update this as needed.
            level: 1,
            xp: 0,
            hunger: 1.0,      
            happiness: 2,    
            abilities: []
          };
      
          // Call API to update the user's userdata by adding the new egg.
          // We assume our update endpoint (PUT /userdata/<user_id>) will add new varmints if they lack an id.
          fetch(`http://localhost:5000/userdata/${userData.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                completed_tutorial: true,
                varmints: [newEgg]
            })
          })
            .then((res) => res.json())
            .then((updatedData) => {
              // Update our context with the new userdata from the server.
              setUserData(updatedData);
              // Navigate to the main page, default subpage.
              navigateTo("main", "default");
            })
            .catch((err) => {
              console.error("Error selecting egg:", err);
        });
        navigateTo("main", "default")
    }
    return (
    <div 
    className="relative w-[25vh] h-[25vh] flex flex-row bg-gray-900/30 shadow-md rounded-sm justify-center items-center transform transition duration-200 hover:scale-110 hover:cursor-default hover:bg-gray-900/50 select-none active:scale-100"
    onClick={SelectEgg}
    onMouseEnter={() => setShowTooltip(true)}
    onMouseLeave={() => setShowTooltip(false)}
    >
        <img 
        src = {`/sprites/varmints/0/${id}/0.png`}
        className="w-[20vh] h-[20vh]"
        style={{ imageRendering: "pixelated" }}
        />
        {showTooltip && <Tooltip text={hoverTip} />}
    </div>
    );
}

export default EggCard