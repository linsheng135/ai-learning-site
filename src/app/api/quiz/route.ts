import { NextRequest } from "next/server";
import { callModel } from "@/lib/models";
import { getPrompt, fillTemplate } from "@/lib/prompts";

export async function POST(request: NextRequest) {
  try {
    const { chapterTitle, chapterContent, modelId = "deepseek-v4-flash" } = await request.json();

    const promptCfg = getPrompt("quiz");
    const prompt = fillTemplate(promptCfg?.userPromptTemplate || "", {
      chapterTitle: chapterTitle || "",
      chapterContent: chapterContent || "",
    });

    const content = await callModel({
      modelId,
      messages: [{ role: "user", content: prompt }],
      systemPrompt: promptCfg?.systemPrompt || "",
    });

    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      const questions = JSON.parse(jsonMatch[0]);
      return Response.json({ questions, modelUsed: modelId });
    }
    return Response.json({ raw: content, modelUsed: modelId });
  } catch (error) {
    return Response.json({ error: String(error) }, { status: 500 });
  }
}
