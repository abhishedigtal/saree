"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import RoyalHeader from "@/components/RoyalHeader";
import StoryChapterNav from "@/components/StoryChapterNav";
import StoryChapters from "@/components/StoryChapters";
import BespokeModal from "@/components/BespokeModal";
import LookbookModal from "@/components/LookbookModal";
import RoyalAudio from "@/components/RoyalAudio";

// Dynamically import Three.js Canvas to ensure client-only rendering
const ThreeClothCanvas = dynamic(() => import("@/components/ThreeClothCanvas"), {
  ssr: false,
});

export default function Home() {
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [activeChapter, setActiveChapter] = useState<number>(0);
  const [lightingMode, setLightingMode] = useState<"candlelight" | "daylight" | "moonlight">("candlelight");
  const [activeColor, setActiveColor] = useState<string>("#771224"); // Royal Crimson default
  const [isBespokeOpen, setIsBespokeOpen] = useState<boolean>(false);
  const [isLookbookOpen, setIsLookbookOpen] = useState<boolean>(false);
  const [bespokeGarment, setBespokeGarment] = useState<string>("Banarasi Bridal Brocade Saree");

  // Track window scroll to calculate progress & active chapter
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY;
      const progress = totalScroll > 0 ? Math.min(1, Math.max(0, currentScroll / totalScroll)) : 0;
      setScrollProgress(progress);

      // Determine active chapter based on element positions
      const chapterIds = ["chapter-0", "chapter-1", "chapter-2", "chapter-3", "chapter-4"];
      const scrollPos = window.scrollY + window.innerHeight * 0.45;

      for (let i = chapterIds.length - 1; i >= 0; i--) {
        const el = document.getElementById(chapterIds[i]);
        if (el && el.offsetTop <= scrollPos) {
          setActiveChapter(i);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleOpenBespokeWithGarment = (garment: string) => {
    setBespokeGarment(garment);
    setIsBespokeOpen(true);
  };

  return (
    <main className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] relative selection:bg-[var(--gold-dark)] selection:text-white">
      {/* 3D WebGL Cloth Canvas (Fixed Background Stage) */}
      <ThreeClothCanvas
        scrollProgress={scrollProgress}
        activeChapter={activeChapter}
        lightingMode={lightingMode}
        customFabricColor={activeColor}
      />

      {/* Royal Header */}
      <RoyalHeader
        scrollProgress={scrollProgress}
        lightingMode={lightingMode}
        onLightingChange={setLightingMode}
        onOpenBespoke={() => setIsBespokeOpen(true)}
        onOpenLookbook={() => setIsLookbookOpen(true)}
      />

      {/* Floating Chapter Progress Nav */}
      <StoryChapterNav activeChapter={activeChapter} />

      {/* Story Sections & Content */}
      <StoryChapters
        onOpenBespokeWithGarment={handleOpenBespokeWithGarment}
        onOpenLookbook={() => setIsLookbookOpen(true)}
        onColorChange={setActiveColor}
        activeColor={activeColor}
      />

      {/* Ambient Audio Synthesizer */}
      <RoyalAudio />

      {/* Bespoke Private Royal Suite Modal */}
      <BespokeModal
        isOpen={isBespokeOpen}
        onClose={() => setIsBespokeOpen(false)}
        initialGarment={bespokeGarment}
      />

      {/* Couture Lookbook Modal */}
      <LookbookModal
        isOpen={isLookbookOpen}
        onClose={() => setIsLookbookOpen(false)}
        onSelectGarmentForBespoke={handleOpenBespokeWithGarment}
      />
    </main>
  );
}
