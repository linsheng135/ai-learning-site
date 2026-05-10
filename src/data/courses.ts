export interface Chapter {
  id: string;
  title: string;
  description: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  icon: string;
  chapters: Chapter[];
}

export const courses: Course[] = [
  {
    id: "programming-basics",
    title: "编程基础",
    description: "从零开始学习编程的核心概念，建立扎实的编程思维",
    icon: "💻",
    chapters: [
      { id: "what-is-programming", title: "什么是编程", description: "理解编程的本质：人与计算机的对话" },
      { id: "variables-and-types", title: "变量与数据类型", description: "数据的容器：数字、字符串、布尔值" },
      { id: "conditionals", title: "条件判断", description: "if/else：让程序做决策" },
      { id: "loops", title: "循环", description: "重复执行的艺术：for 和 while" },
      { id: "functions", title: "函数", description: "封装与复用：代码的积木块" },
      { id: "data-structures", title: "数据结构入门", description: "数组、对象：组织数据的工具箱" },
      { id: "oop-basics", title: "面向对象基础", description: "类与对象：模拟现实世界" },
      { id: "git-basics", title: "版本控制 Git", description: "代码的时间机器：提交、分支、协作" },
    ],
  },
  {
    id: "ai-knowledge",
    title: "AI 知识",
    description: "系统了解人工智能的核心概念与发展脉络",
    icon: "🤖",
    chapters: [
      { id: "what-is-ai", title: "AI 是什么", description: "人工智能的定义、历史与分类" },
      { id: "machine-learning", title: "机器学习基础", description: "监督学习、无监督学习、强化学习" },
      { id: "deep-learning", title: "深度学习入门", description: "神经网络、反向传播、梯度下降" },
      { id: "llm", title: "大语言模型", description: "Transformer、GPT、预训练与微调" },
      { id: "prompt-engineering", title: "Prompt 工程", description: "如何高效与 AI 沟通：提示词技巧" },
      { id: "ai-applications", title: "AI 应用开发", description: "API 调用、RAG、Embedding 实战" },
    ],
  },
  {
    id: "agent-dev",
    title: "AI Agent 开发",
    description: "掌握 AI Agent 的核心原理与实践开发",
    icon: "⚡",
    chapters: [
      { id: "agent-concept", title: "Agent 概念与架构", description: "感知-规划-执行：Agent 的核心循环" },
      { id: "tool-use", title: "工具调用 Tool Use", description: "让 AI 使用外部工具：Function Calling" },
      { id: "memory-management", title: "记忆与上下文管理", description: "短期记忆、长期记忆、向量数据库" },
      { id: "multi-agent", title: "多 Agent 协作", description: "Agent 间的通信、任务分配与协作模式" },
      { id: "agent-frameworks", title: "Agent 框架", description: "LangChain、CrewAI、Claude Agent SDK" },
      { id: "build-agent", title: "实战：构建自己的 Agent", description: "从零实现一个可用的 AI Agent" },
    ],
  },
];

export function findChapter(chapterId: string): { course: Course; chapter: Chapter } | null {
  for (const course of courses) {
    const chapter = course.chapters.find((c) => c.id === chapterId);
    if (chapter) return { course, chapter };
  }
  return null;
}
