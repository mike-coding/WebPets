import React, { useMemo, useRef, useEffect } from "react";
import { useLoader } from "@react-three/fiber";
import { OBJLoader } from "three-stdlib";
import { MTLLoader } from "three-stdlib";
import * as THREE from "three";

// Helper component for instancing one submesh.
function InstancedTreeMesh({ meshData, transforms }) {
  const instancedMeshRef = useRef();

  useEffect(() => {
    if (!instancedMeshRef.current) return;
    const dummy = new THREE.Object3D();
    transforms.forEach((transform, i) => {
      // Apply the per-tree transform (position, rotation, scale).
      dummy.position.set(...transform.position);
      dummy.rotation.set(...transform.rotation);
      dummy.scale.set(...transform.scale);
      dummy.updateMatrix();
      // Multiply by the mesh's local transform so that its relative position/rotation is preserved.
      const finalMatrix = dummy.matrix.clone().multiply(meshData.localMatrix);
      instancedMeshRef.current.setMatrixAt(i, finalMatrix);
    });
    instancedMeshRef.current.instanceMatrix.needsUpdate = true;
  }, [transforms, meshData]);

  return (
    <instancedMesh
      ref={instancedMeshRef}
      args={[meshData.geometry, meshData.material, transforms.length]}
      castShadow
      receiveShadow
    />
  );
}

export default function InstancedTrees({ clearingWidth, clearingHeight }) {
  // Calculate parameters based on provided props.
  const clearingHalfWidth = clearingWidth / 2;
  const clearingHalfHeight = clearingHeight / 2;
  const cols = clearingWidth + 8;
  const rows = clearingHeight + 8;

  // Compute tree transforms with the original rotation [Math.PI / 2, randomYRotation, 0]
  const transforms = useMemo(() => {
    const treeTransforms = [];
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
          // Preserve the original rotation.
          treeTransforms.push({
            position: [finalX, finalZ, 0],
            rotation: [Math.PI / 2, randomYRotation, 0],
            scale: [randomScale, randomScale, randomScale],
          });
        }
      }
    }
    return treeTransforms;
  }, [cols, rows, clearingHalfWidth, clearingHalfHeight]);

  // Load materials and the OBJ, then set the materials.
  const materials = useLoader(MTLLoader, "/models/pineTree/pineTree.mtl");
  materials.preload();
  const treeObj = useLoader(OBJLoader, "/models/pineTree/pineTree.obj", (loader) => {
    loader.setMaterials(materials);
  });

  // Process treeObj to extract each mesh's geometry, its local transform,
  // and create a fresh material with the proper settings.
  const treeMeshes = useMemo(() => {
    const meshes = [];
    treeObj.traverse((child) => {
      if (child.isMesh) {
        child.updateMatrix(); // Update the local matrix
        const oldMap = child.material.map;
        // Create a new material with settings matching your reference.
        const mat = new THREE.MeshStandardMaterial({
          map: oldMap,
          color: new THREE.Color(),
          transparent: true,
          alphaTest: 0.5,
        });
        if (oldMap) {
          oldMap.minFilter = THREE.NearestFilter;
          oldMap.magFilter = THREE.NearestFilter;
          oldMap.generateMipmaps = false;
          oldMap.colorSpace = THREE.SRGBColorSpace;
          oldMap.needsUpdate = true;
        }
        meshes.push({
          geometry: child.geometry,
          material: mat,
          localMatrix: child.matrix.clone(), // Child's local transform
        });
      }
    });
    return meshes;
  }, [treeObj]);

  // Render an instanced mesh for each submesh.
  return (
    <>
      {treeMeshes.map((meshData, index) => (
        <InstancedTreeMesh key={index} meshData={meshData} transforms={transforms} />
      ))}
    </>
  );
}

