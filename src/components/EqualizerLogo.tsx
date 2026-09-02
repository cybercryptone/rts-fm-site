import { useId } from "react";
import { EQ_BARS, EQ_VIEWBOX } from "@/lib/eq-bars";

function seeded(i: number) {
  const x = Math.sin(i * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

export default function EqualizerLogo({ className }: { className?: string }) {
  const gradientId = `eq-fill-${useId()}`;

  return (
    <svg
      viewBox={`0 0 ${EQ_VIEWBOX.w} ${EQ_VIEWBOX.h}`}
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--accent)" />
          <stop offset="100%" stopColor="var(--accent-soft)" />
        </linearGradient>
      </defs>
      {EQ_BARS.map((b, i) => {
        const dur = 0.9 + seeded(i) * 0.9;
        const delay = seeded(i + 100) * -2;
        return (
          <ellipse
            key={i}
            cx={b.cx}
            cy={b.cy}
            rx={b.rx}
            ry={b.ry}
            fill={`url(#${gradientId})`}
            style={{
              transformOrigin: `${b.cx}px ${b.cy}px`,
              animation: `eq-bar-pulse ${dur}s ease-in-out ${delay}s infinite alternate`,
            }}
          />
        );
      })}
    </svg>
  );
}
