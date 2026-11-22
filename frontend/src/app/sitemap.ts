import type { MetadataRoute } from "next";

// Static export builds this once at build time, same as every other route --
// no server is available afterward to regenerate it per request.
export const dynamic = "force-static";

const SITE_URL = "https://ibrahimmonir.com";
const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

type BlogPost = { slug: string; updated_at?: string };
type Service = { slug: string; updated_at?: string };

async function fetchBlogSlugs(): Promise<BlogPost[]> {
  try {
    const res = await fetch(`${API}/blog?per_page=100`);
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data.data) ? data.data : [];
  } catch {
    return [];
  }
}

async function fetchServiceSlugs(): Promise<Service[]> {
  try {
    const res = await fetch(`${API}/services`);
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data.services) ? data.services : [];
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Build time: static pages only change when the site is rebuilt, and a
  // fresh lastmod nudges Google to recrawl them after a deploy.
  const builtAt = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: builtAt, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}/services`, lastModified: builtAt, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/works`, lastModified: builtAt, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/products`, lastModified: builtAt, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/pricing`, lastModified: builtAt, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/blog`, lastModified: builtAt, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/faq`, lastModified: builtAt, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/contact`, lastModified: builtAt, changeFrequency: "yearly", priority: 0.6 },
    { url: `${SITE_URL}/privacy`, lastModified: builtAt, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/terms`, lastModified: builtAt, changeFrequency: "yearly", priority: 0.3 },
  ];

  const [posts, services] = await Promise.all([fetchBlogSlugs(), fetchServiceSlugs()]);

  const blogRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: post.updated_at ? new Date(post.updated_at) : undefined,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const serviceRoutes: MetadataRoute.Sitemap = services.map((service) => ({
    url: `${SITE_URL}/services/${service.slug}`,
    lastModified: service.updated_at ? new Date(service.updated_at) : undefined,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...serviceRoutes, ...blogRoutes];
}
