import { NextRequest } from "next/server";
import { searchDuckDuckGo, formatSearchContext } from "@/lib/search";

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json();
    if (!query || typeof query !== "string") {
      return Response.json({ error: "请提供搜索关键词" }, { status: 400 });
    }
    const results = await searchDuckDuckGo(query);
    const context = formatSearchContext(results);
    return Response.json({ results, context, hasResults: results.length > 0 });
  } catch (error) {
    return Response.json({ error: String(error) }, { status: 500 });
  }
}
