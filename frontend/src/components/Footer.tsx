'use client';
import { useEffect, useState } from "react";
import Link from "next/link";
import { Mail, MapPin } from "lucide-react";
import BrandLogo from "@/components/BrandLogo";
import { fetchSocialLinks, socialMeta, type SocialLink } from "@/lib/socialIcons";

const navCol = [
  { href: "/",         label: "Home"     },
  { href: "/services", label: "Services" },
  { href: "/works",    label: "Works"    },
  { href: "/blog",     label: "Blog"     },
  { href: "/contact",  label: "Contact"  },
];

const serviceCol = [
  { href: "/services", label: "WordPress Development" },
  { href: "/services", label: "Laravel Apps"          },
  { href: "/services", label: "Next.js / React"       },
  { href: "/services", label: "API Development"       },
  { href: "/services", label: "Business Systems"      },
];

const productCol = [
  { href: "/products",  label: "Themes"   },
  { href: "/products",  label: "Plugins"  },
  { href: "/products",  label: "Systems"  },
  { href: "/pricing",   label: "Pricing"  },
];

export default function Footer() {
  const [links, setLinks] = useState<SocialLink[]>([]);

  useEffect(() => {
    fetchSocialLinks().then(setLinks);
  }, []);

  return (
    <footer style={{ background: "var(--bg-card)", borderTop: "1px solid var(--border)" }}>

      {/* Main footer content */}
      <div className="container" style={{ padding: "64px 24px 48px" }}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">

          {/* Brand col — wider */}
          <div className="lg:col-span-4">
            <Link href="/" className="inline-block mb-5">
              <BrandLogo fontSize="1.6rem" />
            </Link>
            <p className="text-sm leading-relaxed mb-6" style={{ color: "var(--text-muted)", maxWidth: 300 }}>
              Full-stack developer crafting premium WordPress, Laravel &amp; Next.js solutions.
              Turning ideas into scalable, high-performance web products.
            </p>

            {/* Contact details */}
            <ul className="space-y-2 mb-7">
              <li className="flex items-center gap-2.5 text-sm" style={{ color: "var(--text-muted)" }}>
                <MapPin size={14} style={{ color: "var(--primary)", flexShrink: 0 }} />
                Dhaka, Bangladesh
              </li>
              <li>
                <a href="mailto:ibrahimkhalilmp@gmail.com"
                  className="flex items-center gap-2.5 text-sm transition-colors hover:text-white"
                  style={{ color: "var(--text-muted)" }}>
                  <Mail size={14} style={{ color: "var(--primary)", flexShrink: 0 }} />
                  ibrahimkhalilmp@gmail.com
                </a>
              </li>
            </ul>

            {/* Social icons */}
            <div className="flex items-center gap-2.5">
              {links.map((s) => {
                const { label, Icon } = socialMeta(s.platform);
                return (
                  <a key={s.platform} href={s.url} target="_blank" rel="noopener noreferrer"
                    aria-label={label}
                    className="flex items-center justify-center rounded-lg transition-all hover:-translate-y-0.5"
                    style={{
                      width: 38, height: 38,
                      border: "1px solid var(--border)",
                      color: "var(--text-muted)",
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.borderColor = "var(--primary)";
                      (e.currentTarget as HTMLElement).style.color = "var(--primary)";
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
                      (e.currentTarget as HTMLElement).style.color = "var(--text-muted)";
                    }}
                  >
                    <Icon size={18} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Spacer */}
          <div className="hidden lg:block lg:col-span-1" />

          {/* Navigation */}
          <div className="lg:col-span-2">
            <h4 style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 20 }}>
              Navigation
            </h4>
            <ul className="space-y-3">
              {navCol.map((l) => (
                <li key={l.label}>
                  <Link href={l.href}
                    className="text-sm transition-colors hover:text-white"
                    style={{ color: "var(--text-muted)" }}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="lg:col-span-3">
            <h4 style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 20 }}>
              Services
            </h4>
            <ul className="space-y-3">
              {serviceCol.map((l) => (
                <li key={l.label}>
                  <Link href={l.href}
                    className="text-sm transition-colors hover:text-white"
                    style={{ color: "var(--text-muted)" }}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Products */}
          <div className="lg:col-span-2">
            <h4 style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 20 }}>
              Products
            </h4>
            <ul className="space-y-3">
              {productCol.map((l) => (
                <li key={l.label}>
                  <Link href={l.href}
                    className="text-sm transition-colors hover:text-white"
                    style={{ color: "var(--text-muted)" }}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: "1px solid var(--border)" }}>
        <div className="container" style={{ padding: "20px 24px" }}>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              &copy; {new Date().getFullYear()} Ibrahim Monir. All rights reserved.
            </p>
            <div className="flex items-center gap-5">
              {[
                { href: "/privacy", label: "Privacy Policy" },
                { href: "/terms",   label: "Terms of Service" },
                { href: "/contact", label: "Contact"        },
              ].map((l) => (
                <Link key={l.label} href={l.href}
                  className="text-xs transition-colors hover:text-white"
                  style={{ color: "var(--text-muted)" }}>
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

    </footer>
  );
}
