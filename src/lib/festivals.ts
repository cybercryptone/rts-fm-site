import { formatDateRange } from "./format";

export type FestivalDateStatus = "confirmed" | "estimated" | "tba";

// Only set this when actually verified against the vendor; absence just
// means "no live on-sale to report," not "sold out." Never guess.
export type TicketStatus = "open" | "sold-out";

export type Region = "Europe" | "Americas" | "Asia" | "Other";

export type Festival = {
  slug: string;
  name: string;
  city: string;
  country: string;
  // Real city-level coordinates (verified against public sources), used
  // only for the abstract radar map projection, never for driving
  // directions or precise venue location.
  lat: number;
  lon: number;
  // Bare "YYYY-MM-DD", same convention as blog frontmatter dates. Multi-day
  // festivals set both; single-day events set endDate = startDate.
  startDate?: string;
  endDate?: string;
  dateStatus: FestivalDateStatus;
  genres: string[];
  website: string;
  // Absent, never fabricated, if no live on-sale exists yet.
  ticketUrl?: string;
  // Only set when verified against the vendor (see TicketStatus above).
  ticketStatus?: TicketStatus;
  // The real, current lowest-tier ticket price at the vendor, only set
  // when the vendor's own page shows one unambiguous number (a genuine
  // full-festival pass, or a clearly single-priced ticket type). Many of
  // these festivals sell multi-tier or per-show tickets with no one price
  // that honestly represents "the" cost of attending, or show nothing at
  // all (presale-only, external vendor with no visible price, a payment
  // plan's deposit rather than the real price) — leave both fields unset
  // rather than guess or use a misleading number. Expect this to go stale
  // as tiers sell through; re-check alongside dates/links.
  ticketPrice?: number;
  ticketPriceCurrency?: string;
  description: string;
  image?: string;
  imageAlt?: string;
  imageCredit?: string;
};

