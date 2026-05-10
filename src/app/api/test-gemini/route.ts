import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const key = process.env.GEMINI_API_KEY || "";
  if (!key) {
    return Response.json({ error: "未配置 GEMINI_API_KEY 环境变量" }, { status: 500 });
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${key}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: "Say 'Gemini API works!' in Chinese." }] }],
          generationConfig: { maxOutputTokens: 50 },
        }),
      }
    );

    if (!response.ok) {
      const err = await response.text();
      return Response.json({ error: `Gemini API 失败: ${err}` }, { status: response.status });
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "无内容";
    return Response.json({ success: true, reply: text, model: data.modelVersion || "gemini-2.5-flash" });
  } catch (error) {
    return Response.json({ error: String(error) }, { status: 500 });
  }
}
