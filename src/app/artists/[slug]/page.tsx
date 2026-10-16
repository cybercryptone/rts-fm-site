import { metaDescription } from "@/lib/format";
import { relatedForArtist } from "@/lib/related";
import RelatedLinks from "@/components/RelatedLinks";
import { getImageDims } from "@/lib/image-dims";
import type { Metadata } from "next";
import { Children, isValidElement } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import Nav from "@/components/Nav";
import AboutFooter from "@/components/AboutFooter";
import YouTubeEmbed from "@/components/YouTubeEmbed";
import { getAllArtists, getArtistBySlug, type ArtistMeta } from "@/lib/artists";
import { getAllPosts } from "@/lib/blog";
import { SITE } from "@/lib/data";
import { festivalDateLabel, festivalsForArtist } from "@/lib/festivals";
import {
  breadcrumbJsonLd,
  extractFaqItems,
  extractYouTubeEmbeds,
  faqJsonLd,
  videoObjectJsonLd,
} from "@/lib/schema";
import { ARTIST_VIDEO_META } from "@/lib/artist-video-metadata";

export function generateStaticParams() {
  return getAllArtists().map((artist) => ({ slug: artist.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const artist = getArtistBySlug(slug);
  if (!artist) return {};
  return {
    title: { absolute: artist.title },
    description: metaDescription(artist.excerpt),
    alternates: { canonical: `/artists/${slug}` },
    openGraph: {
      type: "profile",
      url: `/artists/${slug}`,
      title: artist.title,
      description: metaDescription(artist.excerpt),
      images: [artist.image],
    },
    twitter: {
      card: "summary_large_image",
      title: artist.title,
      description: metaDescription(artist.excerpt),
    },
  };
}

// Same figure/figcaption-out-of-<p> hydration fix used on blog posts — see
// src/app/blog/[slug]/page.tsx for the full rationale.
function MdxFigureImg({ alt, ...props }: React.ComponentProps<"img">) {
  const dims = getImageDims(typeof props.src === "string" ? props.src : undefined);
  return (
    /* eslint-disable-next-line @next/next/no-img-element -- external, CC-licensed editorial images; not worth Next/Image's remote-domain allowlisting for one-off credits */
    <img
      alt={alt}
      loading="lazy"
      decoding="async"
      width={dims?.width}
      height={dims?.height}
      className="h-auto w-full rounded-xl border border-line object-cover"
      {...props}
    />
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
  YouTubeEmbed,
};

// The frontmatter image is rendered right under the H1, so any body copy of
// the same image (markdown image plus its italic credit line) is dropped to
// avoid showing it twice.
function stripHeroImage(content: string, image: string): string {
  const escaped = image.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return content.replace(
    new RegExp(`!\\[[^\\]]*\\]\\(${escaped}\\)[ \\t]*(?:\\r?\\n\\*[^\\n]*\\*[ \\t]*)?(?:\\r?\\n)*`, "g"),
    "",
  );
}

// Person properties from the verified quick facts. The profile stays a
// MusicGroup (see below) but is also typed Person when personal facts exist,
// so schema.org consumers can read birth and name details.
function factsJsonLd(facts: ArtistMeta["facts"]) {
  if (!facts) return {};
  const names = [facts.realName, ...(facts.aliases ?? [])].filter(Boolean) as string[];
  const hasPerson = facts.realName || facts.born || facts.birthplace || facts.nationality;
  return {
    ...(hasPerson ? { "@type": ["MusicGroup", "Person"] } : {}),
    ...(names.length ? { alternateName: names } : {}),
    ...(facts.born && /^\d{4}$/.test(facts.born) ? { birthDate: facts.born } : {}),
    ...(facts.born && !/^\d{4}$/.test(facts.born) && !Number.isNaN(Date.parse(`${facts.born} UTC`))
      ? { birthDate: new Date(`${facts.born} UTC`).toISOString().slice(0, 10) }
      : {}),
    ...(facts.birthplace ? { birthPlace: { "@type": "Place", name: facts.birthplace } } : {}),
    ...(facts.nationality ? { nationality: facts.nationality } : {}),
    ...(facts.labels?.length ? { affiliation: facts.labels.map((l) => ({ "@type": "Organization", name: l })) } : {}),
  };
}

const FACT_ROWS: { key: keyof NonNullable<ArtistMeta["facts"]>; label: string }[] = [
  { key: "realName", label: "Real name" },
  { key: "aliases", label: "Also known as" },
  { key: "born", label: "Born" },
  { key: "birthplace", label: "Birthplace" },
  { key: "nationality", label: "Nationality" },
  { key: "basedIn", label: "Based in" },
  { key: "activeSince", label: "Active since" },
  { key: "labels", label: "Labels" },
];

export default async function ArtistPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const artist = getArtistBySlug(slug);
  if (!artist) notFound();

  const relatedPosts = getAllPosts().filter((p) => artist.relatedPosts.includes(p.slug));
  const festivals = festivalsForArtist(artist.slug);

  // MusicGroup (not Person) per schema.org's own guidance: it covers solo
  // acts as well as bands and, unlike Person, carries genre/sameAs in a way
  // search engines expect for musicians.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    // Real dates for when this profile page itself was written (from git
    // history, see lib/artists.ts), not the artist's own career dates.
    ...(artist.dateCreated ? { dateCreated: artist.dateCreated } : {}),
    ...(artist.dateModified ? { dateModified: artist.dateModified } : {}),
    mainEntity: {
      "@type": "MusicGroup",
      name: artist.name,
      description: artist.excerpt,
      image: artist.image,
      url: `${SITE.url}/artists/${artist.slug}`,
      genre: artist.genres,
      sameAs: artist.sameAs,
      ...factsJsonLd(artist.facts),
    },
  };

  const breadcrumb = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Artists", path: "/artists" },
    { name: artist.name, path: `/artists/${artist.slug}` },
  ]);

  const faqItems = extractFaqItems(artist.content);

  const videoJsonLds = extractYouTubeEmbeds(artist.content)
    .filter((embed) => ARTIST_VIDEO_META[embed.videoId])
    .map((embed) => videoObjectJsonLd(embed, ARTIST_VIDEO_META[embed.videoId]));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {faqItems.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(faqItems)) }}
        />
      )}
      {videoJsonLds.map((video) => (
        <script
          key={video.embedUrl}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(video) }}
        />
      ))}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <Nav />
      <main className="flex-1 px-6 pb-24 pt-32 sm:px-10 sm:pb-32 sm:pt-40">
        <article className="mx-auto max-w-[760px]">
          <Link
            href="/artists"
            className="font-mono text-[11px] uppercase tracking-[0.18em] text-fg-dim transition-colors hover:text-accent"
          >
            ← artists
          </Link>

          <p className="mt-8 font-mono text-[11px] uppercase tracking-[0.18em] text-fg-dim">
            {artist.jobTitle} · {artist.location}
          </p>
          <h1 className="mt-3 font-display text-3xl font-bold uppercase tracking-[-0.02em] text-fg sm:text-4xl">
            {artist.name}
          </h1>
          {artist.image && (
            <figure className="mt-6">
              {/* eslint-disable-next-line @next/next/no-img-element -- self-hosted editorial image; not worth Next/Image for one-off credits */}
              <img
                src={artist.image}
                alt={artist.imageAlt}
                width={getImageDims(artist.image)?.width}
                height={getImageDims(artist.image)?.height}
                loading="eager"
                fetchPriority="high"
                className="max-h-[34rem] w-full rounded-xl border border-line object-cover object-top"
              />
              {artist.imageCredit && (
                <figcaption className="mt-2 font-mono text-[11px] uppercase tracking-[0.1em] text-fg-dim">
                  {artist.imageCredit}
                </figcaption>
              )}
            </figure>
          )}
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-fg-dim sm:text-base">
            {artist.excerpt}
          </p>

          {artist.facts && (
            <section
              aria-label={`${artist.name} quick facts`}
              className="mt-6 rounded-xl border border-line p-5 sm:p-6"
            >
              <h2 className="font-mono text-[11px] uppercase tracking-[0.18em] text-fg-dim">
                quick facts
              </h2>
              <dl className="mt-4 grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
                {FACT_ROWS.map(({ key, label }) => {
                  const raw = artist.facts?.[key];
                  const value = Array.isArray(raw) ? raw.join(", ") : raw;
                  if (!value) return null;
                  return (
                    <div key={key} className="flex flex-col">
                      <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-fg-dim">
                        {label}
                      </dt>
                      <dd className="mt-0.5 text-sm font-semibold text-fg">{value}</dd>
                    </div>
                  );
                })}
                {artist.genres.length > 0 && (
                  <div className="flex flex-col">
                    <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-fg-dim">
                      Genres
                    </dt>
                    <dd className="mt-0.5 text-sm font-semibold text-fg">
                      {artist.genres.join(", ")}
                    </dd>
                  </div>
                )}
              </dl>
              {artist.factsSources.length > 0 && (
                <p className="mt-4 text-[11px] leading-relaxed text-fg-dim">
                  Sources:{" "}
                  {artist.factsSources.map((href, i) => {
                    let label: string;
                    try {
                      label = new URL(href).hostname.replace(/^www\./, "");
                    } catch {
                      label = href;
                    }
                    return (
                      <span key={href}>
                        {i > 0 && ", "}
                        <a
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline decoration-line underline-offset-2 hover:text-accent"
                        >
                          {label}
                        </a>
                      </span>
                    );
                  })}
                </p>
              )}
            </section>
          )}

          {artist.genres.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {artist.genres.map((g) => (
                <span
                  key={g}
                  className="rounded-full border border-line px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-fg-dim"
                >
                  {g}
                </span>
              ))}
            </div>
          )}

          {artist.sameAs.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-3">
              {artist.sameAs.map((href) => {
                let label: string;
                try {
                  label = new URL(href).hostname.replace(/^www\./, "");
                } catch {
                  label = href;
                }
                return (
                  <a
                    key={href}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-[11px] uppercase tracking-[0.14em] text-fg-dim transition-colors hover:text-accent"
                  >
                    {label} ↗
                  </a>
                );
              })}
            </div>
          )}

          <div className="mt-6 border-t border-line pt-6">
            <MDXRemote source={stripHeroImage(artist.content, artist.image)} components={mdxComponents} />
          </div>

          {festivals.length > 0 && (
            <div className="mt-14 border-t border-line pt-8">
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-fg-dim">
                festivals
              </p>
              <ul className="mt-4 flex flex-col divide-y divide-line">
                {festivals.map((f) => (
                  <li key={f.slug}>
                    <Link
                      href={`/festivals/${f.slug}`}
                      className="flex items-center justify-between gap-4 py-3 text-sm font-semibold text-fg transition-colors hover:text-accent"
                    >
                      <span>
                        {f.name}
                        <span className="ml-2 font-mono text-[11px] font-normal uppercase tracking-[0.1em] text-fg-dim">
                          {f.city}, {festivalDateLabel(f)}
                        </span>
                      </span>
                      <span className="shrink-0 text-accent">→</span>
                    </Link>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-xs text-fg-dim">
                Past appearances and announced lineups only, each checked against the festival&apos;s own records.
              </p>
            </div>
          )}

          {relatedPosts.length > 0 && (
            <div className="mt-14 border-t border-line pt-8">
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-fg-dim">
                related on rts.fm
              </p>
              <ul className="mt-4 flex flex-col divide-y divide-line">
                {relatedPosts.map((post) => (
                  <li key={post.slug}>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="flex items-center justify-between gap-4 py-3 text-sm font-semibold text-fg transition-colors hover:text-accent"
                    >
                      {post.title}
                      <span className="shrink-0 text-accent">→</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <RelatedLinks groups={relatedForArtist(artist)} />
        </article>
      </main>
      <AboutFooter />
    </>
  );
}
