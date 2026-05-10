"use client";

import { useState, useEffect } from "react";
import type { MonthlySummary } from "@/types";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getProgress } from "@/lib/storage";
import { cloudSetSummaries } from "@/lib/data-client";

const STORAGE_KEY = "ai-learning-monthly-summaries";

export default function SummaryPage() {
  const [summaries, setSummaries] = useState<MonthlySummary[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setSummaries(JSON.parse(raw));
    } catch { /* ignore */ }
  }, []);

  const generateSummary = async () => {
    setLoading(true);
    try {
      const progress = getProgress();
      const chapters = Object.entries(progress).filter(([, v]) => v.completed);
      const chapterTitles = chapters.map(([id]) => id).join(", ");
      const chaptersCompleted = chapters.length;

      // 简单统计
      let totalMessages = 0;
      for (const [chapterId] of chapters) {
        const raw = localStorage.getItem(`ai-learning-sessions-${chapterId}`);
        if (raw) {
          const sessions = JSON.parse(raw);
          totalMessages += sessions.reduce((sum: number, s: { messages: unknown[] }) => sum + s.messages.length, 0);
        }
      }

      const now = new Date();
      const summary: MonthlySummary = {
        id: `${now.getFullYear()}-${now.getMonth() + 1}`,
        year: now.getFullYear(),
        month: now.getMonth() + 1,
        content: "",
        chaptersCompleted,
        quizzesTaken: 0,
        avgQuizScore: 0,
        totalMessages,
        createdAt: now.toISOString(),
      };

      const res = await fetch("/api/summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chaptersCompleted, quizzesTaken: 0, avgQuizScore: 0, totalMessages, chapterTitles }),
      });
      const data = await res.json();
      summary.content = data.content || "生成失败";

      const list = [summary, ...summaries.filter((s) => s.id !== summary.id)];
      setSummaries(list);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
      cloudSetSummaries(list);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-zinc-200">学习总结</h1>
        <button
          onClick={generateSummary}
          disabled={loading}
          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-zinc-700 text-white text-sm rounded-lg"
        >
          {loading ? "生成中..." : "生成本月总结"}
        </button>
      </div>

      {summaries.length === 0 ? (
        <p className="text-sm text-zinc-500 text-center py-12">
          暂无总结。点击按钮让 AI 生成你的月度学习总结。
        </p>
      ) : (
        <div className="space-y-6">
          {summaries.map((s) => (
            <div key={s.id} className="p-4 bg-[#18181b] border border-[#27272a] rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-medium text-zinc-300">
                  {s.year} 年 {s.month} 月总结
                </h2>
                <span className="text-xs text-zinc-600">
                  完成 {s.chaptersCompleted} 章 · {s.totalMessages} 条对话
                </span>
              </div>
              <div className="prose prose-sm max-w-none text-zinc-400">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{s.content}</ReactMarkdown>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
