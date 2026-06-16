const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

export type SiteSettings = Record<string, unknown>;

/** Safely get a string value from settings */
export function str(val: unknown, fallback = ""): string {
  if (typeof val === "string") return val;
  return fallback;
}

/** Safely get a string[] value from settings */
export function arr(val: unknown, fallback: string[] = []): string[] {
  if (Array.isArray(val)) return val as string[];
  return fallback;
}

export async function fetchSettings(): Promise<SiteSettings> {
  try {
    const res = await fetch(`${API}/settings`, { cache: 'no-store' });
    if (!res.ok) return {};
    return await res.json();
  } catch {
    return {};
  }
}
