"use client";

import { useState, useRef, useEffect } from "react";
import type { ChatMessage } from "@/lib/storage";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface ChatPanelProps {
  chapterId: string;
  chapterTitle: string;
  courseTitle: string;
  modelId: string;
  onModelChange: (modelId: string) => void;
}

const models = [
  { id: "gemini-flash", name: "Gemini", icon: "⚡" },
  { id: "deepseek-chat", name: "DeepSeek", icon: "🔵" },
];

export default function ChatPanel({ chapterId, chapterTitle, courseTitle, modelId, onModelChange }: ChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const raw = localStorage.getItem(`ai-learning-chat-${chapterId}`);
    if (raw) setMessages(JSON.parse(raw));
  }, [chapterId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: ChatMessage = { role: "user", content: text, timestamp: new Date().toISOString() };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput("");
    setLoading(true);

    localStorage.setItem(`ai-learning-chat-${chapterId}`, JSON.stringify(updated));

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updated.map((m) => ({ role: m.role, content: m.content })),
          chapterContext: `${courseTitle} - ${chapterTitle}`,
          modelId,
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      const aiMsg: ChatMessage = { role: "assistant", content: data.content, timestamp: new Date().toISOString() };
      const final = [...updated, aiMsg];
      setMessages(final);
      localStorage.setItem(`ai-learning-chat-${chapterId}`, JSON.stringify(final));
    } catch (err) {
      const errMsg: ChatMessage = { role: "assistant", content: `出错了: ${String(err)}`, timestamp: new Date().toISOString() };
      const final = [...updated, errMsg];
      setMessages(final);
      localStorage.setItem(`ai-learning-chat-${chapterId}`, JSON.stringify(final));
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    localStorage.removeItem(`ai-learning-chat-${chapterId}`);
  };

  return (
    <div className="flex flex-col h-full border-t border-[#27272a] bg-[#0f0f13]">
      <div className="px-4 py-2 border-b border-[#27272a] flex items-center gap-2 shrink-0">
        <span className="text-sm text-zinc-500">💬</span>
        <span className="text-sm text-zinc-400 truncate flex-1">{chapterTitle}</span>
        {/* 模型切换 */}
        <div className="flex gap-1">
          {models.map((m) => (
            <button
              key={m.id}
              onClick={() => onModelChange(m.id)}
              className={`text-xs px-2 py-0.5 rounded transition-colors ${
                modelId === m.id
                  ? "bg-emerald-500/20 text-emerald-400"
                  : "text-zinc-600 hover:text-zinc-400"
              }`}
            >
              {m.icon} {m.name}
            </button>
          ))}
        </div>
        {messages.length > 0 && (
          <button onClick={clearChat} className="text-xs text-zinc-600 hover:text-zinc-400 shrink-0">
            清空
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 min-h-0">
        {messages.length === 0 && (
          <p className="text-sm text-zinc-600 text-center mt-8">
            对当前内容有疑问？直接问 AI 导师
          </p>
        )}
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`text-sm ${
              msg.role === "user" ? "text-right" : "text-left"
            }`}
          >
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

      <div className="p-3 border-t border-[#27272a] shrink-0">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="提问..."
            className="flex-1 bg-[#18181b] border border-[#27272a] rounded-lg px-3 py-2 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50 transition-colors"
          />
          <button
            onClick={send}
            disabled={loading || !input.trim()}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-zinc-700 disabled:text-zinc-500 text-white rounded-lg text-sm font-medium transition-colors shrink-0"
          >
            发送
          </button>
        </div>
      </div>
    </div>
  );
}
