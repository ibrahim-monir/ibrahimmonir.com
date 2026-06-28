"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle, Zap } from "lucide-react";

const packages = [
  {
    title: "Starter",
    usd: "$500",
    bdt: "৳55,000",
    billing: "one-time",
    popular: false,
    desc: "Perfect for small businesses and startups needing a professional online presence.",
    features: [
      "5-page responsive website",
      "Contact form",
      "Basic SEO setup",
      "Mobile optimized",
      "1 month support",
      "2 revisions",
    ],
  },
  {
    title: "Professional",
    usd: "$1,500",
    bdt: "৳1,65,000",
    billing: "one-time",
    popular: true,
    desc: "For growing businesses needing a full-featured web application.",
    features: [
      "Custom web application",
      "Admin dashboard",
      "User authentication",
      "Database design",
      "REST API",
      "3 months support",
      "Unlimited revisions",
      "Deployment assistance",
    ],
  },
  {
    title: "Enterprise",
    usd: "Custom",
    bdt: "Custom",
    billing: "project-based",
    popular: false,
    desc: "For complex systems, SaaS platforms, and long-term partnerships.",
    features: [
      "Everything in Professional",
      "SaaS / multi-tenancy",
      "Payment integration",
      "Real-time features",
      "Performance optimization",
      "6 months support",
      "Dedicated development",
      "Priority response",
    ],
  },
];

export default function PackagesClient() {
  const [currency, setCurrency] = useState<"usd" | "bdt">("usd");

  return (
    <>
      {/* Currency Toggle */}
      <div className="flex justify-center mb-12">
        <div className="flex items-center gap-1 p-1 rounded-full border"
          style={{ borderColor: "var(--border)", background: "var(--card)" }}>
          <button
            onClick={() => setCurrency("usd")}
            className={`px-5 py-1.5 rounded-full text-sm font-semibold transition-all ${
              currency === "usd"
                ? "text-white"
                : "hover:opacity-70"
            }`}
            style={currency === "usd" ? { background: "var(--primary)" } : { color: "var(--text-muted)" }}
          >
            USD $
          </button>
          <button
            onClick={() => setCurrency("bdt")}
            className={`px-5 py-1.5 rounded-full text-sm font-semibold transition-all ${
              currency === "bdt"
                ? "text-white"
                : "hover:opacity-70"
            }`}
            style={currency === "bdt" ? { background: "var(--primary)" } : { color: "var(--text-muted)" }}
          >
            BDT ৳
          </button>
        </div>
      </div>

      {/* Cards */}
      <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {packages.map((pkg) => (
          <div
            key={pkg.title}
            className={`card p-8 flex flex-col relative transition-all ${
              pkg.popular ? "border-orange-500" : "hover:border-orange-500/50"
            }`}
          >
            {pkg.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span
                  className="flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full"
                  style={{ background: "var(--primary)", color: "#fff" }}
                >
                  <Zap size={11} /> Most Popular
                </span>
              </div>
            )}
            <div className="mb-6">
              <h3 className="font-bold text-xl mb-2">{pkg.title}</h3>
              <div className="mb-3">
                <span className="text-4xl font-bold gradient-text">
                  {currency === "usd" ? pkg.usd : pkg.bdt}
                </span>
                <span className="text-sm ml-2" style={{ color: "var(--text-muted)" }}>
                  / {pkg.billing}
                </span>
              </div>
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                {pkg.desc}
              </p>
            </div>
            <ul className="space-y-3 mb-8 flex-1">
              {pkg.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm">
                  <CheckCircle
                    size={16}
                    className="shrink-0 mt-0.5"
                    style={{ color: "var(--success)" }}
                  />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/contact"
              className={pkg.popular ? "btn-primary justify-center" : "btn-outline justify-center"}
            >
              Get Started <ArrowRight size={16} />
            </Link>
          </div>
        ))}
      </div>

      <p className="text-center mt-10 text-sm" style={{ color: "var(--text-muted)" }}>
        Need something specific?{" "}
        <Link href="/contact" style={{ color: "var(--primary)" }} className="hover:underline">
          Let&apos;s talk
        </Link>
      </p>
    </>
  );
}
