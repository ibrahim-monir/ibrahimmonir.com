'use client';
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Search, ClipboardList, Palette, Code2, ShieldCheck, Rocket, Workflow, type LucideIcon } from "lucide-react";

type Step = {
  num: string;
  title: string;
  desc: string;
  icon: LucideIcon;
};

const steps: Step[] = [
  { num: "01", title: "Discovery", desc: "I dive deep into your vision, scope, target users and goals before any code is written.", icon: Search },
  { num: "02", title: "Planning", desc: "I pick the right tech stack and map out a clear architecture, timeline and milestones.", icon: ClipboardList },
  { num: "03", title: "Design", desc: "I craft wireframes and pixel-perfect, responsive interfaces that feel intuitive and on-brand.", icon: Palette },
  { num: "04", title: "Development", desc: "I build clean, scalable code with well-structured APIs, databases and integrations.", icon: Code2 },
  { num: "05", title: "Testing & QA", desc: "I rigorously test for bugs, security and performance so everything runs fast and solid.", icon: ShieldCheck },
  { num: "06", title: "Launch", desc: "I deploy to production and provide ongoing maintenance, updates and dedicated support.", icon: Rocket },
];

// Brand-orange family only — varying shades give each card its own identity,
// echoing the reference infographic's per-card colors without leaving the palette.
const SHADES = ["#f97316", "#fb923c", "#ea580c", "#f59e0b", "#ff8c42", "#c2410c"];

function FlowArrow({ down = false, delay = 0 }: { down?: boolean; delay?: number }) {
  const base: CSSProperties = { width: 0, height: 0, animationDelay: `${delay}s` };
  const style: CSSProperties = down
    ? { ...base, borderLeft: "7px solid transparent", borderRight: "7px solid transparent", borderTop: "11px solid var(--primary)" }
    : { ...base, borderTop: "7px solid transparent", borderBottom: "7px solid transparent", borderLeft: "11px solid var(--primary)" };
  return <span className={down ? "proc-arrow-y" : "proc-arrow"} style={style} aria-hidden />;
}

function StepCard({ s, shade }: { s: Step; shade: string }) {
  const Icon = s.icon;
  return (
    <div className="proc-wrap group relative h-full">
      {/* stacked-paper shadow card, offset behind */}
      <div
        className="absolute inset-0 translate-x-2.5 translate-y-2.5 rounded-2xl transition-transform duration-300"
        style={{ background: "rgba(0,0,0,0.4)" }}
        aria-hidden
      />

      {/* front card */}
      <div
        className="proc-card relative h-full flex flex-col items-center text-center rounded-2xl border p-7 transition-all duration-300"
        style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}
      >
        {/* icon circle, top */}
        <span
          className="flex items-center justify-center rounded-full mb-5 transition-transform duration-300 group-hover:scale-110"
          style={{ width: 56, height: 56, background: shade }}
        >
          <Icon size={24} color="#fff" strokeWidth={2} />
        </span>

        <h3 className="text-base font-bold mb-2">{s.title}</h3>
        <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>{s.desc}</p>
      </div>
    </div>
  );
}

// Reveal wrapper — fades + slides each item up when scrolled into view.
function reveal(shown: boolean, index: number): CSSProperties {
  return {
    opacity: shown ? 1 : 0,
    transform: shown ? "none" : "translateY(28px)",
    transition: "opacity .6s ease, transform .6s ease",
    transitionDelay: `${index * 0.12}s`,
  };
}

type HubPath = { d: string; dot: [number, number] }[];

