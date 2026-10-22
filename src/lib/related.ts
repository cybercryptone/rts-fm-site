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
  plan: LinkPlan; // balanced "similar" / "keep reading" picks, see balance()
};

// Planned related picks per source slug, balanced so every page ends up with
// at least MIN_INBOUND links pointing at it (see balance()).
type LinkPlan = {
  artists: Map<string, string[]>;
  festivals: Map<string, string[]>;
  posts: Map<string, string[]>;
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

const MIN_INBOUND = 2;
const BASE_PICKS = 4;
const MAX_PICKS = 6;

// Deterministic tie-break, so equally good candidates are not always chosen
// alphabetically (which starved every page late in the alphabet of links).
function pairHash(a: string, b: string): number {
  let h = 2166136261;
  for (const c of `${a}|${b}`) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return h >>> 0;
}

type Candidate = { target: string; score: number };

// Picks BASE_PICKS best candidates per source, then tops up any target that
// would still have fewer than MIN_INBOUND links pointing at it by adding it to
// the lists of its closest sources (up to MAX_PICKS each). Static inbound
// links already in the content count towards the target.
function balance(
  sources: string[],
  candidates: Map<string, Candidate[]>,
  staticIn: (target: string) => number,
  minScoreForTopUp: number,
  minScoreBase: number,
): Map<string, string[]> {
  const plan = new Map<string, string[]>();
  const incoming = new Map<string, number>();
  for (const src of sources) {
    const picks = (candidates.get(src) ?? [])
      .filter((c) => c.score >= minScoreBase)
      .sort((a, b) => b.score - a.score || pairHash(src, a.target) - pairHash(src, b.target))
      .slice(0, BASE_PICKS)
      .map((c) => c.target);
    plan.set(src, picks);
    for (const t of picks) incoming.set(t, (incoming.get(t) ?? 0) + 1);
  }
  const total = (t: string) => staticIn(t) + (incoming.get(t) ?? 0);
  const needy = sources
    .filter((t) => total(t) < MIN_INBOUND)
    .sort((a, b) => total(a) - total(b) || a.localeCompare(b));
  for (const target of needy) {
    const suitors = sources
      .filter((src) => src !== target && !(plan.get(src) ?? []).includes(target))
      .map((src) => ({ src, c: (candidates.get(src) ?? []).find((c) => c.target === target) }))
      .filter((x): x is { src: string; c: Candidate } => !!x.c && x.c.score >= minScoreForTopUp)
      .sort(
        (a, b) =>
          b.c.score - a.c.score ||
          (plan.get(a.src)?.length ?? 0) - (plan.get(b.src)?.length ?? 0) ||
          pairHash(a.src, target) - pairHash(b.src, target),
      );
    for (const { src } of suitors) {
      if (total(target) >= MIN_INBOUND) break;
      const list = plan.get(src) ?? [];
      if (list.length >= MAX_PICKS) continue;
      list.push(target);
      plan.set(src, list);
      incoming.set(target, (incoming.get(target) ?? 0) + 1);
    }
  }
  return plan;
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

  const plan = buildPlan(posts, artists, bodies, mentions, topics, inlinks);
  return { entities, posts, bodies, mentions, topics, inlinks, plan };
}

function tokenOverlap(a: Set<string>, b: Set<string>): number {
  let n = 0;
  for (const t of a) if (b.has(t)) n++;
  return n;
}

function buildPlan(
  posts: PostMeta[],
  artists: ArtistMeta[],
  bodies: Map<string, string>,
  mentions: Map<string, Set<string>>,
  topics: Map<string, Set<string>>,
  inlinks: Map<string, number>,
): LinkPlan {
  // Artists: shared genres (x2) and country, as before.
  const artistCands = new Map<string, Candidate[]>();
  for (const a of artists) {
    artistCands.set(
      a.slug,
      artists
        .filter((b) => b.slug !== a.slug)
        .map((b) => {
          const genres = b.genres.filter((g) => a.genres.includes(g)).length;
          const sameCountry = country(b.location) && country(b.location) === country(a.location) ? 1 : 0;
          return { target: b.slug, score: genres * 2 + sameCountry };
        }),
    );
  }
  const artistPlan = balance(
    artists.map((a) => a.slug),
    artistCands,
    (t) => inlinks.get(`/artists/${t}`) ?? 0,
    1,
    2,
  );

  // Festivals: shared genres and country.
  const festCands = new Map<string, Candidate[]>();
  for (const f of FESTIVALS) {
    festCands.set(
      f.slug,
      FESTIVALS.filter((g) => g.slug !== f.slug).map((g) => ({
        target: g.slug,
        score: g.genres.filter((x) => f.genres.includes(x)).length + (g.country === f.country ? 2 : 0),
      })),
    );
  }
  const festPlan = balance(
    FESTIVALS.map((f) => f.slug),
    festCands,
    (t) => inlinks.get(`/festivals/${t}`) ?? 0,
    1,
    2,
  );

  // Posts: shared entities, title words and themes, skipping posts already
  // linked from the body.
  const titleTokens = new Map(posts.map((p) => [p.slug, tokens(p.title)] as const));
  const postCands = new Map<string, Candidate[]>();
  for (const p of posts) {
    const already = linkedFrom(bodies.get(p.slug) ?? "");
    const mine = mentions.get(p.slug) ?? new Set<string>();
    const myThemes = topics.get(p.slug) ?? new Set<string>();
    postCands.set(
      p.slug,
      posts
        .filter((q) => q.slug !== p.slug && !already.has(`/blog/${q.slug}`))
        .map((q) => {
          const theirs = mentions.get(q.slug) ?? new Set<string>();
          let shared = 0;
          for (const h of mine) if (theirs.has(h)) shared++;
          const overlap = tokenOverlap(titleTokens.get(p.slug) ?? new Set(), titleTokens.get(q.slug) ?? new Set());
          const themes = tokenOverlap(myThemes, topics.get(q.slug) ?? new Set());
          return { target: q.slug, score: Math.min(shared, 2) * 2 + overlap * 2.5 + Math.min(themes, 2) * 1.5 };
        }),
    );
  }
  const postPlan = balance(
    posts.map((p) => p.slug),
    postCands,
    (t) => inlinks.get(`/blog/${t}`) ?? 0,
    1.5,
    5,
  );
  return { artists: artistPlan, festivals: festPlan, posts: postPlan };
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
  const { entities, posts, bodies, mentions, inlinks, plan } = index();
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

  const planned = (plan.posts.get(slug) ?? [])
    .map((q) => posts.find((p) => p.slug === q))
    .filter((p): p is PostMeta => !!p && !already.has(`/blog/${p.slug}`));
  if (planned.length) {
    groups.push({ heading: "Keep reading", items: planned.map(postItem) });
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
  const { plan } = index();
  const groups: RelatedGroup[] = [];

  const posts = postsMentioning(`/artists/${artist.slug}`, new Set(artist.relatedPosts), 4);
  if (posts.length) groups.push({ heading: "Also mentioned in", items: posts.map(postItem) });

  const bySlug = new Map(getAllArtists().map((a) => [a.slug, a] as const));
  const similar = (plan.artists.get(artist.slug) ?? [])
    .map((slug) => bySlug.get(slug))
    .filter((a): a is ArtistMeta => !!a)
    .map((a) => ({ a }));
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
  const { plan } = index();
  const groups: RelatedGroup[] = [];

  const posts = postsMentioning(`/festivals/${festival.slug}`, new Set(), 4);
  if (posts.length) groups.push({ heading: "Related articles", items: posts.map(postItem) });

  const similar = (plan.festivals.get(festival.slug) ?? [])
    .map((slug) => FESTIVALS.find((f) => f.slug === slug))
    .filter((f): f is Festival => !!f)
    .map((f) => ({ f }));
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
