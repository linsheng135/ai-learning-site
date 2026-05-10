"use client";

import { useState, useEffect, useCallback } from "react";
import type { Course, Chapter } from "@/types";
import { courses as defaultCourses } from "@/data/courses";

function toCustomCourse(c: (typeof defaultCourses)[number]): Course {
  return {
    id: c.id,
    title: c.title,
    description: c.description,
    icon: c.icon,
    difficulty: "beginner" as const,
    domain: c.id.includes("agent") ? "ai-agent" : c.id.includes("ai") ? "ai" : "programming",
    chapters: c.chapters.map((ch, i) => ({ ...ch, order: i + 1 })),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

const STORAGE_KEY = "ai-learning-custom-courses";

export function loadCourses(): Course[] {
  if (typeof window === "undefined") return defaultCourses.map(toCustomCourse);
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return defaultCourses.map(toCustomCourse);
}

export function findChapterInCourses(courses: Course[], chapterId: string): { course: Course; chapter: Chapter } | null {
  for (const course of courses) {
    const chapter = course.chapters.find((c) => c.id === chapterId);
    if (chapter) return { course, chapter };
  }
  return null;
}

export function useCourses() {
  const [courses, setCourses] = useState<Course[]>([]);

  const refresh = useCallback(() => {
    setCourses(loadCourses());
  }, []);

  useEffect(() => {
    refresh();
    const onStorage = () => refresh();
    window.addEventListener("storage", onStorage);
    const interval = setInterval(refresh, 2000);
    return () => {
      window.removeEventListener("storage", onStorage);
      clearInterval(interval);
    };
  }, [refresh]);

  return courses;
}
