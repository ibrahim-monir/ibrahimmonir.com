import type { Metadata } from "next";
import PackagesClient from "./PackagesClient";

export const metadata: Metadata = { title: "Packages & Pricing", description: "Transparent pricing packages for web development services." };

export default function PackagesPage() {
  return (
    <div className="py-20">
      <div className="container">
        <div className="text-center mb-16">
          <span className="badge mb-4 inline-flex">Pricing</span>
          <h1 className="section-title mb-4">Simple, Transparent Pricing</h1>
          <p className="section-subtitle mx-auto">
            No hidden fees. Choose a package that fits your needs or let&apos;s build something custom.
          </p>
        </div>

        <PackagesClient />
      </div>
    </div>
  );
}
