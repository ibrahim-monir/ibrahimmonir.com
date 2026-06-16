'use client';
import { useQuery } from "@tanstack/react-query";
import { FileDown, File, FileImage, FileText, FileCode, Download } from "lucide-react";
import api from "@/lib/api";

interface ProjectFile {
  id: number;
  name: string;
  size: number;
  mime_type: string;
  created_at: string;
  project: { id: number; title: string };
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
}

function FileIcon({ mime }: { mime: string }) {
  if (mime.startsWith("image/")) return <FileImage size={20} style={{ color: "#22d3ee" }} />;
  if (mime.includes("pdf") || mime.includes("doc")) return <FileText size={20} style={{ color: "#f59e0b" }} />;
  if (mime.includes("zip") || mime.includes("tar")) return <File size={20} style={{ color: "#f97316" }} />;
  if (mime.includes("javascript") || mime.includes("typescript") || mime.includes("php")) return <FileCode size={20} style={{ color: "#10b981" }} />;
  return <File size={20} style={{ color: "var(--text-muted)" }} />;
}

export default function FilesPage() {
  const { data: projects = [], isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: () => api.get("/projects").then((r) => r.data.projects ?? []),
  });

  const allFiles: ProjectFile[] = (projects as { id: number; title: string; files: ProjectFile[] }[]).flatMap((p) =>
    (p.files ?? []).map((f) => ({ ...f, project: { id: p.id, title: p.title } }))
  );

  const handleDownload = async (fileId: number, fileName: string) => {
    try {
      const response = await api.get(`/files/${fileId}/download`, { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      alert("Download failed. Please try again.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-1">Project Files</h1>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>Download deliverables and project assets.</p>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="card p-4 animate-pulse h-16" style={{ opacity: 0.5 }} />
          ))}
        </div>
      ) : allFiles.length === 0 ? (
        <div className="card p-16 text-center" style={{ color: "var(--text-muted)" }}>
          <FileDown size={48} className="mx-auto mb-4 opacity-30" />
          <p className="font-medium mb-2">No files available</p>
          <p className="text-sm">Files will appear here as your projects progress.</p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="px-6 py-4 border-b text-xs font-medium uppercase tracking-wide grid grid-cols-12 gap-4"
            style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}>
            <span className="col-span-5">File</span>
            <span className="col-span-3">Project</span>
            <span className="col-span-2">Size</span>
            <span className="col-span-2 text-right">Action</span>
          </div>
          {allFiles.map((file, i) => (
            <div key={file.id}
              className="grid grid-cols-12 gap-4 px-6 py-4 items-center text-sm transition-colors hover:bg-white/5"
              style={{ borderBottom: i < allFiles.length - 1 ? "1px solid var(--border)" : "none" }}>
              <div className="col-span-5 flex items-center gap-3 min-w-0">
                <FileIcon mime={file.mime_type} />
                <span className="truncate font-medium">{file.name}</span>
              </div>
              <div className="col-span-3 text-xs truncate" style={{ color: "var(--text-muted)" }}>
                {file.project.title}
              </div>
              <div className="col-span-2 text-xs" style={{ color: "var(--text-muted)" }}>
                {formatBytes(file.size)}
              </div>
              <div className="col-span-2 flex justify-end">
                <button onClick={() => handleDownload(file.id, file.name)}
                  className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-all hover:bg-orange-500/20"
                  style={{ color: "var(--primary)", border: "1px solid var(--primary)" }}>
                  <Download size={13} /> Download
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
