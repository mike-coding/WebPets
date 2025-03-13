import React, { useMemo } from 'react'
import { useLoader } from '@react-three/fiber'
import { OBJLoader } from 'three-stdlib'
import { MTLLoader } from 'three-stdlib'
import * as THREE from 'three'

const Tree = React.memo(function tree({ position = [0, 0, 0], ...props }) {
  // Load materials first
  const materials = useLoader(MTLLoader, '/models/pineTree/pineTree.mtl')
  materials.preload()

  // Then load the OBJ and set its materials
  const obj = useLoader(OBJLoader, '/models/pineTree/pineTree.obj', loader => {
    loader.setMaterials(materials)
  })

  const treeObj = useMemo(() => obj.clone(), [obj]);

  treeObj.traverse((child) => {
    if (child.isMesh && child.material) {
      const oldMap = child.material.map; 
      child.castShadow = true;
      child.receiveShadow = true;
      child.material = new THREE.MeshStandardMaterial({
        map: oldMap,
        color: new THREE.Color(),
        transparent: true,
        alphaTest: 0.5,

      });
      if (child.material.map) {
        child.material.map.minFilter = THREE.NearestFilter;
        child.material.map.magFilter = THREE.NearestFilter;
        child.material.map.generateMipmaps = false;
        child.material.map.colorSpace = THREE.SRGBColorSpace;
        child.material.map.needsUpdate = true;
      }
    }
  });

  return <primitive object={treeObj} position={position} rotation={[Math.PI / 2, 0, 0]} {...props} castShadow/>
});

export default Tree;
