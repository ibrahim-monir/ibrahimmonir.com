import type { Metadata } from "next";
import { Package } from "lucide-react";
import ProductsClient from "./ProductsClient";

export const metadata: Metadata = {
  title: "Products",
  description: "Free WordPress and WooCommerce plugins built by Ibrahim Monir.",
};

export default function ProductsPage() {
  return (
    <div className="py-20">
      <div className="container">
        <div className="text-center mb-16">
          <span className="badge mb-4 inline-flex">
            <Package size={13} /> Products
          </span>
          <h1 className="section-title mb-4">WordPress &amp; WooCommerce Plugins</h1>
          <p className="section-subtitle mx-auto">
            Plugins I built and use on real client sites, free to download from GitHub.
          </p>
        </div>

        <ProductsClient />
      </div>
    </div>
  );
}
