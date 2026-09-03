import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import AboutFooter from "@/components/AboutFooter";
import { getAllPosts } from "@/lib/blog";
import { formatDateCompact } from "@/lib/format";

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
      <main
        className="flex-1 px-6 pb-24 sm:px-10 sm:pb-32"
        style={{ paddingTop: "calc(var(--nav-height) + 4rem)" }}
      >
        <div className="mx-auto max-w-[1400px]">
          <div className="flex items-baseline gap-3 font-mono text-xs uppercase tracking-[0.2em] text-fg-dim">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            notes &amp; updates
          </div>
          <h1 className="mt-[18px] font-display text-4xl font-bold uppercase tracking-[-0.02em] text-fg sm:text-5xl">
            Blog
          </h1>

          {posts.length === 0 ? (
            <p className="mt-10 text-sm text-fg-dim">
              Nothing published yet — check back soon.
            </p>
          ) : (
            <ul className="blog-divider mt-12 flex flex-col divide-y border-t">
              {posts.map((post, i) => (
                <li key={post.slug} className="blog-row">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="flex items-center gap-4 py-8 pr-4 sm:gap-6 sm:pr-10"
                  >
                    <span className="hidden shrink-0 self-center font-mono text-[11px] text-fg-dim/50 sm:block sm:w-10">
                      {String(i + 1).padStart(2, "0")}
                      {" //"}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-accent">
                        {"[editorial] // "}
                        {formatDateCompact(post.date)}
                      </div>
                      <p className="blog-row-title mt-2 max-w-[620px] font-display text-lg font-bold uppercase leading-tight tracking-[-0.03em] text-fg sm:text-xl">
                        {post.title}
                      </p>
                      <p className="mt-2 max-w-[620px] text-sm leading-relaxed text-fg-dim">
                        {post.excerpt}
                      </p>
                    </div>
                    <span className="blog-row-arrow hidden shrink-0 self-center font-mono text-lg text-accent sm:block">
                      →
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
