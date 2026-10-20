import type { Metadata } from "next";
import Link from "next/link";
import TopBar from "@/components/TopBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { fetchSettings, str, arr, yearsOfExperience } from "@/lib/settings";
import { fetchServiceNavItems } from "@/lib/services";
import ParticlesBackground from "@/components/ParticlesBackground";
import HeroPhoto from "@/components/HeroPhoto";
import HeroTypewriter from "@/components/HeroTypewriter";
import TechStackSlider from "@/components/TechStackSlider";
import StatsCounter from "@/components/StatsCounter";
import Testimonials, { type TestimonialItem } from "@/components/Testimonials";
import BlogPreview from "@/components/BlogPreview";
import ServicesSection from "@/components/ServicesSection";
import ProcessSection from "@/components/ProcessSection";
import RecentWork, { type WorkItem } from "@/components/RecentWork";
import {
  ArrowRight, CheckCircle,
  MapPin, Mail, Download,
} from "lucide-react";


export const metadata: Metadata = {
  title: "Ibrahim Monir — Full-Stack Developer",
  description: "Building premium web experiences with Laravel, Next.js, and modern technologies.",
};

// Shown when no works exist in the backend yet, so the section always looks complete.
const FALLBACK_WORKS: WorkItem[] = [
  { title: "Multi-vendor E-commerce Platform", category: "E-commerce", technologies: ["Laravel", "React", "MySQL", "Redis"], url: "/works" },
  { title: "SaaS Project Management Tool", category: "SaaS", technologies: ["Laravel", "Next.js", "PostgreSQL"], url: "/works" },
  { title: "Healthcare Appointment System", category: "Web App", technologies: ["Laravel", "Vue.js", "MySQL"], url: "/works" },
  { title: "Real Estate Listing Portal", category: "Web App", technologies: ["Next.js", "Laravel API", "MySQL"], url: "/works" },
  { title: "Restaurant POS System", category: "Web App", technologies: ["Laravel", "React", "MySQL"], url: "/works" },
  { title: "Learning Management System", category: "SaaS", technologies: ["Laravel", "Next.js", "PostgreSQL"], url: "/works" },
];




