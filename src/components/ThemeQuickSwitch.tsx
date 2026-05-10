"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { cloudSetSettings } from "@/lib/data-client";

const themes = [
  { id: "dark-classic", name: "经典黑", color: "#0f0f13" },
  { id: "dark-blue", name: "深海蓝", color: "#0a0e27" },
  { id: "dark-green", name: "墨绿", color: "#0a1a10" },
  { id: "light-warm", name: "暖白", color: "#faf8f5" },
  { id: "light-paper", name: "护眼纸", color: "#f5f0e8" },
];

const fontSizes = [
  { id: "small", name: "小", size: "14px" },
  { id: "medium", name: "中", size: "16px" },
  { id: "large", name: "大", size: "18px" },
] as const;

export default function ThemeQuickSwitch() {
  const [theme, setTheme] = useState("dark-classic");
  const [fontSize, setFontSize] = useState("medium");
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, right: 0 });
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("ai-learning-settings");
      if (raw) {
        const s = JSON.parse(raw);
        setTheme(s.theme || "dark-classic");
        setFontSize(s.fontSize || "medium");
      }
    } catch { /* ignore */ }
  }, []);

  // 打开时计算按钮位置
  const toggle = useCallback(() => {
    if (!open && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setPos({ top: rect.bottom + 4, right: window.innerWidth - rect.right });
    }
    setOpen((v) => !v);
  }, [open]);

  // 点击外部关闭
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (btnRef.current && !btnRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [open]);

  // ESC 关闭
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open]);

  const apply = (t: string, f: string) => {
    document.documentElement.setAttribute("data-theme", t);
    document.documentElement.style.setProperty(
      "--font-size-base",
      fontSizes.find((fs) => fs.id === f)?.size || "16px"
    );
    const settings = { theme: t, fontSize: f };
    localStorage.setItem("ai-learning-settings", JSON.stringify(settings));
    cloudSetSettings(settings);
  };

  const setThemeAndApply = (t: string) => {
    setTheme(t);
    apply(t, fontSize);
  };

  const setFontAndApply = (f: string) => {
    setFontSize(f);
    apply(theme, f);
  };

  const currentTheme = themes.find((t) => t.id === theme);

  return (
    <>
      <button
        ref={btnRef}
        onClick={toggle}
        type="button"
        className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors flex items-center gap-1 shrink-0"
      >
        <span
          className="inline-block w-3 h-3 rounded-full border border-zinc-600"
          style={{ backgroundColor: currentTheme?.color || "#0f0f13" }}
        />
        主题
      </button>

      {open &&
        createPortal(
          <div
            className="fixed z-[9999] w-48 bg-[#18181b] border border-[#3f3f46] rounded-lg p-3 shadow-2xl"
            style={{ top: pos.top, right: pos.right }}
          >
            <p className="text-xs text-zinc-500 mb-2">主题</p>
            <div className="grid grid-cols-5 gap-1 mb-3">
              {themes.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setThemeAndApply(t.id)}
                  title={t.name}
                  className={`w-7 h-7 rounded border-2 transition-colors ${
                    theme === t.id ? "border-emerald-500" : "border-transparent hover:border-zinc-600"
                  }`}
                  style={{ backgroundColor: t.color }}
                />
              ))}
            </div>

            <p className="text-xs text-zinc-500 mb-2">字号</p>
            <div className="flex gap-1">
              {fontSizes.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFontAndApply(f.id)}
                  className={`flex-1 text-xs py-1 rounded transition-colors ${
                    fontSize === f.id
                      ? "bg-emerald-500/20 text-emerald-400"
                      : "text-zinc-400 hover:bg-[#27272a]"
                  }`}
                >
                  {f.name}
                </button>
              ))}
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
