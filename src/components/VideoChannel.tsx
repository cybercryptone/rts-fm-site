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
  unMute: () => void;
  setVolume: (volume: number) => void;
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

const YT_ENDED_STATE = 0;

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
  const [ready, setReady] = useState(false);
  const [title, setTitle] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    Promise.all([loadYouTubeIframeApi(), fetchPosition()]).then(([, position]) => {
      if (cancelled || !containerRef.current) return;
      setTitle(position.title);

      playerRef.current = new window.YT!.Player(containerRef.current, {
        videoId: position.videoId,
        playerVars: {
          start: position.offsetSeconds,
          autoplay: 1,
          mute: 1,
          controls: 1,
          modestbranding: 1,
          rel: 0,
          playsinline: 1,
        },
        events: {
          onReady: () => setReady(true),
          onStateChange: (e) => {
            if (e.data === YT_ENDED_STATE) {
              fetchPosition().then((next) => {
                if (cancelled) return;
                setTitle(next.title);
                playerRef.current?.loadVideoById({
                  videoId: next.videoId,
                  startSeconds: next.offsetSeconds,
                });
              });
            }
          },
        },
      });
    });

    return () => {
      cancelled = true;
      playerRef.current?.destroy?.();
    };
  }, []);

  const handleUnmute = () => {
    playerRef.current?.unMute?.();
    playerRef.current?.setVolume?.(100);
    setMuted(false);
  };

  return (
    <div className="relative aspect-video overflow-hidden rounded-xl border border-line bg-ink">
      <div ref={containerRef} className="h-full w-full" />

      <span className="pointer-events-none absolute left-2 top-2 flex items-center gap-1.5 rounded-full bg-black/60 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-white backdrop-blur-sm">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
        on air
      </span>

      {title && (
        <span className="pointer-events-none absolute bottom-2 left-2 max-w-[calc(100%-5rem)] truncate rounded-full bg-black/60 px-2 py-1 font-mono text-[10px] tracking-[-0.01em] text-white/80 backdrop-blur-sm">
          {title}
        </span>
      )}

      {ready && muted && (
        <button
          type="button"
          onClick={handleUnmute}
          className="absolute bottom-2 right-2 rounded-full bg-black/70 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.1em] text-white transition-colors hover:bg-accent hover:text-bg"
        >
          unmute →
        </button>
      )}
    </div>
  );
}
