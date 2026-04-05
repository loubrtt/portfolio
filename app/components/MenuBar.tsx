"use client";

import { useState, useEffect } from "react";
import { type Lang } from "./LanguageContext";

type MenuBarProps = {
  activeApp: string;
  lang: Lang;
  onToggleLang: () => void;
};

export default function MenuBar({ activeApp, lang, onToggleLang }: MenuBarProps) {
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString(lang === "fr" ? "fr-FR" : "en-US", {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    };
    update();
    const interval = setInterval(update, 10000);
    return () => clearInterval(interval);
  }, [lang]);

  return (
    <div className="fixed top-0 left-0 right-0 h-10 z-[9999] flex items-center justify-between px-8 md:px-6">
      {/* Left - Brand */}
      <div className="flex items-center gap-3">
        <div className="w-2 h-2 rounded-full animate-dot-cycle" />
        <span className="text-xs font-mono tracking-[0.2em] uppercase text-white/70">
          Lou.os
        </span>
      </div>

      {/* Center - Active app (desktop only) */}
      <div className="absolute left-1/2 -translate-x-1/2 hidden md:block">
        <span className="text-xs font-mono tracking-[0.2em] uppercase text-white/60">{activeApp}</span>
      </div>

      {/* Right - Lang toggle + Status + Time */}
      <div className="flex items-center gap-3 md:gap-4">
        {/* Language toggle */}
        <button
          onClick={onToggleLang}
          className="flex items-center gap-1.5 px-2 py-1 rounded-lg hover:bg-white/[0.06] transition-colors"
        >
          <span className={`hidden md:inline text-xs font-mono transition-colors ${lang === "fr" ? "text-white/70" : "text-white/25"}`}>
            FR
          </span>
          <div className="relative w-7 h-4 bg-white/[0.08] rounded-full border border-white/[0.1]">
            <div
              className={`absolute top-0.5 w-3 h-3 rounded-full bg-[#7c5cfc] shadow-[0_0_6px_rgba(124,92,252,0.4)] transition-all duration-200 ${
                lang === "en" ? "left-3.5" : "left-0.5"
              }`}
            />
          </div>
          <span className={`hidden md:inline text-xs font-mono transition-colors ${lang === "en" ? "text-white/70" : "text-white/25"}`}>
            EN
          </span>
        </button>

        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-[#3ecfcf] shadow-[0_0_6px_rgba(62,207,207,0.5)]" />
          <span className="hidden md:inline text-xs font-mono tracking-[0.2em] uppercase text-white/60">{lang === "fr" ? "en ligne" : "online"}</span>
        </div>
        <span className="text-xs font-mono text-white/70">{time}</span>
      </div>
    </div>
  );
}