export default function ProcessSection() {
  const ref = useRef<HTMLDivElement>(null);
  const capsuleRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [shown, setShown] = useState(false);
  const [hub, setHub] = useState<{ w: number; h: number; top: HubPath; bottom: HubPath } | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ob = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          ob.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    ob.observe(el);
    return () => ob.disconnect();
  }, []);

  // Measure real card + capsule positions so every spoke lands exactly on
  // the capsule's edge and each card's own center — no guessed coordinates.
  useEffect(() => {
    function measure() {
      const container = ref.current, capsule = capsuleRef.current;
      const cards = cardRefs.current;
      if (!container || !capsule || cards.some((c) => !c)) return;

      const cRect = container.getBoundingClientRect();
      const capRect = capsule.getBoundingClientRect();
      const capX = capRect.left + capRect.width / 2 - cRect.left;
      const capTopY = capRect.top - cRect.top;
      const capBottomY = capRect.bottom - cRect.top;
      const spread = capRect.width * 0.28;
      const offsets = [-spread, 0, spread];

      const top: HubPath = [0, 1, 2].map((i) => {
        const r = cards[i]!.getBoundingClientRect();
        const x = r.left + r.width / 2 - cRect.left;
        const y = r.bottom - cRect.top;
        const hx = capX + offsets[i];
        return { d: `M ${x} ${y} Q ${x} ${capTopY} ${hx} ${capTopY}`, dot: [x, y] };
      });

      const bottom: HubPath = [3, 4, 5].map((i) => {
        const r = cards[i]!.getBoundingClientRect();
        const x = r.left + r.width / 2 - cRect.left;
        const y = r.top - cRect.top;
        const hx = capX + offsets[i - 3];
        return { d: `M ${hx} ${capBottomY} Q ${x} ${capBottomY} ${x} ${y}`, dot: [x, y] };
      });

      setHub({ w: cRect.width, h: cRect.height, top, bottom });
    }

    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  return (
    <section className="relative overflow-hidden py-24">
      <style>{`
        @keyframes proc-arrow-pulse   { 0%,100% { opacity:.45; transform: translateX(0); }  50% { opacity:1; transform: translateX(3px); } }
        @keyframes proc-arrow-pulse-y { 0%,100% { opacity:.45; transform: translateY(0); }  50% { opacity:1; transform: translateY(3px); } }
        .proc-arrow   { animation: proc-arrow-pulse 1.8s ease-in-out infinite; }
        .proc-arrow-y { animation: proc-arrow-pulse-y 1.8s ease-in-out infinite; }
        .proc-wrap:hover .proc-card { transform: translate(-2.5px, -2.5px); box-shadow: 0 18px 40px -20px rgba(249,115,22,0.5); }
        @keyframes proc-hub-flow { from { stroke-dashoffset: 100; } to { stroke-dashoffset: 0; } }
        .proc-hub-flow { stroke-dasharray: 18 82; animation: proc-hub-flow 2.2s linear infinite; }
        @keyframes proc-pulse-dot { 0%,100% { r: 3.5; opacity: .85; } 50% { r: 5; opacity: 1; } }
        .proc-hub-dot { animation: proc-pulse-dot 2s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) { .proc-arrow, .proc-arrow-y, .proc-hub-flow, .proc-hub-dot { animation: none !important; transition: none !important; } }
      `}</style>

      {/* Ambient glow */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[480px] rounded-full blur-3xl"
        style={{ background: "radial-gradient(ellipse, rgba(249,115,22,0.09) 0%, transparent 70%)" }}
        aria-hidden
      />

      <div className="container relative">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="badge mb-4 inline-flex">How I Work</span>
          <h2 className="section-title mb-4">
            My <span className="gradient-text">Process</span>
          </h2>
          <p className="section-subtitle mx-auto">
            A proven 6-step workflow I follow to take your project from a raw idea to a polished, launched product.
          </p>
        </div>

        {/* ── Desktop: hub-and-spoke — 3 cards up top, 3 below, all wired into a central capsule ── */}
        <div ref={ref} className="hidden lg:flex flex-col gap-20 relative">

          {/* Connector lines + dots, drawn behind everything else */}
          {hub && (
            <svg
              className="pointer-events-none absolute inset-0 w-full h-full z-0"
              viewBox={`0 0 ${hub.w} ${hub.h}`}
              aria-hidden
            >
              {[...hub.top, ...hub.bottom].map((p, i) => (
                <g key={i}>
                  {/* solid neutral base line */}
                  <path d={p.d} fill="none" stroke="var(--text-muted)" strokeWidth={1.75} strokeLinecap="round" opacity={0.4} />
                  {/* animated flowing highlight travelling along the same path */}
                  <path
                    className="proc-hub-flow"
                    d={p.d}
                    pathLength={100}
                    fill="none"
                    stroke={SHADES[i]}
                    strokeWidth={2.5}
                    strokeLinecap="round"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                  <circle className="proc-hub-dot" cx={p.dot[0]} cy={p.dot[1]} r={3.5} fill={SHADES[i]} style={{ animationDelay: `${i * 0.15}s` }} />
                </g>
              ))}
            </svg>
          )}

          {/* Top row */}
          <div className="flex items-stretch gap-8 relative z-10">
            {steps.slice(0, 3).map((s, i) => (
              <div key={s.num} className="flex-1" ref={(el) => { cardRefs.current[i] = el; }} style={reveal(shown, i)}>
                <StepCard s={s} shade={SHADES[i]} />
              </div>
            ))}
          </div>

          {/* Central capsule — with a faint outer track ring, matching the reference */}
          <div className="flex justify-center relative z-10">
            <div className="relative flex items-center justify-center">
              <div
                className="absolute rounded-full pointer-events-none"
                style={{ inset: -14, border: "1.5px solid rgba(249,115,22,0.25)" }}
                aria-hidden
              />
              <div
                ref={capsuleRef}
                className="relative flex items-center gap-3 rounded-full px-10 py-5 shadow-2xl"
                style={{ background: "linear-gradient(135deg, #fb923c, #f97316)", boxShadow: "0 24px 60px -20px rgba(249,115,22,0.55)" }}
              >
                <Workflow size={26} color="#fff" strokeWidth={2} />
                <div className="text-left">
                  <p className="font-extrabold text-lg leading-tight text-white">MY PROCESS</p>
                  <p className="text-xs font-medium text-white/80">Idea to Launch, in 6 Steps</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom row */}
          <div className="flex items-stretch gap-8 relative z-10">
            {steps.slice(3, 6).map((s, i) => (
              <div key={s.num} className="flex-1" ref={(el) => { cardRefs.current[i + 3] = el; }} style={reveal(shown, i + 3)}>
                <StepCard s={s} shade={SHADES[i + 3]} />
              </div>
            ))}
          </div>
        </div>

        {/* ── Tablet: 2 columns ── */}
        <div className="hidden sm:grid lg:hidden grid-cols-2 gap-x-6 gap-y-12">
          {steps.map((s, i) => (
            <div key={s.num} style={reveal(shown, i)}>
              <StepCard s={s} shade={SHADES[i]} />
            </div>
          ))}
        </div>

        {/* ── Mobile: stacked flow ── */}
        <div className="sm:hidden flex flex-col items-center gap-6">
          {steps.map((s, i) => (
            <div key={s.num} className="w-full max-w-md flex flex-col items-center gap-6">
              <div className="w-full" style={reveal(shown, i)}>
                <StepCard s={s} shade={SHADES[i]} />
              </div>
              {i < steps.length - 1 && <FlowArrow down delay={i * 0.2} />}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
