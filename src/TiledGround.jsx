import { useTexture } from "@react-three/drei";
import * as THREE from "three";

function TiledGround() {
    // Make sure your grass image is placed in the public folder (e.g., public/grass.png)
    const grassTexture = useTexture("/sprites/tiles/grass.png");
  
    grassTexture.minFilter = THREE.NearestFilter;
    grassTexture.magFilter = THREE.NearestFilter;
    
    // Set the texture to repeat
    grassTexture.wrapS = grassTexture.wrapT = THREE.RepeatWrapping;
    // Adjust the repeat values to control the tiling density:
    grassTexture.repeat.set(100, 100);
  
    return (
      // Rotate the plane so it lies flat (horizontal)
      <mesh rotation-x={-0.6} position={[0, -1, 0]}>
        {/* Make the plane large enough to act as a backdrop */}
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial map={grassTexture} />
      </mesh>
    );
}

export default TiledGround