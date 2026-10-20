interface Props {
  className?: string;
  fontSize?: string | number;
  color?: string;
}

export default function BrandLogo({ className = "", fontSize = "2.25rem", color = "#f5f5f5" }: Props) {
  return (
    <span
      className={className}
      aria-label="Ibrahim Monir"
      style={{
        fontFamily: "var(--font-logo-family), sans-serif",
        fontWeight: 700,
        fontSize,
        lineHeight: 1,
        letterSpacing: "-0.01em",
        color,
        display: "inline-flex",
        alignItems: "baseline",
        userSelect: "none",
      }}
    >
      Ibrahim Monir
    </span>
  );
}
