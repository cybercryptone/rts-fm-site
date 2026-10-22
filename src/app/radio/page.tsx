import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import AboutFooter from "@/components/AboutFooter";
import RadioSection from "@/components/RadioSection";
import { APPLE_PODCASTS_URL, CITIES, SITE, SOCIALS } from "@/lib/data";
import { breadcrumbJsonLd, faqJsonLd } from "@/lib/schema";

const description =
  "RTS.FM is an independent underground internet radio and label running since 2006. Play the on-demand player and the archive of 3,800 recorded DJ sets.";

export const metadata: Metadata = {
  title: "RTS.FM Radio: Listen Online",
  description,
  alternates: { canonical: "/radio" },
  openGraph: {
    type: "website",
    url: "/radio",
    title: "RTS.FM Radio: Listen Online",
    description,
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "RTS.FM Radio: Listen Online",
    description,
    images: ["/og-image.jpg"],
  },
};

// Facts on this page come from site data (SITE, CITIES, SOCIALS) so they stay
// in step with the homepage; the FAQ copy only restates what the site itself
// shows and does not promise a live schedule.
const FAQ = [
  {
    question: "What is RTS.FM?",
    answer: `${SITE.name} is an independent, invite-only and non-commercial internet radio and record label that has been running since ${SITE.founded}. It started as live audio-visual DJ broadcasting from underground studios and now combines an archive of recorded sets, an on-demand player and a label catalogue on Bandcamp.`,
  },
  {
    question: "How do I listen to RTS.FM online?",
    answer: `Use the player on this page. The on-demand player plays the latest sets, and the archive channel cycles through recorded sets in a shared loop. You can also listen on SoundCloud (soundcloud.com/rtsfm) and on Apple Podcasts, and watch the full video archive on YouTube.`,
  },
  {
    question: "Is RTS.FM a live stream?",
    answer: `The channel on this site runs as a shared loop of archive recordings, so every visitor sees the same position at the same moment, like a broadcast channel. The latest sets are available on demand. Announcements go out through the Telegram channel and Instagram.`,
  },
  {
    question: "Is RTS.FM the same as RTS, the Swiss or Serbian broadcaster?",
    answer: `No. RTS.FM is an independent electronic music radio and label. It is not related to Radio Télévision Suisse (RTS) or to Radiotelevizija Srbije (RTS), which are public broadcasters with the same abbreviation.`,
  },
  {
    question: "What music does RTS.FM play?",
    answer: `Tech house, minimal house, minimal techno and electronica, with no genre gatekeeping beyond that.`,
  },
  {
    question: "Where has RTS.FM broadcast from?",
    answer: `RTS.FM has broadcast sets from studios in ${CITIES.join(", ")}, according to the YouTube archive.`,
  },
  {
    question: "Does RTS.FM have a record label?",
    answer: `Yes. The RTS.FM label releases music from artists in the radio community on Bandcamp, and you can browse the catalogue on the homepage.`,
  },
];

const stationJsonLd = {
  "@context": "https://schema.org",
  "@type": "RadioStation",
  name: SITE.name,
  alternateName: ["RTS FM", "RTSFM", "RTS.FM Radio"],
  url: `${SITE.url}/radio`,
  description,
  foundingDate: String(SITE.founded),
  slogan: SITE.tagline,
  sameAs: SOCIALS.map((s) => s.href),
};

const breadcrumb = breadcrumbJsonLd([
  { name: "Home", path: "/" },
  { name: "Radio", path: "/radio" },
]);

export default function RadioPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(stationJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(FAQ)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <Nav />
      <main className="flex-1" style={{ paddingTop: "calc(var(--nav-height) + 3rem)" }}>
        <div className="px-6 sm:px-10">
          <div className="mx-auto max-w-[760px]">
            <div className="flex items-baseline gap-3 font-mono text-xs uppercase tracking-[0.2em] text-fg-dim">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              radio
            </div>
            <h1 className="mt-[18px] font-display text-4xl font-bold uppercase tracking-[-0.02em] text-fg sm:text-5xl">
              RTS.FM Radio: Listen Online
            </h1>
            <p className="mt-8 text-sm leading-relaxed text-fg-dim sm:text-base">
              {SITE.name} is an independent internet radio and record label that has been
              running since {SITE.founded}. It started as one of the first projects built
              around live audio-visual DJ sets streamed from underground studios, and it
              has stayed invite-only and non-commercial. The archive holds about 3,800
              recorded sets from studios in {CITIES.slice(0, -1).join(", ")} and{" "}
              {CITIES[CITIES.length - 1]}.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-fg-dim sm:text-base">
              Not the Swiss or Serbian broadcaster: this is the electronic music station
              behind rts.fm. Play it below, or find the same sets on{" "}
              <a
                href="https://soundcloud.com/rtsfm"
                target="_blank"
                rel="noopener noreferrer"
                className="text-fg underline decoration-line underline-offset-4 hover:text-accent"
              >
                SoundCloud
              </a>
              ,{" "}
              <a
                href={APPLE_PODCASTS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-fg underline decoration-line underline-offset-4 hover:text-accent"
              >
                Apple Podcasts
              </a>{" "}
              and the{" "}
              <a
                href="https://www.youtube.com/user/rtsfmmoscow/videos"
                target="_blank"
                rel="noopener noreferrer"
                className="text-fg underline decoration-line underline-offset-4 hover:text-accent"
              >
                YouTube archive
              </a>
              .
            </p>
          </div>
        </div>

        <RadioSection />

        <div className="px-6 pb-24 sm:px-10 sm:pb-32">
          <div className="mx-auto max-w-[760px]">
            <h2 className="font-display text-xl font-bold uppercase tracking-[-0.01em] text-fg">
              Frequently asked questions
            </h2>
            <dl className="mt-6 flex flex-col gap-6">
              {FAQ.map((item) => (
                <div key={item.question}>
                  <dt className="font-display text-base font-bold tracking-[-0.01em] text-fg">
                    {item.question}
                  </dt>
                  <dd className="mt-2 text-sm leading-relaxed text-fg-dim sm:text-base">
                    {item.answer}
                  </dd>
                </div>
              ))}
            </dl>
            <div className="mt-10 flex flex-wrap gap-x-6 gap-y-2">
              <Link
                href="/artists"
                className="font-mono text-[11px] uppercase tracking-[0.18em] text-fg-dim transition-colors hover:text-accent"
              >
                artist profiles →
              </Link>
              <Link
                href="/blog"
                className="font-mono text-[11px] uppercase tracking-[0.18em] text-fg-dim transition-colors hover:text-accent"
              >
                the blog →
              </Link>
              <Link
                href="/festivals"
                className="font-mono text-[11px] uppercase tracking-[0.18em] text-fg-dim transition-colors hover:text-accent"
              >
                festivals →
              </Link>
            </div>
          </div>
        </div>
      </main>
      <AboutFooter />
    </>
  );
}
