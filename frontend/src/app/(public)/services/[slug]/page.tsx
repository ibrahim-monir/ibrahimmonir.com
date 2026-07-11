import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft, ArrowRight, Check, Calendar,
  Layers, ListChecks, Workflow, Briefcase, HelpCircle, Newspaper,
  DollarSign, PackageCheck, Clock3,
} from "lucide-react";

interface PageProps { params: Promise<{ slug: string }> }

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";
const STORAGE = API.replace(/\/api\/?$/, "") + "/storage";

interface Service {
  id: number;
  title: string;
  slug: string;
  short_desc: string | null;
  description: string | null;
  color: string | null;
  image: string | null;
  price: string | null;
  features: string[] | null;
  is_popular: boolean;
}

interface WorkItem {
  id: number;
  title: string;
  slug: string;
  category: string | null;
  technologies: string[];
  url: string | null;
  thumbnail: string | null;
}

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  image: string | null;
  published_at: string | null;
  created_at: string;
}

// Services with an outcome/revenue focus get the "business" layout (full-bleed
// hero + stats bar + social proof up front); everything else gets the
// "technical" layout (split hero + tech stack up front). Real per-service
// color, image and copy differentiate pages within each group.
const BUSINESS_SLUGS = new Set(["ecommerce-solutions", "saas-platforms", "business-systems"]);

// Work `category` values that count as "related" for each service slug —
// matched against the free-text category field on the Work model.
const WORK_CATEGORIES: Record<string, string[]> = {
  "wordpress-development": ["WordPress"],
  "ecommerce-solutions": ["E-Commerce", "WordPress"],
  "laravel-development": ["Laravel", "SaaS", "Web App"],
  "nextjs-react-apps": ["Next.js"],
  "saas-platforms": ["SaaS", "Web App"],
  "api-development": ["API"],
  "plugins-themes": ["WordPress"],
  "business-systems": ["SaaS", "Laravel", "Web App"],
};

// Keywords matched against blog post titles for the "Related Articles" section.
const BLOG_KEYWORDS: Record<string, string[]> = {
  "wordpress-development": ["wordpress", "wp-", "elementor"],
  "ecommerce-solutions": ["woocommerce", "ecommerce", "e-commerce", "checkout", "shopify"],
  "laravel-development": ["laravel", "php"],
  "nextjs-react-apps": ["next.js", "nextjs", "react"],
  "saas-platforms": ["saas"],
  "api-development": ["api"],
  "plugins-themes": ["plugin", "theme", "elementor", "gutenberg"],
  "business-systems": ["erp", "crm", "business", "workflow"],
};

const TECHNOLOGIES: Record<string, string[]> = {
  "wordpress-development": ["WordPress", "PHP", "MySQL", "Elementor", "ACF", "WooCommerce"],
  "ecommerce-solutions": ["WooCommerce", "Stripe", "PayPal", "PHP", "MySQL"],
  "laravel-development": ["Laravel", "PHP", "MySQL", "Filament", "Redis", "Sanctum"],
  "nextjs-react-apps": ["Next.js", "React", "TypeScript", "Tailwind CSS", "Vercel"],
  "saas-platforms": ["Laravel", "Next.js", "Stripe", "PostgreSQL", "Redis"],
  "api-development": ["Laravel", "REST", "Postman", "Sanctum", "MySQL"],
  "plugins-themes": ["PHP", "WordPress Plugin API", "Gutenberg", "Elementor SDK"],
  "business-systems": ["Laravel", "Filament", "MySQL", "PDF Export"],
};

const PROCESS_STEPS = [
  { title: "Discovery & Requirements", desc: "We talk through what you actually need, scope the work, and agree on timeline and budget." },
  { title: "Design & Planning", desc: "Wireframes or design direction where needed, plus a clear technical plan before any code is written." },
  { title: "Development", desc: "Iterative development with regular check-ins, so you see progress instead of a surprise at the end." },
  { title: "Testing & QA", desc: "Cross-browser and edge-case testing before anything goes live — bugs get caught here, not in production." },
  { title: "Launch & Support", desc: "Deployment, a handover walkthrough, and post-launch support to fix anything that comes up." },
];

