import type { Metadata } from "next";
import Nav from "@/components/Nav";
import AboutFooter from "@/components/AboutFooter";
import { getUpcomingFestivals, getPastFestivals, type Festival } from "@/lib/festivals";
import { breadcrumbJsonLd, eventJsonLd } from "@/lib/schema";
import { formatDateRange } from "@/lib/format";

const description =
  "A curated list of the world's major underground house and techno festivals, with dates, cities, and official ticket links.";

export const metadata: Metadata = {
  title: "Festivals",
  description,
  alternates: { canonical: "/festivals" },
  openGraph: { type: "website", url: "/festivals", title: "Festivals — RTS.FM", description },
  twitter: { card: "summary_large_image", title: "Festivals — RTS.FM", description },
};

function dateLabel(festival: Festival): string {
  if (festival.dateStatus === "tba" || !festival.startDate || !festival.endDate) {
    return "Dates TBA";
  }
  const range = formatDateRange(festival.startDate, festival.endDate);
  return festival.dateStatus === "estimated" ? `${range} (est., unconfirmed)` : range;
}

function FestivalRow({ festival }: { festival: Festival }) {
  return (
    <li className="blog-row">
      <div className="flex flex-col gap-4 py-8 pr-4 sm:flex-row sm:items-start sm:gap-6 sm:pr-10">
        <div className="min-w-0 flex-1">
          <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-accent">
            {festival.city.toUpperCase()}, {festival.country.toUpperCase()} · {dateLabel(festival)}
          </div>
          <a
            href={festival.website}
            target="_blank"
            rel="noopener noreferrer"
            className="blog-row-title mt-2 block max-w-[620px] font-display text-lg font-bold uppercase leading-tight tracking-[-0.03em] text-fg transition-colors hover:text-accent sm:text-xl"
          >
            {festival.name}
          </a>
          <p className="mt-2 max-w-[620px] text-sm leading-relaxed text-fg-dim">
            {festival.description}
          </p>
          {festival.genres.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {festival.genres.map((g) => (
                <span
                  key={g}
                  className="rounded-full border border-line px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-fg-dim"
                >
                  {g}
                </span>
              ))}
            </div>
          )}
        </div>
        {festival.ticketUrl && (
          <a
            href={festival.ticketUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 self-start rounded-full border border-accent/60 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.14em] text-accent transition-colors hover:bg-accent hover:text-bg"
          >
            Tickets →
          </a>
        )}
      </div>
    </li>
  );
}

export default function FestivalsIndex() {
  const upcoming = getUpcomingFestivals();
  const past = getPastFestivals();
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

          {upcoming.length === 0 && past.length === 0 ? (
            <p className="mt-10 text-sm text-fg-dim">
              Nothing listed yet — check back soon.
            </p>
          ) : (
            <>
              {upcoming.length > 0 && (
                <ul className="blog-divider mt-10 flex flex-col divide-y border-y">
                  {upcoming.map((festival) => (
                    <FestivalRow key={festival.slug} festival={festival} />
                  ))}
                </ul>
              )}

              {past.length > 0 && (
                <details className="mt-12">
                  <summary className="cursor-pointer font-mono text-xs font-bold uppercase tracking-[0.14em] text-fg-dim">
                    Past festivals ({past.length})
                  </summary>
                  <ul className="blog-divider mt-4 flex flex-col divide-y border-y">
                    {past.map((festival) => (
                      <FestivalRow key={festival.slug} festival={festival} />
                    ))}
                  </ul>
                </details>
              )}
            </>
          )}
        </div>
      </main>
      <AboutFooter />
    </>
  );
}
