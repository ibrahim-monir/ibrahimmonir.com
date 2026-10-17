'use client';
import Image from "next/image";

const badges = [
  { label: "WordPress",  color: "#21759B", top:  36, left:   0, delay: "0s"   },
  { label: "Laravel",    color: "#FF2D20", top:  10, right: 18, delay: "0.7s" },
  { label: "Next.js",    color: "#ffffff", top: 250, right: -6, delay: "1.4s" },
  { label: "React",      color: "#61DAFB", bottom: 70, right: 4, delay: "0.4s" },
  { label: "PHP",        color: "#7A86B8", bottom: 24, left: 34, delay: "1.1s" },
  { label: "TypeScript", color: "#3178C6", top: 300, left: -14, delay: "1.8s" },
];

export default function HeroPhoto() {
  return (
    <>
      <style>{`
        @keyframes border-spin { to { transform: rotate(360deg); } }
        @keyframes badge-float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-8px); }
        }
      `}</style>

      <div style={{ position: "relative", width: 520, height: 600 }}>

        {/* Offset outline frame behind the photo */}
        <div aria-hidden style={{
          position: "absolute", top: 44, left: 64, right: 16, bottom: 0,
          borderRadius: 28, border: "1px solid rgba(255,255,255,0.10)",
          background: "linear-gradient(160deg, rgba(237,28,36,0.10), transparent 55%)",
        }} />

        {/* Floating tech badges */}
        {badges.map(({ label, color, delay, ...pos }) => (
          <div key={label} style={{
            position: "absolute",
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "7px 13px",
            borderRadius: 10,
            fontFamily: "var(--font-mono)",
            fontSize: "0.72rem",
            fontWeight: 500,
            background: "rgba(18,23,34,0.82)",
            border: "1px solid rgba(255,255,255,0.12)",
            color: "#e8ebf0",
            backdropFilter: "blur(10px)",
            boxShadow: "0 10px 30px -10px rgba(0,0,0,0.7)",
            animation: "badge-float 3.6s ease-in-out infinite",
            animationDelay: delay,
            zIndex: 10,
            whiteSpace: "nowrap",
            ...pos,
          }}>
            <span style={{ width: 7, height: 7, borderRadius: 2, background: color, boxShadow: `0 0 10px ${color}` }} />
            {label}
          </div>
        ))}

        {/* Photo with a slow gradient border */}
        <div style={{
          position: "absolute",
          top: 20, left: 40,
          width: 440, height: 540,
          zIndex: 5,
          borderRadius: 26,
          overflow: "hidden",
          boxShadow: "0 40px 80px -30px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.06)",
        }}>
          <div style={{
            position: "absolute",
            width: "200%", height: "200%",
            top: "-50%", left: "-50%",
            background: "conic-gradient(from 0deg, #ED1C24 0%, rgba(237,28,36,0) 30%, rgba(255,255,255,0.15) 50%, rgba(237,28,36,0) 70%, #ED1C24 100%)",
            animation: "border-spin 8s linear infinite",
          }} />

          <div style={{
            position: "absolute",
            inset: 2,
            borderRadius: 24,
            overflow: "hidden",
            background: "#0d0f14",
          }}>
            <Image
              src="/ibrahim-hero.jpg"
              alt="Ibrahim Monir"
              fill
              className="object-cover object-top"
              priority
              quality={95}
              sizes="(max-width: 1280px) 440px, 1000px"
              unoptimized
            />
            <div aria-hidden style={{
              position: "absolute", inset: 0,
              background: "linear-gradient(to top, rgba(11,14,20,0.55) 0%, transparent 35%)",
            }} />
          </div>
        </div>

      </div>
    </>
  );
}
