"use client";

import { useState, useEffect } from "react";
import { useLang, t } from "../LanguageContext";

type Repo = {
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  languages: string[];
  stargazers_count: number;
  fork: boolean;
  topics: string[];
};

type ReadmeCache = Record<string, string | null>;

const ACCENT_COLORS = [
  "from-[#7c5cfc] to-[#5c3cdc]",
  "from-[#f0508c] to-[#d03070]",
  "from-[#3ecfcf] to-[#20a0a0]",
  "from-[#fcb45c] to-[#f09030]",
];

const LANG_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  C: "#555555",
  "C++": "#f34b7d",
  Python: "#3572A5",
  Shell: "#89e051",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Makefile: "#427819",
};

type FeaturedProject = {
  name: string;
  repoOwner: string;
  description: Record<"fr" | "en", string>;
  languages: string[];
  accent: string;
};

const FEATURED: FeaturedProject[] = [
  {
    name: "ft_transcendence",
    repoOwner: "Gregory-Marquiset/llmcg_transcendence",
    description: {
      fr: "App fullstack temps réel en microservices — Fastify, React, WebSocket. Multijoueur, auth OAuth + 2FA, chat live.",
      en: "Real-time fullstack app built with microservices — Fastify, React, WebSocket. Multiplayer game, OAuth + 2FA auth, live chat.",
    },
    languages: ["TypeScript", "JavaScript", "Shell"],
    accent: "from-[#7c5cfc] to-[#5c3cdc]",
  },
  {
    name: "webserv",
    repoOwner: "loubrtt/webserv_42",
    description: {
      fr: "Serveur HTTP custom en C++ (type nginx) — multiplexage I/O avec epoll, support CGI, parsing de config, méthodes GET/POST/DELETE.",
      en: "Custom HTTP server in C++ (nginx-like) — I/O multiplexing with epoll, CGI support, config parsing, GET/POST/DELETE methods.",
    },
    languages: ["C++", "Makefile"],
    accent: "from-[#f0508c] to-[#d03070]",
  },
  {
    name: "Inception",
    repoOwner: "loubrtt/Inception_42",
    description: {
      fr: "Infrastructure containerisée multi-services avec Docker Compose — nginx, WordPress, MariaDB. Réseau isolé, volumes persistants, TLS.",
      en: "Multi-service containerized infrastructure with Docker Compose — nginx, WordPress, MariaDB. Isolated network, persistent volumes, TLS.",
    },
    languages: ["Shell", "Makefile"],
    accent: "from-[#3ecfcf] to-[#20a0a0]",
  },
  {
    name: "Philosophers",
    repoOwner: "loubrtt/philosopher_42",
    description: {
      fr: "Simulation concurrente en C — gestion de threads, synchronisation par mutex, détection de deadlocks et race conditions.",
      en: "Concurrent simulation in C — thread management, mutex synchronization, deadlock and race condition handling.",
    },
    languages: ["C", "Makefile"],
    accent: "from-[#fcb45c] to-[#f09030]",
  },
];

