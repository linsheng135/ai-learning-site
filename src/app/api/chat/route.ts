import { NextRequest } from "next/server";
import { callModel } from "@/lib/models";
import { getPrompt } from "@/lib/prompts";
import { searchDuckDuckGo, formatSearchContext } from "@/lib/search";

export async function POST(request: NextRequest) {
  try {
    const { messages, chapterContext, modelId = "deepseek-chat", searchEnabled } = await request.json();

    const promptCfg = getPrompt("chat");
    let systemPrompt = promptCfg?.systemPrompt ?? "你是一位专业且耐心的 AI 导师。";
    systemPrompt += `\n\n当前学习上下文：${chapterContext || "编程与AI知识"}`;

    // 联网搜索：取最后一条用户消息搜索
    if (searchEnabled) {
      const lastUserMsg = [...messages].reverse().find((m: { role: string }) => m.role === "user");
      if (lastUserMsg) {
        const results = await searchDuckDuckGo(lastUserMsg.content);
        if (results.length > 0) {
          systemPrompt += `\n\n以下是从网络搜索到的相关信息，请参考这些信息回答问题：\n${formatSearchContext(results)}`;
        }
      }
    }

    const content = await callModel({ modelId, messages, systemPrompt });
    return Response.json({ content, modelUsed: modelId });
  } catch (error) {
    return Response.json({ error: `服务器错误: ${String(error)}` }, { status: 500 });
  }
}
