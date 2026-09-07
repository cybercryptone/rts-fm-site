import archiveSets from "@/data/archive-sets.json";

// Server-only: the full archive dataset (3.7k+ sets, ~500KB) is imported
// here and must never be pulled into a client bundle. Consumers get a
// single computed position via the /api/broadcast-position route instead
// of importing this module directly.
type BroadcastEntry = {
  videoId: string;
  title: string;
  publishedAt: string;
  durationSeconds: number;
};

const SETS = archiveSets as BroadcastEntry[];

// Fixed reference point the whole loop counts from, so every visitor at the
// same real-world moment sees the same "channel" position, the same way
// broadcast TV works, even though this is just cycling through recordings.
const EPOCH_MS = Date.UTC(2026, 0, 1, 0, 0, 0);

const TOTAL_SECONDS = SETS.reduce((sum, s) => sum + s.durationSeconds, 0);

export type BroadcastPosition = {
  videoId: string;
  title: string;
  offsetSeconds: number;
  remainingSeconds: number;
};

export function getCurrentBroadcastPosition(now: number = Date.now()): BroadcastPosition {
  const rawElapsed = ((now - EPOCH_MS) / 1000) % TOTAL_SECONDS;
  const elapsed = rawElapsed < 0 ? rawElapsed + TOTAL_SECONDS : rawElapsed;

  let acc = 0;
  for (const entry of SETS) {
    if (elapsed < acc + entry.durationSeconds) {
      return {
        videoId: entry.videoId,
        title: entry.title,
        offsetSeconds: Math.floor(elapsed - acc),
        remainingSeconds: Math.ceil(acc + entry.durationSeconds - elapsed),
      };
    }
    acc += entry.durationSeconds;
  }

  // Only reached via floating-point edge cases at the exact loop boundary.
  const first = SETS[0];
  return {
    videoId: first.videoId,
    title: first.title,
    offsetSeconds: 0,
    remainingSeconds: first.durationSeconds,
  };
}
