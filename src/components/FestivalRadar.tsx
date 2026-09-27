"use client";

import { useMemo } from "react";
import { feature } from "topojson-client";
import type { GeometryCollection, Topology } from "topojson-specification";
import type { FeatureCollection, GeometryObject } from "geojson";
import landTopology from "world-atlas/land-110m.json";
import type { Festival } from "@/lib/festivals";

const WIDTH = 720;
const HEIGHT = 400;

// Real Natural Earth land outlines (public domain, via the world-atlas
// package), not a hand-drawn approximation — the whole point of showing a
// coastline at all is that it has to be geographically honest. Extracted
// once at module scope since the shapes themselves never change; only the
// projection (fit to whichever festivals are currently in view) does.
const LAND_RINGS: [number, number][][] = (() => {
  const topology = landTopology as unknown as Topology;
  const fc = feature(
    topology,
    topology.objects.land as GeometryCollection,
  ) as FeatureCollection<GeometryObject>;
  const rings: [number, number][][] = [];
  for (const f of fc.features) {
    const geom = f.geometry;
    if (geom.type === "Polygon") {
      for (const ring of geom.coordinates) rings.push(ring as [number, number][]);
    } else if (geom.type === "MultiPolygon") {
      for (const poly of geom.coordinates) for (const ring of poly) rings.push(ring as [number, number][]);
    }
  }
  return rings;
})();

function coordLabel(lat: number, lon: number): string {
  const ns = lat >= 0 ? "N" : "S";
  const ew = lon >= 0 ? "E" : "W";
  return `${Math.abs(lat).toFixed(4)}° ${ns}, ${Math.abs(lon).toFixed(4)}° ${ew}`;
}

type Blip = {
  key: string;
  point: { x: number; y: number };
  festivals: Festival[];
};

