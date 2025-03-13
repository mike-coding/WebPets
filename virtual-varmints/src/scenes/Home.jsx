import React, { useMemo } from "react";
import TiledGround from "../components/TiledGround";
import Tree from "../models/tree";
import VarmintSpawner from "../components/VarmintSpawner";
import InstancedTrees from "../sceneElements/InstancedHomeTrees";

export default function HomeEnvironment() {
  return (
    <>
      React.memo(<TiledGround patternWidth={25} patternHeight={20} />
      <InstancedTrees/>)
      <VarmintSpawner/>
    </>
  );
}