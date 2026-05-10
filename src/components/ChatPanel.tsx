"use client";

import { useState, useEffect } from "react";
import type { ChatMessage, ChatSession } from "@/types";
import { cloudSetSessions, cloudDeleteSessions } from "@/lib/data-client";
import ChatHeader from "./chat/ChatHeader";
import SessionList from "./chat/SessionList";
import ChatMessages from "./chat/ChatMessages";
import ChatInput from "./chat/ChatInput";

interface ChatPanelProps {
  chapterId: string;
  chapterTitle: string;
  courseTitle: string;
  modelId: string;
  onModelChange: (modelId: string) => void;
}

function sessionTitle(msgs: ChatMessage[]): string {
  const first = msgs.find((m) => m.role === "user");
  if (!first) return "新对话";
  return first.content.slice(0, 30) + (first.content.length > 30 ? "..." : "");
}

function sessionStorageKey(chapterId: string): string {
  return `ai-learning-sessions-${chapterId}`;
}

function loadSessions(chapterId: string): ChatSession[] {
  try {
    const raw = localStorage.getItem(sessionStorageKey(chapterId));
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return [];
}

export default function ChatPanel({ chapterId, chapterTitle, courseTitle, modelId, onModelChange }: ChatPanelProps) {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchEnabled, setSearchEnabled] = useState(false);
  const [showSessionList, setShowSessionList] = useState(false);

  useEffect(() => {
    const list = loadSessions(chapterId);
    setSessions(list);
    if (list.length > 0) setActiveSessionId(list[0].id);
  }, [chapterId]);

  const activeSession = sessions.find((s) => s.id === activeSessionId) || null;

  const saveSessions = (list: ChatSession[]) => {
    setSessions(list);
    localStorage.setItem(sessionStorageKey(chapterId), JSON.stringify(list));
    cloudSetSessions(chapterId, list);
  };

  const newSession = () => {
    const s: ChatSession = {
      id: Date.now().toString(36),
      chapterId,
      title: "新对话",
      messages: [],
      modelId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const list = [s, ...sessions];
    saveSessions(list);
    setActiveSessionId(s.id);
    setShowSessionList(false);
  };

  const deleteSession = (id: string) => {
    const list = sessions.filter((s) => s.id !== id);
    saveSessions(list);
    if (list.length === 0) cloudDeleteSessions(chapterId);
    if (activeSessionId === id) {
      setActiveSessionId(list.length > 0 ? list[0].id : null);
    }
  };

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;

    let list = sessions;
    let sid = activeSessionId;
    if (!sid) {
      const s: ChatSession = {
        id: Date.now().toString(36),
        chapterId,
        title: "新对话",
        messages: [],
        modelId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      list = [s, ...list];
      sid = s.id;
      setActiveSessionId(sid);
    }

    const userMsg: ChatMessage = { role: "user", content: text, timestamp: new Date().toISOString() };
    const updated = list.map((s) => {
      if (s.id !== sid) return s;
      const msgs = [...s.messages, userMsg];
      return { ...s, messages: msgs, title: sessionTitle(msgs), updatedAt: new Date().toISOString() };
    });
    saveSessions(updated);
    setInput("");
    setLoading(true);

    try {
      const currentMsgs = updated.find((s) => s.id === sid)?.messages || [];
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: currentMsgs.map((m) => ({ role: m.role, content: m.content })),
          chapterContext: `${courseTitle} - ${chapterTitle}`,
          modelId,
          searchEnabled,
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      const aiMsg: ChatMessage = { role: "assistant", content: data.content, timestamp: new Date().toISOString() };
      const final = updated.map((s) => {
        if (s.id !== sid) return s;
        const msgs = [...s.messages, aiMsg];
        return { ...s, messages: msgs, title: sessionTitle(msgs), updatedAt: new Date().toISOString() };
      });
      saveSessions(final);
    } catch (err) {
      const errMsg: ChatMessage = { role: "assistant", content: `出错了: ${String(err)}`, timestamp: new Date().toISOString() };
      const final = updated.map((s) => {
        if (s.id !== sid) return s;
        return { ...s, messages: [...s.messages, errMsg], updatedAt: new Date().toISOString() };
      });
      saveSessions(final);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full border-t border-[#27272a] bg-[#0f0f13]">
      <ChatHeader
        activeSession={activeSession}
        sessions={sessions}
        showSessionList={showSessionList}
        onToggleSessionList={() => setShowSessionList(!showSessionList)}
        searchEnabled={searchEnabled}
        onSearchChange={setSearchEnabled}
        modelId={modelId}
        onModelChange={onModelChange}
        onNewSession={newSession}
      />

      {showSessionList && (
        <SessionList
          sessions={sessions}
          activeSessionId={activeSessionId}
          onSelect={(id) => { setActiveSessionId(id); setShowSessionList(false); }}
          onDelete={deleteSession}
        />
      )}

      <ChatMessages messages={activeSession?.messages || []} loading={loading} />

      <ChatInput
        value={input}
        onChange={setInput}
        onSend={send}
        loading={loading}
        searchEnabled={searchEnabled}
      />
    </div>
  );
}
