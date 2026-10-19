const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

const STORAGE = API.replace(/\/api\/?$/, "") + "/storage";

// Curated photos bundled with the static export (public/images/services), so
// they ship with every deploy. Uploads in Laravel storage stay on the server
// only, so these take precedence for the core services.
const STATIC_SERVICE_IMAGES = new Set([
  "wordpress-development",
  "ecommerce-solutions",
  "laravel-development",
  "nextjs-react-apps",
  "saas-platforms",
  "api-development",
  "plugins-themes",
  "business-systems",
]);

/** Image URL for a service: bundled photo if one exists, else the admin upload. */
export function serviceImage(slug: string, path: string | null): string | undefined {
  if (STATIC_SERVICE_IMAGES.has(slug)) return `/images/services/${slug}.jpg`;
  return path ? `${STORAGE}/${path}` : undefined;
}

export type ServiceNavItem = { title: string; slug: string };

/** Minimal active-service list for nav dropdowns — title + slug only. */
export async function fetchServiceNavItems(): Promise<ServiceNavItem[]> {
  try {
    const res = await fetch(`${API}/services`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const data = await res.json();
    const list: { title: string; slug: string }[] = data.services ?? [];
    return list.map((s) => ({ title: s.title, slug: s.slug }));
  } catch {
    return [];
  }
}
