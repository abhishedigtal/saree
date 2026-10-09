import * as THREE from "three";

/**
 * Procedural fabric library. Each fabric is painted twice onto a canvas:
 *  - colour pass  -> albedo map
 *  - ORM pass     -> G = roughness, B = metalness (zari threads glint, silk stays soft)
 * Canvas top = top edge of the hanging cloth, canvas bottom = the decorated pallu.
 */

export const TEX_W = 1024;
export const TEX_H = 1792;

type Ctx = CanvasRenderingContext2D;
type Paint = (key: string) => string;

export interface FabricDef {
  name: string;
  sheen: string;
  sheenRoughness: number;
  /** gravity multiplier: denim hangs heavier than organza */
  weight: number;
  colors: Record<string, string>;
  orm: Record<string, [rough: number, metal: number]>;
  draw: (ctx: Ctx, c: Paint, isOrm: boolean) => void;
}

/* ----------------------------------------------------------------- helpers */

function rand(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function grain(ctx: Ctx, alpha: number, seed = 7) {
  const tile = document.createElement("canvas");
  tile.width = tile.height = 256;
  const t = tile.getContext("2d")!;
  const img = t.createImageData(256, 256);
  const r = rand(seed);
  for (let i = 0; i < img.data.length; i += 4) {
    const v = r() * 255;
    img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
    img.data[i + 3] = 255;
  }
  t.putImageData(img, 0, 0);
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.globalCompositeOperation = "overlay";
  ctx.fillStyle = ctx.createPattern(tile, "repeat")!;
  ctx.fillRect(0, 0, TEX_W, TEX_H);
  ctx.restore();
}

/** Long vertical light streaks — the "liquid" look of mulberry silk. */
function silkStreaks(ctx: Ctx, color: string, alpha: number, seed = 3) {
  const r = rand(seed);
  ctx.save();
  ctx.fillStyle = color;
  for (let i = 0; i < 140; i++) {
    ctx.globalAlpha = r() * alpha;
    ctx.fillRect(r() * TEX_W, 0, 1 + r() * 6, TEX_H);
  }
  ctx.restore();
}

function weave(ctx: Ctx, color: string, alpha: number, step = 4) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = color;
  for (let i = 0; i < TEX_W; i += step) ctx.fillRect(i, 0, 1, TEX_H);
  for (let i = 0; i < TEX_H; i += step) ctx.fillRect(0, i, TEX_W, 1);
  ctx.restore();
}