export default function FestivalRadar({
  festivals,
  activeSlug,
  onHoverFestival,
}: {
  festivals: Festival[];
  activeSlug: string | null;
  onHoverFestival: (slug: string | null) => void;
}) {
  // A plain equirectangular fit (real lat -> y, real lon -> x, linear,
  // auto-fit to the current selection's own bounding box) instead of a
  // radar-style distance-from-center projection: the latter put a point's
  // screen position on how far it was from an arbitrary centroid rather
  // than its real position, which read as geographically nonsensical
  // (Detroit landing next to London on the same range ring). This keeps
  // every point where it actually is, relative to its neighbors.
  const { landPaths, blips } = useMemo(() => {
    const lats = festivals.map((f) => f.lat);
    const lons = festivals.map((f) => f.lon);
    const rawMinLat = lats.length ? Math.min(...lats) : 30;
    const rawMaxLat = lats.length ? Math.max(...lats) : 60;
    const rawMinLon = lons.length ? Math.min(...lons) : -10;
    const rawMaxLon = lons.length ? Math.max(...lons) : 20;

    const latSpan = Math.max(rawMaxLat - rawMinLat, 4);
    const lonSpan = Math.max(rawMaxLon - rawMinLon, 4);
    const latPad = Math.max(latSpan * 0.3, 5);
    const lonPad = Math.max(lonSpan * 0.3, 5);

    const minLat = Math.max(rawMinLat - latPad, -85);
    const maxLat = Math.min(rawMaxLat + latPad, 85);
    const minLon = rawMinLon - lonPad;
    const maxLon = rawMaxLon + lonPad;

    const project = (lat: number, lon: number) => ({
      x: ((lon - minLon) / (maxLon - minLon)) * WIDTH,
      y: ((maxLat - lat) / (maxLat - minLat)) * HEIGHT,
    });

    const landPaths = LAND_RINGS.map((ring) => {
      let d = "";
      ring.forEach(([lon, lat], i) => {
        const { x, y } = project(lat, lon);
        d += `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)} `;
      });
      return `${d}Z`;
    });

    const groups = new Map<string, Festival[]>();
    for (const f of festivals) {
      const key = `${f.lat.toFixed(3)}_${f.lon.toFixed(3)}`;
      const group = groups.get(key);
      if (group) group.push(f);
      else groups.set(key, [f]);
    }
    const blips: Blip[] = Array.from(groups.entries()).map(([key, group]) => ({
      key,
      point: project(group[0].lat, group[0].lon),
      festivals: group,
    }));

    return { landPaths, blips };
  }, [festivals]);

  const activeBlip = blips.find((b) => b.festivals.some((f) => f.slug === activeSlug)) ?? null;
  const active = festivals.find((f) => f.slug === activeSlug) ?? null;

  return (
    <div className="relative overflow-hidden rounded-xl border border-line bg-bg-elevated">
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="h-auto w-full"
        role="img"
        aria-label="Abstract map plotting each festival by its real coordinates, with a faint real-world coastline for reference"
      >
        <rect x={0} y={0} width={WIDTH} height={HEIGHT} className="fill-bg" />

        {/* Real coastline (Natural Earth, 110m resolution), faint —
            geographic reference, not the focal point. */}
        <g className="fill-fg-dim/[0.09] stroke-fg-dim/[0.14]" strokeWidth={0.75}>
          {landPaths.map((d, i) => (
            <path key={i} d={d} />
          ))}
        </g>

        {/* Slow scanline, the one nod to a "live instrument" — subtle
            enough not to compete with the map itself. */}
        <line x1={0} x2={WIDTH} className="stroke-accent" strokeWidth={1} opacity={0.14}>
          <animate attributeName="y1" values={`0;${HEIGHT};0`} dur="10s" repeatCount="indefinite" />
          <animate attributeName="y2" values={`0;${HEIGHT};0`} dur="10s" repeatCount="indefinite" />
        </line>

        {/* Contacts — small hollow diamonds, lit up only on hover. Names
            stay hidden until then; showing all of them at once was the
            spider-web of overlapping labels this replaces. */}
        {blips.map((blip) => {
          const isActive = blip.festivals.some((f) => f.slug === activeSlug);
          return (
            <g
              key={blip.key}
              transform={`translate(${blip.point.x}, ${blip.point.y})`}
              onMouseEnter={() => onHoverFestival(blip.festivals[0].slug)}
              onMouseLeave={() => onHoverFestival(null)}
              className="cursor-pointer"
            >
              <circle r={14} className="fill-transparent" />
              {isActive && (
                <circle r={6} className="fill-none stroke-accent" strokeWidth={1.5}>
                  <animate attributeName="r" values="5;13;5" dur="1.6s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.9;0;0.9" dur="1.6s" repeatCount="indefinite" />
                </circle>
              )}
              <rect
                x={-3.5}
                y={-3.5}
                width={7}
                height={7}
                transform="rotate(45)"
                className={isActive ? "fill-accent stroke-accent" : "fill-bg-elevated stroke-fg-dim"}
                strokeWidth={1.25}
              />
            </g>
          );
        })}
      </svg>

      {/* Hover tooltip — one compact card near the active point instead of
          permanent leader-lined labels scattered across the map. */}
      {activeBlip && (
        <div
          className="pointer-events-none absolute z-10 -translate-x-1/2 rounded-md border border-line bg-bg-elevated px-3 py-2 font-mono text-[10px] uppercase tracking-[0.1em] shadow-lg"
          style={{
            left: `${(activeBlip.point.x / WIDTH) * 100}%`,
            top: `${(activeBlip.point.y / HEIGHT) * 100}%`,
            transform: `translate(-50%, ${activeBlip.point.y < 60 ? "8px" : "calc(-100% - 8px)"})`,
          }}
        >
          <div className="text-accent">{activeBlip.festivals[0].city}</div>
          {activeBlip.festivals.map((f) => (
            <div key={f.slug} className="mt-0.5 text-fg-dim">
              {f.name}
            </div>
          ))}
        </div>
      )}

      <div className="pointer-events-none absolute bottom-3 left-3 font-mono text-[10px] uppercase tracking-[0.14em] text-fg-dim">
        {active ? (
          <>
            <span className="text-accent">{active.name}</span>
            {" · "}
            {coordLabel(active.lat, active.lon)}
          </>
        ) : (
          "Hover a node for its coordinates"
        )}
      </div>
    </div>
  );
}
