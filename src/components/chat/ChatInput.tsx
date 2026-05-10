interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  loading: boolean;
  searchEnabled: boolean;
}

export default function ChatInput({ value, onChange, onSend, loading, searchEnabled }: ChatInputProps) {
  return (
    <div className="p-3 border-t border-[#27272a] shrink-0">
      <div className="flex gap-2">
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSend()}
          placeholder={searchEnabled ? "搜索+提问..." : "提问..."}
          className="flex-1 bg-[#18181b] border border-[#27272a] rounded-lg px-3 py-2 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50 transition-colors"
        />
        <button
          onClick={onSend}
          disabled={loading || !value.trim()}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-zinc-700 disabled:text-zinc-500 text-white rounded-lg text-sm font-medium transition-colors shrink-0"
        >
          发送
        </button>
      </div>
    </div>
  );
}
