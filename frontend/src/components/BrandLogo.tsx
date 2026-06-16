interface Props {
  className?: string;
  fontSize?: string | number;
}

/* Uses dotless-ı (U+0131) so the natural dot is absent,
   then an orange circle is placed exactly where the dot should be. */
function DotI() {
  return (
    <span style={{ position: "relative", display: "inline-block" }}>
      {/* dotless i */}
      ı
      <span
        aria-hidden
        style={{
          position: "absolute",
          top: "-0.12em",
          left: "50%",
          transform: "translateX(-50%)",
          width: "0.22em",
          height: "0.22em",
          borderRadius: "50%",
          background: "#f97316",
          display: "block",
          boxShadow: "0 0 6px rgba(249,115,22,0.6)",
        }}
      />
    </span>
  );
}

export default function BrandLogo({ className = "", fontSize = "1.5rem" }: Props) {
  return (
    <span
      className={className}
      aria-label="Ibrahim Monir"
      style={{
        fontFamily: "'Inter', sans-serif",
        fontWeight: 900,
        fontSize,
        letterSpacing: "-0.035em",
        lineHeight: 1,
        color: "#f5f5f5",
        display: "inline-flex",
        alignItems: "baseline",
        userSelect: "none",
      }}
    >
      Ibrah<DotI />m&nbsp;Mon<DotI />r
    </span>
  );
}
