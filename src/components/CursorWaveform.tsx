"use client";

import { useEffect, useRef } from "react";
import { EQ_BARS, EQ_VIEWBOX } from "@/lib/eq-bars";

const TOTAL_SLATS_MOBILE = 10;
const TOTAL_SLATS_DESKTOP = 22;

const IDLE_AMPLITUDE = 0.1;
const SURGE_MAX = 0.35;

// Phosphor persistence — fast cursor flings spawn a lingering amber trail,
// mimicking analog radar/studio-monitor decay.
//
// Velocity is measured once per rAF tick against the ACTUAL elapsed time
// between ticks (not an assumed 16.7ms), which handles two sources of
// noise: irregular raw mousemove timing, and dropped/delayed frames under
// load. But a SINGLE frame's velocity sample still isn't trustworthy on
// its own — pointer-position interpolation, event coalescing, or one
// unlucky frame can each produce an isolated spike unrelated to how fast
// the cursor is actually moving. So the trail only engages once velocity
// has stayed above threshold for several CONSECUTIVE frames — noise is
// never sustained across multiple frames, but a genuine fast flick is.
const VELOCITY_SHEAR_MIN = 2.5; // px/ms — well above ordinary hover pace
const TRAIL_VELOCITY_MIN = 3.2; // px/ms
const MIN_CONSECUTIVE_FAST_FRAMES = 4;
const TRAIL_THROTTLE_MS = 45;
const TRAIL_LIFETIME_MS = 520;

// The rightmost few bars should dissolve into the ambient background
// instead of just ending — a per-bar opacity multiplier ramping toward 0
// as bars approach the true right edge, so the artwork trails off rather
// than cutting off. Indexed by distance-from-end: [last, 2nd-from-last,
// 3rd-from-last] — this order previously got flipped, which put the dimmest
// bar three positions in instead of at the actual edge (an inverted dip
// instead of a smooth taper).
const RIGHT_EDGE_FADE = [0.4, 0.65, 0.85];
function edgeFadeFor(i: number) {
  const fromEnd = EQ_BARS.length - 1 - i;
  return fromEnd < RIGHT_EDGE_FADE.length ? RIGHT_EDGE_FADE[fromEnd] : 1;
}

const SLAT_MASK = "linear-gradient(180deg, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.16) 35%, rgba(0,0,0,0.7) 75%, rgba(0,0,0,1) 100%)";
const SLAT_MASK_STYLE: React.CSSProperties = {
  WebkitMaskImage: SLAT_MASK,
  maskImage: SLAT_MASK,
};

// CSS mask-image binds its compositing buffer to the masked element's own
// box, regardless of overflow:visible — unlike SVG filters, there's no way
// to give it a larger region (confirmed by isolation testing: filter alone
// was clean at max animated scale, mask alone reproduced the flat-cut).
// Fix: pad the viewBox above the artwork so bars have room to grow upward
// on cursor surge without ever reaching the box edge the mask is bound to.
//
//   TOP_PAD = 650 (viewBox units, ~35% of EQ_VIEWBOX.h — comfortably beyond
//   the ~25% max overshoot at the 1.5x scale ceiling below)
//   paddedH = EQ_VIEWBOX.h + TOP_PAD = 2515
//   padFraction = TOP_PAD / paddedH = 25.85%
//   artwork center = (EQ_VIEWBOX.h/2 + TOP_PAD) / paddedH = 62.92% down the
//     padded box (was 50% pre-padding) — the -translate-y-[62.92%] below
//     compensates (both breakpoints: mobile is vertically centered same as
//     desktop) so the artwork renders centered rather than the padded box.
//   mask stops remapped: old 55%/92% (of the un-padded artwork) become
//     padFraction + old% * (100 - padFraction) = 66.63% / 94.07% (desktop
//     mask only — mobile has no mask-image).

