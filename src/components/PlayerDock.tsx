export default function PlayerDock() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 px-3 pb-3 sm:px-6 sm:pb-4">
      <div className="glass-dark mx-auto flex max-w-[1400px] items-center gap-3 rounded-xl px-3 py-2.5 sm:gap-4 sm:px-5 sm:py-3">
        <button
          type="button"
          disabled
          aria-label="Play stream (coming soon)"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-accent/60 text-accent"
        >
          <svg width="10" height="11" viewBox="0 0 10 11" fill="currentColor">
            <path d="M0 0L10 5.5L0 11V0Z" />
          </svg>
        </button>

        <div className="flex items-end gap-[2px]" aria-hidden="true">
          {[0.35, 0.9, 0.5, 0.7, 0.4].map((d, i) => (
            <span
              key={i}
              className="eq-bar w-[2px] rounded-full bg-accent/80"
              style={{ height: "16px", animationDelay: `${i * 0.12}s` }}
            />
          ))}
        </div>

        <p className="min-w-0 truncate font-mono text-[11px] uppercase tracking-[0.12em] text-white/70 sm:text-xs">
          <span className="text-white">RTS.FM Live</span>
          <span className="hidden sm:inline"> — stream launching soon</span>
        </p>

        <span className="ml-auto hidden font-mono text-[11px] tabular-nums text-white/40 sm:block">
          --:--
        </span>

        <a
          href="https://t.me/rtsfm"
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 rounded-full border border-white/15 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-white transition-colors hover:border-accent hover:text-accent sm:text-[11px]"
        >
          notify me
        </a>
      </div>
    </div>
  );
}
