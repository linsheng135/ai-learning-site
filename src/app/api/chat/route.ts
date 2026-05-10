import { NextRequest } from "next/server";
import { callModel } from "@/lib/models";

export async function POST(request: NextRequest) {
  try {
    const { messages, chapterContext, modelId = "gemini-flash" } = await request.json();

    const systemPrompt = `你是一位专业且耐心的编程和AI导师。你的学生正在学习：${chapterContext || "编程与AI知识"}。

教学风格：
- 用通俗易懂的语言解释复杂概念，多用类比
- 鼓励学生思考，适时提问引导
- 根据学生的回答判断理解程度，动态调整讲解深度
- 回复使用 Markdown 格式，合理使用标题、列表、代码块
- 代码示例尽量简洁，加上注释说明
- 每段回复不要太长，聚焦一个知识点
- 结尾可以提一个小问题检验理解`;

    const content = await callModel({ modelId, messages, systemPrompt });
    return Response.json({ content, modelUsed: modelId });
  } catch (error) {
    return Response.json({ error: `服务器错误: ${String(error)}` }, { status: 500 });
  }
}
