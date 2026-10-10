import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Nav from "@/components/Nav";
import AboutFooter from "@/components/AboutFooter";
import FestivalCalendar from "@/components/FestivalCalendar";
import {
  getCalendarYears,
  getCountryHub,
  getCountryHubs,
  festivalDateLabel,
  isUpcoming,
  type Festival,
} from "@/lib/festivals";
import { breadcrumbJsonLd, eventJsonLd, faqJsonLd } from "@/lib/schema";

export const dynamicParams = false;

export function generateStaticParams() {
  return getCountryHubs().map((h) => ({ country: h.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ country: string }>;
}): Promise<Metadata> {
  const { country } = await params;
  const hub = getCountryHub(country);
  if (!hub) return {};
  const title = `${hub.country} Techno & House Festivals: Dates and Tickets`;
  const description = `${hub.festivals.length} underground techno and house festivals in ${hub.country}, with dates, cities and official ticket links.`;
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: `/festivals/country/${hub.slug}` },
    openGraph: { type: "website", url: `/festivals/country/${hub.slug}`, title, description },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function CountryFestivalsPage({
  params,
}: {
  params: Promise<{ country: string }>;
}) {
  const { country } = await params;
  const hub = getCountryHub(country);
  if (!hub) notFound();

  const upcoming = hub.festivals.filter(isUpcoming);
  const past = hub.festivals.filter((f) => !isUpcoming(f));
  const nextDated = upcoming.find((f) => f.dateStatus === "confirmed");
  const cities = [...new Set(hub.festivals.map((f) => f.city))];
  const years = getCalendarYears().filter((y) => hub.festivals.some((f) => f.startDate?.startsWith(String(y))));

  const faq: { question: string; answer: string }[] = [
    {
      question: `Which underground techno and house festivals does RTS.FM list in ${hub.country}?`,
      answer: `${hub.festivals.map((f) => f.name).join(", ")}. The list is hand-picked rather than complete.`,
    },
    {
      question: `Which cities in ${hub.country} host these festivals?`,
      answer: `${cities.join(", ")}.`,
    },
  ];
  if (nextDated) {
    faq.push({
      question: `What is the next festival in ${hub.country}?`,
      answer: `Of the festivals with confirmed dates, ${nextDated.name} in ${nextDated.city} is next, on ${festivalDateLabel(nextDated)}.`,
    });
  }

  const breadcrumb = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Festivals", path: "/festivals" },
    { name: hub.country, path: `/festivals/country/${hub.slug}` },
  ]);
  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: upcoming
      .filter((f): f is Festival & { startDate: string; endDate: string } =>
        f.dateStatus === "confirmed" && !!f.startDate && !!f.endDate,
      )
      .map((f, i) => ({ "@type": "ListItem", position: i + 1, item: eventJsonLd(f) })),
  };
  const otherHubs = getCountryHubs().filter((h) => h.slug !== hub.slug);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      {itemList.itemListElement.length > 0 && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }} />
      )}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(faq)) }} />
      <Nav />
      <main className="flex-1 px-6 pb-24 pt-32 sm:px-10 sm:pb-32 sm:pt-40">
        <div className="mx-auto max-w-[900px]">
          <Link
            href="/festivals"
            className="font-mono text-[11px] uppercase tracking-[0.18em] text-fg-dim transition-colors hover:text-accent"
          >
            ← festivals
          </Link>
          <h1 className="mt-8 font-display text-3xl font-bold uppercase tracking-[-0.02em] text-fg sm:text-4xl">
            Underground techno &amp; house festivals in {hub.country}
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-fg-dim sm:text-base">
            {hub.festivals.length} hand-picked festivals across {cities.length}{" "}
            {cities.length === 1 ? "city" : "cities"} ({cities.join(", ")}). Every ticket link goes to
            the festival&apos;s own vendor; RTS.FM never sells tickets.
          </p>

          {upcoming.length > 0 && (
            <>
              <h2 className="mt-10 font-mono text-xs uppercase tracking-[0.2em] text-fg-dim">Upcoming</h2>
              <FestivalCalendar festivals={upcoming} />
            </>
          )}
          {past.length > 0 && (
            <>
              <h2 className="mt-10 font-mono text-xs uppercase tracking-[0.2em] text-fg-dim">Recently held</h2>
              <FestivalCalendar festivals={past} />
            </>
          )}

          <section className="mt-14 border-t border-line pt-8">
            <h2 className="font-display text-xl font-bold uppercase tracking-[-0.01em] text-fg">FAQ</h2>
            <dl className="mt-5 flex flex-col gap-6">
              {faq.map((item) => (
                <div key={item.question}>
                  <dt className="font-semibold text-fg">{item.question}</dt>
                  <dd className="mt-2 text-sm leading-relaxed text-fg-dim sm:text-base">{item.answer}</dd>
                </div>
              ))}
            </dl>
          </section>

          <p className="mt-12 font-mono text-[11px] uppercase tracking-[0.14em] text-fg-dim">
            {years.length > 0 && (
              <>
                Calendar:{" "}
                {years.map((y, i) => (
                  <span key={y}>
                    {i > 0 && " · "}
                    <Link href={`/festivals/calendar/${y}`} className="text-accent hover:text-accent-soft">
                      {y}
                    </Link>
                  </span>
                ))}
                {otherHubs.length > 0 && " | "}
              </>
            )}
            {otherHubs.length > 0 && (
              <>
                Other countries:{" "}
                {otherHubs.map((h, i) => (
                  <span key={h.slug}>
                    {i > 0 && " · "}
                    <Link href={`/festivals/country/${h.slug}`} className="text-accent hover:text-accent-soft">
                      {h.country}
                    </Link>
                  </span>
                ))}
              </>
            )}
          </p>
        </div>
      </main>
      <AboutFooter />
    </>
  );
}
