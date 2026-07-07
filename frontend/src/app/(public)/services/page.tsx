import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

export const metadata: Metadata = {
  title: "Services — Ibrahim Monir",
  description: "WordPress, Laravel, Next.js, SaaS, E-commerce & more.",
};

const services = [
  {
    num: "01", cardBg: "#dbeafe", iconColor: "#1d4ed8", popular: true, wide: false,
    title: "WordPress Development",
    price: "From $400",
    desc: "Custom themes, plugins, and full WordPress sites — built for speed and easy management.",
    features: ["Custom theme & plugin dev", "Elementor, Bricks, Divi…", "WooCommerce setup", "Performance & SEO"],
    icon: (size = 56) => (
      <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
        <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 1.542c2.407 0 4.601.87 6.302 2.3l-8.714 9.965A8.452 8.452 0 0 1 3.542 12c0-4.671 3.787-8.458 8.458-8.458zm0 16.916a8.417 8.417 0 0 1-4.166-1.104l5.645-16.09A8.458 8.458 0 0 1 20.458 12c0 4.671-3.787 8.458-8.458 8.458z"/>
      </svg>
    ),
  },
  {
    num: "02", cardBg: "#fce7f3", iconColor: "#9d174d", popular: false, wide: false,
    title: "E-Commerce",
    price: "From $600",
    desc: "Online stores built to sell — WooCommerce or fully custom cart systems with any payment gateway.",
    features: ["WooCommerce customisation", "Stripe & local gateways", "Product & inventory mgmt", "Multi-vendor support"],
    icon: (size = 56) => (
      <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
        <path d="M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59L5.25 14A2 2 0 0 0 7 17h14v-2H7.42a.25.25 0 0 1-.25-.25l.03-.12.9-1.63H19c.75 0 1.41-.41 1.75-1.03l3.58-6.49A1 1 0 0 0 23.46 4H5.21l-.94-2H1z"/>
      </svg>
    ),
  },
  {
    num: "03", cardBg: "#dcfce7", iconColor: "#15803d", popular: false, wide: true,
    title: "Laravel Development",
    price: "From $500",
    desc: "Solid, maintainable backend applications — from REST APIs to full Filament admin-driven systems. Multi-tenancy, role-based access, queue jobs, and automated workflows built the right way.",
    features: ["Custom apps & Filament panels", "REST API & auth", "Multi-tenancy & RBAC", "Queue jobs & workflows"],
    icon: (size = 56) => (
      <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
        <path d="M23.642 5.43a.364.364 0 0 1 .014.1v5.149c0 .135-.073.26-.189.326l-4.323 2.49v4.934a.378.378 0 0 1-.188.326L9.93 23.949a.316.316 0 0 1-.066.027.347.347 0 0 1-.087.024.336.336 0 0 1-.087-.024.316.316 0 0 1-.066-.027L.497 18.755a.378.378 0 0 1-.189-.326V3.204c0-.033.005-.066.014-.098a.378.378 0 0 1 .014-.1.321.321 0 0 1 .046-.082.326.326 0 0 1 .026-.035L4.978.09a.378.378 0 0 1 .378 0l4.57 2.638h.001l4.57 2.637a.39.39 0 0 1 .026.035.316.316 0 0 1 .046.082z"/>
      </svg>
    ),
  },
  {
    num: "04", cardBg: "#f3f4f6", iconColor: "#111827", popular: false, wide: false,
    title: "Next.js / React",
    price: "From $500",
    desc: "Fast, SEO-ready frontends and full-stack apps using the Next.js App Router.",
    features: ["App Router & RSC", "SSR, SSG & ISR", "TypeScript & Tailwind", "Auth & performance"],
    icon: (size = 56) => (
      <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
        <path d="M11.572 0c-.176 0-.31.001-.358.007a19.76 19.76 0 0 1-.364.033C7.443.346 4.25 2.185 2.228 5.012a11.875 11.875 0 0 0-2.119 5.243c-.096.659-.108.854-.108 1.747s.012 1.089.108 1.748c.652 4.506 3.86 8.292 8.209 9.695.779.25 1.6.422 2.534.525.363.04 1.935.04 2.299 0 1.611-.178 2.977-.577 4.323-1.264.207-.106.247-.134.219-.158-.02-.013-.9-1.193-1.955-2.62l-1.919-2.592-2.404-3.558a338.739 338.739 0 0 0-2.422-3.556c-.009-.002-.018 1.579-.023 3.51-.007 3.38-.01 3.515-.052 3.595a.426.426 0 0 1-.206.214c-.075.037-.14.044-.495.044H7.81l-.108-.068a.438.438 0 0 1-.157-.171l-.05-.106.006-4.703.007-4.705.072-.092a.645.645 0 0 1 .174-.143c.096-.047.134-.051.54-.051.478 0 .558.018.682.154.035.038 1.337 1.999 2.895 4.361a10760.433 10760.433 0 0 0 4.735 7.17l1.9 2.879.096-.063a12.317 12.317 0 0 0 2.466-2.163 11.944 11.944 0 0 0 2.824-6.134c.096-.66.108-.854.108-1.748 0-.893-.012-1.088-.108-1.747-.652-4.506-3.859-8.292-8.208-9.695a12.597 12.597 0 0 0-2.499-.523A33.119 33.119 0 0 0 11.573 0z"/>
      </svg>
    ),
  },
  {
    num: "05", cardBg: "#ffedd5", iconColor: "#c2410c", popular: false, wide: false,
    title: "SaaS Platforms",
    price: "From $2,000",
    desc: "Complete multi-tenant SaaS products — billing, dashboards, and user management.",
    features: ["Multi-tenant architecture", "Stripe billing & plans", "Role management", "Analytics & onboarding"],
    icon: (size = 56) => (
      <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
        <path d="M12 2L2 7v10l10 5 10-5V7L12 2zm0 2.236L20 8.5v7L12 19.764 4 15.5v-7L12 4.236zM12 7a5 5 0 1 0 0 10A5 5 0 0 0 12 7zm0 2a3 3 0 1 1 0 6 3 3 0 0 1 0-6z"/>
      </svg>
    ),
  },
  {
    num: "06", cardBg: "#e0f2fe", iconColor: "#0369a1", popular: false, wide: true,
    title: "API Development & Integrations",
    price: "From $300",
    desc: "Clean RESTful APIs and seamless third-party integrations — well-structured, documented, and secure. Webhooks, rate limiting, Postman docs, and Laravel Sanctum auth included.",
    features: ["RESTful API design", "Third-party integrations", "Webhook systems", "Postman docs & security"],
    icon: (size = 56) => (
      <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
        <path d="M8.5 3a6.5 6.5 0 0 1 6.46 5.84L15.5 9H17a3 3 0 0 1 .18 5.99L17 15h-2v-2h2a1 1 0 0 0 .1-1.99L17 11h-3l-.06-.93A4.5 4.5 0 1 0 8.5 15H9v2h-.5a6.5 6.5 0 0 1 0-13zm8.86 9.14l1.42 1.42-2.12 2.12 2.12 2.12-1.42 1.42L15.24 17l-2.12 2.12-1.42-1.42 2.12-2.12-2.12-2.12 1.42-1.42 2.12 2.12 2.12-2.12z"/>
      </svg>
    ),
  },
  {
    num: "07", cardBg: "#f0fdf4", iconColor: "#16a34a", popular: false, wide: false,
    title: "Plugins & Themes",
    price: "From $200",
    desc: "Custom WordPress plugins and themes — OOP, documented, and ready to distribute.",
    features: ["Custom plugin dev (OOP)", "Premium theme dev", "Elementor & Gutenberg addons", "Licensing system"],
    icon: (size = 56) => (
      <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
        <path d="M20.5 11H19V7c0-1.1-.9-2-2-2h-4V3.5A2.5 2.5 0 0 0 10.5 1 2.5 2.5 0 0 0 8 3.5V5H4c-1.1 0-1.99.9-1.99 2v3.8H3.5c1.49 0 2.7 1.21 2.7 2.7 0 1.49-1.21 2.7-2.7 2.7H2V20c0 1.1.9 2 2 2h3.8v-1.5c0-1.49 1.21-2.7 2.7-2.7 1.49 0 2.7 1.21 2.7 2.7V22H17c1.1 0 2-.9 2-2v-4h1.5a2.5 2.5 0 0 0 2.5-2.5 2.5 2.5 0 0 0-2.5-2.5z"/>
      </svg>
    ),
  },
  {
    num: "08", cardBg: "#fef9c3", iconColor: "#a16207", popular: false, wide: false,
    title: "Business Systems",
    price: "From $1,500",
    desc: "ERP, CRM, and management systems built exactly around your business workflow.",
    features: ["ERP / CRM with Filament", "Inventory & invoicing", "Role-based access", "PDF export & analytics"],
    icon: (size = 56) => (
      <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
        <path d="M10 3H4a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1zM9 9H5V5h4v4zm11-6h-6a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1zm-1 6h-4V5h4v4zm-9 4H4a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-6a1 1 0 0 0-1-1zm-1 6H5v-4h4v4zm8-1c-2.206 0-4 1.794-4 4s1.794 4 4 4 4-1.794 4-4-1.794-4-4-4zm0 6c-1.103 0-2-.897-2-2s.897-2 2-2 2 .897 2 2-.897 2-2 2z"/>
      </svg>
    ),
  },
];

