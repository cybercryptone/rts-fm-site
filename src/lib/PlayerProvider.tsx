"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import type { FeedEpisode } from "@/app/api/feed/route";

type PlayerContextValue = {
  episodes: FeedEpisode[];
  loading: boolean;
  error: boolean;
  currentIndex: number;
  currentEpisode: FeedEpisode | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  playEpisode: (index: number) => void;
  togglePlay: () => void;
  next: () => void;
  prev: () => void;
  seekTo: (fraction: number) => void;
  skip: (seconds: number) => void;
};

const PlayerContext = createContext<PlayerContextValue | null>(null);

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const [episodes, setEpisodes] = useState<FeedEpisode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/feed")
      .then((res) => (res.ok ? res.json() : Promise.reject(res)))
      .then((data) => {
        if (cancelled) return;
        const eps: FeedEpisode[] = data.episodes ?? [];
        setEpisodes(eps);
        if (eps.length > 0) setCurrentIndex(0);
      })
      .catch(() => !cancelled && setError(true))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, []);

  const currentEpisode = currentIndex >= 0 ? episodes[currentIndex] ?? null : null;

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentEpisode) return;
    if (audio.src !== currentEpisode.audioUrl) {
      audio.src = currentEpisode.audioUrl;
    }
    if (isPlaying) {
      audio.play().catch(() => setIsPlaying(false));
    } else {
      audio.pause();
    }
  }, [currentEpisode, isPlaying]);

  const playEpisode = useCallback((index: number) => {
    setCurrentIndex(index);
    setIsPlaying(true);
  }, []);

  const togglePlay = useCallback(() => {
    if (currentIndex < 0) {
      if (episodes.length > 0) playEpisode(0);
      return;
    }
    setIsPlaying((p) => !p);
  }, [currentIndex, episodes.length, playEpisode]);

  const next = useCallback(() => {
    if (episodes.length === 0) return;
    setCurrentIndex((i) => (i + 1) % episodes.length);
    setIsPlaying(true);
  }, [episodes.length]);

  const prev = useCallback(() => {
    if (episodes.length === 0) return;
    setCurrentIndex((i) => (i - 1 + episodes.length) % episodes.length);
    setIsPlaying(true);
  }, [episodes.length]);

  const seekTo = useCallback((fraction: number) => {
    const audio = audioRef.current;
    if (!audio || !audio.duration) return;
    audio.currentTime = fraction * audio.duration;
  }, []);

  const skip = useCallback((seconds: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    const max = audio.duration || Infinity;
    audio.currentTime = Math.min(Math.max(0, audio.currentTime + seconds), max);
  }, []);

  return (
    <PlayerContext.Provider
      value={{
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
        next,
        prev,
        seekTo,
        skip,
      }}
    >
      {children}
      <audio
        ref={audioRef}
        onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onEnded={next}
        onPause={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
        preload="none"
      />
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error("usePlayer must be used within PlayerProvider");
  return ctx;
}
