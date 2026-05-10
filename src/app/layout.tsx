"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import ThemeQuickSwitch from "@/components/ThemeQuickSwitch";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  useEffect(() => {
    try {
      const raw = localStorage.getItem("ai-learning-settings");
      if (raw) {
        const s = JSON.parse(raw);
        document.documentElement.setAttribute("data-theme", s.theme || "dark-classic");
        const sizes: Record<string, string> = { small: "14px", medium: "16px", large: "18px" };
        document.documentElement.style.setProperty("--font-size-base", sizes[s.fontSize] || "16px");
      }
    } catch { /* ignore */ }
  }, []);

  return (
    <html
      lang="zh-CN"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="h-full flex bg-[var(--background)] text-[var(--foreground)]">
        <Sidebar />
        <main className="flex-1 min-w-0 flex flex-col">
          {/* 顶部导航 */}
          <nav className="shrink-0 px-4 py-2 border-b border-[var(--border)] bg-[var(--sidebar)] flex items-center gap-4">
            <Link
              href="/"
              className={`text-xs whitespace-nowrap transition-colors ${
                pathname === "/" ? "text-emerald-400" : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              首页
            </Link>
            <Link
              href="/knowledge"
              className={`text-xs whitespace-nowrap transition-colors ${
                pathname.startsWith("/knowledge") ? "text-emerald-400" : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              知识卡片
            </Link>
            <Link
              href="/review"
              className={`text-xs whitespace-nowrap transition-colors ${
                pathname.startsWith("/review") ? "text-emerald-400" : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              复习
            </Link>
            <Link
              href="/summary"
              className={`text-xs whitespace-nowrap transition-colors ${
                pathname.startsWith("/summary") ? "text-emerald-400" : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              总结
            </Link>
            <Link
              href="/guide"
              className={`text-xs whitespace-nowrap transition-colors ${
                pathname.startsWith("/guide") ? "text-emerald-400" : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              指南
            </Link>
            <div className="flex-1" />
            <Link
              href="/settings/prompts"
              className={`text-xs whitespace-nowrap transition-colors ${
                pathname.startsWith("/settings") ? "text-emerald-400" : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              设置
            </Link>
            <Link
              href="/admin/courses"
              className={`text-xs whitespace-nowrap transition-colors ${
                pathname.startsWith("/admin") ? "text-emerald-400" : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              管理
            </Link>
            <ThemeQuickSwitch />
          </nav>
          {children}
        </main>
      </body>
    </html>
  );
}
