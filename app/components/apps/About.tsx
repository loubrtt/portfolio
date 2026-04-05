"use client";

import Image from "next/image";
import { useLang, t, type Lang } from "../LanguageContext";

type Skill = {
  name: string;
  repo: string;
  context: Record<Lang, string>;
};

type SkillGroup = {
  label: Record<Lang, string>;
  color: string;
  skills: Skill[];
};

const skillGroups: SkillGroup[] = [
  {
    label: { fr: "Programmation & Systèmes", en: "Programming & Systems" },
    color: "#7c5cfc",
    skills: [
      { name: "C / C++", repo: "loubrtt", context: { fr: "Projets bas niveau", en: "Low-level projects" } },
      { name: "Bash / Shell", repo: "loubrtt", context: { fr: "Scripting", en: "Scripting" } },
      { name: "Multithreading", repo: "loubrtt/philosopher_42", context: { fr: "Dining philosophers — 42", en: "Dining philosophers — 42" } },
      { name: "Linux / Unix", repo: "loubrtt", context: { fr: "Environnement natif", en: "Native environment" } },
      { name: "Makefile", repo: "loubrtt", context: { fr: "Build systems", en: "Build systems" } },
    ],
  },
  {
    label: { fr: "Réseau & Backend", en: "Network & Backend" },
    color: "#f0508c",
    skills: [
      { name: "HTTP Protocol", repo: "loubrtt", context: { fr: "Serveurs web", en: "Web servers" } },
      { name: "Fastify", repo: "Gregory-Marquiset/llmcg_transcendence", context: { fr: "Backend microservices — 42", en: "Microservices backend — 42" } },
      { name: "MySQL / PostgreSQL", repo: "loubrtt", context: { fr: "Bases relationnelles", en: "Relational databases" } },
      { name: "REST", repo: "Gregory-Marquiset/llmcg_transcendence", context: { fr: "Calls front/back — 42", en: "Front/back calls — 42" } },
    ],
  },
  {
    label: { fr: "Web", en: "Web" },
    color: "#fcb45c",
    skills: [
      { name: "TypeScript", repo: "loubrtt/portfolio", context: { fr: "Ce portfolio", en: "This portfolio" } },
      { name: "JavaScript", repo: "loubrtt", context: { fr: "Full stack", en: "Full stack" } },
      { name: "React", repo: "loubrtt/portfolio", context: { fr: "Apps interactives", en: "Interactive apps" } },
      { name: "HTML / CSS / Tailwind", repo: "loubrtt/portfolio", context: { fr: "Design système", en: "Design system" } },
    ],
  },
  {
    label: { fr: "Outils & Environnement", en: "Tools & Environment" },
    color: "#3ecfcf",
    skills: [
      { name: "Git / GitHub", repo: "loubrtt", context: { fr: "CI/CD, PRs", en: "CI/CD, PRs" } },
      { name: "Docker", repo: "Gregory-Marquiset/llmcg_transcendence", context: { fr: "App microservices — 42", en: "Microservices app — 42" } },
      { name: "Virtualisation", repo: "loubrtt", context: { fr: "VMs, environnements", en: "VMs, environments" } },
    ],
  },
];

