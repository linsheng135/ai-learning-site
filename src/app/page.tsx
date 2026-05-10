"use client";

import { courses } from "@/data/courses";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Progress {
  chapterId: string;
  completed: boolean;
  score: number;
  lastAccessed: string;
}

export default function HomePage() {
  const [progress, setProgress] = useState<Record<string, Progress>>({});
  const [lastChapter, setLastChapter] = useState<string | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem("ai-learning-progress");
    if (raw) {
      const p = JSON.parse(raw);
      setProgress(p);

      let latest = "";
      let latestTime = "";
      for (const [id, v] of Object.entries(p)) {
        const data = v as Progress;
        if (data.lastAccessed && data.lastAccessed > latestTime) {
          latestTime = data.lastAccessed;
          latest = id;
        }
      }
      if (latest) setLastChapter(latest);
    }
  }, []);

  const allChapters = courses.flatMap((c) =>
    c.chapters.map((ch) => ({ ...ch, courseId: c.id, courseTitle: c.title }))
  );
  const totalDone = allChapters.filter((ch) => progress[ch.id]?.completed).length;
  const totalPct = allChapters.length > 0 ? Math.round((totalDone / allChapters.length) * 100) : 0;

  const recentChapters = Object.values(progress)
    .filter((p) => p.lastAccessed)
    .sort((a, b) => new Date(b.lastAccessed).getTime() - new Date(a.lastAccessed).getTime())
    .slice(0, 3);

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-2xl font-bold mb-2">欢迎回来 👋</h1>
        <p className="text-zinc-400 mb-8">继续你的 AI 学习之旅</p>

        {/* 总体进度 */}
        <div className="bg-[#18181b] border border-[#27272a] rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium">总体学习进度</span>
            <span className="text-sm text-zinc-400">{totalDone}/{allChapters.length} 章节</span>
          </div>
          <div className="w-full h-2 bg-[#27272a] rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${totalPct}%` }}
            />
          </div>
          <p className="text-xs text-zinc-500 mt-2">{totalPct}% 完成</p>
        </div>

        {/* 继续学习 */}
        {lastChapter && (() => {
          const ch = allChapters.find((c) => c.id === lastChapter);
          if (!ch) return null;
          return (
            <Link
              href={`/course/${ch.courseId}/${ch.id}`}
              className="block bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-5 mb-6 hover:bg-emerald-500/15 transition-colors"
            >
              <span className="text-xs text-emerald-400 uppercase tracking-wider">继续学习</span>
              <div className="text-lg font-semibold mt-1">{ch.title}</div>
              <div className="text-sm text-zinc-400 mt-0.5">{ch.courseTitle}</div>
            </Link>
          );
        })()}

        {/* 最近学习 */}
        {recentChapters.length > 0 && (
          <div className="mb-6">
            <h2 className="text-sm font-medium text-zinc-500 mb-3">最近学习</h2>
            <div className="space-y-2">
              {recentChapters.map((r) => {
                const ch = allChapters.find((c) => c.id === r.chapterId);
                if (!ch) return null;
                return (
                  <Link
                    key={ch.id}
                    href={`/course/${ch.courseId}/${ch.id}`}
                    className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-[#18181b] transition-colors"
                  >
                    <span className="text-xs text-emerald-400">{r.completed ? "✓" : "○"}</span>
                    <span className="text-sm">{ch.title}</span>
                    <span className="text-xs text-zinc-600">{ch.courseTitle}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* 课程列表 */}
        <h2 className="text-sm font-medium text-zinc-500 mb-3">所有课程</h2>
        <div className="grid gap-4">
          {courses.map((course) => {
            const done = course.chapters.filter((c) => progress[c.id]?.completed).length;
            return (
              <Link
                key={course.id}
                href={`/course/${course.id}/${course.chapters[0].id}`}
                className="block bg-[#18181b] border border-[#27272a] rounded-xl p-5 hover:border-zinc-600 transition-colors"
              >
                <div className="text-2xl mb-2">{course.icon}</div>
                <div className="font-semibold">{course.title}</div>
                <div className="text-sm text-zinc-400 mt-1">{course.description}</div>
                <div className="flex items-center gap-2 mt-3">
                  <div className="flex-1 h-1.5 bg-[#27272a] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all"
                      style={{ width: `${course.chapters.length > 0 ? Math.round((done / course.chapters.length) * 100) : 0}%` }}
                    />
                  </div>
                  <span className="text-xs text-zinc-600">
                    {done}/{course.chapters.length}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
