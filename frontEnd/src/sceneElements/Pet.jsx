import React, { useRef, useState, useEffect } from "react";
import { useFrame, useThree, extend } from "@react-three/fiber";
import { Billboard, useTexture } from "@react-three/drei";
import * as THREE from "three";
import SpriteAnimator from "./SpriteAnimator.jsx";

export default function Pet({ petInfo, bounds = { x: [-8, 8], y: [-6, 6] } }) {
  const groupRef = useRef();
  const fixedZ = 0.2;
  const speed = 2;
  const [target, setTarget] = useState(new THREE.Vector2());
  const [direction, setDirection] = useState("F");

  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.position.set(0, 0, fixedZ);
    }
    if (petInfo.evolution_id[0] === 0) {
      setTarget(new THREE.Vector2(0, 0));
      setDirection("F");
    } else {
      const newTarget = new THREE.Vector2(
        THREE.MathUtils.randFloat(bounds.x[0], bounds.x[1]),
        THREE.MathUtils.randFloat(bounds.y[0], bounds.y[1])
      );
      setTarget(newTarget);
    }
  }, [bounds, fixedZ, petInfo.evolution_id]);

  const deltaRef = useRef(0);

  useFrame((state, delta) => {
    const clampedDelta = Math.min(delta, 0.1);
    deltaRef.current = clampedDelta;
    if (petInfo.evolution_id[0] === 0) return;
    if (!groupRef.current) return;

    const pos = groupRef.current.position;
    const currentXY = new THREE.Vector2(pos.x, pos.y);
    const toTarget = new THREE.Vector2().subVectors(target, currentXY);
    const distance = toTarget.length();

    if (Math.abs(toTarget.x) > Math.abs(toTarget.y)) {
      setDirection(toTarget.x < 0 ? "L" : "R");
    } else {
      setDirection(toTarget.y > 0 ? "U" : "F");
    }

    if (distance < 0.1) {
      const offset = new THREE.Vector2(
        THREE.MathUtils.randFloatSpread(6),
        THREE.MathUtils.randFloatSpread(6)
      );
      if (offset.length() > 3) offset.setLength(3);
      const newX = THREE.MathUtils.clamp(currentXY.x + offset.x, bounds.x[0], bounds.x[1]);
      const newY = THREE.MathUtils.clamp(currentXY.y + offset.y, bounds.y[0], bounds.y[1]);
      setTarget(new THREE.Vector2(newX, newY));
    } else {
      toTarget.normalize();
      let scaledSpeed = speed * (distance / 3);
      scaledSpeed = Math.min(scaledSpeed, speed);
      currentXY.add(toTarget.multiplyScalar(scaledSpeed * clampedDelta));
      groupRef.current.position.set(currentXY.x, currentXY.y, fixedZ);
    }
  });

  console.log("Pet render", performance.now(), petInfo);

  return (
    <group ref={groupRef}>
      <Billboard follow={true}>
        <SpriteAnimator
          evolution_id={petInfo.evolution_id}
          direction={direction}
          flipInterval={0.5}
        />
      </Billboard>
    </group>
  );
}

