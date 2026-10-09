"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { FABRICS, buildFabricTextures } from "@/lib/fabrics";
import { stage } from "@/lib/stage";

/**
 * Real-time Verlet cloth: a dupatta held along its top edge, blown by wind that
 * strengthens with scroll velocity and leans toward the pointer. Fabric changes
 * with a golden "re-weaving" wipe driven by stage.fabric.
 */

const CLOTH_W = 3.0;
const CLOTH_H = 5.2;
const FOV = 30;
const STEP = 1 / 60;

export default function SilkCanvas() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const small = window.innerWidth < 768;
    const COLS = small ? 24 : 34;
    const ROWS = small ? 40 : 56;
    const ITER = small ? 8 : 10;
    const N = COLS * ROWS;
    const restX = CLOTH_W / (COLS - 1);
    const restY = CLOTH_H / (ROWS - 1);

    /* ------------------------------------------------------------ renderer */
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, small ? 1.5 : 1.75));
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.82;
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 100);
    const view = { halfW: 1, halfH: 1 };

    const pmrem = new THREE.PMREMGenerator(renderer);
    const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTex;

    scene.add(new THREE.HemisphereLight(0xfff1dc, 0x1a1020, 0.25));
    const key = new THREE.DirectionalLight(0xffe2b8, 1.7);
    key.position.set(4, 5, 6);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0x9fb8ff, 1.3);
    rim.position.set(-5, 2, -4);
    scene.add(rim);
    const warmFill = new THREE.PointLight(0xffb070, 5, 14, 1.6);
    warmFill.position.set(-2.5, -1, 3.5);
    scene.add(warmFill);

    /* ------------------------------------------------------------ fabrics */
    const aniso = Math.min(8, renderer.capabilities.getMaxAnisotropy());
    const textures = buildFabricTextures(aniso);
    textures.forEach((t) => {
      renderer.initTexture(t.map);
      renderer.initTexture(t.orm);
    });

    const uniforms = {
      uMapB: { value: textures[1].map },
      uOrmB: { value: textures[1].orm },
      uMix: { value: 0 },
    };

    const material = new THREE.MeshPhysicalMaterial({
      map: textures[0].map,
      roughnessMap: textures[0].orm,
      metalnessMap: textures[0].orm,
      roughness: 1,
      metalness: 1,
      sheen: 0.3,
      sheenRoughness: FABRICS[0].sheenRoughness,
      sheenColor: new THREE.Color(FABRICS[0].sheen),
      envMapIntensity: 0.5,
      side: THREE.DoubleSide,
    });

    material.onBeforeCompile = (shader) => {
      Object.assign(shader.uniforms, uniforms);
      shader.fragmentShader =
        "uniform sampler2D uMapB;\nuniform sampler2D uOrmB;\nuniform float uMix;\n" +
        shader.fragmentShader
          .replace(
            "#include <map_fragment>",
            /* glsl */ `
            float clothMix = 0.0;
            #ifdef USE_MAP
              // re-weave front travels from the hand-held top edge down to the pallu
              float front = (1.0 - vMapUv.y) * 0.78 + 0.06 * sin(vMapUv.x * 18.0 + vMapUv.y * 9.0);
              float t = uMix * 1.3 - 0.15;
              clothMix = smoothstep(front - 0.07, front + 0.07, t);
              diffuseColor *= mix(texture2D(map, vMapUv), texture2D(uMapB, vMapUv), clothMix);
              float thread = pow(1.0 - abs(clothMix * 2.0 - 1.0), 14.0);
              totalEmissiveRadiance += vec3(1.0, 0.7, 0.3) * thread * 0.9;
            #endif
            `,
          )
          .replace(
            "#include <roughnessmap_fragment>",
            /* glsl */ `
            float roughnessFactor = roughness;
            #ifdef USE_ROUGHNESSMAP
              roughnessFactor *= mix(texture2D(roughnessMap, vRoughnessMapUv), texture2D(uOrmB, vRoughnessMapUv), clothMix).g;
            #endif
            `,
          )
          .replace(
            "#include <metalnessmap_fragment>",
            /* glsl */ `
            float metalnessFactor = metalness;
            #ifdef USE_METALNESSMAP
              metalnessFactor *= mix(texture2D(metalnessMap, vMetalnessMapUv), texture2D(uOrmB, vMetalnessMapUv), clothMix).b;
            #endif
            `,
          );
    };

    /* ------------------------------------------------------------ cloth sim */
    const geometry = new THREE.PlaneGeometry(CLOTH_W, CLOTH_H, COLS - 1, ROWS - 1);
    const pos = geometry.attributes.position.array as Float32Array;
    const prev = new Float32Array(N * 3);
    const acc = new Float32Array(N * 3);
    const invMass = new Float32Array(N).fill(1);

    // the whole top edge is held, along a gentle arc — as if over an outstretched arm
    const pins: number[] = [];
    const pinLocal: number[] = [];
    for (let c = 0; c < COLS; c++) {
      pins.push(c);
      invMass[c] = 0;
      const u = (c / (COLS - 1)) * 2 - 1;
      pinLocal.push(-CLOTH_W / 2 + c * restX, -0.18 * (1 - u * u), 0);
    }

    const ca: number[] = [];
    const cb: number[] = [];
    const ck: number[] = [];
    const id = (r: number, c: number) => r * COLS + c;
    const link = (a: number, b: number, k: number) => {
      ca.push(a);
      cb.push(b);
      ck.push(k);
    };
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (c < COLS - 1) link(id(r, c), id(r, c + 1), 1);
        if (r < ROWS - 1) link(id(r, c), id(r + 1, c), 1);
        if (c < COLS - 1 && r < ROWS - 1) {
          link(id(r, c), id(r + 1, c + 1), 0.6);
          link(id(r, c + 1), id(r + 1, c), 0.6);
        }
        if (c < COLS - 2) link(id(r, c), id(r, c + 2), 0.12);
        if (r < ROWS - 2) link(id(r, c), id(r + 2, c), 0.12);
      }
    }
    const CA = Int32Array.from(ca);
    const CB = Int32Array.from(cb);
    const CK = Float32Array.from(ck);
    const CR = new Float32Array(CA.length);
    for (let i = 0; i < CA.length; i++) {
      const a = CA[i] * 3;
      const b = CB[i] * 3;
      CR[i] = Math.hypot(pos[b] - pos[a], pos[b + 1] - pos[a + 1], pos[b + 2] - pos[a + 2]);
    }

    const index = geometry.index!.array;
    const TRI = index.length / 3;
    const windK = 1 / (restX * restY);

    const mesh = new THREE.Mesh(geometry, material);
    mesh.frustumCulled = false;
    scene.add(mesh);

    /* ------------------------------------------------------------ gold dust */
    const DUST = small ? 120 : 260;
    const dustPos = new Float32Array(DUST * 3);
    const dustSpeed = new Float32Array(DUST);
    for (let i = 0; i < DUST; i++) {
      dustPos[i * 3] = (Math.random() - 0.5) * 12;
      dustPos[i * 3 + 1] = (Math.random() - 0.5) * 8;
      dustPos[i * 3 + 2] = (Math.random() - 0.5) * 5;
      dustSpeed[i] = 0.05 + Math.random() * 0.12;
    }
    const dustGeo = new THREE.BufferGeometry();
    dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPos, 3));
    const dot = document.createElement("canvas");
    dot.width = dot.height = 64;
    const dctx = dot.getContext("2d")!;
    const grad = dctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, "rgba(255,236,190,1)");
    grad.addColorStop(0.35, "rgba(230,185,100,0.55)");
    grad.addColorStop(1, "rgba(0,0,0,0)");
    dctx.fillStyle = grad;
    dctx.fillRect(0, 0, 64, 64);
    const dustTex = new THREE.CanvasTexture(dot);
    const dustMat = new THREE.PointsMaterial({
      size: 0.06,
      map: dustTex,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      opacity: 0.85,
    });
    const dust = new THREE.Points(dustGeo, dustMat);
    scene.add(dust);

    /* ------------------------------------------------------------ state */
    const cur = { x: stage.x, y: stage.y, tilt: stage.tilt, turn: stage.turn, wind: stage.wind, fabric: stage.fabric, vel: 0 };
    const mouse = { x: 0, y: 0, sx: 0, sy: 0 };
    const anchor = new THREE.Vector3();
    const qTilt = new THREE.Quaternion();
    const qTurn = new THREE.Quaternion();
    const tmp = new THREE.Vector3();
    const sheenA = new THREE.Color();
    const sheenB = new THREE.Color();
    const fabricColors = FABRICS.map((f) => new THREE.Color(f.sheen));
    let weight = FABRICS[0].weight;
    let time = 0;

    const pinTarget = (k: number, out: THREE.Vector3) => {
      out.set(pinLocal[k * 3], pinLocal[k * 3 + 1], pinLocal[k * 3 + 2]);
      out.applyQuaternion(qTilt).applyQuaternion(qTurn).add(anchor);
      return out;
    };

    const updateAnchor = () => {
      anchor.set(cur.x * view.halfW, cur.y * view.halfH + Math.sin(time * 0.8) * 0.06, 0);
      qTilt.setFromAxisAngle(tmp.set(0, 0, 1), cur.tilt + Math.sin(time * 0.55) * 0.04);
      qTurn.setFromAxisAngle(tmp.set(0, 1, 0), cur.turn + Math.sin(time * 0.4) * 0.18);
    };

    // lay the cloth out hanging straight below its pins
    const resetCloth = () => {
      updateAnchor();
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          const i = id(r, c) * 3;
          tmp.set(-CLOTH_W / 2 + c * restX, -r * restY, 0).applyQuaternion(qTilt).applyQuaternion(qTurn).add(anchor);
          pos[i] = prev[i] = tmp.x;
          pos[i + 1] = prev[i + 1] = tmp.y;
          pos[i + 2] = prev[i + 2] = tmp.z;
        }
      }
    };

    const wind = new THREE.Vector3();

    const simulate = () => {
      time += STEP;
      updateAnchor();

      // wind: breathing gusts + scroll rush + pointer lean
      const gust = 5.5 + 3.5 * Math.sin(time * 0.9) * Math.sin(time * 0.37 + 1.3) + 1.6 * Math.sin(time * 2.3);
      const rush = Math.min(Math.abs(cur.vel) * 0.45, 14);
      const strength = (gust * cur.wind + rush) * (reduceMotion ? 0.4 : 1);
      wind
        .set(0.7 + Math.cos(time * 0.3) * 0.5 + mouse.sx * 0.9, 0.12 + mouse.sy * 0.3, 0.75 + Math.sin(time * 0.5) * 0.4)
        .normalize()
        .multiplyScalar(strength);
      wind.y += THREE.MathUtils.clamp(cur.vel * 0.3, -9, 9);

      acc.fill(0);
      for (let t = 0; t < TRI; t++) {
        const a = index[t * 3] * 3;
        const b = index[t * 3 + 1] * 3;
        const c = index[t * 3 + 2] * 3;
        const e1x = pos[b] - pos[a];
        const e1y = pos[b + 1] - pos[a + 1];
        const e1z = pos[b + 2] - pos[a + 2];
        const e2x = pos[c] - pos[a];
        const e2y = pos[c + 1] - pos[a + 1];
        const e2z = pos[c + 2] - pos[a + 2];
        const nx = e1y * e2z - e1z * e2y;
        const ny = e1z * e2x - e1x * e2z;
        const nz = e1x * e2y - e1y * e2x;
        const len = Math.hypot(nx, ny, nz) || 1;
        // travelling turbulence so the silk ripples instead of billowing as one sheet
        const px = pos[a];
        const py = pos[a + 1];
        const turb = 0.45 + 0.9 * (0.5 + 0.5 * Math.sin(px * 1.7 + time * 2.4) * Math.cos(py * 1.3 - time * 1.9));
        // force along the normal ∝ facing wind, scaled by triangle area
        const s = ((nx * wind.x + ny * wind.y + nz * wind.z) / len) * (len * 0.5) * windK * turb / 3 / len;
        const fx = nx * s;
        const fy = ny * s;
        const fz = nz * s;
        acc[a] += fx; acc[a + 1] += fy; acc[a + 2] += fz;
        acc[b] += fx; acc[b + 1] += fy; acc[b + 2] += fz;
        acc[c] += fx; acc[c + 1] += fy; acc[c + 2] += fz;
      }

      const g = -9.8 * weight;
      const dt2 = STEP * STEP;
      const damp = 0.982;
      for (let p = 0; p < N; p++) {
        if (invMass[p] === 0) continue;
        const i = p * 3;
        for (let k = 0; k < 3; k++) {
          const x = pos[i + k];
          const v = (x - prev[i + k]) * damp;
          prev[i + k] = x;
          pos[i + k] = x + v + (acc[i + k] + (k === 1 ? g : 0)) * dt2;
        }
      }

      for (let k = 0; k < pins.length; k++) {
        pinTarget(k, tmp);
        const i = pins[k] * 3;
        pos[i] = tmp.x;
        pos[i + 1] = tmp.y;
        pos[i + 2] = tmp.z;
      }

      for (let iter = 0; iter < ITER; iter++) {
        for (let n = 0; n < CA.length; n++) {
          const a = CA[n];
          const b = CB[n];
          const wa = invMass[a];
          const wb = invMass[b];
          const w = wa + wb;
          if (w === 0) continue;
          const ia = a * 3;
          const ib = b * 3;
          const dx = pos[ib] - pos[ia];
          const dy = pos[ib + 1] - pos[ia + 1];
          const dz = pos[ib + 2] - pos[ia + 2];
          const d = Math.sqrt(dx * dx + dy * dy + dz * dz) || 1e-6;
          const corr = ((d - CR[n]) / d) * CK[n];
          const ka = (corr * wa) / w;
          const kb = (corr * wb) / w;
          pos[ia] += dx * ka; pos[ia + 1] += dy * ka; pos[ia + 2] += dz * ka;
          pos[ib] -= dx * kb; pos[ib + 1] -= dy * kb; pos[ib + 2] -= dz * kb;
        }
      }
    };

    /* ------------------------------------------------------------ sizing */
    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const aspect = w / h;
      const tanHalf = Math.tan(THREE.MathUtils.degToRad(FOV / 2));
      // keep the dupatta ~65% of width on portrait screens
      const dist = Math.max(10.5, 2.3 / aspect / tanHalf);
      camera.aspect = aspect;
      camera.position.set(0, 0, dist);
      camera.lookAt(0, 0, 0);
      camera.updateProjectionMatrix();
      view.halfH = dist * tanHalf;
      view.halfW = view.halfH * aspect;
      renderer.setSize(w, h);
    };
    resize();
    resetCloth();
    window.addEventListener("resize", resize);

    const onPointer = (e: PointerEvent) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onPointer, { passive: true });

    /* ------------------------------------------------------------ loop */
    const clock = new THREE.Clock();
    let acc_t = 0;
    let raf = 0;
    const ease = (k: number, dt: number) => 1 - Math.exp(-k * dt);

    const frame = () => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(clock.getDelta(), 0.05);

      const e = ease(2.2, dt);
      cur.x += (stage.x - cur.x) * e;
      cur.y += (stage.y - cur.y) * ease(1.8, dt);
      cur.tilt += (stage.tilt - cur.tilt) * e;
      cur.turn += (stage.turn - cur.turn) * e;
      cur.wind += (stage.wind - cur.wind) * e;
      cur.fabric += (stage.fabric - cur.fabric) * ease(2.6, dt);
      cur.vel += (stage.velocity - cur.vel) * ease(6, dt);
      mouse.sx += (mouse.x - mouse.sx) * ease(2, dt);
      mouse.sy += (mouse.y - mouse.sy) * ease(2, dt);

      // fabric blend
      const last = FABRICS.length - 1;
      const f = THREE.MathUtils.clamp(cur.fabric, 0, last);
      const a = Math.min(Math.floor(f), last);
      const b = Math.min(a + 1, last);
      const m = a === last ? 0 : f - a;
      material.map = textures[a].map;
      material.roughnessMap = textures[a].orm;
      material.metalnessMap = textures[a].orm;
      uniforms.uMapB.value = textures[b].map;
      uniforms.uOrmB.value = textures[b].orm;
      uniforms.uMix.value = m;
      sheenA.copy(fabricColors[a]);
      sheenB.copy(fabricColors[b]);
      material.sheenColor.copy(sheenA).lerp(sheenB, m);
      material.sheenRoughness = THREE.MathUtils.lerp(FABRICS[a].sheenRoughness, FABRICS[b].sheenRoughness, m);
      weight = THREE.MathUtils.lerp(FABRICS[a].weight, FABRICS[b].weight, m);

      acc_t += dt;
      let steps = 0;
      while (acc_t >= STEP && steps < 3) {
        simulate();
        acc_t -= STEP;
        steps++;
      }
      if (steps === 3) acc_t = 0;

      geometry.attributes.position.needsUpdate = true;
      geometry.computeVertexNormals();

      const d = dustGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < DUST; i++) {
        d[i * 3 + 1] += dustSpeed[i] * dt * (1 + Math.abs(cur.vel) * 0.08);
        d[i * 3] += Math.sin(time + i) * 0.002;
        if (d[i * 3 + 1] > 4) d[i * 3 + 1] = -4;
      }
      dustGeo.attributes.position.needsUpdate = true;

      camera.position.x = mouse.sx * 0.25;
      camera.position.y = mouse.sy * 0.15;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };
    frame();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointer);
      textures.forEach((t) => {
        t.map.dispose();
        t.orm.dispose();
      });
      geometry.dispose();
      material.dispose();
      dustGeo.dispose();
      dustMat.dispose();
      dustTex.dispose();
      envTex.dispose();
      pmrem.dispose();
      renderer.dispose();
      host.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={hostRef} aria-hidden="true" className="silk-canvas" />;
}