const FAQS: Record<string, { q: string; a: string }[]> = {
  default: [
    { q: "How do we get started?", a: "Reach out via the contact form with a short description of what you need. I'll reply within 24 hours with questions or a scoped proposal." },
    { q: "How is pricing determined?", a: "Pricing depends on scope and complexity — the price shown is a starting point. You'll get a firm quote after we've discussed the actual requirements." },
    { q: "Do you offer support after launch?", a: "Yes. Every project includes a post-launch support window, and ongoing maintenance can be arranged separately if you need it." },
    { q: "Can you work with my existing site or codebase?", a: "In most cases, yes — I regularly take over and extend existing WordPress and Laravel projects rather than starting from scratch." },
  ],
};

function img(path: string | null) {
  return path ? `${STORAGE}/${path}` : null;
}
function fmtDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}
function fmtPrice(price: string | null) {
  return price ? `$${Math.round(parseFloat(price)).toLocaleString()}` : null;
}

async function getService(slug: string): Promise<Service | null> {
  try {
    const res = await fetch(`${API}/services/${slug}`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    return (await res.json()).service ?? null;
  } catch {
    return null;
  }
}

async function getRelatedWork(slug: string): Promise<WorkItem[]> {
  try {
    const res = await fetch(`${API}/works`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const works: WorkItem[] = await res.json();
    const categories = WORK_CATEGORIES[slug] ?? [];
    return works.filter((w) => w.category && categories.includes(w.category)).slice(0, 3);
  } catch {
    return [];
  }
}

async function getRelatedPosts(slug: string): Promise<BlogPost[]> {
  try {
    const res = await fetch(`${API}/blog?per_page=50`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const data = await res.json();
    const posts: BlogPost[] = data.data ?? [];
    const keywords = BLOG_KEYWORDS[slug] ?? [];
    if (!keywords.length) return [];
    return posts
      .filter((p) => keywords.some((k) => p.title.toLowerCase().includes(k)))
      .slice(0, 3);
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = await getService(slug);
  if (!service) return { title: "Not Found" };
  return {
    title: service.title,
    description: service.short_desc ?? undefined,
  };
}

/* ────────────────────────────────────────────────────────────────────── */
/* Shared building blocks — reused by both layout variants below           */
/* ────────────────────────────────────────────────────────────────────── */

function Kicker({ icon: Icon, label, color }: { icon: React.ComponentType<{ size?: number }>; label: string; color: string }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <span className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: color + "1a", color }}>
        <Icon size={14} />
      </span>
      <span className="text-xs font-bold uppercase tracking-widest" style={{ color }}>{label}</span>
    </div>
  );
}

function Overview({ service, color }: { service: Service; color: string }) {
  if (!service.description) return null;
  return (
    <section className="mb-14">
      <Kicker icon={Briefcase} label="Overview" color={color} />
      <div className="blog-content" dangerouslySetInnerHTML={{ __html: service.description }} />
    </section>
  );
}

function WhatYouGet({ features, color }: { features: string[]; color: string }) {
  if (!features.length) return null;
  return (
    <section className="mb-14">
      <Kicker icon={ListChecks} label="What You Get" color={color} />
      <h2 className="text-2xl font-bold mb-6" style={{ color: "var(--text)" }}>Everything Included</h2>
      <ul className="grid sm:grid-cols-2 gap-3">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2.5 p-3 rounded-xl text-sm"
            style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
            <Check size={16} style={{ color, flexShrink: 0, marginTop: 2 }} />
            <span style={{ color: "var(--text)" }}>{f}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function ProcessSteps({ color }: { color: string }) {
  return (
    <section className="mb-14">
      <Kicker icon={Workflow} label="Process" color={color} />
      <h2 className="text-2xl font-bold mb-6" style={{ color: "var(--text)" }}>How I Work</h2>
      <div className="flex flex-col gap-4">
        {PROCESS_STEPS.map((step, i) => (
          <div key={step.title} className="flex gap-4 p-4 rounded-xl"
            style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
            <div className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm"
              style={{ background: color + "1a", color }}>
              {i + 1}
            </div>
            <div>
              <h3 className="font-semibold text-sm mb-1" style={{ color: "var(--text)" }}>{step.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>{step.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function TechStack({ technologies, color }: { technologies: string[]; color: string }) {
  if (!technologies.length) return null;
  return (
    <section className="mb-14">
      <Kicker icon={Layers} label="Stack" color={color} />
      <h2 className="text-2xl font-bold mb-6" style={{ color: "var(--text)" }}>Technologies Used</h2>
      <div className="flex flex-wrap gap-2.5">
        {technologies.map((t) => (
          <span key={t} className="text-sm font-medium px-3.5 py-2 rounded-lg"
            style={{ background: color + "12", color, border: `1px solid ${color}30` }}>
            {t}
          </span>
        ))}
      </div>
    </section>
  );
}

function RelatedProjects({ relatedWork, color }: { relatedWork: WorkItem[]; color: string }) {
  if (!relatedWork.length) return null;
  return (
    <section className="mb-14">
      <Kicker icon={Briefcase} label="Portfolio" color={color} />
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold" style={{ color: "var(--text)" }}>Recent Projects</h2>
        <Link href="/works" className="hidden md:inline-flex items-center gap-1.5 text-sm font-medium"
          style={{ color: "var(--text-muted)" }}>
          View All <ArrowRight size={14} />
        </Link>
      </div>
      <div className="grid sm:grid-cols-3 gap-5">
        {relatedWork.map((w) => (
          <div key={w.id} className="rounded-2xl overflow-hidden"
            style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
            <div className="relative overflow-hidden" style={{ height: 140 }}>
              {w.thumbnail ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={w.thumbnail} alt={w.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg, var(--bg-muted), var(--bg-card))" }} />
              )}
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-sm leading-snug" style={{ color: "var(--text)" }}>{w.title}</h3>
              {w.category && (
                <span className="text-xs mt-1 inline-block" style={{ color: "var(--text-muted)" }}>{w.category}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function RelatedArticles({ relatedPosts, color }: { relatedPosts: BlogPost[]; color: string }) {
  if (!relatedPosts.length) return null;
  return (
    <section className="mb-14">
      <Kicker icon={Newspaper} label="Reading" color={color} />
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold" style={{ color: "var(--text)" }}>Related Articles</h2>
        <Link href="/blog" className="hidden md:inline-flex items-center gap-1.5 text-sm font-medium"
          style={{ color: "var(--text-muted)" }}>
          View All <ArrowRight size={14} />
        </Link>
      </div>
      <div className="grid sm:grid-cols-3 gap-5">
        {relatedPosts.map((p) => {
          const pImg = img(p.image);
          return (
            <Link key={p.id} href={`/blog/${p.slug}`}
              className="rounded-2xl overflow-hidden flex flex-col group transition-all duration-300 hover:-translate-y-1"
              style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
              <div className="relative overflow-hidden" style={{ height: 140 }}>
                {pImg ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={pImg} alt={p.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center"
                    style={{ background: "linear-gradient(135deg, var(--bg-muted), var(--bg-card))" }} />
                )}
              </div>
              <div className="p-4 flex flex-col gap-2 flex-1">
                <h3 className="text-sm font-semibold leading-snug line-clamp-2 group-hover:text-orange-400 transition-colors"
                  style={{ color: "var(--text)" }}>
                  {p.title}
                </h3>
                <span className="text-xs mt-auto" style={{ color: "var(--text-muted)" }}>
                  <Calendar size={11} className="inline mr-1" />
                  {fmtDate(p.published_at ?? p.created_at)}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

function FAQSection({ faqs, color }: { faqs: { q: string; a: string }[]; color: string }) {
  return (
    <section className="mb-14">
      <Kicker icon={HelpCircle} label="FAQ" color={color} />
      <h2 className="text-2xl font-bold mb-6" style={{ color: "var(--text)" }}>Frequently Asked Questions</h2>
      <div className="flex flex-col gap-3">
        {faqs.map((f) => (
          <details key={f.q} className="group rounded-xl p-4"
            style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
            <summary className="font-semibold text-sm cursor-pointer list-none flex items-center justify-between gap-3"
              style={{ color: "var(--text)" }}>
              {f.q}
              <span className="transition-transform group-open:rotate-45 text-lg" style={{ color }}>+</span>
            </summary>
            <p className="text-sm leading-relaxed mt-3" style={{ color: "var(--text-muted)" }}>{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

function CTABand() {
  return (
    <section className="py-20" style={{ borderTop: "1px solid var(--border)" }}>
      <div className="container max-w-2xl text-center">
        <h2 className="section-title mb-4">Let&apos;s Discuss Your Project</h2>
        <p className="section-subtitle mx-auto mb-8">
          Tell me what you&apos;re building. I&apos;ll reply within 24 hours with a clear plan and price.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link href="/contact" className="btn-primary py-3 px-8">
            Start a Conversation <ArrowRight size={16} />
          </Link>
          <Link href="/services" className="btn-outline py-3 px-8">
            See All Services
          </Link>
        </div>
      </div>
    </section>
  );
}

function BackLink() {
  return (
    <Link href="/services"
      className="inline-flex items-center gap-2 text-sm mb-6 transition-colors hover:text-orange-400"
      style={{ color: "var(--text-muted)" }}>
      <ArrowLeft size={15} /> All Services
    </Link>
  );
}

/* ────────────────────────────────────────────────────────────────────── */
/* "Technical" layout — split hero, stack up front. WordPress/Laravel/     */
/* Next.js/API/Plugins & Themes.                                          */
/* ────────────────────────────────────────────────────────────────────── */

function TechnicalLayout({ service, color, heroImg, technologies, faqs, relatedWork, relatedPosts }: {
  service: Service; color: string; heroImg: string | null; technologies: string[];
  faqs: { q: string; a: string }[]; relatedWork: WorkItem[]; relatedPosts: BlogPost[];
}) {
  const topFeatures = (service.features ?? []).slice(0, 3);

  return (
    <div>
      <section className="pt-12 pb-16" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="container">
          <BackLink />
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: content */}
            <div>
              {service.is_popular && (
                <span className="badge mb-4 inline-flex" style={{ background: color + "1a", color, border: `1px solid ${color}40` }}>
                  Most Popular
                </span>
              )}
              <h1 style={{ fontSize: "clamp(2rem, 4vw, 2.75rem)", fontWeight: 800, lineHeight: 1.15, marginBottom: "1rem" }}>
                {service.title}
              </h1>
              {service.short_desc && (
                <p className="text-base leading-relaxed mb-6" style={{ color: "var(--text-muted)" }}>
                  {service.short_desc}
                </p>
              )}
              {!!topFeatures.length && (
                <div className="flex flex-wrap gap-2 mb-8">
                  {topFeatures.map((f) => (
                    <span key={f} className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full"
                      style={{ background: color + "12", color, border: `1px solid ${color}30` }}>
                      <Check size={11} /> {f}
                    </span>
                  ))}
                </div>
              )}
              <div className="flex flex-wrap gap-3">
                <Link href="/contact" className="btn-primary py-3 px-7">
                  Get a Free Quote <ArrowRight size={16} />
                </Link>
                <Link href="/pricing" className="btn-outline py-3 px-7">
                  View Pricing
                </Link>
              </div>
            </div>

            {/* Right: image */}
            <div className="relative">
              <div className="pointer-events-none absolute -inset-6 rounded-[2rem] blur-3xl opacity-25"
                style={{ background: color }} />
              <div className="relative rounded-2xl overflow-hidden shadow-2xl" style={{ border: `1px solid ${color}40` }}>
                {heroImg ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={heroImg} alt={service.title} className="w-full object-cover" style={{ aspectRatio: "4 / 3" }} />
                ) : (
                  <div className="w-full flex items-center justify-center" style={{ aspectRatio: "4 / 3", background: color + "12" }} />
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container max-w-3xl py-4">
        <Overview service={service} color={color} />
        <TechStack technologies={technologies} color={color} />
        <WhatYouGet features={service.features ?? []} color={color} />
        <ProcessSteps color={color} />
        <RelatedProjects relatedWork={relatedWork} color={color} />
        <FAQSection faqs={faqs} color={color} />
        <RelatedArticles relatedPosts={relatedPosts} color={color} />
      </div>

      <CTABand />
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────── */
/* "Business" layout — full-bleed hero + stats bar, social proof up       */
/* front. E-Commerce / SaaS / Business Systems.                           */
/* ────────────────────────────────────────────────────────────────────── */

function StatPill({ icon: Icon, label, value, color }: { icon: React.ComponentType<{ size?: number }>; label: string; value: string; color: string }) {
  return (
    <div className="flex items-center gap-3 px-5 py-4 rounded-2xl flex-1 min-w-[200px]"
      style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
      <span className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: color + "1a", color }}>
        <Icon size={18} />
      </span>
      <div>
        <p className="font-bold text-base leading-tight" style={{ color: "var(--text)" }}>{value}</p>
        <p className="text-xs" style={{ color: "var(--text-muted)" }}>{label}</p>
      </div>
    </div>
  );
}

function BusinessLayout({ service, color, heroImg, technologies, faqs, relatedWork, relatedPosts }: {
  service: Service; color: string; heroImg: string | null; technologies: string[];
  faqs: { q: string; a: string }[]; relatedWork: WorkItem[]; relatedPosts: BlogPost[];
}) {
  const price = fmtPrice(service.price);
  const featureCount = service.features?.length ?? 0;

  return (
    <div>
      <div className="container pt-8">
        <BackLink />
      </div>

      {/* Full-bleed hero */}
      <section className="relative overflow-hidden" style={{ minHeight: 440 }}>
        {heroImg ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={heroImg} alt={service.title} className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${color}33, ${color}0d)` }} />
        )}
        <div className="absolute inset-0"
          style={{ background: "linear-gradient(0deg, rgba(0,0,0,.88) 0%, rgba(0,0,0,.55) 55%, rgba(0,0,0,.25) 100%)" }} />

        <div className="relative container flex flex-col justify-end" style={{ minHeight: 440, paddingTop: 60, paddingBottom: 40 }}>
          <div className="max-w-2xl">
            {service.is_popular && (
              <span className="mb-4 inline-flex text-xs font-bold px-3 py-1.5 rounded-full" style={{ background: color, color: "#fff" }}>
                Most Popular
              </span>
            )}
            <h1 style={{ fontSize: "clamp(2rem, 4.5vw, 3rem)", fontWeight: 800, lineHeight: 1.1, marginBottom: "1rem", color: "#fff" }}>
              {service.title}
            </h1>
            {service.short_desc && (
              <p className="text-base leading-relaxed mb-7" style={{ color: "rgba(255,255,255,0.85)" }}>
                {service.short_desc}
              </p>
            )}
            <div className="flex flex-wrap gap-3">
              <Link href="/contact" className="btn-primary py-3 px-7">
                Get a Free Quote <ArrowRight size={16} />
              </Link>
              <Link href="/pricing"
                className="inline-flex items-center gap-2 py-3 px-7 rounded-xl font-semibold text-sm transition-colors"
                style={{ background: "rgba(255,255,255,0.1)", color: "#fff", border: "1px solid rgba(255,255,255,0.3)" }}>
                View Pricing
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="container -mt-8 relative z-10 mb-6">
        <div className="flex flex-wrap gap-4">
          <StatPill icon={DollarSign} label="Starting at" value={price ?? "Custom Quote"} color={color} />
          {featureCount > 0 && (
            <StatPill icon={PackageCheck} label="Included" value={`${featureCount} Deliverables`} color={color} />
          )}
          <StatPill icon={Clock3} label="Response Time" value="Within 24 Hours" color={color} />
        </div>
      </section>

      <div className="container max-w-3xl py-8">
        <Overview service={service} color={color} />
        <WhatYouGet features={service.features ?? []} color={color} />
        <RelatedProjects relatedWork={relatedWork} color={color} />
        <ProcessSteps color={color} />
        <TechStack technologies={technologies} color={color} />
        <FAQSection faqs={faqs} color={color} />
        <RelatedArticles relatedPosts={relatedPosts} color={color} />
      </div>

      <CTABand />
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────── */

export default async function ServiceDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const service = await getService(slug);
  if (!service) notFound();

  const [relatedWork, relatedPosts] = await Promise.all([
    getRelatedWork(slug),
    getRelatedPosts(slug),
  ]);

  const color = "#f97316";
  const technologies = TECHNOLOGIES[slug] ?? [];
  const faqs = FAQS[slug] ?? FAQS.default;
  const heroImg = img(service.image);

  const props = { service, color, heroImg, technologies, faqs, relatedWork, relatedPosts };

  return BUSINESS_SLUGS.has(slug)
    ? <BusinessLayout {...props} />
    : <TechnicalLayout {...props} />;
}
