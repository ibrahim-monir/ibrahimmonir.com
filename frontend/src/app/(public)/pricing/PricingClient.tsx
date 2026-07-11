"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle, Zap } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

interface PricingPlan {
  id: number;
  title: string;
  description: string;
  price: string;
  bdt_price: string | null;
  billing_cycle: string;
  features: string[];
  is_popular: boolean;
}

const billingLabel: Record<string, string> = {
  once: "one-time",
  monthly: "monthly",
  yearly: "yearly",
};

function formatUSD(price: string) {
  const n = parseFloat(price);
  return !n || isNaN(n) ? "Custom Quote" : "$" + n.toLocaleString("en-US");
}

function formatBDT(price: string | null) {
  if (!price) return "Custom Quote";
  const n = parseFloat(price);
  return !n || isNaN(n) ? "Custom Quote" : "৳" + n.toLocaleString("en-BD");
}

export default function PricingClient() {
  const [currency, setCurrency] = useState<"usd" | "bdt">("usd");
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/pricing`)
      .then((r) => r.json())
      .then((data) => setPlans(data))
      .finally(() => setLoading(false));
  }, []);

  // Default to BDT for visitors in Bangladesh's timezone — no IP lookup needed.
  useEffect(() => {
    Promise.resolve()
      .then(() => Intl.DateTimeFormat().resolvedOptions().timeZone)
      .then((tz) => {
        if (tz === "Asia/Dhaka") setCurrency("bdt");
      })
      .catch(() => {
        // Intl unsupported — keep the USD default.
      });
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin"
          style={{ borderColor: "var(--primary)", borderTopColor: "transparent" }} />
      </div>
    );
  }

  return (
    <>
      {/* Currency Toggle */}
      <div className="flex justify-center mb-12">
        <div className="flex items-center gap-1 p-1 rounded-full border"
          style={{ borderColor: "var(--border)", background: "var(--card)" }}>
          <button
            onClick={() => setCurrency("usd")}
            className={`px-5 py-1.5 rounded-full text-sm font-semibold transition-all ${
              currency === "usd" ? "text-white" : "hover:opacity-70"
            }`}
            style={currency === "usd" ? { background: "var(--primary)" } : { color: "var(--text-muted)" }}
          >
            USD $
          </button>
          <button
            onClick={() => setCurrency("bdt")}
            className={`px-5 py-1.5 rounded-full text-sm font-semibold transition-all ${
              currency === "bdt" ? "text-white" : "hover:opacity-70"
            }`}
            style={currency === "bdt" ? { background: "var(--primary)" } : { color: "var(--text-muted)" }}
          >
            BDT ৳
          </button>
        </div>
      </div>

      {/* Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`card p-8 flex flex-col relative transition-all ${
              plan.is_popular ? "border-orange-500 md:scale-105 z-10" : "hover:border-orange-500/50"
            }`}
            style={plan.is_popular ? { boxShadow: "0 24px 60px -18px rgba(249,115,22,0.4)" } : undefined}
          >
            {plan.is_popular && (
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
              <h3 className="font-bold text-xl mb-2">{plan.title}</h3>
              <div className="mb-3">
                {(() => {
                  const formatted = currency === "usd" ? formatUSD(plan.price) : formatBDT(plan.bdt_price);
                  const isCustom = formatted === "Custom Quote";
                  return (
                    <>
                      <span className={isCustom ? "text-2xl font-bold" : "text-4xl font-bold gradient-text"}>
                        {formatted}
                      </span>
                      {!isCustom && (
                        <span className="text-sm ml-2" style={{ color: "var(--text-muted)" }}>
                          / {billingLabel[plan.billing_cycle] ?? plan.billing_cycle}
                        </span>
                      )}
                    </>
                  );
                })()}
              </div>
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                {plan.description}
              </p>
            </div>
            <ul className="space-y-3 mb-8 flex-1">
              {(plan.features ?? []).map((f) => (
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
              href={`/contact?package=${encodeURIComponent(plan.title)}`}
              onClick={() =>
                trackEvent("select_pricing_package", {
                  package_name: plan.title,
                  price_usd: plan.price,
                  price_bdt: plan.bdt_price,
                  billing_cycle: plan.billing_cycle,
                })
              }
              className={plan.is_popular ? "btn-primary justify-center" : "btn-outline justify-center"}
            >
              Get Started <ArrowRight size={16} />
            </Link>
          </div>
        ))}
      </div>

      <p className="text-center mt-10 mb-6 text-sm" style={{ color: "var(--text-muted)" }}>
        Need something specific?{" "}
        <Link href="/contact" style={{ color: "var(--primary)" }} className="hover:underline">
          Let&apos;s talk
        </Link>
      </p>
    </>
  );
}