function flower(ctx: Ctx, x: number, y: number, r: number, fill: string, petals = 6) {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = fill;
  for (let i = 0; i < petals; i++) {
    ctx.rotate((Math.PI * 2) / petals);
    ctx.beginPath();
    ctx.ellipse(0, -r * 0.55, r * 0.22, r * 0.48, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function paisley(ctx: Ctx, x: number, y: number, s: number, rot: number, fill: string, inner?: string) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  ctx.scale(s, s);
  const shape = () => {
    ctx.beginPath();
    ctx.moveTo(0, -1);
    ctx.bezierCurveTo(0.95, -0.55, 0.9, 0.75, 0, 0.82);
    ctx.bezierCurveTo(-0.72, 0.85, -0.78, 0.05, -0.15, -0.05);
    ctx.bezierCurveTo(0.2, -0.15, 0.12, -0.62, 0, -1);
    ctx.closePath();
  };
  ctx.fillStyle = fill;
  shape();
  ctx.fill();
  if (inner) {
    ctx.save();
    ctx.scale(0.62, 0.62);
    ctx.translate(0.02, 0.18);
    ctx.fillStyle = inner;
    shape();
    ctx.fill();
    ctx.restore();
    ctx.fillStyle = fill;
    ctx.beginPath();
    ctx.arc(0.04, 0.32, 0.16, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function band(ctx: Ctx, y: number, h: number, fill: string) {
  ctx.fillStyle = fill;
  ctx.fillRect(0, y, TEX_W, h);
}

function fringe(ctx: Ctx, y: number, h: number, fill: string, gap = 9) {
  ctx.save();
  ctx.strokeStyle = fill;
  ctx.lineWidth = 3;
  for (let x = 4; x < TEX_W; x += gap) {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + 1.5, y + h);
    ctx.stroke();
  }
  ctx.restore();
}

function triangles(ctx: Ctx, y: number, h: number, w: number, fill: string, up = true) {
  ctx.fillStyle = fill;
  for (let x = 0; x < TEX_W + w; x += w) {
    ctx.beginPath();
    if (up) {
      ctx.moveTo(x, y + h);
      ctx.lineTo(x + w / 2, y);
      ctx.lineTo(x + w, y + h);
    } else {
      ctx.moveTo(x, y);
      ctx.lineTo(x + w / 2, y + h);
      ctx.lineTo(x + w, y);
    }
    ctx.closePath();
    ctx.fill();
  }
}

function sideBorders(ctx: Ctx, w: number, fill: string, line: string) {
  ctx.fillStyle = fill;
  ctx.fillRect(0, 0, w, TEX_H);
  ctx.fillRect(TEX_W - w, 0, w, TEX_H);
  ctx.fillStyle = line;
  ctx.fillRect(w - 8, 0, 3, TEX_H);
  ctx.fillRect(TEX_W - w + 5, 0, 3, TEX_H);
  ctx.fillRect(10, 0, 2, TEX_H);
  ctx.fillRect(TEX_W - 12, 0, 2, TEX_H);
}

/* ----------------------------------------------------------------- fabrics */

const banarasi: FabricDef = {
  name: "Banarasi Brocade",
  sheen: "#ff7a8a",
  sheenRoughness: 0.32,
  weight: 1,
  colors: { base: "#680b1a", deep: "#3e0610", gold: "#d9ae5c", goldHi: "#f3d48e" },
  orm: { base: [0.5, 0], deep: [0.55, 0], gold: [0.3, 1], goldHi: [0.22, 1] },
  draw(ctx, c, isOrm) {
    const g = ctx.createLinearGradient(0, 0, TEX_W, 0);
    g.addColorStop(0, c("deep"));
    g.addColorStop(0.5, c("base"));
    g.addColorStop(1, c("deep"));
    ctx.fillStyle = isOrm ? c("base") : g;
    ctx.fillRect(0, 0, TEX_W, TEX_H);
    if (!isOrm) {
      silkStreaks(ctx, "#ff9aa5", 0.04);
      weave(ctx, "#000", 0.08);
    }
    // body butis — staggered jaal
    for (let row = 0, y = 70; y < TEX_H - 560; y += 104, row++) {
      for (let x = 120 + (row % 2) * 64; x < TEX_W - 100; x += 128) {
        if (row % 3 === 1) paisley(ctx, x, y, 22, 0.4, c("gold"));
        else flower(ctx, x, y, 20, c("gold"));
      }
    }
    sideBorders(ctx, 74, c("gold"), c("deep"));
    for (let y = 30; y < TEX_H; y += 60) {
      flower(ctx, 37, y, 16, c("deep"), 4);
      flower(ctx, TEX_W - 37, y, 16, c("deep"), 4);
    }
    // pallu
    const py = TEX_H - 540;
    triangles(ctx, py - 46, 46, 46, c("gold"));
    band(ctx, py, 500, c("gold"));
    band(ctx, py + 22, 4, c("deep"));
    band(ctx, py + 474, 4, c("deep"));
    for (let r = 0; r < 3; r++) {
      const y = py + 110 + r * 140;
      for (let x = 70; x < TEX_W; x += 120) {
        paisley(ctx, x + (r % 2) * 60, y, 52, r % 2 ? -0.35 : 0.35, c("deep"), c("goldHi"));
      }
      if (r < 2) band(ctx, y + 66, 3, c("deep"));
    }
    fringe(ctx, TEX_H - 40, 40, c("gold"));
    if (!isOrm) grain(ctx, 0.16);
  },
};

const kanjeevaram: FabricDef = {
  name: "Kanjeevaram Temple Silk",
  sheen: "#ff5fb6",
  sheenRoughness: 0.3,
  weight: 1.1,
  colors: { base: "#0d5c63", deep: "#083b42", border: "#9a1b66", gold: "#d8b062", goldHi: "#f1d38c" },
  orm: { base: [0.42, 0], deep: [0.46, 0], border: [0.42, 0], gold: [0.28, 1], goldHi: [0.2, 1] },
  draw(ctx, c, isOrm) {
    ctx.fillStyle = c("base");
    ctx.fillRect(0, 0, TEX_W, TEX_H);
    if (!isOrm) {
      silkStreaks(ctx, "#7ff0e4", 0.08, 11);
      weave(ctx, "#000", 0.07);
    }
    // gold coin butis
    for (let row = 0, y = 90; y < TEX_H - 600; y += 120, row++) {
      for (let x = 190 + (row % 2) * 80; x < TEX_W - 170; x += 160) {
        ctx.fillStyle = c("gold");
        ctx.beginPath();
        ctx.arc(x, y, 17, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = c("base");
        ctx.beginPath();
        ctx.arc(x, y, 9, 0, Math.PI * 2);
        ctx.fill();
        flower(ctx, x, y, 10, c("goldHi"), 4);
      }
    }
    // temple borders with inward gopuram teeth
    ctx.fillStyle = c("border");
    ctx.fillRect(0, 0, 120, TEX_H);
    ctx.fillRect(TEX_W - 120, 0, 120, TEX_H);
    ctx.fillStyle = c("gold");
    ctx.fillRect(14, 0, 10, TEX_H);
    ctx.fillRect(TEX_W - 24, 0, 10, TEX_H);
    for (let y = 0; y < TEX_H; y += 56) {
      ctx.beginPath();
      ctx.moveTo(120, y);
      ctx.lineTo(160, y + 28);
      ctx.lineTo(120, y + 56);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(TEX_W - 120, y);
      ctx.lineTo(TEX_W - 160, y + 28);
      ctx.lineTo(TEX_W - 120, y + 56);
      ctx.fill();
      flower(ctx, 68, y + 28, 18, c("goldHi"));
      flower(ctx, TEX_W - 68, y + 28, 18, c("goldHi"));
    }
    // pallu
    const py = TEX_H - 600;
    band(ctx, py, 600, c("border"));
    band(ctx, py + 20, 16, c("gold"));
    triangles(ctx, py + 36, 170, 96, c("gold"));
    for (let x = 48; x < TEX_W; x += 96) flower(ctx, x, py + 170, 14, c("border"), 5);
    band(ctx, py + 230, 10, c("gold"));
    for (let x = 60; x < TEX_W; x += 110) paisley(ctx, x, py + 320, 46, 0.3, c("gold"), c("border"));
    band(ctx, py + 400, 10, c("gold"));
    triangles(ctx, py + 420, 130, 64, c("gold"), false);
    band(ctx, TEX_H - 50, 14, c("gold"));
    fringe(ctx, TEX_H - 36, 36, c("border"), 12);
    if (!isOrm) grain(ctx, 0.14, 21);
  },
};

const lehenga: FabricDef = {
  name: "Rajputana Zardozi",
  sheen: "#ffb38a",
  sheenRoughness: 0.5,
  weight: 0.9,
  colors: { base: "#14432f", deep: "#0a2a1d", maroon: "#5e0f1f", gold: "#d6aa58", goldHi: "#f5d999" },
  orm: { base: [0.62, 0], deep: [0.66, 0], maroon: [0.6, 0], gold: [0.28, 1], goldHi: [0.18, 1] },
  draw(ctx, c, isOrm) {
    const g = ctx.createLinearGradient(0, 0, 0, TEX_H);
    g.addColorStop(0, c("deep"));
    g.addColorStop(1, c("base"));
    ctx.fillStyle = isOrm ? c("base") : g;
    ctx.fillRect(0, 0, TEX_W, TEX_H);
    if (!isOrm) weave(ctx, "#9fe0bf", 0.05, 3);
    // scattered sequins / mukaish
    const r = rand(42);
    for (let i = 0; i < 900; i++) {
      ctx.fillStyle = r() > 0.4 ? c("gold") : c("goldHi");
      ctx.beginPath();
      ctx.arc(r() * TEX_W, r() * (TEX_H - 520), 2 + r() * 3.5, 0, Math.PI * 2);
      ctx.fill();
    }
    // maroon velvet frame with gold zardozi scallops
    ctx.fillStyle = c("maroon");
    ctx.fillRect(0, 0, 90, TEX_H);
    ctx.fillRect(TEX_W - 90, 0, 90, TEX_H);
    ctx.fillStyle = c("gold");
    for (let y = 0; y < TEX_H; y += 40) {
      ctx.beginPath();
      ctx.arc(90, y + 20, 20, -Math.PI / 2, Math.PI / 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(TEX_W - 90, y + 20, 20, Math.PI / 2, (3 * Math.PI) / 2);
      ctx.fill();
      flower(ctx, 45, y + 20, 14, c("goldHi"), 5);
      flower(ctx, TEX_W - 45, y + 20, 14, c("goldHi"), 5);
    }
    const py = TEX_H - 520;
    band(ctx, py, 520, c("maroon"));
    for (let x = 0; x < TEX_W; x += 52) {
      ctx.fillStyle = c("gold");
      ctx.beginPath();
      ctx.arc(x + 26, py, 26, 0, Math.PI);
      ctx.fill();
    }
    for (let x = 80; x < TEX_W; x += 150) {
      flower(ctx, x, py + 150, 58, c("gold"), 8);
      flower(ctx, x, py + 150, 26, c("maroon"), 8);
      paisley(ctx, x + 75, py + 300, 44, Math.PI, c("gold"), c("maroon"));
    }
    band(ctx, py + 390, 12, c("gold"));
    band(ctx, py + 420, 70, c("gold"));
    for (let x = 30; x < TEX_W; x += 60) flower(ctx, x, py + 455, 22, c("maroon"), 6);
    fringe(ctx, TEX_H - 30, 30, c("goldHi"), 7);
    if (!isOrm) grain(ctx, 0.18, 9);
  },
};

const denim: FabricDef = {
  name: "Selvedge Denim",
  sheen: "#33486e",
  sheenRoughness: 0.85,
  weight: 1.7,
  colors: {
    base: "#203a63",
    dark: "#14243f",
    fade: "#6f8db8",
    stitch: "#e0913f",
    rivet: "#c08a4a",
    leather: "#9b6a3c",
    leatherDark: "#6a4422",
  },
  orm: {
    base: [0.92, 0],
    dark: [0.95, 0],
    fade: [0.9, 0],
    stitch: [0.75, 0],
    rivet: [0.25, 1],
    leather: [0.7, 0],
    leatherDark: [0.75, 0],
  },
  draw(ctx, c, isOrm) {
    ctx.fillStyle = c("base");
    ctx.fillRect(0, 0, TEX_W, TEX_H);
    if (!isOrm) {
      // 3x1 right-hand twill
      ctx.save();
      ctx.lineWidth = 1.6;
      for (let i = -TEX_H; i < TEX_W; i += 5) {
        ctx.strokeStyle = i % 10 === 0 ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.16)";
        ctx.beginPath();
        ctx.moveTo(i, TEX_H);
        ctx.lineTo(i + TEX_H, 0);
        ctx.stroke();
      }
      ctx.restore();
      // slub yarns
      const r = rand(5);
      ctx.fillStyle = "rgba(200,215,240,0.18)";
      for (let i = 0; i < 700; i++) ctx.fillRect(r() * TEX_W, r() * TEX_H, 10 + r() * 50, 1.4);
      // washed-out fade + whiskers
      const fade = ctx.createRadialGradient(TEX_W / 2, TEX_H * 0.45, 40, TEX_W / 2, TEX_H * 0.45, 560);
      fade.addColorStop(0, "rgba(140,170,210,0.22)");
      fade.addColorStop(1, "rgba(140,170,210,0)");
      ctx.fillStyle = fade;
      ctx.fillRect(0, 0, TEX_W, TEX_H);
      ctx.strokeStyle = "rgba(170,195,230,0.25)";
      for (let i = 0; i < 9; i++) {
        ctx.lineWidth = 3 + r() * 6;
        ctx.beginPath();
        const y = 260 + i * 26;
        ctx.moveTo(220 + r() * 60, y);
        ctx.quadraticCurveTo(TEX_W / 2, y + 40, TEX_W - 220 - r() * 60, y);
        ctx.stroke();
      }
    }
    // waistband + hem
    band(ctx, 0, 120, c("dark"));
    band(ctx, TEX_H - 90, 90, c("dark"));
    // flat-felled side seams
    ctx.fillStyle = c("dark");
    ctx.fillRect(0, 0, 60, TEX_H);
    ctx.fillRect(TEX_W - 60, 0, 60, TEX_H);
    // contrast stitching
    ctx.save();
    ctx.strokeStyle = c("stitch");
    ctx.lineWidth = 4;
    ctx.setLineDash([16, 9]);
    const stitchV = (x: number) => {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, TEX_H);
      ctx.stroke();
    };
    const stitchH = (y: number) => {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(TEX_W, y);
      ctx.stroke();
    };
    [44, 70, TEX_W - 70, TEX_W - 44].forEach(stitchV);
    [18, 104, 132, TEX_H - 78, TEX_H - 104].forEach(stitchH);
    // zari chain-stitch arc — the atelier's signature
    ctx.setLineDash([10, 6]);
    for (let k = 0; k < 2; k++) {
      ctx.beginPath();
      ctx.moveTo(200, 520 + k * 18);
      ctx.bezierCurveTo(380, 420 + k * 18, 640, 620 + k * 18, 830, 500 + k * 18);
      ctx.stroke();
    }
    ctx.restore();
    // leather patch
    ctx.fillStyle = c("leather");
    ctx.fillRect(TEX_W - 330, 170, 220, 130);
    ctx.strokeStyle = c("leatherDark");
    ctx.lineWidth = 4;
    ctx.strokeRect(TEX_W - 316, 184, 192, 102);
    if (!isOrm) {
      ctx.fillStyle = c("leatherDark");
      ctx.font = "600 30px Georgia, serif";
      ctx.textAlign = "center";
      ctx.fillText("MAHARANI", TEX_W - 220, 232);
      ctx.font = "italic 22px Georgia, serif";
      ctx.fillText("denim atelier", TEX_W - 220, 266);
    }
    // copper rivets
    ctx.fillStyle = c("rivet");
    [
      [90, 60],
      [TEX_W - 90, 60],
      [90, TEX_H - 45],
      [TEX_W - 90, TEX_H - 45],
    ].forEach(([x, y]) => {
      ctx.beginPath();
      ctx.arc(x, y, 14, 0, Math.PI * 2);
      ctx.fill();
    });
    if (!isOrm) grain(ctx, 0.25, 13);
  },
};

const organza: FabricDef = {
  name: "Ivory Chikankari Organza",
  sheen: "#fff4dc",
  sheenRoughness: 0.4,
  weight: 0.75,
  colors: { base: "#eee4d2", shade: "#ddcfb6", white: "#fffaf0", gold: "#cfa553" },
  orm: { base: [0.55, 0], shade: [0.6, 0], white: [0.5, 0], gold: [0.25, 1] },
  draw(ctx, c, isOrm) {
    ctx.fillStyle = c("base");
    ctx.fillRect(0, 0, TEX_W, TEX_H);
    if (!isOrm) {
      silkStreaks(ctx, "#ffffff", 0.18, 31);
      weave(ctx, "#a08b66", 0.06, 3);
    }
    // tone-on-tone chikan vines
    for (let row = 0, y = 80; y < TEX_H - 300; y += 130, row++) {
      for (let x = 110 + (row % 2) * 75; x < TEX_W - 80; x += 150) {
        flower(ctx, x, y, 26, c("white"), 6);
        flower(ctx, x, y, 9, c("shade"), 6);
        paisley(ctx, x + 40, y + 52, 13, 0.9, c("white"));
      }
    }
    // fine gold kiran edge
    band(ctx, 0, 14, c("gold"));
    ctx.fillStyle = c("gold");
    ctx.fillRect(0, 0, 14, TEX_H);
    ctx.fillRect(TEX_W - 14, 0, 14, TEX_H);
    ctx.fillRect(36, 0, 3, TEX_H);
    ctx.fillRect(TEX_W - 39, 0, 3, TEX_H);
    const py = TEX_H - 260;
    band(ctx, py, 4, c("gold"));
    for (let x = 40; x < TEX_W; x += 80) flower(ctx, x, py + 90, 30, c("gold"), 8);
    band(ctx, py + 170, 4, c("gold"));
    fringe(ctx, TEX_H - 40, 40, c("gold"), 11);
    if (!isOrm) grain(ctx, 0.1, 17);
  },
};

export const FABRICS: FabricDef[] = [banarasi, kanjeevaram, lehenga, denim, organza];

export interface FabricTextures {
  map: THREE.CanvasTexture;
  orm: THREE.CanvasTexture;
}

function toTexture(cvs: HTMLCanvasElement, srgb: boolean, aniso: number) {
  const tex = new THREE.CanvasTexture(cvs);
  tex.colorSpace = srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace;
  tex.anisotropy = aniso;
  tex.generateMipmaps = true;
  return tex;
}

export function buildFabricTextures(aniso: number): FabricTextures[] {
  return FABRICS.map((f) => {
    const make = (isOrm: boolean) => {
      const cvs = document.createElement("canvas");
      cvs.width = TEX_W;
      cvs.height = TEX_H;
      const ctx = cvs.getContext("2d")!;
      const paint: Paint = isOrm
        ? (k) => {
            const [r, m] = f.orm[k] ?? [0.6, 0];
            return `rgb(255, ${Math.round(r * 255)}, ${Math.round(m * 255)})`;
          }
        : (k) => f.colors[k] ?? "#ff00ff";
      f.draw(ctx, paint, isOrm);
      return cvs;
    };
    return { map: toTexture(make(false), true, aniso), orm: toTexture(make(true), false, aniso) };
  });
}
