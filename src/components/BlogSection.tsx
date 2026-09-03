import Link from "next/link";
import { getAllPosts } from "@/lib/blog";
import { formatDateCompact } from "@/lib/format";

export default function BlogSection() {
  const posts = getAllPosts().slice(0, 3);

  if (posts.length === 0) return null;

  return (
    <section id="blog" className="border-b border-line px-6 py-24 sm:px-10 sm:py-32">
      <div className="mx-auto max-w-[1400px]">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h2 className="font-display text-4xl font-bold uppercase tracking-[-0.02em] text-fg sm:text-5xl">
            Blog
          </h2>
          <Link
            href="/blog"
            className="font-mono text-xs uppercase tracking-[0.18em] text-fg-dim transition-colors hover:text-accent"
          >
            read the blog →
          </Link>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-3">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group flex flex-col"
            >
              <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-accent">
                {"[editorial] // "}
                {formatDateCompact(post.date)}
              </div>
              <p className="mt-3 font-display text-lg font-bold uppercase leading-tight tracking-[-0.03em] text-fg transition-transform duration-200 group-hover:translate-x-0.5 sm:text-xl">
                {post.title}
              </p>
              <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-fg-dim">
                {post.excerpt}
              </p>
              <span className="mt-4 font-mono text-[11px] uppercase tracking-[0.14em] text-fg-dim transition-colors group-hover:text-accent">
                read
                <span className="ml-1 inline-block -translate-x-1 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100">
                  →
                </span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
