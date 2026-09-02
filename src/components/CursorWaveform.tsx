"use client";

import { useEffect, useRef } from "react";

const SLAT_COUNT = 22;

// Envelope shape the needles settle into at rest — taller toward the
// right, echoing the real EQ logo that sits over there.
const BASE_WAVE = [
  0.14, 0.16, 0.19, 0.22, 0.26, 0.3, 0.34, 0.38, 0.42, 0.48, 0.55, 0.64, 0.58,
  0.72, 0.66, 0.6, 0.54, 0.48, 0.42, 0.36, 0.3, 0.24,
];

export default function CursorWaveform() {
  const containerRef = useRef<HTMLDivElement>(null);
  const needleRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const slats = Array.from({ length: SLAT_COUNT }, (_, i) => {
      const base = BASE_WAVE[i % BASE_WAVE.length];
      return { current: base, target: base, base, phase: i * 0.4 };
    });

    let rect = container.getBoundingClientRect();
    let mouseX = -1000;
    let mouseY = -1000;
    let hovering = false;

    const applyStatic = () => {
      slats.forEach((s, i) => {
        const el = needleRefs.current[i];
        if (!el) return;
        el.style.transform = `scaleY(${s.base})`;
        el.style.opacity = Math.max(0.35, s.base * 1.1).toFixed(2);
      });
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      applyStatic();
      return;
    }

    const updateRect = () => {
      rect = container.getBoundingClientRect();
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
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };

    const handleLeave = () => {
      hovering = false;
    };

    window.addEventListener("mousemove", handleMove, { passive: true });
    window.addEventListener("resize", updateRect);
    container.addEventListener("mouseleave", handleLeave);

    let time = 0;
    let rafId = 0;

    const render = () => {
      time += 0.04;
      const w = rect.width || 1;
      const h = rect.height || 1;

      slats.forEach((s, i) => {
        const idle = Math.sin(time + s.phase) * 0.05;

        if (hovering) {
          const slatCenterX = (i + 0.5) * (w / SLAT_COUNT);
          const dist = Math.abs(mouseX - slatCenterX);
          const radius = w * 0.25;
          const proximity = Math.max(0, 1 - dist / radius);
          const heightRatio = Math.max(0.25, 1 - (mouseY / h) * 0.7);
          s.target = Math.min(
            1.15,
            s.base + idle + heightRatio * Math.pow(proximity, 1.6) * 0.85
          );
        } else {
          s.target = Math.max(0.08, s.base + idle);
        }

        s.current += (s.target - s.current) * 0.09;

        const el = needleRefs.current[i];
        if (el) {
          el.style.transform = `scaleY(${s.current.toFixed(4)})`;
          el.style.opacity = Math.min(1, Math.max(0.35, s.current * 1.1)).toFixed(2);
        }
      });

      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("resize", updateRect);
      container.removeEventListener("mouseleave", handleLeave);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 hidden overflow-hidden sm:flex"
    >
      {Array.from({ length: SLAT_COUNT }).map((_, i) => (
        <div key={i} className="waveform-slat">
          <div
            ref={(el) => {
              needleRefs.current[i] = el;
            }}
            className="waveform-needle-container"
          >
            <div className="waveform-needle" />
          </div>
        </div>
      ))}
    </div>
  );
}
