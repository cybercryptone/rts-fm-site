"use client";

import { usePlayer } from "@/lib/PlayerProvider";
import { formatTime } from "@/lib/format";

function SkipIcon({ direction }: { direction: "back" | "forward" }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <g transform={direction === "back" ? "matrix(-1 0 0 1 24 0)" : undefined}>
        <path
          d="M12 3A9 9 0 1 1 3 12"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <polygon points="0,14 6,14 3,8" fill="currentColor" />
      </g>
      <text
        x="12"
        y="15.5"
        textAnchor="middle"
        fontSize="8"
        fontWeight="700"
        fill="currentColor"
        fontFamily="var(--font-mono)"
      >
        30
      </text>
    </svg>
  );
}

function SoundCloudIcon() {
  return (
    <svg width="20" height="15" viewBox="0 0 44 32" fill="currentColor">
      <rect x="0" y="18" width="2.5" height="10" rx="1" />
      <rect x="4" y="12" width="2.5" height="16" rx="1" />
      <rect x="8" y="16" width="2.5" height="12" rx="1" />
      <rect x="12" y="8" width="2.5" height="20" rx="1" />
      <rect x="16" y="18" width="24" height="10" rx="5" />
      <circle cx="22" cy="17" r="6" />
      <circle cx="30" cy="13" r="8" />
      <circle cx="37" cy="17" r="6" />
    </svg>
  );
}

export default function PlayerDock() {
  const {
    episodes,
    loading,
    currentEpisode,
    isPlaying,
    currentTime,
    duration,
    togglePlay,
    next,
    skip,
  } = usePlayer();

  const label = currentEpisode
    ? currentEpisode.title
    : loading
      ? "Loading sets…"
      : "RTS.FM Sets";

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 px-3 sm:px-6"
      style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))" }}
    >
      <div className="glass-dark mx-auto flex max-w-[1400px] items-center gap-3 rounded-xl px-3 py-2.5 sm:gap-4 sm:px-5 sm:py-3">
        <button
          type="button"
          onClick={() => skip(-30)}
          disabled={!currentEpisode}
          aria-label="Rewind 30 seconds"
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-white/70 transition-colors hover:text-accent disabled:opacity-40"
        >
          <SkipIcon direction="back" />
        </button>

        <button
          type="button"
          onClick={togglePlay}
          disabled={loading || episodes.length === 0}
          aria-label={isPlaying ? "Pause" : "Play"}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-accent/60 text-accent disabled:opacity-40"
        >
          {isPlaying ? (
            <svg width="9" height="11" viewBox="0 0 9 11" fill="currentColor">
              <rect width="3" height="11" rx="1" />
              <rect x="6" width="3" height="11" rx="1" />
            </svg>
          ) : (
            <svg width="10" height="11" viewBox="0 0 10 11" fill="currentColor">
              <path d="M0 0L10 5.5L0 11V0Z" />
            </svg>
          )}
        </button>

        <button
          type="button"
          onClick={() => skip(30)}
          disabled={!currentEpisode}
          aria-label="Forward 30 seconds"
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-white/70 transition-colors hover:text-accent disabled:opacity-40"
        >
          <SkipIcon direction="forward" />
        </button>

        <div className="flex items-end gap-[2px]" aria-hidden="true">
          {[0.35, 0.9, 0.5, 0.7, 0.4].map((d, i) => (
            <span
              key={i}
              className="eq-bar w-[2px] rounded-full bg-accent/80"
              style={{
                height: "16px",
                animationDelay: `${i * 0.12}s`,
                animationPlayState: isPlaying ? "running" : "paused",
              }}
            />
          ))}
        </div>

        <p className="min-w-0 truncate font-mono text-[11px] uppercase tracking-[0.12em] text-white sm:text-xs">
          {label}
        </p>

        <span className="ml-auto hidden shrink-0 font-mono text-[11px] tabular-nums text-white/40 sm:block">
          {currentEpisode ? `${formatTime(currentTime)} / ${formatTime(duration)}` : "--:--"}
        </span>

        {currentEpisode?.link && (
          <a
            href={currentEpisode.link}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open this mix on SoundCloud"
            className="ml-auto flex shrink-0 items-center justify-center text-white/70 transition-colors hover:text-accent sm:ml-0"
          >
            <SoundCloudIcon />
          </a>
        )}

        <button
          type="button"
          onClick={next}
          disabled={episodes.length === 0}
          aria-label="Next set"
          className="shrink-0 rounded-full border border-white/15 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-white transition-colors hover:border-accent hover:text-accent disabled:opacity-40 sm:text-[11px]"
        >
          next →
        </button>
      </div>
    </div>
  );
}
