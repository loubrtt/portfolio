"use client";

import Image from "next/image";
import { useLang, t } from "./LanguageContext";

type AppDef = {
  id: string;
  title: string;
  titleEn: string;
  icon: React.ReactNode;
  accent: string;
};

type MobileHomeProps = {
  apps: AppDef[];
  onAppClick: (id: string) => void;
};

export default function MobileHome({ apps, onAppClick }: MobileHomeProps) {
  const lang = useLang();

  return (
    <div className="flex flex-col items-center justify-center h-full px-8 gap-10">
      {/* Hero */}
      <div className="text-center">
        <Image
          src="/me.png"
          alt="Lou"
          width={80}
          height={80}
          className="w-20 h-20 rounded-2xl object-cover shadow-lg shadow-purple-500/20 mx-auto mb-4"
        />
        <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent mb-1">
          Lou
        </h1>
        <p className="text-[#7c5cfc] text-sm font-medium">
          {t("Développeuse Full Stack", "Full Stack Developer", lang)}
        </p>
      </div>

      {/* App grid */}
      <div className="grid grid-cols-3 gap-5">
        {apps.map((app) => (
          <button
            key={app.id}
            onClick={() => onAppClick(app.id)}
            className="flex flex-col items-center gap-2 active:scale-95 transition-transform"
          >
            <div className="w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/[0.08] backdrop-blur-xl flex items-center justify-center text-white/70 shadow-lg">
              {app.icon}
            </div>
            <span className="text-[11px] text-white/60">
              {lang === "en" ? app.titleEn : app.title}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