export default function Projects() {
  const lang = useLang();
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedRepo, setSelectedRepo] = useState<Repo | null>(null);
  const [readme, setReadme] = useState<string | null>(null);
  const [readmeLoading, setReadmeLoading] = useState(false);
  const [readmeCache, setReadmeCache] = useState<ReadmeCache>({});

  useEffect(() => {
    fetch("https://api.github.com/users/loubrtt/repos?sort=updated&per_page=50")
      .then((res) => res.json())
      .then(async (data: Repo[]) => {
        const filtered = data.filter((r) => !r.fork && r.name !== "loubrtt");
        const withLangs = await Promise.all(
          filtered.map(async (repo) => {
            try {
              const res = await fetch(
                `https://api.github.com/repos/loubrtt/${repo.name}/languages`
              );
              const langs = await res.json();
              return { ...repo, languages: Object.keys(langs) };
            } catch {
              return { ...repo, languages: repo.language ? [repo.language] : [] };
            }
          })
        );
        setRepos(withLangs);
        setLoading(false);
      })
      .catch(() => { setError(true); setLoading(false); });
  }, []);

  const openRepo = async (repo: Repo) => {
    setSelectedRepo(repo);

    if (readmeCache[repo.name] !== undefined) {
      setReadme(readmeCache[repo.name]);
      return;
    }

    setReadmeLoading(true);
    setReadme(null);
    try {
      const res = await fetch(
        `https://api.github.com/repos/loubrtt/${repo.name}/readme`,
        { headers: { Accept: "application/vnd.github.raw+json" } }
      );
      const text = res.ok ? await res.text() : null;
      setReadmeCache((c) => ({ ...c, [repo.name]: text }));
      setReadme(text);
    } catch {
      setReadme(null);
      setReadmeCache((c) => ({ ...c, [repo.name]: null }));
    }
    setReadmeLoading(false);
  };

  // Detail view
  if (selectedRepo) {
    return (
      <div className="p-5 md:p-8 text-white/90 h-full overflow-auto">
        {/* Back button */}
        <button
          onClick={() => {
            setSelectedRepo(null);
            setReadme(null);
          }}
          className="flex items-center gap-2 text-sm text-white/50 hover:text-white/80 transition-colors mb-6"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" />
          </svg>
          {t("Retour", "Back", lang)}
        </button>

        {/* Repo header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-xl font-bold text-white/90">
              {selectedRepo.name}
            </h1>
            {selectedRepo.languages?.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                {selectedRepo.languages.map((l) => (
                  <div key={l} className="flex items-center gap-1">
                    <div
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: LANG_COLORS[l] ?? "#888" }}
                    />
                    <span className="text-xs text-white/50">{l}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          {selectedRepo.description && (
            <p className="text-sm text-white/60 mb-4">{selectedRepo.description}</p>
          )}
          <a
            href={selectedRepo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.06] border border-white/[0.1] hover:bg-white/[0.1] hover:border-white/[0.2] transition-all text-sm font-medium text-white/70 hover:text-white/90"
          >
            {t("Voir sur GitHub", "View on GitHub", lang)}
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M7 17L17 7M17 7H7M17 7v10" />
            </svg>
          </a>
        </div>

        {/* README */}
        <div className="border-t border-white/[0.06] pt-6">
          <h2 className="text-xs font-mono tracking-[0.15em] uppercase text-white/50 mb-4">
            README
          </h2>
          {readmeLoading ? (
            <div className="flex items-center gap-2 text-white/30 text-sm">
              <div className="w-3 h-3 rounded-full border-2 border-white/20 border-t-[#7c5cfc] animate-spin" />
              {t("Chargement...", "Loading...", lang)}
            </div>
          ) : readme ? (
            <pre className="text-sm text-white/60 leading-relaxed whitespace-pre-wrap font-mono bg-white/[0.02] border border-white/[0.06] rounded-xl p-4 overflow-auto max-h-[400px]">
              {readme}
            </pre>
          ) : (
            <p className="text-sm text-white/30 italic">
              {t("Aucun README disponible", "No README available", lang)}
            </p>
          )}
        </div>
      </div>
    );
  }

  // List view
  return (
    <div className="p-5 md:p-8 text-white/90 h-full overflow-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
            {t("Projets", "Projects", lang)}
          </h1>
          <p className="text-white/50 text-sm mt-1">
            {loading
              ? t("Chargement...", "Loading...", lang)
              : t(`${FEATURED.length + repos.length} projets`, `${FEATURED.length + repos.length} projects`, lang)}
          </p>
        </div>
      </div>

      {/* Featured projects */}
      <div className="mb-8">
        <h2 className="text-xs font-mono tracking-[0.15em] uppercase text-white/50 mb-4">
          {t("Highlights", "Highlights", lang)}
        </h2>
        <div className="grid grid-cols-1 gap-3">
          {FEATURED.map((project) => (
            <button
              key={project.name}
              onClick={() =>
                openRepo({
                  name: project.name,
                  description: project.description[lang],
                  html_url: `https://github.com/${project.repoOwner}`,
                  language: project.languages[0],
                  languages: project.languages,
                  stargazers_count: 0,
                  fork: false,
                  topics: [],
                })
              }
              className="group relative p-4 md:p-5 rounded-xl bg-white/[0.03] border border-white/[0.08] hover:border-white/[0.15] transition-all duration-300 text-left overflow-hidden"
            >
              <div
                className={`absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b ${project.accent} opacity-60 group-hover:opacity-100 transition-opacity duration-300`}
              />
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1.5 flex-wrap">
                    <h3 className="font-semibold text-sm text-white/90 group-hover:text-white transition-colors">
                      {project.name}
                    </h3>
                    {project.languages.map((l) => (
                      <div key={l} className="flex items-center gap-1">
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: LANG_COLORS[l] ?? "#888" }}
                        />
                        <span className="text-[10px] text-white/40">{l}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-white/50 text-xs leading-relaxed">
                    {project.description[lang]}
                  </p>
                </div>
                <svg
                  className="w-5 h-5 text-white/10 group-hover:text-white/40 group-hover:translate-x-1 transition-all mt-1 shrink-0"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* All repos */}
      <h2 className="text-xs font-mono tracking-[0.15em] uppercase text-white/50 mb-4">
        {t("Tous les repos", "All repos", lang)}
      </h2>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-6 h-6 rounded-full border-2 border-white/10 border-t-[#7c5cfc] animate-spin" />
        </div>
      ) : error || repos.length === 0 ? (
        <p className="text-white/30 text-xs italic py-4">
          {t("Impossible de charger les repos — limite API GitHub atteinte. Réessaie dans quelques minutes.", "Could not load repos — GitHub API rate limit reached. Try again in a few minutes.", lang)}
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {repos.map((repo, i) => (
            <button
              key={repo.name}
              onClick={() => openRepo(repo)}
              className="group relative p-4 md:p-5 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.12] transition-all duration-300 text-left overflow-hidden"
            >
              {/* Gradient line left */}
              <div
                className={`absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b ${ACCENT_COLORS[i % ACCENT_COLORS.length]} opacity-0 group-hover:opacity-80 transition-opacity duration-300`}
              />

              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1.5">
                    <h3 className="font-semibold text-sm text-white/90 group-hover:text-white transition-colors truncate">
                      {repo.name}
                    </h3>
                    {repo.languages?.length > 0 && (
                      <div className="flex items-center gap-2 shrink-0 flex-wrap">
                        {repo.languages.map((l) => (
                          <div key={l} className="flex items-center gap-1">
                            <div
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: LANG_COLORS[l] ?? "#888" }}
                            />
                            <span className="text-[10px] text-white/40">{l}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    {repo.stargazers_count > 0 && (
                      <span className="text-[10px] text-white/30 shrink-0">
                        ★ {repo.stargazers_count}
                      </span>
                    )}
                  </div>
                  {repo.description && (
                    <p className="text-white/50 text-xs leading-relaxed line-clamp-2">
                      {repo.description}
                    </p>
                  )}
                </div>

                <svg
                  className="w-5 h-5 text-white/10 group-hover:text-white/40 group-hover:translate-x-1 transition-all mt-1 shrink-0"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
