import { RELEASES } from "@/lib/data";

export default function LabelSection() {
  return (
    <section id="label" className="border-b border-line px-6 py-24 sm:px-10 sm:py-32">
      <div className="mx-auto max-w-[1400px]">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h2 className="font-display text-4xl font-bold uppercase tracking-[-0.02em] text-fg sm:text-5xl">
            Label.
          </h2>
          <a
            href="https://rtsfm.bandcamp.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-xs uppercase tracking-[0.18em] text-fg-dim transition-colors hover:text-accent"
          >
            full catalog on bandcamp →
          </a>
        </div>

        <p className="mt-6 max-w-xl text-sm leading-relaxed text-fg-dim sm:text-base">
          Releases from the RTS.FM roster — {RELEASES.length} records deep,
          RTSFM001 through {RELEASES[0].cat.replace("RTSFM", "")}.
        </p>

        <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
          {RELEASES.map((r) => (
            <a
              key={r.cat}
              href={r.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex aspect-square flex-col justify-between overflow-hidden rounded-xl border border-line bg-bg-elevated transition-colors hover:border-accent/60"
            >
              <img
                src={r.cover}
                alt={`${r.artist} — ${r.cat} cover art`}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/5 to-transparent" />

              <div className="relative flex items-start justify-between p-4 sm:p-5">
                <span className="rounded bg-bg-elevated/80 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-fg backdrop-blur-sm">
                  {r.cat}
                </span>
                <svg
                  className="h-3.5 w-3.5 text-white opacity-0 transition-opacity group-hover:opacity-100"
                  viewBox="0 0 14 14"
                  fill="none"
                >
                  <path
                    d="M3 11L11 3M11 3H4M11 3V10"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className="relative p-4 sm:p-5">
                <p className="font-display text-sm font-bold uppercase leading-tight tracking-[-0.01em] text-white sm:text-base">
                  {r.artist}
                </p>
                {r.title && (
                  <p className="mt-1 text-[11px] text-white/70 sm:text-xs">
                    {r.title}
                  </p>
                )}
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
