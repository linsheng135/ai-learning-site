import { NextRequest } from "next/server";
import { callModel } from "@/lib/models";

export async function POST(request: NextRequest) {
  try {
    const {
      chapterTitle,
      chapterDescription,
      courseTitle,
      difficulty = "beginner",
      modelId = "gemini-flash",
    } = await request.json();

    const prompt = `请为以下学习章节生成一份详细的教学文档。

课程：${courseTitle}
章节：${chapterTitle}
章节简介：${chapterDescription}
难度等级：${difficulty}

要求：
1. 使用 Markdown 格式
2. 从最基础的概念开始讲解，循序渐进
3. 包含实际的代码示例（如果适用），用 Python 或 JavaScript
4. 使用类比帮助理解抽象概念
5. 加入2-3个思考题或小练习
6. 控制在1500字以内，分3-5个小节
7. 语言通俗易懂，面向编程初学者`;

    const content = await callModel({
      modelId,
      messages: [{ role: "user", content: prompt }],
      systemPrompt: "你是一位优秀的编程教师，擅长用简单语言解释复杂概念。",
    });

    return Response.json({ content, modelUsed: modelId });
  } catch (error) {
    return Response.json({ error: `服务器错误: ${String(error)}` }, { status: 500 });
  }
}
