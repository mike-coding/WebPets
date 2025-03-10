import React from "react";
import TiledGround from "../components/TiledGround";
import Tree from "../models/tree";
import Varmint from "../sceneElements/Varmint";

export default function HomeEnvironment() {
  const cols = 24; // total columns horizontally
  const rows = 20; // total rows vertically
  const clearingHalfWidth = 8; // clearing half-width (clearing is 16 units wide)
  const clearingHalfHeight = 6; // clearing half-height (clearing is 12 units tall)

  const trees = [];
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      const x = i - cols / 2 + 0.5;
      const z = j - rows / 2 + 0.5;

      // Only render a tree if the tile is outside the clearing.
      if (
        x <= -clearingHalfWidth ||
        x >= clearingHalfWidth ||
        z <= -clearingHalfHeight ||
        z >= clearingHalfHeight
      ) {
        // Random offset for position (±0.25)
        const randomXOffset = (Math.random() - 0.5) * 0.7;
        const randomZOffset = (Math.random() - 0.5) * 0.7;
        const finalX = x + randomXOffset;
        const finalZ = z + randomZOffset;

        // Random Y-axis rotation (±0.2 radians)
        const randomYRotation = (Math.random() - 0.5) * 0.4;

        // Random scale from 0.9 to 1.1
        const randomScale = 0.7 + Math.random() * 0.4;

        trees.push(
          <Tree
            key={`tree-${i}-${j}`}
            position={[finalX, finalZ, 0]}
            rotation={[Math.PI / 2, randomYRotation, 0]}
            scale={[randomScale, randomScale, randomScale]}
          />
        );
      }
    }
  }

  return (
    <>
      <TiledGround patternWidth={25} patternHeight={20}/>
      {trees}
      <Varmint bounds = {{ x: [-8.5, 8.5], y: [-6, 6] }}/>
    </>
  );
}


