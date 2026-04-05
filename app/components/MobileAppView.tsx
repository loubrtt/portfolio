"use client";

type MobileAppViewProps = {
  title: string;
  accent: string;
  onBack: () => void;
  children: React.ReactNode;
};

export default function MobileAppView({
  title,
  accent,
  onBack,
  children,
}: MobileAppViewProps) {
  return (
    <div className="animate-mobile-app-in fixed inset-0 top-10 z-[200] flex flex-col bg-[#0c0c1a]/95 backdrop-blur-2xl">
      {/* Header */}
      <div className="h-11 flex items-center justify-between px-4 shrink-0">
        <button
          onClick={onBack}
          className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/[0.06] transition-colors"
        >
          <svg
            className="w-5 h-5 text-white/60"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <span className="text-sm font-medium text-white/60">{title}</span>
        <div className="w-8" />
      </div>

      {/* Accent line */}
      <div className={`h-[2px] w-full ${accent} opacity-40`} />

      {/* Content */}
      <div className="flex-1 overflow-auto pb-[env(safe-area-inset-bottom)]">
        {children}
      </div>
    </div>
  );
}
