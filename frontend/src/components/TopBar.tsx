'use client';
import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchSocialLinks, socialMeta, type SocialLink } from "@/lib/socialIcons";

interface TopBarProps {
  phone?: string;
}

export default function TopBar({ phone }: TopBarProps) {
  const displayPhone = phone ?? "+880 1700-000000";
  const [links, setLinks] = useState<SocialLink[]>([]);

  useEffect(() => {
    fetchSocialLinks().then(setLinks);
  }, []);

  return (
    <div
      className="fixed top-0 left-0 right-0 z-50 flex items-center h-9"
      style={{
        background: "rgba(10,10,10,0.97)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        fontSize: "0.78rem",
      }}
    >
      <div className="container flex items-center justify-between h-full">
        {/* Left: Social Icons */}
        <div className="flex items-center gap-3">
          {links.map((s) => {
            const { label, Icon } = socialMeta(s.platform);
            return (
              <Link
                key={s.platform}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                title={label}
                className="flex items-center justify-center w-7 h-7 rounded-lg transition-colors"
                style={{ color: "var(--text-muted)" }}
                onMouseOver={(e) => (e.currentTarget.style.color = "var(--accent)")}
                onMouseOut={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
              >
                <Icon size={18} />
              </Link>
            );
          })}
        </div>

        {/* Right: Phone */}
        <Link
          href={`tel:${displayPhone.replace(/\s/g, "")}`}
          className="flex items-center gap-2 px-3 py-1 rounded-full transition-all"
          style={{
            background: "rgba(249,115,22,0.12)",
            border: "1px solid rgba(249,115,22,0.35)",
            color: "var(--primary)",
          }}
          onMouseOver={(e) => { e.currentTarget.style.background = "rgba(249,115,22,0.22)"; }}
          onMouseOut={(e) => { e.currentTarget.style.background = "rgba(249,115,22,0.12)"; }}
        >
          <span className="topbar-phone-blink">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.24h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.18 6.18l.95-.95a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
          </span>
          <span className="font-semibold" style={{ fontSize: "0.78rem", letterSpacing: "0.02em" }}>
            {displayPhone}
          </span>
        </Link>
      </div>
    </div>
  );
}
