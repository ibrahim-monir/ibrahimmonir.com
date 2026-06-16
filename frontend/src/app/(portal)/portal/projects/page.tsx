'use client';
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { FolderOpen, ArrowRight, Clock } from "lucide-react";
import api from "@/lib/api";

interface Project {
  id: number;
  title: string;
  description: string;
  status: string;
  progress: number;
  start_date?: string;
  end_date?: string;
  service?: { title: string };
}

const statusColors: Record<string, string> = {
  pending: "#f59e0b",
  in_progress: "#f97316",
  review: "#22d3ee",
  completed: "#10b981",
  cancelled: "#6b7280",
};

export default function ProjectsPage() {
  const { data: projects = [], isLoading } = useQuery<Project[]>({
    queryKey: ["projects"],
    queryFn: () => api.get("/projects").then((r) => r.data.projects ?? []),
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-1">My Projects</h1>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>Track the progress of all your projects.</p>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card p-5 animate-pulse h-24" style={{ opacity: 0.5 }} />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="card p-16 text-center" style={{ color: "var(--text-muted)" }}>
          <FolderOpen size={48} className="mx-auto mb-4 opacity-30" />
          <p className="font-medium mb-2">No projects yet</p>
          <p className="text-sm">Your projects will appear here once they&apos;re created.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {projects.map((project) => (
            <Link key={project.id} href={`/portal/projects/${project.id}`}
              className="card p-6 hover:border-orange-500/50 transition-all block">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-semibold text-lg truncate">{project.title}</h3>
                    <span className="text-xs font-medium px-2.5 py-0.5 rounded-full shrink-0"
                      style={{ background: `${statusColors[project.status]}20`, color: statusColors[project.status] }}>
                      {project.status.replace("_", " ")}
                    </span>
                  </div>
                  <p className="text-sm line-clamp-2" style={{ color: "var(--text-muted)" }}>{project.description}</p>
                </div>
                <ArrowRight size={18} style={{ color: "var(--text-muted)" }} className="shrink-0 mt-1" />
              </div>

              <div className="flex items-center gap-6">
                <div className="flex-1">
                  <div className="flex justify-between text-xs mb-1.5" style={{ color: "var(--text-muted)" }}>
                    <span>Progress</span>
                    <span className="font-medium">{project.progress}%</span>
                  </div>
                  <div className="h-2 rounded-full" style={{ background: "var(--bg-muted)" }}>
                    <div className="h-full rounded-full transition-all"
                      style={{ width: `${project.progress}%`, background: statusColors[project.status] ?? "var(--primary)" }} />
                  </div>
                </div>
                {project.service && (
                  <div className="text-xs px-2.5 py-1 rounded-md shrink-0"
                    style={{ background: "var(--bg-muted)", color: "var(--text-muted)" }}>
                    {project.service.title}
                  </div>
                )}
                {project.end_date && (
                  <div className="flex items-center gap-1.5 text-xs shrink-0" style={{ color: "var(--text-muted)" }}>
                    <Clock size={13} /> Due {project.end_date}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
