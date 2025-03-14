import React from "react";
import Varmint from "../sceneElements/Varmint";
import { useUserDataContext } from "../hooks/AppContext";

export default function VarmintSpawner() {
  const { userData } = useUserDataContext();

  if (!userData || !userData.varmints || userData.varmints.length === 0) return <></>;
  return (
    <>
      {userData.varmints.map((v, index) => (
        <Varmint key={v.id || `temp-${index}`} varmintInfo={v} bounds={{ x: [-8, 8], y: [-6, 6] }}/>
      ))}
    </>
  );
}
