"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

interface ThreeClothCanvasProps {
  scrollProgress: number; // 0.0 to 1.0
  activeChapter: number;
  customColor?: string;
  customFabricColor?: string;
  lightingMode?: "candlelight" | "daylight" | "moonlight";
  isInteractiveOrbit?: boolean;
}

export default function ThreeClothCanvas({
  scrollProgress,
  activeChapter,
  customColor = "#771224",
  customFabricColor,
  lightingMode = "candlelight",
}: ThreeClothCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  // Scene Objects
  const pillarsGroupRef = useRef<THREE.Group | null>(null);
  const mannequinGroupRef = useRef<THREE.Group | null>(null);
  const sareePalluMeshRef = useRef<THREE.Mesh | null>(null);
  const lehengaMeshRef = useRef<THREE.Mesh | null>(null);
  const liquidGoldRibbonRef = useRef<THREE.Mesh | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);
  const chandelierLightsRef = useRef<THREE.PointLight[]>([]);

  // Smooth lerped scroll progress
  const targetProgressRef = useRef(0);
  const currentProgressRef = useRef(0);

  // Mouse & Orbit
  const mouseRef = useRef({ x: 0, y: 0 });
  const manualOrbitRef = useRef({ x: 0, y: 0 });
  const isDraggingRef = useRef(false);
  const lastMousePosRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    targetProgressRef.current = scrollProgress;
  }, [scrollProgress]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene setup with royal palace atmosphere
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x060508);
    scene.fog = new THREE.FogExp2(0x060508, 0.04);

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 1.5, 12);
    cameraRef.current = camera;

    // 3. Renderer with high dynamic range settings
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: "high-performance",
      alpha: false,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Procedural High-Res Zari Brocade & Embroidery Textures
    const createBrocadeTexture = () => {
      const cvs = document.createElement("canvas");
      cvs.width = 1024;
      cvs.height = 1024;
      const ctx = cvs.getContext("2d");
      if (ctx) {
        // Deep silk velvet base
        ctx.fillStyle = "#3d0812";
        ctx.fillRect(0, 0, 1024, 1024);

        // Gold warp & weft micro-texture
        ctx.fillStyle = "rgba(230, 190, 104, 0.06)";
        for (let i = 0; i < 1024; i += 4) {
          ctx.fillRect(i, 0, 1.5, 1024);
          ctx.fillRect(0, i, 1024, 1.5);
        }

        // Royal Mughal Shikargah & Paisley Zari Motifs
        ctx.strokeStyle = "#e6be68";
        ctx.lineWidth = 2.5;

        for (let x = 64; x < 1024; x += 128) {
          for (let y = 64; y < 1024; y += 128) {
            // Auspicious Kalgi / Paisley motif
            ctx.beginPath();
            ctx.arc(x, y, 24, 0, Math.PI * 2);
            ctx.stroke();

            // Beaten gold center
            ctx.fillStyle = "#fbe3a1";
            ctx.beginPath();
            ctx.arc(x, y, 8, 0, Math.PI * 2);
            ctx.fill();

            // Surrounding zardozi flower petals
            for (let a = 0; a < 8; a++) {
              const ang = (a * Math.PI) / 4;
              const px = x + Math.cos(ang) * 36;
              const py = y + Math.sin(ang) * 36;
              ctx.beginPath();
              ctx.arc(px, py, 5, 0, Math.PI * 2);
              ctx.fill();
            }

            // Ornate floral trellis diamond lattice
            ctx.strokeStyle = "rgba(230, 190, 104, 0.35)";
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(x - 64, y);
            ctx.lineTo(x, y - 64);
            ctx.lineTo(x + 64, y);
            ctx.lineTo(x, y + 64);
            ctx.closePath();
            ctx.stroke();
          }
        }
      }

      const tex = new THREE.CanvasTexture(cvs);
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.RepeatWrapping;
      tex.repeat.set(3, 3);
      return tex;
    };

    const brocadeTexture = createBrocadeTexture();

    // 5. Palace Architecture: 3D Marble Pillars with Golden Fluting & Capitals
    const pillarsGroup = new THREE.Group();
    const pillarMat = new THREE.MeshStandardMaterial({
      color: 0x1f1b26,
      roughness: 0.4,
      metalness: 0.3,
    });
    const goldCapitalMat = new THREE.MeshStandardMaterial({
      color: 0xe6be68,
      roughness: 0.25,
      metalness: 0.85,
    });

    const pillarPositions = [
      [-6, 0, -4],
      [6, 0, -4],
      [-7, 0, 2],
      [7, 0, 2],
      [-5, 0, -8],
      [5, 0, -8],
    ];

    pillarPositions.forEach(([px, py, pz]) => {
      const colGroup = new THREE.Group();
      colGroup.position.set(px, py, pz);

      // Main Column
      const shaftGeo = new THREE.CylinderGeometry(0.45, 0.48, 14, 24);
      const shaftMesh = new THREE.Mesh(shaftGeo, pillarMat);
      colGroup.add(shaftMesh);

      // Golden Capital & Base Rings
      const ringGeo = new THREE.TorusGeometry(0.55, 0.08, 12, 32);
      const topRing = new THREE.Mesh(ringGeo, goldCapitalMat);
      topRing.rotation.x = Math.PI / 2;
      topRing.position.y = 4.5;
      colGroup.add(topRing);

      const botRing = new THREE.Mesh(ringGeo, goldCapitalMat);
      botRing.rotation.x = Math.PI / 2;
      botRing.position.y = -4.5;
      colGroup.add(botRing);

      // Crown Arch Capital
      const capGeo = new THREE.BoxGeometry(1.2, 0.4, 1.2);
      const capMesh = new THREE.Mesh(capGeo, goldCapitalMat);
      capMesh.position.y = 5.2;
      colGroup.add(capMesh);

      pillarsGroup.add(colGroup);
    });

    scene.add(pillarsGroup);
    pillarsGroupRef.current = pillarsGroup;

    // 6. 3D Mannequin & Imperial Garment Assembly
    const mannequinGroup = new THREE.Group();
    mannequinGroup.position.set(0, -0.4, 0);

    // Mannequin Torso & Neck (Stylized Haute Couture Bronze/Obsidian Silhouette)
    const torsoMat = new THREE.MeshStandardMaterial({
      color: 0x18141d,
      roughness: 0.35,
      metalness: 0.6,
    });

    // Elegant Torso form
    const torsoGeo = new THREE.CylinderGeometry(0.55, 0.4, 2.2, 32);
    const torsoMesh = new THREE.Mesh(torsoGeo, torsoMat);
    torsoMesh.position.y = 1.1;
    mannequinGroup.add(torsoMesh);

    // Gold Neck Choker / Royal Torque
    const chokerGeo = new THREE.TorusGeometry(0.38, 0.06, 16, 32);
    const chokerMesh = new THREE.Mesh(chokerGeo, goldCapitalMat);
    chokerMesh.rotation.x = Math.PI / 2;
    chokerMesh.position.y = 2.1;
    mannequinGroup.add(chokerMesh);

    // Imperial Pedestal Base
    const pedestalGeo = new THREE.CylinderGeometry(1.2, 1.4, 0.3, 32);
    const pedestalMesh = new THREE.Mesh(pedestalGeo, goldCapitalMat);
    pedestalMesh.position.y = -2.7;
    mannequinGroup.add(pedestalMesh);

    // 7. A: Floating Liquid Gold Silk Veil (Prologue)
    const ribbonGeo = new THREE.PlaneGeometry(5, 10, 64, 128);
    const goldRibbonMat = new THREE.MeshStandardMaterial({
      color: 0xfbe3a1,
      roughness: 0.18,
      metalness: 0.92,
      side: THREE.DoubleSide,
      bumpMap: brocadeTexture,
      bumpScale: 0.04,
    });
    const liquidGoldRibbon = new THREE.Mesh(ribbonGeo, goldRibbonMat);
    liquidGoldRibbon.position.set(0, 0.5, 0);
    liquidGoldRibbon.rotation.set(-0.2, 0.2, 0);
    scene.add(liquidGoldRibbon);
    liquidGoldRibbonRef.current = liquidGoldRibbon;

    // 7. B: Saree Drape & Pallu Mesh (Curved cascading cloth)
    const palluGeo = new THREE.PlaneGeometry(3.2, 7.5, 48, 96);
    const sareeMat = new THREE.MeshStandardMaterial({
      color: 0x771224, // Royal Crimson
      roughness: 0.28,
      metalness: 0.72,
      map: brocadeTexture,
      bumpMap: brocadeTexture,
      bumpScale: 0.08,
      side: THREE.DoubleSide,
    });
    const sareePallu = new THREE.Mesh(palluGeo, sareeMat);
    sareePallu.position.set(0.6, 0.3, 0.4);
    sareePallu.rotation.set(-0.1, 0.35, -0.15);
    mannequinGroup.add(sareePallu);
    sareePalluMeshRef.current = sareePallu;

    // 7. C: Flared Kalis Lehenga Skirt (360-degree architectural flare)
    const kalisGeo = new THREE.CylinderGeometry(0.48, 2.8, 3.8, 64, 32, true);
    // Displace vertices to form 36 delicate royal flute pleats
    const pos = kalisGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const vx = pos.getX(i);
      const vy = pos.getY(i);
      const vz = pos.getZ(i);
      const angle = Math.atan2(vz, vx);
      const r = Math.sqrt(vx * vx + vz * vz);
      // Fluting increases towards hem
      const fluteFactor = (1.9 - vy) / 3.8;
      const wave = Math.sin(angle * 28) * 0.14 * Math.max(0, fluteFactor);
      pos.setX(i, (r + wave) * Math.cos(angle));
      pos.setZ(i, (r + wave) * Math.sin(angle));
    }
    kalisGeo.computeVertexNormals();

    const lehengaMat = new THREE.MeshStandardMaterial({
      color: 0x5e0d1b, // Velvet Ruby
      roughness: 0.3,
      metalness: 0.75,
      map: brocadeTexture,
      bumpMap: brocadeTexture,
      bumpScale: 0.12,
      side: THREE.DoubleSide,
    });
    const lehengaMesh = new THREE.Mesh(kalisGeo, lehengaMat);
    lehengaMesh.position.set(0, -1.0, 0);
    mannequinGroup.add(lehengaMesh);
    lehengaMeshRef.current = lehengaMesh;

    // Golden Embroidered Hem Border Ring
    const hemRingGeo = new THREE.TorusGeometry(2.82, 0.06, 16, 64);
    const hemRingMesh = new THREE.Mesh(hemRingGeo, goldCapitalMat);
    hemRingMesh.rotation.x = Math.PI / 2;
    hemRingMesh.position.y = -2.85;
    mannequinGroup.add(hemRingMesh);

    scene.add(mannequinGroup);
    mannequinGroupRef.current = mannequinGroup;

    // 8. Swirling 24K Royal Gold Dust Particles
    const pCount = 1200;
    const pGeo = new THREE.BufferGeometry();
    const pPositions = new Float32Array(pCount * 3);
    const pSpeeds = new Float32Array(pCount);

    for (let i = 0; i < pCount; i++) {
      pPositions[i * 3] = (Math.random() - 0.5) * 20;
      pPositions[i * 3 + 1] = (Math.random() - 0.5) * 16;
      pPositions[i * 3 + 2] = (Math.random() - 0.5) * 16;
      pSpeeds[i] = Math.random() * 0.008 + 0.003;
    }

    pGeo.setAttribute("position", new THREE.BufferAttribute(pPositions, 3));

    const pCanvas = document.createElement("canvas");
    pCanvas.width = 64;
    pCanvas.height = 64;
    const pCtx = pCanvas.getContext("2d");
    if (pCtx) {
      const grad = pCtx.createRadialGradient(32, 32, 0, 32, 32, 32);
      grad.addColorStop(0, "rgba(255, 240, 180, 1)");
      grad.addColorStop(0.3, "rgba(230, 190, 104, 0.8)");
      grad.addColorStop(0.7, "rgba(181, 137, 48, 0.2)");
      grad.addColorStop(1, "rgba(0, 0, 0, 0)");
      pCtx.fillStyle = grad;
      pCtx.fillRect(0, 0, 64, 64);
    }
    const pTexture = new THREE.CanvasTexture(pCanvas);

    const pMat = new THREE.PointsMaterial({
      size: 0.16,
      map: pTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      color: 0xffdf88,
    });
    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);
    particlesRef.current = particles;

    // 9. Royal Lighting: Ambient, Directional & Chandelier Point Lights
    const ambientLight = new THREE.AmbientLight(0xffecd0, 1.4);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffdf88, 2.5);
    dirLight.position.set(6, 10, 6);
    scene.add(dirLight);

    const chandelier1 = new THREE.PointLight(0xffb74d, 3.5, 25);
    chandelier1.position.set(-3, 4, 3);
    scene.add(chandelier1);

    const chandelier2 = new THREE.PointLight(0xe6be68, 3.0, 25);
    chandelier2.position.set(4, 3, 2);
    scene.add(chandelier2);

    chandelierLightsRef.current = [chandelier1, chandelier2];

    // 10. Animation Loop & Camera Trajectory Scrubbing
    let clock = new THREE.Clock();
    let animId: number;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      // Smooth interpolation for scroll progression (damping)
      currentProgressRef.current +=
        (targetProgressRef.current - currentProgressRef.current) * 0.08;
      const progress = currentProgressRef.current; // 0.0 to 1.0

      // Compute Camera Position & Rotation on 3D Spline Path
      if (cameraRef.current) {
        const cam = cameraRef.current;

        // Keyframe Points along the royal journey
        let targetCamX = 0;
        let targetCamY = 1.2;
        let targetCamZ = 11.5;
        let lookAtX = 0;
        let lookAtY = 0.2;
        let lookAtZ = 0;

        if (progress < 0.22) {
          // Chapter 0: Prologue - Distant view of Golden Silk Veil
          const p = progress / 0.22;
          targetCamX = Math.sin(p * Math.PI) * 1.5;
          targetCamY = 1.2 + p * 0.4;
          targetCamZ = 11.5 - p * 3.5;
          lookAtX = 0;
          lookAtY = 0.5;
        } else if (progress < 0.48) {
          // Chapter 1: Saree Close-up Macro & Zari Details
          const p = (progress - 0.22) / 0.26;
          targetCamX = -2.4 + p * 1.0;
          targetCamY = 0.8 + Math.sin(p * Math.PI) * 0.3;
          targetCamZ = 8.0 - p * 2.8;
          lookAtX = 0.5;
          lookAtY = 0.4;
        } else if (progress < 0.72) {
          // Chapter 2: Flared Rajputana Lehenga 360 Sweep
          const p = (progress - 0.48) / 0.24;
          const angle = p * Math.PI * 1.6;
          targetCamX = Math.cos(angle) * 5.2;
          targetCamY = -0.4 + Math.sin(p * Math.PI) * 0.5;
          targetCamZ = Math.sin(angle) * 5.2;
          lookAtX = 0;
          lookAtY = -0.6;
        } else if (progress < 0.90) {
          // Chapter 3: Kanjeevaram Temple Silk High Hero Angle
          const p = (progress - 0.72) / 0.18;
          targetCamX = 1.8 - p * 2.0;
          targetCamY = 1.8 - p * 0.6;
          targetCamZ = 5.8 - p * 0.5;
          lookAtX = 0;
          lookAtY = 0.3;
        } else {
          // Chapter 4 & 5: Grand Atelier 3D Inspection Stage
          const p = (progress - 0.90) / 0.10;
          targetCamX = manualOrbitRef.current.x * 2.5;
          targetCamY = 0.6 + manualOrbitRef.current.y * 2.0;
          targetCamZ = 7.2;
          lookAtX = 0;
          lookAtY = -0.2;
        }

        // Apply mouse parallax
        const mouseParallaxX = mouseRef.current.x * 0.6;
        const mouseParallaxY = -mouseRef.current.y * 0.4;

        cam.position.x += (targetCamX + mouseParallaxX - cam.position.x) * 0.08;
        cam.position.y += (targetCamY + mouseParallaxY - cam.position.y) * 0.08;
        cam.position.z += (targetCamZ - cam.position.z) * 0.08;

        cam.lookAt(lookAtX, lookAtY, lookAtZ);
      }

      // Silk Wave Physics on Floating Gold Ribbon
      if (liquidGoldRibbonRef.current) {
        const ribbon = liquidGoldRibbonRef.current;
        const rGeo = ribbon.geometry as THREE.PlaneGeometry;
        const rPos = rGeo.attributes.position;

        for (let i = 0; i < rPos.count; i++) {
          const vx = rPos.getX(i);
          const vy = rPos.getY(i);
          const wave =
            Math.sin(vx * 1.8 + time * 2.2) * 0.35 +
            Math.cos(vy * 1.5 + time * 1.8) * 0.25;
          rPos.setZ(i, wave);
        }
        rPos.needsUpdate = true;
        rGeo.computeVertexNormals();

        // Fade ribbon visibility as scroll transitions to garment
        const ribbonMat = ribbon.material as THREE.MeshStandardMaterial;
        if (progress > 0.25) {
          ribbon.visible = false;
        } else {
          ribbon.visible = true;
          ribbon.rotation.y = time * 0.15;
        }
      }

      // Mannequin Garment Rotation & Saree Flutter
      if (mannequinGroupRef.current) {
        const mg = mannequinGroupRef.current;

        // Gentle royal turntable rotation
        if (progress > 0.2) {
          mg.rotation.y = time * 0.2 + manualOrbitRef.current.x;
        }

        // Saree Pallu cloth ripple simulation
        if (sareePalluMeshRef.current) {
          const sp = sareePalluMeshRef.current;
          const sGeo = sp.geometry as THREE.PlaneGeometry;
          const sPos = sGeo.attributes.position;
          for (let i = 0; i < sPos.count; i++) {
            const vx = sPos.getX(i);
            const vy = sPos.getY(i);
            const wave =
              Math.sin(vx * 2.2 + time * 2.5) * 0.18 +
              Math.cos(vy * 1.8 + time * 2.0) * 0.14;
            sPos.setZ(i, wave);
          }
          sPos.needsUpdate = true;
          sGeo.computeVertexNormals();
        }

        // Dynamic transition between Saree vs Lehenga emphasis
        if (lehengaMeshRef.current) {
          const lehengaMat = lehengaMeshRef.current.material as THREE.MeshStandardMaterial;
          if (progress > 0.45 && progress < 0.72) {
            // Chapter II: Highlight Lehenga flare
            lehengaMeshRef.current.scale.set(1.15, 1.05, 1.15);
            lehengaMat.metalness = 0.85;
          } else {
            lehengaMeshRef.current.scale.set(1.0, 1.0, 1.0);
            lehengaMat.metalness = 0.65;
          }
        }
      }

      // Gold Embers float upward
      if (particlesRef.current) {
        const pts = particlesRef.current;
        const pPos = pts.geometry.attributes.position;
        for (let i = 0; i < pCount; i++) {
          let py = pPos.getY(i);
          py += pSpeeds[i] * (1.0 + progress * 2.5); // Embers speed up as you scroll!
          if (py > 9) py = -9;
          pPos.setY(i, py);
        }
        pPos.needsUpdate = true;
        pts.rotation.y = time * 0.04;
      }

      // Chandelier candle flame flicker
      chandelierLightsRef.current.forEach((light, idx) => {
        light.intensity = 3.2 + Math.sin(time * 6 + idx * 3) * 0.45;
      });

      renderer.render(scene, camera);
    };

    animate();

    // Window resize handler
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animId);
      if (rendererRef.current && rendererRef.current.domElement) {
        container.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }
    };
  }, []);

  // Update dynamic color based on chapter or user customization
  useEffect(() => {
    if (!sareePalluMeshRef.current || !lehengaMeshRef.current) return;
    const sareeMat = sareePalluMeshRef.current.material as THREE.MeshStandardMaterial;
    const lehengaMat = lehengaMeshRef.current.material as THREE.MeshStandardMaterial;

    if (activeChapter === 3) {
      // Kanjeevaram: Peacock Teal
      sareeMat.color.setHex(0x084c61);
      lehengaMat.color.setHex(0x9e1946);
    } else if (activeChapter === 1) {
      // Banarasi: Crimson
      sareeMat.color.setHex(0x771224);
      lehengaMat.color.setHex(0x5e0d1b);
    } else if (activeChapter === 5 && customColor) {
      sareeMat.color.set(customColor);
      lehengaMat.color.set(customColor);
    }
  }, [activeChapter, customColor]);

  // Mouse drag for 360-degree interactive orbit
  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const normX = (e.clientX / window.innerWidth) * 2 - 1;
    const normY = (e.clientY / window.innerHeight) * 2 - 1;
    mouseRef.current = { x: normX, y: normY };

    if (!isDraggingRef.current) return;
    const dx = e.clientX - lastMousePosRef.current.x;
    const dy = e.clientY - lastMousePosRef.current.y;

    manualOrbitRef.current.x += dx * 0.008;
    manualOrbitRef.current.y += dy * 0.008;

    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      className="fixed inset-0 w-full h-full pointer-events-auto z-0 cursor-grab active:cursor-grabbing"
      style={{ touchAction: "none" }}
    />
  );
}
