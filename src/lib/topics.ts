import { getAllPosts, type PostMeta } from "@/lib/blog";

// Topic hubs: the editorial clusters of the blog. Each post belongs to exactly
// one topic (its "home"), listed here by slug; a hub may also surface posts
// that live in another topic via `also`. The hub page, the "more in this topic"
// block on every post, the sitemap and llms.txt all read from this one list,
// so adding a post to a cluster is a one-line change.

export type Topic = {
  slug: string;
  name: string;
  // <title> and meta description for the hub page (<= 60 / <= 155 chars).
  title: string;
  description: string;
  // Original framing text shown above the post list (plain paragraphs).
  intro: string[];
  // Best starting point for a newcomer; shown first on the hub.
  pillar: string;
  // Home posts, in editorial order after the pillar.
  posts: string[];
  // Posts homed in another topic but relevant here.
  also?: string[];
  // Non-blog entry points (festival calendar, artist index...) worth linking.
  links?: { href: string; label: string }[];
};

export const TOPICS: Topic[] = [
  {
    slug: "club-closures-and-nightlife-policy",
    name: "Club closures and nightlife policy",
    title: "Club Closures and Nightlife Policy: Data and Reporting",
    description:
      "Why clubs close and what the data says: Berlin, UK and European closure figures, licensing, planning and the economics of going out, tracked by RTS.FM.",
    intro: [
      "Clubs close for reasons that rarely make the headline: rent, business rates, licensing rules, redevelopment and a generation that goes out less often. This hub collects RTS.FM's reporting on all of them, with the published numbers where they exist and a plain statement where they do not.",
      "Start with the European tracker for the cross-city picture, then read the UK pieces on licensing and planning, the Berlin survey data, and the individual closures (Munich's BLITZ, Digbeth's rail-hub threat, Printworks' return) that sit behind the statistics.",
    ],
    pillar: "europe-club-closures-tracker",
    posts: [
      "uk-nightclub-closures-licensing-reform",
      "england-night-time-licensing-home-office-data-2026",
      "where-nightclubs-go-uk-planning-applications-2026",
      "why-people-go-out-less-nightlife-data-2026",
      "remel-black-music-events-london-licensing-study",
      "digbeth-clubs-midlands-rail-hub-demolition-plans",
      "blitz-munich-closure",
      "printworks-london-reopening-2026",
    ],
    also: ["wilde-renate-berlin-club-history", "best-berlin-clubs-2026-guide"],
  },
  {
    slug: "berlin-and-berghain",
    name: "Berlin and Berghain",
    title: "Berlin Clubs and Berghain: Guides, Owners and News",
    description:
      "Berlin's club scene and Berghain explained: who owns it, the Ostgut Ton label, the DJ Mag poll, a dated club guide and fact-checks of the film coverage.",
    intro: [
      "Berlin is where most of the world's techno conversation still starts, and Berghain is the club at its centre. This hub gathers RTS.FM's Berlin reporting: the ownership question people search for most, the dated guide to clubs that are open now, the history of the independent clubs that survived and the fact-checks of how Berlin gets portrayed on screen.",
    ],
    pillar: "best-berlin-clubs-2026-guide",
    posts: [
      "who-runs-berghain-ownership-operators",
      "ostgut-ton-berghain-label-history",
      "berghain-unvrs-dj-mag-top-100",
      "wilde-renate-berlin-club-history",
      "berghain-hollywood-comedy-film",
      "channel-5-berlin-club-scene-film-fact-check",
    ],
    also: ["europe-club-closures-tracker"],
  },
  {
    slug: "festivals-and-ade",
    name: "Festivals and ADE",
    title: "Techno and House Festivals: Guides, News and ADE",
    description:
      "Festival coverage from RTS.FM: the 2027 guide and calendar, cancellations and closures, reunions, ADE 2026 and the safety debate around drug checking.",
    intro: [
      "The festival season is the part of the electronic music calendar where money, politics and nostalgia collide. This hub pairs the practical material (the 2027 guide and calendar, with official ticket links) with the reporting on why some events return and others disappear.",
    ],
    pillar: "best-techno-house-festivals-2027",
    posts: [
      "time-warp-mannheim-2027-lineup",
      "coachella-2027-electronic-acts-charlotte-de-witte-solomun",
      "europe-festival-cancellations-2026",
      "sonar-is-dead-campaign-barcelona-festival-future",
      "bloc-reunion-2027-the-story",
      "exit-festival-returns-serbia-2027-petrovaradin",
      "detroit-movement-festival-20-years",
      "ade-2026-30th-anniversary",
      "ade-2026-wrap-up-30th-edition",
      "hifi-sound-systems-festival-lineups-despacio-sunflower",
      "nsw-festival-drug-checking-trial",
    ],
    links: [
      { href: "/festivals/calendar/2027", label: "Festival calendar 2027" },
      { href: "/festivals", label: "All festivals" },
    ],
  },
  {
    slug: "labels-vinyl-and-independent-music",
    name: "Labels, vinyl and the independent economy",
    title: "Techno Labels, Vinyl and the Indie Economy: Reports",
    description:
      "Label histories (Cocoon, Kompakt, Rawax, Drumcode), vinyl capacity and sales, and the data on how long independent electronic labels survive.",
    intro: [
      "Independent labels and physical formats are still how underground electronic music builds a catalogue. This hub combines the label biographies with the market data: how big independents have become, how long small labels last and why vinyl pressing capacity has become a bottleneck.",
    ],
    pillar: "independent-labels-market-share-2026",
    posts: [
      "independent-label-survival-study",
      "drumcode-records-history-adam-beyer",
      "kompakt-records-cologne-history",
      "cocoon-recordings-history-timeline",
      "cocoon-recordings-25-years",
      "rawax-records-robert-drewek",
      "vinyl-sales-record-2025",
      "vinyl-pressing-plant-capacity-crisis",
      "jd-twitch-optimo-record-collection-sale-world-of-echo",
    ],
    also: ["ostgut-ton-berghain-label-history", "nina-kraviz-treats-label-brazilian-funk"],
  },
  {
    slug: "ai-and-electronic-music",
    name: "AI and electronic music",
    title: "AI and Electronic Music: Streaming, Fraud, DJ Tools",
    description:
      "How AI is reshaping electronic music: streaming floods, fraud convictions, platform bans and labels, AI vocalists, sampling and stem separation for DJs.",
    intro: [
      "AI entered electronic music through three doors at once: the tools DJs use, the tracks that flood streaming services and the artists who now record with synthetic voices. These reports follow each door with sources, from Deezer's upload figures to the first streaming-fraud sentencing.",
    ],
    pillar: "deezer-ai-uploads-streaming-flood",
    posts: [
      "spotify-ai-persona-badge-ifpi-fraud",
      "michael-smith-ai-streaming-fraud-sentencing",
      "bandcamp-ai-ban-six-months-on",
      "charlotte-de-witte-azadi-ep-ai-vocalist-nava",
      "todd-edwards-ai-sampling-producers-split",
      "ai-stem-separation-dj-tools",
    ],
  },
  {
    slug: "dj-business-and-industry",
    name: "DJ business and the music industry",
    title: "DJ Fees, Touring and the Music Industry: Data Reports",
    description:
      "The business of underground DJing: fee data, touring after Brexit, Boiler Room's buyout, ticketing monopolies and who is actually listening to music.",
    intro: [
      "Behind the line-ups is an economy with thin margins and a lot of unexamined assumptions. These reports put numbers on it: what underground DJs earn, how Brexit and visas change touring, what the Boiler Room buyout means for the scene, how Resident Advisor reached 25 and where listening is growing.",
    ],
    pillar: "underground-dj-economics-data",
    posts: [
      "dj-fees-underground-promoters-squeeze-2026",
      "brexit-touring-uk-dj-eu-festivals-2026",
      "boiler-room-kkr-boycott",
      "ticketmaster-live-nation-doj-verdict",
      "resident-advisor-25th-anniversary",
      "electronic-music-fastest-growing-genre-us",
      "yougov-britons-listening-more-music-2026",
      "gta-vi-soundtrack-house-artists",
      "rtsfm-archive-data-2009-golden-era",
    ],
  },
  {
    slug: "club-guides-by-city",
    name: "Club guides by city",
    title: "Club Guides by City: Amsterdam, London, Detroit and More",
    description:
      "Dated guides to underground clubbing in Amsterdam, London, Detroit, Berlin, Spain, Ibiza, Singapore, Moscow and beyond, with venue status checked.",
    intro: [
      "Each guide here is dated and checks whether venues are actually open, because club listings go stale faster than almost any other kind of travel content. Where a city has a bigger story (Berlin, Ibiza, Moscow), the guide links to the reporting behind it.",
    ],
    pillar: "clubbing-in-spain-city-guide-2026",
    posts: [
      "best-amsterdam-clubs-2026-guide",
      "best-london-clubs-2026-guide",
      "detroit-techno-guide-2026-clubs-labels-history",
      "ibiza-closing-parties-2026",
      "ibiza-anti-tourism-protest-cala-saladeta",
      "singapore-underground-electronic-music-scene-guide-2026",
      "russian-club-scene-since-2022-outline-signal-mutabor",
      "shkedul-moscow-rndm-24-october-2026",
      "belgian-techno-djs-scene-history-women",
      "rominimal-history-romanian-minimal-techno",
    ],
    also: ["best-berlin-clubs-2026-guide"],
  },
  {
    slug: "burning-man",
    name: "Burning Man",
    title: "Burning Man 2026: Guides, Deaths, Dust Storms and Camps",
    description:
      "Burning Man 2026 coverage: what it is, the gate closures and weather, the deaths and what officials said, sound camps and the commercialisation row.",
    intro: [
      "Burning Man 2026 produced more news than most festivals manage in a decade: two weather shutdowns, deaths, a celebrity backlash and the usual argument about decommodification. This hub starts with the explainer and then follows each story.",
    ],
    pillar: "what-is-burning-man-2026-guide",
    posts: [
      "wet-playa-protocol-burning-man-2026-gate-closures",
      "burning-man-2026-death-medical-emergency",
      "burning-man-2026-bethenny-frankel-decommodification",
      "burning-man-2026-diplo-deja-vu",
      "burning-man-2026-sound-camps-art-cars",
      "burning-man-2026-livestream-webcam-dashboard",
      "burning-man-2026-decorated-porta-potties",
    ],
  },
  {
    slug: "nina-kraviz",
    name: "Nina Kraviz",
    title: "Nina Kraviz 2026: Tour, Label, Ibiza and Poll History",
    description:
      "Everything RTS.FM has published on Nina Kraviz in 2026: the world tour dates, the Treats label, her Amnesia Ibiza residency and her DJ Mag poll history.",
    intro: [
      "Nina Kraviz's 2026 has been a year of expansion: a new label, an Ibiza residency, a world tour and a long-running presence in DJ Mag's poll. The recap below is the best entry point, with the detail pieces underneath.",
    ],
    pillar: "nina-kraviz-2026-recap",
    posts: [
      "nina-kraviz-2026-world-tour-dates",
      "nina-kraviz-amnesia-ibiza-pyramid-residency",
      "nina-kraviz-treats-label-brazilian-funk",
      "nina-kraviz-jeff-mills-fabric-junction-2",
      "nina-kraviz-dj-mag-top-100-2026-poll",
    ],
    links: [{ href: "/artists/nina-kraviz", label: "Nina Kraviz artist profile" }],
  },
  {
    slug: "gear-and-production-tech",
    name: "Gear and production tech",
    title: "DJ Gear and Production Tech: News and Buyer's Guides",
    description:
      "Gear news and guides for DJs: Teenage Engineering's synth exit, Native Instruments' sale to inMusic, Ableton at 25 and 2026 standalone DJ systems.",
    intro: [
      "Gear coverage on RTS.FM concentrates on decisions with consequences: which companies are leaving which markets, who now owns the software DJs rely on and which standalone systems are worth buying.",
    ],
    pillar: "teenage-engineering-stop-making-synthesizers",
    posts: [
      "alphatheta-djm-a7-four-channel-mixer",
      "native-instruments-inmusic-traktor-what-happens-next",
      "best-standalone-dj-systems-2026",
      "ableton-25-years-independence-gerhard-behles",
    ],
    also: ["ai-stem-separation-dj-tools"],
  },
  {
    slug: "genres-and-sound",
    name: "Genres, tempo and sound",
    title: "Techno Genres, BPM and Sound: Explainers and Lists",
    description:
      "How electronic music sounds: techno BPM ranges, whether techno is getting faster, hard techno's US boom and the best albums of 2026.",
    intro: [
      "Questions about genre are usually questions about tempo, texture and history. These explainers answer the ones readers ask most, with the data behind them, and the album lists show where the music is heading this year.",
    ],
    pillar: "what-bpm-is-techno-tempo-by-genre",
    posts: [
      "is-techno-getting-faster-bpm-data",
      "hard-techno-american-boom",
      "best-techno-albums-summer-2026",
      "best-ambient-albums-2026",
    ],
  },
  {
    slug: "artist-news-and-legacy",
    name: "Artist news and legacy",
    title: "Techno Artist News, Obituaries and Legacy Stories",
    description:
      "Artist news and legacy: Juan Atkins' death, Harvey McKay's memory, Boris Brejcha's retirement, Jarre at 50 years of Oxygene, reunions and rows.",
    intro: [
      "Artist stories are where the scene's history turns into news: deaths, retirements, reunions and public disagreements. Each piece below is sourced to the original reporting and links to the artist's RTS.FM profile.",
    ],
    pillar: "juan-atkins-dies-detroit-techno-pioneer",
    posts: [
      "remembering-harvey-mckay",
      "boris-brejcha-retirement-2028-joker-career-story",
      "jean-michel-jarre-oxygene-50-years-ade",
      "roni-size-deepest-rave-welsh-mine",
      "noisia-reunion-2026",
      "amelie-lens-charlotte-de-witte-one-mind",
      "sven-vath-anyma-clowns-comment-dj-culture",
    ],
    links: [{ href: "/artists", label: "All artist profiles" }],
  },
];

export function getTopic(slug: string): Topic | undefined {
  return TOPICS.find((t) => t.slug === slug);
}

export function getTopicSlugs(): string[] {
  return TOPICS.map((t) => t.slug);
}

// The topic a post is homed in, if any.
export function getTopicForPost(postSlug: string): Topic | undefined {
  return TOPICS.find((t) => t.pillar === postSlug || t.posts.includes(postSlug));
}

export type TopicPosts = {
  pillar?: PostMeta;
  posts: PostMeta[];
  also: PostMeta[];
};

// Resolves slugs to post metadata. Unknown slugs are skipped here; a separate
// check (scripts or tests) is the place to fail on typos.
export function getTopicPosts(topic: Topic): TopicPosts {
  const all = new Map(getAllPosts().map((p) => [p.slug, p]));
  const pick = (slugs: string[]) =>
    slugs.map((s) => all.get(s)).filter((p): p is PostMeta => !!p);
  return {
    pillar: all.get(topic.pillar),
    posts: pick(topic.posts),
    also: pick(topic.also ?? []),
  };
}

// Posts that belong to no topic yet. Used to keep the hub list complete.
export function getUnassignedPosts(): PostMeta[] {
  return getAllPosts().filter((p) => !getTopicForPost(p.slug));
}
