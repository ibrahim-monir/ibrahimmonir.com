'use client';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import BrandLogo from "@/components/BrandLogo";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/works", label: "Works" },
  { href: "/products", label: "Products" },
  { href: "/packages", label: "Packages" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-9 left-0 right-0 z-40 border-b backdrop-blur-md"
      style={{ background: "rgba(13,13,13,0.92)", borderColor: "var(--border)" }}>
      <nav className="container flex items-center justify-between h-16">

        <Link href="/" className="flex items-center">
          <BrandLogo fontSize="1.35rem" />
        </Link>

        <ul className="hidden md:flex items-center gap-1">
          {navLinks.map((l) => (
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
          ))}
        </ul>

        <div className="hidden md:flex items-center gap-3">
          <Link href="/login" className="btn-outline text-base py-2">
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
            {navLinks.map((l) => (
              <Link key={l.href} href={l.href}
                onClick={() => setOpen(false)}
                className="px-3 py-2.5 rounded-lg text-base font-medium"
                style={{
                  color: pathname === l.href ? "var(--text)" : "var(--text-muted)",
                  background: pathname === l.href ? "var(--bg-muted)" : undefined,
                }}>
                {l.label}
              </Link>
            ))}
            <Link href="/login" className="btn-primary mt-2 justify-center text-base">
              Client Login
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
