'use client';
import { Star, Quote } from "lucide-react";

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

function Stars({ count, size = 14 }: { count: number; size?: number }) {
  return (
    <div style={{ display: "flex", gap: 3 }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={size} fill={i < count ? "#f97316" : "none"} stroke={i < count ? "#f97316" : "#4b5563"} />
      ))}
    </div>
  );
}

function ReviewCard({ r }: { r: TestimonialItem }) {
  return (
    <div
      className="group t-card"
      style={{
        position: "relative",
        flexShrink: 0,
        width: 360,
        maxWidth: "82vw",
        display: "flex",
        flexDirection: "column",
        gap: 16,
        padding: 28,
        borderRadius: 18,
        background: "var(--bg-muted)",
        border: "1px solid var(--border)",
        overflow: "hidden",
        transition: "border-color 0.25s, transform 0.25s",
        // @ts-expect-error CSS custom property
        "--avt": r.avatar_color,
      }}
    >
      {/* Soft corner glow */}
      <div
        className="pointer-events-none absolute -top-12 -right-12 w-36 h-36 rounded-full blur-3xl opacity-0 group-hover:opacity-25 transition-opacity duration-500"
        style={{ background: r.avatar_color }}
      />

      {/* Quote icon */}
      <Quote size={30} style={{ color: r.avatar_color, opacity: 0.35 }} fill="currentColor" />

      {/* Stars */}
      <Stars count={r.rating} />

      {/* Text */}
      <p style={{ fontSize: "0.92rem", lineHeight: 1.7, color: "var(--text)", flex: 1, position: "relative" }}>
        {r.review_text}
      </p>

      {/* Reviewer */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, paddingTop: 16, borderTop: "1px solid var(--border)" }}>
        <div
          style={{
            width: 46, height: 46, borderRadius: "50%", flexShrink: 0,
            background: r.avatar_color + "22",
            border: `2px solid ${r.avatar_color}55`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "0.82rem", fontWeight: 700, color: r.avatar_color,
          }}
        >
          {r.initials}
        </div>
        <div>
          <div style={{ fontWeight: 600, fontSize: "0.92rem", display: "flex", alignItems: "center", gap: 6 }}>
            {r.name} {r.country && <span style={{ fontSize: "1rem" }}>{r.country}</span>}
          </div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
            {[r.job_title, r.company].filter(Boolean).join(" · ")}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Testimonials({ reviews }: { reviews: TestimonialItem[] }) {
  if (reviews.length === 0) return null;

  const avg = reviews.reduce((a, r) => a + r.rating, 0) / reviews.length;
  const avgRounded = Math.round(avg * 10) / 10;

  // Repeat reviews so the marquee always has enough cards to fill the row,
  // then duplicate the whole track for a seamless -50% loop.
  const base: TestimonialItem[] = [];
  while (base.length < 6) base.push(...reviews);
  const rowA = [...base, ...base];
  const rowB = [...base].reverse();
  const rowBLoop = [...rowB, ...rowB];

  return (
    <section style={{ background: "var(--bg-card)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", padding: "80px 0", overflow: "hidden" }}>
      <style>{`
        @keyframes t-left  { from { transform: translateX(0); }      to { transform: translateX(-50%); } }
        @keyframes t-right { from { transform: translateX(-50%); }   to { transform: translateX(0); } }
        .t-track { display: flex; gap: 20px; width: max-content; }
        .t-row-a { animation: t-left 50s linear infinite; }
        .t-row-b { animation: t-right 55s linear infinite; }
        .t-track:hover { animation-play-state: paused; }
        .t-card:hover { border-color: var(--avt) !important; transform: translateY(-4px); }
        @media (prefers-reduced-motion: reduce) {
          .t-row-a, .t-row-b { animation: none; }
        }
      `}</style>

      <div className="container">
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <span className="badge" style={{ marginBottom: 16, display: "inline-flex" }}>Client Reviews</span>
          <h2 className="section-title" style={{ marginBottom: 12 }}>
            What Clients <span className="gradient-text">Say</span>
          </h2>
          <p className="section-subtitle" style={{ margin: "0 auto" }}>
            Real feedback from clients I&apos;ve worked with around the world.
          </p>
        </div>

        {/* Rating summary strip */}
        <div
          style={{
            display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center",
            gap: 28, marginBottom: 48, padding: "20px 28px", borderRadius: 16,
            background: "var(--bg-muted)", border: "1px solid var(--border)",
            width: "fit-content", marginInline: "auto",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: "2.4rem", fontWeight: 800, lineHeight: 1, color: "var(--primary)" }}>
              {avgRounded.toFixed(1)}
            </span>
            <div>
              <Stars count={Math.round(avg)} size={16} />
              <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: 4 }}>Average rating</div>
            </div>
          </div>

          <div style={{ width: 1, height: 38, background: "var(--border)" }} />

          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--text)" }}>{reviews.length}+</div>
            <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Happy clients</div>
          </div>

          <div style={{ width: 1, height: 38, background: "var(--border)" }} />

          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--text)" }}>100%</div>
            <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Satisfaction</div>
          </div>
        </div>
      </div>

      {/* Marquee rows */}
      <div style={{ position: "relative" }}>
        {/* Edge fades */}
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 120, zIndex: 2, background: "linear-gradient(to right, var(--bg-card), transparent)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 120, zIndex: 2, background: "linear-gradient(to left, var(--bg-card), transparent)", pointerEvents: "none" }} />

        <div className="t-track t-row-a" style={{ marginBottom: 20 }}>
          {rowA.map((r, i) => <ReviewCard key={`a-${i}`} r={r} />)}
        </div>

        <div className="t-track t-row-b">
          {rowBLoop.map((r, i) => <ReviewCard key={`b-${i}`} r={r} />)}
        </div>
      </div>
    </section>
  );
}
