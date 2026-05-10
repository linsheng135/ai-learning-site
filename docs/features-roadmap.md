# AI学习网站 - 功能路线图

## 当前已完成

- [x] Next.js 16 + TypeScript + Tailwind v4 项目骨架
- [x] 侧边栏课程大纲 (Sidebar.tsx)
- [x] Markdown 文档渲染 (MarkdownDoc.tsx)
- [x] AI 对话面板 (ChatPanel.tsx) — 单会话
- [x] 课程页面：生成文档 + 对话并排布局
- [x] 首页仪表盘：进度条 + 继续学习 + 最近章节
- [x] 双模型支持：Gemini 2.5 Flash (主) + DeepSeek (备)
- [x] 模型切换 UI（ChatPanel 头部按钮）
- [x] 3 门课程数据 (courses.ts)：编程基础(8章) + AI基础(6章) + AI Agent开发(6章)
- [x] localStorage 进度/聊天持久化
- [x] 暗色主题（单一主题）
- [x] Vercel 部署：https://ai-learning-site-silk.vercel.app
- [x] 所有页面 HTTP 200 已验证
- [x] Gemini API 从 Vercel 美国服务器正常工作（国内直连被墙）

## 待实现功能（按优先级排列）

### P0 — 核心功能缺失

#### 1. 联网搜索 (DuckDuckGo)
- **方案**：DuckDuckGo Instant Answer API，免费无需注册
- **API**：`https://api.duckduckgo.com/?q=xxx&format=json`
- **实现位置**：`src/lib/search.ts` + chat API 改造
- **逻辑**：用户在对话中开启搜索开关 → AI 回复前先搜 DuckDuckGo → 将搜索结果拼入 system prompt 作为上下文
- **参考**：DuckDuckGo 无频率限制但需注意 ToS

#### 2. 提示词管理系统（Web UI 编辑）
- **目标**：所有 AI 场景的 prompt 都能在网页上编辑，不用改代码
- **场景**：
  - `generate-doc`：教学文档生成 prompt
  - `chat`：AI 导师对话 system prompt
  - `quiz`：出题 prompt（未来）
  - `review`：复习 prompt（未来）
  - `summary`：月度总结 prompt（未来）
  - `mindmap`：思维导图 prompt（未来）
- **数据结构**：
  ```ts
  interface PromptConfig {
    id: string;
    scenario: string;       // 场景标识
    systemPrompt: string;
    userPromptTemplate: string; // 支持 {{变量}} 占位
    temperature: number;
    maxTokens: number;
    modelId: string;
    updatedAt: string;
  }
  ```
- **UI**：`/settings/prompts` 页面，左侧场景列表 + 右侧编辑器
- **存储**：先 localStorage，后迁 Vercel KV

#### 3. 主题切换系统
- **方案**：多套 CSS 变量主题 + 字体大小调节
- **主题列表**：
  - 暗色-经典黑（当前 `[data-theme="dark-classic"]`）
  - 暗色-深蓝 `[data-theme="dark-blue"]`
  - 暗色-墨绿 `[data-theme="dark-green"]`
  - 亮色-暖白 `[data-theme="light-warm"]`
  - 亮色-护眼纸 `[data-theme="light-paper"]`
- **字体大小**：3 档（小/中/大），通过 CSS 变量 `--font-size-base` 控制
- **UI**：`/settings/appearance` 或 Settings 面板中的主题区块
- **持久化**：localStorage，页面加载时读取

#### 4. 可扩展知识领域模型
- **现状**：`courses.ts` 硬编码 3 门课程
- **目标**：通用数据模型，用户可在 Web UI 添加/编辑课程和章节
- **数据结构**：
  ```ts
  interface Course {
    id: string;
    title: string;
    description: string;
    domain: string;        // 领域：programming, ai, cooking, ...
    icon: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    chapters: Chapter[];
    createdAt: string;
    updatedAt: string;
  }

  interface Chapter {
    id: string;
    title: string;
    description: string;
    order: number;
    // AI 生成的内容
    generatedDoc?: string;
    // 关联的知识卡片
    knowledgeCards?: string[];
  }
  ```
- **UI**：`/admin/courses` — 课程管理页
  - 添加课程：标题、描述、领域、难度、图标
  - 添加章节：在课程下添加/排序章节
  - 删除/编辑
  - 导入/导出 JSON
- **存储**：先 localStorage → 后 Vercel KV
- **兼容**：保留 courses.ts 作为默认/fallback 数据

