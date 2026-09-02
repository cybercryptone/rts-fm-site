import { ARCHIVE_SETS, youtubeThumbnail, youtubeWatchUrl } from "@/lib/data";

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
          <a
            key={s.videoId}
            href={youtubeWatchUrl(s)}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative aspect-video overflow-hidden rounded-xl border border-line bg-bg-elevated transition-colors hover:border-accent/60"
          >
            <img
              src={youtubeThumbnail(s)}
              alt={`${s.artist} — ${s.context}, ${s.date}`}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/10 to-black/10" />

            <span className="absolute left-2 top-2 rounded-full bg-black/50 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-white/90 backdrop-blur-sm">
              {s.views} views
            </span>
            <span className="absolute bottom-2 right-2 rounded bg-black/70 px-1.5 py-0.5 font-mono text-[10px] text-white">
              {s.duration}
            </span>

            <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black/60 backdrop-blur-sm">
                <svg width="14" height="16" viewBox="0 0 14 16" fill="white">
                  <path d="M0 0L14 8L0 16V0Z" />
                </svg>
              </div>
            </div>

            <div className="absolute inset-x-0 bottom-0 px-3 pb-2 pt-8">
              <p className="font-display text-base italic leading-tight text-white">
                {s.artist}
              </p>
              <p className="mt-0.5 truncate font-mono text-[10px] uppercase tracking-[0.08em] text-white/70">
                {s.context} · {s.date}
              </p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
