"use client";

import { useEffect, useRef } from "react";

const TOTAL_BARS = 32;
const TOTAL_SLATS = 22;

const VIEW_W = 800;
const VIEW_H = 600;
const BAR_W = 7;
const SPACING = VIEW_W / (TOTAL_BARS - 1);

// Gaussian envelope — peak sits under/next to "FM", soft falloff either side.
const PEAK = 16;
const SPREAD = 7.2;

function baseScaleFor(i: number) {
  return Math.max(0.12, Math.exp(-Math.pow((i - PEAK) / SPREAD, 2)) * 0.95);
}

export default function CursorWaveform() {
  const rootRef = useRef<HTMLDivElement>(null);
  const barRefs = useRef<(SVGRectElement | null)[]>([]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const bars = Array.from({ length: TOTAL_BARS }, (_, i) => {
      const base = baseScaleFor(i);
      return { current: base, target: base, base, phase: i * 0.28 };
    });

    const applyStatic = () => {
      bars.forEach((b, i) => {
        const el = barRefs.current[i];
        if (!el) return;
        el.style.transform = `scaleY(${b.base})`;
        el.style.opacity = Math.max(0.25, b.base * 1.1).toFixed(3);
      });
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      applyStatic();
      return;
    }

    let rect = root.getBoundingClientRect();
    let mouseX = -1000;
    let mouseY = -1000;
    let hovering = false;

    const updateRect = () => {
      rect = root.getBoundingClientRect();
    };

    const handleMove = (e: MouseEvent) => {
      if (
        e.clientX < rect.left ||
        e.clientX > rect.right ||
        e.clientY < rect.top ||
        e.clientY > rect.bottom
      ) {
        hovering = false;
        return;
      }
      hovering = true;
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const handleLeave = () => {
      hovering = false;
    };

    window.addEventListener("mousemove", handleMove, { passive: true });
    window.addEventListener("resize", updateRect);
    root.addEventListener("mouseleave", handleLeave);

    let time = 0;
    let rafId = 0;

    const render = () => {
      time += 0.035;
      const maxDistX = window.innerWidth * 0.24;
      const maxDistY = window.innerHeight * 0.7;

      bars.forEach((bar, i) => {
        const idle = Math.sin(time + bar.phase) * 0.035;
        const el = barRefs.current[i];

        if (hovering && el) {
          const barRect = el.getBoundingClientRect();
          const barCenterX = barRect.left + barRect.width / 2;
          const barCenterY = barRect.top + barRect.height / 2;

          const distX = Math.abs(mouseX - barCenterX);
          const distY = Math.abs(mouseY - barCenterY);

          const proximity = Math.max(0, 1 - distX / maxDistX);
          const verticalFactor = Math.max(0.2, 1 - distY / maxDistY);
          const surge = Math.pow(proximity, 1.7) * 0.65 * verticalFactor;

          bar.target = Math.min(1.18, bar.base + idle + surge);
        } else {
          bar.target = Math.max(0.08, bar.base + idle);
        }

        bar.current += (bar.target - bar.current) * 0.09;

        if (el) {
          el.style.transform = `scaleY(${bar.current.toFixed(4)})`;
          el.style.opacity = Math.min(1, Math.max(0.25, bar.current * 1.1)).toFixed(3);
        }
      });

      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("resize", updateRect);
      root.removeEventListener("mouseleave", handleLeave);
    };
  }, []);

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0"
    >
      <svg className="hidden">
        <filter id="hero-film-grain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.75"
            numOctaves={3}
            stitchTiles="stitch"
          />
          <feColorMatrix
            type="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.55 0"
          />
        </filter>
      </svg>

      {/* 1. unified waveform SVG — single vector, no per-slat cutting */}
      <svg
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        preserveAspectRatio="none"
        className="absolute right-[4vw] top-1/2 z-0 hidden h-[65vh] w-[62vw] max-w-[920px] -translate-y-[46%] overflow-visible sm:block"
      >
        <defs>
          <linearGradient id="spike-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity={0.08} />
            <stop offset="25%" stopColor="var(--accent)" stopOpacity={0.95} />
            <stop offset="50%" stopColor="var(--accent-soft)" stopOpacity={1} />
            <stop offset="75%" stopColor="var(--accent)" stopOpacity={0.95} />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity={0.08} />
          </linearGradient>
        </defs>
        <g>
          {Array.from({ length: TOTAL_BARS }).map((_, i) => {
            const x = i * SPACING;
            return (
              <rect
                key={i}
                ref={(el) => {
                  barRefs.current[i] = el;
                }}
                x={x - BAR_W / 2}
                y={50}
                width={BAR_W}
                height={500}
                rx={BAR_W / 2}
                fill="url(#spike-grad)"
                className="needle-path"
              />
            );
          })}
        </g>
      </svg>

      {/* 2. fluted glass slats — purely optical, no blur */}
      <div className="pointer-events-none absolute inset-0 z-[1] hidden overflow-hidden sm:flex">
        {Array.from({ length: TOTAL_SLATS }).map((_, i) => (
          <div key={i} className="waveform-slat" />
        ))}
      </div>

      {/* 3. film grain — concentrated near the top, fading toward the middle */}
      <div className="hero-grain z-20" />
    </div>
  );
}
