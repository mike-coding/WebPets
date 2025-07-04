import React, { useMemo } from "react";
import Poop from "./Poop";
import { useUserDataContext } from "../hooks/AppContext";

export default function PoopSpawner() {
  const { userData } = useUserDataContext();
  
  // Get all temporary home objects (poops)
  const poops = useMemo(() => {
    if (!userData?.home_objects) return [];
    const filteredPoops = userData.home_objects.filter(obj => 
      obj.type === 'temporary' && obj.object_id === 1 // poo_s
    );
    return filteredPoops;
  }, [userData?.home_objects]);

  return (
    <>
      {/* Render all poops from HomeObjects */}
      {poops.map((poop) => (
        <Poop
          key={poop.id}
          poopId={poop.id} // Pass the poop ID for cleanup
          size={'s'} // All poops are small for now (object_id 1 = poo_s)
          position={[poop.x, poop.y, 0.03]} // Use HomeObject x,y position
        />
      ))}
    </>
  );
}
