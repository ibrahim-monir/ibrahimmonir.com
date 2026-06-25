'use client';

import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";

export type WorkItem = {
  id?: number | string;
  title: string;
  category?: string | null;
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
  return title
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

export default function RecentWork({ works }: { works: WorkItem[] }) {
  if (!works.length) return null;

  // Duplicate the list so the marquee can loop seamlessly.
  const loop = [...works, ...works];

  return (
    <section className="py-20 overflow-hidden">
      <style>{`
        @keyframes rw-slide {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .rw-scene {
          perspective: 1800px;
          perspective-origin: 50% 38%;
          -webkit-mask-image: linear-gradient(90deg, transparent, #000 9%, #000 91%, transparent);
                  mask-image: linear-gradient(90deg, transparent, #000 9%, #000 91%, transparent);
        }
        .rw-tilt {
          width: max-content;
          transform: rotateX(14deg) rotateY(-18deg) rotate(2deg);
          transform-style: preserve-3d;
          transition: transform .7s cubic-bezier(.2,.7,.2,1);
          will-change: transform;
        }
        .rw-scene:hover .rw-tilt {
          transform: rotateX(0deg) rotateY(0deg) rotate(0deg);
        }
        .rw-track {
          display: flex;
          gap: 30px;
          padding: 30px 0;
          animation: rw-slide 40s linear infinite;
          will-change: transform;
        }
        .rw-scene:hover .rw-track { animation-play-state: paused; }
        .rw-card {
          position: relative;
          flex: 0 0 auto;
          width: 360px;
          border-radius: 16px;
          overflow: hidden;
          background: var(--bg-card, #111);
          border: 1px solid var(--border, rgba(255,255,255,.08));
          box-shadow: 0 24px 50px -20px rgba(0,0,0,.7);
          text-decoration: none;
          color: inherit;
          transition: transform .35s ease, box-shadow .35s ease, border-color .35s ease;
          transform-style: preserve-3d;
        }
        .rw-card:hover {
          transform: translateZ(50px) scale(1.03);
          border-color: rgba(249,115,22,.55);
          box-shadow: 0 36px 70px -22px rgba(249,115,22,.45);
        }
        .rw-shot {
          position: relative;
          height: 200px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        .rw-shot img {
          width: 100%; height: 100%;
          object-fit: cover;
          display: block;
        }
        .rw-bar {
          position: absolute; top: 0; left: 0; right: 0;
          height: 30px;
          display: flex; align-items: center; gap: 6px;
          padding: 0 12px;
          background: rgba(0,0,0,.35);
          backdrop-filter: blur(4px);
          z-index: 2;
        }
        .rw-dot { width: 9px; height: 9px; border-radius: 50%; }
        .rw-mono {
          font-size: 3rem; font-weight: 800; letter-spacing: -1px;
          color: rgba(255,255,255,.92);
          text-shadow: 0 4px 18px rgba(0,0,0,.45);
        }
        .rw-cat {
          position: absolute; left: 12px; bottom: 12px; z-index: 2;
          font-size: .68rem; font-weight: 700; text-transform: uppercase; letter-spacing: .5px;
          padding: 4px 10px; border-radius: 999px;
          background: rgba(10,10,10,.78); color: #fb923c;
          border: 1px solid rgba(249,115,22,.4);
        }
        .rw-body { padding: 18px 18px 20px; }
        .rw-title {
          font-size: 1.05rem; font-weight: 700; line-height: 1.3;
          margin-bottom: 12px;
          display: flex; align-items: center; gap: 8px; justify-content: space-between;
        }
        .rw-tags { display: flex; flex-wrap: wrap; gap: 6px; }
        .rw-tag {
          font-size: .68rem; padding: 3px 9px; border-radius: 6px;
          background: rgba(249,115,22,.1); color: #fb923c;
        }
        @media (prefers-reduced-motion: reduce) {
          .rw-track { animation: none; }
          .rw-tilt { transform: none; }
        }
        @media (max-width: 768px) {
          .rw-tilt { transform: rotateX(8deg) rotateY(-10deg); }
          .rw-card { width: 290px; }
          .rw-shot { height: 165px; }
        }
      `}</style>

      <div className="container">
        <div className="text-center mb-4">
          <span className="badge mb-4 inline-flex">Portfolio</span>
          <h2 className="section-title mb-4">My Recent Work</h2>
          <p className="section-subtitle mx-auto">
            A glimpse of recently completed projects — crafted with care, shipped with confidence.
          </p>
        </div>
      </div>

      <div className="rw-scene">
        <div className="rw-tilt">
          <div className="rw-track">
            {loop.map((w, i) => {
              const grad = GRADIENTS[i % GRADIENTS.length];
              const href = w.url && w.url !== "#" ? w.url : "/works";
              const external = href.startsWith("http");
              const inner = (
                <>
                  <div className="rw-shot" style={{ background: grad }}>
                    <div className="rw-bar">
                      <span className="rw-dot" style={{ background: "#ff5f56" }} />
                      <span className="rw-dot" style={{ background: "#ffbd2e" }} />
                      <span className="rw-dot" style={{ background: "#27c93f" }} />
                    </div>
                    {w.thumbnail ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={w.thumbnail} alt={w.title} loading="lazy" />
                    ) : (
                      <span className="rw-mono">{initials(w.title)}</span>
                    )}
                    {w.category && <span className="rw-cat">{w.category}</span>}
                  </div>
                  <div className="rw-body">
                    <div className="rw-title">
                      <span>{w.title}</span>
                      <ExternalLink size={15} style={{ color: "var(--primary)", flexShrink: 0 }} />
                    </div>
                    <div className="rw-tags">
                      {(w.technologies ?? []).slice(0, 4).map((t) => (
                        <span key={t} className="rw-tag">{t}</span>
                      ))}
                    </div>
                  </div>
                </>
              );

              return external ? (
                <a key={`${w.id ?? w.title}-${i}`} className="rw-card" href={href} target="_blank" rel="noopener noreferrer" aria-hidden={i >= works.length}>
                  {inner}
                </a>
              ) : (
                <Link key={`${w.id ?? w.title}-${i}`} className="rw-card" href={href} aria-hidden={i >= works.length}>
                  {inner}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      <div className="container">
        <div className="text-center mt-6">
          <Link href="/works" className="btn-primary text-base py-3 px-8">
            View All Work <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
