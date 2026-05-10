// 索引入口 — 所有 lib 模块统一导出
export { callModel, getModelConfig, models } from "./models";
export { getPrompts, getPrompt, savePrompt, resetPrompts, fillTemplate, DEFAULT_PROMPTS } from "./prompts";
export { sm2, getDueCards } from "./sm2";
export { searchDuckDuckGo, formatSearchContext } from "./search";
export { useCourses, findChapterInCourses, loadCourses } from "./useCourses";
export { getProgress, saveProgress, getChatHistory, saveChatMessage, clearChatHistory } from "./storage";
export {
  cloudGetCourses, cloudSetCourses,
  cloudGetProgress, cloudSetProgress,
  cloudGetSessions, cloudSetSessions, cloudDeleteSessions,
  cloudGetSettings, cloudSetSettings,
  cloudGetCards, cloudSetCards,
  cloudGetPrompts, cloudSetPrompts,
  cloudGetSummaries, cloudSetSummaries,
  cloudGetMindmap, cloudSetMindmap,
  cloudGetDoc, cloudSetDoc,
} from "./data-client";
