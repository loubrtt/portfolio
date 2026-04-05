"use client";

import { useLang, t } from "../LanguageContext";

const links = [
  {
    label: "Email",
    value: "briottetlou@gmail.com",
    href: "mailto:briottetlou@gmail.com",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="M3 7l9 6 9-6" />
      </svg>
    ),
    accent: "group-hover:text-[#7c5cfc]",
  },
  {
    label: "GitHub",
    value: "github.com/loubrtt",
    href: "https://github.com/loubrtt",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.607.069-.607 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.337-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
      </svg>
    ),
    accent: "group-hover:text-white",
  },
  {
    label: "LinkedIn",
    value: "linkedin.com/in/lou-briottet",
    href: "https://linkedin.com/in/lou-briottet",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
    accent: "group-hover:text-[#0a66c2]",
  },
];

export default function Contact() {
  const lang = useLang();

  return (
    <div className="p-5 md:p-8 text-white/90 flex flex-col h-full overflow-auto">
      <div className="mb-8">
        <h1 className="text-xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
          Contact
        </h1>
        <p className="text-white/50 text-sm mt-1">
          {t("Discutons de ton prochain projet", "Let's talk about your next project", lang)}
        </p>
      </div>

      <div className="space-y-3 flex-1">
        {links.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.05] hover:border-white/[0.12] transition-all duration-300"
          >
            <div
              className={`text-white/30 transition-colors duration-300 ${link.accent}`}
            >
              {link.icon}
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium text-white/80 group-hover:text-white transition-colors">
                {link.label}
              </div>
              <div className="text-xs text-white/50">{link.value}</div>
            </div>
            <svg
              className="w-4 h-4 text-white/10 group-hover:text-white/30 group-hover:translate-x-0.5 transition-all"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M7 17L17 7M17 7H7M17 7v10" />
            </svg>
          </a>
        ))}
      </div>

      {/* Status footer */}
      <div className="mt-8 pt-6 border-t border-white/[0.06]">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#3ecfcf] shadow-[0_0_8px_rgba(62,207,207,0.4)]" />
          <span className="text-xs text-white/50">
            {t("Disponible pour de nouvelles opportunités", "Available for new opportunities", lang)}
          </span>
        </div>
      </div>
    </div>
  );
}
