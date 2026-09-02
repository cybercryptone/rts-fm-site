"use client";

import { useEffect, useRef } from "react";
import { EQ_BARS, EQ_VIEWBOX } from "@/lib/eq-bars";

const TOTAL_SLATS_MOBILE = 10;
const TOTAL_SLATS_DESKTOP = 22;

const IDLE_AMPLITUDE = 0.1;
const SURGE_MAX = 0.35;

const SLAT_MASK = "linear-gradient(180deg, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.16) 35%, rgba(0,0,0,0.7) 75%, rgba(0,0,0,1) 100%)";
const SLAT_MASK_STYLE: React.CSSProperties = {
  WebkitMaskImage: SLAT_MASK,
  maskImage: SLAT_MASK,
};

export default function CursorWaveform() {
  const rootRef = useRef<HTMLDivElement>(null);
  const barRefs = useRef<(SVGEllipseElement | null)[]>([]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const bars = EQ_BARS.map((_, i) => ({
      current: 1,
      target: 1,
      phase: i * 0.4,
    }));

    const applyStatic = () => {
      bars.forEach((_, i) => {
        const el = barRefs.current[i];
        if (!el) return;
        el.style.transform = "scaleY(1)";
        el.style.opacity = "0.95";
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

    // Bar screen-space centers, cached and only recomputed on resize —
    // reading getBoundingClientRect() per bar inside the render loop
    // (interleaved with the transform/opacity writes for other bars)
    // forces a synchronous layout flush on every read, 19 times a frame.
    let barCenters: { x: number; y: number }[] = [];

    const computeBarCenters = () => {
      const svg = barRefs.current[0]?.ownerSVGElement;
      if (!svg) return;
      const svgRect = svg.getBoundingClientRect();
      const scaleX = svgRect.width / EQ_VIEWBOX.w;
      const scaleY = svgRect.height / EQ_VIEWBOX.h;
      barCenters = EQ_BARS.map((b) => ({
        x: svgRect.left + b.cx * scaleX,
        y: svgRect.top + b.cy * scaleY,
      }));
    };

    const updateRect = () => {
      rect = root.getBoundingClientRect();
      computeBarCenters();
    };
    computeBarCenters();

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
        const idle = Math.sin(time + bar.phase) * IDLE_AMPLITUDE;
        const el = barRefs.current[i];
        const center = barCenters[i];

        if (hovering && el && center) {
          const distX = Math.abs(mouseX - center.x);
          const distY = Math.abs(mouseY - center.y);

          const proximity = Math.max(0, 1 - distX / maxDistX);
          const verticalFactor = Math.max(0.2, 1 - distY / maxDistY);
          const surge = Math.pow(proximity, 1.7) * SURGE_MAX * verticalFactor;

          bar.target = Math.min(1.5, 1 + idle + surge);
        } else {
          bar.target = Math.max(0.75, 1 + idle);
        }

        bar.current += (bar.target - bar.current) * 0.09;

        if (el) {
          el.style.transform = `scaleY(${bar.current.toFixed(4)})`;
          el.style.opacity = Math.min(1, Math.max(0.4, bar.current * 0.95)).toFixed(3);
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

      {/* 1. unified waveform SVG — the real brand equalizer geometry,
             cursor-reactive instead of the static CSS pulse */}
      <svg
        viewBox={`0 0 ${EQ_VIEWBOX.w} ${EQ_VIEWBOX.h}`}
        className="pointer-events-none absolute bottom-16 left-1/2 z-0 w-[126vw] max-w-none -translate-x-1/2 overflow-visible opacity-30 sm:bottom-auto sm:left-auto sm:right-[5vw] sm:top-1/2 sm:w-[378px] sm:max-w-[calc(76vh*1685/1865)] sm:translate-x-0 sm:-translate-y-1/2 sm:opacity-100 md:w-[468px] lg:w-[558px] xl:w-[630px] sm:[mask-image:linear-gradient(to_bottom,black_0%,black_55%,transparent_92%)] sm:[-webkit-mask-image:linear-gradient(to_bottom,black_0%,black_55%,transparent_92%)]"
      >
        <defs>
          <linearGradient id="spike-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--accent)" />
            <stop offset="100%" stopColor="var(--accent-soft)" />
          </linearGradient>
          {/* fixed, absolute region (userSpaceOnUse) generous enough to
              cover animated overshoot regardless of how the browser tracks
              the live bounding box of the animated children — a percentage
              objectBoundingBox region was still clipping mid-animation */}
          <filter
            id="eq-blur"
            filterUnits="userSpaceOnUse"
            x={-600}
            y={-600}
            width={EQ_VIEWBOX.w + 1200}
            height={EQ_VIEWBOX.h + 1200}
          >
            <feGaussianBlur stdDeviation="9" />
          </filter>
        </defs>
        <g filter="url(#eq-blur)">
          {EQ_BARS.map((b, i) => (
            <ellipse
              key={i}
              ref={(el) => {
                barRefs.current[i] = el;
              }}
              cx={b.cx}
              cy={b.cy}
              rx={b.rx}
              ry={b.ry}
              fill="url(#spike-grad)"
              className="needle-path"
            />
          ))}
        </g>
      </svg>

      {/* 2. fluted glass slats — purely optical, no blur; nearly invisible up
             top where the backdrop is plain, easing in toward the bottom.
             Visible on every breakpoint, including mobile, where it sits
             over the static logo watermark instead of the cursor SVG.
             Mobile gets fewer, wider slats than desktop. */}
      <div
        className="pointer-events-none absolute inset-0 z-[1] flex overflow-hidden sm:hidden"
        style={SLAT_MASK_STYLE}
      >
        {Array.from({ length: TOTAL_SLATS_MOBILE }).map((_, i) => (
          <div key={i} className="waveform-slat" />
        ))}
      </div>
      <div
        className="pointer-events-none absolute inset-0 z-[1] hidden overflow-hidden sm:flex"
        style={SLAT_MASK_STYLE}
      >
        {Array.from({ length: TOTAL_SLATS_DESKTOP }).map((_, i) => (
          <div key={i} className="waveform-slat" />
        ))}
      </div>

      {/* 3. film grain — concentrated near the top, fading toward the middle */}
      <div className="hero-grain z-20" />
    </div>
  );
}
