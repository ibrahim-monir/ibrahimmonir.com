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
    <p className="text-xl font-medium mb-6 gradient-text" style={{ lineHeight: 1.3, minHeight: "1.8rem" }}>
      {displayed}
      <span
        className="inline-block w-0.5 h-5 ml-0.5 align-middle animate-pulse"
        style={{ background: "var(--primary)", verticalAlign: "middle" }}
      />
    </p>
  );
}
