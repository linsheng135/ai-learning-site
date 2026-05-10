import { NextRequest } from "next/server";
import { callModel } from "@/lib/models";
import { getPrompt, fillTemplate } from "@/lib/prompts";

export async function POST(request: NextRequest) {
  try {
    const { content, chatContent, modelId = "deepseek-v4-flash" } = await request.json();

    const promptCfg = getPrompt("mindmap");
    const prompt = fillTemplate(promptCfg?.userPromptTemplate || "", {
      content: content || "",
      chatContent: chatContent || "（无对话记录）",
    });

    const result = await callModel({
      modelId,
      messages: [{ role: "user", content: prompt }],
      systemPrompt: promptCfg?.systemPrompt || "",
    });

    return Response.json({ mindmap: result, modelUsed: modelId });
  } catch (error) {
    return Response.json({ error: String(error) }, { status: 500 });
  }
}
