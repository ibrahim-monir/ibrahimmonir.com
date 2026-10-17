'use client';
import { useEffect, useMemo, useState } from "react";

const DEFAULT_ROLES = [
  "Full-Stack Web Developer",
  "WordPress Expert",
  "Laravel Developer",
  "Next.js Developer",
  "SaaS Builder",
];

export default function HeroTypewriter({ initial, roles }: { initial?: string; roles?: string[] }) {
  const texts = useMemo(() => {
    const base = roles && roles.length > 0 ? roles : DEFAULT_ROLES;
    return initial && !base.includes(initial) ? [initial, ...base] : base;
  }, [initial, roles]);

  const [idx, setIdx]           = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [deleting, setDeleting]   = useState(false);
  const [paused, setPaused]       = useState(false);

  useEffect(() => {
    if (paused) return;
    const current = texts[idx];
    const delay   = deleting ? 35 : displayed.length === 0 ? 400 : 80;

    const t = setTimeout(() => {
      if (!deleting) {
        const next = current.slice(0, displayed.length + 1);
        setDisplayed(next);
        if (next === current) {
          setPaused(true);
          setTimeout(() => { setPaused(false); setDeleting(true); }, 2200);
        }
      } else {
        const next = current.slice(0, displayed.length - 1);
        setDisplayed(next);
        if (next === "") {
          setDeleting(false);
          setIdx((i) => (i + 1) % texts.length);
        }
      }
    }, delay);

    return () => clearTimeout(t);
  }, [displayed, deleting, paused, idx, texts]);

  return (
    <p className="font-semibold mb-6" style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(1.3rem, 2.4vw, 1.75rem)", lineHeight: 1.3, minHeight: "2.3rem", letterSpacing: "-0.02em" }}>
      <span className="font-mono mr-2" style={{ color: "var(--primary)", fontSize: "0.85em" }}>&gt;</span>
      <span className="gradient-text">
      {displayed}</span>
      <span
        className="inline-block w-[3px] h-6 ml-1 align-middle animate-pulse"
        style={{ background: "var(--primary)", verticalAlign: "middle" }}
      />
    </p>
  );
}
