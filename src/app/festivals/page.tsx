import type { Metadata } from "next";
import Nav from "@/components/Nav";
import AboutFooter from "@/components/AboutFooter";
import FestivalsList from "@/components/FestivalsList";
import { getUpcomingFestivals, getPastFestivals, type Festival } from "@/lib/festivals";
import { breadcrumbJsonLd, eventJsonLd } from "@/lib/schema";

const description =
  "A curated list of the world's major underground house and techno festivals, with dates, cities, and official ticket links.";

export const metadata: Metadata = {
  title: "Festivals",
  description,
  alternates: { canonical: "/festivals" },
  openGraph: { type: "website", url: "/festivals", title: "Festivals — RTS.FM", description },
  twitter: { card: "summary_large_image", title: "Festivals — RTS.FM", description },
};

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
            <FestivalsList upcoming={upcoming} past={past} />
          )}
        </div>
      </main>
      <AboutFooter />
    </>
  );
}
