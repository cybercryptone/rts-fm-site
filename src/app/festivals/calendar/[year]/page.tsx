import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Nav from "@/components/Nav";
import AboutFooter from "@/components/AboutFooter";
import FestivalCalendar from "@/components/FestivalCalendar";
import {
  getCalendarYears,
  getCountryHubs,
  getFestivalsForYear,
  festivalDateLabel,
  type Festival,
} from "@/lib/festivals";
import { breadcrumbJsonLd, eventJsonLd, faqJsonLd } from "@/lib/schema";

export const dynamicParams = false;

export function generateStaticParams() {
  return getCalendarYears().map((year) => ({ year: String(year) }));
}

function summary(year: number) {
  const festivals = getFestivalsForYear(year);
  const confirmed = festivals.filter((f) => f.dateStatus === "confirmed");
  const countries = [...new Set(festivals.map((f) => f.country))];
  return { festivals, confirmed, countries };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ year: string }>;
}): Promise<Metadata> {
  const { year } = await params;
  if (!getCalendarYears().includes(Number(year))) return {};
  const { festivals, confirmed } = summary(Number(year));
  const title = `Techno & House Festivals ${year}: Dates, Cities, Tickets`;
  const description = `A month-by-month calendar of ${festivals.length} underground techno and house festivals in ${year}, ${confirmed.length} with confirmed dates, with cities and official ticket links.`;
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: `/festivals/calendar/${year}` },
    openGraph: { type: "website", url: `/festivals/calendar/${year}`, title, description },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function FestivalCalendarPage({
  params,
}: {
  params: Promise<{ year: string }>;
}) {
  const { year: yearParam } = await params;
  const year = Number(yearParam);
  if (!getCalendarYears().includes(year)) notFound();

  const { festivals, confirmed, countries } = summary(year);
  const first = confirmed[0];
  const last = confirmed[confirmed.length - 1];
  const hubs = getCountryHubs().filter((h) => festivals.some((f) => f.country === h.country));

  const faq: { question: string; answer: string }[] = [];
  if (first) {
    faq.push({
      question: `Which underground techno and house festival opens ${year}?`,
      answer: `Among the festivals with confirmed dates, ${first.name} in ${first.city}, ${first.country} comes first, on ${festivalDateLabel(first)}.`,
    });
  }
  if (last && last !== first) {
    faq.push({
      question: `Which festival closes the ${year} calendar?`,
      answer: `Of the festivals with confirmed dates, ${last.name} in ${last.city}, ${last.country} is the last, on ${festivalDateLabel(last)}.`,
    });
  }
  faq.push({
    question: `How many techno and house festivals does RTS.FM list for ${year}?`,
    answer: `RTS.FM lists ${festivals.length} festivals for ${year}, ${confirmed.length} of them with confirmed dates, across ${countries.length} ${countries.length === 1 ? "country" : "countries"}: ${countries.join(", ")}. The list is hand-picked rather than complete.`,
  });
  faq.push({
    question: `Are the ${year} festival dates confirmed?`,
    answer: `Only entries labelled with a plain date range are confirmed by the festival. Entries marked "est., unconfirmed" are based on the last known pattern and can change once the organiser announces.`,
  });

  const breadcrumb = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Festivals", path: "/festivals" },
    { name: `${year}`, path: `/festivals/calendar/${year}` },
  ]);
  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: confirmed
      .filter((f): f is Festival & { startDate: string; endDate: string } => !!f.startDate && !!f.endDate)
      .map((f, i) => ({ "@type": "ListItem", position: i + 1, item: eventJsonLd(f) })),
  };

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
            Underground techno &amp; house festivals {year}
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-fg-dim sm:text-base">
            {festivals.length} hand-picked festivals in {year}, {confirmed.length} with dates confirmed by
            the organisers, listed month by month
            {first && last && first !== last
              ? `, from ${first.name} on ${festivalDateLabel(first)} to ${last.name} on ${festivalDateLabel(last)}`
              : ""}
            . Every ticket link goes to the festival&apos;s own vendor; RTS.FM never sells tickets.
          </p>

          <FestivalCalendar festivals={festivals} byMonth />

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

          {hubs.length > 0 && (
            <p className="mt-12 font-mono text-[11px] uppercase tracking-[0.14em] text-fg-dim">
              By country:{" "}
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
          <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.14em] text-fg-dim">
            Details checked against each festival&apos;s own pages; see every entry for its last-checked date.
          </p>
        </div>
      </main>
      <AboutFooter />
    </>
  );
}
