import React, { useMemo } from "react";
import TiledGround from "../sceneElements/TiledGround";
import Tree from "../models/tree";
import PetSpawner from "../sceneElements/PetSpawner";
import InstancedTrees from "../sceneElements/InstancedHomeTrees";
import Poop from "../sceneElements/Poop";
import { useUserDataContext } from "../hooks/AppContext";

export default function HomeEnvironment() {
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
      <TiledGround patternWidth={25} patternHeight={20} />
      <InstancedTrees clearingWidth={3} clearingHeight={7}/>
      <PetSpawner/>
      
      {/* Render all poops from HomeObjects */}
      {poops.map((poop, index) => (
        <Poop
          poopId={poop.id} // Pass the poop ID for cleanup
          size={'s'} // All poops are small for now (object_id 1 = poo_s)
          position={[poop.x, poop.y, 0.03]} // Use HomeObject x,y position
        />
      ))}
    </>
  );
}