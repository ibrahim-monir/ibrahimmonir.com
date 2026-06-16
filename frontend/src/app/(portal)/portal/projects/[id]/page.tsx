'use client';
import { use } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { ArrowLeft, FileDown, MessageSquare, Calendar, DollarSign } from "lucide-react";
import api from "@/lib/api";

interface ProjectDetail {
  id: number;
  title: string;
  description: string;
  status: string;
  progress: number;
  start_date?: string;
  end_date?: string;
  budget?: number;
  notes?: string;
  service?: { title: string };
  files: { id: number; name: string; size: number; mime_type: string }[];
  messages: { id: number; body: string; created_at: string; user: { name: string } }[];
  invoices: { id: number; invoice_number: string; amount: number; status: string }[];
}

const statusColors: Record<string, string> = {
  pending: "#f59e0b",
  in_progress: "#f97316",
  review: "#22d3ee",
  completed: "#10b981",
  cancelled: "#6b7280",
};

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
}

export default function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: project, isLoading } = useQuery<ProjectDetail>({
    queryKey: ["project", id],
    queryFn: () => api.get(`/projects/${id}`).then((r) => r.data.data ?? r.data),
  });

  if (isLoading) return (
    <div className="max-w-4xl mx-auto">
      <div className="animate-pulse space-y-4">
        <div className="h-8 w-48 rounded" style={{ background: "var(--bg-muted)" }} />
        <div className="h-48 rounded-xl" style={{ background: "var(--bg-muted)" }} />
      </div>
    </div>
  );

  if (!project) return (
    <div className="max-w-4xl mx-auto text-center py-20" style={{ color: "var(--text-muted)" }}>
      Project not found.
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link href="/portal/projects"
        className="inline-flex items-center gap-2 text-sm transition-colors"
        style={{ color: "var(--text-muted)" }}>
        <ArrowLeft size={16} /> Back to Projects
      </Link>

      {/* Header */}
      <div className="card p-6">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-2">{project.title}</h1>
            {project.service && (
              <span className="text-sm px-2.5 py-1 rounded-md" style={{ background: "var(--bg-muted)", color: "var(--text-muted)" }}>
                {project.service.title}
              </span>
            )}
          </div>
          <span className="text-sm font-medium px-3 py-1 rounded-full shrink-0"
            style={{ background: `${statusColors[project.status]}20`, color: statusColors[project.status] }}>
            {project.status.replace("_", " ")}
          </span>
        </div>

        <p className="text-sm mb-6 leading-relaxed" style={{ color: "var(--text-muted)" }}>{project.description}</p>

        <div>
          <div className="flex justify-between text-sm mb-2" style={{ color: "var(--text-muted)" }}>
            <span>Progress</span>
            <span className="font-semibold text-white">{project.progress}%</span>
          </div>
          <div className="h-3 rounded-full" style={{ background: "var(--bg-muted)" }}>
            <div className="h-full rounded-full transition-all"
              style={{ width: `${project.progress}%`, background: statusColors[project.status] ?? "var(--primary)" }} />
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 mt-6 pt-6 border-t" style={{ borderColor: "var(--border)" }}>
          {project.start_date && (
            <div className="flex items-center gap-2 text-sm">
              <Calendar size={16} style={{ color: "var(--primary)" }} />
              <div>
                <div className="text-xs mb-0.5" style={{ color: "var(--text-muted)" }}>Start Date</div>
                <div className="font-medium">{project.start_date}</div>
              </div>
            </div>
          )}
          {project.end_date && (
            <div className="flex items-center gap-2 text-sm">
              <Calendar size={16} style={{ color: "#f59e0b" }} />
              <div>
                <div className="text-xs mb-0.5" style={{ color: "var(--text-muted)" }}>Deadline</div>
                <div className="font-medium">{project.end_date}</div>
              </div>
            </div>
          )}
          {project.budget && (
            <div className="flex items-center gap-2 text-sm">
              <DollarSign size={16} style={{ color: "#10b981" }} />
              <div>
                <div className="text-xs mb-0.5" style={{ color: "var(--text-muted)" }}>Budget</div>
                <div className="font-medium">${Number(project.budget).toLocaleString()}</div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Files */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold flex items-center gap-2">
              <FileDown size={18} style={{ color: "var(--primary)" }} /> Files
            </h2>
            <Link href="/portal/files" className="text-xs" style={{ color: "var(--primary)" }}>View all</Link>
          </div>
          {project.files.length === 0 ? (
            <p className="text-sm py-4 text-center" style={{ color: "var(--text-muted)" }}>No files uploaded yet.</p>
          ) : (
            <ul className="space-y-2">
              {project.files.map((file) => (
                <li key={file.id} className="flex items-center justify-between gap-3 text-sm">
                  <span className="truncate">{file.name}</span>
                  <span className="text-xs shrink-0" style={{ color: "var(--text-muted)" }}>{formatBytes(file.size)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Messages */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold flex items-center gap-2">
              <MessageSquare size={18} style={{ color: "var(--primary)" }} /> Messages
            </h2>
            <Link href={`/portal/messages/${project.id}`} className="text-xs" style={{ color: "var(--primary)" }}>Open chat</Link>
          </div>
          {project.messages.length === 0 ? (
            <p className="text-sm py-4 text-center" style={{ color: "var(--text-muted)" }}>No messages yet.</p>
          ) : (
            <ul className="space-y-3">
              {project.messages.slice(-3).map((msg) => (
                <li key={msg.id} className="text-sm">
                  <div className="font-medium mb-0.5">{msg.user.name}</div>
                  <p className="line-clamp-2" style={{ color: "var(--text-muted)" }}>{msg.body}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Notes */}
      {project.notes && (
        <div className="card p-6">
          <h2 className="font-semibold mb-3">Notes</h2>
          <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>{project.notes}</p>
        </div>
      )}
    </div>
  );
}