// A narrow, editorially curated list of major underground house/techno
// festivals, not an aggregator. A stale public events list (wrong dates,
// dead ticket links) erodes trust worse than not having the page at all,
// which is why this stays small and gets reviewed periodically rather than
// growing without bound. Every entry needs a real, verified official site
// and ticket link (or an honest dateStatus) before it ships. Verified
// 2026-09-27; re-check dates and links each time this list is revisited.
export const FESTIVALS: Festival[] = [
  {
    slug: "ctm-festival",
    name: "CTM Festival",
    city: "Berlin",
    country: "Germany",
    lat: 52.52,
    lon: 13.405,
    startDate: "2027-01-22",
    endDate: "2027-01-31",
    dateStatus: "confirmed",
    genres: ["experimental", "electronic"],
    website: "https://www.ctm-festival.de",
    ticketUrl: "https://www.ctm-festival.de/festival-2027/tickets",
    ticketPrice: 195,
    ticketPriceCurrency: "EUR",
    description:
      "A ten-day festival for adventurous club music and sound art spread across venues including Berghain and Radialsystem, running every January since 1999.",
    image: "https://rts.fm/images/commons/ctm-festival-berghain-facade.jpg",
    imageAlt: "Facade of Berghain, the Berlin club that hosts part of CTM Festival's January programming.",
    imageCredit: "Photo by Jane Mejdahl, CC BY-SA 2.0, via Wikimedia Commons.",
  },
  {
    slug: "dgtl-amsterdam",
    name: "DGTL Amsterdam",
    city: "Amsterdam",
    country: "Netherlands",
    lat: 52.3676,
    lon: 4.9041,
    startDate: "2027-03-26",
    endDate: "2027-03-28",
    dateStatus: "confirmed",
    genres: ["techno", "house"],
    website: "https://dgtl-festival.com/en/dgtl-amsterdam/",
    description:
      "A sustainability-minded techno and house festival at NDSM Docklands that opens Amsterdam's festival calendar every spring.",
    image: "https://rts.fm/images/commons/dgtl-amsterdam-ndsm-plein.jpg",
    imageAlt: "NDSM-plein in Amsterdam-Noord, the former shipyard docklands where DGTL Amsterdam is held.",
    imageCredit: "Photo by Ceescamel, CC BY-SA 4.0, via Wikimedia Commons.",
  },
  {
    slug: "time-warp",
    name: "Time Warp",
    city: "Mannheim",
    country: "Germany",
    lat: 49.4875,
    lon: 8.466,
    startDate: "2027-04-03",
    endDate: "2027-04-03",
    dateStatus: "confirmed",
    genres: ["techno", "house"],
    website: "https://www.time-warp.de",
    ticketUrl: "https://www.time-warp.de/tickets/",
    description:
      "A single 19-hour night across five stages in Mannheim, the German original behind the Time Warp name now licensed to editions worldwide.",
    image: "https://rts.fm/images/commons/time-warp-maimarkt-entrance.jpg",
    imageAlt: "Main entrance to Mannheim's Maimarkt fairground, home to the Maimarkthalle where Time Warp's German edition is held.",
    imageCredit: "Photo by Radosław Drożdżewski, CC BY-SA 4.0, via Wikimedia Commons.",
  },
  {
    slug: "sonar",
    name: "Sonar Barcelona",
    city: "Barcelona",
    country: "Spain",
    lat: 41.3851,
    lon: 2.1734,
    startDate: "2027-06-17",
    endDate: "2027-06-19",
    dateStatus: "confirmed",
    genres: ["electronic", "techno", "experimental"],
    website: "https://sonar.es",
    ticketUrl: "https://sonar.es/en/tickets",
    ticketPrice: 49,
    ticketPriceCurrency: "EUR",
    description:
      "Barcelona's festival for advanced electronic music and digital art since 1994, split across day and night programs.",
    image: "https://rts.fm/images/commons/sonar-sonar-by-day-2016.jpg",
    imageAlt: "Crowd at Sonar by Day 2016, with the Palau Nacional visible behind the stages at Fira Montjuic, Barcelona.",
    imageCredit: "Photo by Nachetere, CC BY-SA 4.0, via Wikimedia Commons.",
  },
  {
    slug: "sea-you-festival",
    name: "Sea You Festival",
    city: "Freiburg",
    country: "Germany",
    lat: 47.999,
    lon: 7.8421,
    startDate: "2027-07-16",
    endDate: "2027-07-18",
    dateStatus: "confirmed",
    genres: ["house", "techno"],
    website: "https://www.seayou-festival.de",
    ticketUrl: "https://shop.seayou-festival.de/festivaltickets?language=en_EN",
    ticketPrice: 79.99,
    ticketPriceCurrency: "EUR",
    description:
      "A house and techno festival built around swimming and dancing at a lake outside Freiburg, six stages over a July weekend.",
    image: "https://rts.fm/images/commons/sea-you-tunisee-lake.jpg",
    imageAlt: "Aerial view of the Tunisee lake outside Freiburg im Breisgau, Germany.",
    imageCredit: "Photo by Norbert Blau, CC BY-SA 3.0, via Wikimedia Commons.",
  },
  {
    slug: "kappa-futurfestival",
    name: "Kappa FuturFestival",
    city: "Turin",
    country: "Italy",
    lat: 45.0703,
    lon: 7.6869,
    startDate: "2027-07-02",
    endDate: "2027-07-04",
    dateStatus: "confirmed",
    genres: ["techno", "house"],
    website: "https://www.kappafuturfestival.it",
    ticketUrl: "https://www.kappafuturfestival.it/en/tickets",
    ticketStatus: "sold-out",
    description:
      "A three-day techno and house festival in Turin's Parco Dora, built around a former steel plant, regularly among Europe's earliest sellouts.",
    image: "https://rts.fm/images/commons/kappa-parco-dora-vitali-area.jpg",
    imageAlt: "The orange industrial support towers of Parco Dora's Vitali lot in Turin, the site of Kappa FuturFestival.",
    imageCredit: "Photo by Pmk58, CC BY-SA 4.0, via Wikimedia Commons.",
  },
  {
    slug: "awakenings-festival",
    name: "Awakenings Festival",
    city: "Hilvarenbeek",
    country: "Netherlands",
    lat: 51.4858,
    lon: 5.1375,
    startDate: "2027-07-09",
    endDate: "2027-07-11",
    dateStatus: "confirmed",
    genres: ["techno"],
    website: "https://www.awakenings.com",
    ticketUrl: "https://www.awakenings.com/en/tickets/",
    // Unlike the other ticketPrice entries in this file, this one isn't
    // confirmed on awakenings.com's own pages directly (its real price is
    // rendered client-side at checkout, past what a fetch can see).
    // Sourced instead from several independent third-party listings
    // (~79.95 EUR for a day ticket), rounded to a "from" figure per an
    // explicit editorial call; re-verify against the vendor directly if
    // revisited.
    ticketPrice: 80,
    ticketPriceCurrency: "EUR",
    description:
      "The Dutch techno institution's summer festival, marking its 30th anniversary edition in 2027 after growing out of Amsterdam's early-90s rave scene.",
    image: "https://rts.fm/images/commons/awakenings-festival-gashouder-westergasfabriek.jpg",
    imageAlt: "The Gashouder, the domed former gas holder at Amsterdam's Westergasfabriek, the original home of Awakenings.",
    imageCredit: "Photo by Bert van As / Rijksdienst voor het Cultureel Erfgoed, CC BY-SA 4.0, via Wikimedia Commons.",
  },
  {
    slug: "nachtdigital",
    name: "Nachtdigital",
    city: "Leipzig",
    country: "Germany",
    lat: 51.3397,
    lon: 12.3731,
    startDate: "2027-07-30",
    endDate: "2027-08-01",
    dateStatus: "confirmed",
    genres: ["techno", "house", "minimal"],
    website: "https://nachtdigital.de",
    ticketUrl: "https://nachtdigital.de/en/tickets",
    description:
      "A small, long-running techno and house gathering at a bungalow village outside Leipzig, known for a deliberately intimate, non-commercial setup.",
    image: "https://rts.fm/images/commons/nachtdigital-bungalowdorf-olganitz-2014.jpg",
    imageAlt: "A DJ performing at Nachtdigital festival at Bungalowdorf Olganitz in 2014.",
    imageCredit: "Photo by Robert Richter, CC BY 2.0, via Wikimedia Commons.",
  },
  {
    slug: "dekmantel-festival",
    name: "Dekmantel Festival",
    city: "Amsterdam",
    country: "Netherlands",
    lat: 52.3676,
    lon: 4.9041,
    startDate: "2027-07-30",
    endDate: "2027-08-01",
    dateStatus: "estimated",
    genres: ["techno", "house", "disco"],
    website: "https://dekmantelfestival.com",
    ticketUrl: "https://tickets.dekmantelfestival.com/7f76d13927a5443ca54ccd3c143f3a3b/",
    description:
      "The Amsterdam label's own festival in the Amsterdamse Bos, four days of deliberately eclectic house, techno and disco booking across forest stages.",
    image: "https://rts.fm/images/commons/dekmantel-festival-amsterdamse-bos-heuvel.jpg",
    imageAlt: "A wooded clearing in the Amsterdamse Bos, the Amsterdam park that has hosted Dekmantel Festival since 2013.",
    imageCredit: "Photo by Shirley de Jong, CC BY-SA 3.0, via Wikimedia Commons.",
  },
  {
    slug: "garbicz-festival",
    name: "Garbicz Festival",
    city: "Torzym",
    country: "Poland",
    lat: 52.3128,
    lon: 15.0778,
    startDate: "2027-07-29",
    endDate: "2027-08-02",
    dateStatus: "confirmed",
    genres: ["techno", "house", "experimental"],
    website: "https://garbiczfestival.com",
    ticketUrl: "https://garbiczfestival.com",
    description:
      "A five-day, artist-built festival on a lake in rural western Poland, run since 2012 on a deliberately anti-commercial, community-organized model.",
    image: "https://rts.fm/images/commons/garbicz-festival-lake-wielicko-aerial.jpg",
    imageAlt: "Aerial view of Lake Wielicko at Garbicz village, Poland, where Garbicz Festival is held.",
    imageCredit: "Photo by Łukasz Świerczewski, CC BY-SA 4.0, via Wikimedia Commons.",
  },
  {
    slug: "movement-detroit",
    name: "Movement",
    city: "Detroit",
    country: "United States",
    lat: 42.3314,
    lon: -83.0458,
    startDate: "2027-05-29",
    endDate: "2027-05-31",
    dateStatus: "confirmed",
    genres: ["techno", "house"],
    website: "https://movementfestival.com",
    ticketUrl: "https://movementfestival.com",
    description:
      "Detroit's own Memorial Day Weekend techno festival at Hart Plaza, the direct descendant of the 2000 Detroit Electronic Music Festival in the genre's birthplace.",
    image: "https://rts.fm/images/commons/Detroit_Electronic_Music_Festival_2002_main_stage_after_dark.jpg",
    imageAlt: "The main stage and crowd after dark at the 2002 Detroit Electronic Music Festival, Movement's direct predecessor.",
    imageCredit: "Photo by Myself248, CC BY-SA 4.0, via Wikimedia Commons.",
  },
  {
    slug: "berlin-atonal",
    name: "Berlin Atonal",
    city: "Berlin",
    country: "Germany",
    lat: 52.52,
    lon: 13.405,
    startDate: "2027-08-25",
    endDate: "2027-08-29",
    dateStatus: "confirmed",
    genres: ["experimental", "techno", "industrial"],
    website: "https://berlin-atonal.com",
    ticketUrl: "https://berlin-atonal.com",
    description:
      "A biennial festival for experimental sound and audiovisual work inside Kraftwerk Berlin's former power plant, tracing back to the West Berlin underground of 1982.",
    image: "https://rts.fm/images/commons/berlin-atonal-kraftwerk-interior.jpg",
    imageAlt: "Concrete pillars and turbine hall interior of Kraftwerk Berlin, lit for an event.",
    imageCredit: "Photo by MakeMagazinDE, CC BY-SA 4.0, via Wikimedia Commons.",
  },
  {
    slug: "draaimolen",
    name: "Draaimolen",
    city: "Oisterwijk",
    country: "Netherlands",
    lat: 51.583,
    lon: 5.2,
    startDate: "2027-09-03",
    endDate: "2027-09-04",
    dateStatus: "estimated",
    genres: ["techno", "minimal"],
    website: "https://www.draaimolen.nu",
    description:
      "An independent techno festival on a Brabant campsite built around art, nature and a deliberately non-commercial lineup policy; 2027 dates not yet announced.",
    image: "https://rts.fm/images/commons/draaimolen-oisterwijkse-bossen-forest.jpg",
    imageAlt: "Forest path in the Oisterwijkse Bossen en Vennen nature reserve near Oisterwijk, Netherlands.",
    imageCredit: "Photo by Klankbeeld, CC BY-SA 4.0, via Wikimedia Commons.",
  },
  {
    slug: "junction-2",
    name: "Junction 2",
    city: "London",
    country: "United Kingdom",
    lat: 51.5072,
    lon: -0.1276,
    dateStatus: "tba",
    genres: ["techno", "house"],
    website: "https://www.junction2.london",
    description:
      "London's own underground house and techno festival at Boston Manor Park, running since 2016 with stages ranging from woodland floors to a rave under the M4 flyover.",
    image: "https://rts.fm/images/commons/junction-2-m4-flyover-boston-manor-park.jpg",
    imageAlt: "The underside of the M4 flyover as it crosses Boston Manor Park in Brentford, London, the site of Junction 2's Bridge stage.",
    imageCredit: "Photo by Ethan Doyle White, CC BY-SA 4.0, via Wikimedia Commons.",
  },
];

