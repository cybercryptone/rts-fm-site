import type { Metadata } from "next";
import { Children, isValidElement } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import Nav from "@/components/Nav";
import AboutFooter from "@/components/AboutFooter";
import FestivalFacts from "@/components/FestivalFacts";
import {
  FESTIVALS,
  daysSince,
  festivalDateLabel,
  festivalDurationDays,
  getCalendarYears,
  getCountryHub,
  getFestivalBySlug,
  slugifyCountry,
  type Festival,
} from "@/lib/festivals";
import { getAllArtists } from "@/lib/artists";
import { formatDate } from "@/lib/format";
import { getFestivalContent } from "@/lib/festival-content";
import { breadcrumbJsonLd, eventJsonLd, extractFaqItems, faqJsonLd } from "@/lib/schema";

export function generateStaticParams() {
  return FESTIVALS.map((festival) => ({ slug: festival.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const festival = getFestivalBySlug(slug);
  if (!festival) return {};
  const title = `${festival.name} — ${festival.city}`;
  return {
    title: { absolute: title },
    description: festival.description,
    alternates: { canonical: `/festivals/${slug}` },
    openGraph: {
      type: "website",
      url: `/festivals/${slug}`,
      title,
      description: festival.description,
      ...(festival.image ? { images: [festival.image] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: festival.description,
      ...(festival.image ? { images: [festival.image] } : {}),
    },
  };
}

// Same figure/figcaption-out-of-<p> hydration fix used on blog/artist pages
// — see src/app/blog/[slug]/page.tsx for the full rationale.
function MdxFigureImg({ alt, ...props }: React.ComponentProps<"img">) {
  return (
    /* eslint-disable-next-line @next/next/no-img-element -- external, CC-licensed editorial images; not worth Next/Image's remote-domain allowlisting for one-off credits */
    <img alt={alt} loading="lazy" className="w-full rounded-xl border border-line object-cover" {...props} />
  );
}

function MdxImage(props: React.ComponentProps<"img">) {
  return (
    <figure className="mt-7">
      <MdxFigureImg {...props} />
      {props.alt && (
        <figcaption className="mt-2 font-mono text-[11px] uppercase tracking-[0.1em] text-fg-dim">
          {props.alt}
        </figcaption>
      )}
    </figure>
  );
}

const mdxComponents = {
  h2: (props: React.ComponentProps<"h2">) => (
    <h2
      className="mt-10 font-display text-xl font-bold uppercase tracking-[-0.01em] text-fg first:mt-0"
      {...props}
    />
  ),
  h3: (props: React.ComponentProps<"h3">) => (
    <h3
      className="mt-8 font-display text-lg font-bold uppercase tracking-[-0.01em] text-fg"
      {...props}
    />
  ),
  p: (props: React.ComponentProps<"p">) => {
    const realChildren = Children.toArray(props.children).filter(
      (child) => !(typeof child === "string" && child.trim() === ""),
    );
    if (realChildren.length === 1 && isValidElement(realChildren[0]) && realChildren[0].type === MdxImage) {
      return realChildren[0];
    }
    if (
      realChildren.length === 2 &&
      isValidElement(realChildren[0]) &&
      realChildren[0].type === MdxImage &&
      isValidElement(realChildren[1]) &&
      realChildren[1].type === "em"
    ) {
      const imgEl = realChildren[0] as React.ReactElement<React.ComponentProps<"img">>;
      const emEl = realChildren[1] as React.ReactElement<{ children?: React.ReactNode }>;
      return (
        <figure className="mt-7">
          <MdxFigureImg {...imgEl.props} />
          <figcaption className="mt-2 font-mono text-[11px] uppercase tracking-[0.1em] text-fg-dim">
            {emEl.props.children}
          </figcaption>
        </figure>
      );
    }
    return <p className="mt-5 text-sm leading-relaxed text-fg-dim sm:text-base" {...props} />;
  },
  a: (props: React.ComponentProps<"a">) => (
    <a
      className="text-accent underline decoration-accent/40 underline-offset-4 transition-colors hover:text-accent-soft"
      {...props}
    />
  ),
  ul: (props: React.ComponentProps<"ul">) => (
    <ul className="mt-5 flex list-disc flex-col gap-2 pl-5 text-sm leading-relaxed text-fg-dim sm:text-base" {...props} />
  ),
  ol: (props: React.ComponentProps<"ol">) => (
    <ol className="mt-5 flex list-decimal flex-col gap-2 pl-5 text-sm leading-relaxed text-fg-dim sm:text-base" {...props} />
  ),
  blockquote: (props: React.ComponentProps<"blockquote">) => (
    <blockquote
      className="mt-5 border-l-2 border-accent/60 pl-4 text-sm italic leading-relaxed text-fg-dim sm:text-base"
      {...props}
    />
  ),
  img: MdxImage,
  FestivalFacts,
};

function TicketLink({ festival }: { festival: Festival }) {
  if (!festival.ticketUrl) {
    return (
      <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-fg-dim/60">
        Tickets TBA
      </span>
    );
  }
  if (festival.ticketStatus === "sold-out") {
    return (
      <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-fg-dim/60 line-through">
        Sold Out
      </span>
    );
  }
  return (
    <a
      href={festival.ticketUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent transition-colors hover:text-accent-soft"
    >
      Tickets ↗
    </a>
  );
}

export default async function FestivalPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const festival = getFestivalBySlug(slug);
  if (!festival) notFound();

  const content = getFestivalContent(slug);
  if (!content) notFound();

  const days = festivalDurationDays(festival);

  const breadcrumb = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Festivals", path: "/festivals" },
    { name: festival.name, path: `/festivals/${festival.slug}` },
  ]);

  // Matches the index page's own rule: only fully-dated, confirmed
  // festivals get an Event listing, never an incomplete one.
  const event =
    festival.dateStatus === "confirmed" && festival.startDate && festival.endDate
      ? eventJsonLd({
          name: festival.name,
          city: festival.city,
          country: festival.country,
          startDate: festival.startDate,
          endDate: festival.endDate,
          website: festival.website,
          ticketUrl: festival.ticketUrl,
          ticketStatus: festival.ticketStatus,
          ticketPrice: festival.ticketPrice,
          ticketPriceCurrency: festival.ticketPriceCurrency,
          venue: festival.venue,
          venueAddress: festival.venueAddress,
          description: festival.description,
          image: festival.image,
        })
      : null;

  const faqItems = extractFaqItems(content);

  const connectedArtists = getAllArtists().filter((a) => festival.artists?.includes(a.slug));
  const startYear = festival.startDate ? Number(festival.startDate.slice(0, 4)) : null;
  const calendarYear = startYear && getCalendarYears().includes(startYear) ? startYear : null;
  const countryHub = getCountryHub(slugifyCountry(festival.country));
  const verifiedAge = festival.lastVerified ? daysSince(festival.lastVerified) : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      {event && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(event) }}
        />
      )}
      {faqItems.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(faqItems)) }}
        />
      )}
      <Nav />
      <main className="flex-1 px-6 pb-24 pt-32 sm:px-10 sm:pb-32 sm:pt-40">
        <article className="mx-auto max-w-[760px]">
          <Link
            href="/festivals"
            className="font-mono text-[11px] uppercase tracking-[0.18em] text-fg-dim transition-colors hover:text-accent"
          >
            ← festivals
          </Link>

          <p className="mt-8 font-mono text-[11px] uppercase tracking-[0.18em] text-fg-dim">
            {festival.city}, {festival.country} · {festivalDateLabel(festival)}
          </p>
          <h1 className="mt-3 font-display text-3xl font-bold uppercase tracking-[-0.02em] text-fg sm:text-4xl">
            {festival.name}
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-fg-dim sm:text-base">
            {festival.description}
          </p>

          {festival.genres.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
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

          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3">
            {days && (
              <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-fg-dim">
                {days} DAY{days > 1 ? "S" : ""}
              </span>
            )}
            <TicketLink festival={festival} />
            <a
              href={festival.website}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[11px] uppercase tracking-[0.14em] text-fg-dim transition-colors hover:text-accent"
            >
              Official site ↗
            </a>
          </div>

          {(festival.venue || festival.lastVerified) && (
            <div className="mt-4 flex flex-col gap-1 font-mono text-[11px] uppercase tracking-[0.12em] text-fg-dim">
              {festival.venue && (
                <span>
                  Venue: {festival.venue}
                  {festival.venueAddress ? `, ${festival.venueAddress}` : ""}
                </span>
              )}
              {festival.lastVerified && (
                <span>
                  Details last checked {formatDate(festival.lastVerified)}
                  {verifiedAge !== null && verifiedAge > 90
                    ? ", may be out of date: confirm on the official site"
                    : ""}
                </span>
              )}
            </div>
          )}

          {festival.image && (
            <figure className="mt-7">
              {/* eslint-disable-next-line @next/next/no-img-element -- external, CC-licensed editorial image; not worth Next/Image's remote-domain allowlisting for one-off credits */}
              <img
                src={festival.image}
                alt={festival.imageAlt ?? festival.name}
                loading="lazy"
                className="w-full rounded-xl border border-line object-cover"
              />
              {festival.imageCredit && (
                <figcaption className="mt-2 font-mono text-[11px] uppercase tracking-[0.1em] text-fg-dim">
                  {festival.imageCredit}
                </figcaption>
              )}
            </figure>
          )}

          <div className="mt-6 border-t border-line pt-6">
            <MDXRemote source={content} components={mdxComponents} />
          </div>

          {connectedArtists.length > 0 && (
            <div className="mt-12 border-t border-line pt-8">
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-fg-dim">
                RTS.FM artists connected to this festival
              </p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {connectedArtists.map((a) => (
                  <li key={a.slug}>
                    <Link
                      href={`/artists/${a.slug}`}
                      className="inline-block rounded-full border border-line px-4 py-2 font-mono text-[11px] uppercase tracking-[0.14em] text-fg transition-colors hover:border-accent hover:text-accent"
                    >
                      {a.name}
                    </Link>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-xs text-fg-dim">
                Only sourced appearances at past editions or on announced lineups are listed.
              </p>
            </div>
          )}

          {(calendarYear || countryHub) && (
            <p className="mt-10 font-mono text-[11px] uppercase tracking-[0.14em] text-fg-dim">
              More:{" "}
              {calendarYear && (
                <Link href={`/festivals/calendar/${calendarYear}`} className="text-accent hover:text-accent-soft">
                  {calendarYear} festival calendar
                </Link>
              )}
              {calendarYear && countryHub && " · "}
              {countryHub && (
                <Link href={`/festivals/country/${countryHub.slug}`} className="text-accent hover:text-accent-soft">
                  Festivals in {festival.country}
                </Link>
              )}
            </p>
          )}
        </article>
      </main>
      <AboutFooter />
    </>
  );
}
