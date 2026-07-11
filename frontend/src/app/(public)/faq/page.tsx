import type { Metadata } from "next";
import FAQClient from "./FAQClient";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Answers to common questions about services, pricing, process, and support.",
};

export default function FAQPage() {
  return (
    <div className="py-20">
      <div className="container">
        <div className="text-center mb-16">
          <span className="badge mb-4 inline-flex">FAQ</span>
          <h1 className="section-title mb-4">Frequently Asked Questions</h1>
          <p className="section-subtitle mx-auto">
            Everything you need to know before getting started. Can&apos;t find your answer? Reach out anytime.
          </p>
        </div>
      </div>

      <FAQClient />
    </div>
  );
}
