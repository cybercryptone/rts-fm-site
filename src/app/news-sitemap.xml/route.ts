import { SITE } from "@/lib/data";
import { getAllPosts } from "@/lib/blog";

export const revalidate = 3600; // 1 hour

// Google News sitemaps must only list articles published in the last two
// days; older URLs are expected to drop off automatically rather than
// accumulate. This is a separate feed from the main sitemap.xml precisely
// because most posts are evergreen and shouldn't carry news: tags at all.
const NEWS_WINDOW_MS = 2 * 24 * 60 * 60 * 1000;

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const cutoff = Date.now() - NEWS_WINDOW_MS;
  const recentPosts = getAllPosts().filter(
    (post) => new Date(post.date).getTime() >= cutoff,
  );

  const urls = recentPosts
    .map(
      (post) => `<url>
<loc>${SITE.url}/blog/${post.slug}</loc>
<news:news>
<news:publication>
<news:name>${escapeXml(SITE.name)}</news:name>
<news:language>en</news:language>
</news:publication>
<news:publication_date>${post.date}</news:publication_date>
<news:title>${escapeXml(post.title)}</news:title>
</news:news>
</url>`,
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${urls}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=0, s-maxage=3600",
    },
  });
}
