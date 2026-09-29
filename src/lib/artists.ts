import fs from "fs";
import path from "path";
import matter from "gray-matter";
import artistDates from "@/content/artist-dates.json";

const ARTISTS_DIR = path.join(process.cwd(), "src/content/artists");

// Real git commit history for each artist file, snapshotted to a static
// file rather than shelled out to `git log` at build time, since a
// production build may run from a shallow clone with no history to read.
// Regenerate after adding or editing an artist file (see the one-off
// script used to first generate this — a `git log --diff-filter=A
// --follow` / `git log -1` pair per file, both --format=%aI). A slug
// missing from this map (a new artist added without regenerating it)
// just gets no dateCreated/dateModified rather than a build failure.
const ARTIST_DATES: Record<string, { dateCreated: string; dateModified: string }> = artistDates;

export type ArtistMeta = {
  slug: string;
  name: string;
  title: string;
  excerpt: string;
  jobTitle: string;
  genres: string[];
  location: string;
  image: string;
  imageAlt: string;
  imageCredit: string;
  sameAs: string[];
  relatedPosts: string[];
  dateCreated?: string;
  dateModified?: string;
};

export type Artist = ArtistMeta & {
  content: string;
};

function readSlugs(): string[] {
  return fs
    .readdirSync(ARTISTS_DIR)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.replace(/\.mdx$/, ""));
}

function toMeta(slug: string, data: Record<string, unknown>): ArtistMeta {
  return {
    slug,
    name: data.name as string,
    title: data.title as string,
    excerpt: data.excerpt as string,
    jobTitle: data.jobTitle as string,
    genres: (data.genres as string[]) ?? [],
    location: data.location as string,
    image: data.image as string,
    imageAlt: data.imageAlt as string,
    imageCredit: data.imageCredit as string,
    sameAs: (data.sameAs as string[]) ?? [],
    relatedPosts: (data.relatedPosts as string[]) ?? [],
    dateCreated: ARTIST_DATES[slug]?.dateCreated,
    dateModified: ARTIST_DATES[slug]?.dateModified,
  };
}

export function getAllArtists(): ArtistMeta[] {
  return readSlugs()
    .map((slug) => {
      const raw = fs.readFileSync(path.join(ARTISTS_DIR, `${slug}.mdx`), "utf8");
      const { data } = matter(raw);
      return toMeta(slug, data);
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function getArtistBySlug(slug: string): Artist | null {
  const filePath = path.join(ARTISTS_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);
  return { ...toMeta(slug, data), content };
}