export default function CursorWaveform() {
  const rootRef = useRef<HTMLDivElement>(null);
  const barRefs = useRef<(SVGEllipseElement | null)[]>([]);
  const slatRefsMobile = useRef<(HTMLDivElement | null)[]>([]);
  const slatRefsDesktop = useRef<(HTMLDivElement | null)[]>([]);
  const trailContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const bars = EQ_BARS.map((_, i) => ({
      current: 1,
      target: 1,
      phase: i * 0.4,
      edgeFade: edgeFadeFor(i),
    }));

    const applyStatic = () => {
      bars.forEach((bar, i) => {
        const el = barRefs.current[i];
        if (!el) return;
        el.style.transform = "scaleY(1)";
        el.style.opacity = (0.95 * bar.edgeFade).toFixed(3);
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
    let slatCentersMobile: { x: number; y: number }[] = [];
    let slatCentersDesktop: { x: number; y: number }[] = [];

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

    const computeSlatCenters = () => {
      const toCenters = (refs: (HTMLDivElement | null)[]) =>
        refs.map((el) => {
          if (!el) return { x: 0, y: 0 };
          const r = el.getBoundingClientRect();
          return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
        });
      slatCentersMobile = toCenters(slatRefsMobile.current);
      slatCentersDesktop = toCenters(slatRefsDesktop.current);
    };

    const updateRect = () => {
      rect = root.getBoundingClientRect();
      computeBarCenters();
      computeSlatCenters();
    };
    computeBarCenters();
    computeSlatCenters();

    // Reactive slat caustics: each slat picks up the highlight of the
    // nearest needle beneath it, brightening when that needle surges —
    // an optical caustic reflection rather than a flat rib.
    const applySlatGlow = (
      refs: (HTMLDivElement | null)[],
      centers: { x: number; y: number }[],
    ) => {
      refs.forEach((el, si) => {
        const c = centers[si];
        if (!el || !c || !barCenters.length) return;
        let nearestIdx = 0;
        let best = Infinity;
        for (let bi = 0; bi < barCenters.length; bi++) {
          const d = Math.abs(barCenters[bi].x - c.x);
          if (d < best) {
            best = d;
            nearestIdx = bi;
          }
        }
        const glow = 1 + Math.max(0, bars[nearestIdx].current - 1.05) * 2.2;
        el.style.filter = `brightness(${Math.min(1.5, glow).toFixed(3)})`;
      });
    };

    let prevMouseX = mouseX;
    let prevMouseY = mouseY;
    let prevHovering = false;
    let lastFrameT = 0;
    let lastTrailT = 0;
    let fastFrameCount = 0;

    const spawnTrail = (clientX: number, clientY: number) => {
      const container = trailContainerRef.current;
      if (!container) return;
      const dot = document.createElement("div");
      dot.className = "phosphor-trail";
      dot.style.left = `${clientX - rect.left}px`;
      dot.style.top = `${clientY - rect.top}px`;
      container.appendChild(dot);
      window.setTimeout(() => dot.remove(), TRAIL_LIFETIME_MS);
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

      // Velocity is sampled once per rAF tick (immune to raw mousemove
      // event-timing noise) against the REAL elapsed time since the last
      // tick (immune to dropped/delayed frames) — see the constants'
      // comment above for why both matter.
      const now = performance.now();
      if (hovering && prevHovering && lastFrameT) {
        const dt = Math.max(4, now - lastFrameT);
        const dx = mouseX - prevMouseX;
        const dy = mouseY - prevMouseY;
        const velocity = Math.hypot(dx, dy) / dt; // px/ms

        if (velocity > VELOCITY_SHEAR_MIN) {
          fastFrameCount++;
        } else {
          fastFrameCount = 0;
        }

        // Only a sustained fast gesture (several frames in a row above
        // threshold) spawns a trail — a lone spike, however large, is
        // treated as noise and ignored.
        if (
          fastFrameCount >= MIN_CONSECUTIVE_FAST_FRAMES &&
          velocity > TRAIL_VELOCITY_MIN &&
          now - lastTrailT > TRAIL_THROTTLE_MS
        ) {
          spawnTrail(mouseX, mouseY);
          lastTrailT = now;
        }
      } else {
        fastFrameCount = 0;
      }
      prevMouseX = mouseX;
      prevMouseY = mouseY;
      prevHovering = hovering;
      lastFrameT = now;

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
          const opacity = Math.min(1, Math.max(0.4, bar.current * 0.95)) * bar.edgeFade;
          el.style.opacity = opacity.toFixed(3);
        }
      });

      applySlatGlow(slatRefsMobile.current, slatCentersMobile);
      applySlatGlow(slatRefsDesktop.current, slatCentersDesktop);

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
        viewBox={`0 -650 ${EQ_VIEWBOX.w} ${EQ_VIEWBOX.h + 650}`}
        className="pointer-events-none absolute left-1/2 top-1/2 z-0 w-[94vw] max-w-none -translate-x-1/2 -translate-y-[62.92%] overflow-visible opacity-45 sm:left-auto sm:right-[max(5vw,calc((100vw_-_1400px)/2_+_150px))] sm:top-1/2 sm:w-[435px] sm:max-w-[calc(76vh*1685/2515)] sm:translate-x-0 sm:opacity-90 md:w-[538px] lg:w-[642px] xl:w-[725px] sm:[mask-image:linear-gradient(to_bottom,black_0%,black_78%,rgba(0,0,0,0.3)_98%)] sm:[-webkit-mask-image:linear-gradient(to_bottom,black_0%,black_78%,rgba(0,0,0,0.3)_98%)]"
      >
        <defs>
          {/* horizontal "hot core" — a real fluted-glass rib amplifies a
              bright filament down the center of what it's refracting,
              rather than washing the whole shape into a flat color */}
          <linearGradient id="spike-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity={0.55} />
            <stop offset="30%" stopColor="var(--accent)" />
            <stop offset="50%" stopColor="#ffe0cc" />
            <stop offset="70%" stopColor="var(--accent)" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity={0.55} />
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
            {/* directional blur: fluted glass is a row of vertical
                cylinders, so it smears light sideways across ribs while
                keeping the vertical profile (needle tips) comparatively
                sharp — a uniform blur reads as an out-of-focus photo,
                not glass */}
            <feGaussianBlur stdDeviation="10 2" />
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
          <div
            key={i}
            ref={(el) => {
              slatRefsMobile.current[i] = el;
            }}
            className="waveform-slat"
          />
        ))}
      </div>
      <div
        className="pointer-events-none absolute inset-0 z-[1] hidden overflow-hidden sm:flex"
        style={SLAT_MASK_STYLE}
      >
        {Array.from({ length: TOTAL_SLATS_DESKTOP }).map((_, i) => (
          <div
            key={i}
            ref={(el) => {
              slatRefsDesktop.current[i] = el;
            }}
            className="waveform-slat"
          />
        ))}
      </div>

      {/* phosphor trail dots spawned on fast cursor movement */}
      <div
        ref={trailContainerRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[3]"
      />

      {/* 3. film grain — concentrated near the top, fading toward the middle */}
      <div className="hero-grain z-20" />
    </div>
  );
}
