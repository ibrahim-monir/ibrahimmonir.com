'use client';
import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Download } from "lucide-react";

const categories = ["All", "WordPress", "WooCommerce"];

// Ibrahim's own plugins. `href` is the public repo; without one, "Get It"
// goes to the contact page.
// Feature images live in the site's Media Library (Admin → Media).
const IMG = "/storage/media/2026/11";

const products: { title: string; category: string; price: string; desc: string; tags: string[]; href?: string; image: string }[] = [
  { title: "Smart Blogger Toolkit",      category: "WordPress",   price: "Free", desc: "Modular toolkit for bloggers: reading time, SEO basics, auto table of contents, related posts, Rank Math integration and a redirect manager.", tags: ["WordPress", "PHP"], href: "https://github.com/ibrahim-monir/smart-blogger-toolkit", image: `${IMG}/smart-blogger-toolkit.jpg` },
  { title: "Smart WP Migration",         category: "WordPress",   price: "Free", desc: "Back up, export and import a full WordPress site (database + files) as a single .wpress package.",                                            tags: ["WordPress", "PHP"], href: "https://github.com/ibrahim-monir/smart-wp-migration", image: `${IMG}/smart-wp-migration.jpg` },
  { title: "Ultra Addons for Side Cart", category: "WooCommerce", price: "Free", desc: "10+ add-ons for the WooCommerce side cart: extra cart features and upsells.",                                                                 tags: ["WooCommerce", "PHP", "JS"], href: "https://github.com/ibrahim-monir/Ultra-Addons-for-Side-Cart-Woocommerce", image: `${IMG}/ultra-addons-side-cart.jpg` },
  { title: "BOGO Offer with Badge",      category: "WooCommerce", price: "Free", desc: "Buy-one-get-one offers with product badges that highlight the deal on shop and product pages.",                                         tags: ["WooCommerce", "PHP"], href: "https://github.com/ibrahim-monir/bogo-offer-with-badge", image: `${IMG}/bogo-offer-badge.jpg` },
  { title: "Smart FSFSP",                category: "WooCommerce", price: "Ask",  desc: "Free-shipping rules for WooCommerce with an admin settings screen: set thresholds and conditions without code.",                        tags: ["WooCommerce", "PHP"], image: `${IMG}/smart-fsfsp.jpg` },
];

export default function ProductsClient() {
  const [active, setActive] = useState("All");

  const filtered = active === "All" ? products : products.filter(p => p.category === active);

  return (
    <>
      {/* Filter buttons */}
      <div className="flex flex-wrap gap-2 justify-center mb-12">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setActive(c)}
            className="px-5 py-2 rounded-lg text-sm font-medium transition-all"
            style={{
              background: active === c ? "var(--primary)" : "transparent",
              color: active === c ? "#fff" : "var(--text-muted)",
              border: `1px solid ${active === c ? "var(--primary)" : "var(--border)"}`,
            }}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Product grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((p) => (
          <div key={p.title} className="card overflow-hidden hover:border-[var(--primary)]/50 transition-all group">
            <div className="h-44 relative overflow-hidden" style={{ background: "var(--bg-muted)" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.image} alt={p.title} loading="lazy"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <span className="absolute top-3 left-3 text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-md shadow-sm"
                style={{ background: "rgba(255,255,255,0.95)", color: "#111" }}>{p.category}</span>
            </div>
            <div className="p-6">
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="font-bold text-lg">{p.title}</h3>
                <span className="font-bold text-sm shrink-0"
                  style={{ color: p.price === "Free" ? "var(--success)" : "var(--accent)" }}>
                  {p.price}
                </span>
              </div>
              <p className="text-sm mb-4 leading-relaxed" style={{ color: "var(--text-muted)" }}>{p.desc}</p>
              <div className="flex flex-wrap gap-2 mb-5">
                {p.tags.map((t) => (
                  <span key={t} className="text-xs px-2 py-1 rounded-md"
                    style={{ background: "rgba(237,28,36,0.1)", color: "#ED1C24" }}>
                    {t}
                  </span>
                ))}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs flex items-center gap-1" style={{ color: "var(--text-muted)" }}>
                  <Download size={12} /> {p.href ? "On GitHub" : "On request"}
                </span>
                {p.href ? (
                  <a href={p.href} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1 text-sm font-medium" style={{ color: "var(--primary)" }}>
                    Get It <ArrowRight size={14} />
                  </a>
                ) : (
                  <Link href="/contact" className="flex items-center gap-1 text-sm font-medium"
                    style={{ color: "var(--primary)" }}>
                    Get It <ArrowRight size={14} />
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center py-16" style={{ color: "var(--text-muted)" }}>
          No products in this category yet.
        </p>
      )}
    </>
  );
}