// Undated ("tba") entries stay listed at the end of "upcoming" rather than
// dropping off, since they're often still worth knowing about.
export function isUpcoming(festival: Festival): boolean {
  if (!festival.endDate) return true;
  return new Date(festival.endDate) >= new Date(new Date().toDateString());
}

export function getUpcomingFestivals(): Festival[] {
  return FESTIVALS.filter(isUpcoming).sort((a, b) => {
    if (!a.startDate && !b.startDate) return a.name.localeCompare(b.name);
    if (!a.startDate) return 1;
    if (!b.startDate) return -1;
    return a.startDate.localeCompare(b.startDate);
  });
}

export function getPastFestivals(): Festival[] {
  return FESTIVALS.filter((f) => !isUpcoming(f)).sort((a, b) =>
    (b.startDate ?? "").localeCompare(a.startDate ?? ""),
  );
}

export function getFestivalBySlug(slug: string): Festival | null {
  return FESTIVALS.find((f) => f.slug === slug) ?? null;
}

// Country -> region, for the filter toolbar. New countries default to
// "Other" rather than silently miscategorized into a region they aren't in.
const EUROPE = new Set([
  "Germany",
  "Netherlands",
  "Italy",
  "Spain",
  "Poland",
  "United Kingdom",
]);
const AMERICAS = new Set(["United States", "Canada", "Mexico", "Brazil", "Argentina", "Chile"]);
const ASIA = new Set(["Japan", "South Korea", "China", "Thailand", "Indonesia"]);

export function regionOf(country: string): Region {
  if (EUROPE.has(country)) return "Europe";
  if (AMERICAS.has(country)) return "Americas";
  if (ASIA.has(country)) return "Asia";
  return "Other";
}

// Real, derived from the festival's own dates, never a fabricated "lineup
// size" or "capacity" figure we haven't verified.
export function festivalDurationDays(festival: Festival): number | null {
  if (!festival.startDate || !festival.endDate) return null;
  const ms = new Date(festival.endDate).getTime() - new Date(festival.startDate).getTime();
  return Math.round(ms / 86_400_000) + 1;
}

export function festivalDateLabel(festival: Festival): string {
  if (festival.dateStatus === "tba" || !festival.startDate || !festival.endDate) {
    return "Dates TBA";
  }
  const range = formatDateRange(festival.startDate, festival.endDate);
  return festival.dateStatus === "estimated" ? `${range} (est., unconfirmed)` : range;
}
