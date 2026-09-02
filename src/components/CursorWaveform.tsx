"use client";

import { useEffect, useRef } from "react";

const TOTAL_BARS = 28;
const TOTAL_SLATS = 22;

// Gaussian envelope — peak sits ~45% across the cluster, soft falloff on
// either side, so it reads as an organic waveform rather than a grid.
const CENTER = TOTAL_BARS * 0.45;
const SPREAD = 7.5;

function baseScaleFor(i: number) {
  return Math.max(
    0.12,
    Math.exp(-Math.pow((i - CENTER) / SPREAD, 2)) * 0.95
  );
}

export default function CursorWaveform() {
  const rootRef = useRef<HTMLDivElement>(null);
  const barRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const bars = Array.from({ length: TOTAL_BARS }, (_, i) => {
      const base = baseScaleFor(i);
      return { current: base, target: base, base, phase: i * 0.3 };
    });

    const applyStatic = () => {
      bars.forEach((b, i) => {
        const el = barRefs.current[i];
        if (!el) return;
        el.style.transform = `scaleY(${b.base})`;
        el.style.opacity = Math.max(0.25, b.base * 1.15).toFixed(3);
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
      const radiusX = rect.width * 0.22;
      const radiusY = rect.height * 0.6;

      bars.forEach((bar, i) => {
        const idle = Math.sin(time + bar.phase) * 0.04;
        const el = barRefs.current[i];

        if (hovering && el) {
          const barRect = el.getBoundingClientRect();
          const barCenterX = barRect.left + barRect.width / 2;
          const barCenterY = barRect.top + barRect.height / 2;

          const distX = Math.abs(mouseX - barCenterX);
          const distY = Math.abs(mouseY - barCenterY);

          const proximity = Math.max(0, 1 - distX / radiusX);
          const yMultiplier = Math.max(0.3, 1 - distY / radiusY);
          const waveBoost = Math.pow(proximity, 1.8) * 0.7 * yMultiplier;

          bar.target = Math.min(1.2, bar.base + idle + waveBoost);
        } else {
          bar.target = Math.max(0.08, bar.base + idle);
        }

        bar.current += (bar.target - bar.current) * 0.08;

        if (el) {
          el.style.transform = `scaleY(${bar.current.toFixed(4)})`;
          el.style.opacity = Math.min(1, Math.max(0.25, bar.current * 1.15)).toFixed(3);
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
      {/* 1. equalizer needles — bottom layer */}
      <div className="pointer-events-none absolute inset-0 z-0 hidden items-center justify-end pr-[5vw] sm:flex">
        <div className="flex h-[70%] items-center gap-4">
          {Array.from({ length: TOTAL_BARS }).map((_, i) => (
            <div
              key={i}
              ref={(el) => {
                barRefs.current[i] = el;
              }}
              className="eq-needle"
            />
          ))}
        </div>
      </div>

      {/* 2. fluted glass slats — refracts the needles without cutting the type */}
      <div className="pointer-events-none absolute inset-0 z-[1] hidden overflow-hidden sm:flex">
        {Array.from({ length: TOTAL_SLATS }).map((_, i) => (
          <div key={i} className="waveform-slat" />
        ))}
      </div>
    </div>
  );
}
