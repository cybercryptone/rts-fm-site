"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { feature } from "topojson-client";
import type { GeometryCollection, Topology } from "topojson-specification";
import type { FeatureCollection, GeometryObject } from "geojson";
import landTopology from "world-atlas/land-110m.json";
import { festivalDateLabel, type Festival } from "@/lib/festivals";

const WIDTH = 720;
// Real-world width:height ratio of the current selection's own bounding
// box, clamped to a sane range. A fixed canvas shape forced tight
// clusters (Europe alone) to letterbox on the sides, and wide ones
// (Europe + Detroit) to letterbox top/bottom — either way, wasted canvas
// around the actual data. Letting the canvas height follow the data's
// real aspect keeps it filled in both cases, while the clamp keeps an
// extreme outlier from squashing the map into an unusable sliver.
const MIN_ASPECT = 0.55;
const MAX_ASPECT = 3.2;

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

function axisLabel(lat: number, lon: number): string {
  const ns = lat >= 0 ? "N" : "S";
  const ew = lon >= 0 ? "E" : "W";
  return `${Math.abs(lat).toFixed(1)}° ${ns} // ${Math.abs(lon).toFixed(1)}° ${ew}`;
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
  const containerRef = useRef<HTMLDivElement>(null);
  const [pointer, setPointer] = useState<{ x: number; y: number } | null>(null);

  // The tooltip's own visibility is tracked separately from the shared
  // `activeSlug` (which also drives the pulsing ring, and can be set
  // externally by hovering a list row that has no cursor position to
  // anchor a tooltip to). A short hide delay, cancelled if the cursor
  // lands on the tooltip itself before it fires, is what lets a user
  // actually move from the small diamond onto the tooltip and click a
  // link in it — without it, leaving the diamond's tiny hit area hid the
  // tooltip before the cursor ever reached it.
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);
  // A click (or tap — touch devices have no hover at all) pins the
  // tooltip open regardless of the cursor, until the same marker is
  // clicked again or the user clicks outside both the marker and the
  // card. This is what actually makes the map usable on touch.
  const [pinnedKey, setPinnedKey] = useState<string | null>(null);
  const hideTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  function setPointerFromEvent(e: { clientX: number; clientY: number }) {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setPointer({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  }

  useEffect(() => {
    return () => {
      if (hideTimeout.current) clearTimeout(hideTimeout.current);
    };
  }, []);

  function showBlip(blip: Blip) {
    if (hideTimeout.current) {
      clearTimeout(hideTimeout.current);
      hideTimeout.current = null;
    }
    setHoveredKey(blip.key);
    onHoverFestival(blip.festivals[0].slug);
  }

  function scheduleHide() {
    hideTimeout.current = setTimeout(() => {
      setHoveredKey(null);
      onHoverFestival(null);
    }, 200);
  }

  function cancelHide() {
    if (hideTimeout.current) {
      clearTimeout(hideTimeout.current);
      hideTimeout.current = null;
    }
  }

  // A plain equirectangular fit, auto-fit to the current selection's own
  // bounding box — real lat/lon, not a distance-from-center radar
  // projection. One shared scale for both axes, with a cosine correction
  // on longitude for the view's own reference latitude — the standard
  // equirectangular fix — so a real square patch of the earth's surface
  // still renders roughly square instead of stretching.
  const { height, landPaths, blips, latTicks, lonTicks, corners, project } = useMemo(() => {
    const lats = festivals.map((f) => f.lat);
    const lons = festivals.map((f) => f.lon);
    const rawMinLat = lats.length ? Math.min(...lats) : 30;
    const rawMaxLat = lats.length ? Math.max(...lats) : 60;
    const rawMinLon = lons.length ? Math.min(...lons) : -10;
    const rawMaxLon = lons.length ? Math.max(...lons) : 20;

    const latSpan = Math.max(rawMaxLat - rawMinLat, 3);
    const lonSpan = Math.max(rawMaxLon - rawMinLon, 3);
    const latPad = Math.max(latSpan * 0.15, 2.5);
    const lonPad = Math.max(lonSpan * 0.15, 2.5);

    const minLat = Math.max(rawMinLat - latPad, -85);
    const maxLat = Math.min(rawMaxLat + latPad, 85);
    const minLon = rawMinLon - lonPad;
    const maxLon = rawMaxLon + lonPad;

    const midLat = (minLat + maxLat) / 2;
    const midLon = (minLon + maxLon) / 2;
    const cosMidLat = Math.cos((midLat * Math.PI) / 180);

    const rawAspect = ((maxLon - minLon) * cosMidLat) / (maxLat - minLat);
    const aspect = Math.min(Math.max(rawAspect, MIN_ASPECT), MAX_ASPECT);
    const height = Math.round(WIDTH / aspect);

    const scale = Math.min(WIDTH / ((maxLon - minLon) * cosMidLat), height / (maxLat - minLat));

    const project = (lat: number, lon: number) => ({
      x: WIDTH / 2 + (lon - midLon) * cosMidLat * scale,
      y: height / 2 - (lat - midLat) * scale,
    });

    const landPaths = LAND_RINGS.map((ring) => {
      let d = "";
      ring.forEach(([lon, lat], i) => {
        const { x, y } = project(lat, lon);
        d += `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)} `;
      });
      return `${d}Z`;
    });

    const latStep = pickStep(maxLat - minLat);
    const lonStep = pickStep(maxLon - minLon);
    const latTicks = ticksFor(minLat, maxLat, latStep);
    const lonTicks = ticksFor(minLon, maxLon, lonStep);

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

    const corners = {
      topLeft: axisLabel(maxLat, minLon),
      bottomRight: axisLabel(minLat, maxLon),
    };

    return { height, landPaths, blips, latTicks, lonTicks, corners, project };
  }, [festivals]);

  const tooltipBlip = blips.find((b) => b.key === (pinnedKey ?? hoveredKey)) ?? null;

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden rounded-xl border border-line bg-bg-elevated"
      onMouseMove={setPointerFromEvent}
      onMouseLeave={() => setPointer(null)}
      onClick={(e) => {
        const target = e.target as Element;
        if (target.closest("[data-blip-marker]") || target.closest("[data-blip-tooltip]")) return;
        setPinnedKey(null);
        onHoverFestival(null);
      }}
    >
      <svg
        viewBox={`0 0 ${WIDTH} ${height}`}
        className="h-auto w-full"
        role="img"
        aria-label="Abstract map plotting each festival by its real coordinates, with a faint real-world coastline and coordinate grid for reference"
      >
        <rect x={0} y={0} width={WIDTH} height={height} className="fill-bg" />

        {/* Real coastline (Natural Earth, 110m resolution), faint —
            geographic reference, not the focal point. */}
        <g className="fill-fg-dim/[0.09] stroke-fg-dim/[0.14]" strokeWidth={0.75}>
          {landPaths.map((d, i) => (
            <path key={i} d={d} />
          ))}
        </g>

        {/* Faint coordinate grid — reads as a plotting board rather than
            bare gray shapes. */}
        <g className="stroke-fg-dim/[0.08]" strokeWidth={0.75}>
          {latTicks.map((lat) => {
            const { y } = project(lat, 0);
            return <line key={`lat-${lat}`} x1={0} y1={y} x2={WIDTH} y2={y} />;
          })}
          {lonTicks.map((lon) => {
            const { x } = project(0, lon);
            return <line key={`lon-${lon}`} x1={x} y1={0} x2={x} y2={height} />;
          })}
        </g>

        {/* Corner coordinate readout — studio-HUD detail tying the map
            back to the site's instrument aesthetic. */}
        <text x={8} y={16} className="fill-fg-dim/60 font-mono text-[8px] uppercase tracking-[0.06em]">
          {corners.topLeft}
        </text>
        <text
          x={WIDTH - 8}
          y={height - 8}
          textAnchor="end"
          className="fill-fg-dim/60 font-mono text-[8px] uppercase tracking-[0.06em]"
        >
          {corners.bottomRight}
        </text>

        {/* Contacts — small hollow diamonds on a solid halo so nearby
            points (the Netherlands/Germany cluster) stay visually
            distinct instead of merging edge to edge, each with an
            always-visible city label so the map reads without hovering
            every pin. */}
        {blips.map((blip) => {
          const isActive = blip.key === pinnedKey || blip.festivals.some((f) => f.slug === activeSlug);
          return (
            <g
              key={blip.key}
              data-blip-marker
              transform={`translate(${blip.point.x}, ${blip.point.y})`}
              onMouseEnter={() => showBlip(blip)}
              onMouseLeave={scheduleHide}
              onClick={(e) => {
                e.stopPropagation();
                setPointerFromEvent(e);
                if (pinnedKey === blip.key) {
                  setPinnedKey(null);
                  onHoverFestival(null);
                } else {
                  setPinnedKey(blip.key);
                  onHoverFestival(blip.festivals[0].slug);
                }
              }}
              className="cursor-pointer"
            >
              <circle r={13} className="fill-transparent" />
              {isActive && (
                <circle r={4} className="fill-none stroke-accent" strokeWidth={1.5}>
                  <animate attributeName="r" values="3.5;10;3.5" dur="1.6s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.9;0;0.9" dur="1.6s" repeatCount="indefinite" />
                </circle>
              )}
              <rect x={-4.5} y={-4.5} width={9} height={9} transform="rotate(45)" className="fill-bg-elevated" />
              <rect
                x={-2.5}
                y={-2.5}
                width={5}
                height={5}
                transform="rotate(45)"
                className={isActive ? "fill-accent stroke-accent" : "fill-bg-elevated stroke-fg"}
                strokeWidth={1.25}
              />
              <text
                x={7}
                y={-6}
                className={`font-mono text-[8px] uppercase tracking-[0.05em] ${
                  isActive ? "fill-accent" : "fill-fg-dim/40"
                }`}
              >
                {blip.festivals[0].city}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Hover card — follows the cursor while a contact is active, and
          stays open (via cancelHide) while the cursor is on the card
          itself, so its links are actually reachable. */}
      {tooltipBlip && pointer && (
        <div
          data-blip-tooltip
          onMouseEnter={cancelHide}
          onMouseLeave={scheduleHide}
          className="absolute z-10 rounded-md border border-line bg-bg-elevated px-3 py-2 font-mono text-[10px] uppercase tracking-[0.08em] shadow-lg"
          style={{
            left: `${pointer.x}%`,
            top: `${pointer.y}%`,
            transform: `translate(${pointer.x > 65 ? "calc(-100% - 14px)" : "14px"}, ${
              pointer.y > 70 ? "calc(-100% - 14px)" : "14px"
            })`,
          }}
        >
          {tooltipBlip.festivals.map((f, i) => (
            <div key={f.slug} className={i > 0 ? "mt-2 border-t border-line pt-2" : ""}>
              <div className="text-fg-dim">[{coordLabel(f.lat, f.lon)}]</div>
              <a
                href={f.website}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-0.5 block text-accent hover:underline"
              >
                {`${f.name} // ${f.city}`}
              </a>
              <div className="mt-0.5 text-fg-dim">
                {festivalDateLabel(f)}
                {" · "}
                {f.ticketUrl ? (
                  <a
                    href={f.ticketUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:underline"
                  >
                    Tickets →
                  </a>
                ) : (
                  "Tickets TBA"
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
