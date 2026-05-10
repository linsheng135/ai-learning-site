// 客户端数据层：优先云端API，fallback到localStorage
// 写操作同时写云端和本地

async function apiData(scope: string, action: string, data?: any, key?: string) {
  try {
    const res = await fetch("/api/data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ scope, action, data, key }),
    });
    const json = await res.json();
    if (json.error) throw new Error(json.error);
    return json;
  } catch {
    return null;
  }
}

// 课程
export async function cloudGetCourses() {
  const r = await apiData("courses", "get");
  return r?.data || null;
}

export async function cloudSetCourses(courses: any[]) {
  localStorage.setItem("ai-learning-custom-courses", JSON.stringify(courses));
  await apiData("courses", "set", courses);
}

// 进度
export async function cloudGetProgress() {
  const r = await apiData("progress", "get");
  return r?.data || {};
}

export async function cloudSetProgress(progress: Record<string, any>) {
  localStorage.setItem("ai-learning-progress", JSON.stringify(progress));
  await apiData("progress", "set", progress);
}

// 对话会话
export async function cloudGetSessions(chapterId: string) {
  const r = await apiData("sessions", "get", null, chapterId);
  return r?.data || [];
}

export async function cloudSetSessions(chapterId: string, sessions: any[]) {
  localStorage.setItem(`ai-learning-sessions-${chapterId}`, JSON.stringify(sessions));
  await apiData("sessions", "set", sessions, chapterId);
}

export async function cloudDeleteSessions(chapterId: string) {
  localStorage.removeItem(`ai-learning-sessions-${chapterId}`);
  await apiData("sessions", "delete", null, chapterId);
}

// 设置
export async function cloudGetSettings() {
  const r = await apiData("settings", "get");
  return r?.data || {};
}

export async function cloudSetSettings(settings: any) {
  localStorage.setItem("ai-learning-settings", JSON.stringify(settings));
  await apiData("settings", "set", settings);
}

// 知识卡片
export async function cloudGetCards() {
  const r = await apiData("cards", "get");
  return r?.data || [];
}

export async function cloudSetCards(cards: any[]) {
  localStorage.setItem("ai-learning-knowledge-cards", JSON.stringify(cards));
  await apiData("cards", "set", cards);
}

// 提示词
export async function cloudGetPrompts() {
  const r = await apiData("prompts", "get");
  return r?.data || [];
}

export async function cloudSetPrompts(prompts: any[]) {
  localStorage.setItem("ai-learning-prompts", JSON.stringify(prompts));
  await apiData("prompts", "set", prompts);
}

// 月度总结
export async function cloudGetSummaries() {
  const r = await apiData("summaries", "get");
  return r?.data || [];
}

export async function cloudSetSummaries(summaries: any[]) {
  localStorage.setItem("ai-learning-summaries", JSON.stringify(summaries));
  await apiData("summaries", "set", summaries);
}

// 思维导图
export async function cloudGetMindmap(chapterId: string) {
  const r = await apiData("mindmap", "get", null, chapterId);
  return r?.data || null;
}

export async function cloudSetMindmap(chapterId: string, content: string) {
  localStorage.setItem(`ai-mindmap-${chapterId}`, content);
  await apiData("mindmap", "set", content, chapterId);
}

// 文档
export async function cloudGetDoc(chapterId: string) {
  const r = await apiData("doc", "get", null, chapterId);
  return r?.data || null;
}

export async function cloudSetDoc(chapterId: string, content: string) {
  localStorage.setItem(`ai-doc-${chapterId}`, content);
  await apiData("doc", "set", content, chapterId);
}
