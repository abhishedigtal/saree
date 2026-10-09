"use client";

import React, { useState } from "react";
import {
  Sparkles,
  ChevronDown,
  Layers,
  Palette,
  Check,
  Award,
  ShieldCheck,
  Eye,
  Crown,
  Rotate3d,
  Compass,
} from "lucide-react";

interface StoryChaptersProps {
  onOpenBespokeWithGarment: (garment: string) => void;
  onOpenLookbook: () => void;
  onColorChange: (hex: string) => void;
  activeColor: string;
}

export default function StoryChapters({
  onOpenBespokeWithGarment,
  onOpenLookbook,
  onColorChange,
  activeColor,
}: StoryChaptersProps) {
  const [lehengaKalis, setLehengaKalis] = useState<number>(360);

  const kanjeevaramColors = [
    { name: "Peacock Teal", hex: "#084c61" },
    { name: "Crimson Ruby", hex: "#771224" },
    { name: "Emerald Gold", hex: "#0a3d2c" },
    { name: "Jamdani Ochre", hex: "#b58930" },
  ];

  return (
    <div className="relative z-10 w-full pointer-events-none">

      {/* ========================================================
          SCENE 0: THE PROLOGUE // AWAKENING OF GOLD
         ======================================================== */}
      <section
        id="chapter-0"
        className="min-h-screen flex flex-col justify-end items-center text-center px-6 pb-20 relative pointer-events-auto"
      >
        <div className="max-w-3xl mx-auto space-y-5 backdrop-blur-md bg-black/40 border border-[var(--border-gold)] p-8 sm:p-12 rounded-2xl shadow-2xl">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--gold-primary)]/40 bg-[rgba(230,190,104,0.1)]">
            <Sparkles className="w-4 h-4 text-[var(--gold-primary)]" />
            <span className="font-royal text-xs uppercase tracking-[0.25em] text-[var(--gold-light)]">
              Interactive 3D Royal Chronicle
            </span>
          </div>

          <h1 className="font-royal text-4xl sm:text-6xl md:text-7xl font-black tracking-wider leading-none">
            <span className="gold-text gold-glow">MAHARANI &amp; CO.</span>
          </h1>

          <p className="font-serif italic text-xl sm:text-2xl text-[var(--gold-light)] font-light">
            &ldquo;Scroll to unwrap 500 years of imperial handlooms in 3D&rdquo;
          </p>

          <p className="font-serif text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed max-w-xl mx-auto">
            Drag your mouse anywhere to orbit the 3D royal chamber. As you scroll, the camera glides into the threads of sacred Banarasi zari, Rajputana lehengas, and Kanjeevaram silks.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <a href="#chapter-1" className="royal-btn-gold">
              <span>Enter Royal Chamber</span>
              <ChevronDown className="w-4 h-4" />
            </a>

            <button onClick={onOpenLookbook} className="royal-btn-outline">
              <Eye className="w-4 h-4" />
              <span>Inspect Lookbook</span>
            </button>
          </div>

          <div className="flex items-center justify-center gap-2 text-xs font-royal text-[var(--gold-primary)] pt-2 opacity-75">
            <Rotate3d className="w-4 h-4 animate-spin" />
            <span>Interactive 3D WebGL Engine Active</span>
          </div>

        </div>
      </section>


      {/* ========================================================
          SCENE 1: CHAPTER I // THE BANARASI ZARI
         ======================================================== */}
      <section
        id="chapter-1"
        className="min-h-screen flex items-center justify-start px-6 sm:px-16 py-24 relative pointer-events-auto"
      >
        <div className="max-w-lg space-y-5 backdrop-blur-md bg-black/60 border border-[var(--border-gold)] p-8 rounded-2xl shadow-2xl">
          
          <div className="flex items-center gap-2 text-[var(--gold-primary)]">
            <span className="font-royal text-xs uppercase tracking-[0.25em]">Chapter I</span>
            <span className="w-8 h-[1px] bg-[var(--gold-primary)]" />
            <span className="font-serif italic text-xs text-[var(--text-muted)]">Ghats of Varanasi</span>
          </div>

          <h2 className="font-royal text-3xl sm:text-4xl text-[var(--text-primary)] leading-tight">
            The Banarasi Zari <br />
            <span className="gold-text">Loom of Queens</span>
          </h2>

          <p className="font-serif text-base text-[var(--text-secondary)] leading-relaxed">
            The camera swoops into the 3D drape of pure crimson silk. On ancient pit-looms, master weavers intertwine 24k gold-dipped silver wire using the Kadwa interlock method—ensuring zero loose threads on the reverse.
          </p>

          {/* Metric Badges */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="bg-black/40 border border-[var(--border-gold)]/50 p-3 rounded text-center">
              <span className="font-royal text-lg text-[var(--gold-light)] font-bold block">98.5%</span>
              <span className="font-serif text-xs text-[var(--text-muted)]">Pure Silver &amp; Gold Gilt</span>
            </div>
            <div className="bg-black/40 border border-[var(--border-gold)]/50 p-3 rounded text-center">
              <span className="font-royal text-lg text-[var(--gold-light)] font-bold block">180 Days</span>
              <span className="font-serif text-xs text-[var(--text-muted)]">Continuous Hand-Weaving</span>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={() => onOpenBespokeWithGarment("The Crimson Banarasi Shikargah Saree")}
              className="royal-btn-gold !py-2.5 !px-5 text-xs"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Commission Saree</span>
            </button>
            <button
              onClick={onOpenLookbook}
              className="royal-btn-outline !py-2.5 !px-4 text-xs"
            >
              <span>View Archival Photo</span>
            </button>
          </div>

        </div>
      </section>


      {/* ========================================================
          SCENE 2: CHAPTER II // THE RAJPUTANA 360-KALIS LEHENGA
         ======================================================== */}
      <section
        id="chapter-2"
        className="min-h-screen flex items-center justify-end px-6 sm:px-16 py-24 relative pointer-events-auto"
      >
        <div className="max-w-lg space-y-5 backdrop-blur-md bg-black/60 border border-[var(--border-gold)] p-8 rounded-2xl shadow-2xl">
          
          <div className="flex items-center gap-2 text-[var(--gold-primary)]">
            <span className="font-royal text-xs uppercase tracking-[0.25em]">Chapter II</span>
            <span className="w-8 h-[1px] bg-[var(--gold-primary)]" />
            <span className="font-serif italic text-xs text-[var(--text-muted)]">Courts of Mewar</span>
          </div>

          <h2 className="font-royal text-3xl sm:text-4xl text-[var(--text-primary)] leading-tight">
            The Rajputana Lehenga <br />
            <span className="gold-text">360-Kalis Architecture</span>
          </h2>

          <p className="font-serif text-base text-[var(--text-secondary)] leading-relaxed">
            The 3D camera sweeps low around the 360-degree flared Kalis lehenga. Tailored with 360 individual panels of velvet ruby and beaten gold bullion dabka, creating an expansive 6-metre circumference.
          </p>

          {/* Interactive Kalis Slider */}
          <div className="bg-black/60 border border-[var(--border-gold)] p-4 rounded-lg space-y-2">
            <div className="flex justify-between items-center text-xs font-royal text-[var(--gold-light)]">
              <span className="flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-[var(--gold-primary)]" />
                <span>Flare Architecture:</span>
              </span>
              <span className="font-bold">{lehengaKalis} Kalis</span>
            </div>
            <input
              type="range"
              min={120}
              max={360}
              step={20}
              value={lehengaKalis}
              onChange={(e) => setLehengaKalis(Number(e.target.value))}
              className="w-full accent-[var(--gold-primary)] cursor-pointer"
            />
            <div className="flex justify-between text-[11px] font-serif text-[var(--text-muted)]">
              <span>120 Kalis</span>
              <span>240 Kalis</span>
              <span className="text-[var(--gold-light)]">360 Kalis (Royal)</span>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={() => onOpenBespokeWithGarment("The 360-Kalis Rajputana Bridal Lehenga")}
              className="royal-btn-gold !py-2.5 !px-5 text-xs"
            >
              <Crown className="w-3.5 h-3.5" />
              <span>Commission Lehenga</span>
            </button>
            <button
              onClick={onOpenLookbook}
              className="royal-btn-outline !py-2.5 !px-4 text-xs"
            >
              <span>Inspect Embroidery</span>
            </button>
          </div>

        </div>
      </section>


      {/* ========================================================
          SCENE 3: CHAPTER III // THE KANJEEVARAM TEMPLE SILK
         ======================================================== */}
      <section
        id="chapter-3"
        className="min-h-screen flex items-center justify-start px-6 sm:px-16 py-24 relative pointer-events-auto"
      >
        <div className="max-w-lg space-y-5 backdrop-blur-md bg-black/60 border border-[var(--border-gold)] p-8 rounded-2xl shadow-2xl">
          
          <div className="flex items-center gap-2 text-[var(--gold-primary)]">
            <span className="font-royal text-xs uppercase tracking-[0.25em]">Chapter III</span>
            <span className="w-8 h-[1px] bg-[var(--gold-primary)]" />
            <span className="font-serif italic text-xs text-[var(--text-muted)]">Temple Sanctum</span>
          </div>

          <h2 className="font-royal text-3xl sm:text-4xl text-[var(--text-primary)] leading-tight">
            The Kanjeevaram Temple Silk <br />
            <span className="gold-text">Armor of Queens</span>
          </h2>

          <p className="font-serif text-base text-[var(--text-secondary)] leading-relaxed">
            The 3D cloth shifts into heavy 3-ply mulberry silk consecrated in temple waters. Woven with Korvai interlocking temple Gopuram borders where two weavers sit opposite each other on the loom.
          </p>

          {/* Interactive Color Swatch Shifter */}
          <div className="bg-black/60 border border-[var(--border-gold)] p-4 rounded-lg space-y-2">
            <span className="font-royal text-xs text-[var(--gold-light)] flex items-center gap-1.5 block">
              <Palette className="w-3.5 h-3.5 text-[var(--gold-primary)]" />
              <span>Shift 3D Silk Hue in Real-Time:</span>
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
              {kanjeevaramColors.map((c) => {
                const isSelected = activeColor === c.hex;
                return (
                  <button
                    key={c.hex}
                    onClick={() => onColorChange(c.hex)}
                    className={`p-2 rounded border text-left transition-all ${
                      isSelected
                        ? "border-[var(--gold-light)] bg-black/90 shadow-[0_0_12px_rgba(230,190,104,0.5)]"
                        : "border-[var(--border-gold)]/40 bg-black/40 hover:border-[var(--gold-primary)]"
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-white/20"
                        style={{ backgroundColor: c.hex }}
                      />
                      {isSelected && <Check className="w-3 h-3 text-[var(--gold-light)] ml-auto" />}
                    </div>
                    <span className="text-[10px] font-royal text-[var(--text-primary)] block truncate">
                      {c.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={() => onOpenBespokeWithGarment("The Sacred Korvai Temple Kanjeevaram Saree")}
              className="royal-btn-gold !py-2.5 !px-5 text-xs"
            >
              <Award className="w-3.5 h-3.5" />
              <span>Commission Silk</span>
            </button>
            <button
              onClick={onOpenLookbook}
              className="royal-btn-outline !py-2.5 !px-4 text-xs"
            >
              <span>Temple Motifs</span>
            </button>
          </div>

        </div>
      </section>


      {/* ========================================================
          SCENE 4: CHAPTER IV // THE BESPOKE ROYAL ATELIER
         ======================================================== */}
      <section
        id="chapter-4"
        className="min-h-screen flex items-center justify-center px-6 py-24 relative pointer-events-auto"
      >
        <div className="max-w-2xl w-full text-center space-y-6 backdrop-blur-md bg-black/65 border border-[var(--border-gold)] p-8 sm:p-12 rounded-2xl shadow-2xl">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--gold-primary)]/40 bg-[rgba(230,190,104,0.1)]">
            <Crown className="w-4 h-4 text-[var(--gold-primary)]" />
            <span className="font-royal text-xs uppercase tracking-[0.25em] text-[var(--gold-light)]">
              Chapter IV // The Imperial Atelier
            </span>
          </div>

          <h2 className="font-royal text-3xl sm:text-5xl text-[var(--text-primary)] leading-tight">
            Commission Your <br />
            <span className="gold-text">Heirloom Masterpiece</span>
          </h2>

          <p className="font-serif text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed max-w-lg mx-auto">
            You are now in the 3D inspection chamber. Drag across the screen to orbit the royal mannequin in 360 degrees. Commission a bespoke creation hand-woven with certified pure 24k gold zari.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={() => onOpenBespokeWithGarment("Imperial Haute Couture Commission")}
              className="royal-btn-gold !py-3.5 !px-8 text-sm"
            >
              <Sparkles className="w-4 h-4" />
              <span>Request Private Atelier Audience</span>
            </button>

            <button onClick={onOpenLookbook} className="royal-btn-outline !py-3.5 !px-6 text-sm">
              <Eye className="w-4 h-4" />
              <span>Browse Full Lookbook</span>
            </button>
          </div>

          <div className="pt-6 border-t border-[var(--border-gold)]/40 flex flex-wrap justify-center gap-6 text-xs font-royal text-[var(--gold-dark)]">
            <span>VARANASI ATELIER</span>
            <span>&bull;</span>
            <span>JAIPUR SALON</span>
            <span>&bull;</span>
            <span>KANCHIPURAM GUILD</span>
            <span>&bull;</span>
            <span>LONDON MAYFAIR</span>
          </div>

        </div>
      </section>

    </div>
  );
}
