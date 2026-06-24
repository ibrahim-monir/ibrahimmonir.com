import type { Metadata } from "next";
import Link from "next/link";
import TopBar from "@/components/TopBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { fetchSettings, str, arr } from "@/lib/settings";
import ParticlesBackground from "@/components/ParticlesBackground";
import HeroPhoto from "@/components/HeroPhoto";
import HeroTypewriter from "@/components/HeroTypewriter";
import TechStackSlider from "@/components/TechStackSlider";
import StatsCounter from "@/components/StatsCounter";
import Testimonials, { type TestimonialItem } from "@/components/Testimonials";
import BlogPreview from "@/components/BlogPreview";
import ServicesSection from "@/components/ServicesSection";
import ProcessSection from "@/components/ProcessSection";
import {
  ArrowRight, CheckCircle,
  MapPin, Mail, Download,
} from "lucide-react";


export const metadata: Metadata = {
  title: "Ibrahim Monir — Full-Stack Developer",
  description: "Building premium web experiences with Laravel, Next.js, and modern technologies.",
};




export default async function HomePage() {
  const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";
  const [settings, experiencesRaw, testimonialsRaw] = await Promise.all([
    fetchSettings(),
    fetch(`${API}/experiences`,   { cache: 'no-store' }).then(r => r.ok ? r.json() : []).catch(() => []),
    fetch(`${API}/testimonials`,  { cache: 'no-store' }).then(r => r.ok ? r.json() : []).catch(() => []),
  ]);
  const timeline: { role: string; company: string; year_label: string; description: string }[] = experiencesRaw;
  const testimonials: TestimonialItem[] = testimonialsRaw;
  const socialLinks = {
    social_github:    str(settings.social_github),
    social_linkedin:  str(settings.social_linkedin),
    social_facebook:  str(settings.social_facebook),
    social_twitter:   str(settings.social_twitter),
    social_instagram: str(settings.social_instagram),
    social_youtube:   str(settings.social_youtube),
  };

  const statsData = [
    { num: parseInt(str(settings.stat_projects_completed, "80")),  suffix: "+", label: "Projects Delivered" },
    { num: parseInt(str(settings.stat_clients_served,     "40")),  suffix: "+", label: "Happy Clients" },
    { num: parseInt(str(settings.stat_years_experience,   "5")),   suffix: "+", label: "Years Experience" },
    { num: parseInt(str(settings.stat_satisfaction,       "100")), suffix: "%", label: "Client Satisfaction" },
  ];

  return (
    <>
      <TopBar phone={str(settings.contact_phone)} socialLinks={socialLinks} />
      <Navbar />
      <main className="pt-[100px] flex-1">

        {/* ── Hero + About — single unified section ── */}
        <section className="relative overflow-hidden">
          <ParticlesBackground />

          <div className="absolute inset-0 pointer-events-none" aria-hidden>
            {/* Grid overlay */}
            <div className="absolute inset-0" style={{
              backgroundImage: "linear-gradient(rgba(249,115,22,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(249,115,22,0.04) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }} />
            {/* Corner glow */}
            <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full blur-3xl"
              style={{ background: "radial-gradient(circle, rgba(249,115,22,0.14) 0%, transparent 70%)" }} />
            {/* Light beam sweep */}
            <div className="hero-beam" />
            {/* Floating ring 1 */}
            <div className="hero-shape hero-shape-a" style={{ top: "15%", left: "8%", width: 56, height: 56, borderRadius: "50%", border: "1.5px solid rgba(249,115,22,0.25)" }} />
            {/* Floating ring 2 */}
            <div className="hero-shape hero-shape-b" style={{ top: "60%", left: "3%", width: 32, height: 32, borderRadius: "50%", border: "1px solid rgba(249,115,22,0.18)" }} />
            {/* Floating square */}
            <div className="hero-shape hero-shape-c" style={{ top: "75%", left: "30%", width: 18, height: 18, borderRadius: 4, border: "1.5px solid rgba(249,115,22,0.2)", transform: "rotate(20deg)" }} />
            {/* Floating dot cluster */}
            <div className="hero-shape hero-shape-a" style={{ top: "30%", left: "42%", width: 8, height: 8, borderRadius: "50%", background: "rgba(249,115,22,0.35)", animationDelay: "1s" }} />
            <div className="hero-shape hero-shape-b" style={{ top: "50%", left: "38%", width: 5, height: 5, borderRadius: "50%", background: "rgba(249,115,22,0.25)", animationDelay: "2s" }} />
          </div>

          <div className="container relative z-10">
            <div className="grid lg:grid-cols-2 gap-16 pt-24 md:pt-36 pb-24 items-stretch">

              {/* ── Left: About Me ── */}
              <div>
                {str(settings.hero_badge) && (
                  <span className="badge mb-4 inline-flex">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse mr-1" />
                    {str(settings.hero_badge)}
                  </span>
                )}
                <p className="text-base font-medium mb-2 mt-2" style={{ color: "var(--primary)" }}>
                  Hi, I&apos;m
                </p>
                <h1 style={{ fontSize: "clamp(2.4rem, 5vw, 3.5rem)", fontWeight: 800, lineHeight: 1.1, marginBottom: "0.5rem" }}>
                  {str(settings.site_name, "Ibrahim Monir")}
                </h1>
                <HeroTypewriter
                  initial={str(settings.hero_subheadline, "Full-Stack Web Developer")}
                  roles={arr(settings.hero_typewriter_roles)}
                />
                <p className="text-base leading-relaxed mb-8" style={{ color: "var(--text-muted)" }}>
                  {str(settings.hero_bio, "Passionate developer building scalable web applications with WordPress, Laravel & Next.js.")}
                </p>

                {/* Contact info */}
                <div className="flex flex-wrap items-center gap-5 mb-8 text-sm" style={{ color: "var(--text-muted)" }}>
                  {str(settings.contact_address) && (
                    <span className="flex items-center gap-2"><MapPin size={15} /> {str(settings.contact_address)}</span>
                  )}
                  {str(settings.contact_email) && (
                    <span className="flex items-center gap-2"><Mail size={15} /> {str(settings.contact_email)}</span>
                  )}
                </div>

                {/* CTAs */}
                <div className="flex flex-wrap items-center gap-4 mb-10">
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

              </div>

              {/* ── Right: photo ── */}
              <div className="hidden lg:flex items-center justify-center">
                <div className="sticky top-24">
                  <HeroPhoto />
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ── Stats Counter ── */}
        <StatsCounter stats={statsData} />

        {/* ── Tech Stack Slider ── */}
        <TechStackSlider />

        {/* ── 3rd: Experience ── */}
        <section className="py-20">
          <div className="container">
            <div className="text-center mb-14">
              <span className="badge mb-4 inline-flex">My Journey</span>
              <h2 className="section-title mb-4">Experience</h2>
              <p className="section-subtitle mx-auto">
                5+ years of building web products — from freelance projects to full-scale business systems.
              </p>
            </div>
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-px" style={{ background: "var(--border)" }} />
              <div className="space-y-6 pl-12">
                {timeline.map((item) => (
                  <div key={item.role + item.year_label} className="relative">
                    <div className="absolute -left-12 top-2 w-3 h-3 rounded-full"
                      style={{ background: "var(--primary)", boxShadow: "0 0 0 4px rgba(249,115,22,0.2)" }} />
                    <div className="p-6 rounded-xl transition-all duration-200 hover:-translate-y-0.5"
                      style={{
                        background: "linear-gradient(135deg, rgba(249,115,22,0.06) 0%, var(--bg-card) 60%)",
                        border: "1px solid rgba(249,115,22,0.28)",
                        borderLeft: "3px solid var(--primary)",
                      }}>
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div>
                          <h3 className="font-semibold text-lg">{item.role}</h3>
                          <div className="text-sm font-medium" style={{ color: "var(--primary)" }}>{item.company}</div>
                        </div>
                        <span className="badge text-xs shrink-0">{item.year_label}</span>
                      </div>
                      <p className="text-sm" style={{ color: "var(--text-muted)" }}>{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>


        <ServicesSection />

        <ProcessSection />

        <Testimonials reviews={testimonials} />

        <BlogPreview />

        {/* ── CTA ── */}
        <section className="py-20">
          <div className="container">
            <div className="card p-10 md:p-16 text-center relative overflow-hidden">
              <div className="absolute inset-0 pointer-events-none" aria-hidden>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full opacity-25 blur-3xl"
                  style={{ background: "var(--primary)" }} />
              </div>
              <div className="relative">
                <span className="badge mb-5 inline-flex">
                  <CheckCircle size={13} /> Let&apos;s Build Together
                </span>
                <h2 className="section-title mb-5">Have a project in mind?</h2>
                <p className="section-subtitle mx-auto mb-8">
                  Let&apos;s discuss your idea and turn it into a reality. Available for freelance
                  projects, long-term contracts, and consulting.
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <Link href="/contact" className="btn-primary text-base py-3 px-8">
                    Start a Project <ArrowRight size={18} />
                  </Link>
                  <Link href="/packages" className="btn-outline text-base py-3 px-8">
                    View Packages
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
