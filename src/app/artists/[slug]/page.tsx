import type { Metadata } from "next";
import { Children, isValidElement } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import Nav from "@/components/Nav";
import AboutFooter from "@/components/AboutFooter";
import { getAllArtists, getArtistBySlug } from "@/lib/artists";
import { getAllPosts } from "@/lib/blog";
import { SITE } from "@/lib/data";

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
    description: artist.excerpt,
    alternates: { canonical: `/artists/${slug}` },
    openGraph: {
      type: "profile",
      title: artist.title,
      description: artist.excerpt,
      images: [artist.image],
    },
    twitter: {
      card: "summary_large_image",
      title: artist.title,
      description: artist.excerpt,
    },
  };
}

// Same figure/figcaption-out-of-<p> hydration fix used on blog posts — see
// src/app/blog/[slug]/page.tsx for the full rationale.
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
};

export default async function ArtistPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const artist = getArtistBySlug(slug);
  if (!artist) notFound();

  const relatedPosts = getAllPosts().filter((p) => artist.relatedPosts.includes(p.slug));

  // MusicGroup (not Person) per schema.org's own guidance: it covers solo
  // acts as well as bands and, unlike Person, carries genre/sameAs in a way
  // search engines expect for musicians.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    mainEntity: {
      "@type": "MusicGroup",
      name: artist.name,
      description: artist.excerpt,
      image: artist.image,
      url: `${SITE.url}/artists/${artist.slug}`,
      genre: artist.genres,
      sameAs: artist.sameAs,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
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
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-fg-dim sm:text-base">
            {artist.excerpt}
          </p>

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
            <MDXRemote source={artist.content} components={mdxComponents} />
          </div>

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
        </article>
      </main>
      <AboutFooter />
    </>
  );
}
