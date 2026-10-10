import type { Metadata } from "next";
import Nav from "@/components/Nav";
import AboutFooter from "@/components/AboutFooter";
import FestivalsList from "@/components/FestivalsList";
import Link from "next/link";
import {
  getUpcomingFestivals,
  getPastFestivals,
  getCalendarYears,
  getCountryHubs,
  oldestVerified,
  type Festival,
} from "@/lib/festivals";
import { formatDate } from "@/lib/format";
import { breadcrumbJsonLd, eventJsonLd } from "@/lib/schema";

const description =
  "A curated list of the world's major underground house and techno festivals, with dates, cities, and official ticket links.";

export const metadata: Metadata = {
  title: { absolute: "Underground Techno & House Festivals: Dates & Tickets" },
  description,
  alternates: { canonical: "/festivals" },
  openGraph: { type: "website", url: "/festivals", title: "Festivals — RTS.FM", description },
  twitter: { card: "summary_large_image", title: "Festivals — RTS.FM", description },
};

export default function FestivalsIndex() {
  const upcoming = getUpcomingFestivals();
  const past = getPastFestivals();
  const years = getCalendarYears();
  const hubs = getCountryHubs();
  const checked = oldestVerified();
  const breadcrumb = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Festivals", path: "/festivals" },
  ]);

  // Only fully-dated, confirmed festivals get an Event listing: Google's
  // rich result wants a real date it can trust, and an "estimated" or "tba"
  // entry has nothing reliable to offer there yet.
  const eventListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: upcoming
      .filter((f): f is Festival & { startDate: string; endDate: string } =>
        f.dateStatus === "confirmed" && !!f.startDate && !!f.endDate,
      )
      .map((f, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: eventJsonLd(f),
      })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      {eventListJsonLd.itemListElement.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(eventListJsonLd) }}
        />
      )}
      <Nav />
      <main
        className="flex-1 px-6 pb-24 sm:px-10 sm:pb-32"
        style={{ paddingTop: "calc(var(--nav-height) + 4rem)" }}
      >
        <div className="mx-auto max-w-[1400px]">
          <div className="flex items-baseline gap-3 font-mono text-xs uppercase tracking-[0.2em] text-fg-dim">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            house &amp; techno
          </div>
          <h1 className="mt-[18px] font-display text-4xl font-bold uppercase tracking-[-0.02em] text-fg sm:text-5xl">
            Festivals
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-fg-dim">
            A short, hand-picked list of the underground house and techno world&apos;s major
            festivals, not a full listings aggregator. Every ticket link goes straight to the
            festival&apos;s own vendor; RTS.FM never sells or handles tickets itself.
          </p>

          {(years.length > 0 || hubs.length > 0) && (
            <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.14em] text-fg-dim">
              Browse:{" "}
              {years.map((y, i) => (
                <span key={y}>
                  {i > 0 && " · "}
                  <Link href={`/festivals/calendar/${y}`} className="text-accent hover:text-accent-soft">
                    {y} calendar
                  </Link>
                </span>
              ))}
              {years.length > 0 && hubs.length > 0 && " · "}
              {hubs.map((h, i) => (
                <span key={h.slug}>
                  {i > 0 && " · "}
                  <Link href={`/festivals/country/${h.slug}`} className="text-accent hover:text-accent-soft">
                    {h.country}
                  </Link>
                </span>
              ))}
            </p>
          )}
          {checked && (
            <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.14em] text-fg-dim/70">
              Dates and links checked against each festival&apos;s own pages, oldest check {formatDate(checked)}
            </p>
          )}

          {upcoming.length === 0 && past.length === 0 ? (
            <p className="mt-10 text-sm text-fg-dim">
              Nothing listed yet — check back soon.
            </p>
          ) : (
            <FestivalsList upcoming={upcoming} past={past} />
          )}
        </div>
      </main>
      <AboutFooter />
    </>
  );
}
