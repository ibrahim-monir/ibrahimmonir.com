'use client';

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, ExternalLink, Images } from "lucide-react";
import WorkGalleryLightbox from "./WorkGalleryLightbox";

export type WorkItem = {
  id?: number | string;
  title: string;
  category?: string | null;
  technologies?: string[];
  url?: string | null;
  thumbnail?: string | null;
  images?: string[] | null;
};

const GRADIENTS = [
  "linear-gradient(135deg, #ED1C24 0%, #7c2d12 100%)",
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
  const [gallery, setGallery] = useState<{ title: string; images: string[]; index: number } | null>(null);

  if (!works.length) return null;

  const items = works.slice(0, 6);

  return (
    <section className="py-20">
      <div className="container">
        <div className="text-center mb-14">
          <span className="badge mb-4 inline-flex">Portfolio</span>
          <h2 className="section-title mb-4">My Recent Work</h2>
          <p className="section-subtitle mx-auto">
            A glimpse of recently completed projects — crafted with care, shipped with confidence.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((w, i) => {
            const grad = GRADIENTS[i % GRADIENTS.length];
            const href = w.url && w.url !== "#" ? w.url : "/works";
            const external = href.startsWith("http");
            const galleryImages = [w.thumbnail, ...(w.images ?? [])].filter(
              (src, idx, arr): src is string => !!src && arr.indexOf(src) === idx
            );

            return (
              <div key={`${w.id ?? w.title}-${i}`} className="card overflow-hidden group hover:-translate-y-1 flex flex-col">
                <button
                  type="button"
                  onClick={() => galleryImages.length && setGallery({ title: w.title, images: galleryImages, index: 0 })}
                  disabled={!galleryImages.length}
                  aria-label={`View ${w.title} gallery`}
                  className="relative aspect-[16/10] w-full overflow-hidden block text-left border-b"
                  style={{ background: grad, borderColor: "var(--border)", cursor: galleryImages.length ? "zoom-in" : "default" }}
                >
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
                      <span style={{ fontFamily: "var(--font-heading)", fontSize: "2.8rem", fontWeight: 700, letterSpacing: "-0.04em", color: "rgba(255,255,255,.92)" }}>
                        {initials(w.title)}
                      </span>
                    </div>
                  )}
                  {w.category && (
                    <span className="badge" style={{ position: "absolute", left: 12, top: 12, background: "rgba(255,255,255,0.94)", borderColor: "transparent", backdropFilter: "blur(6px)" }}>
                      {w.category}
                    </span>
                  )}
                  {!!galleryImages.length && (
                    <div
                      className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ background: "rgba(11,14,20,.45)" }}
                    >
                      <span
                        className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-full"
                        style={{ background: "rgba(255,255,255,.95)", color: "#111" }}
                      >
                        <Images size={15} /> View Gallery
                      </span>
                    </div>
                  )}
                </button>
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <h3 className="font-semibold text-lg leading-snug group-hover:text-[var(--primary)] transition-colors">{w.title}</h3>
                    <a
                      href={href}
                      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      aria-label={`Open ${w.title}`}
                      className="flex items-center justify-center w-8 h-8 rounded-lg border transition-colors hover:bg-[var(--primary)] hover:text-white hover:border-[var(--primary)]"
                      style={{ color: "var(--text-muted)", borderColor: "var(--border)", flexShrink: 0 }}
                    >
                      <ExternalLink size={15} />
                    </a>
                  </div>
                  {!!(w.technologies && w.technologies.length) && (
                    <div className="flex flex-wrap gap-1.5 mt-auto">
                      {w.technologies.slice(0, 4).map((t) => (
                        <span key={t} className="chip">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <Link href="/works" className="btn-outline text-base py-3 px-8">
            View All Work <ArrowRight size={18} />
          </Link>
        </div>
      </div>

      {gallery && (
        <WorkGalleryLightbox
          title={gallery.title}
          images={gallery.images}
          initialIndex={gallery.index}
          onClose={() => setGallery(null)}
        />
      )}
    </section>
  );
}
