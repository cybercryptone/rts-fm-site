import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Ticker from "@/components/Ticker";
import RadioSection from "@/components/RadioSection";
import LabelSection from "@/components/LabelSection";
import BlogSection from "@/components/BlogSection";
import AboutFooter from "@/components/AboutFooter";
import {
  ARCHIVE_SETS,
  archiveSetIsoDate,
  archiveSetIsoDuration,
  archiveSetViewCount,
  youtubeThumbnail,
  youtubeWatchUrl,
} from "@/lib/data";

// The archive grid below (rendered inside RadioSection, a client
// component) shows real YouTube sets — give search engines a VideoObject
// for each one directly in the server-rendered HTML rather than relying
// on client-side markup, per Google's guidance that JS-injected structured
// data can face delayed processing.
const archiveVideosJsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  itemListElement: ARCHIVE_SETS.map((set, i) => ({
    "@type": "ListItem",
    position: i + 1,
    item: {
      "@type": "VideoObject",
      name: `${set.artist} — ${set.context}, ${set.date}`,
      description: `${set.artist} live DJ set for RTS.FM, recorded at ${set.context} on ${set.date}.`,
      thumbnailUrl: youtubeThumbnail(set),
      uploadDate: archiveSetIsoDate(set),
      duration: archiveSetIsoDuration(set),
      contentUrl: youtubeWatchUrl(set),
      embedUrl: `https://www.youtube.com/embed/${set.videoId}`,
      interactionStatistic: {
        "@type": "InteractionCounter",
        interactionType: { "@type": "WatchAction" },
        userInteractionCount: archiveSetViewCount(set),
      },
    },
  })),
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(archiveVideosJsonLd) }}
      />
      <Nav />
      <main className="flex-1">
        <Hero />
        <Ticker />
        <RadioSection />
        <LabelSection />
        <BlogSection />
      </main>
      <AboutFooter />
    </>
  );
}
