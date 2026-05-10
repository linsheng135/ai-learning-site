import { NextRequest, NextResponse } from "next/server";
import {
  kvGetCourses, kvSetCourses,
  kvGetProgress, kvSetProgress,
  kvGetSessions, kvSetSessions, kvDeleteSessions,
  kvGetSettings, kvSetSettings,
  kvGetCards, kvSetCards,
  kvGetPrompts, kvSetPrompts,
  kvGetSummaries, kvSetSummaries,
  kvGetMindmap, kvSetMindmap,
  kvGetDoc, kvSetDoc,
} from "@/lib/kv";

// 统一数据API：POST /api/data
// body: { scope, action, data?, key? }
export async function POST(request: NextRequest) {
  try {
    const { scope, action, data, key } = await request.json();

    switch (scope) {
      case "courses": {
        if (action === "get") return NextResponse.json({ data: await kvGetCourses() });
        if (action === "set") { await kvSetCourses(data); return NextResponse.json({ ok: true }); }
        break;
      }
      case "progress": {
        if (action === "get") return NextResponse.json({ data: await kvGetProgress() });
        if (action === "set") { await kvSetProgress(data); return NextResponse.json({ ok: true }); }
        break;
      }
      case "sessions": {
        if (action === "get") return NextResponse.json({ data: await kvGetSessions(key || "") });
        if (action === "set") { await kvSetSessions(key || "", data); return NextResponse.json({ ok: true }); }
        if (action === "delete") { await kvDeleteSessions(key || ""); return NextResponse.json({ ok: true }); }
        break;
      }
      case "settings": {
        if (action === "get") return NextResponse.json({ data: await kvGetSettings() });
        if (action === "set") { await kvSetSettings(data); return NextResponse.json({ ok: true }); }
        break;
      }
      case "cards": {
        if (action === "get") return NextResponse.json({ data: await kvGetCards() });
        if (action === "set") { await kvSetCards(data); return NextResponse.json({ ok: true }); }
        break;
      }
      case "prompts": {
        if (action === "get") return NextResponse.json({ data: await kvGetPrompts() });
        if (action === "set") { await kvSetPrompts(data); return NextResponse.json({ ok: true }); }
        break;
      }
      case "summaries": {
        if (action === "get") return NextResponse.json({ data: await kvGetSummaries() });
        if (action === "set") { await kvSetSummaries(data); return NextResponse.json({ ok: true }); }
        break;
      }
      case "mindmap": {
        if (action === "get") return NextResponse.json({ data: await kvGetMindmap(key || "") });
        if (action === "set") { await kvSetMindmap(key || "", data); return NextResponse.json({ ok: true }); }
        break;
      }
      case "doc": {
        if (action === "get") return NextResponse.json({ data: await kvGetDoc(key || "") });
        if (action === "set") { await kvSetDoc(key || "", data); return NextResponse.json({ ok: true }); }
        break;
      }
    }

    return NextResponse.json({ error: "未知 scope/action" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
