export type FestivalDateStatus = "confirmed" | "estimated" | "tba";

export type Festival = {
  slug: string;
  name: string;
  city: string;
  country: string;
  // Bare "YYYY-MM-DD", same convention as blog frontmatter dates. Multi-day
  // festivals set both; single-day events set endDate = startDate.
  startDate?: string;
  endDate?: string;
  dateStatus: FestivalDateStatus;
  genres: string[];
  website: string;
  // Absent, never fabricated, if no live on-sale exists yet.
  ticketUrl?: string;
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
    startDate: "2027-01-22",
    endDate: "2027-01-31",
    dateStatus: "confirmed",
    genres: ["experimental", "electronic"],
    website: "https://www.ctm-festival.de",
    ticketUrl: "https://www.ctm-festival.de/festival-2027/tickets",
    description:
      "A ten-day festival for adventurous club music and sound art spread across venues including Berghain and Radialsystem, running every January since 1999.",
  },
  {
    slug: "dgtl-amsterdam",
    name: "DGTL Amsterdam",
    city: "Amsterdam",
    country: "Netherlands",
    startDate: "2027-03-26",
    endDate: "2027-03-28",
    dateStatus: "confirmed",
    genres: ["techno", "house"],
    website: "https://dgtl-festival.com/en/dgtl-amsterdam/",
    description:
      "A sustainability-minded techno and house festival at NDSM Docklands that opens Amsterdam's festival calendar every spring.",
  },
  {
    slug: "time-warp",
    name: "Time Warp",
    city: "Mannheim",
    country: "Germany",
    startDate: "2027-04-03",
    endDate: "2027-04-03",
    dateStatus: "confirmed",
    genres: ["techno", "house"],
    website: "https://www.time-warp.de",
    ticketUrl: "https://www.time-warp.de/tickets/",
    description:
      "A single 19-hour night across five stages in Mannheim, the German original behind the Time Warp name now licensed to editions worldwide.",
  },
  {
    slug: "sonar",
    name: "Sonar Barcelona",
    city: "Barcelona",
    country: "Spain",
    startDate: "2027-06-17",
    endDate: "2027-06-19",
    dateStatus: "confirmed",
    genres: ["electronic", "techno", "experimental"],
    website: "https://sonar.es",
    ticketUrl: "https://sonar.es/en/tickets",
    description:
      "Barcelona's festival for advanced electronic music and digital art since 1994, split across day and night programs.",
  },
  {
    slug: "sea-you-festival",
    name: "Sea You Festival",
    city: "Freiburg",
    country: "Germany",
    startDate: "2027-07-16",
    endDate: "2027-07-18",
    dateStatus: "confirmed",
    genres: ["house", "techno"],
    website: "https://www.seayou-festival.de",
    ticketUrl: "https://shop.seayou-festival.de/festivaltickets?language=en_EN",
    description:
      "A house and techno festival built around swimming and dancing at a lake outside Freiburg, six stages over a July weekend.",
  },
  {
    slug: "kappa-futurfestival",
    name: "Kappa FuturFestival",
    city: "Turin",
    country: "Italy",
    startDate: "2027-07-02",
    endDate: "2027-07-04",
    dateStatus: "confirmed",
    genres: ["techno", "house"],
    website: "https://www.kappafuturfestival.it",
    ticketUrl: "https://www.kappafuturfestival.it/en/tickets",
    description:
      "A three-day techno and house festival in Turin's Parco Dora, built around a former steel plant, regularly among Europe's earliest sellouts.",
  },
  {
    slug: "awakenings-festival",
    name: "Awakenings Festival",
    city: "Hilvarenbeek",
    country: "Netherlands",
    startDate: "2027-07-09",
    endDate: "2027-07-11",
    dateStatus: "confirmed",
    genres: ["techno"],
    website: "https://www.awakenings.com",
    ticketUrl: "https://www.awakenings.com/en/tickets/",
    description:
      "The Dutch techno institution's summer festival, marking its 30th anniversary edition in 2027 after growing out of Amsterdam's early-90s rave scene.",
  },
  {
    slug: "nachtdigital",
    name: "Nachtdigital",
    city: "Leipzig",
    country: "Germany",
    startDate: "2027-07-30",
    endDate: "2027-08-01",
    dateStatus: "confirmed",
    genres: ["techno", "house", "minimal"],
    website: "https://nachtdigital.de",
    ticketUrl: "https://nachtdigital.de/en/tickets",
    description:
      "A small, long-running techno and house gathering at a bungalow village outside Leipzig, known for a deliberately intimate, non-commercial setup.",
  },
  {
    slug: "dekmantel-festival",
    name: "Dekmantel Festival",
    city: "Amsterdam",
    country: "Netherlands",
    startDate: "2027-07-30",
    endDate: "2027-08-01",
    dateStatus: "estimated",
    genres: ["techno", "house", "disco"],
    website: "https://dekmantelfestival.com",
    ticketUrl: "https://tickets.dekmantelfestival.com/7f76d13927a5443ca54ccd3c143f3a3b/",
    description:
      "The Amsterdam label's own festival in the Amsterdamse Bos, four days of deliberately eclectic house, techno and disco booking across forest stages.",
  },
  {
    slug: "garbicz-festival",
    name: "Garbicz Festival",
    city: "Torzym",
    country: "Poland",
    startDate: "2027-07-29",
    endDate: "2027-08-02",
    dateStatus: "confirmed",
    genres: ["techno", "house", "experimental"],
    website: "https://garbiczfestival.com",
    ticketUrl: "https://garbiczfestival.com",
    description:
      "A five-day, artist-built festival on a lake in rural western Poland, run since 2012 on a deliberately anti-commercial, community-organized model.",
  },
  {
    slug: "movement-detroit",
    name: "Movement",
    city: "Detroit",
    country: "United States",
    startDate: "2027-05-29",
    endDate: "2027-05-31",
    dateStatus: "confirmed",
    genres: ["techno", "house"],
    website: "https://movementfestival.com",
    ticketUrl: "https://movementfestival.com",
    description:
      "Detroit's own Memorial Day Weekend techno festival at Hart Plaza, the direct descendant of the 2000 Detroit Electronic Music Festival in the genre's birthplace.",
  },
  {
    slug: "berlin-atonal",
    name: "Berlin Atonal",
    city: "Berlin",
    country: "Germany",
    startDate: "2027-08-25",
    endDate: "2027-08-29",
    dateStatus: "confirmed",
    genres: ["experimental", "techno", "industrial"],
    website: "https://berlin-atonal.com",
    ticketUrl: "https://berlin-atonal.com",
    description:
      "A biennial festival for experimental sound and audiovisual work inside Kraftwerk Berlin's former power plant, tracing back to the West Berlin underground of 1982.",
  },
  {
    slug: "draaimolen",
    name: "Draaimolen",
    city: "Oisterwijk",
    country: "Netherlands",
    startDate: "2027-09-03",
    endDate: "2027-09-04",
    dateStatus: "estimated",
    genres: ["techno", "minimal"],
    website: "https://www.draaimolen.nu",
    description:
      "An independent techno festival on a Brabant campsite built around art, nature and a deliberately non-commercial lineup policy; 2027 dates not yet announced.",
  },
  {
    slug: "junction-2",
    name: "Junction 2",
    city: "London",
    country: "United Kingdom",
    dateStatus: "tba",
    genres: ["techno", "house"],
    website: "https://www.junction2.london",
    description:
      "London's own underground house and techno festival at Boston Manor Park, running since 2016 with stages ranging from woodland floors to a rave under the M4 flyover.",
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
