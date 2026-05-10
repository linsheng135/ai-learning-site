"use client";

import { useParams } from "next/navigation";
import { useCourses, findChapterInCourses } from "@/lib/useCourses";
import { useEffect, useState, useCallback } from "react";
import { saveProgress, getProgress } from "@/lib/storage";
import MarkdownDoc from "@/components/MarkdownDoc";
import ChatPanel from "@/components/ChatPanel";
import MindMap from "@/components/MindMap";
import { cloudSetDoc, cloudSetProgress } from "@/lib/data-client";

export default function CoursePage() {
  const params = useParams();
  const courseId = params.id as string;
  const chapterId = params.chapterId as string;

  const courses = useCourses();
  const result = findChapterInCourses(courses, chapterId);
  const [doc, setDoc] = useState("");
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [modelId, setModelId] = useState("deepseek-v4-flash");

  useEffect(() => {
    const p = getProgress();
    if (p[chapterId]?.completed) setCompleted(true);

    // 尝试从缓存加载文档
    const cached = localStorage.getItem(`ai-doc-${chapterId}`);
    if (cached) {
      setDoc(cached);
    }
  }, [chapterId]);

  const generateDoc = useCallback(async () => {
    if (!result) return;
    setLoading(true);
    try {
      const res = await fetch("/api/generate-doc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chapterTitle: result.chapter.title,
          chapterDescription: result.chapter.description,
          courseTitle: result.course.title,
          difficulty: "beginner",
          modelId,
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setDoc(data.content);
      localStorage.setItem(`ai-doc-${chapterId}`, data.content);
      cloudSetDoc(chapterId, data.content);
      saveProgress(chapterId, {});
    } catch (err) {
      setDoc(`# 生成失败\n\n${String(err)}`);
    } finally {
      setLoading(false);
    }
  }, [result, chapterId]);

  const markComplete = () => {
    setCompleted(true);
    saveProgress(chapterId, { completed: true });
    const p = getProgress();
    cloudSetProgress(p);
  };

  if (!result) {
    return (
      <div className="flex items-center justify-center h-full text-zinc-500">
        章节未找到
      </div>
    );
  }

  const { course, chapter } = result;

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* 顶部栏 */}
      <div className="shrink-0 px-4 py-2 border-b border-[#27272a] flex items-center gap-3 bg-[#0f0f13]">
        <span className="text-xs text-zinc-600">{course.title}</span>
        <span className="text-zinc-600">/</span>
        <span className="text-sm font-medium truncate">{chapter.title}</span>
        <div className="flex-1" />
        {!doc && !loading && (
          <button
            onClick={generateDoc}
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm rounded-lg transition-colors"
          >
            生成文档
          </button>
        )}
        {doc && (
          <MindMap content={doc} chapterId={chapterId} modelId={modelId} />
        )}
        {doc && !completed && (
          <button
            onClick={markComplete}
            className="px-3 py-1.5 bg-[#18181b] border border-[#27272a] hover:border-emerald-500/50 text-zinc-300 text-sm rounded-lg transition-colors"
          >
            标记完成
          </button>
        )}
        {completed && (
          <span className="text-xs text-emerald-400 font-medium">已完成 ✓</span>
        )}
        {loading && (
          <span className="text-sm text-zinc-500">AI 正在生成文档...</span>
        )}
      </div>

      {/* 主区域：文档 + 对话 */}
      <div className="flex-1 flex flex-col lg:flex-row min-h-0">
        {/* 文档区 */}
        <div className="flex-1 min-h-0 overflow-hidden">
          {doc ? (
            <MarkdownDoc content={doc} />
          ) : (
            <div className="flex items-center justify-center h-full">
              {!loading && (
                <div className="text-center">
                  <p className="text-zinc-500 mb-4">点击上方按钮，AI 为你生成教学文档</p>
                  <p className="text-xs text-zinc-600">{chapter.description}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 对话区 */}
        <div className="h-72 lg:h-full lg:w-[400px] shrink-0">
          <ChatPanel
            chapterId={chapterId}
            chapterTitle={chapter.title}
            courseTitle={course.title}
            modelId={modelId}
            onModelChange={setModelId}
          />
        </div>
      </div>
    </div>
  );
}
