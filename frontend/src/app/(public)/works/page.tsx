import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";

export const metadata: Metadata = { title: "Works", description: "Portfolio of web development projects built with Laravel, Next.js, and more." };

const categories = ["All", "Web App", "SaaS", "E-commerce", "API", "Mobile"];

const works = [
  { title: "Multi-vendor E-commerce Platform", category: "E-commerce", technologies: ["Laravel", "React", "MySQL", "Redis"], desc: "Full-featured marketplace with vendor management, stripe payments, and real-time inventory.", url: "#" },
  { title: "SaaS Project Management Tool", category: "SaaS", technologies: ["Laravel", "Next.js", "PostgreSQL"], desc: "Team collaboration platform with kanban boards, time tracking, and client invoicing.", url: "#" },
  { title: "Healthcare Appointment System", category: "Web App", technologies: ["Laravel", "Vue.js", "MySQL"], desc: "Patient scheduling, doctor availability management, and SMS/email reminders.", url: "#" },
  { title: "Real Estate Listing Portal", category: "Web App", technologies: ["Next.js", "Laravel API", "MySQL"], desc: "Property listings with advanced search, virtual tours, and agent management.", url: "#" },
  { title: "Restaurant POS System", category: "Web App", technologies: ["Laravel", "React", "MySQL"], desc: "Complete point-of-sale with table management, kitchen display, and inventory tracking.", url: "#" },
  { title: "Learning Management System", category: "SaaS", technologies: ["Laravel", "Next.js", "PostgreSQL"], desc: "Course creation platform with video hosting, quizzes, and certificate generation.", url: "#" },
];

export default function WorksPage() {
  return (
    <div className="py-20">
      <div className="container">
        <div className="text-center mb-16">
          <span className="badge mb-4 inline-flex">Portfolio</span>
          <h1 className="section-title mb-4">Selected Works</h1>
          <p className="section-subtitle mx-auto">
            A collection of projects I&apos;ve built for clients around the world.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 justify-center mb-12">
          {categories.map((c) => (
            <button key={c}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${c === "All" ? "btn-primary py-2" : "btn-outline py-2"}`}>
              {c}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {works.map((w) => (
            <div key={w.title} className="card overflow-hidden hover:border-orange-500/50 transition-all group">
              <div className="h-48 flex items-center justify-center"
                style={{ background: "var(--bg-muted)" }}>
                <span className="badge">{w.category}</span>
              </div>
              <div className="p-6">
                <h3 className="font-bold text-lg mb-2 group-hover:text-orange-400 transition-colors">{w.title}</h3>
                <p className="text-sm mb-4 leading-relaxed" style={{ color: "var(--text-muted)" }}>{w.desc}</p>
                <div className="flex flex-wrap gap-2 mb-5">
                  {w.technologies.map((t) => (
                    <span key={t} className="text-xs px-2 py-1 rounded-md"
                      style={{ background: "rgba(249,115,22,0.1)", color: "#fb923c" }}>{t}</span>
                  ))}
                </div>
                <a href={w.url} className="flex items-center gap-2 text-sm font-medium transition-colors"
                  style={{ color: "var(--primary)" }}>
                  View Project <ExternalLink size={14} />
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="mb-4" style={{ color: "var(--text-muted)" }}>Want to see more? Let&apos;s discuss your project.</p>
          <Link href="/contact" className="btn-primary">
            Start a Project <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
