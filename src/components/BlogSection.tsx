import Link from "next/link";
import { getAllPosts } from "@/lib/blog";
import { getAllArtists } from "@/lib/artists";
import { formatDateCompact } from "@/lib/format";

// Evergreen pages that earn most of the site's traffic. They are pinned here
// so the homepage links straight to them instead of only to the newest posts.
const POPULAR_SLUGS = [
  "who-runs-berghain-ownership-operators",
  "best-berlin-clubs-2026-guide",
  "best-techno-house-festivals-2027",
  "teenage-engineering-stop-making-synthesizers",
  "why-people-go-out-less-nightlife-data-2026",
];

// Artist profiles that draw the most search interest; pinned on the homepage
// so the strongest page on the site links straight to them.
const POPULAR_ARTISTS = [
  "jeff-mills",
  "carl-cox",
  "charlotte-de-witte",
  "peggy-gou",
  "underground-resistance",
  "len-faki",
  "seth-troxler",
  "sven-marquardt",
  "sonja-moonear",
  "raresh",
  "donato-dozzy",
  "aphex-twin",
];

export default function BlogSection() {
  const all = getAllPosts();
  const posts = all.slice(0, 3);
  const artistsBySlug = new Map(getAllArtists().map((a) => [a.slug, a]));
  const popularArtists = POPULAR_ARTISTS.map((slug) => artistsBySlug.get(slug)).filter(
    (a): a is NonNullable<ReturnType<typeof artistsBySlug.get>> => !!a,
  );
  const popular = POPULAR_SLUGS.map((slug) => all.find((p) => p.slug === slug)).filter(
    (p): p is NonNullable<typeof p> => !!p,
  );

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

        <nav aria-label="Popular guides" className="mt-16 border-t border-line pt-8">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-fg-dim">popular guides</p>
          <ul className="mt-4 grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
            <li>
              <Link
                href="/festivals/calendar/2027"
                className="text-sm font-semibold text-fg transition-colors hover:text-accent"
              >
                Techno &amp; house festivals 2027: dates, cities, tickets <span className="text-accent">→</span>
              </Link>
            </li>
            {popular.map((post) => (
              <li key={post.slug}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="text-sm font-semibold text-fg transition-colors hover:text-accent"
                >
                  {post.title} <span className="text-accent">→</span>
                </Link>
              </li>
            ))}
          </ul>
          {popularArtists.length > 0 && (
            <>
              <p className="mt-8 font-mono text-[11px] uppercase tracking-[0.18em] text-fg-dim">popular artist profiles</p>
              <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
                {popularArtists.map((a) => (
                  <li key={a.slug}>
                    <Link
                      href={`/artists/${a.slug}`}
                      className="text-sm font-semibold text-fg transition-colors hover:text-accent"
                    >
                      {a.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}
          <Link
            href="/topics"
            className="mt-6 inline-block font-mono text-[11px] uppercase tracking-[0.18em] text-fg-dim transition-colors hover:text-accent"
          >
            browse all topics →
          </Link>
        </nav>
      </div>
    </section>
  );
}
