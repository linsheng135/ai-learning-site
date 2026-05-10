import { NextRequest } from "next/server";
import { callModel } from "@/lib/models";
import { getPrompt, fillTemplate } from "@/lib/prompts";

export async function POST(request: NextRequest) {
  try {
    const {
      chaptersCompleted,
      quizzesTaken,
      avgQuizScore,
      totalMessages,
      chapterTitles,
      modelId = "deepseek-v4-flash",
    } = await request.json();

    const promptCfg = getPrompt("summary");
    const prompt = fillTemplate(promptCfg?.userPromptTemplate || "", {
      chaptersCompleted: String(chaptersCompleted || 0),
      quizzesTaken: String(quizzesTaken || 0),
      avgQuizScore: String(avgQuizScore || 0),
      totalMessages: String(totalMessages || 0),
      chapterTitles: chapterTitles || "无",
    });

    const content = await callModel({
      modelId,
      messages: [{ role: "user", content: prompt }],
      systemPrompt: promptCfg?.systemPrompt || "",
    });

    return Response.json({ content, modelUsed: modelId });
  } catch (error) {
    return Response.json({ error: String(error) }, { status: 500 });
  }
}
