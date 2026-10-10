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
  // Main venue or home base, with a street/postal address checked against
  // the festival's or venue's own site. Feeds Event structured data and the
  // "getting there" section; omit rather than guess.
  venue?: string;
  venueAddress?: string;
  // Bare "YYYY-MM-DD" of the last time dates, links and venue were checked
  // against the festival's own pages. Shown on the page, and the basis for
  // the sitemap lastmod, so only bump it after a real re-check.
  lastVerified: string;
  // Slugs of RTS.FM artist pages with a sourced appearance at this festival
  // (past edition or announced); never filled from memory.
  artists?: string[];
};

// A narrow, editorially curated list of major underground house/techno
// festivals, not an aggregator. A stale public events list (wrong dates,
// dead ticket links) erodes trust worse than not having the page at all,
// which is why this stays small and gets reviewed periodically rather than
// growing without bound. Every entry needs a real, verified official site
// and ticket link (or an honest dateStatus) before it ships. Verified
// 2026-10-10; re-check dates and links each time this list is revisited.
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
    ticketStatus: "open",
    venue: "Berghain (one of many Berlin venues; CTM has no single home venue)",
    venueAddress: "Am Wriezener Bahnhof, 10243 Berlin",
    lastVerified: "2026-10-10",
    artists: [],
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
    venue: "NDSM Docklands",
    venueAddress: "NDSM-Plein 85, 1033 WC Amsterdam",
    lastVerified: "2026-10-10",
    artists: ["nina-kraviz", "jeff-mills", "amelie-lens", "motor-city-drum-ensemble", "chris-stussy"],
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
    venue: "Maimarkthalle",
    venueAddress: "Xaver-Fuhr-Straße 101, 68163 Mannheim",
    lastVerified: "2026-10-10",
    artists: ["amelie-lens", "charlotte-de-witte", "chris-stussy", "joseph-capriati", "marco-carola", "nina-kraviz", "sara-landry", "sven-vath", "jeff-mills", "luciano", "nastia", "marek-hemmann", "steve-rachmad"],
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
    description:
      "Barcelona's festival for advanced electronic music and digital art since 1994, with the Sonar+D creativity and technology congress alongside.",
    image: "https://rts.fm/images/commons/sonar-sonar-by-day-2016.jpg",
    imageAlt: "Crowd at Sonar by Day 2016, with the Palau Nacional visible behind the stages at Fira Montjuic, Barcelona.",
    imageCredit: "Photo by Nachetere, CC BY-SA 4.0, via Wikimedia Commons.",
    venue: "Fira Gran Via (2026 edition venue; 2027 venue not yet announced)",
    venueAddress: "C/ Botànica 62, 08908 L'Hospitalet de Llobregat (Barcelona)",
    lastVerified: "2026-10-10",
    artists: ["amelie-lens", "charlotte-de-witte", "chris-stussy", "sara-landry", "surgeon", "nina-kraviz", "theo-parrish", "jeff-mills", "sven-vath", "kalabrese"],
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
    ticketPrice: 172.81,
    ticketPriceCurrency: "EUR",
    description:
      "A house and techno festival built around swimming and dancing at a lake outside Freiburg, six stages over a July weekend.",
    image: "https://rts.fm/images/commons/sea-you-tunisee-lake.jpg",
    imageAlt: "Aerial view of the Tunisee lake outside Freiburg im Breisgau, Germany.",
    imageCredit: "Photo by Norbert Blau, CC BY-SA 3.0, via Wikimedia Commons.",
    ticketStatus: "open",
    venue: "Tunisee",
    venueAddress: "Seestraße 30, 79108 Freiburg im Breisgau",
    lastVerified: "2026-10-10",
    artists: ["sven-vath", "nina-kraviz", "joseph-capriati", "marco-carola", "luciano", "charlotte-de-witte", "jeff-mills", "amelie-lens"],
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
    venue: "Parco Dora (Vitali area)",
    venueAddress: "Corso Mortara, 10149 Torino",
    lastVerified: "2026-10-10",
    artists: ["amelie-lens", "anyma", "batu", "charlotte-de-witte", "chris-stussy", "donato-dozzy", "jeff-mills", "joseph-capriati", "luciano", "marco-carola", "motor-city-drum-ensemble", "nastia", "nina-kraviz", "sara-landry", "sven-vath", "surgeon"],
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
    ticketUrl: "https://shop.awakenings.com/en/awakenings-festival-2027",
    ticketPrice: 239.95,
    ticketPriceCurrency: "EUR",
    description:
      "The Dutch techno institution's summer festival at Beekse Bergen, marking 30 years since the first Awakenings night at Amsterdam's Gashouder in 1997.",
    image: "https://rts.fm/images/commons/awakenings-festival-gashouder-westergasfabriek.jpg",
    imageAlt: "The Gashouder, the domed former gas holder at Amsterdam's Westergasfabriek, the original home of Awakenings.",
    imageCredit: "Photo by Bert van As / Rijksdienst voor het Cultureel Erfgoed, CC BY-SA 4.0, via Wikimedia Commons.",
    ticketStatus: "open",
    venue: "Beekse Bergen",
    venueAddress: "Beekse Bergen 1, 5081 NJ Hilvarenbeek",
    lastVerified: "2026-10-10",
    artists: ["charlotte-de-witte", "nina-kraviz", "joseph-capriati", "marco-carola", "chris-stussy", "sara-landry", "amelie-lens", "jeff-mills", "traumer"],
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
    venue: "Bungalowdorf Olganitz",
    venueAddress: "Zum Bungalowdorf 1, 04758 Cavertitz",
    lastVerified: "2026-10-10",
    artists: ["marek-hemmann", "move-d", "theo-parrish", "donato-dozzy", "jeff-mills", "batu"],
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
      "The Amsterdam label's own festival in the Amsterdamse Bos, a multi-day program of deliberately eclectic house, techno and disco booking anchored by forest stages.",
    image: "https://rts.fm/images/commons/dekmantel-festival-amsterdamse-bos-heuvel.jpg",
    imageAlt: "A wooded clearing in the Amsterdamse Bos, the Amsterdam park that has hosted Dekmantel Festival since 2013.",
    imageCredit: "Photo by Shirley de Jong, CC BY-SA 3.0, via Wikimedia Commons.",
    ticketStatus: "open",
    venue: "Amsterdamse Bos",
    venueAddress: "Nieuwe Meerlaan 1, 1187 NW Amstelveen",
    lastVerified: "2026-10-10",
    artists: ["jeff-mills", "surgeon", "theo-parrish", "motor-city-drum-ensemble", "move-d", "donato-dozzy", "nina-kraviz", "batu", "spekki-webu"],
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
    ticketUrl: "https://tickets.infield.live/checkout/garbicz-festival-2027-yaxgjr",
    description:
      "A five-day, artist-built festival on a lake in rural western Poland, run since 2013 on a deliberately anti-commercial, community-organized model.",
    image: "https://rts.fm/images/commons/garbicz-festival-lake-wielicko-aerial.jpg",
    imageAlt: "Aerial view of Lake Wielicko at Garbicz village, Poland, where Garbicz Festival is held.",
    imageCredit: "Photo by Łukasz Świerczewski, CC BY-SA 4.0, via Wikimedia Commons.",
    venue: "Garbicz Festival grounds, Lake Wielicko",
    venueAddress: "Garbicz 32F, 66-235 Torzym",
    lastVerified: "2026-10-10",
    artists: ["kalabrese"],
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
    ticketUrl: "https://movementfestival.com/tickets",
    description:
      "Detroit's own Memorial Day Weekend techno festival at Hart Plaza, the direct descendant of the 2000 Detroit Electronic Music Festival in the genre's birthplace.",
    image: "https://rts.fm/images/commons/Detroit_Electronic_Music_Festival_2002_main_stage_after_dark.jpg",
    imageAlt: "The main stage and crowd after dark at the 2002 Detroit Electronic Music Festival, Movement's direct predecessor.",
    imageCredit: "Photo by Myself248, CC BY-SA 4.0, via Wikimedia Commons.",
    ticketStatus: "open",
    venue: "Hart Plaza",
    venueAddress: "1 Hart Plaza, Detroit, MI 48226",
    lastVerified: "2026-10-10",
    artists: ["jeff-mills", "theo-parrish", "sara-landry", "rick-wade", "daniel-bell", "eric-cloutier", "move-d", "nina-kraviz", "charlotte-de-witte", "joseph-capriati", "donato-dozzy"],
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
    description:
      "A biennial festival for experimental sound and audiovisual work inside Kraftwerk Berlin's former power plant, tracing back to the West Berlin underground of 1982.",
    image: "https://rts.fm/images/commons/berlin-atonal-kraftwerk-interior.jpg",
    imageAlt: "Concrete pillars and turbine hall interior of Kraftwerk Berlin, lit for an event.",
    imageCredit: "Photo by MakeMagazinDE, CC BY-SA 4.0, via Wikimedia Commons.",
    venue: "Kraftwerk Berlin",
    venueAddress: "Köpenicker Straße 70, 10179 Berlin",
    lastVerified: "2026-10-10",
    artists: ["donato-dozzy", "surgeon", "tygapaw", "topdown-dialectic"],
  },
  {
    slug: "draaimolen",
    name: "Draaimolen",
    city: "Tilburg",
    country: "Netherlands",
    lat: 51.5555,
    lon: 5.0913,
    startDate: "2027-09-10",
    endDate: "2027-09-11",
    dateStatus: "confirmed",
    genres: ["techno", "minimal"],
    website: "https://www.draaimolen.nu",
    description:
      "An independent, not-for-profit techno festival in the woods of Tilburg's MOB Complex, built around art, nature and stages curated by artists and labels rather than one centrally booked lineup.",
    image: "https://rts.fm/images/commons/draaimolen-oisterwijkse-bossen-forest.jpg",
    imageAlt: "Forest path in the Oisterwijkse Bossen en Vennen nature reserve near Oisterwijk, Netherlands.",
    imageCredit: "Photo by Klankbeeld, CC BY-SA 4.0, via Wikimedia Commons.",
    venue: "MOB Complex",
    venueAddress: "IJpelareweg 55, 5048 TA Tilburg",
    lastVerified: "2026-10-10",
    artists: ["batu", "donato-dozzy", "fred-p", "spekki-webu"],
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
    venue: "Boston Manor Park",
    venueAddress: "Boston Manor Road, TW8 9JX Brentford, London",
    lastVerified: "2026-10-10",
    artists: ["jeff-mills", "nina-kraviz"],
  },
  {
    slug: "dimensions-festival",
    name: "Dimensions Festival",
    city: "Tisno",
    country: "Croatia",
    lat: 43.8,
    lon: 15.65,
    startDate: "2027-08-26",
    endDate: "2027-08-31",
    dateStatus: "confirmed",
    genres: ["house", "techno", "electronic", "dub"],
    website: "https://dimensionsfestival.com",
    description:
      "Outlook's sister festival, running since 2012 and now based at The Garden in Tisno on Croatia's Dalmatian coast after years inside Pula's Fort Punta Christo.",
    image: "https://rts.fm/images/commons/dimensions-festival-tisno-harbour.jpg",
    imageAlt: "The harbour and waterfront of Tisno, Croatia, the Dalmatian town that hosts Dimensions Festival at The Garden.",
    imageCredit: "Photo by Cholo Aleman, CC BY-SA 3.0, via Wikimedia Commons.",
    venue: "The Garden Resort",
    venueAddress: "Petrića Glava 34, 22240 Tisno",
    lastVerified: "2026-10-10",
    artists: ["theo-parrish", "motor-city-drum-ensemble", "jeff-mills", "nina-kraviz"],
  },
  {
    slug: "dockyard-festival",
    name: "Dockyard Festival",
    city: "Amsterdam",
    country: "Netherlands",
    lat: 52.3676,
    lon: 4.9041,
    startDate: "2026-10-24",
    endDate: "2026-10-24",
    dateStatus: "confirmed",
    genres: ["techno", "house", "trance"],
    website: "https://www.dockyardfestival.com",
    ticketUrl: "https://shop.dockyardfestival.com/s/CuRyUd7Ru8af06b8T7j3Tu",
    description:
      "A one-day daytime techno festival timed to Amsterdam Dance Event, running since 2014 and now held at Havenpark alongside Mystic Garden Festival on a single shared ticket.",
    venue: "Havenpark",
    venueAddress: "Havenpark, Wethouder van Essenweg (official navigation address), Amsterdam",
    lastVerified: "2026-10-10",
    artists: ["surgeon", "nastia", "luciano"],
  },
  {
    slug: "houghton-festival",
    name: "Houghton Festival",
    city: "King's Lynn",
    country: "United Kingdom",
    lat: 52.8269,
    lon: 0.6576,
    startDate: "2027-08-05",
    endDate: "2027-08-08",
    dateStatus: "confirmed",
    genres: ["techno", "house", "electronic", "experimental"],
    website: "https://www.houghtonfestival.co.uk",
    description:
      "A Craig Richards-curated festival of extended DJ sets and hidden stages in the grounds of Houghton Hall, Norfolk, running since 2017 and selling out quickly in recent years.",
    image: "https://rts.fm/images/commons/houghton-festival-houghton-hall-west-front.jpg",
    imageAlt: "The west front of Houghton Hall, the Palladian country house in Norfolk whose grounds host Houghton Festival.",
    imageCredit: "Photo by Elliott Brown, CC BY 2.0, via Wikimedia Commons.",
    venue: "Houghton Hall",
    venueAddress: "Houghton Hall, King's Lynn PE31 6TY",
    lastVerified: "2026-10-10",
    artists: ["move-d", "donato-dozzy", "batu", "daniel-bell"],
  },
  {
    slug: "lente-kabinet",
    name: "Lentekabinet",
    city: "Oostzaan",
    country: "Netherlands",
    lat: 52.4333,
    lon: 4.8833,
    startDate: "2027-05-15",
    endDate: "2027-05-16",
    dateStatus: "confirmed",
    genres: ["house", "disco", "electronic"],
    website: "https://lentekabinet.com",
    ticketUrl: "https://tickets.lentekabinet.com/efa16bf65d664b2bb04086c50773b154/tickets",
    description:
      "Dekmantel's two-day spring festival in the Het Twiske nature area just north of Amsterdam, mixing club music, live acts and art on Pentecost weekend.",
    image: "https://rts.fm/images/commons/lente-kabinet-het-twiske-nature-area.jpg",
    imageAlt: "Reed beds and open water in Het Twiske, the nature and recreation area north of Amsterdam where Lentekabinet is held.",
    imageCredit: "Photo by PersianDutchNetwork, CC BY-SA 4.0, via Wikimedia Commons.",
    venue: "Het Twiske",
    venueAddress: "De Zuiderlaaik 1, Oostzaan",
    lastVerified: "2026-10-10",
    artists: ["chris-stussy"],
  },
  {
    slug: "mutek",
    name: "MUTEK",
    city: "Montreal",
    country: "Canada",
    lat: 45.5089,
    lon: -73.5542,
    startDate: "2027-08-24",
    endDate: "2027-08-29",
    dateStatus: "confirmed",
    genres: ["electronic", "experimental", "techno"],
    website: "https://montreal.mutek.org/en",
    ticketUrl: "https://montreal.mutek.org/en/box-office",
    ticketStatus: "open",
    ticketPrice: 260,
    ticketPriceCurrency: "CAD",
    description:
      "Montreal's festival for live electronic music and digital creativity since 2000, six days of audiovisual shows across the Quartier des spectacles each late August.",
    image: "https://rts.fm/images/commons/mutek-clark-soundcheck-montreal.jpg",
    imageAlt: "The musician Clark sound checking behind a rig of synths and mixers at MUTEK Montreal, with green projected stripes on the wall behind him.",
    imageCredit: "Photo by Tinyflare, CC BY-SA 3.0, via Wikimedia Commons.",
    venue: "Quartier des spectacles, including the Society for Arts and Technology (SAT)",
    venueAddress: "1201 boulevard Saint-Laurent, Montréal QC H2X 2S6",
    lastVerified: "2026-10-10",
    artists: ["jeff-mills", "daniel-bell", "surgeon"],
  },
  {
    slug: "nature-one",
    name: "Nature One",
    city: "Kastellaun",
    country: "Germany",
    lat: 50.0694,
    lon: 7.4431,
    startDate: "2027-07-29",
    endDate: "2027-08-01",
    dateStatus: "confirmed",
    genres: ["techno", "trance", "house", "electronic"],
    website: "https://www.nature-one.de/en",
    ticketUrl: "https://www.nature-one.de/en/tickets",
    ticketStatus: "open",
    description:
      "A four-day open-air rave on the former Pydna missile base in the Hunsrück, running since 1995, with about 20 floors and a bill that stretches from club techno to mainstream dance and hardstyle.",
    image: "https://rts.fm/images/commons/nature-one-open-air-floor-2015.jpg",
    imageAlt: "Crowd in front of the lit stage of the Open Air Floor at Nature One, 2015.",
    imageCredit: "Photo by AssaultMedia, CC BY-SA 4.0, via Wikimedia Commons.",
    venue: "Raketenbasis Pydna",
    venueAddress: "Raketenbasis Pydna, 56288 Kastellaun (rural site in the Hunsrück, no street address given by the festival)",
    lastVerified: "2026-10-10",
    artists: ["charlotte-de-witte", "amelie-lens", "sven-vath", "jeff-mills", "nina-kraviz", "joseph-capriati", "marco-carola", "sara-landry", "marek-hemmann", "terry-lee-brown-jr", "dirty-doering"],
  },
  {
    slug: "rewire-festival",
    name: "Rewire",
    city: "The Hague",
    country: "Netherlands",
    lat: 52.08,
    lon: 4.31,
    startDate: "2027-04-08",
    endDate: "2027-04-11",
    dateStatus: "confirmed",
    genres: ["experimental", "electronic"],
    website: "https://www.rewirefestival.nl",
    ticketUrl: "https://www.rewirefestival.nl/tickets",
    ticketStatus: "open",
    description:
      "A four-day festival for adventurous music in The Hague's city centre since 2011, where experimental, electronic and club artists share bills across theatres, churches and clubs.",
    image: "https://rts.fm/images/commons/rewire-koninklijke-schouwburg-den-haag.jpg",
    imageAlt: "Interior of the Koninklijke Schouwburg in The Hague, one of Rewire's venues, looking from the stalls toward a black stage curtain framed by tiered balconies.",
    imageCredit: "Photo by PersianDutchNetwork, CC BY-SA 4.0, via Wikimedia Commons.",
    venue: "Multiple venues in The Hague city centre, including the Koninklijke Schouwburg and PAARD",
    venueAddress: "Korte Voorhout 3, 2511 CW The Hague",
    lastVerified: "2026-10-10",
    artists: ["nina-kraviz", "jeff-mills", "spekki-webu"],
  },
  {
    slug: "sunwaves",
    name: "Sunwaves",
    city: "Golden Sands",
    country: "Bulgaria",
    lat: 43.2911,
    lon: 28.0268,
    dateStatus: "tba",
    genres: ["minimal", "house", "techno"],
    website: "https://sunwaves-fest.ro",
    ticketUrl: "https://sunwaves-fest.ro/edition/sunwaves-festival-sw39-spring-edition-golden-sands/",
    description:
      "A beach festival of minimal and house that began in Mamaia, Romania in 2007 and now travels, with its 20th anniversary Spring Edition set for Golden Sands on Bulgaria's Black Sea coast. Known for marathon sets, including Marco Carola's 24 hours in 2015.",
    venue: "PR Beach",
    lastVerified: "2026-10-10",
    artists: ["marco-carola", "joseph-capriati", "traumer", "chris-stussy"],
  },
  {
    slug: "unsound-festival",
    name: "Unsound Festival",
    city: "Kraków",
    country: "Poland",
    lat: 50.0614,
    lon: 19.9372,
    dateStatus: "tba",
    genres: ["experimental", "electronic"],
    website: "https://www.unsound.pl",
    description:
      "Kraków's festival of experimental, electronic and leftfield music since 2003, with late-night programming at the brutalist Hotel Forum and satellite editions abroad; a founding partner of the TIMES network with Sonar and Berlin Atonal.",
    image: "https://rts.fm/images/commons/unsound-festival-hotel-forum-krakow.jpg",
    imageAlt: "The former Forum Hotel in Kraków seen from across the Vistula, the brutalist building that hosts Unsound's late-night programme.",
    imageCredit: "Photo by Zygmunt Put, CC BY-SA 4.0, via Wikimedia Commons.",
    venue: "Hotel Forum (late-night programme) and other venues in Kraków",
    venueAddress: "ul. Marii Konopnickiej 28, Kraków",
    lastVerified: "2026-10-10",
    artists: ["donato-dozzy", "batu", "move-d", "surgeon"],
  },
  {
    slug: "waking-life",
    name: "Waking Life",
    city: "Crato",
    country: "Portugal",
    lat: 39.283,
    lon: -7.633,
    startDate: "2027-06-16",
    endDate: "2027-06-21",
    dateStatus: "confirmed",
    genres: ["house", "techno", "ambient", "experimental"],
    website: "https://wakinglife.pt",
    ticketUrl: "https://raffle.wakinglife.pt/",
    description:
      "A six-day music and arts festival at a lake reservoir in Crato, Alentejo, run since 2017 with house, techno, ambient and experimental programming alongside film, workshops and a land regeneration project. Tickets are sold through a raffle.",
    image: "https://rts.fm/images/commons/waking-life-barragem-das-nascentes-sculpture.jpg",
    imageAlt: "A woven willow sculpture on a sandy shore beside the water at Barragem das Nascentes in Crato, Portugal, the reservoir site of Waking Life.",
    imageCredit: "Photo by AnaMargaridaFrazão, CC BY-SA 4.0, via Wikimedia Commons.",
    venue: "Barragem das Nascentes",
    venueAddress: "Barragem das Nascentes, Crato, Portalegre District, Alentejo, Portugal (rural lakeside site; no street address published)",
    lastVerified: "2026-10-10",
    artists: ["kalabrese", "theo-parrish"],
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
  "Croatia",
  "Portugal",
  "Romania",
  "Belgium",
  "France",
  "Switzerland",
  "Austria",
  "Hungary",
  "Czech Republic",
  "Serbia",
  "Sweden",
  "Denmark",
  "Norway",
  "Finland",
  "Greece",
  "Ireland",
  "Bulgaria",
  "Slovenia",
  "Latvia",
  "Lithuania",
  "Estonia",
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

// ---- Hubs, derived only from the data above -------------------------------

// A year or country page needs at least this many entries to be worth its
// own URL; below that it would just be a thin duplicate of the index.
export const MIN_HUB_FESTIVALS = 3;

export function slugifyCountry(country: string): string {
  return country
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function festivalYear(festival: Festival): number | null {
  return festival.startDate ? Number(festival.startDate.slice(0, 4)) : null;
}

// Festivals whose start date falls in `year`. For the current year only
// editions that have not finished are kept, since a "calendar" of events
// that already happened isn't useful; future years list everything dated.
export function getFestivalsForYear(year: number): Festival[] {
  const currentYear = new Date().getFullYear();
  return FESTIVALS.filter((f) => {
    if (festivalYear(f) !== year) return false;
    return year > currentYear ? true : isUpcoming(f);
  }).sort((a, b) => (a.startDate ?? "").localeCompare(b.startDate ?? ""));
}

export function getCalendarYears(): number[] {
  const currentYear = new Date().getFullYear();
  const years = new Set<number>();
  for (const f of FESTIVALS) {
    const y = festivalYear(f);
    if (y && y >= currentYear) years.add(y);
  }
  return [...years]
    .filter((y) => getFestivalsForYear(y).length >= MIN_HUB_FESTIVALS)
    .sort();
}

export type CountryHub = { country: string; slug: string; festivals: Festival[] };

export function getCountryHubs(): CountryHub[] {
  const byCountry = new Map<string, Festival[]>();
  for (const f of FESTIVALS) byCountry.set(f.country, [...(byCountry.get(f.country) ?? []), f]);
  return [...byCountry.entries()]
    .filter(([, list]) => list.length >= MIN_HUB_FESTIVALS)
    .map(([country, list]) => ({
      country,
      slug: slugifyCountry(country),
      festivals: list.sort((a, b) => (a.startDate ?? "9999").localeCompare(b.startDate ?? "9999")),
    }))
    .sort((a, b) => b.festivals.length - a.festivals.length || a.country.localeCompare(b.country));
}

export function getCountryHub(slug: string): CountryHub | null {
  return getCountryHubs().find((h) => h.slug === slug) ?? null;
}

export function festivalsForArtist(artistSlug: string): Festival[] {
  return FESTIVALS.filter((f) => f.artists?.includes(artistSlug));
}

// The oldest "last checked" date across the list, so the index never claims
// to be fresher than its stalest entry.
export function oldestVerified(): string | null {
  const dates = FESTIVALS.map((f) => f.lastVerified).filter((d): d is string => !!d);
  return dates.length === FESTIVALS.length && dates.length > 0 ? dates.sort()[0] : null;
}

export function daysSince(isoDate: string): number {
  return Math.floor((Date.now() - new Date(isoDate).getTime()) / 86_400_000);
}
