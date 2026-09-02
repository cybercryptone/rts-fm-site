"use client";

import { usePlayer } from "@/lib/PlayerProvider";
import { formatTime, splitTitle } from "@/lib/format";

export default function PlayerCard() {
  const {
    episodes,
    loading,
    error,
    currentIndex,
    currentEpisode,
    isPlaying,
    currentTime,
    duration,
    playEpisode,
    togglePlay,
    seekTo,
  } = usePlayer();

  const recent = episodes.slice(0, 5);
  const progress = duration > 0 ? currentTime / duration : 0;
  const statusLabel = error
    ? "feed unavailable"
    : loading
      ? "loading sets…"
      : "on-demand · latest sets";
  const nowPlaying = currentEpisode ? splitTitle(currentEpisode.title) : null;

  return (
    <div className="glass-dark relative flex h-full flex-col justify-between rounded-2xl p-8 sm:p-10">
      <span className="crosshair -left-[6px] -top-[6px]" />
      <span className="crosshair -right-[6px] -top-[6px]" />
      <span className="crosshair -bottom-[6px] -left-[6px]" />
      <span className="crosshair -bottom-[6px] -right-[6px]" />

      <div className="flex items-center justify-between">
        <span className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-white/60">
          <span
            className={`h-1.5 w-1.5 rounded-full ${isPlaying ? "bg-accent" : "bg-white/50"}`}
          />
          {statusLabel}
        </span>
        <div className="flex items-end gap-[3px]" aria-hidden="true">
          {[0.4, 1, 0.6, 0.85, 0.5].map((d, i) => (
            <span
              key={i}
              className="eq-bar h-6 w-[3px] rounded-full bg-accent/80"
              style={{
                animationDelay: `${i * 0.12}s`,
                animationPlayState: isPlaying ? "running" : "paused",
              }}
            />
          ))}
        </div>
      </div>

      <div className="mt-10 flex items-center gap-6">
        <button
          type="button"
          onClick={togglePlay}
          disabled={loading || episodes.length === 0}
          aria-label={isPlaying ? "Pause" : "Play"}
          className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-accent/60 text-accent transition-opacity disabled:opacity-40"
        >
          {isPlaying ? (
            <svg width="18" height="20" viewBox="0 0 18 20" fill="currentColor">
              <rect width="6" height="20" rx="1.5" />
              <rect x="12" width="6" height="20" rx="1.5" />
            </svg>
          ) : (
            <svg width="20" height="22" viewBox="0 0 20 22" fill="currentColor">
              <path d="M0 0L20 11L0 22V0Z" />
            </svg>
          )}
        </button>
        <div className="min-w-0">
          <p className="truncate font-display text-xl font-bold uppercase tracking-[-0.02em] text-white">
            {nowPlaying?.artist ?? "RTS.FM Sets"}
          </p>
          {(nowPlaying?.meta || currentEpisode) && (
            <p className="mt-1 truncate font-mono text-[10.5px] tracking-[-0.015em] text-white/65">
              {nowPlaying?.meta || "RTS.FM"}
            </p>
          )}
        </div>
      </div>

      <div className="mt-6">
        <input
          type="range"
          min={0}
          max={1}
          step={0.001}
          value={Number.isFinite(progress) ? progress : 0}
          onChange={(e) => seekTo(Number(e.target.value))}
          disabled={!currentEpisode}
          className="w-full accent-[#ff5000] disabled:opacity-30"
          aria-label="Seek"
        />
        <div className="mt-1 flex justify-between font-mono text-[10px] tabular-nums tracking-[-0.01em] text-white/50">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration || currentEpisode?.durationSeconds || 0)}</span>
        </div>
      </div>

      {recent.length > 0 && (
        <ul className="mt-8 flex flex-col divide-y divide-white/[0.06] border-t border-white/[0.06]">
          {recent.map((ep, i) => {
            const active = i === currentIndex;
            const { artist, meta } = splitTitle(ep.title);
            return (
              <li key={ep.id} className="relative">
                {active && (
                  <span className="absolute -left-4 top-1/2 h-6 w-[2px] -translate-y-1/2 rounded-full bg-accent sm:-left-5" />
                )}
                <button
                  type="button"
                  onClick={() => playEpisode(i)}
                  className="flex w-full items-center gap-4 py-3 text-left"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-white">
                      {artist}
                    </p>
                    {meta && (
                      <p className="mt-0.5 truncate font-mono text-[10.5px] tracking-[-0.015em] text-white/65">
                        {meta}
                      </p>
                    )}
                  </div>
                  <span className="flex shrink-0 items-center gap-2">
                    {active && isPlaying && (
                      <span className="flex items-end gap-[2px]" aria-hidden="true">
                        {[0.4, 1, 0.6].map((d, bi) => (
                          <span
                            key={bi}
                            className="eq-bar w-[2px] rounded-full bg-accent"
                            style={{ height: "9px", animationDelay: `${bi * 0.12}s` }}
                          />
                        ))}
                      </span>
                    )}
                    <span
                      className={`font-mono text-[10px] tabular-nums tracking-[-0.01em] ${
                        active ? "text-white" : "text-white/40"
                      }`}
                    >
                      {formatTime(ep.durationSeconds)}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}

      <a
        href="https://t.me/rtsfm"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-8 inline-flex w-fit items-center gap-2 self-center rounded-full border border-white/15 px-4 py-2 font-mono text-xs uppercase tracking-[0.14em] text-white transition-colors hover:border-accent hover:text-accent"
      >
        get live broadcast alerts →
      </a>
    </div>
  );
}
