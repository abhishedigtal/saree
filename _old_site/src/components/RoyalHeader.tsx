"use client";

import React from "react";
import { Sparkles, Sun, Moon, Flame, Crown, BookOpen } from "lucide-react";

interface RoyalHeaderProps {
  scrollProgress: number;
  lightingMode: "candlelight" | "daylight" | "moonlight";
  onLightingChange: (mode: "candlelight" | "daylight" | "moonlight") => void;
  onOpenBespoke: () => void;
  onOpenLookbook: () => void;
}

export default function RoyalHeader({
  scrollProgress,
  lightingMode,
  onLightingChange,
  onOpenBespoke,
  onOpenLookbook,
}: RoyalHeaderProps) {
  return (
    <>
      {/* Scroll Progress Bar at very top */}
      <div className="fixed top-0 left-0 right-0 h-[3px] bg-black/60 z-50">
        <div
          className="h-full transition-all duration-150"
          style={{
            width: `${Math.min(100, Math.max(0, scrollProgress * 100))}%`,
            background: "linear-gradient(90deg, #b38728 0%, #fbe3a1 50%, #dfb15b 100%)",
            boxShadow: "0 0 10px rgba(230, 190, 104, 0.8)",
          }}
        />
      </div>

      <header className="royal-header-bar">
        <div className="royal-header-container">
          
          {/* Royal Crest Monogram & Brand */}
          <a href="#chapter-0" className="royal-logo">
            <div className="royal-crest-badge">
              <Crown className="w-5 h-5" style={{ color: "var(--gold-primary)" }} />
            </div>
            <div>
              <span
                className="font-royal text-lg font-bold block"
                style={{ letterSpacing: "0.22em", color: "var(--text-primary)" }}
              >
                MAHARANI <span style={{ color: "var(--gold-primary)" }}>&amp; CO.</span>
              </span>
              <span
                className="font-serif italic text-xs block"
                style={{ letterSpacing: "0.08em", color: "var(--gold-dark)" }}
              >
                Imperial Weaves &bull; Est. 1888
              </span>
            </div>
          </a>

          {/* Navigation Links */}
          <nav className="royal-nav-links">
            <a href="#chapter-1">I. Banarasi Zari</a>
            <a href="#chapter-2">II. Kalis Lehenga</a>
            <a href="#chapter-3">III. Kanjeevaram</a>
            <a href="#chapter-4">IV. The Atelier</a>
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-3">
            {/* Lighting Mode Selector */}
            <div
              className="flex items-center rounded-full p-1 gap-1"
              style={{
                backgroundColor: "rgba(0, 0, 0, 0.65)",
                border: "1px solid var(--border-gold)",
              }}
            >
              <button
                onClick={() => onLightingChange("candlelight")}
                className="p-1.5 rounded-full transition-all"
                style={{
                  backgroundColor: lightingMode === "candlelight" ? "rgba(230, 190, 104, 0.3)" : "transparent",
                  color: lightingMode === "candlelight" ? "var(--gold-light)" : "var(--text-muted)",
                }}
                title="Palace Candlelight"
              >
                <Flame className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onLightingChange("daylight")}
                className="p-1.5 rounded-full transition-all"
                style={{
                  backgroundColor: lightingMode === "daylight" ? "rgba(230, 190, 104, 0.3)" : "transparent",
                  color: lightingMode === "daylight" ? "var(--gold-light)" : "var(--text-muted)",
                }}
                title="Royal Sunburst"
              >
                <Sun className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onLightingChange("moonlight")}
                className="p-1.5 rounded-full transition-all"
                style={{
                  backgroundColor: lightingMode === "moonlight" ? "rgba(156, 182, 217, 0.3)" : "transparent",
                  color: lightingMode === "moonlight" ? "#bfdbfe" : "var(--text-muted)",
                }}
                title="Moonlit Terrace"
              >
                <Moon className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Lookbook Button */}
            <button
              onClick={onOpenLookbook}
              className="royal-btn-outline"
              style={{ padding: "8px 16px", fontSize: "0.75rem" }}
            >
              <BookOpen className="w-3.5 h-3.5" style={{ color: "var(--gold-primary)" }} />
              <span>Lookbook</span>
            </button>

            {/* Book Bespoke Atelier CTA */}
            <button
              onClick={onOpenBespoke}
              className="royal-btn-gold"
              style={{ padding: "8px 18px", fontSize: "0.75rem" }}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Bespoke Suite</span>
            </button>
          </div>

        </div>
      </header>
    </>
  );
}
