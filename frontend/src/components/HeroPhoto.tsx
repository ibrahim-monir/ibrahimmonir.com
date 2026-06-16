'use client';
import Image from "next/image";

const badges = [
  { label: "WordPress",  top:   6, left:  30, delay: "0s"   },
  { label: "Laravel",    top:   6, right: 26, delay: "0.7s" },
  { label: "Next.js",    top: 270, right:  6, delay: "1.4s" },
  { label: "React",      bottom: 6, right: 30, delay: "0.4s" },
  { label: "PHP",        bottom: 6, left:  26, delay: "1.1s" },
  { label: "TypeScript", top: 270, left:   4, delay: "1.8s" },
];

export default function HeroPhoto() {
  return (
    <>
      <style>{`
        @keyframes border-spin {
          to { transform: rotate(360deg); }
        }
        @keyframes badge-float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-9px); }
        }
      `}</style>

      <div style={{ position: "relative", width: 580, height: 620 }}>

        {/* Floating tech badges */}
        {badges.map(({ label, delay, ...pos }) => (
          <div key={label} style={{
            position: "absolute",
            padding: "5px 14px",
            borderRadius: 999,
            fontSize: "0.73rem",
            fontWeight: 600,
            background: "rgba(18,18,18,.93)",
            border: "1px solid rgba(249,115,22,.45)",
            color: "#fb923c",
            backdropFilter: "blur(8px)",
            boxShadow: "0 4px 16px rgba(0,0,0,.55)",
            animation: "badge-float 3.2s ease-in-out infinite",
            animationDelay: delay,
            zIndex: 10,
            whiteSpace: "nowrap",
            ...pos,
          }}>{label}</div>
        ))}

        {/* Photo with spinning gradient border */}
        <div style={{
          position: "absolute",
          top: "50%", left: "50%",
          marginTop: -280, marginLeft: -240,
          width: 480, height: 560,
          zIndex: 5,
          borderRadius: "1.5rem",
          overflow: "hidden",
        }}>
          {/* Spinning conic-gradient — shows through 3px border gap */}
          <div style={{
            position: "absolute",
            width: "200%", height: "200%",
            top: "-50%", left: "-50%",
            background: "conic-gradient(from 0deg, #f97316 0%, #fbbf24 25%, rgba(249,115,22,.12) 50%, #fbbf24 75%, #f97316 100%)",
            animation: "border-spin 3s linear infinite",
          }} />

          {/* Inner inset — dark fill, leaves only 3px border visible */}
          <div style={{
            position: "absolute",
            inset: 3,
            borderRadius: "calc(1.5rem - 3px)",
            overflow: "hidden",
            background: "#0d0d0d",
          }}>
            <Image
              src="/ibrahim-hero.jpg"
              alt="Ibrahim Monir"
              fill
              className="object-cover object-top"
              priority
              quality={95}
              sizes="(max-width: 1280px) 480px, 1000px"
            />
          </div>
        </div>

      </div>
    </>
  );
}
