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
