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

const UP_NEXT_COUNT = 6;

export type UpcomingEntry = {
  title: string;
  startsInSeconds: number;
};

export type BroadcastPosition = {
  videoId: string;
  title: string;
  offsetSeconds: number;
  remainingSeconds: number;
  upNext: UpcomingEntry[];
};

function buildUpNext(currentIndex: number, remainingSeconds: number): UpcomingEntry[] {
  const count = Math.min(UP_NEXT_COUNT, SETS.length - 1);
  const upNext: UpcomingEntry[] = [];
  let startsInSeconds = remainingSeconds;
  for (let k = 1; k <= count; k++) {
    const next = SETS[(currentIndex + k) % SETS.length];
    upNext.push({ title: next.title, startsInSeconds });
    startsInSeconds += next.durationSeconds;
  }
  return upNext;
}

function positionForIndex(index: number, offsetSeconds: number): BroadcastPosition {
  const entry = SETS[index];
  const remainingSeconds = Math.ceil(entry.durationSeconds - offsetSeconds);
  return {
    videoId: entry.videoId,
    title: entry.title,
    offsetSeconds: Math.floor(offsetSeconds),
    remainingSeconds,
    upNext: buildUpNext(index, remainingSeconds),
  };
}

export function getCurrentBroadcastPosition(now: number = Date.now()): BroadcastPosition {
  const rawElapsed = ((now - EPOCH_MS) / 1000) % TOTAL_SECONDS;
  const elapsed = rawElapsed < 0 ? rawElapsed + TOTAL_SECONDS : rawElapsed;

  let acc = 0;
  for (let i = 0; i < SETS.length; i++) {
    const entry = SETS[i];
    if (elapsed < acc + entry.durationSeconds) {
      return positionForIndex(i, elapsed - acc);
    }
    acc += entry.durationSeconds;
  }

  // Only reached via floating-point edge cases at the exact loop boundary.
  return positionForIndex(0, 0);
}

// Used when a set ends before the wall-clock schedule expected it to (the
// recorded duration doesn't always exactly match the real playback length)
// — re-deriving "now" from the clock in that case can land back on the same
// entry and replay it instead of advancing. Stepping to the next index
// directly guarantees forward progress regardless of that drift.
export function getNextBroadcastPosition(afterVideoId: string): BroadcastPosition {
  const currentIndex = SETS.findIndex((s) => s.videoId === afterVideoId);
  const nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % SETS.length;
  return positionForIndex(nextIndex, 0);
}
