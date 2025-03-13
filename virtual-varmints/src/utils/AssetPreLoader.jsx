import { useTexture } from "@react-three/drei";
import React, { useState, useEffect } from "react";
import * as THREE from "three";

// List of asset URLs to preload (e.g., textures).
const assetUrls = [
  "/sprites/tiles/grass/0.png",
  "/sprites/tiles/grass/1.png",
  "/sprites/tiles/grass/7.png",
  "/sprites/tiles/grass/8.png",
  "/sprites/tiles/grass/9.png",
  "/sprites/tiles/grass/10.png",
  "/sprites/tiles/grass/13.png",
  "/sprites/tiles/grass/16.png",
  "/sprites/tiles/grass/19.png",
  "/sprites/tiles/grass/22.png",
  "/sprites/tiles/grass/25.png",
  "/sprites/tiles/grass/26.png",
  "/sprites/tiles/grass/27.png",
  "/sprites/tiles/grass/28.png",
  "/sprites/varmints/0/0/0.png",
  "/sprites/varmints/0/1/0.png",
  "/sprites/varmints/0/2/0.png",
];

export default function AssetPreloader({ children }) {
  const [progress, setProgress] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Create a new LoadingManager instance.
    const manager = new THREE.LoadingManager();

    manager.onStart = (url, itemsLoaded, itemsTotal) => {
        THREE.Cache.enabled = true;
        console.log(`Started loading: ${url} (${itemsLoaded} of ${itemsTotal})`);
    };

    manager.onProgress = (url, itemsLoaded, itemsTotal) => {
      const percent = (itemsLoaded / itemsTotal) * 100;
      setProgress(percent);
      console.log(`Loading: ${url} (${percent.toFixed(0)}%)`);
    };

    manager.onLoad = () => {
      console.log("All assets loaded.");
      setLoaded(true);
    };

    manager.onError = (url) => {
      console.error(`Error loading ${url}`);
    };

    // Create a loader (here we use TextureLoader as an example) with our manager.
    const textureLoader = new THREE.TextureLoader(manager);
    
    // Preload all assets.
    assetUrls.forEach(url => {
      textureLoader.load(url);
      useTexture.preload(url);
    });
  }, []);

  if (!loaded) {
    // Render a loading overlay while assets are loading.
    return (
      <div style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#000"
      }}>
        <p style={{ color: "#fff", fontSize: "1.5rem" }}>
          Loading... {progress.toFixed(0)}%
        </p>
      </div>
    );
  }

  // Once loaded, render the children (your main scene).
  return <>{children}</>;
}
