import { CITIES } from "@/lib/data";
import SetsArchive from "./SetsArchive";
import PlayerCard from "./PlayerCard";

export default function RadioSection() {
  return (
    <section id="radio" className="border-b border-line px-6 py-24 sm:px-10 sm:py-32">
      <div className="mx-auto max-w-[1400px]">
        <div className="flex items-end justify-between gap-6">
          <h2 className="font-display text-4xl font-bold uppercase tracking-[-0.02em] text-fg sm:text-5xl">
            Radio
          </h2>
          <span className="hidden font-mono text-xs uppercase tracking-[0.18em] text-fg-dim sm:block">
            01 / on air
          </span>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
          <div className="relative h-full">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -inset-12 -z-10 rounded-[48px] opacity-80 blur-3xl"
              style={{
                background:
                  "radial-gradient(55% 55% at 25% 15%, rgba(255,80,0,0.55) 0%, transparent 70%), radial-gradient(50% 50% at 85% 85%, rgba(224,74,63,0.45) 0%, transparent 70%)",
              }}
            />
            <PlayerCard />
          </div>

          {/* studios */}
          <div className="rounded-2xl border border-line p-8 sm:p-10">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-fg-dim">
              broadcasting from
            </p>
            <ul className="mt-8 flex flex-col divide-y divide-line">
              {CITIES.map((s) => (
                <li
                  key={s}
                  className="flex items-center justify-between py-5 font-display text-lg font-bold uppercase tracking-[-0.02em] text-fg"
                >
                  {s}
                  <span className="font-mono text-[11px] normal-case tracking-[0.14em] text-fg-dim">
                    studio
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-fg-dim">
            also on
          </p>
          {[
            {
              label: "Apple Podcasts",
              href: "https://podcasts.apple.com/us/podcast/rts-fm-radio/id1586958635",
            },
            { label: "SoundCloud", href: "https://soundcloud.com/rtsfm" },
          ].map((p) => (
            <a
              key={p.label}
              href={p.href}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-line px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-fg-dim transition-colors hover:border-accent hover:text-accent"
            >
              {p.label} ↗
            </a>
          ))}
        </div>

        <SetsArchive />
      </div>
    </section>
  );
}
