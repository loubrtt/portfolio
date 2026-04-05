"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { LanguageContext, type Lang } from "./LanguageContext";
import MenuBar from "./MenuBar";
import Dock, { type AppDefinition } from "./Dock";
import Window from "./Window";
import About from "./apps/About";
import Projects from "./apps/Projects";
import Contact from "./apps/Contact";
import Terminal from "./apps/Terminal";
import Browser from "./apps/Browser";
import MobileHome from "./MobileHome";
import MobileAppView from "./MobileAppView";
import DeviceHint from "./DeviceHint";

type WindowState = {
  x: number;
  y: number;
  width: number;
  height: number;
  isMaximized: boolean;
};

type AppDef = AppDefinition & {
  defaultWindow: Omit<WindowState, "isMaximized">;
  accentBg: string;
  titleEn: string;
  component: React.ReactNode;
};

const APP_DEFINITIONS: AppDef[] = [
  {
    id: "about",
    title: "À propos",
    titleEn: "About",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="8" r="4" />
        <path d="M5 20c0-4 3.5-7 7-7s7 3 7 7" />
      </svg>
    ),
    accent: "bg-[#7c5cfc]",
    accentBg: "bg-gradient-to-r from-[#7c5cfc] to-[#9c7cfc]",
    defaultWindow: { x: 80, y: 50, width: 580, height: 520 },
    component: <About />,
  },
  {
    id: "projects",
    title: "Projets",
    titleEn: "Projects",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M3 7l9-4 9 4v10l-9 4-9-4V7z" />
        <path d="M3 7l9 4m0 0l9-4m-9 4v10" />
      </svg>
    ),
    accent: "bg-[#f0508c]",
    accentBg: "bg-gradient-to-r from-[#f0508c] to-[#fc7cac]",
    defaultWindow: { x: 700, y: 170, width: 580, height: 520 },
    component: <Projects />,
  },
  {
    id: "contact",
    title: "Contact",
    titleEn: "Contact",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="M3 7l9 6 9-6" />
      </svg>
    ),
    accent: "bg-[#3ecfcf]",
    accentBg: "bg-gradient-to-r from-[#3ecfcf] to-[#5cefef]",
    defaultWindow: { x: 260, y: 100, width: 480, height: 440 },
    component: <Contact />,
  },
  {
    id: "terminal",
    title: "Terminal",
    titleEn: "Terminal",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M7 8l4 4-4 4" />
        <path d="M13 16h4" />
      </svg>
    ),
    accent: "bg-[#fcb45c]",
    accentBg: "bg-gradient-to-r from-[#fcb45c] to-[#fcd08c]",
    defaultWindow: { x: 180, y: 70, width: 600, height: 420 },
    component: <Terminal />,
  },
  {
    id: "browser",
    title: "Web Apps",
    titleEn: "Web Apps",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="10" />
        <path d="M2 12h20" />
        <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
      </svg>
    ),
    accent: "bg-[#3ecfcf]",
    accentBg: "bg-gradient-to-r from-[#3ecfcf] to-[#5cefef]",
    defaultWindow: { x: 160, y: 50, width: 640, height: 500 },
    component: <Browser />,
  },
];

