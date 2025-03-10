import React, { useRef, useEffect } from 'react'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'

export function LightWithHelper(props) {
  const lightRef = useRef()
  const { scene } = useThree()

  useEffect(() => {
    if (lightRef.current) {
      // Create a helper with a size (e.g., 2 units) and a color (red here)
      const helper = new THREE.DirectionalLightHelper(lightRef.current, 2, 0xff0000)
      scene.add(helper)
      return () => scene.remove(helper)
    }
  }, [scene])

  return <directionalLight ref={lightRef} {...props} />
}
