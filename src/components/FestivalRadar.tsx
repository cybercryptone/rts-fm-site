"use client";

import { useMemo } from "react";
import type { Festival } from "@/lib/festivals";

const WIDTH = 720;
const HEIGHT = 460;
const CX = WIDTH / 2;
const CY = HEIGHT / 2 + 6;
const OUTER_R = 186;

const COMPASS = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

// Real great-circle distance (haversine) between two verified lat/lon
// points, in km. Never a fabricated "as the crow flies" guess.
function distanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// Real initial compass bearing (0-360, 0 = north, clockwise) from point 1
// to point 2, standard forward-azimuth formula.
function bearingDeg(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const phi1 = toRad(lat1);
  const phi2 = toRad(lat2);
  const dLon = toRad(lon2 - lon1);
  const y = Math.sin(dLon) * Math.cos(phi2);
  const x = Math.cos(phi1) * Math.sin(phi2) - Math.sin(phi1) * Math.cos(phi2) * Math.cos(dLon);
  return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
}

function compassLabel(bearing: number): string {
  return COMPASS[Math.round(bearing / 45) % 8];
}

function polarPoint(cx: number, cy: number, r: number, bearing: number) {
  const rad = toRad(bearing);
  return { x: cx + r * Math.sin(rad), y: cy - r * Math.cos(rad) };
}

function niceKm(km: number): string {
  const rounded = km >= 1000 ? Math.round(km / 100) * 100 : Math.round(km / 10) * 10;
  return rounded.toLocaleString("en-US");
}

function coordLabel(lat: number, lon: number): string {
  const ns = lat >= 0 ? "N" : "S";
  const ew = lon >= 0 ? "E" : "W";
  return `${Math.abs(lat).toFixed(4)}° ${ns}, ${Math.abs(lon).toFixed(4)}° ${ew}`;
}

type Contact = {
  festival: Festival;
  dist: number;
  bearing: number;
};

