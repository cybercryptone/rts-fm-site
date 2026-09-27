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
