import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Eye, Clock, Tag } from "lucide-react";

interface PageProps { params: Promise<{ slug: string }> }

interface Category { id: number; name: string; slug: string }
interface Post {
  id: number; title: string; slug: string;
  content: string | null; excerpt: string | null;
  image: string | null; published_at: string | null;
  created_at: string; views: number;
  category: Category | null;
}

const API      = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";
const STORAGE  = API.replace(/\/api\/?$/, "") + "/storage";

function img(path: string | null) {
  return path ? `${STORAGE}/${path}` : null;
}
function fmtDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}
function readTime(html: string | null) {
  if (!html) return "1 min";
  const words = html.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.ceil(words / 200))} min read`;
}

async function getPost(slug: string): Promise<Post | null> {
  try {
    const res = await fetch(`${API}/blog/${slug}`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    return (await res.json()).post ?? null;
  } catch { return null; }
}

async function getRelated(categorySlug: string | null, excludeSlug: string): Promise<Post[]> {
  try {
    // First try same-category posts
    if (categorySlug) {
      const res = await fetch(`${API}/blog?category=${categorySlug}&per_page=10`, { next: { revalidate: 60 } });
      if (res.ok) {
        const data = await res.json();
        const posts = (data.data ?? []).filter((p: Post) => p.slug !== excludeSlug).slice(0, 3);
        if (posts.length > 0) return posts;
      }
    }
    // Fallback: latest posts from any category
    const res = await fetch(`${API}/blog?per_page=10`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const data = await res.json();
    return (data.data ?? []).filter((p: Post) => p.slug !== excludeSlug).slice(0, 3);
  } catch { return []; }
}

async function getRecent(excludeSlug: string): Promise<Post[]> {
  try {
    const res = await fetch(`${API}/blog?per_page=6`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const data = await res.json();
    return (data.data ?? []).filter((p: Post) => p.slug !== excludeSlug).slice(0, 5);
  } catch { return []; }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Not Found" };
  return { title: post.title, description: post.excerpt ?? undefined };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const [post, recent] = await Promise.all([getPost(slug), getRecent(slug)]);
  if (!post) notFound();

  const related = await getRelated(post.category?.slug ?? null, slug);
  const date    = fmtDate(post.published_at ?? post.created_at);
  const rt      = readTime(post.content);
  const heroImg = img(post.image);

  return (
    <div className="py-12">
      <div className="container" style={{ maxWidth: 1180 }}>

        {/* Back */}
        <Link href="/blog"
          className="inline-flex items-center gap-2 text-sm mb-8 transition-colors hover:text-orange-400"
          style={{ color: "var(--text-muted)" }}>
          <ArrowLeft size={15} /> Back to Blog
        </Link>

        {/* Two-column layout */}
        <div className="flex gap-10 items-start" style={{ flexWrap: "wrap" }}>

          {/* ── MAIN CONTENT ── */}
          <article style={{ flex: "1 1 0", minWidth: 0 }}>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              {post.category && (
                <span className="text-xs font-semibold px-3 py-1 rounded-full"
                  style={{ background: "rgba(249,115,22,0.12)", color: "var(--primary)", border: "1px solid rgba(249,115,22,0.3)" }}>
                  {post.category.name}
                </span>
              )}
              <span className="flex items-center gap-1 text-xs" style={{ color: "var(--text-muted)" }}>
                <Clock size={11} /> {rt}
              </span>
              <span className="flex items-center gap-1 text-xs" style={{ color: "var(--text-muted)" }}>
                <Eye size={11} /> {post.views} views
              </span>
            </div>

            {/* Title */}
            <h1 className="font-bold leading-tight mb-6"
              style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)", color: "var(--text)" }}>
              {post.title}
            </h1>

            {/* Author + date */}
            <div className="flex items-center gap-4 mb-8 pb-6" style={{ borderBottom: "1px solid var(--border)" }}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                style={{ background: "var(--primary)", color: "#fff" }}>
                IM
              </div>
              <div>
                <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>Ibrahim Monir</p>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>Full-Stack Developer</p>
              </div>
              <div className="h-7 w-px ml-2" style={{ background: "var(--border)" }} />
              <span className="flex items-center gap-1.5 text-sm" style={{ color: "var(--text-muted)" }}>
                <Calendar size={13} /> {date}
              </span>
            </div>

            {/* Hero image */}
            {heroImg && (
              <div className="rounded-2xl overflow-hidden mb-8" style={{ maxHeight: 420 }}>
                <img src={heroImg} alt={post.title} className="w-full object-cover" style={{ maxHeight: 420 }} />
              </div>
            )}

            {/* Excerpt */}
            {post.excerpt && (
              <p className="text-base leading-relaxed mb-8 px-5 py-4 rounded-xl italic"
                style={{ color: "var(--text-muted)", background: "var(--bg-card)", borderLeft: "3px solid var(--primary)" }}>
                {post.excerpt}
              </p>
            )}

            {/* Body */}
            {post.content
              ? <div className="blog-content" dangerouslySetInnerHTML={{ __html: post.content }} />
              : <p style={{ color: "var(--text-muted)" }}>No content available.</p>
            }

            {/* Share */}
            <div className="mt-12 pt-6 flex flex-wrap items-center justify-between gap-3"
              style={{ borderTop: "1px solid var(--border)" }}>
              <Link href="/blog"
                className="inline-flex items-center gap-2 text-sm hover:text-orange-400 transition-colors"
                style={{ color: "var(--text-muted)" }}>
                <ArrowLeft size={14} /> All Posts
              </Link>
              <div className="flex items-center gap-2">
                <span className="text-xs" style={{ color: "var(--text-muted)" }}>Share:</span>
                {[
                  { label: "X (Twitter)", href: `https://x.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(`https://ibrahimmonir.com/blog/${post.slug}`)}` },
                  { label: "LinkedIn",   href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`https://ibrahimmonir.com/blog/${post.slug}`)}` },
                ].map(({ label, href }) => (
                  <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                    className="text-xs font-medium px-3 py-1.5 rounded-lg transition-colors hover:border-orange-500"
                    style={{ background: "var(--bg-card)", color: "var(--text-muted)", border: "1px solid var(--border)" }}>
                    {label}
                  </a>
                ))}
              </div>
            </div>
          </article>

          {/* ── SIDEBAR ── */}
          <aside style={{ width: 300, flexShrink: 0, position: "sticky", top: 110 }}>

            {/* Author card */}
            <div className="rounded-2xl p-5 mb-5" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
              <div className="flex flex-col items-center text-center gap-3">
                <div className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold"
                  style={{ background: "linear-gradient(135deg, var(--primary), #f59e0b)", color: "#fff" }}>
                  IM
                </div>
                <div>
                  <p className="font-bold" style={{ color: "var(--text)" }}>Ibrahim Monir</p>
                  <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>Full-Stack Web Developer</p>
                </div>
                <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
                  Building scalable web applications with WordPress, Laravel &amp; Next.js. 5+ years of experience.
                </p>
                <Link href="/contact"
                  className="w-full text-center text-sm font-medium py-2 rounded-lg transition-colors"
                  style={{ background: "var(--primary)", color: "#fff" }}>
                  Hire Me
                </Link>
              </div>
            </div>

            {/* Category */}
            {post.category && (
              <div className="rounded-2xl p-5 mb-5" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
                <h3 className="text-sm font-bold mb-3" style={{ color: "var(--text)" }}>Category</h3>
                <Link href={`/blog?category=${post.category.slug}`}
                  className="inline-flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg"
                  style={{ background: "rgba(249,115,22,0.1)", color: "var(--primary)", border: "1px solid rgba(249,115,22,0.25)" }}>
                  <Tag size={12} /> {post.category.name}
                </Link>
              </div>
            )}

            {/* Recent posts */}
            {recent.length > 0 && (
              <div className="rounded-2xl p-5" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
                <h3 className="text-sm font-bold mb-4" style={{ color: "var(--text)" }}>Recent Posts</h3>
                <ul className="flex flex-col gap-4">
                  {recent.map((p) => (
                    <li key={p.id}>
                      <Link href={`/blog/${p.slug}`} className="flex gap-3 group">
                        <div className="flex-shrink-0 rounded-lg overflow-hidden" style={{ width: 56, height: 56 }}>
                          {img(p.image)
                            ? <img src={img(p.image)!} alt={p.title} className="w-full h-full object-cover" />
                            : <div className="w-full h-full" style={{ background: "var(--bg-muted)" }} />
                          }
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium leading-snug line-clamp-2 group-hover:text-orange-400 transition-colors"
                            style={{ color: "var(--text)" }}>
                            {p.title}
                          </p>
                          <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                            {fmtDate(p.published_at ?? p.created_at)}
                          </p>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

          </aside>
        </div>

        {/* ── RELATED POSTS ── */}
        {related.length > 0 && (
          <section className="mt-14 pt-10" style={{ borderTop: "1px solid var(--border)" }}>

            {/* Section header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "var(--primary)" }}>
                  {post.category ? `More from ${post.category.name}` : "More Articles"}
                </p>
                <h2 className="text-2xl font-bold" style={{ color: "var(--text)" }}>Related Posts</h2>
              </div>
              <Link href="/blog"
                className="hidden md:inline-flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-xl transition-colors"
                style={{ background: "var(--bg-card)", color: "var(--text-muted)", border: "1px solid var(--border)" }}>
                View All
              </Link>
            </div>

            {/* Cards */}
            <div className="grid md:grid-cols-3 gap-6">
              {related.map((p) => {
                const rImg = img(p.image);
                return (
                  <Link key={p.id} href={`/blog/${p.slug}`}
                    className="rounded-2xl overflow-hidden flex flex-col group transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg"
                    style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>

                    {/* Image */}
                    <div className="relative overflow-hidden" style={{ height: 200 }}>
                      {rImg ? (
                        <img src={rImg} alt={p.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center"
                          style={{ background: "linear-gradient(135deg, var(--bg-muted), var(--bg-card))" }}>
                          <span className="text-3xl opacity-20">📝</span>
                        </div>
                      )}
                      {/* Category overlay */}
                      {p.category && (
                        <span className="absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full"
                          style={{ background: "rgba(249,115,22,0.9)", color: "#fff" }}>
                          {p.category.name}
                        </span>
                      )}
                    </div>

                    {/* Body */}
                    <div className="p-5 flex flex-col gap-2.5 flex-1">
                      <h3 className="text-sm font-bold leading-snug line-clamp-2 group-hover:text-orange-400 transition-colors"
                        style={{ color: "var(--text)" }}>
                        {p.title}
                      </h3>
                      {p.excerpt && (
                        <p className="text-xs leading-relaxed line-clamp-2" style={{ color: "var(--text-muted)" }}>
                          {p.excerpt}
                        </p>
                      )}
                      <div className="flex items-center gap-3 mt-auto pt-3"
                        style={{ borderTop: "1px solid var(--border)" }}>
                        <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                          <Calendar size={11} className="inline mr-1" />
                          {fmtDate(p.published_at ?? p.created_at)}
                        </span>
                        <span className="ml-auto text-xs font-semibold group-hover:text-orange-400 transition-colors"
                          style={{ color: "var(--text-muted)" }}>
                          Read →
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

      </div>
    </div>
  );
}
