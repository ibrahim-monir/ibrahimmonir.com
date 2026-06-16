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
    <div className="flex flex-col items-center text-center px-8 py-2">
      <div
        className="font-extrabold leading-none mb-2 gradient-text"
        style={{ fontSize: "clamp(2.8rem, 5vw, 4rem)" }}
      >
        {count}{stat.suffix}
      </div>
      <div className="text-sm font-medium tracking-wide" style={{ color: "var(--text-muted)" }}>
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
    <div ref={ref} className="py-10">
      <div className="container">
        <div
          className="relative overflow-hidden rounded-2xl"
          style={{
            background: "linear-gradient(135deg, rgba(249,115,22,0.07) 0%, var(--bg-card) 50%, rgba(249,115,22,0.04) 100%)",
            border: "1px solid rgba(249,115,22,0.28)",
          }}
        >
          {/* Subtle center glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "radial-gradient(ellipse 70% 100% at 50% 50%, rgba(249,115,22,0.06) 0%, transparent 70%)",
            }}
          />

          <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 py-10">
            {stats.map((stat, i) => (
              <div key={stat.label} className="flex">
                <StatItem stat={stat} started={started} index={i} />
                {i < stats.length - 1 && (
                  <div
                    className="hidden md:block self-stretch w-px my-6 flex-shrink-0"
                    style={{ background: "rgba(249,115,22,0.2)" }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
