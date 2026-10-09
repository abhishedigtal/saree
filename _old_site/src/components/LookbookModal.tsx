"use client";

import React, { useState } from "react";
import { X, Sparkles, ZoomIn, ShieldCheck, Clock, Award } from "lucide-react";

interface LookbookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectGarmentForBespoke: (garment: string) => void;
}

const coutureCollection = [
  {
    id: 1,
    title: "The Rajkumari Crimson Banarasi",
    type: "Imperial Bridal Saree",
    origin: "Ghats of Varanasi",
    image: "/images/banarasi_saree.jpg",
    zari: "98.5% Tested Pure Gold Bullion",
    hours: "1,800 Handloom Hours",
    description: "Woven on pit-looms using the Kadwa interlock technique. Featuring the Mughal Shikargah forest hunting jaal interspersed with 24-karat gold dipped silver threads.",
    specs: ["Pure Mulberry Katan Silk", "6.5 Metres with Unstitched Blouse", "Heavy Shimmery Zari Pallu", "Weight: 1,180 Grams"],
  },
  {
    id: 2,
    title: "The Rajputana 360-Kalis Flared Lehenga",
    type: "Imperial Bridal Haute Couture",
    origin: "Mewar Royal Court Atelier",
    image: "/images/bridal_lehenga.jpg",
    zari: "Beaten Gold Wire & Basra Seed Pearls",
    hours: "4,200 Master Artisan Hours",
    description: "Constructed with 360 individual micro-kalis (panels) that produce an iconic architectural silhouette. Embroidered in authentic zardozi with raised dabka bullion work.",
    specs: ["Silk Velvet & Tissue Organza", "Full 6-Metre Flared Silhouette", "Dual Dupatta in Regal Crimson & Emerald", "Weight: 4,450 Grams"],
  },
  {
    id: 3,
    title: "The Mayilkan Temple Kanjeevaram",
    type: "Sacred Korvai Silk Saree",
    origin: "Temple City of Kanchipuram",
    image: "/images/kanjeevaram_silk.jpg",
    zari: "Molten 24k Gold Wire on Silver Thread",
    hours: "920 Handloom Hours",
    description: "Three single threads of consecrated mulberry silk intertwine with thick silver-gilt wire. Features the Korvai joint with triangular Gopuram temple borders.",
    specs: ["Heavy 3-Ply Consecrated Silk", "Peacock Teal & Rani Magenta Duo-tone", "Traditional Korvai Interlock Weave", "Weight: 940 Grams"],
  },
  {
    id: 4,
    title: "The Pit-Loom Heritage Archive",
    type: "Imperial Master Craftsmanship",
    origin: "Royal Master Atelier",
    image: "/images/craftsmanship_loom.jpg",
    zari: "Real Silver Core Zari Guild",
    hours: "Six Months of Continuous Weaving",
    description: "A testament to multi-generational craftsmanship passed down through five centuries of royal master weavers. Each inch of floral brocade is guided by hand-punched Naksha cards.",
    specs: ["Hand-Carded Silk Warp", "Naksha Jacquard Wooden Loom", "Natural Vegetable & Madder Dyes", "Imperial Royal Guild Certification"],
  },
];

export default function LookbookModal({
  isOpen,
  onClose,
  onSelectGarmentForBespoke,
}: LookbookModalProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (!isOpen) return null;

  const current = coutureCollection[selectedIndex];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-lg animate-fadeIn"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-5xl max-h-[92vh] bg-[rgba(12,10,18,0.98)] border border-[var(--gold-primary)] rounded-lg shadow-[0_25px_80px_rgba(0,0,0,0.95)] flex flex-col overflow-hidden">
        
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-gold)] bg-black/40">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[var(--gold-primary)]" />
            <span className="font-royal text-sm text-[var(--gold-light)] uppercase tracking-wider">
              The Imperial Lookbook Archive
            </span>
          </div>
          <button
            onClick={onClose}
            aria-label="Close lookbook"
            className="text-[var(--text-muted)] hover:text-[var(--gold-light)] p-1.5 rounded-full hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-6 p-6">
          {/* Main Showcase Image */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="relative aspect-[4/3] rounded-lg overflow-hidden border border-[var(--border-gold)] group shadow-2xl bg-black">
              {/* Image */}
              <img
                src={current.image}
                alt={current.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

              {/* Bottom badge */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                <span className="bg-black/70 border border-[var(--gold-primary)]/40 px-3 py-1 rounded text-xs font-royal text-[var(--gold-light)] backdrop-blur-md">
                  {current.origin}
                </span>
                <span className="text-xs text-[var(--text-muted)] flex items-center gap-1 bg-black/60 px-2 py-1 rounded">
                  <ZoomIn className="w-3.5 h-3.5 text-[var(--gold-primary)]" />
                  Archival Haute Couture
                </span>
              </div>
            </div>

            {/* Gallery Thumbnail Strip */}
            <div className="grid grid-cols-4 gap-3 mt-4">
              {coutureCollection.map((item, idx) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedIndex(idx)}
                  className={`relative aspect-[4/3] rounded overflow-hidden border transition-all ${
                    idx === selectedIndex
                      ? "border-[var(--gold-light)] shadow-[0_0_15px_rgba(230,190,104,0.5)] scale-105"
                      : "border-[rgba(230,190,104,0.2)] opacity-60 hover:opacity-100"
                  }`}
                >
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Couture Specifications & Narrative */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-5">
            <div>
              <span className="font-royal text-xs uppercase tracking-widest text-[var(--gold-dark)] block mb-1">
                {current.type}
              </span>
              <h3 className="font-royal text-2xl text-[var(--gold-light)]">
                {current.title}
              </h3>
              <p className="font-serif italic text-sm text-[var(--text-secondary)] mt-2 leading-relaxed">
                {current.description}
              </p>

              {/* Key Attributes */}
              <div className="grid grid-cols-2 gap-3 mt-5">
                <div className="bg-black/40 border border-[var(--border-gold)]/40 rounded p-3">
                  <div className="flex items-center gap-1.5 text-xs text-[var(--gold-primary)] font-royal mb-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Zari Grade</span>
                  </div>
                  <span className="text-xs text-[var(--text-primary)] font-serif block">
                    {current.zari}
                  </span>
                </div>

                <div className="bg-black/40 border border-[var(--border-gold)]/40 rounded p-3">
                  <div className="flex items-center gap-1.5 text-xs text-[var(--gold-primary)] font-royal mb-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Creation Time</span>
                  </div>
                  <span className="text-xs text-[var(--text-primary)] font-serif block">
                    {current.hours}
                  </span>
                </div>
              </div>

              {/* Specs bullet list */}
              <div className="mt-5 space-y-2 border-t border-[var(--border-gold)]/30 pt-4">
                <span className="font-royal text-xs text-[var(--gold-light)] uppercase tracking-wider block">
                  Artisan Specifications:
                </span>
                {current.specs.map((spec, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-[var(--text-secondary)] font-serif">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--gold-primary)]" />
                    <span>{spec}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Button */}
            <div className="pt-4 border-t border-[var(--border-gold)]">
              <button
                onClick={() => {
                  onSelectGarmentForBespoke(current.title);
                  onClose();
                }}
                className="royal-btn-gold w-full justify-center !py-3 text-xs"
              >
                <Award className="w-4 h-4" />
                <span>Commission This Piece in Atelier</span>
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