#### 5. Vercel KV 云端存储
- **目标**：数据存云端，跨设备同步，电脑关机也能用
- **替换**：`src/lib/storage.ts` 的 localStorage 实现
- **存储内容**：
  - 用户学习进度 `user:{userId}:progress`
  - 聊天记录 `user:{userId}:chats:{chapterId}`
  - 设置偏好（主题、模型、字体）`user:{userId}:settings`
  - 自定义课程数据 `user:{userId}:courses`
  - 提示词配置 `user:{userId}:prompts`
- **成本**：Vercel KV 免费 256MB，足够个人使用
- **需引入**：`@vercel/kv` 包

---

### P1 — 重要功能

#### 6. 多对话管理
- **目标**：一个章节可以有多个独立对话（类似 ChatGPT 的多会话列表）
- **数据模型**：
  ```ts
  interface ChatSession {
    id: string;
    chapterId: string;
    title: string;          // 自动从第一条消息截取
    messages: ChatMessage[];
    modelId: string;
    createdAt: string;
    updatedAt: string;
  }
  ```
- **UI 改造**：ChatPanel 集成会话列表
  - 顶部：会话列表下拉/侧滑
  - "新建对话"按钮
  - 每个会话显示标题 + 时间 + 消息数
  - 删除/重命名会话
- **交互**：切换会话时加载对应消息历史

#### 7. 思维导图 / 知识图谱可视化
- **目标**：可视化展示章节的知识结构和关联
- **实现方案**：
  - AI 从文档生成知识节点和关系 JSON
  - 前端用轻量库渲染（推荐 `markmap` — 从 Markdown 生成思维导图，零配置）
  - 或用 `d3-force` 做知识图谱（节点+连线）
- **触发**：文档区工具栏加"思维导图"按钮
- **展示**：Modal 或全屏面板
- **备选库**：`react-flow` (流程图/节点图，更灵活)

#### 8. 知识卡片索引系统
- **目的**：替代完整 RAG，用精炼的知识卡片给 AI 提供上下文
- **卡片结构**：
  ```ts
  interface KnowledgeCard {
    id: string;
    title: string;          // 概念名
    summary: string;        // 一句话定义 (≤200字)
    details: string;        // 展开说明 (≤500字)
    tags: string[];
    relatedCardIds: string[];
    sourceChapterId: string;
  }
  ```
- **生成**：每学完一章，AI 自动提取 3-5 张知识卡片
- **使用**：聊天时根据问题匹配相关卡片，注入 system prompt
- **匹配方式**：关键词/tag 匹配即可，不需要向量数据库
- **UI**：`/knowledge` — 知识卡片网格/列表

#### 9. 自适应测验系统
- **目标**：测验题目难度根据用户表现动态调整
- **题目类型**：
  - 单选题
  - 多选题
  - 判断题
  - 填空题（AI 打分）
  - 简答题（AI 评价）
- **自适应逻辑**：
  - 连续答对 → 提升难度
  - 答错 → 降低难度，给出提示
  - IRT (项目反应理论) 简化版
- **知识画像**：
  ```ts
  interface KnowledgeProfile {
    domainId: string;
    masteryLevel: number;   // 0-1 掌握度
    strengths: string[];    // 优势领域
    weaknesses: string[];   // 薄弱领域
    lastTested: string;
  }
  ```
- **UI**：`/test/[courseId]` — 测验页面 + 结果分析

#### 10. AI 建议模式
- **目标**：AI 主动分析学习数据，给出个性化建议
- **建议类型**：
  - "你XX概念掌握不好，建议重新学习第X章"
  - "你已经连续学了3天，建议休息一下"
  - "根据你的薄弱点，推荐以下学习路径"
  - "本周你完成了X章，继续保持！"
- **生成**：定时任务或手动触发，调用 AI 分析学习数据
- **展示**：首页仪表盘的"AI 建议"卡片

#### 11. 使用指南页
- **目标**：新用户了解网站功能和操作
- **内容**：
  - 功能介绍（课程学习、AI对话、测验、思维导图等）
  - 操作说明（如何生成文档、切换模型、提问等）
  - 提示技巧（如何高效向 AI 提问）
  - 常见问题
- **UI**：`/guide` — Markdown 渲染的文档页

---

### P2 — 增强功能

#### 12. 间隔重复复习 (SM-2 算法)
- **目标**：科学的复习计划，对抗遗忘曲线
- **算法**：SuperMemo SM-2
  - 每个知识卡片有：`easeFactor`(初始2.5)、`interval`(复习间隔)、`repetitions`(复习次数)
  - 用户评价熟悉度 0-5 分
  - 自动计算下次复习日期
- **UI**：`/review` — 今日待复习卡片列表 + 评价按钮
- **提醒**：首页显示"待复习 X 张卡片"

#### 13. 月度学习总结
- **目标**：AI 每月生成学习报告
- **内容**：
  - 本月学习章节数、对话数
  - 测验成绩变化趋势
  - 知识掌握热力图
  - 下月学习建议
