"use client";

import React from "react";

interface StoryChapterNavProps {
  activeChapter: number;
}

const chapters = [
  { id: 0, roman: "0", label: "Prologue", sub: "The Gold Thread" },
  { id: 1, roman: "I", label: "Banarasi Zari", sub: "Loom of Queens" },
  { id: 2, roman: "II", label: "Kalis Lehenga", sub: "360-Panel Flare" },
  { id: 3, roman: "III", label: "Kanjeevaram", sub: "Temple Sanctum" },
  { id: 4, roman: "IV", label: "The Atelier", sub: "Imperial Audience" },
];

export default function StoryChapterNav({ activeChapter }: StoryChapterNavProps) {
  const scrollToChapter = (idx: number) => {
    const el = document.getElementById(`chapter-${idx}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <aside className="side-chapter-nav" aria-label="Story Chapter Navigation">
      <div
        style={{
          width: "1px",
          height: "3rem",
          background: "linear-gradient(to bottom, transparent, rgba(230, 190, 104, 0.6))",
        }}
      />

      {chapters.map((ch) => {
        const isActive = activeChapter === ch.id;
        return (
          <div key={ch.id} className="chapter-node-group">
            <button
              onClick={() => scrollToChapter(ch.id)}
              aria-label={`Go to chapter ${ch.label}`}
              className={`chapter-node-btn ${isActive ? "active" : ""}`}
            >
              {ch.roman}
              {isActive && (
                <span
                  className="absolute inset-0 rounded-full animate-ping opacity-30"
                  style={{ border: "1px solid var(--gold-light)" }}
                />
              )}
            </button>

            <div className="chapter-tooltip">
              <span className="font-royal text-xs block" style={{ color: "var(--gold-light)" }}>
                {ch.label}
              </span>
              <span className="font-serif italic text-xs block" style={{ color: "var(--text-muted)", fontSize: "11px" }}>
                {ch.sub}
              </span>
            </div>
          </div>
        );
      })}

      <div
        style={{
          width: "1px",
          height: "3rem",
          background: "linear-gradient(to top, transparent, rgba(230, 190, 104, 0.6))",
        }}
      />
    </aside>
  );
}
