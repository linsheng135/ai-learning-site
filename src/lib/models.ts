export interface ModelConfig {
  id: string;
  name: string;
  provider: "deepseek" | "gemini";
  description: string;
}

export const models: ModelConfig[] = [
  { id: "gemini-flash", name: "Gemini 2.5 Flash", provider: "gemini", description: "免费，快速，Google 提供" },
  { id: "deepseek-chat", name: "DeepSeek Chat", provider: "deepseek", description: "国内直连，稳定可靠" },
];

export function getModelConfig(modelId?: string): ModelConfig {
  return models.find((m) => m.id === modelId) || models[0];
}

interface ChatParams {
  modelId: string;
  messages: { role: string; content: string }[];
  systemPrompt: string;
}

export async function callModel(params: ChatParams): Promise<string> {
  const config = getModelConfig(params.modelId);
  if (config.provider === "gemini") return callGemini(params);
  return callDeepSeek(params);
}

async function callDeepSeek(params: ChatParams): Promise<string> {
  const key = process.env.DEEPSEEK_API_KEY || "";
  const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages: [
        { role: "system", content: params.systemPrompt },
        ...params.messages,
      ],
      temperature: 0.7,
      max_tokens: 4096,
    }),
  });
  if (!response.ok) {
    const err = await response.text();
    throw new Error(`DeepSeek 调用失败: ${err}`);
  }
  const data = await response.json();
  return data.choices[0].message.content;
}

async function callGemini(params: ChatParams): Promise<string> {
  const key = process.env.GEMINI_API_KEY || "";
  const systemPart = params.systemPrompt
    ? [{ role: "user", parts: [{ text: params.systemPrompt }] }, { role: "model", parts: [{ text: "明白，我会按照以上要求回复。" }] }]
    : [];

  const contents = [
    ...systemPart,
    ...params.messages.map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    })),
  ];

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${key}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents,
        generationConfig: { temperature: 0.7, maxOutputTokens: 4096 },
      }),
    }
  );
  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Gemini 调用失败: ${err}`);
  }
  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || "（Gemini 未返回内容）";
}
