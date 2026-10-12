import type { MetadataRoute } from "next";
import { SITE } from "@/lib/data";

export default function robots(): MetadataRoute.Robots {
  return {
    // /_next/static/ is deliberately NOT disallowed: Google needs those JS/CSS
    // files to render pages, and they ship with immutable year-long caching so
    // they cost almost no crawl budget. Only player data endpoints and RSC
    // prefetch payloads (?_rsc=) are blocked; neither is indexable content.
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/*?_rsc="],
    },
    sitemap: [`${SITE.url}/sitemap.xml`, `${SITE.url}/news-sitemap.xml`],
  };
}
