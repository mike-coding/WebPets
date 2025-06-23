import React, { useMemo } from "react";
import TiledGround from "../sceneElements/TiledGround";
import Tree from "../models/tree";
import PetSpawner from "../sceneElements/PetSpawner";
import InstancedTrees from "../sceneElements/InstancedHomeTrees";

export default function HomeEnvironment() {
  return (
    <>
      React.memo(<TiledGround patternWidth={25} patternHeight={20} />
      <InstancedTrees clearingWidth={3} clearingHeight={7}/>)
      <PetSpawner/>
    </>
  );
}