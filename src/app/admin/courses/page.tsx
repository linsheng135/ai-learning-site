"use client";

import { useState, useEffect } from "react";
import type { Course, Chapter } from "@/types";
import { courses as defaultCourses } from "@/data/courses";
import { cloudSetCourses } from "@/lib/data-client";

function toCustomCourse(c: (typeof defaultCourses)[number]): Course {
  return {
    id: c.id,
    title: c.title,
    description: c.description,
    icon: c.icon,
    difficulty: "beginner",
    domain: c.id.includes("agent") ? "ai-agent" : c.id.includes("ai") ? "ai" : "programming",
    chapters: c.chapters.map((ch, i) => ({ ...ch, order: i + 1 })),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

const STORAGE_KEY = "ai-learning-custom-courses";

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [editing, setEditing] = useState<Course | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      setCourses(JSON.parse(raw));
    } else {
      setCourses(defaultCourses.map(toCustomCourse));
    }
  }, []);

  const saveCourses = (list: Course[]) => {
    setCourses(list);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    cloudSetCourses(list);
  };

  const addCourse = () => {
    const c: Course = {
      id: Date.now().toString(36),
      title: "新课程",
      description: "",
      domain: "other",
      icon: "📚",
      difficulty: "beginner",
      chapters: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setEditing(c);
    setShowForm(true);
  };

  const editCourse = (c: Course) => {
    setEditing({ ...c });
    setShowForm(true);
  };

  const deleteCourse = (id: string) => {
    saveCourses(courses.filter((c) => c.id !== id));
  };

  const saveCourse = () => {
    if (!editing) return;
    editing.updatedAt = new Date().toISOString();
    const idx = courses.findIndex((c) => c.id === editing.id);
    const list = idx >= 0 ? courses.map((c) => (c.id === editing.id ? editing : c)) : [...courses, editing];
    saveCourses(list);
    setShowForm(false);
    setEditing(null);
  };

  const addChapter = () => {
    if (!editing) return;
    const ch: Chapter = {
      id: Date.now().toString(36),
      title: "新章节",
      description: "",
      order: editing.chapters.length + 1,
    };
    setEditing({ ...editing, chapters: [...editing.chapters, ch] });
  };

  const updateChapter = (idx: number, field: keyof Chapter, value: string | number) => {
    if (!editing) return;
    const chapters = editing.chapters.map((ch, i) => (i === idx ? { ...ch, [field]: value } : ch));
    setEditing({ ...editing, chapters });
  };

  const deleteChapter = (idx: number) => {
    if (!editing) return;
    setEditing({ ...editing, chapters: editing.chapters.filter((_, i) => i !== idx) });
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-zinc-200">课程管理</h1>
        <div className="flex gap-2">
          <button onClick={addCourse} className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm rounded-lg">
            添加课程
          </button>
          <button
            onClick={() => {
              localStorage.removeItem(STORAGE_KEY);
              setCourses(defaultCourses.map(toCustomCourse));
            }}
            className="px-3 py-1.5 text-sm text-zinc-400 border border-[#27272a] rounded-lg hover:text-zinc-200"
          >
            恢复默认
          </button>
        </div>
      </div>

      {/* 课程列表 */}
      <div className="space-y-2">
        {courses.map((c) => (
          <div
            key={c.id}
            className="flex items-center gap-3 p-3 bg-[#18181b] border border-[#27272a] rounded-lg"
          >
            <span className="text-lg">{c.icon}</span>
            <div className="flex-1">
              <div className="text-sm font-medium text-zinc-300">{c.title}</div>
              <div className="text-xs text-zinc-500">
                {c.chapters.length} 章节 · {c.difficulty} · {c.domain}
              </div>
            </div>
            <button onClick={() => editCourse(c)} className="text-xs px-2 py-1 text-zinc-400 hover:text-zinc-200">
              编辑
            </button>
            <button onClick={() => deleteCourse(c.id)} className="text-xs px-2 py-1 text-zinc-500 hover:text-red-400">
              删除
            </button>
          </div>
        ))}
      </div>

      {/* 编辑弹窗 */}
      {showForm && editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={() => setShowForm(false)}>
          <div
            className="bg-[#0f0f13] border border-[#27272a] rounded-xl w-[90vw] max-w-2xl max-h-[85vh] overflow-y-auto p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-medium text-zinc-200 mb-4">
              {courses.find((c) => c.id === editing.id) ? "编辑课程" : "新建课程"}
            </h2>

            <div className="space-y-3 mb-6">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-zinc-500 mb-1 block">课程标题</label>
                  <input
                    value={editing.title}
                    onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                    className="w-full bg-[#18181b] border border-[#27272a] rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-emerald-500/50"
                  />
                </div>
                <div>
                  <label className="text-xs text-zinc-500 mb-1 block">图标</label>
                  <input
                    value={editing.icon}
                    onChange={(e) => setEditing({ ...editing, icon: e.target.value })}
                    className="w-full bg-[#18181b] border border-[#27272a] rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-emerald-500/50"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-zinc-500 mb-1 block">描述</label>
                <textarea
                  value={editing.description}
                  onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                  rows={2}
                  className="w-full bg-[#18181b] border border-[#27272a] rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-emerald-500/50 resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-zinc-500 mb-1 block">领域</label>
                  <select
                    value={editing.domain}
                    onChange={(e) => setEditing({ ...editing, domain: e.target.value })}
                    className="w-full bg-[#18181b] border border-[#27272a] rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-emerald-500/50"
                  >
                    <option value="programming">编程</option>
                    <option value="ai">AI 基础</option>
                    <option value="ai-agent">AI Agent</option>
                    <option value="cooking">烹饪</option>
                    <option value="other">其他</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-zinc-500 mb-1 block">难度</label>
                  <select
                    value={editing.difficulty}
                    onChange={(e) => setEditing({ ...editing, difficulty: e.target.value as Course["difficulty"] })}
                    className="w-full bg-[#18181b] border border-[#27272a] rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-emerald-500/50"
                  >
                    <option value="beginner">初级</option>
                    <option value="intermediate">中级</option>
                    <option value="advanced">高级</option>
                  </select>
                </div>
              </div>

              {/* 章节管理 */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs text-zinc-500">章节 ({editing.chapters.length})</label>
                  <button onClick={addChapter} className="text-xs text-emerald-500 hover:text-emerald-400">
                    + 添加章节
                  </button>
                </div>
                <div className="space-y-1 max-h-48 overflow-y-auto">
                  {editing.chapters.map((ch, i) => (
                    <div key={ch.id || i} className="flex items-center gap-2 p-2 bg-[#0a0a0f] rounded">
                      <span className="text-xs text-zinc-600 w-6">{i + 1}</span>
                      <input
                        value={ch.title}
                        onChange={(e) => updateChapter(i, "title", e.target.value)}
                        className="flex-1 bg-transparent text-sm text-zinc-300 focus:outline-none"
                        placeholder="章节标题"
                      />
                      <input
                        value={ch.description}
                        onChange={(e) => updateChapter(i, "description", e.target.value)}
                        className="flex-1 bg-transparent text-xs text-zinc-500 focus:outline-none"
                        placeholder="简介"
                      />
                      <button onClick={() => deleteChapter(i)} className="text-xs text-zinc-600 hover:text-red-400">
                        删除
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-zinc-400 hover:text-zinc-200">
                取消
              </button>
              <button onClick={saveCourse} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm rounded-lg">
                保存
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
