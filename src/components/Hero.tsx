import CursorWaveform from "./CursorWaveform";
import EqualizerLogo from "./EqualizerLogo";
import { SITE, STATS } from "@/lib/data";

export default function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-dvh flex-col overflow-hidden pt-28"
      style={{
        backgroundImage:
          "linear-gradient(180deg, rgba(216,218,222,0.85) 0%, rgba(216,218,222,0.45) 16%, rgba(216,218,222,0) 40%), radial-gradient(46% 52% at 40% 50%, rgba(224,74,63,0.4) 0%, rgba(224,74,63,0.15) 42%, rgba(224,74,63,0) 76%), radial-gradient(65% 60% at 80% 6%, rgba(255,255,255,0.4) 0%, transparent 60%), radial-gradient(55% 60% at 6% 2%, rgba(110,114,121,0.5) 0%, transparent 65%), linear-gradient(180deg, var(--ink) 0%, var(--bg) 100%)",
      }}
    >
      <CursorWaveform />

      <EqualizerLogo className="pointer-events-none absolute bottom-16 left-1/2 w-[140vw] max-w-none -translate-x-1/2 opacity-[0.16] mix-blend-luminosity sm:hidden" />

      <span className="crosshair left-6 top-24 hidden sm:block sm:left-10" />
      <span className="crosshair right-6 top-24 hidden sm:block sm:right-10" />
      <span className="crosshair bottom-16 left-6 hidden sm:block sm:left-10" />
      <span className="crosshair bottom-16 right-6 hidden sm:block sm:right-10" />

      <div className="relative z-10 mx-auto flex w-full max-w-[1400px] flex-1 flex-col justify-center px-6 sm:px-10">
        <div className="flex items-baseline gap-3 font-mono text-xs uppercase tracking-[0.2em] text-fg-dim">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          est. {SITE.founded}
        </div>

        <h1 className="mt-6 select-none font-headline text-[clamp(3.5rem,16vw,5rem)] leading-[0.85] text-fg sm:text-[13vw] md:text-[130px] lg:text-[165px]">
          RTS.FM
        </h1>

        <div className="mt-8 flex max-w-xl flex-col gap-4 sm:mt-10">
          <p className="max-w-[240px] font-display text-lg font-bold uppercase leading-tight tracking-[-0.02em] text-fg sm:max-w-none sm:text-2xl">
            {SITE.tagline}.
          </p>
          <p className="text-sm leading-relaxed text-fg sm:text-base">
            Independent internet radio and record label broadcasting live
            audio-visual DJ sets from underground studios around the world
            since {SITE.founded} — invite-only, non-commercial, artist-run.
          </p>
        </div>

        <div
          className="no-scrollbar mt-8 flex snap-x gap-2 overflow-x-auto overscroll-x-contain sm:mt-10 sm:flex-wrap sm:overflow-visible sm:[mask-image:none]"
          style={{
            WebkitMaskImage:
              "linear-gradient(to right, black 80%, transparent 100%)",
            maskImage:
              "linear-gradient(to right, black 80%, transparent 100%)",
          }}
        >
          {STATS.map((s) => (
            <span
              key={s}
              className="shrink-0 snap-start whitespace-nowrap rounded-full border border-line px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-fg-dim"
            >
              {s}
            </span>
          ))}
        </div>
      </div>

      <div
        className="relative z-10 mx-auto flex w-full max-w-[1400px] items-end justify-between px-6 sm:px-10"
        style={{ paddingBottom: "calc(64px + env(safe-area-inset-bottom))" }}
      >
        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-fg-dim">
          live from studios worldwide
        </span>
        <a
          href="#radio"
          aria-label="Scroll to radio section"
          className="animate-bob text-accent"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M4 8L10 14L16 8"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </a>
      </div>

      <div className="h-[3px] w-full bg-accent" />
    </section>
  );
}
