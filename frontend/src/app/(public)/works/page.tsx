import type { Metadata } from "next";
import WorksClient, { type WorkItem } from "./WorksClient";

export const metadata: Metadata = { title: "Works", description: "Portfolio of web development projects built with Laravel, Next.js, and more." };

// Shown only if the backend has no works yet, so the page never looks empty.
const FALLBACK_WORKS: WorkItem[] = [
  { title: "Multi-vendor E-commerce Platform", category: "E-Commerce", technologies: ["Laravel", "React", "MySQL", "Redis"], description: "Full-featured marketplace with vendor management, Stripe payments, and real-time inventory.", url: "/contact" },
  { title: "SaaS Project Management Tool", category: "SaaS", technologies: ["Laravel", "Next.js", "PostgreSQL"], description: "Team collaboration platform with kanban boards, time tracking, and client invoicing.", url: "/contact" },
  { title: "Healthcare Appointment System", category: "Laravel", technologies: ["Laravel", "Vue.js", "MySQL"], description: "Patient scheduling, doctor availability management, and SMS/email reminders.", url: "/contact" },
  { title: "Real Estate Listing Portal", category: "Next.js", technologies: ["Next.js", "Laravel API", "MySQL"], description: "Property listings with advanced search, virtual tours, and agent management.", url: "/contact" },
  { title: "Restaurant POS System", category: "Web App", technologies: ["Laravel", "React", "MySQL"], description: "Complete point-of-sale with table management, kitchen display, and inventory tracking.", url: "/contact" },
  { title: "Learning Management System", category: "SaaS", technologies: ["Laravel", "Next.js", "PostgreSQL"], description: "Course creation platform with video hosting, quizzes, and certificate generation.", url: "/contact" },
];

export default async function WorksPage() {
  const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";
  const worksRaw = await fetch(`${API}/works`, { cache: "no-store" })
    .then((r) => (r.ok ? r.json() : []))
    .catch(() => []);
  const works: WorkItem[] = Array.isArray(worksRaw) && worksRaw.length ? worksRaw : FALLBACK_WORKS;

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

        <WorksClient works={works} />
      </div>
    </div>
  );
}
