'use client';
import Link from "next/link";

const socials = [
  {
    label: "GitHub",
    settingKey: "social_github",
    defaultHref: "https://github.com/ibrahim-monir",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2Z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    settingKey: "social_linkedin",
    defaultHref: "https://linkedin.com/in/ibrahimkhalilmp",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: "Facebook",
    settingKey: "social_facebook",
    defaultHref: "https://facebook.com/ibrahimmonir",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    label: "X / Twitter",
    settingKey: "social_twitter",
    defaultHref: "https://twitter.com/ibrahimmonir",
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
      </svg>
    ),
  },
];

interface TopBarProps {
  phone?: string;
  socialLinks?: Record<string, string>;
}

export default function TopBar({ phone, socialLinks }: TopBarProps) {
  const displayPhone = phone ?? "+880 1700-000000";

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
          {socials.map((s) => {
            const href = socialLinks?.[s.settingKey] || s.defaultHref;
            return (
              <Link
                key={s.label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                title={s.label}
                className="flex items-center justify-center w-7 h-7 rounded-lg transition-colors"
                style={{ color: "var(--text-muted)" }}
                onMouseOver={(e) => (e.currentTarget.style.color = "var(--accent)")}
                onMouseOut={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
              >
                {s.icon}
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
