"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ArrowRight, HelpCircle, DollarSign, Workflow, LifeBuoy } from "lucide-react";

interface FAQItem { q: string; a: string }
interface Category { id: string; label: string; icon: React.ComponentType<{ size?: number }>; items: FAQItem[] }

const CATEGORIES: Category[] = [
  {
    id: "general",
    label: "General",
    icon: HelpCircle,
    items: [
      {
        q: "What services do you offer?",
        a: "WordPress development, WooCommerce and custom e-commerce, Laravel backends, Next.js/React frontends, SaaS platforms, API development, custom plugins & themes, and business systems (ERP/CRM). See the Services page for details on each.",
      },
      {
        q: "How do we get started?",
        a: "Reach out via the contact form with a short description of what you need. I'll reply within 24 hours with questions or a scoped proposal — no obligation.",
      },
      {
        q: "Where are you based, and do you work with international clients?",
        a: "I'm based in Dhaka, Bangladesh, and work remotely with clients worldwide. Communication is entirely online — no location restrictions on who I can work with.",
      },
    ],
  },
  {
    id: "pricing",
    label: "Pricing & Payment",
    icon: DollarSign,
    items: [
      {
        q: "How is pricing determined?",
        a: "Pricing depends on scope and complexity. The Pricing page lists starting points for common project types, but every quote is confirmed after we've discussed your actual requirements.",
      },
      {
        q: "What's the payment process?",
        a: "Typically part of the amount is paid upfront to begin work, with the remainder due on delivery. Exact terms are confirmed together before the project starts.",
      },
      {
        q: "Do the prices include hosting or a domain?",
        a: "No, hosting and domain are billed separately. I can help you set these up if you don't already have them.",
      },
      {
        q: "What if my project doesn't fit any listed package?",
        a: "No problem — reach out with your requirements and I'll put together a custom quote for you.",
      },
    ],
  },
  {
    id: "process",
    label: "Process & Communication",
    icon: Workflow,
    items: [
      {
        q: "How long does a project take to complete?",
        a: "It depends on the scope — a landing page is usually the quickest, while larger builds like e-commerce stores or custom systems take longer. You'll get a clear timeline before work starts.",
      },
      {
        q: "Are revisions included?",
        a: "Yes — reasonable revisions are included with every project to make sure the final result matches what you had in mind.",
      },
      {
        q: "How will I track progress on my project?",
        a: "Every client gets access to a client portal where you can track progress in real time, download deliverables and files, message directly instead of emailing back and forth, and view invoices and payment status.",
      },
      {
        q: "Can you work with my existing site or codebase?",
        a: "In most cases, yes — I regularly take over and extend existing WordPress and Laravel projects rather than starting from scratch.",
      },
    ],
  },
  {
    id: "support",
    label: "Support & Maintenance",
    icon: LifeBuoy,
    items: [
      {
        q: "Do you offer support after launch?",
        a: "Yes. Every project includes a post-launch support window, and the WordPress Support & Maintenance package covers ongoing updates, backups, and security monitoring if you need it long-term.",
      },
      {
        q: "What happens if something breaks after delivery?",
        a: "Reach out through the contact form or your client portal and I'll take a look. Issues within the post-launch support window are fixed at no extra charge.",
      },
    ],
  },
];

export default function FAQClient() {
  const [open, setOpen] = useState<string | null>(`${CATEGORIES[0].id}-0`);

  return (
    <div className="container max-w-3xl">

      {/* Category quick-nav */}
      <div className="flex flex-wrap gap-2.5 justify-center mb-14">
        {CATEGORIES.map((cat) => (
          <a key={cat.id} href={`#${cat.id}`}
            className="inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-full transition-colors hover:border-orange-500"
            style={{ background: "var(--bg-card)", border: "1px solid var(--border)", color: "var(--text)" }}>
            <cat.icon size={14} />
            {cat.label}
          </a>
        ))}
      </div>

      {/* Categories */}
      <div className="flex flex-col gap-14">
        {CATEGORIES.map((cat) => (
          <section key={cat.id} id={cat.id} className="scroll-mt-28">
            <div className="flex items-center gap-2.5 mb-6">
              <span className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: "rgba(249,115,22,0.12)", color: "var(--primary)" }}>
                <cat.icon size={16} />
              </span>
              <h2 className="text-xl font-bold" style={{ color: "var(--text)" }}>{cat.label}</h2>
            </div>

            <div className="flex flex-col gap-3">
              {cat.items.map((item, i) => {
                const key = `${cat.id}-${i}`;
                const isOpen = open === key;
                return (
                  <div key={key} className="card overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setOpen(isOpen ? null : key)}
                      className="w-full flex items-center justify-between gap-4 text-left px-6 py-4"
                      aria-expanded={isOpen}>
                      <span className="font-semibold text-sm sm:text-base">{item.q}</span>
                      <ChevronDown size={18} className="shrink-0 transition-transform"
                        style={{ color: "var(--primary)", transform: isOpen ? "rotate(180deg)" : undefined }} />
                    </button>
                    {isOpen && (
                      <div className="px-6 pb-5 text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
                        {item.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      {/* CTA */}
      <div className="text-center mt-16 pt-12" style={{ borderTop: "1px solid var(--border)" }}>
        <h2 className="text-2xl font-bold mb-3" style={{ color: "var(--text)" }}>Still have questions?</h2>
        <p className="text-sm mb-7" style={{ color: "var(--text-muted)" }}>
          Can&apos;t find what you&apos;re looking for — reach out directly and I&apos;ll get back to you within 24 hours.
        </p>
        <Link href="/contact" className="btn-primary text-base py-3 px-8">
          Contact Me <ArrowRight size={18} />
        </Link>
      </div>
    </div>
  );
}
