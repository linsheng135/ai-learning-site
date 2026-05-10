"use client";

interface SearchToggleProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}

export default function SearchToggle({ enabled, onChange }: SearchToggleProps) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className={`text-xs px-2 py-0.5 rounded transition-colors border ${
        enabled
          ? "bg-sky-500/20 text-sky-400 border-sky-500/30"
          : "text-zinc-500 border-[#27272a] hover:text-zinc-400"
      }`}
      title={enabled ? "已开启联网搜索" : "开启联网搜索"}
    >
      搜索 {enabled ? "ON" : "OFF"}
    </button>
  );
}
