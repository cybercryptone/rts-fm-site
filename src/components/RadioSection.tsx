import { CITIES } from "@/lib/data";
import SetsArchive from "./SetsArchive";

export default function RadioSection() {
  return (
    <section id="radio" className="border-b border-line px-6 py-24 sm:px-10 sm:py-32">
      <div className="mx-auto max-w-[1400px]">
        <div className="flex items-end justify-between gap-6">
          <h2 className="font-display text-4xl italic text-fg sm:text-5xl">
            Radio.
          </h2>
          <span className="hidden font-mono text-xs uppercase tracking-[0.18em] text-fg-dim sm:block">
            01 / on air
          </span>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-[1.1fr_1fr]">
          {/* player card — dark smoked glass, this is the actual audio HUD */}
          <div className="glass-dark relative flex flex-col justify-between rounded-2xl p-8 sm:p-10">
            <span className="crosshair -left-[6px] -top-[6px]" />
            <span className="crosshair -right-[6px] -top-[6px]" />
            <span className="crosshair -bottom-[6px] -left-[6px]" />
            <span className="crosshair -bottom-[6px] -right-[6px]" />

            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-white/60">
                <span className="h-1.5 w-1.5 rounded-full bg-white/50" />
                stream launching soon
              </span>
              <div className="flex items-end gap-[3px]" aria-hidden="true">
                {[0.4, 1, 0.6, 0.85, 0.5].map((d, i) => (
                  <span
                    key={i}
                    className="eq-bar h-6 w-[3px] rounded-full bg-accent/80"
                    style={{ animationDelay: `${i * 0.12}s` }}
                  />
                ))}
              </div>
            </div>

            <div className="mt-10 flex items-center gap-6">
              <button
                type="button"
                disabled
                aria-label="Play stream (coming soon)"
                className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-accent/60 text-accent"
              >
                <svg width="20" height="22" viewBox="0 0 20 22" fill="currentColor">
                  <path d="M0 0L20 11L0 22V0Z" />
                </svg>
              </button>
              <div>
                <p className="font-display text-xl italic text-white">
                  RTS.FM Live
                </p>
                <p className="mt-1 text-sm text-white/60">
                  Real-time broadcast link is on its way — follow Telegram
                  for launch alerts and set times.
                </p>
              </div>
            </div>

            <a
              href="https://t.me/rtsfm"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-10 inline-flex w-fit items-center gap-2 rounded-full border border-white/15 px-4 py-2 font-mono text-xs uppercase tracking-[0.14em] text-white transition-colors hover:border-accent hover:text-accent"
            >
              get notified on telegram →
            </a>
          </div>

          {/* studios */}
          <div className="rounded-2xl border border-line p-8 sm:p-10">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-fg-dim">
              broadcasting from
            </p>
            <ul className="mt-6 flex flex-col divide-y divide-line">
              {CITIES.map((s) => (
                <li
                  key={s}
                  className="flex items-center justify-between py-3 font-display text-lg italic text-fg"
                >
                  {s}
                  <span className="font-mono text-[11px] not-italic text-fg-dim">
                    studio
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <SetsArchive />
      </div>
    </section>
  );
}