- **生成**：AI 分析一个月的数据，输出 Markdown 报告
- **UI**：`/summary` — 历史总结列表

#### 14. Unsplash 图片搜索
- **目标**：AI 生成文档时自动配图
- **API**：`https://api.unsplash.com/search/photos` (免费 50次/小时，无需账号)
- **实现**：在 generate-doc prompt 中要求 AI 在合适位置插入图片描述 → 解析 → 调 Unsplash API 替换为真实图片 URL
- **注意**：Unsplash 不需要 API key (demo 模式)，但有限制

#### 15. 模型偏好持久化
- **目标**：记住用户最后选择的模型，刷新不丢失
- **实现**：localStorage/Vercel KV 存 `user:{userId}:settings.preferredModel`

---

### P3 — 长远规划

#### 16. 自定义域名（国内直连）
- **现状**：`*.vercel.app` 被 GFW 封锁
- **方案**：namesilo.com 买 `.xyz` 域名 ~$1/年（≈¥7）
- **步骤**：买域名 → Vercel 控制台添加 Domain → 配置 DNS

#### 17. 多用户系统
- 简单的 Clerk/NextAuth 登录
- 数据按用户隔离
- 学习小组功能

#### 18. PWA 离线支持
- Service Worker 缓存课程内容
- 离线查看已学内容

---

## 架构规划

### 文件结构目标
```
src/
├── app/
│   ├── api/
│   │   ├── chat/route.ts           # 对话 API（改造：支持搜索上下文）
│   │   ├── generate-doc/route.ts   # 文档生成 API
│   │   ├── search/route.ts         # [NEW] 联网搜索 API
│   │   ├── quiz/route.ts           # [NEW] 出题/批改 API
│   │   ├── mindmap/route.ts        # [NEW] 思维导图生成 API
│   │   └── summary/route.ts        # [NEW] 月度总结 API
│   ├── course/[id]/[chapterId]/page.tsx
│   ├── settings/                   # [NEW] 设置页
│   │   ├── prompts/page.tsx
│   │   └── appearance/page.tsx
│   ├── admin/courses/page.tsx      # [NEW] 课程管理页
│   ├── test/[courseId]/page.tsx    # [NEW] 测验页
│   ├── knowledge/page.tsx         # [NEW] 知识卡片页
│   ├── review/page.tsx            # [NEW] 间隔复习页
│   ├── summary/page.tsx           # [NEW] 月度总结页
│   ├── guide/page.tsx             # [NEW] 使用指南页
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ChatPanel.tsx               # 改造：多会话 + Markdown
│   ├── MarkdownDoc.tsx
│   ├── Sidebar.tsx
│   ├── MindMap.tsx                # [NEW] 思维导图渲染
│   ├── KnowledgeGraph.tsx         # [NEW] 知识图谱
│   ├── ThemeSwitcher.tsx          # [NEW] 主题切换
│   ├── QuizCard.tsx               # [NEW] 测验组件
│   └── SearchToggle.tsx           # [NEW] 搜索开关
├── data/
│   └── courses.ts                  # 默认课程（保留作 fallback）
├── lib/
│   ├── models.ts                   # AI 模型调用
│   ├── storage.ts                  # → 改造为 KV 适配层
│   ├── search.ts                   # [NEW] DuckDuckGo 搜索
│   ├── sm2.ts                      # [NEW] SM-2 算法
│   └── prompts.ts                  # [NEW] 提示词管理
└── types/
    └── index.ts                    # [NEW] 公共类型定义
```

### 数据流
```
用户操作 → React 组件
           ↓
       API Route (/api/*)
           ↓
    lib/models.ts (callModel)
           ↓
    外部 API (Gemini / DeepSeek / DuckDuckGo / Unsplash)
           ↓
       返回给组件
           ↓
    持久化到 Vercel KV / localStorage
```

### 存储策略（过渡方案）
1. **当前**：全部 localStorage
2. **过渡**：核心数据（进度、设置）迁 KV，非核心（聊天、缓存）保留 localStorage
3. **目标**：全部迁 Vercel KV，localStorage 只做离线缓存层

---

## 实现顺序建议

按 P0 → P1 → P2 顺序，同一优先级内按编号。每个功能完成后 deploy 验证。

### 第一批（本次会话优先做）
1. **知识卡片索引系统**（P1-8）— 为其他功能提供上下文基础
2. **可扩展知识领域模型**（P0-4）— 数据结构基础
3. **多对话管理**（P1-6）— ChatPanel 大改造
4. **思维导图**（P1-7）— 知识可视化
5. **提示词管理系统**（P0-2）
6. **主题切换系统**（P0-3）
7. **联网搜索**（P0-1）
