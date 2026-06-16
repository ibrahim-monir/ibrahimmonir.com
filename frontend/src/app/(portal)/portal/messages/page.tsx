'use client';
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { MessageSquare, ArrowRight } from "lucide-react";
import api from "@/lib/api";

interface Project {
  id: number;
  title: string;
  status: string;
  messages: { id: number; body: string; is_read: boolean; created_at: string; user: { name: string } }[];
}

export default function MessagesIndexPage() {
  const { data: projects = [], isLoading } = useQuery<Project[]>({
    queryKey: ["projects"],
    queryFn: () => api.get("/projects").then((r) => r.data.projects ?? []),
  });

  const unreadCount = (p: Project) => p.messages.filter((m) => !m.is_read).length;
  const lastMessage = (p: Project) => p.messages[p.messages.length - 1];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-1">Messages</h1>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>Communicate with your project team.</p>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => <div key={i} className="card p-5 animate-pulse h-20" style={{ opacity: 0.5 }} />)}
        </div>
      ) : projects.length === 0 ? (
        <div className="card p-16 text-center" style={{ color: "var(--text-muted)" }}>
          <MessageSquare size={48} className="mx-auto mb-4 opacity-30" />
          <p className="font-medium mb-2">No projects yet</p>
          <p className="text-sm">Messages are tied to projects. Create a project to start chatting.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {projects.map((project) => {
            const last = lastMessage(project);
            const unread = unreadCount(project);
            return (
              <Link key={project.id} href={`/portal/messages/${project.id}`}
                className="card p-5 flex items-center gap-4 hover:border-orange-500/50 transition-all">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: unread > 0 ? "rgba(249,115,22,0.2)" : "var(--bg-muted)" }}>
                  <MessageSquare size={20} style={{ color: unread > 0 ? "var(--primary)" : "var(--text-muted)" }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-semibold truncate">{project.title}</span>
                    {unread > 0 && (
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full shrink-0"
                        style={{ background: "var(--primary)", color: "#fff" }}>
                        {unread}
                      </span>
                    )}
                  </div>
                  {last ? (
                    <p className="text-sm truncate" style={{ color: "var(--text-muted)" }}>
                      <span className="font-medium">{last.user.name}:</span> {last.body}
                    </p>
                  ) : (
                    <p className="text-sm" style={{ color: "var(--text-muted)" }}>No messages yet — start the conversation</p>
                  )}
                </div>
                <ArrowRight size={18} className="shrink-0" style={{ color: "var(--text-muted)" }} />
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
