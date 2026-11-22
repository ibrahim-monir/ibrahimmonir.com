"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, BadgeCheck, CreditCard, MousePointerClick, Rocket, Smartphone, Landmark } from "lucide-react";
import PricingClient from "@/app/(public)/pricing/PricingClient";

const STEPS = [
  { icon: MousePointerClick, title: "Pick a package", desc: "Choose the plan that fits and click Order Now." },
  { icon: CreditCard, title: "Pay the advance", desc: "Send the advance by bKash, Nagad or bank transfer and enter the transaction ID." },
  { icon: BadgeCheck, title: "Payment verified", desc: "I confirm your payment, usually within a few hours, and email you." },
  { icon: Rocket, title: "Kick-off", desc: "We start with a short discovery call. You track progress in your client portal." },
];

/**
 * "Packages & Pricing" block for a service page: the price table (only
 * packages assigned to this service in Admin → Pricing) plus how ordering
 * works. Hides itself when the service has no packages.
 */
export default function ServicePackages({ slug, title, color }: { slug: string; title: string; color: string }) {
  const [empty, setEmpty] = useState(false);
  if (empty) return null;

  return (
    <section id="packages" className="py-20 scroll-mt-24" style={{ background: "var(--bg-muted)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-widest" style={{ color }}>Packages &amp; Pricing</span>
          <h2 className="section-title mt-3 mb-3">{title} Packages</h2>
          <p style={{ color: "var(--text-muted)" }}>
            Fixed prices, clear deliverables. Order online, pay an advance to book your slot, and the rest on delivery.
          </p>
        </div>

        <PricingClient service={slug} accent={color} onEmpty={() => setEmpty(true)} />

        {/* How ordering works */}
        <div className="mt-6 rounded-2xl p-6 md:p-8" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <h3 className="font-bold text-lg">How ordering works</h3>
            <div className="flex items-center gap-2 text-xs font-semibold">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={{ background: "#e2136e14", color: "#e2136e" }}><Smartphone size={13} /> bKash</span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={{ background: "#f6921e14", color: "#f6921e" }}><Smartphone size={13} /> Nagad</span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={{ background: "#2563eb14", color: "#2563eb" }}><Landmark size={13} /> Bank</span>
            </div>
          </div>
          <ol className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {STEPS.map(({ icon: Icon, title: t, desc }, i) => (
              <li key={t} className="flex gap-3">
                <span className="w-10 h-10 shrink-0 rounded-xl flex items-center justify-center" style={{ background: color + "1a", color }}>
                  <Icon size={18} />
                </span>
                <div>
                  <p className="font-semibold text-sm mb-1">{i + 1}. {t}</p>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>{desc}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="text-sm mt-6" style={{ color: "var(--text-muted)" }}>
            Not sure which package fits?{" "}
            <Link href="/contact" className="font-semibold inline-flex items-center gap-1" style={{ color }}>
              Ask me first <ArrowRight size={13} />
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
