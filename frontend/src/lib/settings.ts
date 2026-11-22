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

/** Web-development career start year — years of experience are computed from this. */
export const EXPERIENCE_START_YEAR = 2016;

/** Years of experience, computed live from the start year so it auto-updates every year. */
export function yearsOfExperience(startYear: number = EXPERIENCE_START_YEAR): number {
  const years = new Date().getFullYear() - (Number.isFinite(startYear) ? startYear : EXPERIENCE_START_YEAR);
  return years > 0 ? years : 1;
}

export async function fetchSettings(): Promise<SiteSettings> {
  try {
    const res = await fetch(`${API}/settings`, { cache: 'force-cache' });
    if (!res.ok) return {};
    return await res.json();
  } catch {
    return {};
  }
}
