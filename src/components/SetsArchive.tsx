import { ARCHIVE_SETS, youtubeWatchUrl } from "@/lib/data";

export default function SetsArchive() {
  return (
    <div className="mt-14">
      <div className="flex items-baseline justify-between gap-4">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-fg-dim">
          most-viewed sets — archive
        </p>
        <a
          href="https://www.youtube.com/user/rtsfmmoscow/videos"
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-[11px] uppercase tracking-[0.18em] text-fg-dim transition-colors hover:text-accent"
        >
          full archive on youtube →
        </a>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
        {ARCHIVE_SETS.map((s) => (
          <div
            key={s.videoId}
            className="overflow-hidden rounded-xl border border-line bg-bg-elevated transition-colors hover:border-accent/60"
          >
            <div className="relative aspect-video overflow-hidden">
              {/* A genuinely embedded, crawlable player, not just a thumbnail
                  linking out to YouTube: it needs to match the VideoObject
                  markup below, or Google's video indexing has nothing to
                  verify the markup against. loading="lazy" defers the actual
                  network fetch until the card nears the viewport, so this
                  costs nothing for cards a visitor never scrolls to. */}
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${s.videoId}`}
                title={`${s.artist} — ${s.context}, ${s.date}`}
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 h-full w-full"
              />

              <span className="pointer-events-none absolute left-2 top-2 rounded-full bg-black/50 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-white/90 backdrop-blur-sm">
                {s.views} views
              </span>
              <span className="pointer-events-none absolute bottom-2 right-2 rounded bg-black/70 px-1.5 py-0.5 font-mono text-[10px] text-white">
                {s.duration}
              </span>
            </div>

            <div className="px-3 py-2.5">
              <p className="font-display text-sm font-bold uppercase leading-tight tracking-[-0.01em] text-fg">
                {s.artist}
              </p>
              <a
                href={youtubeWatchUrl(s)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 block truncate font-mono text-[10px] uppercase tracking-[0.08em] text-fg-dim transition-colors hover:text-accent"
              >
                {s.context} · {s.date}
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
