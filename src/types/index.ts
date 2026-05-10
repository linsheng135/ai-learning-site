// 课程 & 章节
export interface Chapter {
  id: string;
  title: string;
  description: string;
  order: number;
  generatedDoc?: string;
  knowledgeCards?: string[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  domain: string;
  icon: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  chapters: Chapter[];
  createdAt: string;
  updatedAt: string;
}

// 聊天
export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface ChatSession {
  id: string;
  chapterId: string;
  title: string;
  messages: ChatMessage[];
  modelId: string;
  createdAt: string;
  updatedAt: string;
}

// 知识卡片
export interface KnowledgeCard {
  id: string;
  title: string;
  summary: string;
  details: string;
  tags: string[];
  relatedCardIds: string[];
  sourceChapterId: string;
  sourceCourseId: string;
  createdAt: string;
  // SM-2 参数
  easeFactor: number;
  interval: number;
  repetitions: number;
  nextReview: string;
  lastReviewQuality: number;
}

// 测验
export interface QuizQuestion {
  id: string;
  type: "single" | "multiple" | "truefalse" | "fill" | "short";
  question: string;
  options?: string[];
  correctAnswer?: string | string[];
  explanation: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  domain: string;
  sourceChapterId: string;
}

export interface QuizResult {
  questionId: string;
  userAnswer: string | string[];
  correct: boolean;
  score: number;
  feedback?: string;
}

// 提示词
export interface PromptConfig {
  id: string;
  scenario: string;
  label: string;
  systemPrompt: string;
  userPromptTemplate: string;
  temperature: number;
  maxTokens: number;
  modelId: string;
  updatedAt: string;
}

// 设置
export interface UserSettings {
  theme: string;
  fontSize: "small" | "medium" | "large";
  preferredModel: string;
  searchEnabled: boolean;
}

// 学习进度
export interface ChapterProgress {
  completed: boolean;
  quizResults?: QuizResult[];
  lastStudied?: string;
  timeSpent?: number;
}

export interface KnowledgeProfile {
  domainId: string;
  masteryLevel: number;
  strengths: string[];
  weaknesses: string[];
  lastTested: string;
}

// 月度总结
export interface MonthlySummary {
  id: string;
  year: number;
  month: number;
  content: string;
  chaptersCompleted: number;
  quizzesTaken: number;
  avgQuizScore: number;
  totalMessages: number;
  createdAt: string;
}
