"use client";

import type { Festival } from "@/lib/festivals";

const WIDTH = 720;
const HEIGHT = 380;

// Plain equirectangular projection, no map library and no drawn coastlines:
// coastline data we don't have would either need a real geo dataset or a
// hand-approximated shape we can't verify as accurate, so the "radar" reads
// off a lat/lon graticule instead. Honest about being abstract rather than
// a real map.
function project(lat: number, lon: number): { x: number; y: number } {
  const x = ((lon + 180) / 360) * WIDTH;
  const y = ((90 - lat) / 180) * HEIGHT;
  return { x, y };
}

function coordLabel(lat: number, lon: number): string {
  const ns = lat >= 0 ? "N" : "S";
  const ew = lon >= 0 ? "E" : "W";
  return `${Math.abs(lat).toFixed(4)}° ${ns}, ${Math.abs(lon).toFixed(4)}° ${ew}`;
}

const LAT_LINES = [-60, -30, 0, 30, 60];
const LON_LINES = [-150, -120, -90, -60, -30, 0, 30, 60, 90, 120, 150];

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

  return (
    <div className="relative overflow-hidden rounded-xl border border-line bg-bg-elevated">
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="h-auto w-full"
        role="img"
        aria-label="Radar-style map of festival locations, plotted by coordinates on a latitude and longitude grid"
      >
        <rect x={0} y={0} width={WIDTH} height={HEIGHT} className="fill-bg" />

        {/* Graticule, the "radar screen" */}
        {LAT_LINES.map((lat) => {
          const { y } = project(lat, 0);
          return (
            <line
              key={`lat-${lat}`}
              x1={0}
              y1={y}
              x2={WIDTH}
              y2={y}
              className="stroke-line"
              strokeWidth={1}
            />
          );
        })}
        {LON_LINES.map((lon) => {
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
        {/* Equator and prime meridian, slightly heavier */}
        <line x1={0} y1={project(0, 0).y} x2={WIDTH} y2={project(0, 0).y} className="stroke-line" strokeWidth={1.5} />
        <line x1={project(0, 0).x} y1={0} x2={project(0, 0).x} y2={HEIGHT} className="stroke-line" strokeWidth={1.5} />

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
              <circle r={10} className="fill-transparent" />
              {isActive && (
                <circle r={7} className="fill-none stroke-accent" strokeWidth={1}>
                  <animate attributeName="r" values="5;10;5" dur="1.6s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.9;0;0.9" dur="1.6s" repeatCount="indefinite" />
                </circle>
              )}
              <line x1={-4} y1={0} x2={4} y2={0} className={isActive ? "stroke-accent" : "stroke-fg-dim"} strokeWidth={1.5} />
              <line x1={0} y1={-4} x2={0} y2={4} className={isActive ? "stroke-accent" : "stroke-fg-dim"} strokeWidth={1.5} />
              <circle r={2} className={isActive ? "fill-accent" : "fill-fg-dim"} />
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
