"use client";

import React, { useState } from "react";
import { X, Crown, CheckCircle2, Sparkles, Send } from "lucide-react";

interface BespokeModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialGarment?: string;
}

export default function BespokeModal({
  isOpen,
  onClose,
  initialGarment = "Banarasi Bridal Brocade Saree",
}: BespokeModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    garment: initialGarment,
    zariGrade: "24k Pure Gold Gilt (Tested)",
    preferredDate: "",
    notes: "",
  });

  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleReset = () => {
    setSubmitted(false);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-2xl bg-[rgba(14,12,20,0.96)] border border-[var(--gold-primary)] rounded-lg p-6 sm:p-10 shadow-[0_20px_70px_rgba(0,0,0,0.9)] overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[var(--gold-light)] to-transparent" />

        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute top-5 right-5 text-[var(--text-muted)] hover:text-[var(--gold-light)] transition-colors p-2 rounded-full hover:bg-white/5"
        >
          <X className="w-5 h-5" />
        </button>

        {!submitted ? (
          <div>
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full border border-[var(--gold-primary)]/50 bg-[rgba(230,190,104,0.1)] mb-3">
                <Crown className="w-6 h-6 text-[var(--gold-primary)]" />
              </div>
              <h2 className="font-royal text-2xl sm:text-3xl text-[var(--gold-light)] tracking-wider">
                The Imperial Royal Suite
              </h2>
              <p className="font-serif italic text-sm text-[var(--text-secondary)] mt-1">
                Private Haute Couture Consultation &amp; Bespoke Trousseau Commission
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-royal text-xs uppercase tracking-wider text-[var(--gold-light)] mb-1">
                    Your Esteemed Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Maharani Gayatri Devi"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-black/50 border border-[var(--border-gold)] rounded px-3.5 py-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--gold-light)] focus:ring-1 focus:ring-[var(--gold-light)] transition-colors"
                  />
                </div>

                <div>
                  <label className="block font-royal text-xs uppercase tracking-wider text-[var(--gold-light)] mb-1">
                    City / Country of Residence
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Jaipur / London"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full bg-black/50 border border-[var(--border-gold)] rounded px-3.5 py-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--gold-light)] focus:ring-1 focus:ring-[var(--gold-light)] transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-royal text-xs uppercase tracking-wider text-[var(--gold-light)] mb-1">
                    Private Correspondence Email
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="couture@palace.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-black/50 border border-[var(--border-gold)] rounded px-3.5 py-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--gold-light)] focus:ring-1 focus:ring-[var(--gold-light)] transition-colors"
                  />
                </div>

                <div>
                  <label className="block font-royal text-xs uppercase tracking-wider text-[var(--gold-light)] mb-1">
                    Direct Contact / WhatsApp
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-black/50 border border-[var(--border-gold)] rounded px-3.5 py-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--gold-light)] focus:ring-1 focus:ring-[var(--gold-light)] transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-royal text-xs uppercase tracking-wider text-[var(--gold-light)] mb-1">
                    Couture Garment of Interest
                  </label>
                  <select
                    value={formData.garment}
                    onChange={(e) => setFormData({ ...formData, garment: e.target.value })}
                    className="w-full bg-black/80 border border-[var(--border-gold)] rounded px-3.5 py-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--gold-light)]"
                  >
                    <option value="Banarasi Bridal Brocade Saree">Banarasi Bridal Brocade Saree</option>
                    <option value="360-Kalis Velvet Rajputana Lehenga">360-Kalis Velvet Rajputana Lehenga</option>
                    <option value="Kanjeevaram Temple Silk (Korvai)">Kanjeevaram Temple Silk (Korvai)</option>
                    <option value="Complete Imperial Wedding Trousseau">Complete Imperial Wedding Trousseau</option>
                    <option value="Bespoke Gold-Zari Dupatta & Veil">Bespoke Gold-Zari Dupatta &amp; Veil</option>
                  </select>
                </div>

                <div>
                  <label className="block font-royal text-xs uppercase tracking-wider text-[var(--gold-light)] mb-1">
                    Zari Bullion Grade
                  </label>
                  <select
                    value={formData.zariGrade}
                    onChange={(e) => setFormData({ ...formData, zariGrade: e.target.value })}
                    className="w-full bg-black/80 border border-[var(--border-gold)] rounded px-3.5 py-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--gold-light)]"
                  >
                    <option value="24k Pure Gold Gilt (Tested)">24k Pure Gold Gilt (Tested Certificate)</option>
                    <option value="Pure Silver Wire Bullion">Pure Silver Wire Bullion (Chandi Zari)</option>
                    <option value="Imperial Rose-Gold & Copper Alloy">Imperial Rose-Gold &amp; Copper Alloy</option>
                    <option value="Antique Heritage Patina Zari">Antique Heritage Patina Zari</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-royal text-xs uppercase tracking-wider text-[var(--gold-light)] mb-1">
                  Bespoke Notes or Wedding Date
                </label>
                <textarea
                  rows={3}
                  placeholder="Share details of the auspicious celebration, custom heirloom color requests, or private atelier visit..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full bg-black/50 border border-[var(--border-gold)] rounded px-3.5 py-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--gold-light)] resize-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="royal-btn-gold w-full justify-center !py-3.5"
                >
                  <Send className="w-4 h-4" />
                  <span>Request Private Imperial Audience</span>
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* Confirmation State with Imperial Seal */
          <div className="text-center py-8 space-y-5 animate-fadeIn">
            <div className="w-20 h-20 rounded-full border-2 border-[var(--gold-primary)] mx-auto flex items-center justify-center bg-[rgba(230,190,104,0.15)] shadow-[0_0_30px_rgba(230,190,104,0.4)]">
              <CheckCircle2 className="w-10 h-10 text-[var(--gold-light)]" />
            </div>

            <div className="border border-[var(--border-gold)] bg-black/40 rounded p-6 max-w-md mx-auto">
              <span className="font-royal text-xs text-[var(--gold-dark)] uppercase tracking-[0.2em] block mb-1">
                Imperial Seal Commission #MC-{Math.floor(100000 + Math.random() * 900000)}
              </span>
              <h3 className="font-royal text-xl text-[var(--gold-light)]">
                Audience Confirmed, {formData.name}
              </h3>
              <p className="font-serif italic text-sm text-[var(--text-secondary)] mt-2">
                Our Master Royal Couturier will personally contact you via confidential dispatch at{" "}
                <span className="text-[var(--gold-light)] font-medium">{formData.email}</span> within 24 hours.
              </p>
            </div>

            <p className="font-serif text-xs text-[var(--text-muted)] max-w-sm mx-auto">
              A physical swatch kit of 24k Tested Gold Zari and consecrated silk will be prepared for your inspection.
            </p>

            <button
              onClick={handleReset}
              className="royal-btn-outline !py-2.5 !px-6 text-xs mx-auto"
            >
              <Sparkles className="w-3.5 h-3.5 text-[var(--gold-primary)]" />
              <span>Return to Royal Odyssey</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
