"use client";

import { useState } from "react";
import { ChevronDown, MessageCircleQuestion, Wallet, Clock, ShieldCheck } from "lucide-react";

const faqs = [
  {
    q: "How long does a project take to complete?",
    a: "It depends on the package — a landing page is usually the quickest, while larger builds like e-commerce stores or custom systems take longer. You'll get a clear timeline before work starts.",
  },
  {
    q: "What's the payment process?",
    a: "Typically part of the amount is paid upfront to begin work, with the remainder due on delivery. Exact terms are confirmed together before the project starts.",
  },
  {
    q: "Are revisions included?",
    a: "Yes — reasonable revisions are included with every package to make sure the final result matches what you had in mind.",
  },
  {
    q: "Do the prices include hosting or a domain?",
    a: "No, hosting and domain are billed separately. I can help you set these up if you don't already have them.",
  },
  {
    q: "What if my project doesn't fit any package?",
    a: "No problem — reach out with your requirements and I'll put together a custom quote for you.",
  },
  {
    q: "Do you offer support after the project is delivered?",
    a: "Yes, the WordPress Support & Maintenance package covers ongoing updates and support — or we can arrange a custom support agreement for other stacks.",
  },
];

function FaqVisual() {
  return (
    <div
      className="relative rounded-2xl overflow-hidden h-full min-h-[420px] flex items-center justify-center"
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
      }}
    >
      <style>{`
        @keyframes faq-float {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-10px); }
        }
        @keyframes faq-pulse {
          0%, 100% { transform: scale(1);    box-shadow: 0 0 0 0 rgba(249,115,22,0.35); }
          50%      { transform: scale(1.05); box-shadow: 0 0 0 10px rgba(249,115,22,0); }
        }
        .faq-chip  { animation: faq-float 4.5s ease-in-out infinite; }
        .faq-icon  { animation: faq-pulse 3s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .faq-chip, .faq-icon { animation: none; }
        }
      `}</style>

      {/* Background photo */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/support-photo.jpg"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover"
      />
      {/* Tint overlay so the floating chips stay readable */}
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(145deg, rgba(15,10,5,0.35) 0%, rgba(10,8,6,0.75) 100%)" }}
      />

      {/* Center icon */}
      <div
        className="faq-icon relative z-10 flex items-center justify-center rounded-full"
        style={{ width: 120, height: 120, background: "rgba(249,115,22,0.14)", border: "1px solid rgba(249,115,22,0.35)", backdropFilter: "blur(4px)" }}
      >
        <MessageCircleQuestion size={52} style={{ color: "var(--primary)" }} />
      </div>

      {/* Floating info chips */}
      <div
        className="faq-chip absolute z-10 flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium"
        style={{ top: "14%", left: "8%", background: "var(--bg-muted)", border: "1px solid var(--border)", boxShadow: "0 12px 30px -12px rgba(0,0,0,.4)", animationDelay: "0s" }}
      >
        <Clock size={15} style={{ color: "var(--primary)" }} /> Fast Turnaround
      </div>

      <div
        className="faq-chip absolute z-10 flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium"
        style={{ bottom: "18%", left: "12%", background: "var(--bg-muted)", border: "1px solid var(--border)", boxShadow: "0 12px 30px -12px rgba(0,0,0,.4)", animationDelay: "1.2s" }}
      >
        <Wallet size={15} style={{ color: "var(--primary)" }} /> Transparent Pricing
      </div>

      <div
        className="faq-chip absolute z-10 flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium"
        style={{ bottom: "10%", right: "8%", background: "var(--bg-muted)", border: "1px solid var(--border)", boxShadow: "0 12px 30px -12px rgba(0,0,0,.4)", animationDelay: "2.4s" }}
      >
        <ShieldCheck size={15} style={{ color: "var(--primary)" }} /> No Hidden Fees
      </div>
    </div>
  );
}

export default function PricingFAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="pt-10 pb-20" style={{ borderTop: "1px solid var(--border)" }}>
      <div className="container">
        <div className="text-center mb-12">
          <span className="badge mb-4 inline-flex">FAQ</span>
          <h2 className="section-title mb-4">Frequently Asked Questions</h2>
          <p className="section-subtitle mx-auto">
            Answers to the questions clients ask most before getting started.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          <div className="flex flex-col gap-3">
            {faqs.map((item, i) => {
              const isOpen = open === i;
              return (
                <div key={item.q} className="card overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="w-full flex items-center justify-between gap-4 text-left px-6 py-4"
                    aria-expanded={isOpen}
                  >
                    <span className="font-semibold text-sm sm:text-base">{item.q}</span>
                    <ChevronDown
                      size={18}
                      className="shrink-0 transition-transform"
                      style={{ color: "var(--primary)", transform: isOpen ? "rotate(180deg)" : undefined }}
                    />
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

          <div className="hidden lg:block sticky top-24">
            <FaqVisual />
          </div>
        </div>
      </div>
    </section>
  );
}
