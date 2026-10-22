"use client";

import Link from "next/link";
import ApplePodcastsBadge from "@/components/ApplePodcastsBadge";
import { useState } from "react";
import SetsArchive from "./SetsArchive";
import PlayerCard from "./PlayerCard";
import VideoChannel, { type UpcomingEntry } from "./VideoChannel";
import { formatWait } from "@/lib/format";

export default function RadioSection({ aboutLink = false }: { aboutLink?: boolean }) {
  const [upNext, setUpNext] = useState<UpcomingEntry[]>([]);

  return (
    <section id="radio" className="border-b border-line px-6 py-24 sm:px-10 sm:py-32">
      <div className="mx-auto max-w-[1400px]">
        <div className="flex items-end justify-between gap-6">
          <h2 className="font-display text-4xl font-bold uppercase tracking-[-0.02em] text-fg sm:text-5xl">
            Radio
          </h2>
          {aboutLink ? (
            <Link
              href="/radio"
              className="font-mono text-xs uppercase tracking-[0.18em] text-fg-dim transition-colors hover:text-accent"
            >
              what is rts.fm radio? →
            </Link>
          ) : (
            <span className="hidden font-mono text-xs uppercase tracking-[0.18em] text-fg-dim sm:block">
              01 / on air
            </span>
          )}
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
          <div className="relative h-full">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -inset-12 -z-10 rounded-[48px] opacity-80 blur-3xl"
              style={{
                background:
                  "radial-gradient(55% 55% at 25% 15%, rgba(255,80,0,0.55) 0%, transparent 70%), radial-gradient(50% 50% at 85% 85%, rgba(224,74,63,0.45) 0%, transparent 70%)",
              }}
            />
            <PlayerCard />
          </div>

          {/* virtual channel + up next queue */}
          <div className="rounded-2xl border border-line p-8 sm:p-10">
            <VideoChannel onUpNextChange={setUpNext} />

            <p className="mt-8 font-mono text-[11px] uppercase tracking-[0.18em] text-fg-dim">
              up next
            </p>
            <ul className="mt-4 flex flex-col divide-y divide-line">
              {upNext.map((item, i) => (
                <li
                  key={i}
                  className="flex items-center justify-between gap-4 py-2.5"
                >
                  <span className="min-w-0 truncate font-display text-base font-bold uppercase tracking-[-0.02em] text-fg">
                    {item.title}
                  </span>
                  <span className="shrink-0 font-mono text-[11px] normal-case tracking-[0.14em] text-fg-dim">
                    in {formatWait(item.startsInSeconds)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-fg-dim">
            also on
          </p>
          <ApplePodcastsBadge className="h-9" />
          <a
            href="https://soundcloud.com/rtsfm"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Listen to RTS.FM on SoundCloud"
            className="inline-flex h-9 items-center gap-2.5 rounded-lg bg-black px-3 text-white transition-opacity hover:opacity-80"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 20 16"
              className="h-5 w-6 shrink-0 text-[#ff5500]"
              fill="currentColor"
            >
              <rect x="0" y="8" width="2" height="6" rx="1" />
              <rect x="4" y="5" width="2" height="9" rx="1" />
              <rect x="8" y="2" width="2" height="12" rx="1" />
              <rect x="12" y="0" width="2" height="14" rx="1" />
              <rect x="16" y="4" width="2" height="10" rx="1" />
            </svg>
            <span className="flex flex-col font-sans leading-none">
              <span className="text-[9px] font-medium tracking-[0.01em]">Listen on</span>
              <span className="mt-0.5 text-[17px] font-semibold tracking-[-0.01em]">SoundCloud</span>
            </span>
          </a>
        </div>

        <SetsArchive />
      </div>
    </section>
  );
}
