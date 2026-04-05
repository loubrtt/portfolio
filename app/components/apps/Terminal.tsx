"use client";

import { useState, useRef, useEffect } from "react";
import { useLang, type Lang } from "../LanguageContext";

type HistoryEntry = { cmd: string; output: string };

const COMMANDS: Record<Lang, Record<string, string>> = {
  fr: {
    help: `commandes disponibles:
  about      qui suis-je
  skills     stack technique
  projects   mes projets
  contact    me contacter
  cv         parcours & expériences
  stack      stack détaillée par projet
  date       date actuelle
  whoami     identité
  neofetch   infos système
  clear      effacer le terminal`,
    about:
      "Lou — Développeur Full Stack\nPassionné par le web et le design d'interfaces.\nJ'aime créer des expériences uniques et interactives.",
    skills:
      "  TypeScript  ████████████████████  90%\n  React       █████████████████░░░  85%\n  Node.js     ████████████████░░░░  80%\n  Tailwind    ████████████████████  90%\n  PostgreSQL  ██████████████░░░░░░  70%\n  Docker      █████████████░░░░░░░  65%",
    projects:
      "  [1] Portfolio OS    — next.js, react, tailwind    ● Live\n  [2] Feedelity       — react, node.js, postgres    ● Live\n  [3] Hopper Cowork   — typescript, next.js         ● Live\n  [4] Projet 4        — python, fastapi, docker     ✓ Terminé",
    contact:
      "  ✉  briottetlou@gmail.com\n  ◐  github.com/loubrtt\n  ◈  linkedin.com/in/lou-briottet",
    cv: `  ╭─ Formation ─────────────────────────────╮
  │  42 Paris          2024 — présent       │
  │  Tronc commun validé                    │
  ╰─────────────────────────────────────────╯

  ╭─ Expériences ───────────────────────────╮
  │  Feedelity         SaaS perso           │
  │  → Next.js, Supabase, Stripe           │
  │  → Solo, de l'idée à la production     │
  │                                         │
  │  Deskeo Hub        Outils internes      │
  │  → Refonte from scratch (ex-Glide)     │
  │  → Formation équipes, conduite du chgt │
  │                                         │
  │  Hopper Coworking  App web              │
  │  → Composants React, metrics           │
  │  → Système de notifications            │
  ╰─────────────────────────────────────────╯`,
    stack: `  ╭─ Projet ──────────── Stack ────────────╮
  │  ft_transcendence   Fastify, React,   │
  │                     Docker, REST      │
  │  webserv            C++, epoll, CGI   │
  │  Inception          Docker Compose,   │
  │                     nginx, MariaDB    │
  │  philosopher        C, pthreads,      │
  │                     mutex             │
  │  Feedelity          Next.js, Supabase │
  │                     Stripe            │
  │  Portfolio          Next.js 16,       │
  │                     React 19, TW v4   │
  ╰────────────────────────────────────────╯`,
    whoami: "lou",
    neofetch: `
   lou@portfolio
   ──────────────
   OS      Lou.OS v1.0
   Shell   lou-term
   Stack   Next.js 16 / React 19
   CSS     Tailwind v4
   Theme   Neon Dark
   Uptime  ∞

   ■ ■ ■ ■ ■ ■ ■ ■`,
  },
  en: {
    help: `available commands:
  about      who am i
  skills     tech stack
  projects   my projects
  contact    get in touch
  cv         background & experience
  stack      detailed stack by project
  date       current date
  whoami     identity
  neofetch   system info
  clear      clear terminal`,
    about:
      "Lou — Full Stack Developer\nPassionate about web development and interface design.\nI love creating unique and interactive experiences.",
    skills:
      "  TypeScript  ████████████████████  90%\n  React       █████████████████░░░  85%\n  Node.js     ████████████████░░░░  80%\n  Tailwind    ████████████████████  90%\n  PostgreSQL  ██████████████░░░░░░  70%\n  Docker      █████████████░░░░░░░  65%",
    projects:
      "  [1] Portfolio OS    — next.js, react, tailwind    ● Live\n  [2] Feedelity       — react, node.js, postgres    ● Live\n  [3] Hopper Cowork   — typescript, next.js         ● Live\n  [4] Project 4       — python, fastapi, docker     ✓ Done",
    contact:
      "  ✉  briottetlou@gmail.com\n  ◐  github.com/loubrtt\n  ◈  linkedin.com/in/lou-briottet",
    cv: `  ╭─ Education ────────────────────────────╮
  │  42 Paris          2024 — present      │
  │  Common core completed                 │
  ╰────────────────────────────────────────╯

  ╭─ Experience ────────────────────────────╮
  │  Feedelity         Personal SaaS       │
  │  → Next.js, Supabase, Stripe          │
  │  → Solo, from idea to production      │
  │                                        │
  │  Deskeo Hub        Internal tools      │
  │  → Full rebuild (from Glide)          │
  │  → Team training, change management   │
  │                                        │
  │  Hopper Coworking  Web app             │
  │  → React components, metrics          │
  │  → Notification system                │
  ╰────────────────────────────────────────╯`,
    stack: `  ╭─ Project ─────────── Stack ────────────╮
  │  ft_transcendence   Fastify, React,   │
  │                     Docker, REST      │
  │  webserv            C++, epoll, CGI   │
  │  Inception          Docker Compose,   │
  │                     nginx, MariaDB    │
  │  philosopher        C, pthreads,      │
  │                     mutex             │
  │  Feedelity          Next.js, Supabase │
  │                     Stripe            │
  │  Portfolio          Next.js 16,       │
  │                     React 19, TW v4   │
  ╰────────────────────────────────────────╯`,
    whoami: "lou",
    neofetch: `
   lou@portfolio
   ──────────────
   OS      Lou.OS v1.0
   Shell   lou-term
   Stack   Next.js 16 / React 19
   CSS     Tailwind v4
   Theme   Neon Dark
   Uptime  ∞

   ■ ■ ■ ■ ■ ■ ■ ■`,
  },
};

