"use client";

import { useMemo, useState } from "react";
import {
  regionOf,
  festivalDurationDays,
  type Festival,
  type Region,
} from "@/lib/festivals";
import { formatDateRange } from "@/lib/format";
import FestivalRadar from "./FestivalRadar";

const REGION_FILTERS: { label: string; value: Region | "all" }[] = [
  { label: "All Regions", value: "all" },
  { label: "Europe", value: "Europe" },
  { label: "Americas", value: "Americas" },
  { label: "Asia", value: "Asia" },
];

function dateLabel(festival: Festival): string {
  if (festival.dateStatus === "tba" || !festival.startDate || !festival.endDate) {
    return "Dates TBA";
  }
  const range = formatDateRange(festival.startDate, festival.endDate);
  return festival.dateStatus === "estimated" ? `${range} (est., unconfirmed)` : range;
}

function TicketCta({ festival }: { festival: Festival }) {
  if (!festival.ticketUrl) return null;

  if (festival.ticketStatus === "sold-out") {
    return (
      <span className="shrink-0 self-start rounded-full border border-line px-4 py-2 font-mono text-[11px] uppercase tracking-[0.14em] text-fg-dim/60 line-through">
        Sold Out
      </span>
    );
  }

  return (
    <a
      href={festival.ticketUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="shrink-0 self-start rounded-full border border-accent/60 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.14em] text-accent transition-colors hover:bg-accent hover:text-bg"
    >
      Tickets →
    </a>
  );
}

function FestivalRow({
  festival,
  isHighlighted,
  onHover,
}: {
  festival: Festival;
  isHighlighted: boolean;
  onHover: (slug: string | null) => void;
}) {
  const days = festivalDurationDays(festival);
  return (
    <li
      onMouseEnter={() => onHover(festival.slug)}
      onMouseLeave={() => onHover(null)}
      className={`group relative border-l-2 transition-colors hover:border-accent hover:bg-fg/[0.03] ${
        isHighlighted ? "border-accent bg-fg/[0.03]" : "border-transparent"
      }`}
    >
      <div className="grid grid-cols-1 gap-5 py-10 pl-4 pr-4 sm:grid-cols-[150px_minmax(0,1fr)_minmax(240px,32%)_auto] sm:items-start sm:gap-8 sm:pl-6 sm:pr-10">
        {/* Col 1: date + city, date is the loud one */}
        <div className="font-mono uppercase leading-snug tracking-[0.1em]">
          <div className="text-[15px] font-bold text-accent">{dateLabel(festival)}</div>
          <div className="mt-1 text-xs text-fg-dim">
            {festival.city}, {festival.country}
          </div>
        </div>

        {/* Col 2: title, the visual anchor of the row, plus genre tags */}
        <div className="min-w-0">
          <a
            href={festival.website}
            target="_blank"
            rel="noopener noreferrer"
            className="block font-display text-[28px] font-bold uppercase leading-[1.05] tracking-[-0.03em] text-fg transition-colors hover:text-accent"
          >
            {festival.name}
          </a>
          {festival.genres.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {festival.genres.map((g) => (
                <span
                  key={g}
                  className="rounded-full border border-line px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-fg-dim"
                >
                  {g}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Col 3: description, gets its own real column instead of trailing off into empty space */}
        <p className="text-[15px] leading-[1.5] text-fg-dim sm:border-l sm:border-line sm:pl-6">
          {festival.description}
        </p>

        {/* Col 4: duration (real, derived) grouped tight against the ticket CTA */}
        <div className="flex flex-row items-center gap-4 sm:flex-col sm:items-end sm:gap-3">
          {days && (
            <span className="font-mono text-sm uppercase tracking-[0.1em] text-fg-dim">
              {days} DAY{days > 1 ? "S" : ""}
            </span>
          )}
          <TicketCta festival={festival} />
        </div>
      </div>
    </li>
  );
}

export default function FestivalsList({
  upcoming,
  past,
}: {
  upcoming: Festival[];
  past: Festival[];
}) {
  const [region, setRegion] = useState<Region | "all">("all");
  const [view, setView] = useState<"list" | "radar">("list");
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);

  const filteredUpcoming = useMemo(
    () => (region === "all" ? upcoming : upcoming.filter((f) => regionOf(f.country) === region)),
    [upcoming, region],
  );
  const filteredPast = useMemo(
    () => (region === "all" ? past : past.filter((f) => regionOf(f.country) === region)),
    [past, region],
  );

  return (
    <>
      <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-y border-line py-4">
        <div role="group" aria-label="Filter by region" className="flex flex-wrap gap-2">
          {REGION_FILTERS.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setRegion(f.value)}
              aria-pressed={region === f.value}
              className={`rounded-full border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] transition-colors ${
                region === f.value
                  ? "border-accent bg-accent text-bg"
                  : "border-line text-fg-dim hover:border-accent/60 hover:text-accent"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div role="group" aria-label="Switch view" className="flex gap-2">
          {(["list", "radar"] as const).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setView(v)}
              aria-pressed={view === v}
              className={`rounded-full border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] transition-colors ${
                view === v
                  ? "border-accent bg-accent text-bg"
                  : "border-line text-fg-dim hover:border-accent/60 hover:text-accent"
              }`}
            >
              {v === "list" ? "List View" : "Radar Map"}
            </button>
          ))}
        </div>
      </div>

      {filteredUpcoming.length === 0 && filteredPast.length === 0 ? (
        <p className="mt-10 text-sm text-fg-dim">No festivals match that filter yet.</p>
      ) : (
        <>
          {view === "radar" ? (
            <div className="mt-6">
              <FestivalRadar
                festivals={[...filteredUpcoming, ...filteredPast]}
                activeSlug={hoveredSlug}
                onHoverFestival={setHoveredSlug}
              />
              <p className="mt-4 text-xs text-fg-dim">
                Hover a node for its city and coordinates, or switch to list view for
                descriptions and ticket links.
              </p>
            </div>
          ) : (
            <>
              {filteredUpcoming.length > 0 && (
                <ul className="blog-divider mt-4 flex flex-col divide-y border-y">
                  {filteredUpcoming.map((festival) => (
                    <FestivalRow
                      key={festival.slug}
                      festival={festival}
                      isHighlighted={hoveredSlug === festival.slug}
                      onHover={setHoveredSlug}
                    />
                  ))}
                </ul>
              )}

              {filteredPast.length > 0 && (
                <details className="mt-12">
                  <summary className="cursor-pointer font-mono text-xs font-bold uppercase tracking-[0.14em] text-fg-dim">
                    Past festivals ({filteredPast.length})
                  </summary>
                  <ul className="blog-divider mt-4 flex flex-col divide-y border-y">
                    {filteredPast.map((festival) => (
                      <FestivalRow
                        key={festival.slug}
                        festival={festival}
                        isHighlighted={hoveredSlug === festival.slug}
                        onHover={setHoveredSlug}
                      />
                    ))}
                  </ul>
                </details>
              )}
            </>
          )}
        </>
      )}
    </>
  );
}
