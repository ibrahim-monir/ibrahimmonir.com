const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

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
