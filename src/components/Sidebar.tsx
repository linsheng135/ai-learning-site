"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useCourses } from "@/lib/useCourses";
import type { Course } from "@/types";

interface Progress {
  chapterId: string;
  completed: boolean;
  score: number;
  lastAccessed: string;
}

export default function Sidebar() {
  const pathname = usePathname();
  const courses = useCourses();
  const [progress, setProgress] = useState<Record<string, Progress>>({});
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem("ai-learning-progress");
    if (raw) setProgress(JSON.parse(raw));
  }, []);

  useEffect(() => {
    const onStorage = () => {
      const raw = localStorage.getItem("ai-learning-progress");
      if (raw) setProgress(JSON.parse(raw));
    };
    window.addEventListener("storage", onStorage);
    const interval = setInterval(onStorage, 2000);
    return () => {
      window.removeEventListener("storage", onStorage);
      clearInterval(interval);
    };
  }, []);

  const courseProgress = (course: Course) => {
    const total = course.chapters.length;
    const done = course.chapters.filter((c) => progress[c.id]?.completed).length;
    return { done, total };
  };

  return (
    <>
      {!collapsed && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setCollapsed(true)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full z-50 bg-[var(--sidebar)] border-r border-[var(--border)] flex flex-col transition-transform duration-200 ${
          collapsed ? "-translate-x-full lg:translate-x-0 lg:w-16" : "translate-x-0 w-64"
        } lg:relative lg:z-0`}
      >
        <div className="p-4 border-b border-[var(--border)] flex items-center justify-between shrink-0">
          {!collapsed && (
            <Link href="/" className="font-semibold text-lg text-[var(--foreground)] hover:text-[var(--accent)] transition-colors">
              AI 学习
            </Link>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-zinc-500 hover:text-zinc-300 p-1 rounded transition-colors shrink-0"
          >
            {collapsed ? "☰" : "✕"}
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-3 space-y-4">
          {courses.map((course) => {
            const { done, total } = courseProgress(course);
            const isActive = pathname?.startsWith(`/course/${course.id}`);

            return (
              <div key={course.id}>
                {!collapsed && (
                  <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1 px-2">
                    {course.icon} {course.title}
                    <span className="ml-1 text-zinc-600">
                      {done}/{total}
                    </span>
                  </div>
                )}
                <ul className="space-y-0.5">
                  {course.chapters.map((ch) => {
                    const isChapterActive = pathname === `/course/${course.id}/${ch.id}`;
                    const isDone = progress[ch.id]?.completed;

                    return (
                      <li key={ch.id}>
                        <Link
                          href={`/course/${course.id}/${ch.id}`}
                          onClick={() => setCollapsed(true)}
                          className={`block rounded-md text-sm transition-colors ${
                            collapsed
                              ? "px-2 py-2 text-center text-xs"
                              : "px-3 py-1.5"
                          } ${
                            isChapterActive
                              ? "bg-emerald-500/15 text-emerald-400 font-medium"
                              : "text-zinc-400 hover:bg-[#18181b] hover:text-zinc-200"
                          }`}
                        >
                          {collapsed ? (
                            <span className={isDone ? "text-emerald-400" : ""}>
                              {isDone ? "✓" : "○"}
                            </span>
                          ) : (
                            <span className="flex items-center gap-2">
                              <span className={isDone ? "text-emerald-400" : "text-zinc-600"}>
                                {isDone ? "✓" : "○"}
                              </span>
                              <span className="truncate">{ch.title}</span>
                            </span>
                          )}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </nav>

        {!collapsed && (
          <div className="p-3 border-t border-[var(--border)] text-xs text-zinc-600">
            DeepSeek API · 云端存储
          </div>
        )}
      </aside>

      {collapsed && (
        <button
          onClick={() => setCollapsed(false)}
          className="fixed top-4 left-4 z-30 bg-[#18181b] border border-[#27272a] rounded-md p-2 text-zinc-400 hover:text-zinc-200 lg:relative lg:top-auto lg:left-auto"
        >
          ☰
        </button>
      )}
    </>
  );
}
