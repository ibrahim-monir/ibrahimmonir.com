'use client';
import { use, useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { ArrowLeft, Send } from "lucide-react";
import api from "@/lib/api";
import { useAuthStore } from "@/store/authStore";

interface Message {
  id: number;
  body: string;
  created_at: string;
  is_read: boolean;
  user: { id: number; name: string };
}

interface Project {
  id: number;
  title: string;
}

export default function MessagesPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = use(params);
  const { user } = useAuthStore();
  const qc = useQueryClient();
  const [text, setText] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const { data: project } = useQuery<Project>({
    queryKey: ["project-meta", projectId],
    queryFn: () => api.get(`/projects/${projectId}`).then((r) => r.data.project ?? r.data),
  });

  const { data: messages = [] } = useQuery<Message[]>({
    queryKey: ["messages", projectId],
    queryFn: () => api.get(`/projects/${projectId}/messages`).then((r) => r.data.messages ?? []),
    refetchInterval: 4000,
  });

  const sendMutation = useMutation({
    mutationFn: (body: string) =>
      api.post(`/projects/${projectId}/messages`, { body }).then((r) => r.data.message),
    onSuccess: (newMsg) => {
      qc.setQueryData<Message[]>(["messages", projectId], (old = []) => [...old, newMsg]);
      setText("");
    },
  });

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!text.trim()) return;
    sendMutation.mutate(text.trim());
  };

  const formatTime = (dt: string) =>
    new Date(dt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const formatDate = (dt: string) =>
    new Date(dt).toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" });

  let lastDate = "";

  return (
    <div className="max-w-3xl mx-auto flex flex-col" style={{ height: "calc(100vh - 8rem)" }}>
      {/* Header */}
      <div className="flex items-center gap-4 mb-4 shrink-0">
        <Link href="/portal/messages"
          className="p-2 rounded-lg transition-colors hover:bg-white/10"
          style={{ color: "var(--text-muted)" }}>
          <ArrowLeft size={18} />
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="font-bold text-lg truncate">{project?.title ?? "Loading..."}</h1>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>Messages with admin · refreshes every 4s</p>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto rounded-xl p-4 space-y-3 mb-4"
        style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-sm" style={{ color: "var(--text-muted)" }}>
            No messages yet — start the conversation!
          </div>
        ) : (
          messages.map((msg) => {
            const isOwn = msg.user.id === user?.id;
            const msgDate = formatDate(msg.created_at);
            const showDate = msgDate !== lastDate;
            lastDate = msgDate;

            return (
              <div key={msg.id}>
                {showDate && (
                  <div className="flex items-center gap-3 py-2">
                    <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
                    <span className="text-xs px-2 shrink-0" style={{ color: "var(--text-muted)" }}>{msgDate}</span>
                    <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
                  </div>
                )}
                <div className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[75%] flex flex-col gap-1 ${isOwn ? "items-end" : "items-start"}`}>
                    {!isOwn && (
                      <span className="text-xs font-semibold px-1" style={{ color: "var(--primary)" }}>
                        {msg.user.name}
                      </span>
                    )}
                    <div className="px-4 py-2.5 rounded-2xl text-sm leading-relaxed"
                      style={isOwn
                        ? { background: "var(--primary)", color: "#fff", borderBottomRightRadius: "4px" }
                        : { background: "var(--bg-muted)", color: "var(--text)", borderBottomLeftRadius: "4px" }}>
                      {msg.body}
                    </div>
                    <span className="text-xs px-1" style={{ color: "var(--text-muted)" }}>
                      {formatTime(msg.created_at)}
                      {isOwn && msg.is_read && <span className="ml-1.5" style={{ color: "var(--primary)" }}>✓✓</span>}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="flex gap-3 shrink-0">
        <input
          type="text" value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 px-4 py-3 rounded-xl text-sm outline-none"
          style={{ background: "var(--bg-card)", border: "1px solid var(--border)", color: "var(--text)" }}
        />
        <button
          type="submit"
          disabled={sendMutation.isPending || !text.trim()}
          className="px-5 py-3 rounded-xl flex items-center gap-2 text-sm font-medium transition-all disabled:opacity-40"
          style={{ background: "var(--primary)", color: "#fff" }}>
          <Send size={16} />
          <span className="hidden sm:inline">Send</span>
        </button>
      </form>
    </div>
  );
}
