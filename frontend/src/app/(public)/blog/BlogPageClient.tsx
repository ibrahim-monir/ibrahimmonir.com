'use client';
import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, Calendar, User, ArrowRight } from "lucide-react";

interface Category { id: number; name: string; slug: string }
interface Post {
  id: number;
  slug: string;
  title: string;
  excerpt: string | null;
  image: string | null;
  published_at: string | null;
  created_at: string;
  views: number;
  category: Category | null;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") ?? "http://localhost:8000";

function imageUrl(path: string | null) {
  if (!path) return null;
  return `${API_BASE}/storage/${path}`;
}

function formatDate(d: string | null) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export default function BlogPageClient({
  initialPosts,
  categories,
}: {
  initialPosts: Post[];
  categories: Category[];
}) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return initialPosts.filter((p) => {
      const matchCat = !activeCategory || p.category?.slug === activeCategory;
      const matchSearch =
        !search ||
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        (p.excerpt ?? "").toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [initialPosts, search, activeCategory]);

  return (
    <div className="py-16">
      <div className="container">

        {/* Search */}
        <div className="flex justify-end mb-6">
          <div className="relative w-full max-w-xs">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
            <input
              type="text"
              placeholder="Search Blog"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-full text-sm outline-none"
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                color: "var(--text)",
              }}
            />
          </div>
        </div>

        {/* Category tabs */}
        <div className="flex flex-wrap gap-2 mb-10">
          <button
            onClick={() => setActiveCategory(null)}
            className="px-4 py-1.5 rounded-full text-sm font-medium transition-all"
            style={{
              background: !activeCategory ? "var(--primary)" : "var(--bg-card)",
              color: !activeCategory ? "#fff" : "var(--text-muted)",
              border: `1px solid ${!activeCategory ? "var(--primary)" : "var(--border)"}`,
            }}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(activeCategory === cat.slug ? null : cat.slug)}
              className="px-4 py-1.5 rounded-full text-sm font-medium transition-all"
              style={{
                background: activeCategory === cat.slug ? "var(--primary)" : "var(--bg-card)",
                color: activeCategory === cat.slug ? "#fff" : "var(--text-muted)",
                border: `1px solid ${activeCategory === cat.slug ? "var(--primary)" : "var(--border)"}`,
              }}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-24 text-sm" style={{ color: "var(--text-muted)" }}>
            No posts found.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((post) => {
              const img = imageUrl(post.image);
              const date = formatDate(post.published_at ?? post.created_at);

              return (
                <div
                  key={post.id}
                  className="rounded-2xl overflow-hidden flex flex-col group transition-transform hover:-translate-y-1"
                  style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
                >
                  {/* Image */}
                  <Link href={`/blog/${post.slug}`} className="block overflow-hidden" style={{ height: 220 }}>
                    {img ? (
                      <img
                        src={img}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center" style={{ background: "var(--bg-muted)" }}>
                        <span className="text-xs" style={{ color: "var(--text-muted)" }}>No image</span>
                      </div>
                    )}
                  </Link>

                  {/* Body */}
                  <div className="p-5 flex flex-col flex-1 gap-3">
                    {/* Author + Date */}
                    <div className="flex items-center justify-between text-xs" style={{ color: "var(--text-muted)" }}>
                      <span className="flex items-center gap-1.5">
                        <span className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: "var(--bg-muted)" }}>
                          <User size={11} />
                        </span>
                        Ibrahim Monir
                      </span>
                      {date && (
                        <span className="flex items-center gap-1">
                          <Calendar size={11} /> {date}
                        </span>
                      )}
                    </div>

                    {/* Category badge */}
                    {post.category && (
                      <span
                        className="self-start text-xs font-medium px-3 py-1 rounded-full"
                        style={{ border: "1px solid var(--border)", color: "var(--text-muted)" }}
                      >
                        {post.category.name}
                      </span>
                    )}

                    {/* Title */}
                    <Link href={`/blog/${post.slug}`}>
                      <h3
                        className="font-bold text-base leading-snug line-clamp-2 group-hover:text-orange-400 transition-colors"
                        style={{ color: "var(--text)" }}
                      >
                        {post.title}
                      </h3>
                    </Link>

                    {/* Excerpt */}
                    {post.excerpt && (
                      <p className="text-sm line-clamp-2 leading-relaxed flex-1" style={{ color: "var(--text-muted)" }}>
                        {post.excerpt}{" "}
                        <Link href={`/blog/${post.slug}`} className="font-semibold" style={{ color: "var(--text)" }}>
                          Read More
                        </Link>
                      </p>
                    )}

                    {!post.excerpt && (
                      <Link
                        href={`/blog/${post.slug}`}
                        className="mt-auto inline-flex items-center gap-1 text-sm font-medium"
                        style={{ color: "var(--accent)" }}
                      >
                        Read More <ArrowRight size={13} />
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
