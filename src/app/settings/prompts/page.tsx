"use client";

import { useState, useEffect } from "react";
import type { PromptConfig } from "@/types";
import { getPrompts, savePrompt, resetPrompts } from "@/lib/prompts";

const scenarios = [
  { id: "generate-doc", label: "生成教学文档" },
  { id: "chat", label: "AI 导师对话" },
  { id: "quiz", label: "生成测验题目" },
  { id: "mindmap", label: "生成思维导图" },
  { id: "summary", label: "月度学习总结" },
  { id: "knowledge-cards", label: "提取知识卡片" },
];

export default function PromptsPage() {
  const [prompts, setPrompts] = useState<PromptConfig[]>([]);
  const [activeId, setActiveId] = useState("generate-doc");
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    setPrompts(getPrompts());
  }, []);

  const active = prompts.find((p) => p.scenario === activeId);
  const scenario = scenarios.find((s) => s.id === activeId);

  const update = (field: keyof PromptConfig, value: string | number) => {
    setPrompts((prev) =>
      prev.map((p) => (p.scenario === activeId ? { ...p, [field]: value } : p))
    );
    setDirty(true);
  };

  const save = () => {
    if (active) {
      savePrompt(active);
      setDirty(false);
    }
  };

  const reset = () => {
    resetPrompts();
    setPrompts(getPrompts());
    setDirty(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-xl font-semibold text-zinc-200 mb-6">提示词管理</h1>

      <div className="flex gap-6">
        {/* 场景列表 */}
        <div className="w-48 shrink-0 space-y-1">
          {scenarios.map((s) => (
            <button
              key={s.id}
              onClick={() => { setActiveId(s.id); setDirty(false); }}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                activeId === s.id
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-[#18181b]"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* 编辑区 */}
        <div className="flex-1 space-y-4">
          {active && (
            <>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-zinc-300">{scenario?.label}</h2>
                <div className="flex gap-2">
                  {dirty && (
                    <button onClick={save} className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm rounded-lg">
                      保存
                    </button>
                  )}
                  <button onClick={reset} className="px-3 py-1.5 text-sm text-zinc-400 hover:text-zinc-200 border border-[#27272a] rounded-lg">
                    重置全部
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs text-zinc-500 mb-1 block">System Prompt</label>
                <textarea
                  value={active.systemPrompt}
                  onChange={(e) => update("systemPrompt", e.target.value)}
                  rows={4}
                  className="w-full bg-[#18181b] border border-[#27272a] rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-emerald-500/50 resize-none"
                />
              </div>

              <div>
                <label className="text-xs text-zinc-500 mb-1 block">
                  User Prompt 模板（使用 {`{{变量}}`} 占位）
                </label>
                <textarea
                  value={active.userPromptTemplate}
                  onChange={(e) => update("userPromptTemplate", e.target.value)}
                  rows={12}
                  className="w-full bg-[#18181b] border border-[#27272a] rounded-lg px-3 py-2 text-sm text-zinc-200 font-mono focus:outline-none focus:border-emerald-500/50 resize-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-xs text-zinc-500 mb-1 block">Temperature</label>
                  <input
                    type="number"
                    value={active.temperature}
                    onChange={(e) => update("temperature", parseFloat(e.target.value))}
                    step={0.1}
                    min={0}
                    max={2}
                    className="w-full bg-[#18181b] border border-[#27272a] rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-emerald-500/50"
                  />
                </div>
                <div>
                  <label className="text-xs text-zinc-500 mb-1 block">Max Tokens</label>
                  <input
                    type="number"
                    value={active.maxTokens}
                    onChange={(e) => update("maxTokens", parseInt(e.target.value))}
                    className="w-full bg-[#18181b] border border-[#27272a] rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-emerald-500/50"
                  />
                </div>
                <div>
                  <label className="text-xs text-zinc-500 mb-1 block">默认模型</label>
                  <select
                    value={active.modelId}
                    onChange={(e) => update("modelId", e.target.value)}
                    className="w-full bg-[#18181b] border border-[#27272a] rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-emerald-500/50"
                  >
                    <option value="deepseek-v4-flash">DeepSeek Chat</option>
                  </select>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