function NarrowCard({ s }: { s: typeof services[0] }) {
  return (
    <div className="rounded-2xl overflow-hidden flex flex-col"
      style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>

      {/* Illustration area */}
      <div className="relative flex items-center justify-center overflow-hidden"
        style={{ background: s.cardBg, height: 200 }}>
        {/* Decorative blobs */}
        <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full opacity-30"
          style={{ background: s.iconColor }} />
        <div className="absolute -bottom-4 -left-4 w-20 h-20 rounded-full opacity-20"
          style={{ background: s.iconColor }} />
        {/* Icon */}
        <div className="relative z-10 p-5 rounded-2xl"
          style={{ background: s.iconColor + "18", color: s.iconColor }}>
          {s.icon(52)}
        </div>
        {/* Popular badge */}
        {s.popular && (
          <span className="absolute top-3 right-3 text-xs font-bold px-2.5 py-1 rounded-full"
            style={{ background: s.iconColor, color: "#fff" }}>
            Most Popular
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1 gap-3">
        <div>
          <p className="text-xs font-bold mb-1" style={{ color: s.iconColor }}>{s.num} · {s.price}</p>
          <h3 className="font-bold text-lg leading-snug">{s.title}</h3>
        </div>
        <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>{s.desc}</p>
        <ul className="flex flex-col gap-1.5 flex-1">
          {s.features.map((f) => (
            <li key={f} className="flex items-center gap-2 text-xs" style={{ color: "var(--text-muted)" }}>
              <Check size={10} style={{ color: s.iconColor, flexShrink: 0 }} /> {f}
            </li>
          ))}
        </ul>
        <Link href="/contact"
          className="inline-flex items-center gap-1.5 text-sm font-semibold mt-2 transition-all hover:gap-2.5"
          style={{ color: s.iconColor }}>
          See Details <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}

function WideCard({ s }: { s: typeof services[0] }) {
  return (
    <div className="rounded-2xl overflow-hidden grid md:grid-cols-2"
      style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>

      {/* Illustration area */}
      <div className="relative flex items-center justify-center overflow-hidden"
        style={{ background: s.cardBg, minHeight: 220 }}>
        <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full opacity-25"
          style={{ background: s.iconColor }} />
        <div className="absolute -bottom-6 -left-6 w-28 h-28 rounded-full opacity-15"
          style={{ background: s.iconColor }} />
        <div className="relative z-10 p-6 rounded-2xl"
          style={{ background: s.iconColor + "18", color: s.iconColor }}>
          {s.icon(64)}
        </div>
        {s.popular && (
          <span className="absolute top-3 right-3 text-xs font-bold px-2.5 py-1 rounded-full"
            style={{ background: s.iconColor, color: "#fff" }}>
            Most Popular
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-8 flex flex-col justify-center gap-4">
        <div>
          <p className="text-xs font-bold mb-1" style={{ color: s.iconColor }}>{s.num} · {s.price}</p>
          <h3 className="font-bold text-2xl leading-snug">{s.title}</h3>
        </div>
        <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>{s.desc}</p>
        <ul className="grid grid-cols-2 gap-x-4 gap-y-1.5">
          {s.features.map((f) => (
            <li key={f} className="flex items-center gap-2 text-xs" style={{ color: "var(--text-muted)" }}>
              <Check size={10} style={{ color: s.iconColor, flexShrink: 0 }} /> {f}
            </li>
          ))}
        </ul>
        <Link href="/contact"
          className="inline-flex items-center gap-1.5 text-sm font-semibold mt-1 transition-all hover:gap-2.5"
          style={{ color: s.iconColor }}>
          See Details <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}

export default function ServicesPage() {
  return (
    <div>

      {/* ── Hero ── */}
      <section className="py-20" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="container max-w-2xl text-center">
          <span className="badge mb-5 inline-flex">Services</span>
          <h1 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 800, lineHeight: 1.15, marginBottom: "1rem" }}>
            What I Can <span className="gradient-text">Build For You</span>
          </h1>
          <p className="text-base leading-relaxed mb-8" style={{ color: "var(--text-muted)" }}>
            From a simple WordPress site to a full SaaS platform — I handle everything
            end-to-end: design, development, and deployment.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/contact" className="btn-primary py-3 px-7">
              Get a Free Quote <ArrowRight size={16} />
            </Link>
            <Link href="/pricing" className="btn-outline py-3 px-7">
              View Pricing
            </Link>
          </div>
        </div>
      </section>

      {/* ── Services Bento Grid ── */}
      <section className="py-20">
        <div className="container">
          <div className="flex flex-col gap-5">
            {/* Row 1: cards 1,2 side by side */}
            <div className="grid md:grid-cols-2 gap-5">
              <NarrowCard s={services[0]} />
              <NarrowCard s={services[1]} />
            </div>
            {/* Row 2: wide card */}
            <WideCard s={services[2]} />
            {/* Row 3: cards 4,5 */}
            <div className="grid md:grid-cols-2 gap-5">
              <NarrowCard s={services[3]} />
              <NarrowCard s={services[4]} />
            </div>
            {/* Row 4: wide card */}
            <WideCard s={services[5]} />
            {/* Row 5: cards 7,8 */}
            <div className="grid md:grid-cols-2 gap-5">
              <NarrowCard s={services[6]} />
              <NarrowCard s={services[7]} />
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20" style={{ borderTop: "1px solid var(--border)" }}>
        <div className="container max-w-2xl text-center">
          <h2 className="section-title mb-4">Have a project in mind?</h2>
          <p className="section-subtitle mb-8">
            Tell me what you&apos;re building. I&apos;ll reply within 24 hours with a clear plan and price.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/contact" className="btn-primary py-3 px-8">
              Start a Conversation <ArrowRight size={16} />
            </Link>
            <Link href="/pricing" className="btn-outline py-3 px-8">
              See Pricing
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
