import React from "react";
import Pet from "./Pet";
import { useUserDataContext } from "../hooks/AppContext";

export default function PetSpawner({ bounds }) {
  const { userData } = useUserDataContext();

  console.log("PetSpawner render", performance.now(), userData);

  // Convert WORLD_BOUNDS to pet-expected format
  const petBounds = {
    x: [-bounds.clearingWidth / 2, bounds.clearingWidth / 2],
    y: [-bounds.clearingHeight / 2, bounds.clearingHeight / 2]
  };

  if (!userData || !userData.pets || userData.pets.length === 0) return <></>;
  return (
    <>
      {userData.pets.map((pet, index) => (
        <Pet key={pet.id || `temp-${index}`} petInfo={pet} bounds={petBounds} />
      ))}
    </>
  );
}
