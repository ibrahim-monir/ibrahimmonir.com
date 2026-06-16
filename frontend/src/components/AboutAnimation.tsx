'use client';

const lines = [
  { indent: 0, text: "class Developer {", color: "#f97316" },
  { indent: 1, text: "name = 'Ibrahim Monir'", color: "#f5f5f5" },
  { indent: 1, text: "stack = [", color: "#f5f5f5" },
  { indent: 2, text: "'Laravel',", color: "#fbbf24" },
  { indent: 2, text: "'Next.js',", color: "#fbbf24" },
  { indent: 2, text: "'TypeScript',", color: "#fbbf24" },
  { indent: 1, text: "]", color: "#f5f5f5" },
  { indent: 1, text: "build(idea) {", color: "#f97316" },
  { indent: 2, text: "return scalable(idea)", color: "#fb923c" },
  { indent: 1, text: "}", color: "#f97316" },
  { indent: 0, text: "}", color: "#f97316" },
];

export default function AboutAnimation() {
  return (
    <div className="relative w-full max-w-[380px]" aria-hidden>
      <style>{`
        @keyframes line-in {
          from { opacity: 0; transform: translateX(-12px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes cursor-blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
        @keyframes editor-glow {
          0%, 100% { box-shadow: 0 0 30px rgba(249,115,22,0.06); }
          50%       { box-shadow: 0 0 50px rgba(249,115,22,0.14); }
        }
        @keyframes status-pulse {
          0%, 100% { opacity: 0.6; }
          50%       { opacity: 1; }
        }
      `}</style>

      {/* Editor window */}
      <div style={{
        background: "#0d0d0d",
        border: "1px solid rgba(249,115,22,0.25)",
        borderRadius: "12px",
        overflow: "hidden",
        animation: "editor-glow 4s ease-in-out infinite",
      }}>
        {/* Title bar */}
        <div style={{
          background: "#161616",
          borderBottom: "1px solid rgba(249,115,22,0.15)",
          padding: "10px 14px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}>
          {/* Traffic lights */}
          <div style={{ display: "flex", gap: "6px" }}>
            {["#f43f5e", "#f59e0b", "#22c55e"].map((c, i) => (
              <div key={i} style={{ width: 10, height: 10, borderRadius: "50%", background: c, opacity: 0.8 }} />
            ))}
          </div>
          <span style={{ flex: 1, textAlign: "center", fontSize: "11px", color: "#9ca3af", fontFamily: "monospace" }}>
            developer.ts
          </span>
          {/* Status dot */}
          <div style={{
            width: 8, height: 8, borderRadius: "50%", background: "#22c55e",
            animation: "status-pulse 2s ease-in-out infinite",
          }} />
        </div>

        {/* Code area */}
        <div style={{ padding: "18px 16px", fontFamily: "monospace", fontSize: "12.5px", lineHeight: "1.8" }}>
          {/* Line numbers + code */}
          {lines.map((line, i) => (
            <div key={i} style={{
              display: "flex",
              gap: "16px",
              opacity: 0,
              animation: `line-in 0.4s ease forwards`,
              animationDelay: `${0.3 + i * 0.18}s`,
            }}>
              {/* Line number */}
              <span style={{ color: "#404040", minWidth: "16px", textAlign: "right", userSelect: "none", fontSize: "11px" }}>
                {i + 1}
              </span>
              {/* Code */}
              <span style={{ paddingLeft: `${line.indent * 16}px`, color: line.color }}>
                {line.text}
              </span>
            </div>
          ))}

          {/* Blinking cursor */}
          <div style={{
            display: "flex",
            gap: "16px",
            marginTop: "2px",
            opacity: 0,
            animation: "line-in 0.4s ease forwards",
            animationDelay: `${0.3 + lines.length * 0.18}s`,
          }}>
            <span style={{ color: "#404040", minWidth: "16px", textAlign: "right", fontSize: "11px" }}>
              {lines.length + 1}
            </span>
            <span style={{ color: "#f97316", animation: "cursor-blink 1s step-end infinite" }}>|</span>
          </div>
        </div>

        {/* Status bar */}
        <div style={{
          background: "#f97316",
          padding: "4px 14px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}>
          <span style={{ fontSize: "10px", color: "#fff", fontFamily: "monospace", fontWeight: 600 }}>
            TypeScript
          </span>
          <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.8)", fontFamily: "monospace" }}>
            Ln {lines.length + 1}, Col 1
          </span>
        </div>
      </div>

      {/* Floating skill badges below editor */}
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "16px", justifyContent: "center" }}>
        {["Laravel", "Next.js", "MySQL", "Docker"].map((tech, i) => (
          <span key={tech} style={{
            padding: "4px 10px",
            borderRadius: "6px",
            fontSize: "11px",
            fontFamily: "monospace",
            fontWeight: 600,
            background: "rgba(249,115,22,0.1)",
            border: "1px solid rgba(249,115,22,0.3)",
            color: "#fb923c",
            opacity: 0,
            animation: "line-in 0.4s ease forwards",
            animationDelay: `${2.5 + i * 0.15}s`,
          }}>
            {tech}
          </span>
        ))}
      </div>
    </div>
  );
}
