"use client";

import { useState, useEffect } from "react";
import type { KnowledgeCard } from "@/types";
import { sm2, getDueCards } from "@/lib/sm2";
import { cloudSetCards } from "@/lib/data-client";

const STORAGE_KEY = "ai-learning-knowledge-cards";

export default function ReviewPage() {
  const [cards, setCards] = useState<KnowledgeCard[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const all: KnowledgeCard[] = JSON.parse(raw);
        setCards(getDueCards(all));
      }
    } catch { /* ignore */ }
  }, []);

  const dueCards = getDueCards(cards);
  const current = dueCards[currentIdx];

  const rateCard = (quality: number) => {
    if (!current) return;
    const updated = cards.map((c) => {
      if (c.id !== current.id) return c;
      const result = sm2(quality, c.repetitions, c.easeFactor, c.interval);
      return { ...c, ...result, lastReviewQuality: quality };
    });
    setCards(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    cloudSetCards(updated);
    setShowAnswer(false);

    if (currentIdx + 1 < dueCards.length) {
      setCurrentIdx(currentIdx + 1);
    } else {
      setDone(true);
    }
  };

  if (done) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <h1 className="text-xl font-semibold text-zinc-200 mb-4">复习完成</h1>
        <p className="text-sm text-zinc-500 mb-6">本次复习了 {dueCards.length} 张卡片，下次复习时间已自动更新。</p>
        <button
          onClick={() => {
            setCurrentIdx(0);
            setDone(false);
            setShowAnswer(false);
          }}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm rounded-lg"
        >
          再来一轮
        </button>
      </div>
    );
  }

  if (dueCards.length === 0) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <h1 className="text-xl font-semibold text-zinc-200 mb-4">间隔复习</h1>
        <p className="text-sm text-zinc-500">暂无待复习的卡片。学完章节后 AI 会自动提取知识卡片，系统会根据 SM-2 算法安排复习。</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-xl font-semibold text-zinc-200 mb-2">间隔复习</h1>
      <p className="text-xs text-zinc-600 mb-6">
        第 {currentIdx + 1} / {dueCards.length} 张 · SM-2 算法安排复习
      </p>

      {current && (
        <div className="space-y-4">
          <div className="p-6 bg-[#18181b] border border-[#27272a] rounded-xl">
            <div className="flex gap-2 mb-4">
              {current.tags?.map((t) => (
                <span key={t} className="text-xs px-2 py-0.5 bg-[#27272a] text-zinc-500 rounded">
                  {t}
                </span>
              ))}
            </div>
            <h2 className="text-lg font-medium text-zinc-200 mb-2">{current.title}</h2>
            <p className="text-sm text-zinc-400 mb-4">{current.summary}</p>

            {!showAnswer ? (
              <button
                onClick={() => setShowAnswer(true)}
                className="w-full py-2 border border-emerald-500/30 text-emerald-400 text-sm rounded-lg hover:bg-emerald-500/10"
              >
                显示详情
              </button>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-zinc-400 leading-relaxed p-3 bg-[#0a0a0f] rounded-lg">
                  {current.details}
                </p>
                <p className="text-xs text-zinc-500">你的记忆程度如何？</p>
                <div className="flex gap-2">
                  {[
                    { q: 1, label: "完全忘了" },
                    { q: 2, label: "有点印象" },
                    { q: 3, label: "记得" },
                    { q: 4, label: "比较熟" },
                    { q: 5, label: "非常熟" },
                  ].map(({ q, label }) => (
                    <button
                      key={q}
                      onClick={() => rateCard(q)}
                      className={`flex-1 py-2 rounded-lg text-xs border transition-colors ${
                        q <= 2
                          ? "border-red-500/20 text-red-400 hover:bg-red-500/10"
                          : q === 3
                          ? "border-yellow-500/20 text-yellow-400 hover:bg-yellow-500/10"
                          : "border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/10"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
