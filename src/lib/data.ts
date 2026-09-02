export const SITE = {
  name: "RTS.FM",
  tagline: "Online Underground Radio",
  description:
    "RTS.FM is an independent underground internet radio and record label broadcasting live audio-visual DJ sets since 2006 — tech house, minimal house, minimal techno, electronica.",
  founded: 2006,
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://rts-fm-site.onrender.com",
};

// The show's SoundCloud RSS feed — same one submitted to Apple Podcasts.
export const FEED_URL =
  "https://feeds.soundcloud.com/users/soundcloud:users:1302198/sounds.rss";

// Real numbers, not genre words — shown as the hero stat chips.
export const STATS = [
  "3.8K Sets Archived",
  "10,640,365 Views",
  "30+ Studios Worldwide",
  "38K Followers",
];

// Cities RTS.FM has broadcast live sets from, verified via the YouTube
// channel archive (@rts_fm). Montreal, Toronto and Buenos Aires stand in
// for Wikipedia's country-level "Canada and Argentina" studio-expansion
// mentions, kept city-level for consistency with the rest of the list.
export const CITIES = [
  "Saint Petersburg",
  "Kazan",
  "Lausanne",
  "Budapest",
  "Mexico City",
  "Cali",
  "Montreal",
  "Toronto",
  "Buenos Aires",
];

export const SOCIALS = [
  { label: "Telegram", href: "https://t.me/rtsfm" },
  { label: "Instagram", href: "https://www.instagram.com/rts.fm/" },
  { label: "Label IG", href: "https://www.instagram.com/rts.fm.label/" },
  { label: "Bandcamp", href: "https://rtsfm.bandcamp.com/" },
  { label: "SoundCloud", href: "https://soundcloud.com/rtsfm" },
  { label: "Facebook", href: "https://www.facebook.com/rtsfm/" },
];

export type Release = {
  cat: string;
  artist: string;
  title?: string;
  href: string;
  cover: string;
};

// Sourced from the RTS.FM Label Bandcamp catalog (rtsfm.bandcamp.com) —
// cover art and release links pulled directly from Bandcamp's own CDN.
export const RELEASES: Release[] = [
  { cat: "RTSFM018", artist: "Fedu", href: "https://rtsfm.bandcamp.com/album/rtsfm018", cover: "https://f4.bcbits.com/img/a0081594063_2.jpg" },
  { cat: "RTSFM017", artist: "Sapurra", href: "https://rtsfm.bandcamp.com/album/rtsfm017", cover: "https://f4.bcbits.com/img/a1605483395_2.jpg" },
  { cat: "RTSFM016", artist: "RamouQ", href: "https://rtsfm.bandcamp.com/album/rtsfm016", cover: "https://f4.bcbits.com/img/a1385435090_2.jpg" },
  { cat: "RTSFM015", artist: "Ilya Schulz", href: "https://rtsfm.bandcamp.com/album/rtsfm015", cover: "https://f4.bcbits.com/img/a4286716754_2.jpg" },
  { cat: "RTSFM014", artist: "Hugobeat", href: "https://rtsfm.bandcamp.com/album/rtsfm014", cover: "https://f4.bcbits.com/img/a3929355267_2.jpg" },
  { cat: "RTSFM013", artist: "Type B.", href: "https://rtsfm.bandcamp.com/album/rtsfm013", cover: "https://f4.bcbits.com/img/a2774663810_2.jpg" },
  { cat: "RTSFM012", artist: "Soultape", title: "The Last Universe", href: "https://rtsfm.bandcamp.com/album/the-last-universe", cover: "https://f4.bcbits.com/img/a2643265777_2.jpg" },
  { cat: "RTSFM011", artist: "Victor Polo, Genning, Nemec, Nicolas Barnes", href: "https://rtsfm.bandcamp.com/album/rtsfm011", cover: "https://f4.bcbits.com/img/a1770659258_2.jpg" },
  { cat: "RTSFM010", artist: "Lukea", href: "https://rtsfm.bandcamp.com/album/lukea-rtsfm010", cover: "https://f4.bcbits.com/img/a2150236175_2.jpg" },
  { cat: "RTSFM009", artist: "Nicolas Barnes", href: "https://rtsfm.bandcamp.com/album/rtsfm009", cover: "https://f4.bcbits.com/img/a2331885106_2.jpg" },
  { cat: "RTSFM008", artist: "Nemec", href: "https://rtsfm.bandcamp.com/album/rtsfm008", cover: "https://f4.bcbits.com/img/a0774173274_2.jpg" },
  { cat: "RTSFM007", artist: "V/A", href: "https://rtsfm.bandcamp.com/album/rtsfm007", cover: "https://f4.bcbits.com/img/a2960170766_2.jpg" },
  { cat: "RTSFM006", artist: "Bottene", href: "https://rtsfm.bandcamp.com/album/rtsfm006", cover: "https://f4.bcbits.com/img/a1400923072_2.jpg" },
  { cat: "RTSFM005", artist: "Bvoice", href: "https://rtsfm.bandcamp.com/album/rtsfm005", cover: "https://f4.bcbits.com/img/a1063370490_2.jpg" },
  { cat: "RTSFM004", artist: "Mountax", href: "https://rtsfm.bandcamp.com/album/rtsfm004", cover: "https://f4.bcbits.com/img/a1041147889_2.jpg" },
  { cat: "RTSFM003", artist: "Victor Polo", href: "https://rtsfm.bandcamp.com/album/rtsfm003", cover: "https://f4.bcbits.com/img/a3464288592_2.jpg" },
  { cat: "RTSFM002", artist: "Genning", href: "https://rtsfm.bandcamp.com/album/genning-rtsfm002", cover: "https://f4.bcbits.com/img/a3367125258_2.jpg" },
  { cat: "RTSFM001", artist: "JHNS", title: "Avantgarde EP", href: "https://rtsfm.bandcamp.com/album/rtsfm001", cover: "https://f4.bcbits.com/img/a2096752116_2.jpg" },
];

