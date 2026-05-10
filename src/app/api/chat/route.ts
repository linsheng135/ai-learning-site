import { NextRequest } from "next/server";

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY || "";
const DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages, chapterContext } = body;

    const systemPrompt = `你是一位专业且耐心的编程和AI导师。你的学生正在学习：${chapterContext || "编程与AI知识"}。

教学风格：
- 用通俗易懂的语言解释复杂概念，多用类比
- 鼓励学生思考，适时提问引导
- 根据学生的回答判断理解程度，动态调整讲解深度
- 回复使用 Markdown 格式，合理使用标题、列表、代码块
- 代码示例尽量简洁，加上注释说明
- 每段回复不要太长，聚焦一个知识点
- 结尾可以提一个小问题检验理解`;

    const response = await fetch(DEEPSEEK_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages.map((m: { role: string; content: string }) => ({
            role: m.role,
            content: m.content,
          })),
        ],
        temperature: 0.7,
        max_tokens: 4096,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      return Response.json({ error: `API 调用失败: ${err}` }, { status: response.status });
    }

    const data = await response.json();
    return Response.json({ content: data.choices[0].message.content });
  } catch (error) {
    return Response.json({ error: `服务器错误: ${String(error)}` }, { status: 500 });
  }
}
