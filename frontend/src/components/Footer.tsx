'use client';
import Link from "next/link";
import { Mail, MapPin } from "lucide-react";
import BrandLogo from "@/components/BrandLogo";

const GithubIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
  </svg>
);

const LinkedinIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const XIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const socials = [
  { href: "https://github.com/ibrahimmonir",   Icon: GithubIcon,   label: "GitHub"   },
  { href: "https://linkedin.com/in/ibrahimmonir", Icon: LinkedinIcon, label: "LinkedIn" },
  { href: "https://twitter.com/ibrahimmonir",  Icon: XIcon,        label: "Twitter"  },
  { href: "mailto:ibrahimkhalilmp@gmail.com",  Icon: Mail,         label: "Email"    },
];

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
              {socials.map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                  aria-label={s.label}
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
                  <s.Icon />
                </a>
              ))}
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
                { href: "/terms",   label: "Terms of Use"   },
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