export default function Desktop() {
  const [loading, setLoading] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => setLoading(false), 500);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (cursorRef.current) {
        cursorRef.current.style.left = `${e.clientX}px`;
        cursorRef.current.style.top = `${e.clientY}px`;
      }
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const [lang, setLang] = useState<Lang>("fr");
  const [langKey, setLangKey] = useState(0);
  const [mobileApp, setMobileApp] = useState<string | null>(null);
  const [openApps, setOpenApps] = useState<Set<string>>(new Set(["about", "projects"]));
  const [windowOrder, setWindowOrder] = useState<string[]>(["about", "projects"]);
  const [minimized, setMinimized] = useState<Set<string>>(new Set());
  const [windows, setWindows] = useState<Record<string, WindowState>>(() => {
    const initial: Record<string, WindowState> = {};
    for (const app of APP_DEFINITIONS) {
      initial[app.id] = { ...app.defaultWindow, isMaximized: false };
    }
    return initial;
  });

  const focusWindow = useCallback((id: string) => {
    setWindowOrder((prev) => [...prev.filter((w) => w !== id), id]);
  }, []);

  const openApp = useCallback(
    (id: string) => {
      if (openApps.has(id)) {
        if (minimized.has(id)) {
          setMinimized((prev) => {
            const next = new Set(prev);
            next.delete(id);
            return next;
          });
        }
        focusWindow(id);
        return;
      }
      setOpenApps((prev) => new Set(prev).add(id));
      setMinimized((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      focusWindow(id);
    },
    [openApps, minimized, focusWindow]
  );

  const closeApp = useCallback((id: string) => {
    setOpenApps((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    setWindowOrder((prev) => prev.filter((w) => w !== id));
    const app = APP_DEFINITIONS.find((a) => a.id === id);
    if (app) {
      setWindows((prev) => ({
        ...prev,
        [id]: { ...app.defaultWindow, isMaximized: false },
      }));
    }
  }, []);

  const minimizeApp = useCallback((id: string) => {
    setMinimized((prev) => new Set(prev).add(id));
  }, []);

  const maximizeApp = useCallback((id: string) => {
    setWindows((prev) => ({
      ...prev,
      [id]: { ...prev[id], isMaximized: !prev[id].isMaximized },
    }));
  }, []);

  const moveWindow = useCallback((id: string, x: number, y: number) => {
    setWindows((prev) => ({
      ...prev,
      [id]: { ...prev[id], x, y },
    }));
  }, []);

  const resizeWindow = useCallback(
    (id: string, w: number, h: number, nx: number, ny: number) => {
      setWindows((prev) => ({
        ...prev,
        [id]: { ...prev[id], width: w, height: h, x: nx, y: ny },
      }));
    },
    []
  );

  const activeAppId = windowOrder[windowOrder.length - 1] ?? "";
  const activeAppDef = APP_DEFINITIONS.find((a) => a.id === activeAppId);
  const activeApp = activeAppDef
    ? lang === "en" ? activeAppDef.titleEn : activeAppDef.title
    : "Desktop";

  const getTitle = (app: AppDef) => lang === "en" ? app.titleEn : app.title;

  return (
    <LanguageContext value={lang}>
      <div className="h-screen w-screen overflow-hidden animated-bg relative">
        {/* Loading screen */}
        {loading && (
          <div
            className={`fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#050510] ${fadeOut ? "animate-loader-fade-out" : ""}`}
          >
            <div className="flex items-center gap-3 mb-8">
              <div
                className="w-3 h-3 rounded-full"
                style={{ animation: "loader-dot-cycle 3s ease-in-out infinite, loader-pulse 1.2s ease-in-out infinite" }}
              />
              <span className="text-sm font-mono tracking-[0.3em] uppercase text-white/70">
                Lou.os
              </span>
            </div>
            <div className="w-48 h-[2px] bg-white/[0.06] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#7c5cfc] via-[#f0508c] to-[#3ecfcf]"
                style={{ animation: "loader-bar 0.6s ease-out forwards" }}
              />
            </div>
          </div>
        )}

        {/* Lang switch fade overlay */}
        <div key={langKey} className="lang-fade fixed inset-0 pointer-events-none z-[9990]" style={{ background: "rgba(5,5,16,0.4)" }} />

        {/* Cursor glow */}
        <div
          ref={cursorRef}
          className="hidden md:block fixed w-[500px] h-[500px] rounded-full pointer-events-none z-[1] -translate-x-1/2 -translate-y-1/2 transition-[left,top] duration-75 ease-out"
          style={{
            background: "radial-gradient(circle, rgba(124,92,252,0.07) 0%, rgba(124,92,252,0.03) 30%, rgba(240,80,140,0.01) 50%, transparent 70%)",
          }}
        />

        {/* Grid overlay */}
        <div className="absolute inset-0 grid-overlay" />

        {/* Floating ambient orbs */}
        <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-[#7c5cfc]/[0.04] blur-[100px] animate-float" />
        <div className="absolute bottom-1/3 left-1/3 w-80 h-80 rounded-full bg-[#f0508c]/[0.03] blur-[80px] animate-float-delayed" />
        <div className="absolute top-1/2 left-1/4 w-64 h-64 rounded-full bg-[#3ecfcf]/[0.03] blur-[60px] animate-float-slow" />

        <MenuBar
          activeApp={activeApp}
          lang={lang}
          onToggleLang={() => { setLang((l) => (l === "fr" ? "en" : "fr")); setLangKey((k) => k + 1); }}
        />

        {/* Desktop layout */}
        <div className="hidden md:block">
          {APP_DEFINITIONS.map((app) => {
            if (!openApps.has(app.id) || minimized.has(app.id)) return null;
            const win = windows[app.id];
            const zIndex = windowOrder.indexOf(app.id) + 100;

            return (
              <Window
                key={app.id}
                id={app.id}
                title={getTitle(app)}
                accent={app.accentBg}
                x={win.x}
                y={win.y}
                width={win.width}
                height={win.height}
                zIndex={zIndex}
                isMaximized={win.isMaximized}
                onClose={() => closeApp(app.id)}
                onMinimize={() => minimizeApp(app.id)}
                onMaximize={() => maximizeApp(app.id)}
                onFocus={() => focusWindow(app.id)}
                onMove={(nx, ny) => moveWindow(app.id, nx, ny)}
                onResize={(w, h, nx, ny) => resizeWindow(app.id, w, h, nx, ny)}
              >
                {app.component}
              </Window>
            );
          })}
        </div>

        {/* Mobile layout */}
        <div className="md:hidden h-full pt-10">
          {mobileApp ? (
            (() => {
              const app = APP_DEFINITIONS.find((a) => a.id === mobileApp);
              if (!app) return null;
              return (
                <MobileAppView
                  title={getTitle(app)}
                  accent={app.accentBg}
                  onBack={() => setMobileApp(null)}
                >
                  {app.component}
                </MobileAppView>
              );
            })()
          ) : (
            <MobileHome
              apps={APP_DEFINITIONS}
              onAppClick={(id) => setMobileApp(id)}
            />
          )}
        </div>

        <Dock
          apps={APP_DEFINITIONS}
          openApps={openApps}
          activeApp={activeAppId}
          onAppClick={openApp}
        />

        <DeviceHint />
      </div>
    </LanguageContext>
  );
}
