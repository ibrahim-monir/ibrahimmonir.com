'use client';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import BrandLogo from "@/components/BrandLogo";
import type { ServiceNavItem } from "@/lib/services";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/works", label: "Works" },
  { href: "/products", label: "Products" },
  { href: "/pricing", label: "Pricing" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar({ services = [] }: { services?: ServiceNavItem[] }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);

  return (
    <header className="fixed top-9 left-0 right-0 z-40 border-b backdrop-blur-md"
      style={{ background: "rgba(13,13,13,0.92)", borderColor: "var(--border)" }}>
      <nav className="container flex items-center justify-between h-16">

        <Link href="/" className="flex items-center">
          <BrandLogo fontSize="1.35rem" />
        </Link>

        <ul className="hidden md:flex items-center gap-1">
          {navLinks.map((l) => {
            if (l.href === "/services" && services.length > 0) {
              const active = pathname === "/services" || pathname.startsWith("/services/");
              return (
                <li key={l.href} className="relative group">
                  <Link href={l.href}
                    className="px-3 py-2 rounded-lg text-base font-medium transition-colors hover:text-white inline-flex items-center gap-1"
                    style={{
                      color: active ? "var(--text)" : "var(--text-muted)",
                      background: active ? "var(--bg-muted)" : undefined,
                    }}>
                    {l.label}
                    <ChevronDown size={14} className="transition-transform group-hover:rotate-180" />
                  </Link>

                  {/* Dropdown — shown on hover, bridged so the gap doesn't close it */}
                  <div className="absolute left-0 top-full pt-2 opacity-0 invisible translate-y-1 transition-all duration-150 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 z-50">
                    <ul className="w-64 rounded-xl p-2 shadow-xl"
                      style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
                      {services.map((s) => (
                        <li key={s.slug}>
                          <Link href={`/services/${s.slug}`}
                            className="block px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:text-white hover:bg-[var(--bg-muted)]"
                            style={{ color: pathname === `/services/${s.slug}` ? "var(--text)" : "var(--text-muted)" }}>
                            {s.title}
                          </Link>
                        </li>
                      ))}
                      <li className="mt-1 pt-1" style={{ borderTop: "1px solid var(--border)" }}>
                        <Link href="/services"
                          className="block px-3 py-2 rounded-lg text-sm font-semibold transition-colors hover:text-white"
                          style={{ color: "var(--primary)" }}>
                          View All Services
                        </Link>
                      </li>
                    </ul>
                  </div>
                </li>
              );
            }

            return (
              <li key={l.href}>
                <Link href={l.href}
                  className="px-3 py-2 rounded-lg text-base font-medium transition-colors hover:text-white"
                  style={{
                    color: pathname === l.href ? "var(--text)" : "var(--text-muted)",
                    background: pathname === l.href ? "var(--bg-muted)" : undefined,
                  }}>
                  {l.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="hidden md:flex items-center gap-3">
          <Link href="/login"
            className="text-sm font-semibold py-1.5 px-4 rounded-lg transition-all hover:brightness-110"
            style={{ background: "var(--primary)", color: "#fff" }}>
            Client Login
          </Link>
        </div>

        <button className="md:hidden p-2" onClick={() => setOpen(!open)}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {open && (
        <div className="md:hidden border-t py-4" style={{ borderColor: "var(--border)", background: "var(--bg-card)" }}>
          <div className="container flex flex-col gap-1">
            {navLinks.map((l) => {
              if (l.href === "/services" && services.length > 0) {
                const active = pathname === "/services" || pathname.startsWith("/services/");
                return (
                  <div key={l.href}>
                    <div className="flex items-center">
                      <Link href={l.href}
                        onClick={() => setOpen(false)}
                        className="flex-1 px-3 py-2.5 rounded-lg text-base font-medium"
                        style={{
                          color: active ? "var(--text)" : "var(--text-muted)",
                          background: active ? "var(--bg-muted)" : undefined,
                        }}>
                        {l.label}
                      </Link>
                      <button type="button"
                        onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                        aria-label="Toggle services submenu"
                        className="p-2.5">
                        <ChevronDown size={16}
                          className="transition-transform"
                          style={{ transform: mobileServicesOpen ? "rotate(180deg)" : undefined, color: "var(--text-muted)" }} />
                      </button>
                    </div>
                    {mobileServicesOpen && (
                      <div className="flex flex-col gap-0.5 pl-4 mt-1 mb-1">
                        {services.map((s) => (
                          <Link key={s.slug} href={`/services/${s.slug}`}
                            onClick={() => setOpen(false)}
                            className="px-3 py-2 rounded-lg text-sm"
                            style={{ color: pathname === `/services/${s.slug}` ? "var(--text)" : "var(--text-muted)" }}>
                            {s.title}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link key={l.href} href={l.href}
                  onClick={() => setOpen(false)}
                  className="px-3 py-2.5 rounded-lg text-base font-medium"
                  style={{
                    color: pathname === l.href ? "var(--text)" : "var(--text-muted)",
                    background: pathname === l.href ? "var(--bg-muted)" : undefined,
                  }}>
                  {l.label}
                </Link>
              );
            })}
            <Link href="/login"
              className="flex mt-2 justify-center text-sm font-semibold py-2 px-4 rounded-lg"
              style={{ background: "var(--primary)", color: "#fff" }}>
              Client Login
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
