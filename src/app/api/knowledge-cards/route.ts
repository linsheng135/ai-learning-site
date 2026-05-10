import { NextRequest } from "next/server";
import { callModel } from "@/lib/models";
import { getPrompt, fillTemplate } from "@/lib/prompts";

export async function POST(request: NextRequest) {
  try {
    const { content, modelId = "deepseek-v4-flash" } = await request.json();

    const promptCfg = getPrompt("knowledge-cards");
    const prompt = fillTemplate(promptCfg?.userPromptTemplate || "", {
      content: content || "",
    });

    const result = await callModel({
      modelId,
      messages: [{ role: "user", content: prompt }],
      systemPrompt: promptCfg?.systemPrompt || "",
    });

    const jsonMatch = result.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      return Response.json({ cards: JSON.parse(jsonMatch[0]), modelUsed: modelId });
    }
    return Response.json({ raw: result, modelUsed: modelId });
  } catch (error) {
    return Response.json({ error: String(error) }, { status: 500 });
  }
}
