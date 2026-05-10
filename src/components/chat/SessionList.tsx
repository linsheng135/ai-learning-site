import type { ChatSession } from "@/types";

interface SessionListProps {
  sessions: ChatSession[];
  activeSessionId: string | null;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function SessionList({ sessions, activeSessionId, onSelect, onDelete }: SessionListProps) {
  if (sessions.length === 0) return null;

  return (
    <div className="border-b border-[#27272a] bg-[#0a0a0f] max-h-48 overflow-y-auto">
      {sessions.map((s) => (
        <div
          key={s.id}
          className={`px-3 py-2 flex items-center gap-2 cursor-pointer hover:bg-[#18181b] text-sm ${
            s.id === activeSessionId ? "bg-[#18181b]" : ""
          }`}
          onClick={() => onSelect(s.id)}
        >
          <span className="text-zinc-400 truncate flex-1">{s.title}</span>
          <span className="text-xs text-zinc-600">{s.messages.length} 条</span>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(s.id); }}
            className="text-xs text-zinc-600 hover:text-red-400"
          >
            删除
          </button>
        </div>
      ))}
    </div>
  );
}
