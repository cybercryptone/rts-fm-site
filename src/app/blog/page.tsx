import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import AboutFooter from "@/components/AboutFooter";
import { getAllPosts } from "@/lib/blog";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = {
  title: "Blog",
  description: "Notes, releases, and studio updates from RTS.FM.",
  alternates: { canonical: "/blog" },
};

export default function BlogIndex() {
  const posts = getAllPosts();

  return (
    <>
      <Nav />
      <main className="flex-1 px-6 pb-24 pt-32 sm:px-10 sm:pb-32 sm:pt-40">
        <div className="mx-auto max-w-[1400px]">
          <div className="flex items-baseline gap-3 font-mono text-xs uppercase tracking-[0.2em] text-fg-dim">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            notes &amp; updates
          </div>
          <h1 className="mt-6 font-display text-4xl font-bold uppercase tracking-[-0.02em] text-fg sm:text-5xl">
            Blog
          </h1>

          {posts.length === 0 ? (
            <p className="mt-10 text-sm text-fg-dim">
              Nothing published yet — check back soon.
            </p>
          ) : (
            <ul className="mt-12 flex flex-col divide-y divide-line border-t border-line">
              {posts.map((post) => (
                <li key={post.slug}>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="group flex flex-col gap-2 py-8 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
                  >
                    <div className="min-w-0">
                      <p className="font-display text-xl font-bold uppercase tracking-[-0.02em] text-fg transition-colors group-hover:text-accent sm:text-2xl">
                        {post.title}
                      </p>
                      <p className="mt-2 max-w-xl text-sm leading-relaxed text-fg-dim">
                        {post.excerpt}
                      </p>
                    </div>
                    <span className="shrink-0 font-mono text-[11px] uppercase tracking-[0.14em] text-fg-dim">
                      {formatDate(post.date)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
      <AboutFooter />
    </>
  );
}
