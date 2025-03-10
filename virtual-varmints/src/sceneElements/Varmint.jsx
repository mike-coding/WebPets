import React, { useRef, useState, useEffect } from "react";
import { useFrame, useThree, extend } from "@react-three/fiber";
import { Billboard, useTexture } from "@react-three/drei";
import * as THREE from "three";

export default function Varmint({bounds = { x: [-9, 9], y: [-6, 6] }}) 
{
    const groupRef = useRef();
    const textureUrl = "/sprites/varmints/0/0/0.png";
    const texture = useTexture(textureUrl);
    const fixedZ = 0.2;
    const speed = 4;
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
        const newTarget = new THREE.Vector2(
            THREE.MathUtils.randFloat(bounds.x[0], bounds.x[1]),
            THREE.MathUtils.randFloat(bounds.y[0], bounds.y[1])
        );
        setTarget(newTarget);
        } else {
        toTarget.normalize();
        // Scale speed relative to the distance and bounding box size.
        let scaledSpeed = speed * (distance / maxDistance);
        
        // Clamp effective speed between half base speed and the full base speed.
        scaledSpeed = Math.max(scaledSpeed, speed / 4);
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


