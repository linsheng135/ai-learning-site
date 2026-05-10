import { NextRequest } from "next/server";
import { callModel } from "@/lib/models";
import { getPrompt, fillTemplate } from "@/lib/prompts";

export async function POST(request: NextRequest) {
  try {
    const {
      chapterTitle,
      chapterDescription,
      courseTitle,
      difficulty = "beginner",
      modelId = "deepseek-v4-flash",
    } = await request.json();

    const promptCfg = getPrompt("generate-doc");
    const prompt = fillTemplate(promptCfg?.userPromptTemplate || "", {
      courseTitle: courseTitle || "",
      chapterTitle: chapterTitle || "",
      chapterDescription: chapterDescription || "",
      difficulty: difficulty || "beginner",
    });

    const content = await callModel({
      modelId,
      messages: [{ role: "user", content: prompt }],
      systemPrompt: promptCfg?.systemPrompt || "",
    });

    return Response.json({ content, modelUsed: modelId });
  } catch (error) {
    return Response.json({ error: `服务器错误: ${String(error)}` }, { status: 500 });
  }
}
