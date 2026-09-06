import type { Metadata } from "next";
import Nav from "@/components/Nav";
import AboutFooter from "@/components/AboutFooter";
import { SITE } from "@/lib/data";

export const metadata: Metadata = {
  title: "About & Editorial Standards",
  description: "Who runs RTS.FM, how the editorial team sources and corrects the blog, and how to reach us.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <Nav />
      <main
        className="flex-1 px-6 pb-24 sm:px-10 sm:pb-32"
        style={{ paddingTop: "calc(var(--nav-height) + 4rem)" }}
      >
        <div className="mx-auto max-w-[760px]">
          <div className="flex items-baseline gap-3 font-mono text-xs uppercase tracking-[0.2em] text-fg-dim">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            masthead
          </div>
          <h1 className="mt-[18px] font-display text-4xl font-bold uppercase tracking-[-0.02em] text-fg sm:text-5xl">
            About RTS.FM
          </h1>

          <p className="mt-8 text-sm leading-relaxed text-fg-dim sm:text-base">
            {SITE.name} launched in {SITE.founded} as one of the first internet radio
            projects built around live audio-visual broadcasting: DJ sets streamed
            straight out of underground studios rather than pre-recorded shows.
            Invite-only and non-commercial from day one, it grew into a community of
            artists, listeners and studios spanning multiple cities, plus a record
            label pressing music from the people playing on air. No outside
            investment, no ad sales, no sponsor logos on the stream.
          </p>

          <h2 className="mt-10 font-display text-xl font-bold uppercase tracking-[-0.01em] text-fg">
            What We Cover
          </h2>
          <p className="mt-5 text-sm leading-relaxed text-fg-dim sm:text-base">
            Alongside the live stream and label catalog, RTS.FM publishes an editorial
            blog covering underground electronic music culture: club and festival
            news, label stories, artist profiles, and the industry stories that
            actually affect people who make and play this music. Every article is
            written by RTS.FM&apos;s own editorial team, sourced from public,
            verifiable reporting cited inline with links to the original outlets, and
            never copied or paraphrased wholesale from a single source.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-fg-dim sm:text-base">
            We are not a wire service and don&apos;t claim to break news first. What we
            aim for is context an underground audience won&apos;t get from a generic
            aggregator: why a story matters to people who actually go out, buy vinyl,
            or run a label themselves.
          </p>

          <h2 className="mt-10 font-display text-xl font-bold uppercase tracking-[-0.01em] text-fg">
            Corrections &amp; Accuracy
          </h2>
          <p className="mt-5 text-sm leading-relaxed text-fg-dim sm:text-base">
            We check facts against primary sources before publishing and avoid
            reporting a number, quote, or claim we can&apos;t verify. Mistakes still
            happen. If you spot one, tell us and we&apos;ll fix it: factual corrections
            are made directly in the article as soon as they&apos;re confirmed, with no
            attempt to quietly bury the original error.
          </p>

          <h2 className="mt-10 font-display text-xl font-bold uppercase tracking-[-0.01em] text-fg">
            Contact
          </h2>
          <p className="mt-5 text-sm leading-relaxed text-fg-dim sm:text-base">
            The fastest way to reach the team, whether for a correction, a tip, or
            anything else, is{" "}
            <a
              href="https://t.me/rtsfm"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent underline decoration-accent/40 underline-offset-4 transition-colors hover:text-accent-soft"
            >
              our Telegram channel
            </a>
            . We read everything that comes in there.
          </p>
        </div>
      </main>
      <AboutFooter />
    </>
  );
}
