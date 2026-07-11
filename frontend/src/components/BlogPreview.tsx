import Link from "next/link";
import { ArrowRight, Clock, Calendar } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";
const STORAGE = API.replace(/\/api\/?$/, "") + "/storage";

interface Category { id: number; name: string; slug: string }
interface Post {
  id: number; slug: string; title: string; excerpt: string | null;
  image: string | null; published_at: string | null; created_at: string;
  category: Category | null;
}

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function readTime(excerpt: string | null) {
  if (!excerpt) return "3 min read";
  const words = excerpt.split(/\s+/).length;
  return `${Math.max(2, Math.ceil(words / 50))} min read`;
}

async function getLatestPosts(): Promise<Post[]> {
  try {
    const res = await fetch(`${API}/blog?per_page=6`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data ?? [];
  } catch {
    return [];
  }
}

export default async function BlogPreview() {
  const posts = await getLatestPosts();

  if (posts.length === 0) return null;

  return (
    <section className="py-20">
      <div className="container">

        {/* Header */}
        <div className="text-center mb-12">
          <span className="badge mb-4 inline-flex">Blog</span>
          <h2 className="section-title">
            Latest <span className="gradient-text">Articles</span>
          </h2>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {posts.map((post, i) => {
            const imageUrl = post.image ? `${STORAGE}/${post.image}` : null;
            const date = fmtDate(post.published_at ?? post.created_at);
            const rt = readTime(post.excerpt);

            return (
              <Link key={post.id} href={`/blog/${post.slug}`}
                className="card group flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                style={{ borderColor: "var(--border)" }}
              >
                {/* Image or gradient placeholder */}
                <div className="relative overflow-hidden" style={{ height: 180 }}>
                  {imageUrl ? (
                    <img src={imageUrl} alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl"
                      style={{ background: `linear-gradient(135deg, var(--bg-muted) 0%, #1a1a1a 100%)` }}>
                      <span style={{ opacity: 0.2 }}>✍️</span>
                    </div>
                  )}

                  {/* Category badge overlay */}
                  {post.category && (
                    <span className="absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full"
                      style={{ background: "rgba(249,115,22,0.92)", color: "#fff" }}>
                      {post.category.name}
                    </span>
                  )}

                  {/* Post number */}
                  <span className="absolute top-3 right-3 text-xs font-bold px-2 py-1 rounded-md"
                    style={{ background: "rgba(0,0,0,0.55)", color: "rgba(255,255,255,0.5)" }}>
                    0{i + 1}
                  </span>
                </div>

                <div className="p-6 flex flex-col flex-1">
                  {/* Title */}
                  <h3 className="font-bold text-base leading-snug mb-3 group-hover:text-orange-400 transition-colors"
                    style={{ lineHeight: 1.45, color: "var(--text)" }}>
                    {post.title}
                  </h3>

                  {/* Excerpt */}
                  {post.excerpt && (
                    <p className="text-sm leading-relaxed flex-1 mb-5 line-clamp-2"
                      style={{ color: "var(--text-muted)" }}>
                      {post.excerpt}
                    </p>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 mt-auto border-t"
                    style={{ borderColor: "var(--border)" }}>
                    <div className="flex items-center gap-3 text-xs" style={{ color: "var(--text-muted)" }}>
                      <span className="flex items-center gap-1">
                        <Calendar size={11} /> {date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={11} /> {rt}
                      </span>
                    </div>
                    <span className="flex items-center gap-1 text-xs font-semibold transition-all group-hover:gap-2"
                      style={{ color: "var(--primary)" }}>
                      Read <ArrowRight size={12} />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Link href="/blog" className="btn-primary text-base py-3 px-8">
            View All Articles <ArrowRight size={18} />
          </Link>
        </div>

      </div>
    </section>
  );
}
