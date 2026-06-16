'use client';
import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Download, Package } from "lucide-react";

const categories = ["All", "Theme", "Plugin", "System", "Script"];

const products = [
  { title: "AdminPro Dashboard",   category: "Theme",  price: "$49",  downloads: 320, desc: "Modern Laravel Filament admin theme with dark mode and 20+ widgets.",                              tags: ["Laravel", "Filament", "Tailwind"] },
  { title: "LaraInvoice",          category: "Plugin", price: "$29",  downloads: 185, desc: "Complete invoicing plugin for Laravel with PDF export and payment tracking.",                     tags: ["Laravel", "PHP"] },
  { title: "NextPortfolio Starter",category: "Theme",  price: "Free", downloads: 890, desc: "Minimal portfolio starter template built with Next.js 14 and Tailwind CSS.",                     tags: ["Next.js", "TypeScript"] },
  { title: "MultiVendor Core",     category: "System", price: "$199", downloads: 45,  desc: "Ready-made multi-vendor marketplace with vendor dashboard and commission management.",           tags: ["Laravel", "React"] },
  { title: "SMSNotify",            category: "Plugin", price: "$19",  downloads: 267, desc: "Laravel package for sending SMS via multiple gateways (Twilio, Nexmo, custom).",               tags: ["Laravel", "PHP"] },
  { title: "LMS Starter Kit",      category: "System", price: "$149", downloads: 67,  desc: "Learning management system with courses, quizzes, and student progress tracking.",              tags: ["Laravel", "Next.js"] },
];

export default function ProductsClient() {
  const [active, setActive] = useState("All");

  const filtered = active === "All" ? products : products.filter(p => p.category === active);

  return (
    <>
      {/* Filter buttons */}
      <div className="flex flex-wrap gap-2 justify-center mb-12">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setActive(c)}
            className="px-5 py-2 rounded-lg text-sm font-medium transition-all"
            style={{
              background: active === c ? "var(--primary)" : "transparent",
              color: active === c ? "#fff" : "var(--text-muted)",
              border: `1px solid ${active === c ? "var(--primary)" : "var(--border)"}`,
            }}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Product grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((p) => (
          <div key={p.title} className="card overflow-hidden hover:border-orange-500/50 transition-all group">
            <div className="h-44 flex items-center justify-center" style={{ background: "var(--bg-muted)" }}>
              <div className="text-center">
                <Package size={40} style={{ color: "var(--text-muted)", margin: "0 auto 8px" }} />
                <span className="badge">{p.category}</span>
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="font-bold text-lg">{p.title}</h3>
                <span className="font-bold text-sm shrink-0"
                  style={{ color: p.price === "Free" ? "var(--success)" : "var(--accent)" }}>
                  {p.price}
                </span>
              </div>
              <p className="text-sm mb-4 leading-relaxed" style={{ color: "var(--text-muted)" }}>{p.desc}</p>
              <div className="flex flex-wrap gap-2 mb-5">
                {p.tags.map((t) => (
                  <span key={t} className="text-xs px-2 py-1 rounded-md"
                    style={{ background: "rgba(249,115,22,0.1)", color: "#fb923c" }}>
                    {t}
                  </span>
                ))}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs flex items-center gap-1" style={{ color: "var(--text-muted)" }}>
                  <Download size={12} /> {p.downloads} downloads
                </span>
                <Link href="/contact" className="flex items-center gap-1 text-sm font-medium"
                  style={{ color: "var(--primary)" }}>
                  Get It <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center py-16" style={{ color: "var(--text-muted)" }}>
          No products in this category yet.
        </p>
      )}
    </>
  );
}