export default function Terminal() {
  const lang = useLang();
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [input, setInput] = useState("");
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const welcomeMsg = lang === "fr"
    ? 'Lou.OS Terminal v1.0\n─────────────────────────────\ntape "help" pour les commandes\n'
    : 'Lou.OS Terminal v1.0\n─────────────────────────────\ntype "help" for available commands\n';

  useEffect(() => {
    setHistory([{ cmd: "", output: welcomeMsg }]);
  }, [lang, welcomeMsg]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim().toLowerCase();

    if (trimmed === "") return;

    if (trimmed === "clear") {
      setHistory([]);
      setInput("");
      return;
    }

    const cmds = COMMANDS[lang];
    if (trimmed === "date") {
      cmds.date = new Date().toLocaleDateString(lang === "fr" ? "fr-FR" : "en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }

    const notFound = lang === "fr"
      ? `commande introuvable: ${trimmed}\ntape "help" pour la liste des commandes`
      : `command not found: ${trimmed}\ntype "help" for available commands`;

    const output = cmds[trimmed] ?? notFound;

    setHistory((prev) => [...prev, { cmd: input, output }]);
    setCmdHistory((prev) => [input, ...prev]);
    setHistoryIndex(-1);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (historyIndex < cmdHistory.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setInput(cmdHistory[newIndex]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(cmdHistory[newIndex]);
      } else {
        setHistoryIndex(-1);
        setInput("");
      }
    }
  };

  return (
    <div
      className="h-full bg-[#08080f] p-4 md:p-5 font-mono text-sm overflow-auto cursor-text"
      onClick={() => inputRef.current?.focus()}
    >
      {history.map((entry, i) => (
        <div key={i} className="mb-3">
          {entry.cmd && (
            <div className="flex items-center gap-2">
              <span className="text-[#7c5cfc]">❯</span>
              <span className="text-white/90">{entry.cmd}</span>
            </div>
          )}
          {entry.output && (
            <div className="text-white/60 whitespace-pre-wrap mt-1 leading-relaxed">
              {entry.output}
            </div>
          )}
        </div>
      ))}

      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <span className="text-[#7c5cfc]">❯</span>
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent outline-none text-white/90 caret-[#7c5cfc]"
          autoFocus
          spellCheck={false}
          autoComplete="off"
        />
      </form>
      <div ref={bottomRef} />
    </div>
  );
}
