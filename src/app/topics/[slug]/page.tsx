import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Nav from "@/components/Nav";
import AboutFooter from "@/components/AboutFooter";
import { TOPICS, getTopic, getTopicPosts } from "@/lib/topics";
import { formatDateCompact } from "@/lib/format";
import { breadcrumbJsonLd } from "@/lib/schema";
import { SITE } from "@/lib/data";
import type { PostMeta } from "@/lib/blog";

export const dynamicParams = false;

export function generateStaticParams() {
  return TOPICS.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const topic = getTopic(slug);
  if (!topic) return {};
  return {
    title: { absolute: topic.title },
    description: topic.description,
    alternates: { canonical: `/topics/${topic.slug}` },
    openGraph: {
      type: "website",
      url: `/topics/${topic.slug}`,
      title: topic.title,
      description: topic.description,
      images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: topic.title,
      description: topic.description,
      images: ["/og-image.jpg"],
    },
  };
}

function PostRow({ post, lead = false }: { post: PostMeta; lead?: boolean }) {
  return (
    <li>
      <Link href={`/blog/${post.slug}`} className="group flex flex-col gap-2 py-5">
        <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-accent">
          {lead ? "start here // " : ""}
          {formatDateCompact(post.updated ?? post.date)}
        </span>
        <span className="font-display text-xl font-bold uppercase leading-tight tracking-[-0.01em] text-fg transition-colors group-hover:text-accent">
          {post.title}
        </span>
        <span className="text-sm leading-relaxed text-fg-dim">{post.excerpt}</span>
      </Link>
    </li>
  );
}

export default async function TopicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const topic = getTopic(slug);
  if (!topic) notFound();

  const { pillar, posts, also } = getTopicPosts(topic);
  const all = [...(pillar ? [pillar] : []), ...posts];
  const breadcrumb = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Topics", path: "/topics" },
    { name: topic.name, path: `/topics/${topic.slug}` },
  ]);
  const collection = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: topic.title,
    description: topic.description,
    url: `${SITE.url}/topics/${topic.slug}`,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: all.map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `${SITE.url}/blog/${p.slug}`,
        name: p.title,
      })),
    },
  };
  const others = TOPICS.filter((t) => t.slug !== topic.slug);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collection) }} />
      <Nav />
      <main className="flex-1 px-6 pb-24 pt-32 sm:px-10 sm:pb-32 sm:pt-40">
        <div className="mx-auto max-w-[900px]">
          <Link
            href="/topics"
            className="font-mono text-[11px] uppercase tracking-[0.18em] text-fg-dim transition-colors hover:text-accent"
          >
            ← topics
          </Link>
          <h1 className="mt-8 font-display text-3xl font-bold uppercase tracking-[-0.02em] text-fg sm:text-4xl">
            {topic.name}
          </h1>
          <div className="mt-4 flex max-w-2xl flex-col gap-3 text-sm leading-relaxed text-fg-dim sm:text-base">
            {topic.intro.map((p) => (
              <p key={p.slice(0, 40)}>{p}</p>
            ))}
          </div>

          <ul className="mt-10 flex flex-col divide-y divide-line border-y border-line">
            {pillar && <PostRow post={pillar} lead />}
            {posts.map((p) => (
              <PostRow key={p.slug} post={p} />
            ))}
          </ul>

          {also.length > 0 && (
            <section className="mt-12">
              <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-fg-dim">Related from other topics</h2>
              <ul className="mt-2 flex flex-col divide-y divide-line border-y border-line">
                {also.map((p) => (
                  <PostRow key={p.slug} post={p} />
                ))}
              </ul>
            </section>
          )}

          {topic.links && topic.links.length > 0 && (
            <section className="mt-12">
              <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-fg-dim">Also on RTS.FM</h2>
              <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold">
                {topic.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-fg transition-colors hover:text-accent">
                      {l.label} <span className="text-accent">→</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <nav aria-label="Other topics" className="mt-14 border-t border-line pt-8">
            <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-fg-dim">Other topics</h2>
            <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold">
              {others.map((t) => (
                <li key={t.slug}>
                  <Link href={`/topics/${t.slug}`} className="text-fg transition-colors hover:text-accent">
                    {t.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </main>
      <AboutFooter />
    </>
  );
}