type Blip = {
  key: string;
  point: { x: number; y: number };
  hub: { x: number; y: number };
  bearing: number;
  contacts: Contact[];
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
  const active = festivals.find((f) => f.slug === activeSlug) ?? null;

  // Every festival is plotted by its real distance and compass bearing
  // (haversine + forward azimuth, both real formulas on the verified
  // lat/lon in festivals.ts) from the centroid of the current, possibly
  // region-filtered, set — a radar scope centered on "here" rather than a
  // flat grid that has to fit the whole planet to place a dozen European
  // points. Festivals sharing exact coordinates (DGTL Amsterdam and
  // Dekmantel Festival both sit at the same Amsterdam venue district)
  // collapse to one contact and stack as a labeled group instead of two
  // labels drawn on top of each other.
  const { center, maxDist, ringKm, blips, activeContact } = useMemo(() => {
    const lats = festivals.map((f) => f.lat);
    const lons = festivals.map((f) => f.lon);
    const center = {
      lat: lats.reduce((a, b) => a + b, 0) / (lats.length || 1),
      lon: lons.reduce((a, b) => a + b, 0) / (lons.length || 1),
    };

    const contacts: Contact[] = festivals.map((f) => ({
      festival: f,
      dist: distanceKm(center.lat, center.lon, f.lat, f.lon),
      bearing: bearingDeg(center.lat, center.lon, f.lat, f.lon),
    }));

    const maxDist = Math.max(...contacts.map((c) => c.dist), 1);

    const groups = new Map<string, Contact[]>();
    for (const c of contacts) {
      const key = `${c.festival.lat.toFixed(3)}_${c.festival.lon.toFixed(3)}`;
      const group = groups.get(key);
      if (group) group.push(c);
      else groups.set(key, [c]);
    }

    // A linear km-to-pixel scale lets one far outlier (Movement, ~6,200km
    // from a Europe-heavy centroid) crush every nearby festival into an
    // illegible cluster at the center. A sqrt scale still preserves real
    // distance order (further is always further out) but gives the tightly
    // packed nearby contacts room to separate, the same tradeoff bubble
    // and radar charts make for exactly this kind of skewed spread.
    const radiusFor = (dist: number) => OUTER_R * Math.sqrt(dist / maxDist);

    // Real geography still leaves several of these festivals genuinely
    // close together (Berlin/Leipzig, the Amsterdam/Torzym belt), so even
    // the sqrt scale can land two blips close enough to overlap. Settle
    // that by nudging the later-placed one outward along its own bearing
    // until it clears a minimum on-screen separation from every blip
    // already placed — a label-declutter pass, not a change to which
    // point is genuinely closer or farther.
    const MIN_SEP = 34;
    const sortedGroups = Array.from(groups.entries()).sort(
      (a, b) => a[1][0].dist - b[1][0].dist,
    );
    const placed: { x: number; y: number }[] = [];
    // Label hubs get their own, more generous declutter pass on top of the
    // blip pass above: a blip's own dot can clear MIN_SEP while its text
    // (offset further out, and taller for a multi-contact group) still
    // overlaps a neighbor's, so this pass has to grow with the label's own
    // size, not just repeat the dot check.
    const placedHubs: { x: number; y: number }[] = [];
    const blips: Blip[] = sortedGroups.map(([key, group]) => {
      const { dist, bearing } = group[0];
      let r = radiusFor(dist);
      let point = polarPoint(CX, CY, r, bearing);
      for (let pass = 0; pass < 6; pass++) {
        const collision = placed.find((p) => Math.hypot(p.x - point.x, p.y - point.y) < MIN_SEP);
        if (!collision) break;
        r += MIN_SEP * 0.6;
        point = polarPoint(CX, CY, r, bearing);
      }
      placed.push(point);

      const labelSep = 58 + (group.length - 1) * 14;
      let hubR = r + 22;
      let hub = polarPoint(CX, CY, hubR, bearing);
      for (let pass = 0; pass < 6; pass++) {
        const collision = placedHubs.find((p) => Math.hypot(p.x - hub.x, p.y - hub.y) < labelSep);
        if (!collision) break;
        hubR += labelSep * 0.55;
        hub = polarPoint(CX, CY, hubR, bearing);
      }
      placedHubs.push(hub);

      return { key, point, hub, bearing, contacts: group };
    });

    const activeContact = contacts.find((c) => c.festival.slug === activeSlug) ?? null;

    // Ring radii sit at even thirds of the scope, so the km value each
    // ring represents has to invert the same sqrt scale: dist = maxDist *
    // (r / OUTER_R)^2.
    const ringKm = [1 / 3, 2 / 3, 1].map((f) => maxDist * f * f);

    return { center, maxDist, ringKm, blips, activeContact };
  }, [festivals, activeSlug]);

  return (
    <div className="relative overflow-hidden rounded-xl border border-line bg-bg-elevated">
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="h-auto w-full"
        role="img"
        aria-label="Radar-style scope plotting each festival's real-world distance and compass bearing from the center of the current selection"
      >
        <defs>
          <radialGradient id="radar-face" cx="50%" cy="50%" r="65%">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.05" />
            <stop offset="75%" stopColor="var(--accent)" stopOpacity="0" />
          </radialGradient>
          <filter id="blip-glow" x="-200%" y="-200%" width="500%" height="500%">
            <feGaussianBlur stdDeviation="4.5" />
          </filter>
        </defs>

        <rect x={0} y={0} width={WIDTH} height={HEIGHT} className="fill-bg" />
        <circle cx={CX} cy={CY} r={OUTER_R + 2} fill="url(#radar-face)" />

        {/* Range rings, ticked to real km distances derived from the
            current data's own spread, plus 8-point compass spokes. */}
        {[1 / 3, 2 / 3, 1].map((frac, i) => (
          <circle
            key={frac}
            cx={CX}
            cy={CY}
            r={OUTER_R * frac}
            className="fill-none stroke-line"
            strokeWidth={1}
            strokeDasharray={i < 2 ? "2 4" : undefined}
          />
        ))}
        {COMPASS.map((label, i) => {
          const angle = i * 45;
          const rim = polarPoint(CX, CY, OUTER_R, angle);
          const labelPt = polarPoint(CX, CY, OUTER_R + 16, angle);
          const anchor = Math.abs(labelPt.x - CX) < 1 ? "middle" : labelPt.x > CX ? "start" : "end";
          const dy = labelPt.y < CY - 1 ? -2 : labelPt.y > CY + 1 ? 9 : 4;
          return (
            <g key={label}>
              <line
                x1={CX}
                y1={CY}
                x2={rim.x}
                y2={rim.y}
                className="stroke-line"
                strokeWidth={1}
                opacity={0.6}
              />
              <text
                x={labelPt.x}
                y={labelPt.y + dy}
                textAnchor={anchor}
                className="fill-fg-dim/70 font-mono text-[9px] font-bold uppercase tracking-[0.08em]"
              >
                {label}
              </text>
            </g>
          );
        })}
        {ringKm.slice(0, 2).map((km, i) => (
          <text
            key={i}
            x={CX + 4}
            y={CY - OUTER_R * ((i + 1) / 3) - 4}
            className="fill-fg-dim/50 font-mono text-[8px]"
          >
            {niceKm(km)} km
          </text>
        ))}

        {/* Continuous sweep beam — the scope's "live" tell. Stops under
            prefers-reduced-motion via the .radar-sweep rule in globals.css. */}
        <g className="radar-sweep" style={{ transformOrigin: `${CX}px ${CY}px` }}>
          {Array.from({ length: 9 }).map((_, i) => {
            const a0 = -i * 6;
            const a1 = -(i + 1) * 6;
            const p0 = polarPoint(CX, CY, OUTER_R, a0);
            const p1 = polarPoint(CX, CY, OUTER_R, a1);
            return (
              <path
                key={i}
                d={`M ${CX} ${CY} L ${p0.x} ${p0.y} A ${OUTER_R} ${OUTER_R} 0 0 0 ${p1.x} ${p1.y} Z`}
                fill="var(--accent)"
                opacity={0.16 - i * 0.017}
              />
            );
          })}
        </g>

        {/* Scan center — the geometric centroid of the current
            (region-filtered) selection, not a claimed physical location. */}
        <g transform={`translate(${CX}, ${CY})`}>
          <line x1={-7} y1={0} x2={7} y2={0} className="stroke-fg-dim" strokeWidth={1} />
          <line x1={0} y1={-7} x2={0} y2={7} className="stroke-fg-dim" strokeWidth={1} />
          <circle r={2} className="fill-fg-dim" />
        </g>

        {/* Contacts. Grouped by exact shared coordinates so two festivals
            at the same venue district render as one blip with a stacked,
            individually hoverable label list instead of overlapping text. */}
        {blips.map((blip) => {
          const isActive = blip.contacts.some((c) => c.festival.slug === activeSlug);
          const hub = blip.hub;
          const labelAnchor = hub.x >= CX ? "start" : "end";
          const stubDx = hub.x >= CX ? 6 : -6;

          return (
            <g key={blip.key}>
              <line
                x1={blip.point.x}
                y1={blip.point.y}
                x2={hub.x}
                y2={hub.y}
                className={isActive ? "stroke-accent" : "stroke-fg-dim"}
                strokeWidth={1}
                opacity={0.55}
              />

              <g
                transform={`translate(${blip.point.x}, ${blip.point.y})`}
                onMouseEnter={() => onHoverFestival(blip.contacts[0].festival.slug)}
                onMouseLeave={() => onHoverFestival(null)}
                className="cursor-pointer"
              >
                <circle r={16} className="fill-transparent" />
                <circle
                  r={10}
                  filter="url(#blip-glow)"
                  className={isActive ? "fill-accent" : "fill-fg-dim"}
                  opacity={isActive ? 0.55 : 0.3}
                />
                {isActive && (
                  <>
                    <circle r={9} className="fill-none stroke-accent" strokeWidth={1.5}>
                      <animate attributeName="r" values="8;22;8" dur="1.8s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0.9;0;0.9" dur="1.8s" repeatCount="indefinite" />
                    </circle>
                  </>
                )}
                <rect
                  x={-4}
                  y={-4}
                  width={8}
                  height={8}
                  transform="rotate(45)"
                  className={isActive ? "fill-accent" : "fill-fg-dim"}
                />
              </g>

              <text
                x={hub.x}
                y={hub.y - (blip.contacts.length - 1) * 6.5 - 2}
                textAnchor={labelAnchor}
                className={`font-mono text-[9px] font-bold uppercase tracking-[0.08em] ${
                  isActive ? "fill-accent" : "fill-fg-dim"
                }`}
              >
                {blip.contacts[0].festival.city}
              </text>
              {blip.contacts.map((c, i) => (
                <g key={c.festival.slug}>
                  {blip.contacts.length > 1 && (
                    <line
                      x1={hub.x}
                      y1={hub.y - (blip.contacts.length - 1) * 6.5 + i * 13}
                      x2={hub.x + stubDx}
                      y2={hub.y - (blip.contacts.length - 1) * 6.5 + i * 13}
                      className="stroke-line"
                      strokeWidth={1}
                    />
                  )}
                  <text
                    x={hub.x + stubDx}
                    y={hub.y - (blip.contacts.length - 1) * 6.5 + i * 13 + 3}
                    textAnchor={labelAnchor}
                    onMouseEnter={() => onHoverFestival(c.festival.slug)}
                    onMouseLeave={() => onHoverFestival(null)}
                    className={`cursor-pointer font-mono text-[9px] uppercase tracking-[0.04em] ${
                      c.festival.slug === activeSlug ? "fill-accent" : "fill-fg-dim/80"
                    }`}
                  >
                    {blip.contacts.length > 1 ? c.festival.name : ""}
                  </text>
                </g>
              ))}
            </g>
          );
        })}
      </svg>

      <div className="pointer-events-none absolute bottom-3 left-3 font-mono text-[10px] uppercase tracking-[0.14em] text-fg-dim">
        {active && activeContact ? (
          <>
            <span className="text-accent">{active.name}</span>
            {" · "}
            {coordLabel(active.lat, active.lon)}
            {" · "}
            {Math.round(activeContact.dist).toLocaleString("en-US")} km {compassLabel(activeContact.bearing)} of
            center
          </>
        ) : (
          `Scope centered on ${coordLabel(center.lat, center.lon)} · range ${niceKm(maxDist)} km`
        )}
      </div>
    </div>
  );
}
