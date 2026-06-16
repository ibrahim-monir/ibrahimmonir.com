import type { Metadata } from "next";
import BlogPageClient from "./BlogPageClient";

export const metadata: Metadata = {
  title: "Blog",
  description: "Articles on WordPress, Laravel, Next.js, and modern web development.",
};

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

async function getPosts(): Promise<Post[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/blog?per_page=50`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.data ?? [];
  } catch {
    return [];
  }
}

export default async function BlogPage() {
  const posts = await getPosts();

  // Extract unique categories from posts
  const categoryMap = new Map<number, Category>();
  for (const post of posts) {
    if (post.category && !categoryMap.has(post.category.id)) {
      categoryMap.set(post.category.id, post.category);
    }
  }
  const categories = Array.from(categoryMap.values());

  return <BlogPageClient initialPosts={posts} categories={categories} />;
}
