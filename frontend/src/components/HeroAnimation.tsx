'use client';

export default function HeroAnimation() {
  return (
    <div className="relative w-[420px] h-[420px] select-none" aria-hidden>
      <style>{`
        @keyframes orbit-cw {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes orbit-ccw {
          from { transform: rotate(0deg); }
          to   { transform: rotate(-360deg); }
        }
        @keyframes dot-orbit {
          from { transform: rotate(0deg) translateX(var(--r)) rotate(0deg); }
          to   { transform: rotate(360deg) translateX(var(--r)) rotate(-360deg); }
        }
        @keyframes hero-pulse {
          0%, 100% { transform: scale(1);   opacity: 0.6; }
          50%       { transform: scale(1.18); opacity: 1;   }
        }
        @keyframes hero-float {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-12px); }
        }
        @keyframes hero-blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
        @keyframes dot-float {
          0%, 100% { transform: translateY(0)   scale(1);   opacity: var(--op); }
          50%       { transform: translateY(-8px) scale(1.3); opacity: 1; }
        }
        @keyframes ring-dash {
          to { stroke-dashoffset: -120; }
        }
      `}</style>

      <svg viewBox="0 0 420 420" fill="none" xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full">

        {/* ── Glow filter ── */}
        <defs>
          <filter id="glow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <filter id="glow-sm" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <radialGradient id="centerGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#f97316" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* ── Background glow ── */}
        <circle cx="210" cy="210" r="160" fill="url(#centerGrad)"
          style={{ animation: "hero-pulse 3s ease-in-out infinite" }} />

        {/* ── Outer ring (CW dashed) ── */}
        <circle cx="210" cy="210" r="190"
          stroke="#f97316" strokeWidth="1" strokeOpacity="0.2"
          strokeDasharray="6 10"
          style={{ transformOrigin: "210px 210px", animation: "orbit-cw 20s linear infinite" }} />

        {/* ── Middle ring (CCW dashed) ── */}
        <circle cx="210" cy="210" r="145"
          stroke="#fb923c" strokeWidth="1" strokeOpacity="0.25"
          strokeDasharray="4 8"
          style={{ transformOrigin: "210px 210px", animation: "orbit-ccw 14s linear infinite" }} />

        {/* ── Inner ring (solid, dim) ── */}
        <circle cx="210" cy="210" r="95"
          stroke="#f97316" strokeWidth="1.5" strokeOpacity="0.18"
          strokeDasharray="3 6"
          style={{ transformOrigin: "210px 210px", animation: "orbit-cw 9s linear infinite" }} />

        {/* ── Orbit dot group: outer ── */}
        <g style={{ transformOrigin: "210px 210px", animation: "orbit-cw 12s linear infinite" }}>
          <circle cx="400" cy="210" r="7" fill="#f97316" filter="url(#glow-sm)" />
        </g>
        <g style={{ transformOrigin: "210px 210px", animation: "orbit-cw 12s linear infinite", animationDelay: "-6s" }}>
          <circle cx="400" cy="210" r="5" fill="#fbbf24" filter="url(#glow-sm)" />
        </g>

        {/* ── Orbit dot group: middle ── */}
        <g style={{ transformOrigin: "210px 210px", animation: "orbit-ccw 9s linear infinite" }}>
          <circle cx="355" cy="210" r="6" fill="#fb923c" filter="url(#glow-sm)" />
        </g>
        <g style={{ transformOrigin: "210px 210px", animation: "orbit-ccw 9s linear infinite", animationDelay: "-3s" }}>
          <circle cx="355" cy="210" r="4" fill="#f97316" opacity="0.7" />
        </g>
        <g style={{ transformOrigin: "210px 210px", animation: "orbit-ccw 9s linear infinite", animationDelay: "-6s" }}>
          <circle cx="355" cy="210" r="4" fill="#fbbf24" opacity="0.6" />
        </g>

        {/* ── Orbit dot group: inner ── */}
        <g style={{ transformOrigin: "210px 210px", animation: "orbit-cw 6s linear infinite" }}>
          <circle cx="305" cy="210" r="5" fill="#f97316" filter="url(#glow-sm)" />
        </g>
        <g style={{ transformOrigin: "210px 210px", animation: "orbit-cw 6s linear infinite", animationDelay: "-3s" }}>
          <circle cx="305" cy="210" r="4" fill="#fbbf24" opacity="0.8" />
        </g>

        {/* ── Floating ambient dots ── */}
        {[
          { cx: 60,  cy: 100, r: 3, delay: "0s",    dur: "4s" },
          { cx: 370, cy: 80,  r: 2, delay: "-1.5s", dur: "5s" },
          { cx: 40,  cy: 320, r: 2, delay: "-2s",   dur: "3.5s" },
          { cx: 390, cy: 340, r: 3, delay: "-0.8s", dur: "4.5s" },
          { cx: 120, cy: 380, r: 2, delay: "-3s",   dur: "4s" },
          { cx: 310, cy: 50,  r: 2, delay: "-1s",   dur: "6s" },
        ].map((d, i) => (
          <circle key={i} cx={d.cx} cy={d.cy} r={d.r}
            fill="#f97316" opacity="0.5"
            style={{ animation: `dot-float ${d.dur} ease-in-out infinite`, animationDelay: d.delay, ["--op" as string]: "0.5" }} />
        ))}

        {/* ── Center core ── */}
        <circle cx="210" cy="210" r="56"
          fill="#161616" stroke="#f97316" strokeWidth="1.5" strokeOpacity="0.6"
          style={{ animation: "hero-pulse 3s ease-in-out infinite" }} />
        <circle cx="210" cy="210" r="48" fill="#f97316" fillOpacity="0.06" />

        {/* ── Code text: </> ── */}
        <g style={{ animation: "hero-float 4s ease-in-out infinite" }}>
          {/* < */}
          <text x="172" y="218" fontFamily="monospace" fontSize="22" fontWeight="700"
            fill="#f97316" filter="url(#glow)">
            &lt;
          </text>
          {/* / */}
          <text x="200" y="218" fontFamily="monospace" fontSize="22" fontWeight="700"
            fill="#fbbf24">
            /
          </text>
          {/* > */}
          <text x="216" y="218" fontFamily="monospace" fontSize="22" fontWeight="700"
            fill="#f97316" filter="url(#glow)">
            &gt;
          </text>
        </g>

        {/* ── Tech labels orbiting ── */}
        {/* PHP badge */}
        <g style={{ transformOrigin: "210px 210px", animation: "orbit-cw 18s linear infinite", animationDelay: "-2s" }}>
          <rect x="358" y="183" width="40" height="20" rx="4"
            fill="#f97316" fillOpacity="0.15" stroke="#f97316" strokeWidth="1" strokeOpacity="0.5" />
          <text x="378" y="197" fontFamily="monospace" fontSize="9" fontWeight="600"
            fill="#f97316" textAnchor="middle">PHP</text>
        </g>

        {/* React badge */}
        <g style={{ transformOrigin: "210px 210px", animation: "orbit-ccw 22s linear infinite", animationDelay: "-8s" }}>
          <rect x="358" y="183" width="44" height="20" rx="4"
            fill="#fb923c" fillOpacity="0.12" stroke="#fb923c" strokeWidth="1" strokeOpacity="0.5" />
          <text x="380" y="197" fontFamily="monospace" fontSize="9" fontWeight="600"
            fill="#fb923c" textAnchor="middle">React</text>
        </g>

        {/* SQL badge */}
        <g style={{ transformOrigin: "210px 210px", animation: "orbit-cw 25s linear infinite", animationDelay: "-14s" }}>
          <rect x="358" y="183" width="38" height="20" rx="4"
            fill="#fbbf24" fillOpacity="0.1" stroke="#fbbf24" strokeWidth="1" strokeOpacity="0.4" />
          <text x="377" y="197" fontFamily="monospace" fontSize="9" fontWeight="600"
            fill="#fbbf24" textAnchor="middle">SQL</text>
        </g>

      </svg>
    </div>
  );
}
