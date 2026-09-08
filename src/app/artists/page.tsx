import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import AboutFooter from "@/components/AboutFooter";
import { getAllArtists, type ArtistMeta } from "@/lib/artists";

export const metadata: Metadata = {
  title: "Artists",
  description: "Biographies and profiles of the DJs and producers shaping tech house, minimal house, and minimal techno.",
  alternates: { canonical: "/artists" },
};

const ALPHABET = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));

function firstLetter(name: string): string {
  const c = name.trim()[0]?.toUpperCase() ?? "";
  return c >= "A" && c <= "Z" ? c : "#";
}

// Artists already come sorted alphabetically by name, so a single pass
// groups consecutive same-letter entries without needing to re-sort.
function groupByLetter(artists: ArtistMeta[]): { letter: string; artists: ArtistMeta[] }[] {
  const groups: { letter: string; artists: ArtistMeta[] }[] = [];
  for (const artist of artists) {
    const letter = firstLetter(artist.name);
    const current = groups[groups.length - 1];
    if (current?.letter === letter) {
      current.artists.push(artist);
    } else {
      groups.push({ letter, artists: [artist] });
    }
  }
  return groups;
}

export default function ArtistsIndex() {
  const artists = getAllArtists();
  const groups = groupByLetter(artists);
  const availableLetters = new Set(groups.map((g) => g.letter));
  const indexBySlug = new Map(artists.map((a, i) => [a.slug, i + 1]));

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
            profiles
          </div>
          <h1 className="mt-[18px] font-display text-4xl font-bold uppercase tracking-[-0.02em] text-fg sm:text-5xl">
            Artists
          </h1>

          {artists.length === 0 ? (
            <p className="mt-10 text-sm text-fg-dim">
              Nothing published yet — check back soon.
            </p>
          ) : (
            <>
              <nav
                aria-label="Jump to letter"
                className="mt-10 flex flex-wrap gap-x-1 gap-y-2 border-y border-line py-4"
              >
                {ALPHABET.map((letter) =>
                  availableLetters.has(letter) ? (
                    <a
                      key={letter}
                      href={`#letter-${letter}`}
                      className="flex h-7 w-7 items-center justify-center rounded font-mono text-xs font-bold uppercase text-fg-dim transition-colors hover:bg-accent hover:text-bg"
                    >
                      {letter}
                    </a>
                  ) : (
                    <span
                      key={letter}
                      aria-hidden="true"
                      className="flex h-7 w-7 items-center justify-center font-mono text-xs uppercase text-fg-dim/25"
                    >
                      {letter}
                    </span>
                  ),
                )}
              </nav>

              {groups.map((group) => (
                <div key={group.letter}>
                  <h2
                    id={`letter-${group.letter}`}
                    className="mt-12 scroll-mt-[calc(var(--nav-height)+1.5rem)] font-mono text-sm font-bold uppercase tracking-[0.14em] text-accent"
                  >
                    {group.letter}
                  </h2>
                  <ul className="blog-divider mt-4 flex flex-col divide-y border-t">
                    {group.artists.map((artist) => (
                        <li key={artist.slug} className="blog-row">
                          <Link
                            href={`/artists/${artist.slug}`}
                            className="flex items-center gap-4 py-8 pr-4 sm:gap-6 sm:pr-10"
                          >
                            <span className="hidden shrink-0 self-center font-mono text-[11px] text-fg-dim/50 sm:block sm:w-10">
                              {String(indexBySlug.get(artist.slug)).padStart(2, "0")}
                              {" //"}
                            </span>
                            <div className="min-w-0 flex-1">
                              <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-accent">
                                {artist.jobTitle.toUpperCase()} · {artist.location.toUpperCase()}
                              </div>
                              <p className="blog-row-title mt-2 max-w-[620px] font-display text-lg font-bold uppercase leading-tight tracking-[-0.03em] text-fg sm:text-xl">
                                {artist.name}
                              </p>
                              <p className="mt-2 max-w-[620px] text-sm leading-relaxed text-fg-dim">
                                {artist.excerpt}
                              </p>
                            </div>
                            <span className="blog-row-arrow hidden shrink-0 self-center font-mono text-lg text-accent sm:block">
                              →
                            </span>
                          </Link>
                        </li>
                    ))}
                  </ul>
                </div>
              ))}
            </>
          )}
        </div>
      </main>
      <AboutFooter />
    </>
  );
}
