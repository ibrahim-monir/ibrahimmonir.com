'use client';

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";

export type WorkItem = {
  id?: number | string;
  title: string;
  category?: string | null;
  description?: string | null;
  technologies?: string[];
  url?: string | null;
  thumbnail?: string | null;
};

const GRADIENTS = [
  "linear-gradient(135deg, #f97316 0%, #7c2d12 100%)",
  "linear-gradient(135deg, #6366f1 0%, #1e1b4b 100%)",
  "linear-gradient(135deg, #ec4899 0%, #4a044e 100%)",
  "linear-gradient(135deg, #10b981 0%, #064e3b 100%)",
  "linear-gradient(135deg, #fbbf24 0%, #78350f 100%)",
  "linear-gradient(135deg, #38bdf8 0%, #0c4a6e 100%)",
];

function initials(title: string): string {
  return title.split(" ").filter(Boolean).slice(0, 2).map((w) => w[0]?.toUpperCase() ?? "").join("");
}

export default function WorksClient({ works }: { works: WorkItem[] }) {
  const categories = useMemo(() => {
    const set = new Set<string>();
    works.forEach((w) => w.category && set.add(w.category));
    return ["All", ...Array.from(set)];
  }, [works]);

  const [active, setActive] = useState("All");
  const filtered = active === "All" ? works : works.filter((w) => w.category === active);

  return (
    <>
      {/* Filter buttons */}
      <div className="flex flex-wrap gap-2 justify-center mb-12">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setActive(c)}
            className="px-5 py-2 rounded-lg text-sm font-medium transition-all"
            style={{
              background: active === c ? "var(--primary)" : "transparent",
              color: active === c ? "#fff" : "var(--text-muted)",
              border: `1px solid ${active === c ? "var(--primary)" : "var(--border)"}`,
            }}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Works grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((w, i) => {
          const href = w.url && w.url !== "#" ? w.url : "/contact";
          const external = href.startsWith("http");
          return (
            <div key={`${w.id ?? w.title}-${i}`} className="card overflow-hidden hover:border-orange-500/50 transition-all group">
              <div className="relative h-48 overflow-hidden" style={{ background: GRADIENTS[i % GRADIENTS.length] }}>
                {w.thumbnail ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={w.thumbnail}
                    alt={w.title}
                    loading="lazy"
                    className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span style={{ fontSize: "2.6rem", fontWeight: 800, color: "rgba(255,255,255,.9)" }}>
                      {initials(w.title)}
                    </span>
                  </div>
                )}
                {w.category && (
                  <span className="badge" style={{ position: "absolute", left: 12, bottom: 12 }}>
                    {w.category}
                  </span>
                )}
              </div>
              <div className="p-6">
                <h3 className="font-bold text-lg mb-2 group-hover:text-orange-400 transition-colors">{w.title}</h3>
                {w.description && (
                  <p className="text-sm mb-4 leading-relaxed" style={{ color: "var(--text-muted)" }}>{w.description}</p>
                )}
                {!!(w.technologies && w.technologies.length) && (
                  <div className="flex flex-wrap gap-2 mb-5">
                    {w.technologies.map((t) => (
                      <span key={t} className="text-xs px-2 py-1 rounded-md" style={{ background: "rgba(249,115,22,0.1)", color: "#fb923c" }}>
                        {t}
                      </span>
                    ))}
                  </div>
                )}
                <a
                  href={href}
                  {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="flex items-center gap-2 text-sm font-medium transition-colors"
                  style={{ color: "var(--primary)" }}
                >
                  View Project <ExternalLink size={14} />
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <p className="text-center py-16" style={{ color: "var(--text-muted)" }}>
          No projects in this category yet.
        </p>
      )}

      <div className="mt-16 text-center">
        <p className="mb-4" style={{ color: "var(--text-muted)" }}>Want to see more? Let&apos;s discuss your project.</p>
        <Link href="/contact" className="btn-primary">
          Start a Project <ArrowRight size={16} />
        </Link>
      </div>
    </>
  );
}
