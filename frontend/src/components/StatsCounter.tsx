'use client';
import { useEffect, useRef, useState } from "react";

interface Stat {
  num: number;
  suffix: string;
  label: string;
}

interface StatsCounterProps {
  stats: Stat[];
}

function useCountUp(target: number, started: boolean, duration = 2000) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!started) return;
    const startTime = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setCount(Math.round(target * eased));
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }, [started, target, duration]);

  return count;
}

function StatItem({ stat, started, index }: { stat: Stat; started: boolean; index: number }) {
  const count = useCountUp(stat.num, started, 1800 + index * 120);

  return (
    <div className="flex flex-col items-start px-6 md:px-8 py-8">
      <div
        className="font-bold leading-none mb-3 tabular-nums"
        style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(2.4rem, 4.4vw, 3.4rem)", letterSpacing: "-0.04em", color: "var(--text)" }}
      >
        {count}<span style={{ color: "var(--primary)" }}>{stat.suffix}</span>
      </div>
      <div className="font-mono text-[0.7rem] uppercase tracking-[0.12em]" style={{ color: "var(--text-muted)" }}>
        {stat.label}
      </div>
    </div>
  );
}

export default function StatsCounter({ stats }: StatsCounterProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStarted(true); },
      { threshold: 0.25 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="relative z-20 -mt-10 md:-mt-12">
      <div className="container">
        <div
          className="grid grid-cols-2 md:grid-cols-4 rounded-2xl overflow-hidden"
          style={{ background: "var(--surface)", border: "1px solid var(--border)", boxShadow: "var(--shadow-lg)" }}
        >
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className={`relative ${i % 2 === 1 ? "border-l" : ""} ${i >= 2 ? "border-t md:border-t-0" : ""} ${i === 2 ? "md:border-l" : ""}`}
              style={{ borderColor: "var(--border)" }}
            >
              {i === 0 && <span className="absolute left-0 top-8 bottom-8 w-[3px] rounded-r" style={{ background: "var(--primary)" }} aria-hidden />}
              <StatItem stat={stat} started={started} index={i} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