export default function About() {
  const lang = useLang();

  const infos = [
    { label: t("Localisation", "Location", lang), value: "France" },
    { label: t("Disponibilité", "Availability", lang), value: t("Septembre 2026", "September 2026", lang) },
    { label: t("Expérience", "Experience", lang), value: t("Depuis 2024", "Since 2024", lang) },
    { label: t("Langues", "Languages", lang), value: "FR / EN" },
  ];

  return (
    <div className="p-5 md:p-8 text-white/90 h-full overflow-auto">
      {/* Header */}
      <div className="flex flex-col items-center text-center md:flex-row md:items-start md:text-left gap-4 md:gap-6 mb-10">
        <div className="relative shrink-0">
          <Image
            src="/me.png"
            alt="Lou"
            width={80}
            height={80}
            className="w-20 h-20 rounded-2xl object-cover shadow-lg shadow-purple-500/20"
          />
          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#3ecfcf] border-2 border-[#0c0c1a] shadow-[0_0_8px_rgba(62,207,207,0.5)]" />
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-bold mb-0.5 bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
            Lou
          </h1>
          <p className="text-[#7c5cfc] text-sm font-medium mb-3">
            {t("Développeur Full Stack", "Full Stack Developer", lang)}
          </p>
          <p className="text-white/70 text-sm leading-relaxed max-w-lg">
            {t(
              "Développeuse full stack formée à 42 Paris, à l'aise du backend bas-niveau (C/C++) au web moderne (React, Next.js). J'interviens sur des projets complets, du concept au déploiement en production.",
              "Full stack developer trained at 42 Paris, comfortable from low-level backend (C/C++) to modern web (React, Next.js). I work on complete projects, from concept to production deployment.",
              lang
            )}
          </p>
        </div>
      </div>

      {/* Skills */}
      <div className="mb-10">
        <h2 className="text-xs font-mono tracking-[0.15em] uppercase text-white/50 mb-5">
          {t("Compétences", "Skills", lang)}
        </h2>
        <div className="space-y-6">
          {skillGroups.map((group) => (
            <div key={group.label.en}>
              <div className="flex items-center gap-2 mb-3">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: group.color }}
                />
                <span className="text-xs font-medium text-white/60">
                  {group.label[lang]}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {group.skills.map((skill) => (
                  <a
                    key={skill.name}
                    href={`https://github.com/${skill.repo}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/chip flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06] hover:border-white/[0.15] hover:bg-white/[0.06] transition-all duration-200"
                  >
                    <span className="text-sm text-white/80 group-hover/chip:text-white transition-colors">
                      {skill.name}
                    </span>
                    <span className="text-[10px] text-white/40 group-hover/chip:text-white/60 transition-colors">
                      {skill.context[lang]}
                    </span>
                    <svg
                      className="w-3 h-3 text-white/0 group-hover/chip:text-white/40 transition-all shrink-0"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
                    </svg>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Expériences */}
      <div className="mb-10">
        <h2 className="text-xs font-mono tracking-[0.15em] uppercase text-white/50 mb-5">
          {t("Expériences", "Experience", lang)}
        </h2>
        <div className="space-y-4">
          {[
            {
              title: "Feedelity",
              role: { fr: "SaaS perso — Projet solo", en: "Personal SaaS — Solo project" },
              desc: {
                fr: "Next.js, Supabase, Stripe. Menu digital QR, stats de consultation, avis Google automatisés. De l'idée au déploiement.",
                en: "Next.js, Supabase, Stripe. Digital QR menu, view analytics, automated Google reviews. From idea to deployment.",
              },
              color: "#7c5cfc",
            },
            {
              title: "Deskeo Hub",
              role: { fr: "Refonte outils internes", en: "Internal tools rebuild" },
              desc: {
                fr: "Refonte complète d'outils initialement sur Glide — recodés from scratch. Sourcing des besoins, formation des équipes, conduite du changement.",
                en: "Full rebuild of tools previously on Glide — recoded from scratch. Requirements sourcing, team training, change management.",
              },
              color: "#f0508c",
            },
            {
              title: "Hopper Coworking",
              role: { fr: "Intégré en cours de projet", en: "Joined mid-project" },
              desc: {
                fr: "Composants React pour les metrics, système de notifications, améliorations globales de l'app.",
                en: "React components for metrics dashboards, notification system, overall app improvements.",
              },
              color: "#3ecfcf",
            },
          ].map((exp) => (
            <div
              key={exp.title}
              className="relative pl-5 p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]"
            >
              <div
                className="absolute left-0 top-0 bottom-0 w-[2px] rounded-full"
                style={{ backgroundColor: exp.color }}
              />
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-semibold text-white/90">{exp.title}</span>
                <span className="text-[10px] text-white/40">— {exp.role[lang]}</span>
              </div>
              <p className="text-xs text-white/50 leading-relaxed">{exp.desc[lang]}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Info grid */}
      <div>
        <h2 className="text-xs font-mono tracking-[0.15em] uppercase text-white/50 mb-4">
          {t("Infos", "Info", lang)}
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {infos.map((info) => (
            <div
              key={info.label}
              className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]"
            >
              <div className="text-[11px] text-white/50 mb-1">
                {info.label}
              </div>
              <div className="text-sm font-medium text-white/90">
                {info.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
