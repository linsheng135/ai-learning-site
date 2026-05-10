"use client";

import { useState, useCallback } from "react";
import { useParams } from "next/navigation";
import type { QuizQuestion, QuizResult } from "@/types";

export default function TestPage() {
  const params = useParams();
  const courseId = params.courseId as string;

  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [results, setResults] = useState<QuizResult[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [chapterTitle, setChapterTitle] = useState("");

  const generateQuiz = useCallback(async () => {
    setLoading(true);
    setResults(null);
    try {
      const res = await fetch("/api/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chapterTitle, chapterContent: "" }),
      });
      const data = await res.json();
      if (data.questions) {
        setQuestions(data.questions);
        setAnswers({});
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [chapterTitle]);

  const submitAnswers = () => {
    const res: QuizResult[] = questions.map((q) => {
      const userAnswer = answers[q.id] || "";
      let correct = false;
      if (q.type === "multiple") {
        correct = JSON.stringify([...answers[q.id] as string[]].sort()) === JSON.stringify([...(q.correctAnswer as string[])].sort());
      } else {
        correct = String(userAnswer).trim().toLowerCase() === String(q.correctAnswer).trim().toLowerCase();
      }
      return { questionId: q.id, userAnswer, correct, score: correct ? 1 : 0 };
    });
    setResults(res);
  };

  const score = results ? results.filter((r) => r.correct).length : 0;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-xl font-semibold text-zinc-200 mb-6">测验</h1>

      {questions.length === 0 ? (
        <div className="space-y-4">
          <div>
            <label className="text-xs text-zinc-500 mb-1 block">章节标题（用于 AI 出题）</label>
            <input
              value={chapterTitle}
              onChange={(e) => setChapterTitle(e.target.value)}
              placeholder="例如：Python 变量与数据类型"
              className="w-full bg-[#18181b] border border-[#27272a] rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-emerald-500/50"
            />
          </div>
          <button
            onClick={generateQuiz}
            disabled={loading || !chapterTitle.trim()}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-zinc-700 text-white text-sm rounded-lg"
          >
            {loading ? "AI 出题中..." : "生成测验"}
          </button>
        </div>
      ) : results ? (
        <div className="space-y-4">
          <div className="bg-[#18181b] border border-[#27272a] rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-emerald-400">{score} / {questions.length}</p>
            <p className="text-sm text-zinc-500 mt-1">
              {score === questions.length ? "全部正确！" : score >= questions.length / 2 ? "继续加油！" : "建议复习相关章节"}
            </p>
          </div>
          {questions.map((q) => {
            const r = results.find((x) => x.questionId === q.id);
            return (
              <div key={q.id} className={`p-4 rounded-lg border ${r?.correct ? "border-emerald-500/20 bg-emerald-500/5" : "border-red-500/20 bg-red-500/5"}`}>
                <p className="text-sm text-zinc-300 mb-2">{q.question}</p>
                <p className="text-xs text-zinc-500">你的回答：{String(r?.userAnswer || "未作答")}</p>
                <p className="text-xs text-zinc-500">正确答案：{String(q.correctAnswer)}</p>
                <p className="text-xs text-zinc-600 mt-1">{q.explanation}</p>
              </div>
            );
          })}
          <button onClick={() => { setQuestions([]); setResults(null); }} className="px-4 py-2 text-sm text-zinc-400 border border-[#27272a] rounded-lg hover:text-zinc-200">
            重新出题
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {questions.map((q) => (
            <div key={q.id} className="p-4 bg-[#18181b] border border-[#27272a] rounded-lg">
              <p className="text-sm font-medium text-zinc-300 mb-3">{q.question}</p>
              {q.type === "single" && q.options && (
                <div className="space-y-1">
                  {q.options.map((opt) => (
                    <label key={opt} className="flex items-center gap-2 text-sm text-zinc-400 cursor-pointer">
                      <input
                        type="radio"
                        name={q.id}
                        value={opt}
                        checked={answers[q.id] === opt}
                        onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              )}
              {q.type === "truefalse" && (
                <div className="flex gap-4">
                  {["true", "false"].map((v) => (
                    <label key={v} className="flex items-center gap-2 text-sm text-zinc-400 cursor-pointer">
                      <input
                        type="radio"
                        name={q.id}
                        value={v}
                        checked={answers[q.id] === v}
                        onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
                      />
                      {v === "true" ? "正确" : "错误"}
                    </label>
                  ))}
                </div>
              )}
              {q.type === "short" && (
                <textarea
                  value={(answers[q.id] as string) || ""}
                  onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
                  rows={3}
                  className="w-full bg-[#0a0a0f] border border-[#27272a] rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-emerald-500/50 resize-none"
                  placeholder="输入你的答案..."
                />
              )}
            </div>
          ))}
          <button
            onClick={submitAnswers}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm rounded-lg"
          >
            提交答案
          </button>
        </div>
      )}
    </div>
  );
}
