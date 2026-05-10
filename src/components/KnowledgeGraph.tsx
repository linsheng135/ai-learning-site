"use client";

import { useState, useEffect } from "react";
import type { KnowledgeCard } from "@/types";

interface KnowledgeGraphProps {
  cards: KnowledgeCard[];
}

export default function KnowledgeGraph({ cards }: KnowledgeGraphProps) {
  const [selected, setSelected] = useState<KnowledgeCard | null>(null);

  if (cards.length === 0) {
    return <p className="text-sm text-zinc-500 text-center py-8">暂无知识卡片，学习章节后 AI 会自动提取</p>;
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-6">
        {cards.map((card) => (
          <button
            key={card.id}
            onClick={() => setSelected(card)}
            className={`px-3 py-2 rounded-lg text-sm border transition-colors text-left ${
              selected?.id === card.id
                ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-300"
                : "border-[#27272a] bg-[#18181b] text-zinc-400 hover:border-zinc-600"
            }`}
          >
            <div className="font-medium">{card.title}</div>
            <div className="text-xs text-zinc-500 mt-0.5">{card.tags?.join(", ")}</div>
          </button>
        ))}
      </div>

      {selected && (
        <div className="bg-[#18181b] border border-[#27272a] rounded-lg p-4">
          <h3 className="text-lg font-medium text-zinc-200 mb-2">{selected.title}</h3>
          <p className="text-sm text-zinc-400 mb-3">{selected.summary}</p>
          <p className="text-sm text-zinc-500 leading-relaxed">{selected.details}</p>
          {selected.relatedCardIds && selected.relatedCardIds.length > 0 && (
            <div className="mt-4 pt-3 border-t border-[#27272a]">
              <span className="text-xs text-zinc-600">关联卡片: </span>
              {selected.relatedCardIds.map((id) => {
                const related = cards.find((c) => c.id === id);
                return related ? (
                  <button
                    key={id}
                    onClick={() => setSelected(related)}
                    className="text-xs text-emerald-500 hover:text-emerald-400 ml-1"
                  >
                    {related.title}
                  </button>
                ) : null;
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
