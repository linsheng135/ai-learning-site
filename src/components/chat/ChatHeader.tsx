import type { ChatSession } from "@/types";
import SearchToggle from "@/components/SearchToggle";

interface ChatHeaderProps {
  activeSession: ChatSession | null;
  sessions: ChatSession[];
  showSessionList: boolean;
  onToggleSessionList: () => void;
  searchEnabled: boolean;
  onSearchChange: (enabled: boolean) => void;
  modelId: string;
  onModelChange: (id: string) => void;
  onNewSession: () => void;
}

const models = [
  { id: "deepseek-v4-flash", name: "DeepSeek", label: "DS" },
];

export default function ChatHeader({
  activeSession, sessions, showSessionList,
  onToggleSessionList, searchEnabled, onSearchChange,
  modelId, onModelChange, onNewSession,
}: ChatHeaderProps) {
  return (
    <div className="px-3 py-2 border-b border-[#27272a] flex items-center gap-2 shrink-0">
      <button
        onClick={onToggleSessionList}
        className="text-sm text-zinc-400 hover:text-zinc-200 truncate flex-1 text-left"
      >
        💬 {activeSession?.title || "新对话"}
        {sessions.length > 1 && (
          <span className="text-xs text-zinc-600 ml-1">({sessions.length})</span>
        )}
      </button>

      <SearchToggle enabled={searchEnabled} onChange={onSearchChange} />

      <div className="flex gap-1">
        {models.map((m) => (
          <button
            key={m.id}
            onClick={() => onModelChange(m.id)}
            title={m.name}
            className={`text-xs px-1.5 py-0.5 rounded transition-colors ${
              modelId === m.id ? "bg-emerald-500/20 text-emerald-400" : "text-zinc-600 hover:text-zinc-400"
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      <button onClick={onNewSession} className="text-xs text-zinc-500 hover:text-zinc-300" title="新建对话">
        +
      </button>
    </div>
  );
}
