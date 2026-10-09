"use client";

import React, { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX, Sparkles } from "lucide-react";

export default function RoyalAudio() {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [hasInteracted, setHasInteracted] = useState<boolean>(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const initAudio = () => {
    if (audioCtxRef.current) return;
    
    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioContextClass();
      const master = ctx.createGain();
      master.gain.setValueAtTime(0, ctx.currentTime);
      master.connect(ctx.destination);

      audioCtxRef.current = ctx;
      masterGainRef.current = master;

      // Base Tanpura / Royal Sitar Drone Oscillators (Root D# ~ 155.56 Hz & Fifth A# ~ 233.08 Hz)
      const baseFreqs = [77.78, 155.56, 233.08, 311.13, 466.16];
      baseFreqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const oscGain = ctx.createGain();
        const panner = ctx.createStereoPanner ? ctx.createStereoPanner() : null;

        osc.type = idx % 2 === 0 ? "sine" : "triangle";
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        // Gentle frequency modulation (subtle harmonic vibrato)
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        lfo.frequency.setValueAtTime(0.2 + idx * 0.05, ctx.currentTime);
        lfoGain.gain.setValueAtTime(0.8, ctx.currentTime);
        lfo.connect(osc.frequency);
        lfo.start();

        const vol = [0.08, 0.05, 0.04, 0.03, 0.02][idx];
        oscGain.gain.setValueAtTime(vol, ctx.currentTime);

        if (panner) {
          panner.pan.setValueAtTime((idx - 2) * 0.35, ctx.currentTime);
          osc.connect(oscGain);
          oscGain.connect(panner);
          panner.connect(master);
        } else {
          osc.connect(oscGain);
          oscGain.connect(master);
        }

        osc.start();
      });

      // Periodic Royal Palace Temple Chimes (gentle harmonic bells)
      const triggerChime = () => {
        if (!audioCtxRef.current || !masterGainRef.current) return;
        const c = audioCtxRef.current;
        const chimeFreqs = [622.25, 932.33, 1244.5, 1400.0, 1864.66];
        const chimeFreq = chimeFreqs[Math.floor(Math.random() * chimeFreqs.length)];

        const osc = c.createOscillator();
        const gain = c.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(chimeFreq, c.currentTime);

        gain.gain.setValueAtTime(0, c.currentTime);
        gain.gain.linearRampToValueAtTime(0.025, c.currentTime + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + 3.5);

        osc.connect(gain);
        gain.connect(masterGainRef.current);

        osc.start(c.currentTime);
        osc.stop(c.currentTime + 3.6);
      };

      intervalRef.current = setInterval(() => {
        if (isPlaying || (masterGainRef.current && masterGainRef.current.gain.value > 0)) {
          triggerChime();
        }
      }, 5500);

    } catch (e) {
      console.warn("Web Audio API not supported", e);
    }
  };

  const toggleSound = () => {
    setHasInteracted(true);
    if (!audioCtxRef.current) {
      initAudio();
    }

    if (!audioCtxRef.current || !masterGainRef.current) return;

    if (audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }

    const ctx = audioCtxRef.current;
    const master = masterGainRef.current;

    if (isPlaying) {
      // Fade out
      master.gain.setValueAtTime(master.gain.value, ctx.currentTime);
      master.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.8);
      setIsPlaying(false);
    } else {
      // Fade in
      master.gain.setValueAtTime(master.gain.value, ctx.currentTime);
      master.gain.linearRampToValueAtTime(0.18, ctx.currentTime + 1.2);
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
      {!hasInteracted && (
        <div 
          onClick={toggleSound}
          className="cursor-pointer bg-black/80 backdrop-blur-md border border-[var(--gold-primary)]/40 px-3 py-1.5 rounded-full text-xs text-[var(--gold-light)] flex items-center gap-2 animate-bounce shadow-lg shadow-black/50"
          style={{ letterSpacing: "0.08em" }}
        >
          <Sparkles className="w-3.5 h-3.5 text-[var(--gold-primary)]" />
          <span>Royal Ambience</span>
        </div>
      )}

      <button
        onClick={toggleSound}
        className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all duration-300 shadow-xl backdrop-blur-md ${
          isPlaying
            ? "bg-[rgba(230,190,104,0.18)] border-[var(--gold-primary)] text-[var(--gold-light)] shadow-[0_0_20px_rgba(230,190,104,0.3)]"
            : "bg-[rgba(14,12,20,0.85)] border-[rgba(230,190,104,0.25)] text-[var(--text-muted)] hover:border-[var(--gold-primary)] hover:text-[var(--gold-light)]"
        }`}
        title={isPlaying ? "Mute Royal Ambience" : "Play Royal Ambience"}
        aria-label="Toggle Royal Ambience Audio"
      >
        {isPlaying ? (
          <div className="relative flex items-center justify-center">
            <Volume2 className="w-5 h-5 text-[var(--gold-light)] animate-pulse" />
            <span className="absolute -top-1 -right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--gold-primary)] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--gold-primary)]"></span>
            </span>
          </div>
        ) : (
          <VolumeX className="w-5 h-5" />
        )}
      </button>
    </div>
  );
}
