import { NextRequest } from "next/server";

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY || "";
const DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions";

export async function POST(request: NextRequest) {
  try {
    const { chapterTitle, chapterDescription, courseTitle, difficulty = "beginner" } = await request.json();

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

    const response = await fetch(DEEPSEEK_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: "你是一位优秀的编程教师，擅长用简单语言解释复杂概念。" },
          { role: "user", content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 4096,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      return Response.json({ error: `文档生成失败: ${err}` }, { status: response.status });
    }

    const data = await response.json();
    return Response.json({ content: data.choices[0].message.content });
  } catch (error) {
    return Response.json({ error: `服务器错误: ${String(error)}` }, { status: 500 });
  }
}
