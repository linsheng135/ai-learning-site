"use client";

import ThemeSwitcher from "@/components/ThemeSwitcher";

export default function AppearancePage() {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-xl font-semibold text-zinc-200 mb-6">外观设置</h1>
      <ThemeSwitcher />
    </div>
  );
}
