import { SITE } from "./data";

// Shared BreadcrumbList builder — every page passes its own trail of
// {name, path} pairs; path is site-relative (e.g. "/blog/some-post").
export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE.url}${item.path}`,
    })),
  };
}

function markdownToPlainText(md: string): string {
  return md
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/<[^>]+>/g, "")
    .replace(/[*_`]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

// Pulls the "## FAQ" / "## Frequently Asked Questions" section out of a
// post's MDX and returns its "### question" + answer pairs as plain text,
// so the FAQPage markup mirrors exactly what is visible on the page.
export function extractFaqItems(content: string): { question: string; answer: string }[] {
  const start = content.match(/^## (?:FAQ|Frequently Asked Questions)\s*$/m);
  if (!start || start.index === undefined) return [];
  const rest = content.slice(start.index + start[0].length);
  const end = rest.match(/^## |^<[A-Z]/m);
  const section = end?.index === undefined ? rest : rest.slice(0, end.index);

  return section
    .split(/^### /m)
    .slice(1)
    .map((block) => {
      const [heading, ...body] = block.split("\n");
      return { question: markdownToPlainText(heading), answer: markdownToPlainText(body.join("\n")) };
    })
    .filter((item) => item.question && item.answer);
}

export function faqJsonLd(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

// Frontmatter dates are bare "YYYY-MM-DD". Google flags date-only values in
// Article markup as missing a timezone, so emit a full ISO 8601 datetime.
export function isoDateTime(date: string): string {
  return /^\d{4}-\d{2}-\d{2}$/.test(date) ? `${date}T00:00:00+00:00` : date;
}

// Pulls every <YouTubeEmbed videoId="..." title="..."> out of a post's MDX
// so the page can emit matching VideoObject markup for each one it has
// real metadata for (see lib/video-metadata.ts).
export function extractYouTubeEmbeds(content: string): { videoId: string; title: string }[] {
  const matches = content.matchAll(/<YouTubeEmbed\s+videoId="([^"]+)"\s+title="([^"]+)"/g);
  return Array.from(matches, (m) => ({ videoId: m[1], title: m[2] }));
}

export function videoObjectJsonLd(
  embed: { videoId: string; title: string },
  meta: import("./video-metadata").BlogVideoMeta,
) {
  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: embed.title,
    description: meta.description,
    thumbnailUrl: meta.thumbnailUrl,
    uploadDate: meta.uploadDate,
    duration: meta.duration,
    embedUrl: `https://www.youtube-nocookie.com/embed/${embed.videoId}`,
    contentUrl: `https://www.youtube.com/watch?v=${embed.videoId}`,
  };
}

// Event markup for a festival listing. Only emits fields the data actually
// has verified, no invented address, price or date. Google's Event rich
// result wants a real ticket/registration url inside offers and a real
// location, so callers should skip this entirely for festivals whose dates
// aren't confirmed rather than emit an incomplete Event.
//
// Deliberately still omits offers.price/priceCurrency/validFrom and
// top-level performer, both flagged as "non-critical" by GSC (they don't
// block the rich result). These festivals sell multi-tier tickets (single
// day / full pass / add-on side events, often on a third-party platform we
// don't control) with no one number that honestly represents "the" price,
// and it would be stale within weeks as early tiers sell out. RTS.FM
// doesn't maintain lineup data either (a narrow curated list, not an
// aggregator), so performer has nothing real to point to. Both are real
// gaps in what we know, not oversights to silently paper over with a
// cherry-picked or invented value.
export function eventJsonLd(festival: {
  name: string;
  city: string;
  country: string;
  startDate: string;
  endDate: string;
  website: string;
  ticketUrl?: string;
  ticketStatus?: "open" | "sold-out";
  description: string;
  image?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: festival.name,
    startDate: isoDateTime(festival.startDate),
    endDate: isoDateTime(festival.endDate),
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: {
      "@type": "Place",
      name: festival.city,
      address: {
        "@type": "PostalAddress",
        addressLocality: festival.city,
        addressCountry: festival.country,
      },
    },
    ...(festival.image ? { image: festival.image } : {}),
    description: festival.description,
    url: festival.website,
    // The organizing entity isn't separately tracked per festival (most
    // aren't run by a company distinct from the festival's own brand), so
    // this points at the festival's own name and official site, which is
    // always true rather than a guess.
    organizer: { "@type": "Organization", name: festival.name, url: festival.website },
    ...(festival.ticketUrl
      ? {
          offers: {
            "@type": "Offer",
            url: festival.ticketUrl,
            availability:
              festival.ticketStatus === "sold-out"
                ? "https://schema.org/SoldOut"
                : "https://schema.org/InStock",
          },
        }
      : {}),
  };
}
