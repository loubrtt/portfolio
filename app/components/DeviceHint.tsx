"use client";

import { useState } from "react";
import { useLang } from "./LanguageContext";

export default function DeviceHint() {
  const lang = useLang();
  const [showPreview, setShowPreview] = useState(false);

  return (
    <>
      {/* Desktop only: "Try on phone" button */}
      <button
        onClick={() => setShowPreview(true)}
        className="hidden md:flex fixed bottom-5 right-5 z-[9997] items-center gap-3 px-4 py-3 bg-white/[0.05] backdrop-blur-xl border border-white/[0.08] rounded-2xl animate-fade-in-up hover:bg-white/[0.08] hover:border-white/[0.12] transition-all cursor-pointer"
      >
        {/* Phone mockup icon */}
        <div className="w-8 h-14 rounded-lg border-2 border-white/20 flex flex-col items-center justify-between py-1 relative overflow-hidden">
          <div className="w-3 h-0.5 rounded-full bg-white/20" />
          <div className="w-full flex-1 mx-0.5 my-0.5 rounded-sm bg-gradient-to-b from-[#7c5cfc]/20 to-[#f0508c]/10" />
          <div className="w-1.5 h-1.5 rounded-full border border-white/20" />
        </div>

        <div className="text-left">
          <p className="text-xs font-medium text-white/70">
            {lang === "fr" ? "Voir sur mobile" : "View on phone"}
          </p>
          <p className="text-[10px] text-white/30">
            {lang === "fr" ? "Design adapté" : "Adapted design"}
          </p>
        </div>
      </button>

      {/* iPhone preview modal */}
      {showPreview && (
        <div
          className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-window-in"
          onClick={() => setShowPreview(false)}
        >
          <div
            className="relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setShowPreview(false)}
              className="absolute -top-4 -right-4 w-8 h-8 rounded-full bg-white/10 border border-white/10 flex items-center justify-center hover:bg-white/20 transition-colors z-10"
            >
              <svg className="w-4 h-4 text-white/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>

            {/* iPhone frame */}
            <div className="relative w-[300px] h-[620px] rounded-[40px] border-[4px] border-[#2a2a2e] bg-[#1a1a1e] shadow-2xl shadow-black/60 overflow-hidden">
              {/* Notch / Dynamic Island */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-5 bg-black rounded-full z-10" />

              {/* Screen */}
              <div className="w-full h-full rounded-[36px] overflow-hidden">
                <iframe
                  src="/"
                  className="w-[390px] h-[844px] border-0 origin-top-left"
                  style={{
                    transform: "scale(0.7692)",
                    width: "390px",
                    height: "844px",
                  }}
                  title="Mobile preview"
                />
              </div>

              {/* Bottom bar */}
              <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-28 h-1 bg-white/30 rounded-full" />
            </div>

            {/* Label */}
            <p className="text-center text-xs text-white/40 mt-4 font-mono">
              iPhone 15 Pro — 390×844
            </p>
          </div>
        </div>
      )}
    </>
  );
}
