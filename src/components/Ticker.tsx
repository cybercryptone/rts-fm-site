import { CITIES } from "@/lib/data";

const ITEMS = CITIES;

export default function Ticker() {
  const track = [...ITEMS, ...ITEMS];

  return (
    <div className="overflow-hidden border-y border-line bg-bg-elevated py-3">
      <div className="animate-marquee flex w-max gap-8 font-mono text-xs uppercase tracking-[0.2em] text-fg-dim">
        {[...track, ...track].map((item, i) => (
          <span key={i} className="flex items-center gap-8">
            {item}
            <span className="text-accent">◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}
