import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { ArrowRight, Shield, FileText, Headphones, RefreshCw, Code2 } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";
const STORAGE = API.replace(/\/api\/?$/, "") + "/storage";

type ApiService = {
  id: number;
  title: string;
  slug: string;
  short_desc: string | null;
  color: string | null;
  image: string | null;
  is_popular: boolean;
  features: string[] | null;
};

type Service = {
  num: string;
  slug: string;
  title: string;
  desc: string;
  color: string;
  popular: boolean;
  icon: ReactNode;
  image?: string;
};

// Fallback SVG icons, keyed by slug — used whenever a service has no
// admin-uploaded image.
const ICONS: Record<string, ReactNode> = {
  "wordpress-development": (
    <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
      <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 1.542c2.407 0 4.601.87 6.302 2.3l-8.714 9.965A8.452 8.452 0 0 1 3.542 12c0-4.671 3.787-8.458 8.458-8.458zm0 16.916a8.417 8.417 0 0 1-4.166-1.104l5.645-16.09A8.458 8.458 0 0 1 20.458 12c0 4.671-3.787 8.458-8.458 8.458z"/>
    </svg>
  ),
  "ecommerce-solutions": (
    <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
      <path d="M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59L5.25 14A2 2 0 0 0 7 17h14v-2H7.42a.25.25 0 0 1-.25-.25l.03-.12.9-1.63H19c.75 0 1.41-.41 1.75-1.03l3.58-6.49A1 1 0 0 0 23.46 4H5.21l-.94-2H1z"/>
    </svg>
  ),
  "laravel-development": (
    <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
      <path d="M23.642 5.43a.364.364 0 0 1 .014.1v5.149c0 .135-.073.26-.189.326l-4.323 2.49v4.934a.378.378 0 0 1-.188.326L9.93 23.949a.316.316 0 0 1-.066.027.347.347 0 0 1-.087.024.336.336 0 0 1-.087-.024.316.316 0 0 1-.066-.027L.497 18.755a.378.378 0 0 1-.189-.326V3.204c0-.033.005-.066.014-.098a.378.378 0 0 1 .014-.1.321.321 0 0 1 .046-.082.326.326 0 0 1 .026-.035L4.978.09a.378.378 0 0 1 .378 0l4.57 2.638h.001l4.57 2.637a.39.39 0 0 1 .026.035.316.316 0 0 1 .046.082z"/>
    </svg>
  ),
  "nextjs-react-apps": (
    <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
      <path d="M11.572 0c-.176 0-.31.001-.358.007a19.76 19.76 0 0 1-.364.033C7.443.346 4.25 2.185 2.228 5.012a11.875 11.875 0 0 0-2.119 5.243c-.096.659-.108.854-.108 1.747s.012 1.089.108 1.748c.652 4.506 3.86 8.292 8.209 9.695.779.25 1.6.422 2.534.525.363.04 1.935.04 2.299 0 1.611-.178 2.977-.577 4.323-1.264.207-.106.247-.134.219-.158-.02-.013-.9-1.193-1.955-2.62l-1.919-2.592-2.404-3.558a338.739 338.739 0 0 0-2.422-3.556c-.009-.002-.018 1.579-.023 3.51-.007 3.38-.01 3.515-.052 3.595a.426.426 0 0 1-.206.214c-.075.037-.14.044-.495.044H7.81l-.108-.068a.438.438 0 0 1-.157-.171l-.05-.106.006-4.703.007-4.705.072-.092a.645.645 0 0 1 .174-.143c.096-.047.134-.051.54-.051.478 0 .558.018.682.154.035.038 1.337 1.999 2.895 4.361a10760.433 10760.433 0 0 0 4.735 7.17l1.9 2.879.096-.063a12.317 12.317 0 0 0 2.466-2.163 11.944 11.944 0 0 0 2.824-6.134c.096-.66.108-.854.108-1.748 0-.893-.012-1.088-.108-1.747-.652-4.506-3.859-8.292-8.208-9.695a12.597 12.597 0 0 0-2.499-.523A33.119 33.119 0 0 0 11.573 0z"/>
    </svg>
  ),
  "saas-platforms": (
    <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
      <path d="M12 2L2 7v10l10 5 10-5V7L12 2zm0 2.236L20 8.5v7L12 19.764 4 15.5v-7L12 4.236zM12 7a5 5 0 1 0 0 10A5 5 0 0 0 12 7zm0 2a3 3 0 1 1 0 6 3 3 0 0 1 0-6z"/>
    </svg>
  ),
  "api-development": (
    <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
      <path d="M8.5 3a6.5 6.5 0 0 1 6.46 5.84L15.5 9H17a3 3 0 0 1 .18 5.99L17 15h-2v-2h2a1 1 0 0 0 .1-1.99L17 11h-3l-.06-.93A4.5 4.5 0 1 0 8.5 15H9v2h-.5a6.5 6.5 0 0 1 0-13zm8.86 9.14l1.42 1.42-2.12 2.12 2.12 2.12-1.42 1.42L15.24 17l-2.12 2.12-1.42-1.42 2.12-2.12-2.12-2.12 1.42-1.42 2.12 2.12 2.12-2.12z"/>
    </svg>
  ),
  "plugins-themes": (
    <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
      <path d="M20.5 11H19V7c0-1.1-.9-2-2-2h-4V3.5A2.5 2.5 0 0 0 10.5 1 2.5 2.5 0 0 0 8 3.5V5H4c-1.1 0-1.99.9-1.99 2v3.8H3.5c1.49 0 2.7 1.21 2.7 2.7 0 1.49-1.21 2.7-2.7 2.7H2V20c0 1.1.9 2 2 2h3.8v-1.5c0-1.49 1.21-2.7 2.7-2.7 1.49 0 2.7 1.21 2.7 2.7V22H17c1.1 0 2-.9 2-2v-4h1.5a2.5 2.5 0 0 0 2.5-2.5 2.5 2.5 0 0 0-2.5-2.5z"/>
    </svg>
  ),
  "business-systems": (
    <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
      <path d="M10 3H4a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1zM9 9H5V5h4v4zm11-6h-6a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1zm-1 6h-4V5h4v4zm-9 4H4a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-6a1 1 0 0 0-1-1zm-1 6H5v-4h4v4zm8-1c-2.206 0-4 1.794-4 4s1.794 4 4 4 4-1.794 4-4-1.794-4-4-4zm0 6c-1.103 0-2-.897-2-2s.897-2 2-2 2 .897 2 2-.897 2-2 2z"/>
    </svg>
  ),
};

