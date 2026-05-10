export interface Progress {
  chapterId: string;
  completed: boolean;
  score: number;
  lastAccessed: string;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

const PROGRESS_KEY = "ai-learning-progress";
const CHAT_HISTORY_PREFIX = "ai-learning-chat-";

export function getProgress(): Record<string, Progress> {
  if (typeof window === "undefined") return {};
  const raw = localStorage.getItem(PROGRESS_KEY);
  return raw ? JSON.parse(raw) : {};
}

export function saveProgress(chapterId: string, data: Partial<Progress>): void {
  if (typeof window === "undefined") return;
  const all = getProgress();
  all[chapterId] = {
    chapterId,
    completed: data.completed ?? all[chapterId]?.completed ?? false,
    score: data.score ?? all[chapterId]?.score ?? 0,
    lastAccessed: new Date().toISOString(),
  };
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(all));
}

export function getChatHistory(chapterId: string): ChatMessage[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(CHAT_HISTORY_PREFIX + chapterId);
  return raw ? JSON.parse(raw) : [];
}

export function saveChatMessage(chapterId: string, msg: ChatMessage): void {
  if (typeof window === "undefined") return;
  const history = getChatHistory(chapterId);
  history.push(msg);
  localStorage.setItem(CHAT_HISTORY_PREFIX + chapterId, JSON.stringify(history));
}

export function clearChatHistory(chapterId: string): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(CHAT_HISTORY_PREFIX + chapterId);
}

