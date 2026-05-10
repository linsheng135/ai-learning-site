export interface ModelConfig {
  id: string;
  name: string;
  provider: "deepseek";
  description: string;
}

export const models: ModelConfig[] = [
  { id: "deepseek-v4-flash", name: "DeepSeek Chat", provider: "deepseek", description: "国内直连，稳定可靠" },
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
  const key = process.env.DEEPSEEK_API_KEY;
  if (!key) throw new Error("未配置 DEEPSEEK_API_KEY 环境变量");

  const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model: "deepseek-v4-flash",
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
    throw new Error(`DeepSeek 调用失败(${response.status}): ${err}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}