const DEFAULT_ICON = (
  <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
    <path d="M12 2L2 7v10l10 5 10-5V7L12 2zm0 2.236L20 8.5v7L12 19.764 4 15.5v-7L12 4.236zM12 7a5 5 0 1 0 0 10A5 5 0 0 0 12 7zm0 2a3 3 0 1 1 0 6 3 3 0 0 1 0-6z"/>
  </svg>
);

async function getServices(): Promise<Service[]> {
  try {
    const res = await fetch(`${API}/services`, { next: { revalidate: 30 } });
    if (!res.ok) return [];
    const data = await res.json();
    const list: ApiService[] = data.services ?? [];
    return list.map((s, i) => ({
      num: String(i + 1).padStart(2, "0"),
      slug: s.slug,
      title: s.title,
      desc: s.short_desc ?? "",
      color: "#f97316",
      popular: s.is_popular,
      icon: ICONS[s.slug] ?? DEFAULT_ICON,
      image: s.image ? `${STORAGE}/${s.image}` : undefined,
    }));
  } catch {
    return [];
  }
}

const included = [
  { icon: FileText, label: "NDA & Contract" },
  { icon: Code2, label: "Clean Code" },
  { icon: Shield, label: "Secure & Tested" },
  { icon: RefreshCw, label: "Free Revisions" },
  { icon: Headphones, label: "Post-launch Support" },
];

