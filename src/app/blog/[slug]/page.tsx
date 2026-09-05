import type { Metadata } from "next";
import { Children, isValidElement } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import Nav from "@/components/Nav";
import AboutFooter from "@/components/AboutFooter";
import QuickWins from "@/components/QuickWins";
import { getAllPosts, getPostBySlug } from "@/lib/blog";
import { formatDate } from "@/lib/format";
import { SITE } from "@/lib/data";

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return {
    title: { absolute: post.title },
    description: post.excerpt,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      publishedTime: post.date,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
    },
  };
}

// Markdown always wraps a standalone `![alt](src)` in its own paragraph, but
// figure/figcaption are block content and invalid inside a <p> (silent
// hydration mismatch, not just a lint nit). `p` below unwraps to just the
// figure when that's effectively its only content, so no <figure> ever ends
// up nested inside a <p> in the rendered HTML.
function MdxFigureImg({ alt, ...props }: React.ComponentProps<"img">) {
  return (
    /* eslint-disable-next-line @next/next/no-img-element -- external, CC-licensed editorial images; not worth Next/Image's remote-domain allowlisting for one-off blog credits */
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
    // Remark wraps a standalone image in a paragraph alongside stray
    // whitespace-only text nodes (newlines from the source), so a plain
    // Children.count check for "just the image" undercounts by treating
    // those as real siblings. Filter them out before deciding.
    const realChildren = Children.toArray(props.children).filter(
      (child) => !(typeof child === "string" && child.trim() === ""),
    );

    // Plain `![alt](src)` on its own line.
    if (realChildren.length === 1 && isValidElement(realChildren[0]) && realChildren[0].type === MdxImage) {
      return realChildren[0];
    }

    // `![alt](src)` immediately followed by an `*italic credit line*`, a
    // common manual-caption convention our writers use. The italic line is
    // the richer, human-written caption, so it replaces (not duplicates)
    // the alt-derived figcaption from the plain-image case above.
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
  QuickWins,
};

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    dateModified: post.date,
    url: `${SITE.url}/blog/${post.slug}`,
    mainEntityOfPage: `${SITE.url}/blog/${post.slug}`,
    author: { "@type": "Organization", name: SITE.name, url: SITE.url },
    publisher: { "@type": "Organization", name: SITE.name, url: SITE.url },
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
            href="/blog"
            className="font-mono text-[11px] uppercase tracking-[0.18em] text-fg-dim transition-colors hover:text-accent"
          >
            ← blog
          </Link>

          <p className="mt-8 font-mono text-[11px] uppercase tracking-[0.18em] text-fg-dim">
            {formatDate(post.date)} · rts.fm editorial
          </p>
          <h1 className="mt-3 font-display text-3xl font-bold uppercase tracking-[-0.02em] text-fg sm:text-4xl">
            {post.title}
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-fg-dim sm:text-base">
            {post.excerpt}
          </p>

          <div className="mt-6 border-t border-line pt-6">
            <MDXRemote source={post.content} components={mdxComponents} />
          </div>
        </article>
      </main>
      <AboutFooter />
    </>
  );
}
