import { getAllPosts, getPostBySlug, type PostMeta } from "@/lib/blog";
import { getAllArtists, getArtistBySlug, type ArtistMeta } from "@/lib/artists";
import { FESTIVALS, type Festival } from "@/lib/festivals";

// Automatic internal linking. Instead of hand-maintaining "related" lists, the
// site derives them from the content itself: which artists/festivals a post
// names, which posts name an artist/festival, and which entities share genres
// or countries. Candidates that are barely linked-to from elsewhere get a
// boost, so new or isolated pages are pulled into the link graph rather than
// left orphaned.

export type RelatedItem = { href: string; title: string; meta?: string };
export type RelatedGroup = { heading: string; items: RelatedItem[] };

// Names that are generic words or have spelling variants need explicit match
// terms; everything else matches on its full name.
const FESTIVAL_TERMS: Record<string, string[]> = {
  "movement-detroit": ["Movement Detroit", "Movement festival", "Movement Electronic Music Festival"],
  sonar: ["Sónar", "Sonar Barcelona", "Sonar festival"],
  "awakenings-festival": ["Awakenings"],
  "dekmantel-festival": ["Dekmantel"],
  "rewire-festival": ["Rewire"],
  "dimensions-festival": ["Dimensions Festival"],
  "dockyard-festival": ["Dockyard Festival", "Dockyard"],
  "houghton-festival": ["Houghton"],
  "garbicz-festival": ["Garbicz"],
  "unsound-festival": ["Unsound"],
  "ctm-festival": ["CTM Festival"],
  "lente-kabinet": ["Lentekabinet", "Lente Kabinet"],
};
const ARTIST_TERMS: Record<string, string[]> = {
  "sven-vath": ["Sven Väth", "Sven Vath"],
  "motor-city-drum-ensemble": ["Motor City Drum Ensemble", "MCDE"],
};

const STOP = new Set(
  "with from that this have will what when where their about into after over more than your just they been also club music techno house festival festivals electronic dance news says year years new".split(" "),
);

// Broad themes, detected by repeated use in a post body. A shared theme is
// what ties together posts that name no common artist or festival.
const TOPICS: Record<string, RegExp> = {
  ai: /\bAI\b|\bSuno\b|generative|artificial intelligence/g,
  vinyl: /\bvinyl\b|pressing plant/gi,
  closures: /\bclosures?\b|\bshut(?:ting)? down\b|licensing/gi,
  streaming: /\bSpotify\b|\bDeezer\b|\bstreaming\b|royalt/gi,
  touring: /\bBrexit\b|\bvisas?\b|\btouring\b|\bcarnets?\b/gi,
  burningman: /Burning Man|\bplaya\b/gi,
  gear: /\bsynthesi[sz]ers?\b|\bhardware\b|Ableton|Teenage Engineering|sound system/gi,
  ade: /\bADE\b|Amsterdam Dance Event/g,
  labels: /\blabels?\b|\brecords\b|\bcatalogue\b/gi,
};

type Entity = {
  kind: "artist" | "festival";
  slug: string;
  href: string;
  label: string;
  terms: string[];
};

type Index = {
  entities: Entity[];
  posts: PostMeta[];
  bodies: Map<string, string>; // post slug -> body
  mentions: Map<string, Set<string>>; // post slug -> entity hrefs mentioned
  topics: Map<string, Set<string>>; // post slug -> themes
  inlinks: Map<string, number>; // href -> body links pointing at it
};

let cached: Index | undefined;