export type ArchiveSet = {
  artist: string;
  context: string;
  date: string;
  views: string;
  duration: string;
  videoId: string;
};

// Most-viewed sets from the RTS.FM YouTube archive (@rts_fm, 3.8k videos,
// live since 2008) — titles, dates, view counts, durations and video IDs are
// real, pulled directly from the channel's "Popular" tab.
export const ARCHIVE_SETS: ArchiveSet[] = [
  { artist: "Nina Kraviz", context: "RTS.FM", date: "31.10.2009", views: "1M", duration: "1:04:17", videoId: "6kFCMum8nkM" },
  { artist: "Motor City Drum Ensemble", context: "RTS.FM SPB Studio", date: "24.10.2009", views: "185K", duration: "1:09:14", videoId: "UxYhwRA2HrE" },
  { artist: "Kevin Yost", context: "RTS.FM Studio", date: "03.05.2009", views: "176K", duration: "1:11:47", videoId: "_VYggjoRb4o" },
  { artist: "Okain", context: "RTS.FM Budapest", date: "24.09.2016", views: "172K", duration: "1:14:40", videoId: "4L45jvmvYSQ" },
  { artist: "Shonky", context: "RTS.FM", date: "11.11.2011", views: "127K", duration: "1:28:15", videoId: "vHBFYwxsKEc" },
  { artist: "Dirty Doering", context: "Bar25 Showcase @ RTS.FM", date: "21.10.2010", views: "120K", duration: "1:30:23", videoId: "m4FQW9CVqv0" },
  { artist: "Kalabrese", context: "RTS.FM", date: "01.12.2010", views: "112K", duration: "1:29:16", videoId: "fKQnvko_JF0" },
  { artist: "Terry Lee Brown Jr.", context: "RTS.FM", date: "04.11.2010", views: "107K", duration: "1:34:46", videoId: "ij_NZzClgHY" },
  { artist: "Rick Wade", context: "RTS.FM Studio", date: "12.12.2008", views: "97K", duration: "1:23:51", videoId: "Y0pXuLSjXY8" },
  { artist: "Tom Middleton", context: "RTS.FM SPB Studio", date: "01.11.2009", views: "93K", duration: "1:18:34", videoId: "RsqMVonbVbs" },
  { artist: "Anton Kubikov", context: "RTS.FM", date: "05.04.2009", views: "92K", duration: "1:37:41", videoId: "ShmIdhv-YFY" },
  { artist: "Jus-Ed", context: "RTS.FM", date: "10.04.2009", views: "91K", duration: "1:06:53", videoId: "QShTvaXq15M" },
  { artist: "James Dexter", context: "RTS.FM Budapest", date: "08.12.2017", views: "84K", duration: "1:31:28", videoId: "a8vM58i91x0" },
  { artist: "Marek Hemmann", context: "RTS.FM Studio", date: "05.06.2009", views: "83K", duration: "1:07:24", videoId: "BZYil1c4Gy0" },
];

export function youtubeWatchUrl(set: ArchiveSet) {
  return `https://www.youtube.com/watch?v=${set.videoId}`;
}

export function youtubeThumbnail(set: ArchiveSet) {
  return `https://i.ytimg.com/vi/${set.videoId}/hqdefault.jpg`;
}
