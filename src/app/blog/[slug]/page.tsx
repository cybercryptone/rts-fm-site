import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import Nav from "@/components/Nav";
import AboutFooter from "@/components/AboutFooter";
import { getAllPosts, getPostBySlug } from "@/lib/blog";
import { formatDate } from "@/lib/format";

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
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      publishedTime: post.date,
    },
  };
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
  p: (props: React.ComponentProps<"p">) => (
    <p className="mt-5 text-sm leading-relaxed text-fg-dim sm:text-base" {...props} />
  ),
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
};

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  return (
    <>
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
            {formatDate(post.date)}
          </p>
          <h1 className="mt-3 font-display text-3xl font-bold uppercase tracking-[-0.02em] text-fg sm:text-4xl">
            {post.title}
          </h1>

          <div className="mt-4 border-t border-line pt-4">
            <MDXRemote source={post.content} components={mdxComponents} />
          </div>
        </article>
      </main>
      <AboutFooter />
    </>
  );
}