function escapeRe(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function stripLinksAndMedia(body: string) {
  return body
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1");
}

function build(): Index {
  const posts = getAllPosts();
  const artists = getAllArtists();
  const entities: Entity[] = [
    ...artists.map((a) => ({
      kind: "artist" as const,
      slug: a.slug,
      href: `/artists/${a.slug}`,
      label: a.name,
      terms: ARTIST_TERMS[a.slug] ?? [a.name],
    })),
    ...FESTIVALS.map((f) => ({
      kind: "festival" as const,
      slug: f.slug,
      href: `/festivals/${f.slug}`,
      label: f.name,
      terms: FESTIVAL_TERMS[f.slug] ?? [f.name],
    })),
  ];

  const bodies = new Map<string, string>();
  for (const p of posts) bodies.set(p.slug, getPostBySlug(p.slug)?.content ?? "");

  const matchers = entities.map((e) => ({
    e,
    re: new RegExp(`(?<![\\w])(?:${e.terms.map(escapeRe).join("|")})(?![\\w])`),
  }));

  const mentions = new Map<string, Set<string>>();
  for (const [slug, body] of bodies) {
    const text = stripLinksAndMedia(body);
    const set = new Set<string>();
    for (const { e, re } of matchers) if (re.test(text)) set.add(e.href);
    mentions.set(slug, set);
  }

  const topics = new Map<string, Set<string>>();
  for (const [slug, body] of bodies) {
    const set = new Set<string>();
    for (const [name, re] of Object.entries(TOPICS)) {
      if ((body.match(re)?.length ?? 0) >= 4) set.add(name);
    }
    topics.set(slug, set);
  }

  const inlinks = new Map<string, number>();
  const count = (body: string, self: string) => {
    for (const m of body.matchAll(/\]\((\/(?:blog|artists|festivals)\/[a-z0-9-]+)\)/g)) {
      if (m[1] !== self) inlinks.set(m[1], (inlinks.get(m[1]) ?? 0) + 1);
    }
  };
  for (const [slug, body] of bodies) count(body, `/blog/${slug}`);
  for (const a of artists) count(getArtistBySlug(a.slug)?.content ?? "", `/artists/${a.slug}`);
  for (const f of FESTIVALS) for (const slug of f.artists ?? []) {
    inlinks.set(`/artists/${slug}`, (inlinks.get(`/artists/${slug}`) ?? 0) + 1);
  }

  return { entities, posts, bodies, mentions, topics, inlinks };
}

function index(): Index {
  return (cached ??= build());
}

function tokens(title: string): Set<string> {
  return new Set(
    title
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter((w) => w.length > 3 && !/^\d+$/.test(w) && !STOP.has(w)),
  );
}

// Weak inbound coverage earns a boost so the graph evens out over time.
function isolationBoost(href: string, inlinks: Map<string, number>) {
  const n = inlinks.get(href) ?? 0;
  return n === 0 ? 3 : n === 1 ? 2 : n === 2 ? 1 : 0;
}

function linkedFrom(body: string): Set<string> {
  return new Set(
    [...body.matchAll(/\]\((\/(?:blog|artists|festivals)\/[a-z0-9-]+)\)/g)].map((m) => m[1]),
  );
}

function postItem(p: PostMeta): RelatedItem {
  return { href: `/blog/${p.slug}`, title: p.title };
}

export function relatedForPost(slug: string): RelatedGroup[] {
  const { entities, posts, bodies, mentions, topics, inlinks } = index();
  const body = bodies.get(slug) ?? "";
  const already = linkedFrom(body);
  const mine = mentions.get(slug) ?? new Set<string>();
  const groups: RelatedGroup[] = [];

  const named = entities
    .filter((e) => mine.has(e.href) && !already.has(e.href))
    .sort(
      (a, b) =>
        isolationBoost(b.href, inlinks) - isolationBoost(a.href, inlinks) ||
        (a.kind === b.kind ? 0 : a.kind === "artist" ? -1 : 1),
    )
    .slice(0, 6);
  if (named.length) {
    groups.push({
      heading: "Mentioned in this article",
      items: named.map((e) => ({
        href: e.href,
        title: e.label,
        meta: e.kind === "artist" ? "Artist profile" : "Festival guide",
      })),
    });
  }

  const myTokens = tokens(posts.find((p) => p.slug === slug)?.title ?? "");
  const scored = posts
    .filter((p) => p.slug !== slug && !already.has(`/blog/${p.slug}`))
    .map((p) => {
      const theirs = mentions.get(p.slug) ?? new Set<string>();
      let shared = 0;
      for (const h of mine) if (theirs.has(h)) shared++;
      let overlap = 0;
      for (const t of tokens(p.title)) if (myTokens.has(t)) overlap++;
      let themes = 0;
      const myThemes = topics.get(slug) ?? new Set<string>();
      for (const t of topics.get(p.slug) ?? []) if (myThemes.has(t)) themes++;
      const topical = Math.min(shared, 2) * 2 + overlap * 2.5 + Math.min(themes, 2) * 1.5;
      return { p, topical, score: topical + isolationBoost(`/blog/${p.slug}`, inlinks) };
    })
    .filter((x) => x.topical >= 5)
    .sort((a, b) => b.score - a.score || (a.p.date < b.p.date ? 1 : -1))
    .slice(0, 4);
  if (scored.length) {
    groups.push({ heading: "Keep reading", items: scored.map((x) => postItem(x.p)) });
  }
  return groups;
}

