import React from "react";
import Pet from "./Pet";
import { useUserDataContext } from "../hooks/AppContext";

export default function PetSpawner() {
  const { userData } = useUserDataContext();

  console.log("PetSpawner render", performance.now(), userData);

  if (!userData || !userData.pets || userData.pets.length === 0) return <></>;
  return (
    <>
      {userData.pets.map((pet, index) => (
        <Pet key={pet.id || `temp-${index}`} petInfo={pet} bounds={{ x: [-8, 8], y: [-6, 6] }}/>
      ))}
    </>
  );
}
