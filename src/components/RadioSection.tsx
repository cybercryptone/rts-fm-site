import { CITIES } from "@/lib/data";
import SetsArchive from "./SetsArchive";
import PlayerCard from "./PlayerCard";

export default function RadioSection() {
  return (
    <section id="radio" className="border-b border-line px-6 py-24 sm:px-10 sm:py-32">
      <div className="mx-auto max-w-[1400px]">
        <div className="flex items-end justify-between gap-6">
          <h2 className="font-display text-4xl italic text-fg sm:text-5xl">
            Radio.
          </h2>
          <span className="hidden font-mono text-xs uppercase tracking-[0.18em] text-fg-dim sm:block">
            01 / on air
          </span>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-[1.1fr_1fr]">
          <PlayerCard />

          {/* studios */}
          <div className="rounded-2xl border border-line p-8 sm:p-10">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-fg-dim">
              broadcasting from
            </p>
            <ul className="mt-6 flex flex-col divide-y divide-line">
              {CITIES.map((s) => (
                <li
                  key={s}
                  className="flex items-center justify-between py-3 font-display text-lg italic text-fg"
                >
                  {s}
                  <span className="font-mono text-[11px] not-italic text-fg-dim">
                    studio
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-fg-dim">
            also on
          </p>
          <a
            href="https://podcasts.apple.com/us/podcast/rts-fm-radio/id1586958635?itscg=30200&itsct=podcast_box_badge&ls=1&mttnsubad=1586958635"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://toolbox.marketingtools.apple.com/api/v2/badges/listen-on-apple-podcasts/badge-26/en-us"
              alt="Listen on Apple Podcasts"
              className="h-[54px] w-auto object-contain sm:h-[62px]"
            />
          </a>
        </div>

        <SetsArchive />
      </div>
    </section>
  );
}
