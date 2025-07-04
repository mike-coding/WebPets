import React, { useMemo } from "react";
import TiledGround from "../sceneElements/TiledGround";
import Tree from "../models/tree";
import PetSpawner from "../sceneElements/PetSpawner";
import InstancedTrees from "../sceneElements/InstancedHomeTrees";
import PoopSpawner from "../sceneElements/PoopSpawner";
import { useUserDataContext } from "../hooks/AppContext";

export default function HomeEnvironment() {
  const { userData } = useUserDataContext();
  
  // Define explicit world bounds
  const WORLD_BOUNDS = {
    width: 25,
    height: 20,
    clearingWidth: 3,
    clearingHeight: 7
  };

  return (
    <>
      <TiledGround patternWidth={WORLD_BOUNDS.width} patternHeight={WORLD_BOUNDS.height} />
      <InstancedTrees clearingWidth={WORLD_BOUNDS.clearingWidth} clearingHeight={WORLD_BOUNDS.clearingHeight}/>
      <PoopSpawner />
      <PetSpawner bounds={WORLD_BOUNDS} />
    </>
  );
}