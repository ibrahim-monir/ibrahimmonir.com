import type { Metadata } from "next";
import { Package } from "lucide-react";
import ProductsClient from "./ProductsClient";

export const metadata: Metadata = {
  title: "Products",
  description: "Premium themes, plugins, and ready-made systems by Ibrahim Monir.",
};

export default function ProductsPage() {
  return (
    <div className="py-20">
      <div className="container">
        <div className="text-center mb-16">
          <span className="badge mb-4 inline-flex">
            <Package size={13} /> Products
          </span>
          <h1 className="section-title mb-4">Themes, Plugins &amp; Systems</h1>
          <p className="section-subtitle mx-auto">
            Ready-made products to kickstart your project. Themes, plugins, and complete systems.
          </p>
        </div>

        <ProductsClient />
      </div>
    </div>
  );
}
