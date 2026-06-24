'use client';
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Search, ClipboardList, Palette, Code2, ShieldCheck, Rocket, type LucideIcon } from "lucide-react";

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

function FlowArrow({ down = false, delay = 0 }: { down?: boolean; delay?: number }) {
  const base: CSSProperties = { width: 0, height: 0, animationDelay: `${delay}s` };
  const style: CSSProperties = down
    ? { ...base, borderLeft: "7px solid transparent", borderRight: "7px solid transparent", borderTop: "11px solid var(--primary)" }
    : { ...base, borderTop: "7px solid transparent", borderBottom: "7px solid transparent", borderLeft: "11px solid var(--primary)" };
  return <span className={down ? "proc-arrow-y" : "proc-arrow"} style={style} aria-hidden />;
}

function StepCard({ s }: { s: Step }) {
  const Icon = s.icon;
  return (
    <div className="proc-wrap group relative h-full">
      {/* accent bracket frame — peeks around the top-right corner */}
      <div
        className="proc-tab absolute -top-2 -right-2 left-2 bottom-2 rounded-[1.5rem] transition-all duration-300"
        style={{ background: "linear-gradient(135deg, #fb923c, #f97316)" }}
        aria-hidden
      />

      {/* front card */}
      <div
        className="proc-card relative h-full flex flex-col items-center text-center rounded-[1.5rem] border pt-12 px-6 pb-8 transition-all duration-300"
        style={{ background: "var(--bg-card)", borderColor: "var(--border)", boxShadow: "0 18px 44px -26px rgba(0,0,0,0.85)" }}
      >
        {/* sheen sweep */}
        <span className="absolute inset-0 rounded-[1.5rem] overflow-hidden pointer-events-none" aria-hidden>
          <span className="proc-sheen absolute inset-0" />
        </span>

        {/* dashed number circle, overlapping the top */}
        <span
          className="proc-badge absolute -top-6 left-1/2 -translate-x-1/2 z-20 flex items-center justify-center rounded-full text-sm font-extrabold"
          style={{ width: 52, height: 52, border: "2px dashed rgba(249,115,22,0.6)", color: "var(--primary)", background: "var(--bg-card)" }}
        >
          {s.num}
        </span>

        <h3 className="relative text-sm font-extrabold uppercase tracking-[0.14em] mb-3">{s.title}</h3>
        <p className="relative text-xs leading-relaxed mb-7" style={{ color: "var(--text-muted)" }}>{s.desc}</p>

        {/* bottom icon */}
        <span className="relative mt-auto transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-0.5" style={{ color: "var(--primary)" }}>
          <Icon size={30} strokeWidth={1.6} />
        </span>
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

export default function ProcessSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

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

  const rows = [steps.slice(0, 3), steps.slice(3, 6)];

  return (
    <section className="relative overflow-hidden py-24">
      <style>{`
        @keyframes proc-arrow-pulse   { 0%,100% { opacity:.45; transform: translateX(0); }  50% { opacity:1; transform: translateX(3px); } }
        @keyframes proc-arrow-pulse-y { 0%,100% { opacity:.45; transform: translateY(0); }  50% { opacity:1; transform: translateY(3px); } }
        .proc-arrow   { animation: proc-arrow-pulse 1.8s ease-in-out infinite; }
        .proc-arrow-y { animation: proc-arrow-pulse-y 1.8s ease-in-out infinite; }
        .proc-sheen {
          background: linear-gradient(115deg, transparent 35%, rgba(255,255,255,0.07) 50%, transparent 65%);
          transform: translateX(-120%);
          transition: transform .8s ease;
        }
        .proc-wrap:hover .proc-sheen { transform: translateX(120%); }
        .proc-wrap:hover .proc-card  { transform: translateY(-8px); border-color: rgba(249,115,22,0.5) !important; box-shadow: 0 28px 56px -26px rgba(249,115,22,0.45); }
        .proc-wrap:hover .proc-tab   { top: -0.65rem; right: -0.65rem; }
        @media (prefers-reduced-motion: reduce) { .proc-arrow, .proc-arrow-y, .proc-sheen { animation: none !important; transition: none !important; } }
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

        {/* ── Desktop: 3 columns × 2 rows with arrows ── */}
        <div ref={ref} className="hidden lg:flex flex-col gap-14">
          {rows.map((row, r) => (
            <div key={r} className="flex items-stretch">
              {row.map((s, c) => {
                const idx = r * 3 + c;
                return (
                  <div key={s.num} className="flex items-stretch flex-1">
                    <div className="flex-1 flex" style={reveal(shown, idx)}>
                      <StepCard s={s} />
                    </div>
                    {c < row.length - 1 && (
                      <div className="flex items-center justify-center px-4 shrink-0">
                        <FlowArrow delay={idx * 0.2} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* ── Tablet: 2 columns ── */}
        <div className="hidden sm:grid lg:hidden grid-cols-2 gap-x-6 gap-y-12">
          {steps.map((s, i) => (
            <div key={s.num} style={reveal(shown, i)}>
              <StepCard s={s} />
            </div>
          ))}
        </div>

        {/* ── Mobile: stacked flow ── */}
        <div className="sm:hidden flex flex-col items-center gap-6">
          {steps.map((s, i) => (
            <div key={s.num} className="w-full max-w-md flex flex-col items-center gap-6">
              <div className="w-full" style={reveal(shown, i)}>
                <StepCard s={s} />
              </div>
              {i < steps.length - 1 && <FlowArrow down delay={i * 0.2} />}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
