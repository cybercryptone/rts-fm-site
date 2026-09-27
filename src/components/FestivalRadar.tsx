"use client";

import { useMemo } from "react";
import type { Festival } from "@/lib/festivals";

const WIDTH = 720;
const HEIGHT = 380;

// "Nice" tick intervals to pick from once we know how wide a span the data
// actually covers, so the graticule reads as a few clean lines rather than
// either one bare line or fifty crowded ones.
const TICK_STEPS = [1, 2, 5, 10, 15, 20, 30, 45, 90];

function pickStep(span: number): number {
  const target = span / 5;
  return TICK_STEPS.find((step) => step >= target) ?? TICK_STEPS[TICK_STEPS.length - 1];
}

function ticksFor(min: number, max: number, step: number): number[] {
  const start = Math.ceil(min / step) * step;
  const ticks: number[] = [];
  for (let v = start; v <= max; v += step) ticks.push(Math.round(v * 100) / 100);
  return ticks;
}

function coordLabel(lat: number, lon: number): string {
  const ns = lat >= 0 ? "N" : "S";
  const ew = lon >= 0 ? "E" : "W";
  return `${Math.abs(lat).toFixed(4)}° ${ns}, ${Math.abs(lon).toFixed(4)}° ${ew}`;
}

export default function FestivalRadar({
  festivals,
  activeSlug,
  onHoverFestival,
}: {
  festivals: Festival[];
  activeSlug: string | null;
  onHoverFestival: (slug: string | null) => void;
}) {
  const active = festivals.find((f) => f.slug === activeSlug) ?? null;

  // Auto-fit the view to wherever the current (possibly region-filtered)
  // set of festivals actually is, instead of always projecting the whole
  // planet. A dozen European festivals plotted against a full world
  // graticule collapse into a tiny, near-invisible cluster in one corner;
  // zooming to the data's own bounding box (with padding, and a floor so a
  // single point or a tight cluster doesn't over-zoom into nothing) is what
  // makes the radar actually readable.
  const { project, latTicks, lonTicks } = useMemo(() => {
    const lats = festivals.map((f) => f.lat);
    const lons = festivals.map((f) => f.lon);
    const rawMinLat = lats.length ? Math.min(...lats) : 30;
    const rawMaxLat = lats.length ? Math.max(...lats) : 60;
    const rawMinLon = lons.length ? Math.min(...lons) : -10;
    const rawMaxLon = lons.length ? Math.max(...lons) : 20;

    const latSpan = Math.max(rawMaxLat - rawMinLat, 4);
    const lonSpan = Math.max(rawMaxLon - rawMinLon, 4);
    const latPad = Math.max(latSpan * 0.25, 4);
    const lonPad = Math.max(lonSpan * 0.25, 4);

    const minLat = Math.max(rawMinLat - latPad, -85);
    const maxLat = Math.min(rawMaxLat + latPad, 85);
    const minLon = rawMinLon - lonPad;
    const maxLon = rawMaxLon + lonPad;

    const project = (lat: number, lon: number) => ({
      x: ((lon - minLon) / (maxLon - minLon)) * WIDTH,
      y: ((maxLat - lat) / (maxLat - minLat)) * HEIGHT,
    });

    const latStep = pickStep(maxLat - minLat);
    const lonStep = pickStep(maxLon - minLon);

    return {
      project,
      latTicks: ticksFor(minLat, maxLat, latStep),
      lonTicks: ticksFor(minLon, maxLon, lonStep),
    };
  }, [festivals]);

  return (
    <div className="relative overflow-hidden rounded-xl border border-line bg-bg-elevated">
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="h-auto w-full"
        role="img"
        aria-label="Radar-style map of festival locations, plotted by coordinates on a latitude and longitude grid"
      >
        <rect x={0} y={0} width={WIDTH} height={HEIGHT} className="fill-bg" />

        {/* Graticule, the "radar screen", ticked to whatever span the
            current data actually covers. */}
        {latTicks.map((lat) => {
          const { y } = project(lat, 0);
          return (
            <g key={`lat-${lat}`}>
              <line x1={0} y1={y} x2={WIDTH} y2={y} className="stroke-line" strokeWidth={1} />
              <text x={6} y={y - 4} className="fill-fg-dim/60 font-mono text-[8px]">
                {lat.toFixed(0)}°
              </text>
            </g>
          );
        })}
        {lonTicks.map((lon) => {
          const { x } = project(0, lon);
          return (
            <line
              key={`lon-${lon}`}
              x1={x}
              y1={0}
              x2={x}
              y2={HEIGHT}
              className="stroke-line"
              strokeWidth={1}
            />
          );
        })}

        {/* Festival reticles */}
        {festivals.map((f) => {
          const { x, y } = project(f.lat, f.lon);
          const isActive = f.slug === activeSlug;
          return (
            <g
              key={f.slug}
              transform={`translate(${x}, ${y})`}
              onMouseEnter={() => onHoverFestival(f.slug)}
              onMouseLeave={() => onHoverFestival(null)}
              className="cursor-pointer"
            >
              <circle r={14} className="fill-transparent" />
              {isActive && (
                <circle r={9} className="fill-none stroke-accent" strokeWidth={1}>
                  <animate attributeName="r" values="7;14;7" dur="1.6s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.9;0;0.9" dur="1.6s" repeatCount="indefinite" />
                </circle>
              )}
              <line x1={-6} y1={0} x2={6} y2={0} className={isActive ? "stroke-accent" : "stroke-fg-dim"} strokeWidth={1.5} />
              <line x1={0} y1={-6} x2={0} y2={6} className={isActive ? "stroke-accent" : "stroke-fg-dim"} strokeWidth={1.5} />
              <circle r={3} className={isActive ? "fill-accent" : "fill-fg-dim"} />
              <text
                x={9}
                y={-9}
                className={`font-mono text-[9px] uppercase tracking-[0.06em] ${isActive ? "fill-accent" : "fill-fg-dim"}`}
              >
                {f.city}
              </text>
            </g>
          );
        })}
      </svg>

      <div className="pointer-events-none absolute bottom-3 left-3 font-mono text-[10px] uppercase tracking-[0.14em] text-fg-dim">
        {active ? (
          <>
            <span className="text-accent">{active.name}</span>
            {" · "}
            {coordLabel(active.lat, active.lon)}
          </>
        ) : (
          "Hover a node for coordinates"
        )}
      </div>
    </div>
  );
}
