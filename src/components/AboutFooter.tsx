import { SITE, SOCIALS } from "@/lib/data";

export default function AboutFooter() {
  return (
    <footer id="about" className="px-6 pb-32 pt-24 sm:px-10 sm:pb-36 sm:pt-32">
      <div className="mx-auto max-w-[1400px]">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <h2 className="font-display text-4xl font-bold uppercase tracking-[-0.02em] text-fg sm:text-5xl">
              About
            </h2>
            <p className="mt-6 max-w-xl text-sm leading-relaxed text-fg-dim sm:text-base">
              Launched in {SITE.founded}, {SITE.name} was one of
              the first internet radio projects built around live
              audio-visual broadcasting — DJ sets streamed straight out of
              underground studios rather than pre-recorded shows. Invite-only
              and non-commercial from day one, it grew into a community of
              artists, listeners and studios spanning multiple cities, plus
              a record label pressing music from the people playing on air.
            </p>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-fg-dim sm:text-base">
              Tech house, minimal house, minimal techno, electronica — no
              genre gatekeeping beyond that. If it moves a room after
              midnight, it belongs here.
            </p>
          </div>

          <div className="flex flex-col justify-between">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-fg-dim">
                connect
              </p>
              <div className="mt-5 flex flex-col divide-y divide-line border-t border-line">
                {SOCIALS.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between py-3 font-display text-lg font-bold uppercase tracking-[-0.01em] text-fg transition-colors hover:text-accent"
                  >
                    {s.label}
                    <span className="font-mono text-xs normal-case tracking-[0.1em] text-fg-dim transition-colors group-hover:text-accent">
                      ↗
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-20 flex flex-col gap-4 border-t border-line pt-6 font-mono text-[11px] uppercase tracking-[0.14em] text-fg-dim sm:flex-row sm:items-center sm:justify-between">
          <span>
            © {SITE.founded}—{new Date().getFullYear()} {SITE.name} — online underground radio
          </span>
          <span>est. {SITE.founded} · worldwide</span>
        </div>
      </div>
    </footer>
  );
}
