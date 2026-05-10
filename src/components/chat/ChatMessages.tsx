import { useRef, useEffect } from "react";
import type { ChatMessage } from "@/types";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface ChatMessagesProps {
  messages: ChatMessage[];
  loading: boolean;
}

export default function ChatMessages({ messages, loading }: ChatMessagesProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 min-h-0">
      {messages.length === 0 && (
        <p className="text-sm text-zinc-600 text-center mt-8">
          对当前内容有疑问？直接问 AI 导师
        </p>
      )}

      {messages.map((msg, i) => (
        <div key={i} className={`text-sm ${msg.role === "user" ? "text-right" : "text-left"}`}>
          <div
            className={`inline-block max-w-[85%] rounded-lg px-3 py-2 text-left ${
              msg.role === "user"
                ? "bg-emerald-500/15 text-zinc-200 border border-emerald-500/20"
                : "bg-[#18181b] text-zinc-300 border border-[#27272a]"
            }`}
          >
            {msg.role === "user" ? (
              <div className="whitespace-pre-wrap">{msg.content}</div>
            ) : (
              <div className="prose prose-sm max-w-none text-zinc-300">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {msg.content}
                </ReactMarkdown>
              </div>
            )}
          </div>
        </div>
      ))}

      {loading && (
        <div className="text-sm text-zinc-500 flex items-center gap-2">
          <span className="animate-pulse">●</span> AI 导师正在思考...
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}
