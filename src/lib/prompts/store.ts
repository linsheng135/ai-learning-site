import type { PromptConfig } from "@/types";
import { DEFAULT_PROMPTS } from "./templates";

const STORAGE_KEY = "ai-learning-prompts";

export function getPrompts(): PromptConfig[] {
  if (typeof window === "undefined") return DEFAULT_PROMPTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return DEFAULT_PROMPTS;
}

export function getPrompt(scenario: string): PromptConfig | undefined {
  return getPrompts().find((p) => p.scenario === scenario);
}

export function savePrompt(config: PromptConfig): void {
  const prompts = getPrompts();
  const idx = prompts.findIndex((p) => p.id === config.id);
  config.updatedAt = new Date().toISOString();
  if (idx >= 0) {
    prompts[idx] = config;
  } else {
    prompts.push(config);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(prompts));
}

export function resetPrompts(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function fillTemplate(template: string, vars: Record<string, string>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => vars[key] ?? `{{${key}}}`);
}
