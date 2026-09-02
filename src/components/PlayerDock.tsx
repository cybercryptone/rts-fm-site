"use client";

import { usePlayer } from "@/lib/PlayerProvider";
import { formatTime } from "@/lib/format";

export default function PlayerDock() {
  const { episodes, loading, currentEpisode, isPlaying, currentTime, duration, togglePlay, next } =
    usePlayer();

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
