import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import AboutFooter from "@/components/AboutFooter";
import { TOPICS, getTopicPosts } from "@/lib/topics";
import { breadcrumbJsonLd } from "@/lib/schema";
import { SITE } from "@/lib/data";

const title = "Topics: Techno, House and Club Culture Reporting";
const description =
  "RTS.FM's editorial topic hubs: club closures, Berlin and Berghain, festivals, labels and vinyl, AI in music, DJ business, city guides and more.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: "/topics" },
  openGraph: { type: "website", url: "/topics", title, description, images: [{ url: "/og-image.jpg", width: 1200, height: 630 }] },
  twitter: { card: "summary_large_image", title, description, images: ["/og-image.jpg"] },
};

export default function TopicsIndex() {
  const breadcrumb = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Topics", path: "/topics" },
  ]);
  const itemList = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: title,
    url: `${SITE.url}/topics`,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: TOPICS.map((t, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `${SITE.url}/topics/${t.slug}`,
        name: t.name,
      })),
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }} />
      <Nav />
      <main className="flex-1 px-6 pb-24 pt-32 sm:px-10 sm:pb-32 sm:pt-40">
        <div className="mx-auto max-w-[900px]">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-fg-dim">editorial hubs</p>
          <h1 className="mt-3 font-display text-3xl font-bold uppercase tracking-[-0.02em] text-fg sm:text-4xl">
            Topics
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-fg-dim sm:text-base">
            Every RTS.FM article belongs to a topic. Each hub starts with the best entry point and lists the
            rest of the coverage in reading order.
          </p>
          <ul className="mt-10 flex flex-col divide-y divide-line border-y border-line">
            {TOPICS.map((t) => {
              const { posts } = getTopicPosts(t);
              return (
                <li key={t.slug}>
                  <Link
                    href={`/topics/${t.slug}`}
                    className="group flex items-start justify-between gap-6 py-6"
                  >
                    <div className="min-w-0">
                      <p className="font-display text-xl font-bold uppercase tracking-[-0.01em] text-fg transition-colors group-hover:text-accent">
                        {t.name}
                      </p>
                      <p className="mt-2 text-sm leading-relaxed text-fg-dim">{t.description}</p>
                    </div>
                    <span className="shrink-0 pt-1 font-mono text-[11px] uppercase tracking-[0.14em] text-fg-dim">
                      {posts.length + 1} articles <span className="text-accent">→</span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </main>
      <AboutFooter />
    </>
  );
}
