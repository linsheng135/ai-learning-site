"use client";

import { useState, useEffect } from "react";
import type { KnowledgeCard } from "@/types";
import KnowledgeGraph from "@/components/KnowledgeGraph";
import { sm2 } from "@/lib/sm2";
import { cloudSetCards } from "@/lib/data-client";

const STORAGE_KEY = "ai-learning-knowledge-cards";

export default function KnowledgePage() {
  const [cards, setCards] = useState<KnowledgeCard[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setCards(JSON.parse(raw));
    } catch { /* ignore */ }
  }, []);

  const syncCards = (list: KnowledgeCard[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    cloudSetCards(list);
  };

  const deleteCard = (id: string) => {
    const list = cards.filter((c) => c.id !== id);
    setCards(list);
    syncCards(list);
  };

  const reviewCard = (id: string, quality: number) => {
    const updated = cards.map((c) => {
      if (c.id !== id) return c;
      const result = sm2(quality, c.repetitions, c.easeFactor, c.interval);
      return { ...c, ...result, lastReviewQuality: quality };
    });
    setCards(updated);
    syncCards(updated);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-zinc-200">知识卡片</h1>
        <span className="text-xs text-zinc-600">{cards.length} 张卡片</span>
      </div>

      <KnowledgeGraph cards={cards} />

      {/* SM-2 复习区 */}
      <div className="mt-8">
        <h2 className="text-sm font-medium text-zinc-400 mb-3">间隔复习</h2>
        {cards.filter((c) => new Date(c.nextReview || 0) <= new Date()).length === 0 ? (
          <p className="text-sm text-zinc-500">暂无待复习卡片</p>
        ) : (
          <div className="space-y-2">
            {cards
              .filter((c) => new Date(c.nextReview || 0) <= new Date())
              .slice(0, 5)
              .map((card) => (
                <div key={card.id} className="p-3 bg-[#18181b] border border-[#27272a] rounded-lg">
                  <p className="text-sm font-medium text-zinc-300 mb-1">{card.title}</p>
                  <p className="text-xs text-zinc-500 mb-2">{card.summary}</p>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((q) => (
                      <button
                        key={q}
                        onClick={() => reviewCard(card.id, q)}
                        className={`text-xs px-2 py-1 rounded ${
                          q <= 2 ? "bg-red-500/10 text-red-400" : q === 3 ? "bg-yellow-500/10 text-yellow-400" : "bg-emerald-500/10 text-emerald-400"
                        }`}
                      >
                        {q === 1 ? "全忘" : q === 3 ? "记得" : q === 5 ? "很熟" : q}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* 全部卡片列表 */}
      <div className="mt-8">
        <h2 className="text-sm font-medium text-zinc-400 mb-3">全部卡片</h2>
        <div className="space-y-2">
          {cards.map((card) => (
            <div key={card.id} className="p-3 bg-[#18181b] border border-[#27272a] rounded-lg flex items-start gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-zinc-300">{card.title}</span>
                  <span className="text-xs text-zinc-600">间隔: {card.interval || 0}天</span>
                </div>
                <p className="text-xs text-zinc-500 mt-1">{card.summary}</p>
              </div>
              <button onClick={() => deleteCard(card.id)} className="text-xs text-zinc-600 hover:text-red-400 shrink-0">
                删除
              </button>
            </div>
          ))}
          {cards.length === 0 && (
            <p className="text-sm text-zinc-500 text-center py-8">暂无知识卡片。在课程页面生成文档后，AI 会自动提取知识卡片。</p>
          )}
        </div>
      </div>
    </div>
  );
}
