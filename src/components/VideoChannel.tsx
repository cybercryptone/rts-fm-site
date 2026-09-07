"use client";

import { useEffect, useRef, useState } from "react";

type BroadcastPosition = {
  videoId: string;
  title: string;
  offsetSeconds: number;
  remainingSeconds: number;
};

type YTPlayerEvent = { data: number };
type YTPlayer = {
  destroy: () => void;
  playVideo: () => void;
  pauseVideo: () => void;
  mute: () => void;
  unMute: () => void;
  setVolume: (volume: number) => void;
  getCurrentTime: () => number;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  loadVideoById: (options: { videoId: string; startSeconds?: number }) => void;
};
type YTPlayerConstructorOptions = {
  videoId: string;
  playerVars?: Record<string, number | string>;
  events?: {
    onReady?: (event: YTPlayerEvent) => void;
    onStateChange?: (event: YTPlayerEvent) => void;
  };
};

declare global {
  interface Window {
    YT?: {
      Player: new (el: HTMLElement, opts: YTPlayerConstructorOptions) => YTPlayer;
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

// YT.PlayerState values (not exposed as constants until the API script has
// loaded, so these are just hardcoded per Google's documented values).
const YT_STATE_ENDED = 0;
const YT_STATE_PLAYING = 1;
const YT_STATE_PAUSED = 2;

let apiLoadPromise: Promise<void> | null = null;

function loadYouTubeIframeApi(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.YT?.Player) return Promise.resolve();
  if (apiLoadPromise) return apiLoadPromise;

  apiLoadPromise = new Promise((resolve) => {
    const previous = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previous?.();
      resolve();
    };
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(tag);
  });
  return apiLoadPromise;
}

async function fetchPosition(): Promise<BroadcastPosition> {
  const res = await fetch("/api/broadcast-position", { cache: "no-store" });
  return res.json();
}

export default function VideoChannel() {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YTPlayer | null>(null);
  const [muted, setMuted] = useState(true);
  const [volume, setVolume] = useState(100);
  const [isPlaying, setIsPlaying] = useState(false);
  const [title, setTitle] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalSeconds, setTotalSeconds] = useState(0);

  useEffect(() => {
    let cancelled = false;

    Promise.all([loadYouTubeIframeApi(), fetchPosition()]).then(([, position]) => {
      if (cancelled || !containerRef.current) return;
      setTitle(position.title);
      setTotalSeconds(position.offsetSeconds + position.remainingSeconds);
      setCurrentTime(position.offsetSeconds);

      playerRef.current = new window.YT!.Player(containerRef.current, {
        videoId: position.videoId,
        playerVars: {
          start: position.offsetSeconds,
          autoplay: 1,
          mute: 1,
          // No native chrome: this is meant to feel like a live channel, not
          // a video the visitor can scrub through. Play/pause and mute get
          // a small custom overlay below instead.
          controls: 0,
          disablekb: 1,
          modestbranding: 1,
          rel: 0,
          playsinline: 1,
          iv_load_policy: 3,
        },
        events: {
          onReady: () => setIsPlaying(true),
          onStateChange: (e) => {
            if (e.data === YT_STATE_ENDED) {
              fetchPosition().then((next) => {
                if (cancelled) return;
                setTitle(next.title);
                setTotalSeconds(next.offsetSeconds + next.remainingSeconds);
                setCurrentTime(next.offsetSeconds);
                playerRef.current?.loadVideoById({
                  videoId: next.videoId,
                  startSeconds: next.offsetSeconds,
                });
              });
            } else if (e.data === YT_STATE_PLAYING) {
              setIsPlaying(true);
            } else if (e.data === YT_STATE_PAUSED) {
              setIsPlaying(false);
            }
          },
        },
      });
    });

    const pollId = window.setInterval(() => {
      const t = playerRef.current?.getCurrentTime?.();
      if (typeof t === "number" && Number.isFinite(t)) setCurrentTime(t);
    }, 1000);

    return () => {
      cancelled = true;
      window.clearInterval(pollId);
      playerRef.current?.destroy?.();
    };
  }, []);

  const togglePlay = () => {
    if (!playerRef.current) return;
    if (isPlaying) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.playVideo();
    }
  };

  const toggleMute = () => {
    if (!playerRef.current) return;
    if (muted) {
      const v = volume > 0 ? volume : 100;
      playerRef.current.unMute();
      playerRef.current.setVolume(v);
      setVolume(v);
      setMuted(false);
    } else {
      playerRef.current.mute();
      setMuted(true);
    }
  };

  const handleVolumeChange = (v: number) => {
    if (!playerRef.current) return;
    setVolume(v);
    playerRef.current.setVolume(v);
    if (v === 0) {
      playerRef.current.mute();
      setMuted(true);
    } else {
      playerRef.current.unMute();
      setMuted(false);
    }
  };

  const handleSeek = (seconds: number) => {
    if (!playerRef.current) return;
    playerRef.current.seekTo(seconds, true);
    setCurrentTime(seconds);
  };

  return (
    <div className="glass-dark relative aspect-video overflow-hidden rounded-xl">
      <div ref={containerRef} className="pointer-events-none h-full w-full" />

      <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between p-2.5">
        <span className="flex items-center gap-1.5 rounded-full bg-black/60 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-white backdrop-blur-sm">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
          on air
        </span>
        <div className="group/vol flex items-center gap-1.5">
          <div className="flex w-0 items-center overflow-hidden opacity-0 transition-all duration-200 group-hover/vol:w-14 group-hover/vol:opacity-100 group-focus-within/vol:w-14 group-focus-within/vol:opacity-100">
            <input
              type="range"
              min={0}
              max={100}
              step={1}
              value={muted ? 0 : volume}
              onChange={(e) => handleVolumeChange(Number(e.target.value))}
              aria-label="Volume"
              className="h-1 w-12 accent-accent"
            />
          </div>
          <button
            type="button"
            onClick={toggleMute}
            aria-label={muted ? "Unmute" : "Mute"}
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm transition-colors hover:bg-accent hover:text-bg"
          >
            {muted ? (
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 5 6 9H2v6h4l5 4V5Z" />
                <line x1="23" y1="9" x2="17" y2="15" />
                <line x1="17" y1="9" x2="23" y2="15" />
              </svg>
            ) : (
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 5 6 9H2v6h4l5 4V5Z" />
                <path d="M15.5 8.5a5 5 0 0 1 0 7" />
                <path d="M18.5 5.5a9 9 0 0 1 0 13" />
              </svg>
            )}
          </button>
        </div>
      </div>

      <button
        type="button"
        onClick={togglePlay}
        aria-label={isPlaying ? "Pause" : "Play"}
        className="group absolute inset-0 flex items-center justify-center bg-transparent"
      >
        <span className="flex h-12 w-12 items-center justify-center rounded-full border border-accent/60 bg-black/50 text-accent opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
          {isPlaying ? (
            <svg width="14" height="16" viewBox="0 0 14 16" fill="currentColor">
              <rect width="4" height="16" rx="1" />
              <rect x="10" width="4" height="16" rx="1" />
            </svg>
          ) : (
            <svg width="16" height="18" viewBox="0 0 16 18" fill="currentColor">
              <path d="M0 0L16 9L0 18V0Z" />
            </svg>
          )}
        </span>
      </button>

      <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/80 to-transparent px-3 pb-2 pt-8">
        {title && (
          <p className="pointer-events-none truncate font-mono text-[10px] uppercase tracking-[0.08em] text-white/85">
            {title}
          </p>
        )}
        <input
          type="range"
          min={0}
          max={totalSeconds || 0}
          step={1}
          value={Math.min(currentTime, totalSeconds || 0)}
          onChange={(e) => handleSeek(Number(e.target.value))}
          disabled={!totalSeconds}
          aria-label="Seek"
          className="mt-1.5 w-full accent-accent disabled:opacity-30"
        />
      </div>
    </div>
  );
}
