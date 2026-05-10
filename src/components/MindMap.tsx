"use client";

import { useState, useEffect, useCallback } from "react";
import type { ChatSession } from "@/types";
import { cloudSetMindmap } from "@/lib/data-client";

interface MindMapProps {
  content: string;
  chapterId: string;
  modelId: string;
}

export default function MindMap({ content, chapterId, modelId }: MindMapProps) {
  const [mindmap, setMindmap] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const cached = localStorage.getItem(`ai-mindmap-${chapterId}`);
    if (cached) setMindmap(cached);
  }, [chapterId]);

  const generate = useCallback(async () => {
    setLoading(true);
    setOpen(true);
    try {
      // 读取对话记录
      let chatContent = "";
      try {
        const raw = localStorage.getItem(`ai-learning-sessions-${chapterId}`);
        if (raw) {
          const sessions: ChatSession[] = JSON.parse(raw);
          chatContent = sessions
            .flatMap((s) => s.messages)
            .map((m) => `[${m.role === "user" ? "问" : "答"}]: ${m.content}`)
            .join("\n");
        }
      } catch { /* ignore */ }

      const res = await fetch("/api/mindmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, chatContent, modelId }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setMindmap(data.mindmap);
      localStorage.setItem(`ai-mindmap-${chapterId}`, data.mindmap);
      cloudSetMindmap(chapterId, data.mindmap);
    } catch (err) {
      setMindmap(`生成失败: ${String(err)}`);
    } finally {
      setLoading(false);
    }
  }, [content, chapterId, modelId]);

  return (
    <>
      <button
        onClick={() => { setOpen(true); if (!mindmap && !loading) generate(); }}
        className="px-2 py-1 text-xs text-zinc-500 hover:text-emerald-400 border border-[var(--border)] hover:border-emerald-500/30 rounded transition-colors"
      >
        思维导图
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={() => setOpen(false)}>
          <div
            className="bg-[var(--sidebar)] border border-[var(--border)] rounded-xl w-[90vw] max-w-2xl max-h-[80vh] overflow-y-auto p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-[var(--foreground)]">思维导图</h3>
              <div className="flex gap-2">
                {!mindmap && !loading && (
                  <button onClick={generate} className="text-xs px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg">
                    生成
                  </button>
                )}
                <button onClick={() => setOpen(false)} className="text-xs px-3 py-1 text-zinc-400 hover:text-zinc-200">
                  关闭
                </button>
              </div>
            </div>

            {loading ? (
              <p className="text-sm text-zinc-500">AI 正在生成思维导图...</p>
            ) : (
              <pre className="text-sm text-[var(--foreground)] whitespace-pre-wrap font-mono leading-relaxed bg-[var(--surface)] rounded-lg p-4 border border-[var(--border)]">
                {mindmap}
              </pre>
            )}
          </div>
        </div>
      )}
    </>
  );
}
