import type { PromptConfig } from "@/types";

export const DEFAULT_PROMPTS: PromptConfig[] = [
  {
    id: "generate-doc",
    scenario: "generate-doc",
    label: "生成教学文档",
    systemPrompt: "你是一位优秀的编程教师，擅长用简单语言解释复杂概念。",
    userPromptTemplate: `请为以下学习章节生成一份详细的教学文档。

课程：{{courseTitle}}
章节：{{chapterTitle}}
章节简介：{{chapterDescription}}
难度等级：{{difficulty}}

要求：
1. 使用 Markdown 格式
2. 从最基础的概念开始讲解，循序渐进
3. 包含实际的代码示例（如果适用），用 Python 或 JavaScript
4. 使用类比帮助理解抽象概念
5. 加入2-3个思考题或小练习
6. 控制在1500字以内，分3-5个小节
7. 语言通俗易懂，面向编程初学者`,
    temperature: 0.7,
    maxTokens: 4096,
    modelId: "deepseek-v4-flash",
    updatedAt: new Date().toISOString(),
  },
  {
    id: "chat",
    scenario: "chat",
    label: "AI 导师对话",
    systemPrompt: `你是一位耐心且博学的 AI 导师。你的任务是：
1. 用通俗易懂的语言回答问题
2. 给出具体的代码示例
3. 用类比帮助理解
4. 当学生卡住时，引导他们思考而不是直接给答案
5. 回答控制简洁，关键处深入展开
6. 使用 Markdown 格式回复`,
    userPromptTemplate: "",
    temperature: 0.7,
    maxTokens: 2048,
    modelId: "deepseek-v4-flash",
    updatedAt: new Date().toISOString(),
  },
  {
    id: "quiz",
    scenario: "quiz",
    label: "生成测验题目",
    systemPrompt: "你是一位严格的编程考官，擅长设计考察理解深度的题目。",
    userPromptTemplate: `请根据以下章节内容出题。

章节标题：{{chapterTitle}}
章节内容：{{chapterContent}}

出3道题，类型分别是：1道单选题、1道判断题、1道简答题。
以 JSON 格式返回，结构如下：
[
  {"type":"single","question":"...","options":["A...","B...","C...","D..."],"correctAnswer":"A","explanation":"..."},
  {"type":"truefalse","question":"...","correctAnswer":"true","explanation":"..."},
  {"type":"short","question":"...","referenceAnswer":"...","scoringPoints":["..."]}
]`,
    temperature: 0.5,
    maxTokens: 2048,
    modelId: "deepseek-v4-flash",
    updatedAt: new Date().toISOString(),
  },
  {
    id: "mindmap",
    scenario: "mindmap",
    label: "生成思维导图",
    systemPrompt: "你擅长将复杂知识结构化，生成清晰的思维导图。",
    userPromptTemplate: `请将以下内容转化为思维导图的 Markdown 格式（嵌套无序列表）。

文档内容：
{{content}}

对话内容：
{{chatContent}}

要求：
- 综合文档和对话内容，以章节标题为根节点
- 用嵌套的 - 列表表示层级
- 最多4层嵌套
- 每个节点尽量精简（≤15字）
- 只输出列表，不要输出其他内容`,
    temperature: 0.3,
    maxTokens: 2048,
    modelId: "deepseek-v4-flash",
    updatedAt: new Date().toISOString(),
  },
  {
    id: "summary",
    scenario: "summary",
    label: "月度学习总结",
    systemPrompt: "你是一位学习顾问，擅长分析学习数据并给出建设性建议。",
    userPromptTemplate: `请根据以下学习数据生成本月学习总结。

本月完成章节数：{{chaptersCompleted}}
本月测验次数：{{quizzesTaken}}
平均测验得分：{{avgQuizScore}}
本月对话总数：{{totalMessages}}
已学章节：{{chapterTitles}}

请输出 Markdown 格式的总结报告，包含：
1. 本月学习概况
2. 成绩分析
3. 需要加强的领域
4. 下月学习建议
5. 鼓励性结语`,
    temperature: 0.6,
    maxTokens: 2048,
    modelId: "deepseek-v4-flash",
    updatedAt: new Date().toISOString(),
  },
  {
    id: "knowledge-cards",
    scenario: "knowledge-cards",
    label: "提取知识卡片",
    systemPrompt: "你擅长提炼知识的精华，将复杂内容浓缩为精炼的知识卡片。",
    userPromptTemplate: `请从以下文档中提取3-5张知识卡片。

文档内容：
{{content}}

以 JSON 格式返回：
[
  {"title":"概念名","summary":"一句话定义（≤200字）","details":"展开说明（≤500字）","tags":["标签1","标签2"]}
]`,
    temperature: 0.4,
    maxTokens: 2048,
    modelId: "deepseek-v4-flash",
    updatedAt: new Date().toISOString(),
  },
];