export default async function HomePage() {
  const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";
  const [settings, experiencesRaw, testimonialsRaw, worksRaw, services] = await Promise.all([
    fetchSettings(),
    fetch(`${API}/experiences`,   { cache: 'no-store' }).then(r => r.ok ? r.json() : []).catch(() => []),
    fetch(`${API}/testimonials`,  { cache: 'no-store' }).then(r => r.ok ? r.json() : []).catch(() => []),
    fetch(`${API}/works`,         { cache: 'no-store' }).then(r => r.ok ? r.json() : []).catch(() => []),
    fetchServiceNavItems(),
  ]);
  const timeline: { role: string; company: string; year_label: string; description: string }[] = experiencesRaw;
  const testimonials: TestimonialItem[] = testimonialsRaw;
  const recentWorks: WorkItem[] = Array.isArray(worksRaw) && worksRaw.length ? worksRaw.slice(0, 8) : FALLBACK_WORKS;

  const expYears = yearsOfExperience(parseInt(str(settings.experience_start_year, "2016")));

  const statsData = [
    { num: parseInt(str(settings.stat_projects_completed, "80")),  suffix: "+", label: "Projects Delivered" },
    { num: parseInt(str(settings.stat_clients_served,     "40")),  suffix: "+", label: "Happy Clients" },
    { num: expYears,                                               suffix: "+", label: "Years Experience" },
    { num: parseInt(str(settings.stat_satisfaction,       "100")), suffix: "%", label: "Client Satisfaction" },
  ];

  return (
    <>
      <TopBar phone={str(settings.contact_phone)} />
      <Navbar services={services} />
      <main className="pt-[100px] flex-1">

        {/* ── Hero ── */}
        <section className="theme-dark relative overflow-hidden">
          <ParticlesBackground />

          <div className="absolute inset-0 pointer-events-none" aria-hidden>
            <div className="absolute inset-0 bg-grid bg-grid-fade opacity-70" />
            <div className="absolute -top-40 right-[-10%] w-[620px] h-[620px] rounded-full blur-3xl"
              style={{ background: "radial-gradient(circle, rgba(237,28,36,0.28) 0%, transparent 65%)" }} />
            <div className="absolute -bottom-48 -left-32 w-[480px] h-[480px] rounded-full blur-3xl"
              style={{ background: "radial-gradient(circle, rgba(156,36,38,0.22) 0%, transparent 70%)" }} />
            <div className="hero-beam" />
            <div className="absolute inset-x-0 bottom-0 h-px"
              style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.14), transparent)" }} />
          </div>

          <div className="container relative z-10">
            <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 xl:gap-16 pt-20 md:pt-28 pb-20 md:pb-28 items-center">

              {/* ── Left: intro ── */}
              <div>
                {str(settings.hero_badge) && (
                  <span className="badge mb-6 inline-flex">
                    <span className="relative flex w-2 h-2 mr-0.5">
                      <span className="absolute inline-flex w-full h-full rounded-full bg-green-400 opacity-75 animate-ping" />
                      <span className="relative inline-flex w-2 h-2 rounded-full bg-green-400" />
                    </span>
                    {str(settings.hero_badge)}
                  </span>
                )}
                <p className="flex items-center gap-3 font-mono text-sm mb-4" style={{ color: "var(--text-muted)" }}>
                  <span className="inline-block w-8 h-px" style={{ background: "var(--primary)" }} />
                  Hi, I&apos;m
                </p>
                <h1 className="mb-4" style={{ fontSize: "clamp(2.75rem, 6.4vw, 4.75rem)", fontWeight: 700, lineHeight: 1, letterSpacing: "-0.045em" }}>
                  {str(settings.site_name, "Ibrahim Monir")}
                </h1>
                <HeroTypewriter
                  initial={str(settings.hero_subheadline, "Full-Stack Web Developer")}
                  roles={arr(settings.hero_typewriter_roles)}
                />
                <p className="text-base md:text-lg leading-relaxed mb-9 max-w-xl" style={{ color: "var(--text-muted)" }}>
                  {str(settings.hero_bio, "Passionate full-stack developer crafting fast, scalable and reliable web applications with WordPress, Laravel & Next.js. From pixel-perfect frontends to robust APIs, I turn ideas into polished products that help businesses grow.")}
                </p>

                {/* CTAs */}
                <div className="flex flex-wrap items-center gap-3 mb-10">
                  <Link
                    href={str(settings.hero_cta_primary_url, "/works")}
                    className="btn-primary text-base py-3 px-7"
                  >
                    {str(settings.hero_cta_primary, "View My Work")} <ArrowRight size={18} />
                  </Link>
                  <a
                    href={str(settings.hero_resume_url, "/resume.pdf")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-glow text-base py-3 px-7"
                  >
                    Download CV <Download size={16} />
                  </a>
                </div>

                {/* Contact info */}
                {(str(settings.contact_address) || str(settings.contact_email)) && (
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-6 text-sm border-t max-w-xl"
                    style={{ color: "var(--text-muted)", borderColor: "var(--border)" }}>
                    {str(settings.contact_address) && (
                      <span className="flex items-center gap-2"><MapPin size={15} style={{ color: "var(--primary)" }} /> {str(settings.contact_address)}</span>
                    )}
                    {str(settings.contact_email) && (
                      <span className="flex items-center gap-2"><Mail size={15} style={{ color: "var(--primary)" }} /> {str(settings.contact_email)}</span>
                    )}
                  </div>
                )}
              </div>

              {/* ── Right: photo ── */}
              <div className="hidden lg:flex items-center justify-center">
                <HeroPhoto />
              </div>

            </div>
          </div>
        </section>

        {/* ── Stats Counter ── */}
        <StatsCounter stats={statsData} />

        {/* ── Experience ── */}
        <section className="py-24">
          <div className="container">
            <div className="grid lg:grid-cols-[0.8fr_1.2fr] gap-12 lg:gap-16">
              <div className="lg:sticky lg:top-32 self-start">
                <span className="badge mb-4 inline-flex">My Journey</span>
                <h2 className="section-title mb-4">Experience</h2>
                <p className="section-subtitle">
                  {expYears}+ years of building web products — from freelance projects to full-scale business systems.
                </p>
              </div>

              <ol className="relative">
                <div className="absolute left-[7px] top-2 bottom-2 w-px" style={{ background: "var(--border)" }} aria-hidden />
                {timeline.map((item) => (
                  <li key={item.role + item.year_label} className="relative pl-10 pb-6 last:pb-0">
                    <span className="absolute left-0 top-6 w-[15px] h-[15px] rounded-full border-[3px]"
                      style={{ background: "var(--bg)", borderColor: "var(--primary)" }} aria-hidden />
                    <div className="card p-6 hover:-translate-y-0.5">
                      <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                        <div>
                          <h3 className="font-semibold text-lg">{item.role}</h3>
                          <div className="text-sm font-medium" style={{ color: "var(--primary)" }}>{item.company}</div>
                        </div>
                        <span className="chip shrink-0">{item.year_label}</span>
                      </div>
                      <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>{item.description}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>


        {/* ── My Recent Work — 3D sliding showcase ── */}
        <RecentWork works={recentWorks} />

        <ServicesSection />

        <ProcessSection />

        <Testimonials reviews={testimonials} />

        <BlogPreview />

        {/* ── Tech Stack Slider ── */}
        <TechStackSlider />

        {/* ── CTA ── */}
        <section className="py-24">
          <div className="container">
            <div className="theme-dark relative overflow-hidden rounded-3xl px-6 py-14 md:p-20 text-center">
              <div className="absolute inset-0 pointer-events-none" aria-hidden>
                <div className="absolute inset-0 bg-grid bg-grid-fade opacity-60" />
                <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[560px] h-[360px] rounded-full blur-3xl"
                  style={{ background: "radial-gradient(ellipse, rgba(237,28,36,0.35) 0%, transparent 70%)" }} />
              </div>
              <div className="relative">
                <span className="badge mb-6 inline-flex">
                  <CheckCircle size={13} /> Let&apos;s Build Together
                </span>
                <h2 className="section-title mb-5" style={{ fontSize: "clamp(2.2rem, 5vw, 3.5rem)" }}>
                  Have a project <span className="gradient-text">in mind?</span>
                </h2>
                <p className="section-subtitle mx-auto mb-9">
                  Let&apos;s discuss your idea and turn it into a reality. Available for freelance
                  projects, long-term contracts, and consulting.
                </p>
                <div className="flex flex-wrap gap-3 justify-center">
                  <Link href="/contact" className="btn-primary text-base py-3 px-8">
                    Start a Project <ArrowRight size={18} />
                  </Link>
                  <Link href="/pricing" className="btn-glow text-base py-3 px-8">
                    View Pricing
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