export default async function ServicesSection() {
  const services = await getServices();

  return (
    <section className="py-24" style={{ background: "var(--bg-card)", borderTop: "1px solid var(--border)" }}>
      <div className="container">

        {/* Header */}
        <div className="text-center mb-16">
          <span className="badge mb-4 inline-flex">What I Do</span>
          <h2 className="section-title mb-4">
            Services I <span className="gradient-text">Offer</span>
          </h2>
          <p className="section-subtitle mx-auto">
            Full-cycle development services — from a single WordPress site to a complete SaaS platform.
            Every project is built with care, clean code, and long-term maintainability in mind.
          </p>
        </div>

        {/* Service bento grid — varied tile sizes, glass + hover glow */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {services.map((s, i) => {
            // Column-span pattern that tiles perfectly: [2,1,1, 2,1,1, 2,2] = 12 cells (3 rows × 4 cols)
            const span =
              i === 0 || i === 3 || i === 6 || i === 7
                ? "sm:col-span-2 lg:col-span-2"
                : "";
            const wide = span !== "";

            return (
              <div
                key={s.title}
                className={`group relative overflow-hidden rounded-2xl border [border-color:var(--border)] hover:[border-color:var(--svc)] flex flex-col transition-all duration-300 hover:-translate-y-1 ${span}`}
                style={{ background: "var(--bg-muted)", ["--svc" as string]: s.color + "80" } as CSSProperties}
              >
                {/* Image banner — real photo if set, otherwise a colored gradient with the icon centered */}
                <div className="relative h-40 w-full overflow-hidden flex-shrink-0">
                  {s.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={s.image}
                      alt={s.title}
                      loading="lazy"
                      className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center"
                      style={{ background: `linear-gradient(135deg, ${s.color}33, ${s.color}0d)` }}
                    >
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                        style={{ background: s.color + "22", color: s.color }}>
                        {s.icon}
                      </div>
                    </div>
                  )}

                  {/* Popular badge */}
                  {s.popular && (
                    <span
                      className="absolute top-3 right-3 text-[10px] font-bold px-2.5 py-1 rounded-full"
                      style={{ background: s.color, color: "#fff" }}
                    >
                      Most Popular
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="relative p-5 sm:p-6 flex flex-col flex-1">
                  {/* Title */}
                  <h3 className={`font-bold leading-snug mb-2 ${wide ? "text-xl" : "text-base"}`}>
                    {s.title}
                  </h3>

                  {/* Description — full on wide tiles, clamped on small ones */}
                  <p
                    className={`leading-relaxed mb-4 ${wide ? "text-sm max-w-md" : "text-xs line-clamp-2"}`}
                    style={{ color: "var(--text-muted)" }}
                  >
                    {s.desc}
                  </p>

                  {/* Learn more */}
                  <Link
                    href={`/services/${s.slug}`}
                    className="mt-auto inline-flex items-center justify-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-lg transition-all hover:gap-2.5 self-start border-[#f97316]/40 bg-[#f97316]/10 text-[#f97316] hover:bg-[#f97316] hover:text-white"
                    style={{ borderWidth: 1, borderStyle: "solid" }}
                  >
                    Learn more <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Included in every project */}
        <div className="card p-6">
          <p className="text-center text-xs font-bold uppercase tracking-widest mb-5"
            style={{ color: "var(--text-muted)" }}>
            Included in every project
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {included.map((item) => (
              <div key={item.label}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium"
                style={{ background: "rgba(249,115,22,0.08)", border: "1px solid rgba(249,115,22,0.2)" }}>
                <item.icon size={14} style={{ color: "var(--primary)" }} />
                {item.label}
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-10">
          <Link href="/services" className="btn-primary text-base py-3 px-8">
            View All Services <ArrowRight size={18} />
          </Link>
        </div>

      </div>
    </section>
  );
}
