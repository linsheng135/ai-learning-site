"use client";

import { useState, useEffect } from "react";
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

export default function ThemeSwitcher() {
  const [theme, setTheme] = useState("dark-classic");
  const [fontSize, setFontSize] = useState("medium");

  useEffect(() => {
    const saved = localStorage.getItem("ai-learning-settings");
    if (saved) {
      const s = JSON.parse(saved);
      setTheme(s.theme || "dark-classic");
      setFontSize(s.fontSize || "medium");
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.style.setProperty(
      "--font-size-base",
      fontSizes.find((f) => f.id === fontSize)?.size || "16px"
    );
    const settings = { theme, fontSize };
    localStorage.setItem("ai-learning-settings", JSON.stringify(settings));
    cloudSetSettings(settings);
  }, [theme, fontSize]);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium text-zinc-300 mb-3">主题</h3>
        <div className="grid grid-cols-5 gap-2">
          {themes.map((t) => (
            <button
              key={t.id}
              onClick={() => setTheme(t.id)}
              className={`rounded-lg p-3 border-2 transition-colors ${
                theme === t.id ? "border-emerald-500" : "border-[#27272a] hover:border-zinc-600"
              }`}
            >
              <div className="w-full h-8 rounded mb-1" style={{ backgroundColor: t.color }} />
              <span className="text-xs text-zinc-400">{t.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-zinc-300 mb-3">字体大小</h3>
        <div className="flex gap-2">
          {fontSizes.map((f) => (
            <button
              key={f.id}
              onClick={() => setFontSize(f.id)}
              className={`px-4 py-2 rounded-lg text-sm border transition-colors ${
                fontSize === f.id
                  ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/50"
                  : "text-zinc-400 border-[#27272a] hover:border-zinc-600"
              }`}
            >
              {f.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
