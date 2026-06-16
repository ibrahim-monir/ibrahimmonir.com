'use client';
import { useState } from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";

export type TestimonialItem = {
  id: number;
  name: string;
  job_title: string | null;
  company: string | null;
  country: string | null;
  rating: number;
  review_text: string;
  avatar_color: string;
  initials: string;
};

function Stars({ count }: { count: number }) {
  return (
    <div style={{ display: "flex", gap: 3 }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={14} fill={i < count ? "#f97316" : "none"} stroke={i < count ? "#f97316" : "#4b5563"} />
      ))}
    </div>
  );
}

export default function Testimonials({ reviews }: { reviews: TestimonialItem[] }) {
  const [page, setPage] = useState(0);
  const perPage = 3;
  const totalPages = Math.ceil(reviews.length / perPage);
  const visible = reviews.slice(page * perPage, page * perPage + perPage);

  if (reviews.length === 0) return null;

  return (
    <section style={{ background: "var(--bg-card)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", padding: "80px 0" }}>
      <div className="container">

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <span className="badge" style={{ marginBottom: 16, display: "inline-flex" }}>Client Reviews</span>
          <h2 className="section-title" style={{ marginBottom: 12 }}>
            What Clients <span className="gradient-text">Say</span>
          </h2>
          <p className="section-subtitle" style={{ margin: "0 auto" }}>
            Real feedback from clients I&apos;ve worked with around the world.
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {visible.map((r) => (
            <div key={r.id} className="card" style={{ padding: 28, display: "flex", flexDirection: "column", gap: 20 }}>

              {/* Quote mark */}
              <div style={{ fontSize: "3rem", lineHeight: 1, color: "var(--primary)", opacity: 0.4, fontFamily: "Georgia, serif", marginBottom: -8 }}>
                &ldquo;
              </div>

              {/* Stars */}
              <Stars count={r.rating} />

              {/* Text */}
              <p style={{ fontSize: "0.9rem", lineHeight: 1.75, color: "var(--text-muted)", flex: 1 }}>
                {r.review_text}
              </p>

              {/* Reviewer */}
              <div style={{ display: "flex", alignItems: "center", gap: 12, paddingTop: 16, borderTop: "1px solid var(--border)" }}>
                <div style={{
                  width: 42, height: 42, borderRadius: "50%",
                  background: r.avatar_color + "22",
                  border: `2px solid ${r.avatar_color}44`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "0.8rem", fontWeight: 700, color: r.avatar_color,
                  flexShrink: 0,
                }}>
                  {r.initials}
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: "0.9rem", display: "flex", alignItems: "center", gap: 6 }}>
                    {r.name} {r.country && <span style={{ fontSize: "1rem" }}>{r.country}</span>}
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                    {[r.job_title, r.company].filter(Boolean).join(' · ')}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12 }}>
            <button
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={page === 0}
              className="card"
              style={{
                width: 40, height: 40, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center",
                cursor: page === 0 ? "not-allowed" : "pointer",
                opacity: page === 0 ? 0.4 : 1,
                transition: "border-color 0.2s",
              }}
            >
              <ChevronLeft size={18} />
            </button>

            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                style={{
                  width: i === page ? 28 : 8, height: 8,
                  borderRadius: 999,
                  background: i === page ? "var(--primary)" : "var(--border)",
                  border: "none", cursor: "pointer",
                  transition: "all 0.3s",
                }}
              />
            ))}

            <button
              onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
              disabled={page === totalPages - 1}
              className="card"
              style={{
                width: 40, height: 40, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center",
                cursor: page === totalPages - 1 ? "not-allowed" : "pointer",
                opacity: page === totalPages - 1 ? 0.4 : 1,
                transition: "border-color 0.2s",
              }}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}

      </div>
    </section>
  );
}
