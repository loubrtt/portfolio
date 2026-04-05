"use client";

export type AppDefinition = {
  id: string;
  title: string;
  icon: React.ReactNode;
  accent: string;
};

type DockProps = {
  apps: AppDefinition[];
  openApps: Set<string>;
  activeApp: string;
  onAppClick: (id: string) => void;
};

export default function Dock({
  apps,
  openApps,
  activeApp,
  onAppClick,
}: DockProps) {
  return (
    <div className="hidden md:flex fixed left-4 top-1/2 -translate-y-1/2 z-[9998] flex-col gap-2">
      {apps.map((app) => {
        const isActive = activeApp === app.id;
        const isOpen = openApps.has(app.id);

        return (
          <button
            key={app.id}
            onClick={() => onAppClick(app.id)}
            className="group relative flex items-center"
          >
            {/* Active indicator line */}
            <div
              className={`absolute -left-2 w-0.5 h-6 rounded-full transition-all duration-300 ${
                isActive
                  ? `opacity-100 ${app.accent}`
                  : isOpen
                    ? `opacity-40 ${app.accent}`
                    : "opacity-0 bg-white"
              }`}
            />

            {/* Icon button */}
            <div
              className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200 border ${
                isActive
                  ? "bg-white/10 border-white/20 shadow-lg"
                  : "bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.08] hover:border-white/[0.12]"
              }`}
            >
              <div className="text-white/70 group-hover:text-white/90 transition-colors">
                {app.icon}
              </div>
            </div>

            {/* Tooltip */}
            <div className="absolute left-14 px-3 py-1.5 bg-white/10 backdrop-blur-xl rounded-lg border border-white/10 text-xs font-medium text-white/80 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none translate-x-1 group-hover:translate-x-0">
              {app.title}
            </div>
          </button>
        );
      })}
    </div>
  );
}
