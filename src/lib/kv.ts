import { kv } from "@vercel/kv";

// 服务端统一数据层，替代 localStorage
// 需在 Vercel 控制台创建 KV 存储并绑定到此项目

const KV_PREFIX = "ai-learning:";

// 课程
export async function kvGetCourses() {
  const data = await kv.get<any[]>(`${KV_PREFIX}courses`);
  return data || null;
}

export async function kvSetCourses(courses: any[]) {
  await kv.set(`${KV_PREFIX}courses`, JSON.parse(JSON.stringify(courses)));
}

// 学习进度
export async function kvGetProgress(): Promise<Record<string, any>> {
  return (await kv.get<Record<string, any>>(`${KV_PREFIX}progress`)) || {};
}

export async function kvSetProgress(progress: Record<string, any>) {
  await kv.set(`${KV_PREFIX}progress`, JSON.parse(JSON.stringify(progress)));
}

// 对话会话 (按 chapterId)
export async function kvGetSessions(chapterId: string): Promise<any[]> {
  return (await kv.get<any[]>(`${KV_PREFIX}sessions:${chapterId}`)) || [];
}

export async function kvSetSessions(chapterId: string, sessions: any[]) {
  await kv.set(`${KV_PREFIX}sessions:${chapterId}`, JSON.parse(JSON.stringify(sessions)));
}

export async function kvDeleteSessions(chapterId: string) {
  await kv.del(`${KV_PREFIX}sessions:${chapterId}`);
}

// 用户设置 (主题/字号)
export async function kvGetSettings(): Promise<any> {
  return (await kv.get<any>(`${KV_PREFIX}settings`)) || {};
}

export async function kvSetSettings(settings: any) {
  await kv.set(`${KV_PREFIX}settings`, JSON.parse(JSON.stringify(settings)));
}

// 知识卡片
export async function kvGetCards(): Promise<any[]> {
  return (await kv.get<any[]>(`${KV_PREFIX}cards`)) || [];
}

export async function kvSetCards(cards: any[]) {
  await kv.set(`${KV_PREFIX}cards`, JSON.parse(JSON.stringify(cards)));
}

// 提示词配置
export async function kvGetPrompts(): Promise<any[]> {
  return (await kv.get<any[]>(`${KV_PREFIX}prompts`)) || [];
}

export async function kvSetPrompts(prompts: any[]) {
  await kv.set(`${KV_PREFIX}prompts`, JSON.parse(JSON.stringify(prompts)));
}

// 月度总结
export async function kvGetSummaries(): Promise<any[]> {
  return (await kv.get<any[]>(`${KV_PREFIX}summaries`)) || [];
}

export async function kvSetSummaries(summaries: any[]) {
  await kv.set(`${KV_PREFIX}summaries`, JSON.parse(JSON.stringify(summaries)));
}

// 思维导图缓存
export async function kvGetMindmap(chapterId: string): Promise<string | null> {
  return (await kv.get<string>(`${KV_PREFIX}mindmap:${chapterId}`)) || null;
}

export async function kvSetMindmap(chapterId: string, content: string) {
  await kv.set(`${KV_PREFIX}mindmap:${chapterId}`, content);
}

// 文档缓存
export async function kvGetDoc(chapterId: string): Promise<string | null> {
  return (await kv.get<string>(`${KV_PREFIX}doc:${chapterId}`)) || null;
}

export async function kvSetDoc(chapterId: string, content: string) {
  await kv.set(`${KV_PREFIX}doc:${chapterId}`, content);
}
