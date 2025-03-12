import React, { useRef, useState, useEffect } from "react";
import { useFrame, useThree, extend } from "@react-three/fiber";
import { Billboard, useTexture } from "@react-three/drei";
import * as THREE from "three";

export default function Varmint( {varmintInfo, bounds = { x: [-8, 8], y: [-6, 6] }} ) 
{
    console.log("varmintInfo:", varmintInfo);
    const groupRef = useRef();
    const textureUrl = `/sprites/varmints/0/${varmintInfo.evolution_id[0]}/${varmintInfo.evolution_id[1]}.png`;
    const texture = useTexture(textureUrl);
    const fixedZ = 0.2;
    const speed = 2;
    const boundsWidth = bounds.x[1] - bounds.x[0];
    const boundsHeight = bounds.y[1] - bounds.y[0];
    const maxDistance = Math.sqrt(boundsWidth ** 2 + boundsHeight ** 2);
    
    texture.minFilter = THREE.NearestFilter;
    texture.magFilter = THREE.NearestFilter;
    texture.colorSpace = THREE.SRGBColorSpace;
    
    // State for wander target in the XY plane.
    const [target, setTarget] = useState(new THREE.Vector2());
    
    // Set an initial random position and target in XY.
    useEffect(() => {
        if (groupRef.current) {
        groupRef.current.position.set(0, 0, fixedZ);
        }
        const newTarget = new THREE.Vector2(
        THREE.MathUtils.randFloat(bounds.x[0], bounds.x[1]),
        THREE.MathUtils.randFloat(bounds.y[0], bounds.y[1])
        );
        setTarget(newTarget);
    }, [bounds, fixedZ]);
    
    useFrame((state, delta) => {
      if (!groupRef.current) return;
      const clampedDelta = Math.min(delta, 0.1);
      const pos = groupRef.current.position;
      const currentXY = new THREE.Vector2(pos.x, pos.y);
      const toTarget = new THREE.Vector2().subVectors(target, currentXY);
      const distance = toTarget.length();
    
      if (distance < 0.1) {
        let offset = new THREE.Vector2(
          THREE.MathUtils.randFloatSpread(6), // range [-6,6]
          THREE.MathUtils.randFloatSpread(6)
        );
        if (offset.length() > 3) {
          offset.setLength(3);
        }
        let newX = currentXY.x + offset.x;
        let newY = currentXY.y + offset.y;
        newX = THREE.MathUtils.clamp(newX, bounds.x[0], bounds.x[1]);
        newY = THREE.MathUtils.clamp(newY, bounds.y[0], bounds.y[1]);
        const newTarget = new THREE.Vector2(newX, newY);
        setTarget(newTarget);
      } else {
        toTarget.normalize();
        // Scale speed relative to the distance.
        let scaledSpeed = speed * (distance / 3);
        scaledSpeed = Math.min(scaledSpeed, speed);
        currentXY.add(toTarget.multiplyScalar(scaledSpeed * clampedDelta));
        groupRef.current.position.set(currentXY.x, currentXY.y, fixedZ);
      }
    });

  return (
    <group ref={groupRef}>
      <Billboard follow={true}><sprite><spriteMaterial attach="material" map={texture} transparent /></sprite></Billboard>
    </group>
  );
}