function postsMentioning(href: string, exclude: Set<string>, limit: number): PostMeta[] {
  const { posts, mentions, inlinks } = index();
  return posts
    .filter((p) => mentions.get(p.slug)?.has(href) && !exclude.has(p.slug))
    .sort(
      (a, b) =>
        isolationBoost(`/blog/${b.slug}`, inlinks) - isolationBoost(`/blog/${a.slug}`, inlinks) ||
        (a.date < b.date ? 1 : -1),
    )
    .slice(0, limit);
}

function country(location: string) {
  return location.split(",").pop()?.trim() ?? "";
}

export function relatedForArtist(artist: ArtistMeta): RelatedGroup[] {
  const { inlinks } = index();
  const groups: RelatedGroup[] = [];

  const posts = postsMentioning(`/artists/${artist.slug}`, new Set(artist.relatedPosts), 4);
  if (posts.length) groups.push({ heading: "Also mentioned in", items: posts.map(postItem) });

  const similar = getAllArtists()
    .filter((a) => a.slug !== artist.slug)
    .map((a) => {
      const genres = a.genres.filter((g) => artist.genres.includes(g)).length;
      const sameCountry = country(a.location) && country(a.location) === country(artist.location) ? 1 : 0;
      const base = genres * 2 + sameCountry;
      return { a, base, score: base + isolationBoost(`/artists/${a.slug}`, inlinks) };
    })
    .filter((x) => x.base >= 2)
    .sort((x, y) => y.score - x.score || x.a.name.localeCompare(y.a.name))
    .slice(0, 4);
  if (similar.length) {
    groups.push({
      heading: "Similar artists",
      items: similar.map((x) => ({
        href: `/artists/${x.a.slug}`,
        title: x.a.name,
        meta: x.a.jobTitle || x.a.genres.slice(0, 2).join(" / "),
      })),
    });
  }
  return groups;
}

export function relatedForFestival(festival: Festival): RelatedGroup[] {
  const { inlinks } = index();
  const groups: RelatedGroup[] = [];

  const posts = postsMentioning(`/festivals/${festival.slug}`, new Set(), 4);
  if (posts.length) groups.push({ heading: "Related articles", items: posts.map(postItem) });

  const similar = FESTIVALS.filter((f) => f.slug !== festival.slug)
    .map((f) => {
      const genres = f.genres.filter((g) => festival.genres.includes(g)).length;
      const base = genres + (f.country === festival.country ? 2 : 0);
      return { f, base, score: base + isolationBoost(`/festivals/${f.slug}`, inlinks) };
    })
    .filter((x) => x.base >= 2)
    .sort((x, y) => y.score - x.score || x.f.name.localeCompare(y.f.name))
    .slice(0, 3);
  if (similar.length) {
    groups.push({
      heading: "Similar festivals",
      items: similar.map((x) => ({
        href: `/festivals/${x.f.slug}`,
        title: x.f.name,
        meta: `${x.f.city}, ${x.f.country}`,
      })),
    });
  }
  return groups;
}
