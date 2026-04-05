"use client";

import { useRef, useCallback } from "react";

type WindowProps = {
  id: string;
  title: string;
  accent: string;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  isMaximized: boolean;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onFocus: () => void;
  onMove: (x: number, y: number) => void;
  onResize: (w: number, h: number, x: number, y: number) => void;
  children: React.ReactNode;
};

type Edge = "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw";

const MIN_W = 320;
const MIN_H = 240;

const CURSORS: Record<Edge, string> = {
  n: "ns-resize",
  s: "ns-resize",
  e: "ew-resize",
  w: "ew-resize",
  ne: "nesw-resize",
  nw: "nwse-resize",
  se: "nwse-resize",
  sw: "nesw-resize",
};

export default function Window({
  title,
  accent,
  x,
  y,
  width,
  height,
  zIndex,
  isMaximized,
  onClose,
  onMinimize,
  onMaximize,
  onFocus,
  onMove,
  onResize,
  children,
}: WindowProps) {
  const dragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (isMaximized) return;
      onFocus();
      dragging.current = true;
      offset.current = { x: e.clientX - x, y: e.clientY - y };

      const handleMouseMove = (e: MouseEvent) => {
        if (!dragging.current) return;
        onMove(e.clientX - offset.current.x, e.clientY - offset.current.y);
      };

      const handleMouseUp = () => {
        dragging.current = false;
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
        document.body.classList.remove("dragging");
      };

      document.body.classList.add("dragging");
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    },
    [x, y, isMaximized, onFocus, onMove]
  );

  const handleResizeStart = useCallback(
    (edge: Edge) => (e: React.MouseEvent) => {
      if (isMaximized) return;
      e.stopPropagation();
      e.preventDefault();
      onFocus();

      const startX = e.clientX;
      const startY = e.clientY;
      const startW = width;
      const startH = height;
      const startLeft = x;
      const startTop = y;

      const handleMouseMove = (e: MouseEvent) => {
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;

        let newW = startW;
        let newH = startH;
        let newX = startLeft;
        let newY = startTop;

        if (edge.includes("e")) newW = Math.max(MIN_W, startW + dx);
        if (edge.includes("w")) {
          newW = Math.max(MIN_W, startW - dx);
          newX = startLeft + startW - newW;
        }
        if (edge.includes("s")) newH = Math.max(MIN_H, startH + dy);
        if (edge.includes("n")) {
          newH = Math.max(MIN_H, startH - dy);
          newY = startTop + startH - newH;
        }

        onResize(newW, newH, newX, newY);
      };

      const handleMouseUp = () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
        document.body.style.cursor = "";
        document.body.classList.remove("dragging");
      };

      document.body.style.cursor = CURSORS[edge];
      document.body.classList.add("dragging");
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    },
    [x, y, width, height, isMaximized, onFocus, onResize]
  );

  const style = isMaximized
    ? {
        top: 40,
        left: 72,
        right: 0,
        bottom: 0,
        width: "calc(100% - 72px)",
        height: "calc(100vh - 40px)",
        zIndex,
      }
    : { top: y, left: x, width, height, zIndex };

  return (
    <div
      className="animate-window-in fixed flex flex-col rounded-2xl overflow-hidden border border-white/[0.08] bg-[#0c0c1a]/80 backdrop-blur-2xl"
      style={style}
      onMouseDown={onFocus}
    >
      {/* Resize handles */}
      {!isMaximized && (
        <>
          {/* Edges */}
          <div onMouseDown={handleResizeStart("n")} className="absolute top-0 left-3 right-3 h-1.5 cursor-ns-resize z-10" />
          <div onMouseDown={handleResizeStart("s")} className="absolute bottom-0 left-3 right-3 h-1.5 cursor-ns-resize z-10" />
          <div onMouseDown={handleResizeStart("e")} className="absolute top-3 bottom-3 right-0 w-1.5 cursor-ew-resize z-10" />
          <div onMouseDown={handleResizeStart("w")} className="absolute top-3 bottom-3 left-0 w-1.5 cursor-ew-resize z-10" />
          {/* Corners */}
          <div onMouseDown={handleResizeStart("nw")} className="absolute top-0 left-0 w-3 h-3 cursor-nwse-resize z-20" />
          <div onMouseDown={handleResizeStart("ne")} className="absolute top-0 right-0 w-3 h-3 cursor-nesw-resize z-20" />
          <div onMouseDown={handleResizeStart("sw")} className="absolute bottom-0 left-0 w-3 h-3 cursor-nesw-resize z-20" />
          <div onMouseDown={handleResizeStart("se")} className="absolute bottom-0 right-0 w-3 h-3 cursor-nwse-resize z-20" />
        </>
      )}

      {/* Top accent line */}
      <div className={`h-[2px] w-full ${accent} opacity-40`} />

      {/* Title bar */}
      <div
        className="h-11 flex items-center justify-between px-4 shrink-0 cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onDoubleClick={onMaximize}
      >
        <span className="text-[13px] font-medium text-white/60">{title}</span>

        {/* Window controls */}
        <div className="flex items-center gap-2" onMouseDown={(e) => e.stopPropagation()}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMinimize();
            }}
            className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white/[0.06] transition-colors group"
          >
            <svg
              className="w-3.5 h-3.5 text-white/20 group-hover:text-white/50"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M5 12h14" />
            </svg>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMaximize();
            }}
            className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white/[0.06] transition-colors group"
          >
            <svg
              className="w-3 h-3 text-white/20 group-hover:text-white/50"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="4" y="4" width="16" height="16" rx="2" />
            </svg>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-red-500/20 transition-colors group"
          >
            <svg
              className="w-3.5 h-3.5 text-white/20 group-hover:text-red-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  );
}
