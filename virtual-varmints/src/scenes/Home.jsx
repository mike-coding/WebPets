import React, { useMemo } from "react";
import TiledGround from "../components/TiledGround";
import Tree from "../models/tree";
import VarmintSpawner from "../components/VarmintSpawner";

export default function HomeEnvironment() {
  const trees = useMemo(() => {
    const treesArray = [];
    const cols = 24;
    const rows = 20;
    const clearingHalfWidth = 8;
    const clearingHalfHeight = 6;
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        const x = i - cols / 2 + 0.5;
        const z = j - rows / 2 + 0.5;
        if (
          x <= -clearingHalfWidth ||
          x >= clearingHalfWidth ||
          z <= -clearingHalfHeight ||
          z >= clearingHalfHeight
        ) {
          const randomXOffset = (Math.random() - 0.5) * 0.7;
          const randomZOffset = (Math.random() - 0.5) * 0.7;
          const finalX = x + randomXOffset;
          const finalZ = z + randomZOffset;
          const randomYRotation = (Math.random() - 0.5) * 0.4;
          const randomScale = 0.7 + Math.random() * 0.4;
          treesArray.push(
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
    return treesArray;
  }, []);

  return (
    <>
      React.memo(<TiledGround patternWidth={25} patternHeight={20} />
      {trees})
      <VarmintSpawner/>
    </>
  );
}