"use client";

import { useState } from "react";
import Image from "next/image";
import { useLang, type Lang } from "../LanguageContext";

type Site = {
  name: string;
  url: string;
  screenshot: string;
  description: Record<Lang, string>;
};

const sites: Site[] = [
  {
    name: "Feedelity",
    url: "https://feedelity.fr",
    screenshot: "/feedelity.png",
    description: {
      fr: "SaaS fullstack construit avec Next.js, Supabase et Stripe. Permet aux restaurants indépendants de gérer un menu digital QR, suivre leurs stats de consultation et automatiser leurs demandes d'avis Google. Projet solo, de l'idée au déploiement en production.",
      en: "Fullstack SaaS built with Next.js, Supabase and Stripe. Helps independent restaurants manage a digital QR menu, track view analytics and automate Google review requests. Solo project, from idea to production deployment.",
    },
  },
  {
    name: "Hopper Coworking",
    url: "https://hopper-coworking.com",
    screenshot: "/hopper.png",
    description: {
      fr: "Intégré en cours de projet — composants React pour les metrics, système de notifications, améliorations globales de l'app.",
      en: "Joined mid-project — React components for metrics dashboards, notification system, overall app improvements.",
    },
  },
  {
    name: "Deskeo Hub",
    url: "https://deskeo-hub.vercel.app",
    screenshot: "/deskeohub.png",
    description: {
      fr: "Refonte complète d'outils internes initialement sur Glide — recodés from scratch, sourcing des besoins, formation des équipes et conduite du changement.",
      en: "Full rebuild of internal tools previously on Glide — recoded from scratch, requirements sourcing, team training and change management.",
    },
  },
  {
    name: "GitHub",
    url: "https://github.com/loubrtt",
    screenshot: "/github.png",
    description: {
      fr: "Mon profil GitHub — projets, contributions open source et stack technique.",
      en: "My GitHub profile — projects, open source contributions and tech stack.",
    },
  },
];

export default function Browser() {
  const lang = useLang();
  const [active, setActive] = useState(0);

  return (
    <div className="flex flex-col h-full">
      {/* Tab bar */}
      <div className="flex items-center gap-1 px-3 pt-2 pb-0 bg-white/[0.02] border-b border-white/[0.06] overflow-x-auto">
        {sites.map((site, i) => (
          <button
            key={site.name}
            onClick={() => setActive(i)}
            className={`px-4 py-2 rounded-t-lg text-xs font-medium transition-all ${
              active === i
                ? "bg-[#0c0c1a] text-white/80 border border-white/[0.08] border-b-transparent -mb-px"
                : "text-white/30 hover:text-white/50"
            }`}
          >
            {site.name}
          </button>
        ))}
      </div>

      {/* URL bar */}
      <div className="px-4 py-2.5 bg-white/[0.02] border-b border-white/[0.06]">
        <div className="flex items-center gap-3 px-3 py-1.5 bg-white/[0.04] rounded-lg border border-white/[0.06]">
          <svg
            className="w-3.5 h-3.5 text-[#3ecfcf] shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <rect x="3" y="11" width="18" height="11" rx="2" />
            <path d="M7 11V7a5 5 0 0110 0v4" />
          </svg>
          <span className="text-xs text-white/60 font-mono truncate">
            {sites[active].url}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 md:p-6 overflow-auto">
        <div className="max-w-lg mx-auto">
          {/* Screenshot */}
          <div className="rounded-xl overflow-hidden border border-white/[0.08] mb-6">
            <Image
              src={sites[active].screenshot}
              alt={sites[active].name}
              width={800}
              height={450}
              className="w-full h-auto"
            />
          </div>

          {/* Info */}
          <h2 className="text-lg font-bold text-white/90 mb-2">
            {sites[active].name}
          </h2>
          <p className="text-sm text-white/60 leading-relaxed mb-6">
            {sites[active].description[lang]}
          </p>

          <a
            href={sites[active].url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/[0.06] border border-white/[0.1] hover:bg-white/[0.1] hover:border-white/[0.2] transition-all text-sm font-medium text-white/70 hover:text-white/90"
          >
            {lang === "fr" ? "Visiter le site" : "Visit website"}
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M7 17L17 7M17 7H7M17 7v10" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
