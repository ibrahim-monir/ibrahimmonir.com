import type { Metadata } from "next";
import PricingClient from "./PricingClient";
import PricingFAQ from "./PricingFAQ";

export const metadata: Metadata = { title: "Pricing", description: "Transparent pricing plans for web development services." };

export default function PricingPage() {
  return (
    <div className="py-20">
      <div className="container">
        <div className="text-center mb-16">
          <span className="badge mb-4 inline-flex">Pricing</span>
          <h1 className="section-title mb-4">Simple, Transparent Pricing</h1>
          <p className="section-subtitle mx-auto">
            No hidden fees. Choose a plan that fits your needs or let&apos;s build something custom.
          </p>
        </div>

        <PricingClient />
      </div>

      <PricingFAQ />
    </div>
  );
}
